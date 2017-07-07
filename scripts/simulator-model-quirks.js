"use strict";

var MechModelQuirks = MechModelQuirks || (function () {

  const quirkComponentMap = {
    "centre_torso" : "ct",
    "left_arm" : "ra",
    "left_leg" : "ll",
    "left_torso" : "lt",
    "right_arm" : "ra",
    "right_leg" : "rl",
    "right_torso" : "rt",
  };
  const armorQuirkPrefix = "armorresist";
  const structureQuirkPrefix = "internalresist";
  //returns {armor: <bonus armor>, structure: <bonus structure>}
  var getArmorStructureBonus = function(component, quirkList) {
    let ret = {armor: 0, structure: 0};

    for (let quirk of quirkList) {
      if (quirk.name.startsWith(armorQuirkPrefix)) {
        let quirkComponent = quirk.name.split("_")[1];
        if (quirkComponentMap[component] !== quirkComponent) continue;
        ret.armor += Number(quirk.value);
      } else if (quirk.name.startsWith(structureQuirkPrefix)) {
        let quirkComponent = quirk.name.split("_")[1];
        if (quirkComponentMap[component] !== quirkComponent) continue;
        ret.structure += Number(quirk.value);
      }
    }
    return ret;
  }

  return {
    getArmorStructureBonus: getArmorStructureBonus,
  }

})();
