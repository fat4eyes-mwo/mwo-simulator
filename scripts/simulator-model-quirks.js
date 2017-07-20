"use strict";

var MechModelQuirks = MechModelQuirks || (function () {

  var collectOmnipodQuirks = function(smurfyMechLoadout) {
    let ret = [];
    if (!MechModel.isOmnimech(smurfyMechLoadout)) {
      return ret;
    }
    for (let component of smurfyMechLoadout.configuration) {
      let omnipodId = component.omni_pod;
      if (omnipodId) {
        let omnipodData = MechModel.getSmurfyOmnipodData(omnipodId);
        let omnipodQuirks = omnipodData.configuration.quirks;
        ret = ret.concat(omnipodQuirks);
      }
    }
    return ret;
  }

  //returns {<quirk_name>: <value>, ...} for general quirks
  var getGeneralBonus = function(quirkList) {
    let ret = {};
    for (let quirk of quirkList) {
      if (_quirkGeneral[quirk.name]) {
        if (!ret[quirk.name]) {
          ret[quirk.name] = Number(quirk.value);
        } else {
          ret[quirk.name] += Number(quirk.value);
        }
      }
    }
    return ret;
  }

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
        if (_weaponClassMap[firstNameComponent].includes(weaponInfo.type)) {
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
    getGeneralBonus : getGeneralBonus,
    collectOmnipodQuirks: collectOmnipodQuirks,
  }

})();
