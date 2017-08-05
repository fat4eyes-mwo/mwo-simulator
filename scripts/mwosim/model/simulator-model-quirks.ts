"use strict";

namespace MechModelQuirks {
  type WeaponInfo = MechModelWeapons.WeaponInfo;
  type SmurfyMechLoadout = SmurfyTypes.SmurfyMechLoadout;
  type SmurfyQuirk = SmurfyTypes.SmurfyQuirk;
  type SmurfyMechData = SmurfyTypes.SmurfyMechData;

  //Our version of smurfy quirks. Define our own type in case we need to add more
  //properties later
  export interface MechQuirk {
    name: string,
    translated_name: string,
    value: number,
    translated_value : string,
    isBonus: () => boolean,
  }
  class MechQuirkInfo implements MechQuirk {
    smurfyQuirk : SmurfyQuirk;
    constructor(smurfyQuirk: SmurfyQuirk) {
      this.smurfyQuirk = Object.assign({}, smurfyQuirk);
    }
    get name() : string {
      return this.smurfyQuirk.name;
    }
    get translated_name() : string {
      return this.smurfyQuirk.translated_name;
    }
    get value() : number {
      return this.smurfyQuirk.value;
    }
    set value(value : number) {
      this.smurfyQuirk.value = value;
    }
    get translated_value() : string {
      let quirkNameComponents = this.name.split("_");
      let endIdx = quirkNameComponents.length - 1;
      let lastNameComponent = quirkNameComponents[endIdx];
      let prefix = this.value >= 0 ? "+" : "";
      if (lastNameComponent === "multiplier") {
        return prefix + (100 * (this.value)).toFixed(1) + "%";
      } else if (lastNameComponent === "additive") {
        return prefix + String(this.value);
      } else {
        console.warn(Error("Unexpected quirk type: " + this.name));
        return String(this.value);
      }
    }
    isBonus() : boolean {
      let quirkNameComponents = this.name.split("_");
      let endIdx = quirkNameComponents.length - 1;
      let lastNameComponent = quirkNameComponents[endIdx];
      if (lastNameComponent === "additive") {
        return this.value > 0;
      }
      const negativeExceptions = [
        "spread",
        "cooldown",
        "heat",
        "duration",
        "jamchance",
        "receiving", //TODO: for critchance_receiving. Works for now, may not later
      ];
      let quirkTypeNameComponent = quirkNameComponents[endIdx - 1];
      if (negativeExceptions.includes(quirkTypeNameComponent)) {
        return this.value < 0;
      } else {
        return this.value > 0;
      }
    }
  }

  export var collectOmnipodQuirks =
    function(smurfyMechLoadout : SmurfyMechLoadout)
      : MechQuirk[] {
    let ret : MechQuirk[] = [];
    let seenQuirkMap = new Map<string, MechQuirk>();
    if (!MechModel.isOmnimech(smurfyMechLoadout)) {
      return ret;
    }
    var addQuirk = function(smurfyQuirk : SmurfyQuirk) : void {
      let mechQuirk = seenQuirkMap.get(smurfyQuirk.name);
      if (!mechQuirk) {
        mechQuirk = new MechQuirkInfo(smurfyQuirk);
        ret.push(mechQuirk);
        seenQuirkMap.set(mechQuirk.name, mechQuirk);
      } else {
        mechQuirk.value = mechQuirk.value + Number(smurfyQuirk.value);
      }
    }
    for (let component of smurfyMechLoadout.configuration) {
      let omnipodId = component.omni_pod;
      if (omnipodId) {
        let omnipodData = MechModel.getSmurfyOmnipodData(omnipodId);
        let omnipodQuirks = omnipodData.configuration.quirks;
        for (let smurfyQuirk of omnipodQuirks) {
          addQuirk(smurfyQuirk);
        }
      }
    }
    //add ct omnipod quirks (smurfy config does not put in omnipod ID for ct)
    let smurfyMechInfo = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
    let ctOmnipod = MechModel.getSmurfyCTOmnipod(smurfyMechInfo.name);
    if (ctOmnipod) {
      for (let smurfyQuirk of ctOmnipod.configuration.quirks) {
        addQuirk(smurfyQuirk);
      }
    } else {
      console.warn("Unable to find CT omnipod for " + smurfyMechInfo.name);
    }
    return ret;
  }

  export var collectMechQuirks =
    function(smurfyMechData : SmurfyMechData) : MechQuirk[] {
      let ret : MechQuirk[] = [];
      for (let smurfyQuirk of smurfyMechData.details.quirks) {
        ret.push(new MechQuirkInfo(smurfyQuirk));
      }
      return ret;
    }

  //returns {<quirk_name>: <value>, ...} for general quirks
  export interface GeneralBonus {
    [index:string] : number
  };
  export var getGeneralBonus =
    function(quirkList : MechQuirk[]) : GeneralBonus {
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
  export interface HealthBonus {
    armor : number;
    structure : number;
  }
  export var getArmorStructureBonus =
    function(component : string, quirkList : MechQuirk[]) : HealthBonus {
    let ret = {armor: 0, structure: 0};

    for (let quirk of quirkList) {
      if (quirk.name.startsWith(_quirkArmorPrefix)) {
        let quirkComponent = quirk.name.split("_")[1];
        if (_quirkComponentMap[component] !== quirkComponent) {
          continue;
        }
        ret.armor += Number(quirk.value);
      } else if (quirk.name.startsWith(_quirkStructurePrefix)) {
        let quirkComponent = quirk.name.split("_")[1];
        if (_quirkComponentMap[component] !== quirkComponent) {
          continue;
        }
        ret.structure += Number(quirk.value);
      }
    }
    return ret;
  }

  //Reversed version of _weaponNameMap in quirkData.js. For faster lookup of weapon names
  //format is weaponName -> {set of quirks that applies to the weapon}
  interface ReversedNameMap {
    [index:string] : Set<string>
  };
  class ReverseWeaponQuirkMap {
    private reversedWeaponNameMap : ReversedNameMap = null;
    constructor() {
      //Do nothing, reverse map will be initialized the first time
      //getReversedWeaponNameMap is called
    }

    getApplicableQuirks(weaponName : string ) : Set<string> {
      return this.getReversedWeaponNameMap()[weaponName];
    }

    private getReversedWeaponNameMap() : ReversedNameMap {
      if (!this.reversedWeaponNameMap) {
        this.reversedWeaponNameMap = this.initReversedWeaponNameMap();
      }
      return this.reversedWeaponNameMap;
    }

    //Initialize the map. Make sure that quirkData.js is loaded before simulator-model-quirks.js
    private initReversedWeaponNameMap() : ReversedNameMap {
      let ret : ReversedNameMap = {};
      for (let quirkName in _weaponNameMap) {
        if (!_weaponNameMap.hasOwnProperty(quirkName)) {
          continue;
        }
        for (let weaponName of _weaponNameMap[quirkName]) {
          let reverseEntry = ret[weaponName];
          if (!reverseEntry) {
            reverseEntry = new Set<string>();
            ret[weaponName] = reverseEntry;
          }
          reverseEntry.add(quirkName);
        }
      }
      return ret;
    }
  }
  var reversedWeaponQuirkMap = new ReverseWeaponQuirkMap();

  //returns {cooldown_multiplier: <bonus>, duration_multiplier: <bonus>,
  //          heat_multiplier: <bonus>, range_multiplier: <bonus>, velocity_multiplier: <bonus>}
  export interface WeaponBonus {
    [index:string] : number
  };
  export var getWeaponBonus = function(weaponInfo : WeaponInfo) : WeaponBonus {
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
      let applicableQuirks =
            reversedWeaponQuirkMap.getApplicableQuirks(weaponInfo.name);
      if (applicableQuirks && applicableQuirks.has(firstNameComponent)) {
        ret[restOfNameComponents] += Number(quirk.value);
      }
    }

    return ret;
  }
}
