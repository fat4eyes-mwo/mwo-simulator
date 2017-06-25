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
  const uiUpdateInterval = 50;

  //Interval when ghost heat applies for weapons. 500ms
  const ghostHeatInterval = 500;

  //Parameters of the simulation. Includes range, fire patterns,
  //accuracy patterns, targetting patterns
  class SimulatorParameters {
    constructor(range) {
      this.range = range;
    }
  }

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
      baseWeaponDamageMap[targetComponent] = this.weaponState.weaponInfo.damageAtRange(range);
      let baseWeaponDamage = new MechModel.WeaponDamage(baseWeaponDamageMap);
      //transform the baseWeaponDamage using the mech's accuracy pattern
      let transformedWeaponDamage = this.sourceMech.accuracyPattern(baseWeaponDamage);
      //TODO: apply weapon specific weapon patterns
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
  }

  var initMechPatterns = function(mechTeam) {
    for (let mech of mechTeam) {
      mech.firePattern = MechFirePattern.alphaAtZeroHeat;
      mech.componentTargetPattern = MechTargetComponent.aimForCenterTorso;
      mech.mechTargetPattern = MechTargetMech.targetMechsInOrder;
      mech.accuracyPattern = MechAccuracyPattern.fullAccuracyPattern;
    }
  }

  var runSimulation = function() {
    if (!simulationInterval) {
      var IntervalHandler = function(context) {
        this.context = context;
        return () => {
          if (simRunning) {
            this.context.step();
          }
        }
      };
      let intervalHandler = new IntervalHandler(this);
      simulationInterval = window.setInterval(intervalHandler, uiUpdateInterval);
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
    MechModelView.updateSimTime(simTime);
  }

  //Simulation step function. Called every tick
  var step = function() {
    let teams = [MechModel.Team.BLUE, MechModel.Team.RED];

    //TODO: process WeaponFireQueue
    processWeaponFires();

    for (let team of teams) {
      for (let mech of MechModel.mechTeams[team]) {
        let mechState = mech.getMechState();
        if (mechState.isAlive()) {
          dissapateHeat(mech);

          processCooldowns(mech);

          let weaponsToFire = mech.firePattern(mech);
          if (weaponsToFire) {
            let targetMech = mech.mechTargetPattern(mech, MechModel.mechTeams[enemyTeam(team)]);
            if (targetMech) {
              fireWeapons(mech, weaponsToFire, targetMech);
            } else {
              console.log("No target mech for " + mech.getMechId());
            }
          }
        }
        MechModelView.updateMech(mech);
      }
    }

    simTime += stepDuration;
    MechModelView.updateSimTime(simTime);


    //debug
    updateUIWeaponFires();

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
        weaponState.gotoState(MechModel.WeaponCycle.SPOOLING, mech);
        //Note: Do NOT add WeaponFire to queue, it will be handled by processCooldowns
      } else if (weaponInfo.duration > 0) {
        //if weapon has duration, set state to FIRING
        weaponState.gotoState(MechModel.WeaponCycle.FIRING, mech);
        weaponsFired.push(weaponState);
        //TODO: add WeaponFire to queue
        queueWeaponFire(mech, targetMech, weaponState);
      } else {
        //if weapon has no duration, set state to COOLDOWN
        weaponState.gotoState(MechModel.WeaponCycle.COOLDOWN, mech);
        weaponsFired.push(weaponState);
        let ammoConsumed = 0;
        if (weaponInfo.requiresAmmo()) {
          ammoConsumed = mechState.ammoState.consumeAmmo(weaponInfo.weaponId,
                                                        weaponInfo.ammoPerShot);
        }
        //TODO: add WeaponFire to queue
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
    }
  }

  var queueWeaponFire = function(sourceMech, targetMech, weaponState) {
    let range = simulatorParameters.range;
    let weaponFire = new WeaponFire(sourceMech, targetMech, weaponState, range, simTime);
    weaponFireQueue.push(weaponFire);
  }

  var updateUIWeaponFires = function() {
    let debugText = "";
    for (let weaponFire of weaponFireQueue) {
      debugText += weaponFire.toString() + "<br/><br/>";
    }
    MechModelView.updateDebugText(debugText);
  }

  var dissapateHeat = function(mech) {
    let mechState = mech.getMechState();
    let heatState = mechState.heatState;
    //heat dissapated per step. Divide currHeatDissapation by 1000
    //because it is in heat per second
    let stepHeatDissapation = stepDuration * heatState.currHeatDissapation / 1000;
    let prevHeat = heatState.currHeat;
    heatState.currHeat = Math.max(0, heatState.currHeat - Number(stepHeatDissapation));
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
        let newSpoolLeft = Number(weaponState.spoolLeft) - stepDuration;
        weaponState.spoolLeft = Math.max(newSpoolLeft, 0);
        if (weaponState.spoolLeft <= 0) {
          weaponState.gotoState(MechModel.WeaponCycle.COOLDOWN, mech);
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
          //TODO: Add WeaponFire to queue
          queueWeaponFire(mech, targetMech, weaponState);
        }
        mechState.updateTypes[MechModel.UpdateType.COOLDOWN] = true;
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.FIRING) {
      //if weapon is firing, reduce durationLeft. if durationLeft <=0, change state to COOLDOWN
        let newDurationLeft = Number(weaponState.durationLeft) - stepDuration;
        weaponState.durationLeft = Math.max(newDurationLeft, 0);
        if (weaponState.durationLeft <= 0) {
          weaponState.gotoState(MechModel.WeaponCycle.COOLDOWN, mech);
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
          weaponState.gotoState(MechModel.WeaponCycle.READY, mech);
          mechState.updateTypes[MechModel.UpdateType.WEAPONSTATE] = true;
        }
        mechState.updateTypes[MechModel.UpdateType.COOLDOWN] = true;
      }
    }
    let totalHeat = computeHeat(mech, weaponsFired);
    if (totalHeat > 0) {
      mechState.heatState.currHeat += Number(totalHeat);
      mechState.updateTypes[MechModel.UpdateType.HEAT] = true;
    }
  }

  var processWeaponFires = function() {
    //TODO: implement
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
        let tickDamageDone;
        if (weaponFire.durationLeft <=0) {
          //TODO: Process last tick damage
          let lastTickDamage = weaponFire.tickWeaponDamage.clone();
          let damageFraction = (stepDuration + weaponFire.durationLeft) / stepDuration;
          lastTickDamage.multiply(damageFraction);
          tickDamageDone = targetMechState.takeDamage(weaponFire.tickWeaponDamage);
          weaponFire.damageDone.add(tickDamageDone);
          //TODO: Add weaponFire.damageDone to mech stats
        } else {
          //TODO: Process tick damage
          tickDamageDone = targetMechState.takeDamage(weaponFire.tickWeaponDamage);
          weaponFire.damageDone.add(tickDamageDone)
          //requeue with reduced durationLeft
          weaponFireQueue.push(weaponFire);
        }
        targetMech.getMechState().updateTypes[MechModel.UpdateType.HEALTH] = true;
      } else if (weaponInfo.hasTravelTime()) {
        weaponFire.travelLeft = Number(weaponFire.travelLeft) - stepDuration;
        if (weaponFire.travelLeft <= 0) {
          let damageDone = targetMechState.takeDamage(weaponFire.weaponDamage);
          weaponFire.damageDone.add(damageDone);
          //TODO: add weaponFire.damageDone to mechStats
          targetMech.getMechState().updateTypes[MechModel.UpdateType.HEALTH] = true;
        } else {
          weaponFireQueue.push(weaponFire);
        }
      } else {
        //should not happen
        throw "Unexpected WeaponFire type";
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
      totalHeat += Number(weaponInfo.heat); // base heat
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

  return {
    SimulatorParameters : SimulatorParameters,
    setSimulatorParameters : setSimulatorParameters,
    initMechPatterns: initMechPatterns,
    runSimulation : runSimulation,
    pauseSimulation : pauseSimulation,
    resetSimulation : resetSimulation,
    stepSimulation : stepSimulation,
    step: step,
    computeHeat: computeHeat,
  }

})(); //end namespace
