"use strict";

var MechAccuracyPattern = MechAccuracyPattern || (function () {

  //Functions that determine how damage from a weapon is spread
  //type is function(MechModel.WeaponDamage, range) -> MechModel.WeaponDamage
  var fullAccuracyPattern = function(weaponDamage, range) {
    //Does not spread the damage
    return weaponDamage;
  }

  //Spreads the damage to adjacent components, with the given percentages
  //percentOnTarget, percentOnAdjacent between 0 and 1, and their total must be less than one
  //Any left over is considered a miss
  var accuracySpreadToAdjacent = function(percentOnTarget, percentOnAdjacent) {
    return function(weaponDamage, range) {
      let transformedDamage = new MechModel.WeaponDamage({});

      for (let component in weaponDamage.damageMap) {
        let newComponentDamage =
            Number(weaponDamage.damageMap[component]) *
            Number(percentOnTarget);
        let totalAdjacentDamage =
            Number(weaponDamage.damageMap[component]) *
            Number(percentOnAdjacent);

        transformedDamage.damageMap[component] =
          transformedDamage.damageMap[component] ?
            transformedDamage.damageMap[component] + newComponentDamage
            : newComponentDamage;
        //Assumes there are always 2 adjacent components. If the getAdjacentComponents
        //method only returns one, then half of the totalAdjacentDamage is lost
        //e.g. if the component is an arm, it applies half of the percentOnAdjacent * damge to the connected torso,
        //while the other half misses
        let perAdjacentComponentDamage = totalAdjacentDamage / 2;
        let adjacentComponents = MechModel.getAdjacentComponents(component);
        for (let adjacentComponent of adjacentComponents) {
          transformedDamage.damageMap[adjacentComponent] =
            transformedDamage.damageMap[adjacentComponent] ?
              transformedDamage.damageMap[adjacentComponent] + perAdjacentComponentDamage
              : perAdjacentComponentDamage;
        }
      }
      return transformedDamage;
    }
  }

  //Weapon specific accuracy patterns
  var getWeaponAccuracyPattern = function(weaponInfo) {
    var weaponAccuracyMap = {"ClanERPPC" : MechAccuracyPattern.cERPPCPattern};
    return weaponAccuracyMap[weaponInfo.name];
  }
  var cERPPCPattern = function(weaponDamage, range) {
    //assumes weaponDamage only has one entry (the targeted component) and adds
    //the appropriate amount of splash damage
    let baseERPPCDamage =
        Number(MechModel.getSmurfyWeaponDataByName(
                      "ClanERPPC").calc_stats.baseDmg);
    let totalBaseSplashDamage =
        Number(MechModel.getSmurfyWeaponDataByName(
                  "ClanERPPC").calc_stats.dmg)
                  - baseERPPCDamage;
    let baseRangeDamage;
    let targetLocation;
    for (targetLocation in weaponDamage.damageMap) {
      baseRangeDamage = weaponDamage.damageMap[targetLocation];
      break;
    }
    let damageFraction = Number(baseRangeDamage) / Number(baseERPPCDamage);
    //splash damage per component. Halve the total splash damage and scale it to
    //the damagefraction
    let splashRangeDamage = totalBaseSplashDamage / 2 * damageFraction;
    let transformedDamage = weaponDamage.clone();
    let adjacentComponents = MechModel.getAdjacentComponents(targetLocation);
    for (let adjacentLocation of adjacentComponents) {
      transformedDamage.damageMap[adjacentLocation] = splashRangeDamage;
    }
    return transformedDamage;
  }

  var getDefault = function() {
    return MechAccuracyPattern.accuracySpreadToAdjacent(1.0, 0.0);
  }

  return {
    fullAccuracyPattern : fullAccuracyPattern,
    accuracySpreadToAdjacent : accuracySpreadToAdjacent,
    getWeaponAccuracyPattern : getWeaponAccuracyPattern,
    cERPPCPattern : cERPPCPattern,
    getDefault : getDefault,
  }

})();
