"use strict";
//TODO: Start splitting things off from this file, it's getting too long
//Candidates:
//  move WeaponFire and weaponFire processing logic to separate file
//  move SimulatorParameters to separate file
var MechSimulatorLogic = MechSimulatorLogic || (function () {
  var simulationInterval = null;
  var simRunning = false;
  var simTime = 0;
  var simulatorParameters;
  var weaponFireQueue = [];
  var willUpdateTeamStats = {};  //Format: {<team> : boolean}

  const stepDuration = 50; //simulation tick length in ms

  //interval between UI updates. Set smaller than step duration to run the
  // simulation faster, but not too small as to lock the browser
  const DEFAULT_UI_UPDATE_INTERVAL = 50;

  //Interval when ghost heat applies for weapons. 500ms
  const ghostHeatInterval = 500;

  const UACJamMethod = {
    RANDOM : "random",
    EXPECTED_VALUE : "expected_value",
  };

  //Parameters of the simulation. Includes range
  class SimulatorParameters {
    constructor(range, speedFactor = 1,
          uacJamMethod = UACJamMethod.RANDOM,
          useDoubleTap = true) {
      this.range = range;
      this.uiUpdateInterval = Math.floor(DEFAULT_UI_UPDATE_INTERVAL / Number(speedFactor));
      this.uacJAMMethod = uacJamMethod;
      this.useDoubleTap = useDoubleTap;
    }
    setSpeedFactor(speedFactor) {
      this.uiUpdateInterval = Math.floor(DEFAULT_UI_UPDATE_INTERVAL / Number(speedFactor));
    }
    //returns setting values and descriptions for the UI
    //returns
    //[{
    //  property: <propertyName>
    //  name: <readable name>
    //  values: [{
    //    id: <id>, must be unique
    //    name: <display name>
    //    value: <setting value>
    //    description: <long description of value>
    //    default : boolean
    //  }, ...]
    //}, ...]
    //TODO: This could potentially get too long. Find a more modular way of
    //defining property values
    getSettings() {
      return [
        {
          property: "useDoubleTap",
          name: "Use UAC Double Tap",
          values: [
            {
              id: "enable",
              name: "Enabled",
              value: true,
              description: "Allows use of UAC double taps",
              default: true,
            },
            {
              id: "disable",
              name: "Disabled",
              value: false,
              description: "Disallows use of UAC double taps",
              default: false,
            },
          ],
        },
      ];
    }
  }

  //Represents damage currently being done by a weapon. This gets put in the
  //  weaponFireQueue every time a weapon is fired and its values
  //  (durationLeft or travelLeft as the case may be) are updated every step
  //  by processWeaponFires().
  //When the damage is completed, it is taken off the queue and its total
  //  damage done is added to the sourceMech's stats
  class WeaponFire {
    constructor(sourceMech, targetMech, weaponState, range, createTime, ammoConsumed) {
      this.sourceMech = sourceMech;
      this.targetMech = targetMech;
      this.weaponState = weaponState;
      this.weaponDamage = null; //full weapon damage
      this.tickWeaponDamage = null; //WeaponDamage done per tick for duration weapons
      this.range = range;
      this.createTime = createTime;
      this.damageDone = new MechModel.MechDamage();
      this.ammoConsumed = ammoConsumed;
      let weaponInfo = weaponState.weaponInfo;

      this.totalDuration = weaponInfo.hasDuration() ?
          Number(weaponInfo.duration) : 0;
      this.totalTravel = weaponInfo.hasTravelTime() ?
          Number(range) / Number(weaponInfo.speed) * 1000 : 0; //travel time in milliseconds

      this.durationLeft = this.totalDuration;
      this.travelLeft = this.totalTravel;
      this.complete = false;

      this.initComputedValues(range);
    }

    initComputedValues(range) {
      let targetComponent = this.sourceMech.componentTargetPattern(this.sourceMech, this.targetMech);
      let weaponInfo = this.weaponState.weaponInfo;
      //baseWeaponDamage applies all damage to the target component
      let baseWeaponDamageMap = {};
      let baseDamage = weaponInfo.damageAtRange(range, stepDuration);
      if (weaponInfo.requiresAmmo()) {
        baseDamage = Number(baseDamage) * this.ammoConsumed / weaponInfo.ammoPerShot;
      }
      baseWeaponDamageMap[targetComponent] = baseDamage;
      let baseWeaponDamage = new MechModel.WeaponDamage(baseWeaponDamageMap);

      let weaponAccuracyPattern =
          MechAccuracyPattern.getWeaponAccuracyPattern(weaponInfo);
      if (weaponAccuracyPattern) {
        let transformedWeaponDamage = weaponAccuracyPattern(baseWeaponDamage, range);
        baseWeaponDamage = transformedWeaponDamage;
      }
      //transform the baseWeaponDamage using the mech's accuracy pattern
      let transformedWeaponDamage = this.sourceMech.accuracyPattern(baseWeaponDamage, range);
      this.weaponDamage = transformedWeaponDamage;

      if (this.totalDuration >0) {
        let tickDamageMap = {};
        for (let component in this.weaponDamage.damageMap) {
          tickDamageMap[component] = Number(this.weaponDamage.getDamage(component)) / Number(this.totalDuration) * Number(stepDuration);
        }
        this.tickWeaponDamage = new MechModel.WeaponDamage(tickDamageMap);
      } else {
        this.tickWeaponDamage = this.weaponDamage.clone();
      }
    }

    isComplete() {
      return this.complete;
    }

    step(stepDuration) {
      let weaponInfo = this.weaponState.weaponInfo;
      let sourceMechState = this.sourceMech.getMechState();
      let targetMechState = this.targetMech.getMechState();
      if (weaponInfo.hasDuration()) {
        this.durationLeft = Number(this.durationLeft) - stepDuration;
        if (this.weaponState.active && sourceMechState.isAlive()) {
          let tickDamageDone;
          if (this.durationLeft <=0) {
            let lastTickDamage = this.tickWeaponDamage.clone();
            let damageFraction = (stepDuration + this.durationLeft) / stepDuration;
            lastTickDamage.multiply(damageFraction);
            tickDamageDone = targetMechState.takeDamage(lastTickDamage);
            this.damageDone.add(tickDamageDone);
            this.complete = true;
          } else {
            tickDamageDone = targetMechState.takeDamage(this.tickWeaponDamage);
            this.damageDone.add(tickDamageDone)
          }
          targetMechState.setUpdate(MechModel.UpdateType.HEALTH);
        } else {
          //Weapon disabled before end of burn
          //add weaponFire.damageDone to mech stats
          this.complete = true;
        }
      } else if (weaponInfo.hasTravelTime()) {
        this.travelLeft = Number(this.travelLeft) - stepDuration;
        if (this.travelLeft <= 0) {
          let damageDone = targetMechState.takeDamage(this.weaponDamage);
          this.damageDone.add(damageDone);
          targetMechState.setUpdate(MechModel.UpdateType.HEALTH);
          //add weaponFire.damageDone to mechStats
          this.complete = true;
        } else {
          //still has travel time
        }
      } else {
        //should not happen
        throw "Unexpected WeaponFire type";
      }
    }

    toString() {
      let weaponInfo = this.weaponState.weaponInfo;
      return "WeaponFire" +
          " createTime: " + this.createTime +
          (weaponInfo.hasDuration() ? " durationLeft : " + this.durationLeft : "") +
          (weaponInfo.hasTravelTime() ? " travelLeft: " + this.travelLeft : "") +
          " source: " + this.sourceMech.getMechInfo().mechTranslatedName +
          " target: " + this.targetMech.getMechInfo().mechTranslatedName +
          " weapon: " + this.weaponState.weaponInfo.name +
          " weaponDamage: " + this.weaponDamage.toString() +
          " tickWeaponDamage: " + this.tickWeaponDamage.toString() +
          " damageDone: " + this.damageDone.toString();
    }
  }

  var setSimulatorParameters = function(parameters) {
    simulatorParameters = parameters;
    //refresh simulationInterval if it is already present
    if (simulationInterval) {
      window.clearInterval(simulationInterval);
      createSimulationInterval.call(this);
    }
  }

  var getSimulatorParameters = function() {
    return simulatorParameters;
  }

  var createSimulationInterval = function() {
    var IntervalHandler = function(context) {
      this.context = context;
      return () => {
        if (simRunning) {
          this.context.step();
        }
      }
    };
    let intervalHandler = new IntervalHandler(this);
    simulationInterval = window.setInterval(intervalHandler,
                                        simulatorParameters.uiUpdateInterval);
  }

  var runSimulation = function() {
    if (!simulationInterval) {
      createSimulationInterval.call(this);
    }
    simRunning = true;
  }

  var pauseSimulation = function() {
    simRunning = false;
  }

  var stepSimulation = function() {
    pauseSimulation();
    step();
  }

  var resetSimulation = function() {
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
  }

  //Simulation step function. Called every tick
  var step = function() {
    let teams = [MechModel.Team.BLUE, MechModel.Team.RED];
    willUpdateTeamStats = {};
    processWeaponFires();

    for (let team of teams) {
      for (let mech of MechModel.mechTeams[team]) {
        let mechState = mech.getMechState();
        if (mechState.isAlive()) {
          dissipateHeat(mech);

          processCooldowns(mech, mech.getTargetMech());

          let weaponsToFire = mech.firePattern(mech, simulatorParameters.range);
          if (weaponsToFire) {
            let targetMech = mech.mechTargetPattern(mech, MechModel.mechTeams[enemyTeam(team)]);
            if (targetMech !== mech.getTargetMech()) {
              mech.setTargetMech(targetMech);
              mechState.setUpdate(MechModel.UpdateType.STATS);
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
            mechState.setUpdate(MechModel.UpdateType.STATS);
          }
        }
        MechModelView.updateMech(mech);
      }
      if (willUpdateTeamStats[team]) {
        MechModelView.updateTeamStats(team);
        MechModel.updateModelTeamStats(team);
      }
    }

    simTime += stepDuration;
    MechModelView.updateSimTime(simTime);

    //if one team is dead, stop simulation, compute stats for the current step
    //and inform ModelView of victory
    if (!MechModel.isTeamAlive(MechModel.Team.BLUE) ||
        !MechModel.isTeamAlive(MechModel.Team.RED)) {
      pauseSimulation();
      flushWeaponFireQueue();
      for (let team of teams) {
        MechModelView.updateTeamStats(team);
        MechModel.updateModelTeamStats(team);
      }
      MechModelView.updateVictory(MechModelView.getVictorTeam());
    }

  }

  var enemyTeam = function(myTeam) {
    if (myTeam === MechModel.Team.BLUE) {
      return MechModel.Team.RED;
    } else if (myTeam === MechModel.Team.RED) {
      return MechModel.Team.BLUE;
    }
    throw "Unable to find enemy team";
  }

  //Give a mech and a list of weaponStates
  //(which must be contained in mech.mechState.weaponStateList)
  //fire the weapons (i.e. update mech heat and weapon states)
  var fireWeapons = function(mech, weaponStateList, targetMech) {
    let mechState = mech.getMechState();

    let weaponsFired = []; //list of weapons that were actually fired.
    for (let weaponState of weaponStateList) {
      let weaponInfo = weaponState.weaponInfo;

      let fireStatus = weaponState.fireWeapon();
      if (fireStatus.weaponFired) {
        weaponsFired.push(weaponState);
        queueWeaponFire(mech, targetMech, weaponState, fireStatus.ammoConsumed);
        mechState.setUpdate(MechModel.UpdateType.COOLDOWN);
        mechState.setUpdate(MechModel.UpdateType.WEAPONSTATE);
      }
    }

    //update mech heat
    let totalHeat = computeHeat(mech, weaponsFired);
    if (totalHeat > 0) {
      mechState.heatState.currHeat += Number(totalHeat);
      mechState.setUpdate(MechModel.UpdateType.HEAT);
      let mechStats = mechState.mechStats;
      mechStats.totalHeat += Number(totalHeat);
    }
  }

  var queueWeaponFire = function(sourceMech, targetMech, weaponState, ammoConsumed) {
    let range = simulatorParameters.range;
    let weaponFire = new WeaponFire(sourceMech, targetMech,
                                    weaponState, range,
                                    simTime, ammoConsumed);
    weaponFireQueue.push(weaponFire);
  }

  var dissipateHeat = function(mech) {
    let mechState = mech.getMechState();
    let heatState = mechState.heatState;
    //heat dissipated per step. Divide currHeatDissipation by 1000
    //because it is in heat per second
    let stepHeatDissipation = stepDuration * heatState.currHeatDissipation / 1000;
    let prevHeat = heatState.currHeat;
    heatState.currHeat = Math.max(0, heatState.currHeat - Number(stepHeatDissipation));
    if (heatState.currHeat != prevHeat) {
      mechState.setUpdate(MechModel.UpdateType.HEAT);
    }
  }

  var processCooldowns = function(mech, targetMech) {
    let mechState = mech.getMechState();
    let weaponsFired = [];
    for (let weaponState of mechState.weaponStateList) {
      let weaponInfo = weaponState.weaponInfo;
      if (!weaponState.active) { //if weapon disabled, proceed to next
        continue;
      }

      //if weapon is spooling, reduce spoolleft.
      //if spoolLeft <=0, change state to COOLDOWN
      //(assumes all spoolup weapons have no duration,
      //otherwise next state would be FIRING)
      if (weaponState.weaponCycle === MechModel.WeaponCycle.SPOOLING) {
        let newSpoolLeft = Number(weaponState.spoolupLeft) - stepDuration;
        weaponState.spoolupLeft = Math.max(newSpoolLeft, 0);
        if (weaponState.spoolupLeft <= 0) {
          weaponState.gotoState(MechModel.WeaponCycle.COOLDOWN);
          //if the spooling ended in the middle of the tick, subtract the
          //extra time from the cooldown
          weaponState.cooldownLeft += newSpoolLeft;
          //Consume ammo
          let ammoConsumed = 0;
          if (weaponInfo.requiresAmmo()) {
            ammoConsumed = mechState.ammoState.consumeAmmo(weaponInfo.weaponId,
                                                          weaponInfo.ammoPerShot);
          }
          //collect list of weapons fired, for use in heat computation
          weaponsFired.push(weaponState);
          mechState.setUpdate(MechModel.UpdateType.WEAPONSTATE);
          queueWeaponFire(mech, targetMech, weaponState, ammoConsumed);
        }
        mechState.setUpdate(MechModel.UpdateType.COOLDOWN);
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.FIRING) {
      //if weapon is firing, reduce durationLeft. if durationLeft <=0, change state to COOLDOWN
        let newDurationLeft = Number(weaponState.durationLeft) - stepDuration;
        weaponState.durationLeft = Math.max(newDurationLeft, 0);
        if (weaponState.durationLeft <= 0) {
          weaponState.gotoState(MechModel.WeaponCycle.COOLDOWN);
          //if duration ended in the middle of the tick, subtract the
          //extra time from the cooldown
          weaponState.cooldownLeft +=  newDurationLeft;
          mechState.setUpdate(MechModel.UpdateType.WEAPONSTATE);
        }
        mechState.setUpdate(MechModel.UpdateType.COOLDOWN);
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
      //if weapon is on cooldown, reduce cooldownLeft.
      //if cooldownLeft <=0, change state to ready
        let newCooldownLeft = Number(weaponState.cooldownLeft) - stepDuration;
        weaponState.cooldownLeft = Math.max(newCooldownLeft, 0);
        if (weaponState.cooldownLeft <= 0) {
          weaponState.gotoState(MechModel.WeaponCycle.READY);
          mechState.setUpdate(MechModel.UpdateType.WEAPONSTATE);
        }
        mechState.setUpdate(MechModel.UpdateType.COOLDOWN);
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.JAMMED) {
        let newJamLeft = Number(weaponState.jamLeft) - stepDuration;
        weaponState.jamLeft = Math.max(newJamLeft, 0);
        if (weaponState.jamLeft <= 0) {
          weaponState.gotoState(MechModel.WeaponCycle.COOLDOWN);
          weaponState.cooldownLeft += newJamLeft;
          mechState.setUpdate(MechModel.UpdateType.WEAPONSTATE);
        }
        mechState.setUpdate(MechModel.UpdateType.COOLDOWN);
      }
    }
    let totalHeat = computeHeat(mech, weaponsFired);
    if (totalHeat > 0) {
      mechState.heatState.currHeat += Number(totalHeat);
      mechState.setUpdate(MechModel.UpdateType.HEAT);
      let mechStats = mechState.mechStats;
      mechStats.totalHeat += Number(totalHeat);
    }
  }

  var processWeaponFires = function() {
    if (weaponFireQueue.length == 0) {
      return;
    }
    //Go through each entry in the current queue. Need to keep the start length
    //because the operations below dequeue the first element and requeue it
    //to the end of the queue if it still has duration/travelTime left
    let startQueueLength = weaponFireQueue.length;
    for (let count = 0; count < startQueueLength; count++) {
      let weaponFire = weaponFireQueue.shift();
      weaponFire.step(stepDuration);
      if (weaponFire.isComplete()) {
        logDamage(weaponFire);
      } else {
        weaponFireQueue.push(weaponFire);
      }
    }
  }

  //log damage from any remaining entries in the weapon fire queue. Done when
  //one team dies
  var flushWeaponFireQueue = function() {
    for (let weaponFire of weaponFireQueue) {
      logDamage(weaponFire);
    }
    weaponFireQueue = [];
  }

  var logDamage = function(weaponFire) {
    let weaponInfo = weaponFire.weaponState.weaponInfo;
    let mechState = weaponFire.sourceMech.getMechState();
    let mechStats = mechState.mechStats;
    mechStats.totalDamage += weaponFire.damageDone.totalDamage();
    mechStats.weaponFires.push(weaponFire);
    mechState.setUpdate(MechModel.UpdateType.STATS);
    willUpdateTeamStats[weaponFire.sourceMech.getMechTeam()] = true;
    willUpdateTeamStats[weaponFire.targetMech.getMechTeam()] = true;

    console.log(weaponInfo.name + " completed. Total damage: "
              + weaponFire.damageDone.totalDamage() +
              "(" + weaponFire.damageDone.toString() + ")" +
              " src: " + weaponFire.sourceMech.getName() +
              " dest: " + weaponFire.targetMech.getName());
  }

  var clearMechStats = function() {
    let teams = [MechModel.Team.BLUE, MechModel.Team.RED];
    for (let team of teams) {
      for (let mech of MechModel.mechTeams[team]) {
        mech.getMechState().clearMechStats();
      }
    }
  }

  //Compute the heat caused by firing a set of weapons
  //Ghost heat reference: http://mwomercs.com/forums/topic/127904-heat-scale-the-maths/
  var computeHeat = function (mech, weaponsFired) {
    let totalHeat = 0;

    //sort weaponInfoList in increasing order of heat for ghost heat processing
    var compareHeat = function(weaponInfo1, weaponInfo2) {
      return Number(weaponInfo1.heat) - Number(weaponInfo2.heat);
    }
    weaponsFired.sort(compareHeat);

    for (let weaponState of weaponsFired) {
      let weaponInfo = weaponState.weaponInfo;
      totalHeat += Number(weaponState.computeHeat(mech.getMechState().mechInfo)); // base heat
      let ghostHeat = computeGhostHeat(mech, weaponState);
      totalHeat += ghostHeat;
    }

    return totalHeat;
  }

  class GhostHeatEntry {
    constructor(timeFired, weaponState) {
      this.timeFired = timeFired;
      this.weaponState = weaponState;
    }
  }
  //Calculates the ghost heat incurred by a weapon
  //Note that this method has a side effect: it removes stale GhostHeatEntries
  //and adds a new GhostHeatEntry for the weapon
  var computeGhostHeat = function (mech, weaponState) {
    const HEATMULTIPLIER = [0, 0, 0.08, 0.18, 0.30, 0.45, 0.60, 0.80, 1.10, 1.50, 2.00, 3.00, 5.00];
    let weaponInfo = weaponState.weaponInfo;

    let mechState = mech.getMechState();

    //Get the list of ghost heat weapons of the same heatPenaltyId fired from the mech
    if (!mechState.ghostHeatMap) {
      mechState.ghostHeatMap = {};
    }
    let ghostHeatWeapons = mechState.ghostHeatMap[weaponInfo.heatPenaltyId];
    if (!ghostHeatWeapons) {
      ghostHeatWeapons = [];
      mechState.ghostHeatMap[weaponInfo.heatPenaltyId] = ghostHeatWeapons;
    }
    //Go through the list of ghost heat weapons and remove those that have been
    //fired outside the ghost heat interval
    while (ghostHeatWeapons.length > 0
      && (simTime - ghostHeatWeapons[0].timeFired > ghostHeatInterval)) {
      ghostHeatWeapons.shift();
    }
    //see if any of the remaining entries are from the same weapon. In that case
    //just update the time fired field instead of adding a new entry
    let addNewEntry = true;
    for (let ghostHeatIdx in ghostHeatWeapons) {
      let ghostHeatEntry = ghostHeatWeapons[ghostHeatIdx];
      if (ghostHeatEntry.weaponState === weaponState) {
        //update time, remove from array and put at the end of the queue
        ghostHeatEntry.timeFired = simTime;
        ghostHeatWeapons.splice(ghostHeatIdx, 1);
        ghostHeatWeapons.push(ghostHeatEntry);
        addNewEntry = false;
        break;
      }
    }
    if (addNewEntry) {
      let ghostHeatEntry = new GhostHeatEntry(simTime, weaponState);
      ghostHeatWeapons.push(ghostHeatEntry);
    }

    //calcluate ghost heat
    let ghostHeat = 0;
    if (ghostHeatWeapons.length >= weaponInfo.minHeatPenaltyLevel) {
      ghostHeat = HEATMULTIPLIER[ghostHeatWeapons.length] * Number(weaponInfo.heatPenalty) * Number(weaponInfo.heat);
    }

    return ghostHeat;
  }

  var copyGhostHeatMap = function(ghostHeatMap) {
    if (!ghostHeatMap) {
      return ghostHeatMap;
    }
    let ret = {};
    for (let key in ghostHeatMap) {
      ret[key] = Array.from(ghostHeatMap[key]);
    }
    return ret;
  }

  var getSimTime = function() {
    return simTime;
  }

  //Computes total heat for the set of weapons fired, but restores the
  //ghost heat map to its previous state afterwards
  var predictHeat = function (mech, weaponsFired) {
    let mechState = mech.getMechState();
    let prevGhostHeatMap = mechState.ghostHeatMap;
    mechState.ghostHeatMap = copyGhostHeatMap(prevGhostHeatMap);
    let ret = computeHeat(mech, weaponsFired);
    mechState.ghostHeatMap = prevGhostHeatMap;
    return ret;
  }

  var predictBaseHeat = function (mech, weaponsFired) {
    let ret = 0;
    for (let weaponState of weaponsFired) {
      ret = ret + Number(weaponState.computeHeat(mech.getMechState().mechInfo));
    }
    return ret;
  }

  return {
    SimulatorParameters : SimulatorParameters,
    setSimulatorParameters : setSimulatorParameters,
    getSimulatorParameters : getSimulatorParameters,
    runSimulation : runSimulation,
    pauseSimulation : pauseSimulation,
    resetSimulation : resetSimulation,
    stepSimulation : stepSimulation,
    step : step,
    getSimTime : getSimTime,
    predictHeat : predictHeat,
    predictBaseHeat : predictBaseHeat,
    stepDuration : stepDuration,
  }

})(); //end namespace
