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

  var maximumFireRate = function (mech, range) {
    let mechState = mech.getMechState();
    let sortedByDmgPerHeat = Array.from(mechState.weaponStateList);
    //sort weaponsToFire by damage/heat at the given range
    sortedByDmgPerHeat.sort(damagePerHeatComparator(range));
    let weaponsToFire = [];
    for (let weaponState of sortedByDmgPerHeat) {
      if (!weaponState.isReady()) continue;
      //fit as many ready weapons as possible into the available heat
      //starting with those with the best damage:heat ratio
      weaponsToFire.push(weaponState);
      if (willOverheat(mech, weaponsToFire)) {
        weaponsToFire.pop();
        break;
      }
    }
    return weaponsToFire;
  }

  var alphaNoOverheat = function (mech, range) {
    let mechState = mech.getMechState();
    let weaponsToFire = [];
    //check if all weapons are ready
    for (let weaponState of mechState.weaponStateList) {
      if (!weaponState.isReady()) return weaponsToFire;
    }
    weaponsToFire = Array.from(mechState.weaponStateList);
    let predictedHeat = MechSimulatorLogic.predictHeat(mech, weaponsToFire);
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
      if (!weaponState.isReady()) continue;
      weaponsToFire.push(weaponState);
      let predictedHeat = MechSimulatorLogic.predictHeat(mech, weaponsToFire);
      let baseHeat = MechSimulatorLogic.predictBaseHeat(mech, weaponsToFire);
      if (predictedHeat > baseHeat || willOverheat(mech, weaponsToFire)) {
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
              weaponInfoA.damageAtRange(range) / weaponInfoA.heat :
              Number.MAX_VALUE;
      let weaponInfoB = weaponB.weaponInfo;
      let dmgPerHeatB = weaponInfoB.heat > 0 ?
              weaponInfoB.damageAtRange(range) / weaponInfoB.heat :
              Number.MAX_VALUE;
      return dmgPerHeatA - dmgPerHeatB;
    };
  }

  var willOverheat = function(mech, weaponsToFire) {
    let predictedHeat = MechSimulatorLogic.predictHeat(mech, weaponsToFire);
    let heatState = mech.getMechState().heatState;
    return heatState.currHeat + predictedHeat > heatState.currMaxHeat;
  }

  return {
    alphaAtZeroHeat : alphaAtZeroHeat,
    alphaNoOverheat : alphaNoOverheat,
    maximumFireRate : maximumFireRate,
    fireWhenReady : fireWhenReady,
    maxFireNoGhostHeat : maxFireNoGhostHeat,
  };
})();
