"use strict";

//Fire patterns are functions that take a mech and return a list of weaponstates
//which represent the weapons to fire
namespace MechFirePattern {
  import WeaponCycle =MechModelCommon.WeaponCycle;
  type Mech = MechModel.Mech;
  type Pattern = ModelPatterns.Pattern;
  type WeaponState = MechModelWeapons.WeaponState;

  export type FirePattern = (mech : Mech, range : number) => WeaponState[];
  export var alphaAtZeroHeat =
      function (mech : Mech, range : number) : WeaponState[] {
    let mechState = mech.getMechState();
    if (mechState.heatState.currHeat <= 0) {
      return mechState.weaponStateList;
    } else {
      return null;
    }
  }

  //Will always try to fire the weapons with the highest selected parameter
  //If not possible will wait until enough heat is available
  //Avoids ghost heat
  type WeaponSortFunction = (weapon1 : WeaponState, weapon2 : WeaponState) => number;
  type WeaponSortAtRangeFunction = (range : number) => WeaponSortFunction;
  export var maximizeWeapon = function (sortAtRangeFunction : WeaponSortAtRangeFunction) : FirePattern {
    return function (mech : Mech, range : number) : WeaponState[] {
      let mechState = mech.getMechState();
      let sortedWeapons = Array.from(mechState.weaponStateList);
      //sort weaponsToFire by damage/heat at the given range in decreasing order
      let sortFunction = sortAtRangeFunction(range);
      sortedWeapons.sort(sortFunction);
      let weaponsToFire = [];
      for (let weaponState of sortedWeapons) {
        let weaponInfo = weaponState.weaponInfo;
        if (!canFire(weaponState)  //not ready to fire
            || !willDoDamage(weaponState, range) //will not do damage
            //No ammo
            || (weaponInfo.requiresAmmo() && weaponState.getAvailableAmmo() <= 0)
          ) {
          continue; //skip weapon
        }
        //fit as many ready weapons as possible into the available heat
        //starting with those at the start of the sorted list
        weaponsToFire.push(weaponState);
        let overheat = willOverheat(mech, weaponsToFire);
        let ghostheat = willGhostHeat(mech, weaponsToFire);
        if (overheat || ghostheat) {
          weaponsToFire.pop();
          if (ghostheat) {
            continue;
          } else if (overheat) {
            break; //if near heatcap, wait for the better heat/dmg weapon
          }
        }
      }
      return weaponsToFire;
    }
  }

  //Maximize damage per heat
  var damagePerHeatComparator =
      function(range : number)
              : (weaponA : WeaponState, weaponB : WeaponState) => number {
    return (weaponA : WeaponState, weaponB : WeaponState) => {
      let dmgPerHeatA = weaponA.computeHeat() > 0 ?
              weaponA.weaponInfo.damageAtRange(range)
                / weaponA.computeHeat()
              : Number.MAX_VALUE;
      let dmgPerHeatB = weaponB.computeHeat() > 0 ?
              weaponB.weaponInfo.damageAtRange(range)
                / weaponB.computeHeat()
              : Number.MAX_VALUE;
      return dmgPerHeatB - dmgPerHeatA;
    };
  }
  export var maximumDmgPerHeat = maximizeWeapon(damagePerHeatComparator);

  //Maximize raw dps
  var maxDPSComparator =
    function(range: number)
      : (weaponA: WeaponState, weaponB: WeaponState) => number {
      return (weaponA: WeaponState, weaponB: WeaponState) => {
        return weaponB.computeMaxDPS(range) - weaponA.computeMaxDPS(range);
      };
  }
  export var maxDPS = maximizeWeapon(maxDPSComparator);

  //Always alpha, as long as it does not cause an overheat
  export var alphaNoOverheat =
      function (mech : Mech, range : number) : WeaponState[] {
    let mechState = mech.getMechState();
    let weaponsToFire = [];
    //check if all weapons are ready
    for (let weaponState of mechState.weaponStateList) {
      if (!canFire(weaponState) && !weaponState.isJammed()) {
        return [];
      }
    }
    weaponsToFire = Array.from(mechState.weaponStateList);
    if (!willOverheat(mech, weaponsToFire)) {
      return weaponsToFire;
    } else {
      return [];
    }
  }

  export var maxFireNoGhostHeat =
      function (mech : Mech, range : number) : WeaponState[] {
    let mechState = mech.getMechState();
    let weaponsToFire = [];
    for (let weaponState of mechState.weaponStateList) {
      if (!canFire(weaponState) || !willDoDamage(weaponState, range)) {
        continue;
      }
      weaponsToFire.push(weaponState);
      if (willGhostHeat(mech, weaponsToFire) || willOverheat(mech, weaponsToFire)) {
        weaponsToFire.pop();
        continue;
      }
    }
    return weaponsToFire;
  }

  export var fireWhenReady = function(mech : Mech, range : number) : WeaponState[] {
    let mechState = mech.getMechState();
    let weaponsToFire = [];
    for (let weaponState of mechState.weaponStateList) {
      if (weaponState.weaponCycle === WeaponCycle.READY) {
        weaponsToFire.push(weaponState);
      }
    }
    return weaponsToFire;
  }

  //Util functions
  var willOverheat =
      function(mech : Mech, weaponsToFire : WeaponState[]) : boolean {
    let simTime = MechSimulatorLogic.getSimTime();
    let mechState = mech.getMechState();
    let predictedHeat = mechState.predictHeat(weaponsToFire, simTime);
    let heatState = mech.getMechState().heatState;
    return heatState.currHeat + predictedHeat > heatState.currMaxHeat;
  }

  var willGhostHeat =
      function(mech : Mech, weaponsToFire : WeaponState[]) : boolean {
    let simTime = MechSimulatorLogic.getSimTime();
    let mechState = mech.getMechState();
    let predictedHeat = mechState.predictHeat(weaponsToFire, simTime);
    let baseHeat = mechState.predictBaseHeat(weaponsToFire);
    return predictedHeat > baseHeat;
  }

  var willDoDamage =
      function(weaponState : WeaponState, range : number) : boolean {
    return weaponState.weaponInfo.damageAtRange(range) > 0;
  }

  //Helper method for determining whether the firepattern can fire a weapon
  //Uses the useDoubleTap field of SimulatorParameters
  var canFire = function(weaponState : WeaponState) : boolean {
    let simParams = SimulatorSettings.getSimulatorParameters();
    if (simParams.useDoubleTap) {
      return weaponState.canFire();
    } else {
      return weaponState.isReady();
    }
  }

  export var getDefault = function() : FirePattern {
    for (let patternEntry of getPatterns()) {
      if (patternEntry.default) {
        return patternEntry.pattern as FirePattern;
      }
    }
  }

  //Returns a list of fire patterns for the UI
  export var getPatterns = function() : Pattern[] {
    let patternList = [
      { id: "maximumDmgPerHeat",
        name: "Max DMG per Heat",
        pattern: maximumDmgPerHeat,
        description: "Maximize damage per heat.",
        default: true,
      },
      { id: "maxDPS",
        name: "Max DPS",
        pattern: maxDPS,
        description: "Maximize raw DPS at the given range while still avoiding ghost heat.",
        default: false,
      },
      { id: "maxFireNoGhostHeat",
        name: "Maximum fire rate",
        pattern: maxFireNoGhostHeat,
        description: "Maximize weapons fired as long as it doesn't cause ghost heat.",
        default: false,
      },
      { id: "alphaNoOverheat",
        name: "Alpha, no Overheat",
        pattern: alphaNoOverheat,
        description: "Always alpha as long as it doesn't cause an overheat.",
        default: false,
      },
      { id: "alphaAtZeroHeat",
        name: "Alpha when at zero heat",
        pattern: alphaAtZeroHeat,
        description: "Fire all weapons when heat is zero.",
        default: false,
      },
    ];
    return patternList;
  }

  export var reset = function() {
    //Used to reset any state used by the pattern.
  }
}
