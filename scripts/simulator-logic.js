
var MechSimulatorLogic = MechSimulatorLogic || (function () {

  //Parameters of the simulation. Includes range, fire patterns,
  //accuracy patterns, targetting patterns
  class SimulatorParameters {
    constructor(range, firePattern, accuracyPattern, targettingPattern) {
      this.range = range;
      this.firePattern = firePattern;
      this.accuracyPattern = accuracyPattern;
      this.targettingPattern = targettingPattern;
    }
  }

  class WeaponFire {
    constructor(sourceMech, targetMech, weaponState, accuracyPattern, range) {
      this.sourceMech = sourceMech;
      this.targetMech = targetMech;
      this.weaponState = weaponState;
      this.accuracyPattern = accuracyPattern;
      this.range = range;
      this.damageDone = new MechModel.MechDamage();
      let weaponInfo = weaponState.weaponInfo;

      this.totalDuration = weaponInfo.hasDuration() ?
          Number(weaponInfo.duration) : 0;
      this.totalTravel = weaponInfo.hasTravelTime() ?
          Number(range) / Number(weaponInfo.speed) * 1000 : 0; //travel time in milliseconds

      this.durationLeft = this.totalDuration;
      this.totalTravel = this.totalTravel;
    }
  }

  var simulationInterval = null;
  var simRunning = false;
  var simTime = 0;
  var simulatorParameters;
  var weaponFireQueue = new Deque();

  const stepDuration = 50; //simulation tick length in ms

  //interval between UI updates. Set smaller than step duration to run the
  // simulation faster, but not too small as to lock the browser
  const uiUpdateInterval = 20;

  var setSimulatorParameters = function(parameters) {
    simulatorParameters = parameters;
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
    simTime = 0;
    MechModelView.updateSimTime(simTime);
  }

  //Simulation step function. Called every tick
  var step = function() {
    let teams = [MechModel.Team.BLUE, MechModel.Team.RED];
    for (let team of teams) {
      for (let mech of MechModel.mechTeams[team]) {
        let mechState = mech.getMechState();

        dissapateHeat(mech);

        processCooldowns(mech);

        let weaponsToFire = simulatorParameters.firePattern(mech);
        if (weaponsToFire) {
          fireWeapons(mech, weaponsToFire);
        }

        //TODO: process WeaponFireQueue

        MechModelView.updateMech(mech);
      }
    }

    simTime += stepDuration;
    MechModelView.updateSimTime(simTime);
  }

  //Give a mech and a list of weaponStates
  //(which must be contained in mech.mechState.weaponStateList)
  //fire the weapons (i.e. update mech heat and weapon states)
  var fireWeapons = function(mech, weaponStateList) {
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
        //TODO: not correct, but is the best place for gauss heat until the
        //correct computation of ghost heat using a time interval is implemented
        weaponsFired.push(weaponState);
        //Note: Do NOT add WeaponFire to queue, it will be handled by processCooldowns
      } else if (weaponInfo.duration > 0) {
        //if weapon has duration, set state to FIRING
        weaponState.gotoState(MechModel.WeaponCycle.FIRING, mech);
        weaponsFired.push(weaponState);
        //TODO: add WeaponFire to queue
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
      }

      mechState.updateTypes[MechModel.UpdateType.COOLDOWN] = true;
      mechState.updateTypes[MechModel.UpdateType.WEAPONSTATE] = true;
    }

    //update mech heat
    //TODO Heat computation is wrong. It's the number of weapons fired within
    //the ghost heat interval, not fired at the exact same time. You need to keep a
    //list of weapons fired within the past 0.5 seconds (length of ghost heat interval)
    //when computing for ghost heat.
    let totalHeat = computeHeat(weaponsFired);
    mechState.heatState.currHeat += Number(totalHeat);
    mechState.updateTypes[MechModel.UpdateType.HEAT] = true;
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

  var processCooldowns = function(mech) {
    let mechState = mech.getMechState();
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
          mechState.updateTypes[MechModel.UpdateType.WEAPONSTATE] = true;
          //TODO: Add WeaponFire to queue
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
  }

  //Compute the heat caused by firing a set of weapons
  //Ghost heat reference: http://mwomercs.com/forums/topic/127904-heat-scale-the-maths/
  var computeHeat = function (weaponStateList) {
    let totalHeat = 0;
    let ghostHeatGroups = {}; // weaponInfo.heatPenaltyId -> [weaponInfo]
    for (weaponState of weaponStateList) {
      //if not able to fire weapon, proceed to next in list
      if (!weaponState.active
          || !weaponState.weaponCycle === MechModel.WeaponCycle.READY) {
        continue;
      }
      let weaponInfo = weaponState.weaponInfo;
      totalHeat += Number(weaponInfo.heat);
      //Collect weapons in the same ghost heat group
      if (!ghostHeatGroups[weaponInfo.heatPenaltyId]) {
        ghostHeatGroups[weaponInfo.heatPenaltyId] = [];
      }
      ghostHeatGroups[weaponInfo.heatPenaltyId].push(weaponInfo);
    }
    //Calculate ghost heat
    let ghostHeat = 0;
    for (let heatPenaltyId in ghostHeatGroups) {
      let ghostHeatForGroup = calculateGhostHeat(ghostHeatGroups[heatPenaltyId]);
      ghostHeat += Number(ghostHeatForGroup);
    }

    return totalHeat + ghostHeat;
  }

  //TODO: Verify correctness of ghost heat method. This seems to be consistent with
  //the original heatscale post (http://mwomercs.com/forums/topic/127904-heat-scale-the-maths/)
  //but is not consistent with smurfy's table (http://mwo.smurfy-net.de/equipment#weapon_heatscale)
  var calculateGhostHeat = function (weaponInfoList) {
    const HEATMULTIPLIER = [0, 0, 0.08, 0.18, 0.30, 0.45, 0.60, 0.80, 1.10, 1.50, 2.00, 3.00, 5.00];
    let minHeatPenaltyLevel = null; //lowest free alpha count in the group
    //sort weaponInfoList in decreasing order of heat
    var compareHeat = function(weaponInfo1, weaponInfo2) {
      return Number(weaponInfo2.heat) - Number(weaponInfo1.heat);
    }
    weaponInfoList.sort(compareHeat);
    for (let weaponInfo of weaponInfoList) {
      if (weaponInfo.minHeatPenaltyLevel > minHeatPenaltyLevel) {
        //if no heat penalty, move to next
        if (weaponInfo.minHeatPenaltyLevel <=0) continue;
        if (minHeatPenaltyLevel == null
            || weaponInfo.minHeatPenaltyLevel < minHeatPenaltyLevel) {
          minHeatPenaltyLevel = weaponInfo.minHeatPenaltyLevel;
        }
      }
    }
    let numWeaponsFired = weaponInfoList.length;
    let excessWeaponCount = minHeatPenaltyLevel != null ?
            numWeaponsFired - minHeatPenaltyLevel + 1 : 0;
    if (excessWeaponCount > 0) {
      let ghostHeat = 0;
      for (let i = 0; i < excessWeaponCount; i++) {
        let weaponInfo = weaponInfoList[i];
        ghostHeat += HEATMULTIPLIER[numWeaponsFired] *
                        weaponInfo.heatPenalty * weaponInfo.heat;
      }
      return ghostHeat;
    } else {
      return 0;
    }
  }

  return {
    SimulatorParameters : SimulatorParameters,
    setSimulatorParameters : setSimulatorParameters,
    runSimulation : runSimulation,
    pauseSimulation : pauseSimulation,
    resetSimulation : resetSimulation,
    stepSimulation : stepSimulation,
    step: step,
    computeHeat: computeHeat,
  }

})(); //end namespace
