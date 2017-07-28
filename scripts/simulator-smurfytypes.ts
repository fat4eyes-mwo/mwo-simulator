"use strict";

//Classes representing smurfy types. Only used for reference and autocompletion

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
    armor: number, //is a string when loaded from JSON
    actuators: SmurfyMechComponentItem[], //[SmurfyMechComponentItem...]
    omni_pod: number,
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
    count: number, //is a string when read from JSON
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
    count: number, //is a string when read from JSON
  }

  //SmurfyMechData classes
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
    tons: string,
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
  }

  export interface SmurfyModuleData { //Common properties for SmurfyHeatsinkModuleData, SmurfyEngineModuleData
    id : string,
    type : string,
    name : string,
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

  export interface SmurfyAmmoData {
    id : string,
    type : string,
    name : string,
    num_shots : number,
    weapons : string[], //[string] weapons that use this ammo
  }
}
