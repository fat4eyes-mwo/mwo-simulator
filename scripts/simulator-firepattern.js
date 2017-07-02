"use strict";

//Fire patterns are functions that take a mech and return a list of weaponstates
//which represent the weapons to fire
var MechFirePattern = MechFirePattern || (function () {

  var alphaAtZeroHeat = function (mech, range) {
    let mechState = mech.getMechState();
    if (mechState.heatState.currHeat <= 0) {
      return mechState.weaponStateList;
    } else {
      return null;
    }
  }

  //Will always try to fire the weapons with the highest damage to heat ratio
  //If not possible will wait until enough heat is available
  //Avoids ghost heat
  var maximumDmgPerHeat = function (mech, range) {
    let mechState = mech.getMechState();
    let sortedByDmgPerHeat = Array.from(mechState.weaponStateList);
    //sort weaponsToFire by damage/heat at the given range in decreasing order
    sortedByDmgPerHeat.sort(damagePerHeatComparator(range));
    let weaponsToFire = [];
    for (let weaponState of sortedByDmgPerHeat) {
      if (!weaponState.isReady() || !willDoDamage(weaponState, range)) continue;
      //fit as many ready weapons as possible into the available heat
      //starting with those with the best damage:heat ratio
      weaponsToFire.push(weaponState);
      if (willGhostHeat(mech, weaponsToFire) || willOverheat(mech, weaponsToFire)) {
        weaponsToFire.pop();
        break;
      }
    }
    return weaponsToFire;
  }

  //Always alpha, as long as it does not cause an overheat
  var alphaNoOverheat = function (mech, range) {
    let mechState = mech.getMechState();
    let weaponsToFire = [];
    //check if all weapons are ready
    for (let weaponState of mechState.weaponStateList) {
      if (!weaponState.isReady()) return weaponsToFire;
    }
    weaponsToFire = Array.from(mechState.weaponStateList);
    if (!willOverheat(mech, weaponsToFire)) {
      return weaponsToFire;
    } else {
      return [];
    }
  }

  var maxFireNoGhostHeat = function (mech, range) {
    let mechState = mech.getMechState();
    let weaponsToFire = [];
    for (let weaponState of mechState.weaponStateList) {
      if (!weaponState.isReady() || !willDoDamage(weaponState, range)) continue;
      weaponsToFire.push(weaponState);
      if (willGhostHeat(mech, weaponsToFire) || willOverheat(mech, weaponsToFire)) {
        weaponsToFire.pop();
        continue;
      }
    }
    return weaponsToFire;
  }

  var fireWhenReady = function(mech, range) {
    let mechState = mech.getMechState();
    let weaponsToFire = [];
    for (let weaponState of mechState.weaponStateList) {
      if (weaponState.weaponCycle === MechModel.WeaponCycle.READY) {
        weaponsToFire.push(weaponState);
      }
    }
    return weaponsToFire;
  }

  //Util functions
  var damagePerHeatComparator = function(range) {
    return (weaponA, weaponB) => {
      let weaponInfoA = weaponA.weaponInfo;
      let dmgPerHeatA = weaponInfoA.heat > 0 ?
              weaponInfoA.damageAtRange(range, MechSimulatorLogic.stepDuration)
                / weaponInfoA.heat :
              Number.MAX_VALUE;
      let weaponInfoB = weaponB.weaponInfo;
      let dmgPerHeatB = weaponInfoB.heat > 0 ?
              weaponInfoB.damageAtRange(range, MechSimulatorLogic.stepDuration)
                / weaponInfoB.heat :
              Number.MAX_VALUE;
      return dmgPerHeatB - dmgPerHeatA;
    };
  }

  var willOverheat = function(mech, weaponsToFire) {
    let predictedHeat = MechSimulatorLogic.predictHeat(mech, weaponsToFire);
    let heatState = mech.getMechState().heatState;
    return heatState.currHeat + predictedHeat > heatState.currMaxHeat;
  }

  var willGhostHeat = function(mech, weaponsToFire) {
    let predictedHeat = MechSimulatorLogic.predictHeat(mech, weaponsToFire);
    let baseHeat = MechSimulatorLogic.predictBaseHeat(mech, weaponsToFire);
    return predictedHeat > baseHeat;
  }

  var willDoDamage = function(weaponState, range) {
    return weaponState.weaponInfo.damageAtRange(range,
                                        MechSimulatorLogic.stepDuration) > 0;
  }

  var getDefault = function() {
    return MechFirePattern.maximumDmgPerHeat;
  }

  return {
    alphaAtZeroHeat : alphaAtZeroHeat,
    alphaNoOverheat : alphaNoOverheat,
    maximumDmgPerHeat : maximumDmgPerHeat,
    fireWhenReady : fireWhenReady,
    maxFireNoGhostHeat : maxFireNoGhostHeat,
    getDefault : getDefault,
  };
})();
