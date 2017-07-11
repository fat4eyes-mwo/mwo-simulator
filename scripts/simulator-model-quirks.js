"use strict";

var MechModelQuirks = MechModelQuirks || (function () {

  //returns {armor: <bonus armor>, structure: <bonus structure>}
  var getArmorStructureBonus = function(component, quirkList) {
    let ret = {armor: 0, structure: 0};

    for (let quirk of quirkList) {
      if (quirk.name.startsWith(_quirkArmorPrefix)) {
        let quirkComponent = quirk.name.split("_")[1];
        if (_quirkComponentMap[component] !== quirkComponent) continue;
        ret.armor += Number(quirk.value);
      } else if (quirk.name.startsWith(_quirkStructurePrefix)) {
        let quirkComponent = quirk.name.split("_")[1];
        if (_quirkComponentMap[component] !== quirkComponent) continue;
        ret.structure += Number(quirk.value);
      }
    }
    return ret;
  }

  //Reversed version of _weaponNameMap in quirkData.js. For faster lookup of weapon names
  //format is weaponName -> {set of quirks that applies to the weapon}
  var reversedWeaponNameMap = {};
  //Initialize the map. Make sure that quirkData.js is loaded before simulator-model-quirks.js
  (function initReversedWeaponNameMap() {
    for (let quirkName in _weaponNameMap) {
      for (let weaponName of _weaponNameMap[quirkName]) {
        let reverseEntry = reversedWeaponNameMap[weaponName];
        if (!reverseEntry) {
          reverseEntry = new Set();
          reversedWeaponNameMap[weaponName] = reverseEntry;
        }
        reverseEntry.add(quirkName);
      }
    }
  })();

  //returns {cooldown_multiplier: <bonus>, duration_multiplier: <bonus>,
  //          heat_multiplier: <bonus>, range_multiplier: <bonus>, velocity_multiplier: <bonus>}
  var getWeaponBonus = function(weaponInfo) {
    let quirkList = weaponInfo.mechInfo.quirks;
    let ret = {cooldown_multiplier : 0, duration_multiplier : 0,
              heat_multiplier : 0, range_multiplier : 0, velocity_multiplier : 0};
    for (let quirk of quirkList) {
      let quirkNameComponents = quirk.name.split("_");
      let firstNameComponent = quirkNameComponents[0];
      let restOfNameComponents = quirkNameComponents.slice(1).join("_");
      //general weapon bonuses
      if (_weaponClassMap[firstNameComponent]) {
        if (weaponInfo.type === _weaponClassMap[firstNameComponent]) {
          ret[restOfNameComponents] += Number(quirk.value);
        }
      }

      //specific weapon bonuses
      let applicableQuirks = reversedWeaponNameMap[weaponInfo.name];
      if (applicableQuirks && applicableQuirks.has(firstNameComponent)) {
        ret[restOfNameComponents] += Number(quirk.value);
      }
    }

    return ret;
  }

  return {
    getArmorStructureBonus: getArmorStructureBonus,
    getWeaponBonus: getWeaponBonus,
  }

})();
