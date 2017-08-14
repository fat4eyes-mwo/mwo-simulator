"use strict";

//Type definitions for smurfy types

namespace SmurfyTypes {

  //Loadout types
  export interface SmurfyMechLoadout {
    id: string, //loadout id used in smurfy get param
    mech_id: string, //used to refer to SmurfyMechData.id
    configuration: SmurfyMechComponent[], //[SmurfyMechComponent...]
    upgrades: SmurfyMechUpgrade[], //[SmurfyMechUpgrade]
    stats: SmurfyMechStats, //SmurfyMechStats
  }

  //a mech component (e.g. center torso)
  export interface SmurfyMechComponent {
    name: string, //values are from SmurfyMechModel.Component
    armor: number,
    actuators: SmurfyMechComponentItem[], //[SmurfyMechComponentItem...]
    omni_pod: string,
    items: SmurfyMechComponentItem[], //[SmurfyMechComponentItem...]
  }

  export interface SmurfyMechComponentItem {
    id: string, //refers to WeaponData.id, ModuleData.id, AmmoData.id
    type: string,
    name: string,
  }

  //Endo/Ferro/DoubleHeatsinks/Artemis
  export interface SmurfyMechUpgrade {
    id: string, //no reference
    type: string,
    name: string,
  }

  export interface SmurfyMechStats {
    used_armor: number,
    used_jump_jets: number,
    granted_jump_jets: number,
    firepower: number,
    dps_max: number,
    dps_sustained: number,
    cooling_efficiency: number,
    heatsinks: number,
    top_speed: number,
    top_speed_tweak: number,
    engine_name: string,
    engine_rating: number,
    engine_type: string,
    armaments: SmurfyMechArmamentEntry[], //[SmurfyMechArmamentEntry...]
    ammunition: SmurfyAmmoEntry[],
    equipment: SmurfyMechEquipmentEntry[], //[SmurfyMechEquipmentEntry...]
  }

  export interface SmurfyMechArmamentEntry {
    id: string, //Refers to WeaponData.id
    type: string,
    name: string,
    count: number,
  }

  export interface SmurfyMechEquipmentEntry {
    id: string, //Refers to ModuleData.id
    type: string,
    name: string,
    count: number,
  }

  export interface SmurfyAmmoEntry {
    id: string, //Refers to AmmoData.id
    type: string,
    name: string,
    count: number,
  }

  //SmurfyMechData classes
  export interface SmurfyMechDataList {
    [index:string] : SmurfyMechData
  };
  export interface SmurfyMechData {
    id: string,
    name: string,
    faction: string,
    mech_type: string, //light, medium, heavy, assault
    family: string, //short name for chassis
    chassis_translated: string, //long name for chassis
    translated_name: string,
    translated_short_name: string,
    details: SmurfyMechDetails, //SmurfyMechDetails
  }

  export interface SmurfyMechDetails {
    type: string,
    tons: number,
    top_speed: number,
    jump_jets: number,
    ecm: boolean,
    masc: boolean,
    tech_slots: string,
    weapon_mod_slots: string,
    consumable_slots: string,
    engine_range: null, //{min, max}, currently unused
    hardpoints: SmurfyMechHardpoints, //SmurfyMechHardpoints
    tuning_config: null, //SmurfyMechTuningConfig. Note: just mobility stats, ignored for now
    price: null, //{id, mc, cb}. Currently unused
    max_armor: number,
    quirks: SmurfyQuirk[], //[SmurfyMechQuirk...]
  }

  export interface SmurfyMechHardpoints { //hardpoint counts
    ams: number,
    beam: number,
    ballistic: number,
    missile: number,
    ecm: number,
  }

  export interface SmurfyQuirk {
    name: string,
    translated_name: string,
    value: number,
  }

  export interface SmurfyWeaponDataList {
    [index: string] : SmurfyWeaponData
  };
  //SmurfyWeaponData Classes
  export interface SmurfyWeaponData {
    id: string,
    type: string, //BALLISTIC, BEAM
    tons: number,
    slots: number,
    price: null, //{id, mc, cb}, currently unused
    name: string,
    translated_name: string,
    translated_desc: string,
    family: string,
    min_range: number,
    long_range: number,
    max_range: number,
    cooldown: number,
    speed: number,
    impulse: number,
    duration: number,
    heat: number,
    artemis_restricted_to: string,
    num_shots: number,
    calc_stats: SmurfyWeaponCalcStats, //SmurfyWeaponCalcStats
    min_heat_penalty_level: number,
    heat_penalty: number,
    heat_penalty_id: number,
    //fields below are added from addedweapondata.js
    ammo_per_shot : number,
    spinup : number,
    jamming_chance : number,
    jammed_time : number,
    shots_during_cooldown : number,
    rof : number,
    rampUpTime : number,
    rampDownTime : number,
    jamRampUpTime : number,
    jamRampDownTime : number,
    isOneShot : boolean,
    volleyDelay : number,
    ranges : SmurfyWeaponRange[],
  }

  export interface SmurfyWeaponRange {
    start : number;
    damageModifier : number;
    interpolationToNextRange : string;
  }

  export interface SmurfyWeaponCalcStats {
    damageMultiplier: number,
    baseDmg: number,
    dps: number,
    hps: number,
    ehs: number,
    dmg: number,
  }

  export interface SmurfyModuleDataList {
    [index:string] : SmurfyModuleData
  };

  export interface SmurfyModuleData { //Common properties for SmurfyHeatsinkModuleData, SmurfyEngineModuleData
    id : string,
    type : string,
    name : string,
    stats : any,
  }

  //ModuleData with type = CHeatSinkStats
  export interface SmurfyHeatsinkModuleData extends SmurfyModuleData { //extends SmurfyModuleData
    stats : SmurfyHeatsinkStats, //SmurfyHeatsinkStats
  }
  export interface SmurfyHeatsinkStats {
    cooling : number,
    engineCooling : number,
    heatbase : number,
    internal_heat_capacity : number; //added from addedheatsinkdata.js
    external_heat_capacity : number; //added from addedheatsinkdata.js
  }

  //ModuleData with type = CEngineStats
  export interface SmurfyEngineModuleData extends SmurfyModuleData { //extends SmurfyModuleData
    stats : SmurfyEngineStats,
  }
  export interface SmurfyEngineStats {
    rating : number,
    heatsinks : number,
  }

  export interface SmurfyAmmoDataList {
    [index:string] : SmurfyAmmoData
  };
  export interface SmurfyAmmoData {
    id : string,
    type : string,
    tons : number,
    name : string,
    num_shots : number,
    weapons : string[], //[string] weaponIds that use this ammo
  }

  export interface SmurfyOmnipodData {
    [index:string] : SmurfyChassisOmnipods
  }

  export interface SmurfyChassisOmnipods {
    [index:string] : SmurfyOmnipod
  }

  export interface SmurfyOmnipod {
    details : OmnipodDetails,
    configuration : OmnipodConfiguration,
    price : any, //not used currently
  }

  export interface OmnipodDetails {
    id : string,
    chassis : string,
    set : string;
    component : string;
    translatedName : string;
  }

  export interface OmnipodConfiguration {
    name : string,
    internalSlots : any[], //not used yet
    fixedSlots : any[], //not used yet
    quirks : SmurfyQuirk[],
    hardpoints : any[], //not used yet
  }

  export interface OmnipodSet { //from AddedOmnipodData
    name: string;
    setBonusQuirks : SmurfyQuirk[];
  }
}
