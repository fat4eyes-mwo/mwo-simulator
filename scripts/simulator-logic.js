
var MechSimulatorLogic = MechSimulatorLogic || (function () {

  var simulationInterval = null;
  var simRunning = false;
  var simTime = 0;
  
  const stepDuration = 50; //simulation tick length in ms

  //interval between UI updates. Set smaller than step duration to run the
  // simulation faster, but not too small as to lock the browser
  const uiUpdateInterval = 50;

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

        //Debug code
        let weaponsToFire = MechFirePattern.alphaAtZeroHeat(mech);
        if (weaponsToFire) {
          fireWeapons(mech, weaponsToFire);
        }
        MechModelView.updateMech(mech);
      }
    }

    simTime += stepDuration;
    MechModelView.updateSimTime(simTime);
  }

  //Give a mech and a list of weaponStates (which must be contained in mech.mechState.weaponStateList)
  //fire the weapons (i.e. update mech heat and weapon states)
  var fireWeapons = function(mech, weaponStateList) {
    let mechState = mech.getMechState();

    for (let weaponState of weaponStateList) {
      //TODO change weapon states, cooldowns, spoolups
    }
    mechState.updateTypes[MechModel.UpdateType.WEAPONSTATE] = true;

    let totalHeat = computeHeat(weaponStateList);
    mechState.heatState.currHeat += Number(totalHeat);
    mechState.updateTypes[MechModel.UpdateType.HEAT] = true;
  }

  var dissapateHeat = function(mech) {
    let mechState = mech.getMechState();
    let heatState = mechState.heatState;
    //heat dissapated per step. Divide currHeatDissapation by 1000 because it is in heat per second
    let stepHeatDissapation = stepDuration * heatState.currHeatDissapation / 1000;
    let prevHeat = heatState.currHeat;
    heatState.currHeat = Math.max(0, heatState.currHeat - Number(stepHeatDissapation));
    if (heatState.currHeat != prevHeat) {
      mechState.updateTypes[MechModel.UpdateType.HEAT] = true;
    }
  }

  var processCooldowns = function(mech) {
    //TODO: Implement
    let mechState = mech.getMechState();
    mechState.updateTypes[MechModel.UpdateType.COOLDOWN] = true;
  }

  //Compute the heat caused by firing a set of weapons
  //Ghost heat reference: http://mwomercs.com/forums/topic/127904-heat-scale-the-maths/
  var computeHeat = function (weaponStateList) {
    let totalHeat = 0;
    for (weaponState of weaponStateList) {
      //if not able to fire weapon, proceed to next in list
      if (!weaponState.active || !weaponState.weaponCycle === MechModel.WeaponCycle.READY) {
        continue;
      }
      let weaponInfo = weaponState.weaponInfo;
      totalHeat += Number(weaponInfo.heat);

      //TODO: add ghost heat
    }
    return totalHeat;
  }

  return {
    runSimulation : runSimulation,
    pauseSimulation : pauseSimulation,
    resetSimulation : resetSimulation,
    step: step,
    computeHeat: computeHeat,
  }

})(); //end namespace
