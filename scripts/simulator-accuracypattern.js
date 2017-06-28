"use strict";

var MechAccuracyPattern = MechAccuracyPattern || (function () {

  //Functions that determine how damage from a weapon is spread
  //type is function(MechModel.WeaponDamage, range) -> MechModel.WeaponDamage
  var fullAccuracyPattern = function(weaponDamage, range) {
    //Does not spread the damage
    return weaponDamage;
  }

  return {
    fullAccuracyPattern : fullAccuracyPattern,
  }

})();
