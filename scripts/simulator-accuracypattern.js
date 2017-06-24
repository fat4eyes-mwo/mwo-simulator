"use strict";

var MechAccuracyPattern = MechAccuracyPattern || (function () {

  //Functions that determine how damage from a weapon is spread
  //type is function(MechModel.WeaponDamage) -> MechModel.WeaponDamage
  var fullAccuracyPattern = function(weaponDamage) {
    //Does not spread the damage
    return weaponDamage;
  }

  return {
    fullAccuracyPattern : fullAccuracyPattern,
  }

})();
