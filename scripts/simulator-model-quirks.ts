"use strict";
/// <reference path="data/quirkdata.ts" />
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-smurfytypes.ts" />

//TODO: Remove : any types
namespace MechModelQuirks {

  export var collectOmnipodQuirks = function(smurfyMechLoadout : SmurfyTypes.SmurfyMechLoadout) {
    let ret : SmurfyTypes.SmurfyQuirk[] = [];
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
    //add ct omnipod quirks (smurfy config does not put in omnipod ID for ct)
    let smurfyMechInfo = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
    let ctOmnipod = MechModel.getSmurfyCTOmnipod(smurfyMechInfo.name);
    if (ctOmnipod) {
      ret = ret.concat(ctOmnipod.configuration.quirks);
    } else {
      console.warn("Unable to find CT omnipod for " + smurfyMechInfo.name);
    }
    return ret;
  }

  //returns {<quirk_name>: <value>, ...} for general quirks
  export var getGeneralBonus = function(quirkList : SmurfyTypes.SmurfyQuirk[]) {
    let ret : {[index:string] : number} = {};
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
  export var getArmorStructureBonus = function(component : string, quirkList : SmurfyTypes.SmurfyQuirk[]) {
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
  var reversedWeaponNameMap : {[index:string] : Set<string>} = {};
  //Initialize the map. Make sure that quirkData.js is loaded before simulator-model-quirks.js
  (function initReversedWeaponNameMap() {
    for (let quirkName in _weaponNameMap) {
      for (let weaponName of _weaponNameMap[quirkName]) {
        let reverseEntry = reversedWeaponNameMap[weaponName];
        if (!reverseEntry) {
          reverseEntry = new Set<string>();
          reversedWeaponNameMap[weaponName] = reverseEntry;
        }
        reverseEntry.add(quirkName);
      }
    }
  })();

  //returns {cooldown_multiplier: <bonus>, duration_multiplier: <bonus>,
  //          heat_multiplier: <bonus>, range_multiplier: <bonus>, velocity_multiplier: <bonus>}
  export var getWeaponBonus = function(weaponInfo : any) : {[index:string] : number} {
    let quirkList = weaponInfo.mechInfo.quirks;
    let ret : {[index:string] : number} = {cooldown_multiplier : 0, duration_multiplier : 0,
              heat_multiplier : 0, range_multiplier : 0, velocity_multiplier : 0,
              jamchance_multiplier: 0};
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
}
