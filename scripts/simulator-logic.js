"use strict";

var MechSimulatorLogic = MechSimulatorLogic || (function () {
  var simulationInterval = null;
  var simRunning = false;
  var simTime = 0;
  var simulatorParameters;
  var weaponFireQueue = [];

  const stepDuration = 50; //simulation tick length in ms

  //interval between UI updates. Set smaller than step duration to run the
  // simulation faster, but not too small as to lock the browser
  const DEFAULT_UI_UPDATE_INTERVAL = 50;

  //Interval when ghost heat applies for weapons. 500ms
  const ghostHeatInterval = 500;

  //Parameters of the simulation. Includes range
  class SimulatorParameters {
    constructor(range, speedFactor = 1) {
      this.range = range;
      this.uiUpdateInterval = Math.floor(DEFAULT_UI_UPDATE_INTERVAL / Number(speedFactor));
    }
    setSpeedFactor(speedFactor) {
      this.uiUpdateInterval = Math.floor(DEFAULT_UI_UPDATE_INTERVAL / Number(speedFactor));
    }
  }

  //Represents damage currently being done by a weapon. This gets put in the
  //  weaponFireQueue every time a weapon is fired and its values
  //  (durationLeft or travelLeft as the case may be) are updated every step
  //  by processWeaponFires().
  //When the damage is completed, it is taken off the queue and its total
  //  damage done is added to the sourceMech's stats
  class WeaponFire {
    constructor(sourceMech, targetMech, weaponState, range, createTime) {
      this.sourceMech = sourceMech;
      this.targetMech = targetMech;
      this.weaponState = weaponState;
      this.weaponDamage = null; //full weapon damage
      this.tickWeaponDamage = null; //WeaponDamage done per tick for duration weapons
      this.range = range;
      this.createTime = createTime;
      this.damageDone = new MechModel.MechDamage();
      let weaponInfo = weaponState.weaponInfo;

      this.totalDuration = weaponInfo.hasDuration() ?
          Number(weaponInfo.duration) : 0;
      this.totalTravel = weaponInfo.hasTravelTime() ?
          Number(range) / Number(weaponInfo.speed) * 1000 : 0; //travel time in milliseconds

      this.durationLeft = this.totalDuration;
      this.travelLeft = this.totalTravel;

      this.initComputedValues(range);
    }

    initComputedValues(range) {
      let targetComponent = this.sourceMech.componentTargetPattern(this.sourceMech, this.targetMech);
      //baseWeaponDamage applies all damage to the target component
      let baseWeaponDamageMap = {};
      baseWeaponDamageMap[targetComponent] = this.weaponState.weaponInfo.damageAtRange(range, stepDuration);
      let baseWeaponDamage = new MechModel.WeaponDamage(baseWeaponDamageMap);
      let weaponInfo = this.weaponState.weaponInfo;
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
    MechModelView.updateSimTime(simTime);
    //TODO: debug
    MechModelView.updateDebugText("");
  }

  //Simulation step function. Called every tick
  var step = function() {
    let teams = [MechModel.Team.BLUE, MechModel.Team.RED];

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
              mechState.updateTypes[MechModel.UpdateType.STATS] = true;
            }
            if (targetMech) {
              fireWeapons(mech, weaponsToFire, targetMech);
            } else {
              console.log("No target mech for " + mech.getMechId());
            }
          }
        }
        MechModelView.updateMech(mech);
      }
      MechModelView.updateTeamStats(team);
    }

    simTime += stepDuration;
    MechModelView.updateSimTime(simTime);

    updateUIWeaponFires();

    //TODO: Debug
    if (!MechModel.isTeamAlive(MechModel.Team.BLUE)) {
      MechModelView.updateDebugText("RED TEAM WINS!");
      pauseSimulation();
    }
    if (!MechModel.isTeamAlive(MechModel.Team.RED)) {
      MechModelView.updateDebugText("BLUE TEAM WINS!");
      pauseSimulation();
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

      //if not ready to fire, proceed to next weapon
      if (!weaponState.active
          || !(weaponState.weaponCycle === MechModel.WeaponCycle.READY)) {
        continue;
      }
      //if no ammo, proceed to next weapon
      if (weaponInfo.requiresAmmo() &&
        mechState.ammoState.ammoCountForWeapon(weaponInfo.weaponId) <= 0) {
        continue;
      }

      if (weaponInfo.spinup > 0) {
        //if weapon has spoolup, set state to SPOOLING and set value of spoolupLeft
        weaponState.gotoState(MechModel.WeaponCycle.SPOOLING);
        //Note: Do NOT add WeaponFire to queue, it will be handled by processCooldowns
      } else if (weaponInfo.duration > 0) {
        //if weapon has duration, set state to FIRING
        weaponState.gotoState(MechModel.WeaponCycle.FIRING);
        weaponsFired.push(weaponState);
        queueWeaponFire(mech, targetMech, weaponState);
      } else {
        //if weapon has no duration, set state to FIRING, will go to cooldown on the next step
        weaponState.gotoState(MechModel.WeaponCycle.FIRING,);
        weaponsFired.push(weaponState);
        let ammoConsumed = 0;
        if (weaponInfo.requiresAmmo()) {
          ammoConsumed = mechState.ammoState.consumeAmmo(weaponInfo.weaponId,
                                                        weaponInfo.ammoPerShot);
        }
        queueWeaponFire(mech, targetMech, weaponState);
      }

      mechState.updateTypes[MechModel.UpdateType.COOLDOWN] = true;
      mechState.updateTypes[MechModel.UpdateType.WEAPONSTATE] = true;
    }

    //update mech heat
    let totalHeat = computeHeat(mech, weaponsFired);
    if (totalHeat > 0) {
      mechState.heatState.currHeat += Number(totalHeat);
      mechState.updateTypes[MechModel.UpdateType.HEAT] = true;
      let mechStats = mechState.mechStats;
      mechStats.totalHeat += Number(totalHeat);
    }
  }

  var queueWeaponFire = function(sourceMech, targetMech, weaponState) {
    let range = simulatorParameters.range;
    let weaponFire = new WeaponFire(sourceMech, targetMech, weaponState, range, simTime);
    weaponFireQueue.push(weaponFire);
  }

  var updateUIWeaponFires = function() {
    // let debugText = "";
    // for (let weaponFire of weaponFireQueue) {
    //   debugText += weaponFire.toString() + "<br/><br/>";
    // }
    // MechModelView.updateDebugText(debugText);
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
      mechState.updateTypes[MechModel.UpdateType.HEAT] = true;
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
          mechState.updateTypes[MechModel.UpdateType.WEAPONSTATE] = true;
          queueWeaponFire(mech, targetMech, weaponState);
        }
        mechState.updateTypes[MechModel.UpdateType.COOLDOWN] = true;
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.FIRING) {
      //if weapon is firing, reduce durationLeft. if durationLeft <=0, change state to COOLDOWN
        let newDurationLeft = Number(weaponState.durationLeft) - stepDuration;
        weaponState.durationLeft = Math.max(newDurationLeft, 0);
        if (weaponState.durationLeft <= 0) {
          weaponState.gotoState(MechModel.WeaponCycle.COOLDOWN);
          //if duration ended in the middle of the tick, subtract the
          //extra time from the cooldown
          weaponState.cooldownLeft +=  newDurationLeft;
          mechState.updateTypes[MechModel.UpdateType.WEAPONSTATE] = true;
        }
        mechState.updateTypes[MechModel.UpdateType.COOLDOWN] = true;
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
      //if weapon is on cooldown, reduce cooldownLeft.
      //if cooldownLeft <=0, change state to ready
        let newCooldownLeft = Number(weaponState.cooldownLeft) - stepDuration;
        weaponState.cooldownLeft = Math.max(newCooldownLeft, 0);
        if (weaponState.cooldownLeft <= 0) {
          weaponState.gotoState(MechModel.WeaponCycle.READY);
          mechState.updateTypes[MechModel.UpdateType.WEAPONSTATE] = true;
        }
        mechState.updateTypes[MechModel.UpdateType.COOLDOWN] = true;
      }
    }
    let totalHeat = computeHeat(mech, weaponsFired);
    if (totalHeat > 0) {
      mechState.heatState.currHeat += Number(totalHeat);
      mechState.updateTypes[MechModel.UpdateType.HEAT] = true;
      let mechStats = mechState.mechStats;
      mechStats.totalHeat += Number(totalHeat);
    }
  }

  var processWeaponFires = function() {
    //reduce durationLeft/travelLeft, deal damage as necessary
    if (weaponFireQueue.length == 0) {
      return;
    }
    //Go through each entry in the current queue. Need to keep the start length
    //because the operations below dequeue the first element and requeue it
    //to the end of the queue if it still has duration/travelTime left
    let startQueueLength = weaponFireQueue.length;
    for (let count = 0; count < startQueueLength; count++) {
      let weaponFire = weaponFireQueue.shift();
      let weaponInfo = weaponFire.weaponState.weaponInfo;
      let targetMech = weaponFire.targetMech;
      let targetMechState = weaponFire.targetMech.getMechState();
      if (weaponInfo.hasDuration()) {
        weaponFire.durationLeft = Number(weaponFire.durationLeft) - stepDuration;
        if (weaponFire.weaponState.active) {
          let tickDamageDone;
          if (weaponFire.durationLeft <=0) {
            let lastTickDamage = weaponFire.tickWeaponDamage.clone();
            let damageFraction = (stepDuration + weaponFire.durationLeft) / stepDuration;
            lastTickDamage.multiply(damageFraction);
            tickDamageDone = targetMechState.takeDamage(lastTickDamage);
            weaponFire.damageDone.add(tickDamageDone);
            //Add weaponFire.damageDone to mech stats
            logDamage(weaponFire);
          } else {
            tickDamageDone = targetMechState.takeDamage(weaponFire.tickWeaponDamage);
            weaponFire.damageDone.add(tickDamageDone)
            //requeue with reduced durationLeft
            weaponFireQueue.push(weaponFire);
          }
          targetMech.getMechState().updateTypes[MechModel.UpdateType.HEALTH] = true;
        } else {
          //Weapon disabled before end of burn
          //add weaponFire.damageDone to mech stats
          logDamage(weaponFire);
        }
      } else if (weaponInfo.hasTravelTime()) {
        weaponFire.travelLeft = Number(weaponFire.travelLeft) - stepDuration;
        if (weaponFire.travelLeft <= 0) {
          let damageDone = targetMechState.takeDamage(weaponFire.weaponDamage);
          weaponFire.damageDone.add(damageDone);
          targetMech.getMechState().updateTypes[MechModel.UpdateType.HEALTH] = true;
          //add weaponFire.damageDone to mechStats
          logDamage(weaponFire);
        } else {
          weaponFireQueue.push(weaponFire);
        }
      } else {
        //should not happen
        throw "Unexpected WeaponFire type";
      }
    }
  }

  var logDamage = function(weaponFire) {
    let weaponInfo = weaponFire.weaponState.weaponInfo;
    let mechState = weaponFire.sourceMech.getMechState();
    let mechStats = mechState.mechStats;
    mechStats.totalDamage += weaponFire.damageDone.totalDamage();
    mechStats.weaponFires.push(weaponFire);

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
      totalHeat += Number(weaponState.computeHeat(mech)); // base heat
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

    let ghostHeatEntry = new GhostHeatEntry(simTime, weaponState);
    ghostHeatWeapons.push(ghostHeatEntry);

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
      ret = ret + Number(weaponState.computeHeat(mech));
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
