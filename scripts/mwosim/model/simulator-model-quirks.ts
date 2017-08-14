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
    //returns true if the quirk is beneficial, false if not.
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
        "falldamage",
        "jamchance",
        "jamduration",
        "jamrampdownduration",
        "rampdownduration",
        "startupduration",
        "screenshake",
        "coolshotcooldown",
        "strategicstrikespread",
        "stealtharmorcooldown",
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

  //collects the set of quirks for omnimechs
  const CompleteOmnipodSetCount = 8;
  export var collectOmnipodQuirks =
    function(smurfyMechLoadout : SmurfyMechLoadout)
      : MechQuirk[] {
    let ret : MechQuirkList = new MechQuirkList();
    if (!MechModel.isOmnimech(smurfyMechLoadout)) {
      return ret;
    }

    let omnipodSetCounts = new Map<string, number>(); //omnipodId -> count
    var incrementOmnipodSet = function(setName : string) {
      let setCount = omnipodSetCounts.get(setName);
      if (!setCount) {
        setCount = 1;
      } else {
        setCount = setCount + 1;
      }
      omnipodSetCounts.set(setName, setCount);
    }

    for (let component of smurfyMechLoadout.configuration) {
      let omnipodId = component.omni_pod;
      if (omnipodId) {
        let omnipodData = MechModel.getSmurfyOmnipodData(omnipodId);
        let omnipodQuirks = omnipodData.configuration.quirks;
        for (let smurfyQuirk of omnipodQuirks) {
          ret.addQuirk(new MechQuirkInfo(smurfyQuirk));
        }
        let setName = omnipodData.details.set;
        incrementOmnipodSet(setName);
      }
    }
    //add ct omnipod quirks (smurfy config does not put in omnipod ID for ct)
    let smurfyMechInfo = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
    let ctOmnipod = MechModel.getSmurfyCTOmnipod(smurfyMechInfo.name);
    if (ctOmnipod) {
      for (let smurfyQuirk of ctOmnipod.configuration.quirks) {
        ret.addQuirk(new MechQuirkInfo(smurfyQuirk));
      }
      let omnipodSetName = ctOmnipod.details.set;
      incrementOmnipodSet(omnipodSetName);

      //add set bonus
      let setCount = omnipodSetCounts.get(omnipodSetName);
      if (setCount >= CompleteOmnipodSetCount) {
        let fullSetQuirks = AddedData._AddedOmnipodData[omnipodSetName].setBonusQuirks as SmurfyQuirk[];
        for (let smurfyQuirk of fullSetQuirks) {
          ret.addQuirk(new MechQuirkInfo(smurfyQuirk));
        }
      }
    } else {
      console.warn("Unable to find CT omnipod for " + smurfyMechInfo.name);
    }
    return ret;
  }

  //collects the set of quirks for a battlemech (non-omnimech)
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
    armor_multiplier : number;
    structure_multiplier : number;
  }
  export var getHealthBonus =
    function(component : string, quirkList : MechQuirk[]) : HealthBonus {
    let ret = {armor: 0, structure: 0, armor_multiplier : 1.0, structure_multiplier : 1.0};

    for (let quirk of quirkList) {
      if (quirk.name.startsWith(QuirkArmorAdditivePrefix)) {
        let quirkComponent = quirk.name.split("_")[1];
        if (_quirkComponentMap[component] !== quirkComponent) {
          continue;
        }
        ret.armor += Number(quirk.value);
      } else if (quirk.name.startsWith(QuirkStructureAdditivePrefix)) {
        let quirkComponent = quirk.name.split("_")[1];
        if (_quirkComponentMap[component] !== quirkComponent) {
          continue;
        }
        ret.structure += Number(quirk.value);
      } else if (quirk.name === QuirkArmorMultiplier) {
        ret.armor_multiplier += Number(quirk.value);
      } else if (quirk.name === QuirkStructureMultiplier) {
        ret.structure_multiplier += Number(quirk.value);
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

  export interface WeaponBonus {
    [index:string] : number
  };
  //returns {cooldown_multiplier: <bonus>, duration_multiplier: <bonus>,
  //          heat_multiplier: <bonus>, range_multiplier: <bonus>, velocity_multiplier: <bonus>, 
  //          jamchance_multiplier: <bonus>, jamduration_multiplier:<bonus>}
  export var getWeaponBonus = function(weaponInfo : WeaponInfo) : WeaponBonus {
    let quirkList = weaponInfo.mechInfo.quirks;
    if (weaponInfo.mechInfo.skillQuirks) {
      quirkList = quirkList.concat(weaponInfo.mechInfo.skillQuirks);
    }
    return getWeaponBonusForQuirklist(weaponInfo, quirkList);
  }

  var getWeaponBonusForQuirklist = function(weaponInfo : WeaponInfo, quirkList : MechQuirk[]) : WeaponBonus {
    let ret: { [index: string]: number } = {
      cooldown_multiplier: 0, duration_multiplier: 0,
      heat_multiplier: 0, range_multiplier: 0, velocity_multiplier: 0,
      jamchance_multiplier: 0, jamduration_multiplier: 0
    };
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

  const factionNameMap : {[index:string] : string} = {
    "InnerSphere" : "IS",
    "IS" : "IS",
    "Clan" : "Clan",
  }
  export var convertSkillToMechQuirks = function(skillName : string, mechInfo: MechModel.MechInfo) : MechQuirk[] {
    let ret : MechQuirkList = new MechQuirkList();
    let skillNode = AddedData._SkillTreeData[skillName];
    for (let effect of skillNode.effects) {
      let name = effect.quirkName;
      let value : number = 0;
      let matched = false;
      for (let effectValue of effect.quirkValues) {
        if (effectValue.faction) {
          if (factionNameMap[effectValue.faction] !== factionNameMap[mechInfo.faction]) {
            continue;
          }
        }
        if (effectValue.weightClass) {
          if (effectValue.weightClass.toLowerCase !== mechInfo.mechType.toLowerCase) {
            continue;
          }
        }
        if (effectValue.tonnage) {
          if (Number(effectValue.tonnage) !== Number(mechInfo.tons)) {
            continue;
          }
        }
        //matched
        matched = true;
        value += Number(effectValue.quirkValue);
        break;
      }
      if (matched) {
        let effectQuirk :SmurfyQuirk = {
          name, 
          value, 
          translated_name : effect.quirkTranslatedName};
        let mechQuirk = new MechQuirkInfo(effectQuirk);
        ret.addQuirk(mechQuirk);
      }
    }
    if (ret.length === 0) {
      console.warn(Error("Unable to match skill: " + skillName));
    }
    return ret;
  }

  //quirk list that accumulates quirks with the same name into a single entry (when added through addQuirk)
  export class MechQuirkList extends Array<MechQuirk> {
    private quirkNameMap = new Map<string, MechQuirk>();
    constructor() {
      super();
    }
    //adds a quirk, merging it with a quirk already nthe list if it has the same name
    addQuirk(quirk : MechQuirk) {
      if (!(this.quirkNameMap.get(quirk.name))) {
        this.quirkNameMap.set(quirk.name, quirk);
        this.push(quirk);
      } else {
        let quirkInList = this.quirkNameMap.get(quirk.name);
        quirkInList.value = Number(quirkInList.value) + Number(quirk.value);
      }
    }
    addQuirkList(quirks : MechQuirk[]) {
      for (let quirk of quirks) {
        this.addQuirk(quirk);
      }
    }
  }

  //returns true if the quirk has any effect on the mech given its current loadout, false otherwise.
  export var isQuirkApplicable = function(quirk : MechQuirk, mechInfo : MechModel.MechInfo) : boolean {
    //general quirks
    let generalBonus : GeneralBonus  = getGeneralBonus([quirk]);
    for (let idx in generalBonus) {
      if (generalBonus.hasOwnProperty(idx)) {
        return true;
      }
    }

    //armor quirks
    if (quirk.name.startsWith(QuirkArmorAdditivePrefix) 
        || quirk.name.startsWith(QuirkStructureAdditivePrefix)
        || quirk.name === QuirkArmorMultiplier
        || quirk.name === QuirkStructureMultiplier) {
      return true;
    }

    //weapon bonuses
    for (let weaponInfo of mechInfo.weaponInfoList) {
      let weaponBonus = getWeaponBonusForQuirklist(weaponInfo, [quirk]);
      for (let idx in weaponBonus) {
        if (weaponBonus.hasOwnProperty(idx)) {
          if (weaponBonus[idx] !== 0) {
            return true;
          }
        }
      }
    }

    //ammo bonuses
    for (let ammoBox of mechInfo.ammoBoxList) {
      let ammoType = MechModelQuirks._ammoCapacityMap[quirk.name];
      if (ammoType === ammoBox.type) {
        return true;
      }
    }

    return false;
  }

}
