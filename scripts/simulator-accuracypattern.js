"use strict";

var MechAccuracyPattern = MechAccuracyPattern || (function () {

  //Functions that determine how damage from a weapon is spread
  //type is function(MechModel.WeaponDamage, range) -> MechModel.WeaponDamage
  var fullAccuracyPattern = function(weaponDamage, range) {
    //Does not spread the damage
    return weaponDamage;
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

  return {
    fullAccuracyPattern : fullAccuracyPattern,
    getWeaponAccuracyPattern : getWeaponAccuracyPattern,
    cERPPCPattern : cERPPCPattern,
  }

})();
