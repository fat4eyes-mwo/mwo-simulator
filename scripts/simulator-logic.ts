"use strict";
/// <reference path="common/simulator-model-common.ts" />
/// <reference path="simulator-model.ts" />
/// <reference path="data/user-options.ts" />

//TODO: Start splitting things off from this file, it's getting too long
//Candidates:
//  move WeaponFire and weaponFire processing logic to separate file
//  move SimulatorParameters to separate file
namespace MechSimulatorLogic {
  import UpdateType = MechModelCommon.UpdateType;
  import Team = MechModelCommon.Team;

  type Mech = MechModel.Mech;
  type WeaponInfo = MechModelWeapons.WeaponInfo;
  type WeaponState = MechModelWeapons.WeaponState;
  type WeaponDamage = MechModel.WeaponDamage;
  type MechDamage = MechModel.MechDamage;
  type DamageMap = MechModel.DamageMap;
  type GhostHeatMap = MechModel.GhostHeatMap;

  var simulationInterval : number = null;
  var simRunning = false;
  var simTime = 0;
  var simulatorParameters : SimulatorParameters;
  var weaponFireQueue : MechModel.WeaponFire[] = [];
  var willUpdateTeamStats : {[index:string] : boolean} = {};  //Format: {<team> : boolean}

  const simStepDuration = 50; //simulation tick length in ms

  export var getStepDuration = function() : number {
    return simStepDuration;
  }

  //interval between UI updates. Set smaller than step duration to run the
  // simulation faster, but not too small as to lock the browser
  const DEFAULT_UI_UPDATE_INTERVAL = 50;

  export interface SimParamUserSettings {
    uacJAMMethod : UACJamMethod;
    useDoubleTap : boolean;
  }
  //Parameters of the simulation. Includes range
  export class SimulatorParameters {
    range : number;
    uiUpdateInterval : number;
    uacJAMMethod : UACJamMethod;
    useDoubleTap : boolean;

    constructor(range : number,
          speedFactor = 1,
          uacJamMethod = UACJamMethod.RANDOM,
          useDoubleTap = true) {
      this.range = range;
      this.uiUpdateInterval = Math.floor(DEFAULT_UI_UPDATE_INTERVAL / Number(speedFactor));
      this.uacJAMMethod = uacJamMethod;
      this.useDoubleTap = useDoubleTap;
    }
    setSpeedFactor(speedFactor : number) : void {
      this.uiUpdateInterval = Math.floor(DEFAULT_UI_UPDATE_INTERVAL / Number(speedFactor));
    }

    //returns setting values and descriptions for the UI
    static getUserSettings() : SimUserSetting[] {
      return [
        UAC_DOUBLE_TAP_SETTING,
        UAC_JAM_SETTING
      ];
    }
  }

  export var setSimulatorParameters =
      function(parameters : SimulatorParameters) : void {
    simulatorParameters = parameters;
    //refresh simulationInterval if it is already present
    if (simulationInterval) {
      window.clearInterval(simulationInterval);
      createSimulationInterval();
    }
  }

  export var getSimulatorParameters = function() : SimulatorParameters {
    return simulatorParameters;
  }

  var createSimulationInterval = function() : void  {
    var createIntervalHandler = function() : () => void {
      return () => {
        if (simRunning) {
          MechSimulatorLogic.step();
        }
      }
    };
    let intervalHandler = createIntervalHandler();
    simulationInterval = window.setInterval(intervalHandler,
                                        simulatorParameters.uiUpdateInterval);
  }

  export var runSimulation = function() : void {
    if (!simulationInterval) {
      createSimulationInterval();
    }
    simRunning = true;
  }

  export var pauseSimulation = function() : void {
    simRunning = false;
  }

  export var stepSimulation = function() : void {
    pauseSimulation();
    step();
  }

  export var resetSimulation = function() : void {
    simRunning = false;
    if (simulationInterval) {
      window.clearInterval(simulationInterval);
      simulationInterval = null;
    }
    weaponFireQueue = [];
    simTime = 0;
    clearMechStats();
    willUpdateTeamStats = {};
    MechModelView.updateSimTime(simTime);
    MechAccuracyPattern.reset();
    MechTargetComponent.reset();
    MechFirePattern.reset();
    MechTargetMech.reset();
  }

  //Simulation step function. Called every tick
  export var step = function() : void {
    let teams : Team[] = [Team.BLUE, Team.RED];
    willUpdateTeamStats = {};
    processWeaponFires();

    for (let team of teams) {
      for (let mech of MechModel.getMechTeam(team)) {
        let mechState = mech.getMechState();
        if (mechState.isAlive()) {
          dissipateHeat(mech);

          processCooldowns(mech, mech.getTargetMech());

          let weaponsToFire = mech.firePattern(mech, simulatorParameters.range);
          if (weaponsToFire) {
            let targetMech = mech.mechTargetPattern(mech, MechModel.getMechTeam(enemyTeam(team)));
            if (targetMech !== mech.getTargetMech()) {
              mech.setTargetMech(targetMech);
              mechState.setUpdate(UpdateType.STATS);
            }
            if (targetMech) {
              fireWeapons(mech, weaponsToFire, targetMech);
            } else {
              console.log("No target mech for " + mech.getMechId());
            }
          }
        } else {
          //dead mech, set time of death if it is not already set
          let mechStats = mechState.mechStats;
          if (mechStats.timeOfDeath === null) {
            mechStats.timeOfDeath = simTime;
            mechState.setUpdate(UpdateType.STATS);
          }
        }
        MechModelView.updateMech(mech);
      }
      if (willUpdateTeamStats[team]) {
        MechModelView.updateTeamStats(team);
        MechModel.updateModelTeamStats(team, getSimTime());
      }
    }

    simTime += getStepDuration();
    MechModelView.updateSimTime(simTime);

    //if one team is dead, stop simulation, compute stats for the current step
    //and inform ModelView of victory
    if (!MechModel.isTeamAlive(Team.BLUE) ||
        !MechModel.isTeamAlive(Team.RED)) {
      pauseSimulation();
      flushWeaponFireQueue();
      for (let team of teams) {
        MechModelView.updateTeamStats(team);
        MechModel.updateModelTeamStats(team, getSimTime());
      }
      MechModelView.updateVictory(MechModelView.getVictorTeam());
    }
  }

  var enemyTeam = function(myTeam : Team) : Team {
    if (myTeam === Team.BLUE) {
      return Team.RED;
    } else if (myTeam === Team.RED) {
      return Team.BLUE;
    }
    throw Error("Unable to find enemy team");
  }

  //Give a mech and a list of weaponStates
  //(which must be contained in mech.mechState.weaponStateList)
  //fire the weapons (i.e. update mech heat and weapon states)
  var fireWeapons = function(mech : Mech,
                            weaponStateList : WeaponState[],
                            targetMech : Mech) {
    let mechState = mech.getMechState();

    let weaponsFired : WeaponState[] = []; //list of weapons that were actually fired.
    for (let weaponState of weaponStateList) {
      let weaponInfo = weaponState.weaponInfo;

      let fireStatus = weaponState.fireWeapon();
      if (fireStatus.newState) {
        mechState.setUpdate(UpdateType.WEAPONSTATE);
      }
      if (fireStatus.weaponFired) {
        weaponsFired.push(weaponState);
        queueWeaponFire(mech, targetMech, weaponState, fireStatus.ammoConsumed);
        mechState.setUpdate(UpdateType.COOLDOWN);
      }
    }

    //update mech heat
    let totalHeat = mechState.computeHeat(weaponsFired, getSimTime());
    if (totalHeat > 0) {
      mechState.heatState.currHeat += Number(totalHeat);
      mechState.setUpdate(UpdateType.HEAT);
      let mechStats = mechState.mechStats;
      mechStats.totalHeat += Number(totalHeat);
    }
  }

  var queueWeaponFire = function(sourceMech : Mech,
                                targetMech : Mech,
                                weaponState : WeaponState,
                                ammoConsumed : number)
                                : MechModel.WeaponFire {
    let range = simulatorParameters.range;
    let weaponFire = new MechModel.WeaponFire(sourceMech, targetMech,
                                    weaponState, range,
                                    simTime, ammoConsumed, getStepDuration);
    weaponFireQueue.push(weaponFire);
    return weaponFire;
  }

  var dissipateHeat = function(mech : Mech) : void {
    let mechState = mech.getMechState();
    let heatState = mechState.heatState;
    //heat dissipated per step. Divide currHeatDissipation by 1000
    //because it is in heat per second
    let stepHeatDissipation = getStepDuration() * heatState.currHeatDissipation / 1000;
    let prevHeat = heatState.currHeat;
    heatState.currHeat = Math.max(0, heatState.currHeat - Number(stepHeatDissipation));
    if (heatState.currHeat !== prevHeat) {
      mechState.setUpdate(UpdateType.HEAT);
    }
  }

  var processCooldowns = function(mech : Mech, targetMech : Mech) : void {
    let mechState = mech.getMechState();
    let weaponsFired : WeaponState[] = [];
    for (let weaponState of mechState.weaponStateList) {
      let stepResult = weaponState.step(getStepDuration());
      if (stepResult.weaponFired) {
        weaponsFired.push(weaponState);
        queueWeaponFire(mech, targetMech, weaponState, stepResult.ammoConsumed);
      }
      if (stepResult.newState) {
        mechState.setUpdate(UpdateType.WEAPONSTATE);
      }
      if (stepResult.cooldownChanged) {
        mechState.setUpdate(UpdateType.COOLDOWN);
      }
    }
    let totalHeat : number = mechState.computeHeat(weaponsFired, getSimTime());
    if (totalHeat > 0) {
      mechState.heatState.currHeat += Number(totalHeat);
      mechState.setUpdate(UpdateType.HEAT);
      let mechStats = mechState.mechStats;
      mechStats.totalHeat += Number(totalHeat);
    }
  }

  var processWeaponFires = function() : void {
    if (weaponFireQueue.length === 0) {
      return;
    }
    //Go through each entry in the current queue. Need to keep the start length
    //because the operations below dequeue the first element and requeue it
    //to the end of the queue if it still has duration/travelTime left
    let startQueueLength = weaponFireQueue.length;
    for (let count = 0; count < startQueueLength; count++) {
      let weaponFire = weaponFireQueue.shift();
      weaponFire.step(getStepDuration());
      if (weaponFire.isComplete()) {
        logDamage(weaponFire);
      } else {
        weaponFireQueue.push(weaponFire);
      }
    }
  }

  //log damage from any remaining entries in the weapon fire queue. Done when
  //one team dies
  var flushWeaponFireQueue = function() : void {
    for (let weaponFire of weaponFireQueue) {
      logDamage(weaponFire);
    }
    weaponFireQueue = [];
  }

  //Update mechstats with the completed WeaponFire's damage, and log
  //results to console
  var logDamage = function(weaponFire : MechModel.WeaponFire) : void {
    let weaponInfo = weaponFire.weaponState.weaponInfo;
    let mechState = weaponFire.sourceMech.getMechState();
    let mechStats = mechState.mechStats;
    mechStats.totalDamage += weaponFire.damageDone.totalDamage();
    mechStats.weaponFires.push(weaponFire);
    mechState.setUpdate(UpdateType.STATS);
    willUpdateTeamStats[weaponFire.sourceMech.getMechTeam()] = true;
    willUpdateTeamStats[weaponFire.targetMech.getMechTeam()] = true;

    console.log(weaponInfo.name + " completed. Total damage: "
              + weaponFire.damageDone.totalDamage() +
              "(" + weaponFire.damageDone.toString() + ")" +
              " src: " + weaponFire.sourceMech.getName() +
              " dest: " + weaponFire.targetMech.getName());
  }

  var clearMechStats = function() : void {
    let teams : Team[] = [Team.BLUE, Team.RED];
    for (let team of teams) {
      for (let mech of MechModel.getMechTeam(team)) {
        mech.getMechState().clearMechStats();
      }
    }
  }

  export var getSimTime = function() {
    return simTime;
  }


}
