"use strict";

namespace MechSimulatorLogic {
  import UpdateType = MechModelCommon.UpdateType;
  import Team = MechModelCommon.Team;
  import EventType = MechModelCommon.EventType;

  type SimulatorParameters = SimulatorSettings.SimulatorParameters;
  type Mech = MechModel.Mech;
  type WeaponInfo = MechModelWeapons.WeaponInfo;
  type WeaponState = MechModelWeapons.WeaponState;
  type WeaponDamage = MechModel.WeaponDamage;
  type MechDamage = MechModel.MechDamage;
  type DamageMap = MechModel.DamageMap;
  type GhostHeatMap = MechModel.GhostHeatMap;

  export interface MechUpdate extends Events.Event {
    mech : MechModel.Mech;
  }

  export interface TeamStatsUpdate extends Events.Event {
    team : MechModelCommon.Team;
    simTime : number;
  }

  export interface SimTimeUpdate extends Events.Event {
    simTime : number;
  }

  export type TeamVictoryUpdate = Events.Event;
  export type SimulatorStateUpdate = Events.Event;

  var simulationInterval : number = null;
  var simRunning = false;
  var simTime = 0;
  var weaponFireQueue : MechModel.WeaponFire[] = [];
  var willUpdateTeamStats : {[index:string] : boolean} = {};  //Format: {<team> : boolean}

  const simStepDuration = 50; //simulation tick length in ms

  export var getStepDuration = function() : number {
    return simStepDuration;
  }

  //NOTE: In almost all cases this method should be be called instead of
  //SimulatorSettings.setSimulatorParameters. This method resets the timer
  //interval object so any parameter changes to the simulation speed apply
  export var setSimulatorParameters =
      function(parameters : SimulatorSettings.SimulatorParameters) : void {
    SimulatorSettings.setSimulatorParameters(parameters);
    //refresh simulationInterval if it is already present
    if (simulationInterval) {
      window.clearInterval(simulationInterval);
      createSimulationInterval();
    }
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
    let simulatorParameters = SimulatorSettings.getSimulatorParameters();
    simulationInterval = window.setInterval(intervalHandler,
                                        simulatorParameters.uiUpdateInterval);
  }

  export var runSimulation = function() : void {
    if (!simulationInterval) {
      createSimulationInterval();
    }
    simRunning = true;
    MechModelView.getEventQueue().queueEvent({type : EventType.START});
  }

  export var pauseSimulation = function() : void {
    simRunning = false;
    MechModelView.getEventQueue().queueEvent({type: EventType.PAUSE});
  }

  export var stepSimulation = function() : void {
    pauseSimulation();
    step();
  }

  export var resetSimulation = function() : void {
    pauseSimulation();
    if (simulationInterval) {
      window.clearInterval(simulationInterval);
      simulationInterval = null;
    }
    weaponFireQueue = [];
    simTime = 0;
    clearMechStats();
    willUpdateTeamStats = {};
    let update : SimTimeUpdate = {
      type : MechModelCommon.EventType.SIMTIME_UPDATE,
      simTime,
    }
    MechModelView.getEventQueue().queueEvent(update);
    MechAccuracyPattern.reset();
    MechTargetComponent.reset();
    MechFirePattern.reset();
    MechTargetMech.reset();
  }

  //Simulation step function. Called every tick
  export var step = function() : void {
    let teams : Team[] = [Team.BLUE, Team.RED];
    let eventQueue = MechModelView.getEventQueue();
    eventQueue.deferExecution();
    willUpdateTeamStats = {};
    processWeaponFires();

    for (let team of teams) {
      for (let mech of MechModel.getMechTeam(team)) {
        let mechState = mech.getMechState();
        if (mechState.isAlive()) {
          dissipateHeat(mech);

          processCooldowns(mech, mech.getTargetMech());
          let simulatorParameters = SimulatorSettings.getSimulatorParameters();
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
              Util.log("No target mech for " + mech.getMechId());
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
        let mechUpdate : MechUpdate = {
          type: MechModelCommon.EventType.MECH_UPDATE,
          mech,
        }
        eventQueue.queueEvent(mechUpdate)
      }
      if (willUpdateTeamStats[team]) {
        
        let update : TeamStatsUpdate = {
          type : MechModelCommon.EventType.TEAMSTATS_UPDATE,
          team,
          simTime : getSimTime(),
        }
        eventQueue.queueEvent(update);
      }
    }

    simTime += getStepDuration();
    let simTimeUpdate : SimTimeUpdate = {
      type : MechModelCommon.EventType.SIMTIME_UPDATE,
      simTime : getSimTime(),
    }
    eventQueue.queueEvent(simTimeUpdate);

    //if one team is dead, stop simulation, compute stats for the current step
    //and inform ModelView of victory
    if (!MechModel.isTeamAlive(Team.BLUE) ||
        !MechModel.isTeamAlive(Team.RED)) {
      pauseSimulation();
      flushWeaponFireQueue();
      for (let team of teams) {
        let update : TeamStatsUpdate = {
          type : MechModelCommon.EventType.TEAMSTATS_UPDATE,
          team,
          simTime : getSimTime(),
        }
        eventQueue.queueEvent(update);
      }
      let victoryUpdate : TeamVictoryUpdate = {
        type : MechModelCommon.EventType.TEAMVICTORY_UPDATE,
      }
      eventQueue.queueEvent(victoryUpdate);
    }

    eventQueue.executeAllQueued();
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
    let simulatorParameters = SimulatorSettings.getSimulatorParameters();
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

    Util.log(weaponInfo.name + " completed. Total damage: "
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
