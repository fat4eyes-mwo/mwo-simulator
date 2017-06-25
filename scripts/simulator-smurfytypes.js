"use strict";

//Classes representing smurfy types. Only used for reference and autocompletion

var SmurfyTypes = SmurfyTypes || (function () {

  //Loadout types
  var SmurfyMechLoadout = {
    id: null, //loadout id used in smurfy get param
    mech_id: null, //used to refer to SmurfyMechData.id
    configuration: null, //[SmurfyMechComponent...]
    upgrades: null, //[SmurfyMechUpgrade]
    stats: null, //SmurfyMechStats
  }

  //a mech component (e.g. center torso)
  var SmurfyMechComponent = {
    name: null, //values are from SmurfyMechModel.Component
    armor: null,
    actuators: null, //[SmurfyMechComponentItem...]
    items: null, //[SmurfyMechComponentItem...]
  }

  var SmurfyMechComponentItem = {
    id: null, //refers to WeaponData.id, ModuleData.id, AmmoData.id
    type: null,
    name: null,
  }

  //Endo/Ferro/DoubleHeatsinks/Artemis
  var SmurfyMechUpgrade = {
    id: null, //no reference
    type: null,
    name: null,
  }

  var SmurfyMechStats = {
    used_armor: null,
    used_jump_jets: null,
    granted_jump_jets: null,
    firepower: null,
    dps_max: null,
    dps_sustained: null,
    cooling_efficiency: null,
    heatsinks: null,
    top_speed: null,
    top_speed_tweak: null,
    engine_name: null,
    engine_rating: null,
    engine_type: null,
    armaments: null, //[SmurfyMechArmamentEntry...]
    ammunition: null,
    equipment: null, //[SmurfyMechEquipmentEntry...]
  }

  var SmurfyMechArmamentEntry = {
    id: null, //Refers to WeaponData.id
    type: null,
    name: null,
    count: null,
  }

  var SmurfyMechEquipmentEntry = {
    id: null, //Refers to ModuleData.id
    type: null,
    name: null,
    count: null,
  }

  //SmurfyMechData classes
  var SmurfyMechData = {
    id: null,
    name: null,
    faction: null,
    mech_type: null, //light, medium, heavy, assault
    family: null, //short name for chassis
    chassis_translated: null, //long name for chassis
    translated_name: null,
    translated_short_name: null,
    details: null, //SmurfyMechDetails
  }

  var SmurfyMechDetails = {
    type: null,
    tons: null,
    top_speed: null,
    jump_jets: null,
    ecm: null,
    masc: null,
    tech_slots: null,
    weapon_mod_slots: null,
    consumable_slots: null,
    engine_range: null, //{min, max}
    hardpoints: null, //SmurfyMechHardpoints
    tuning_config: null, //SmurfyMechTuningConfig. Note: just mobility stats, ignored for now
    price: null, //{id, mc, cb}
    max_armor: null,
    quirks: null, //[SmurfyMechQuirk...]
  }

  var SmurfyMechHardpoints = { //hardpoint counts
    ams: null,
    beam: null,
    ballistic: null,
    missile: null,
    ecm: null,
  }

  var SmurfyQuirk = {
    name: null,
    translated_name: null,
    value: null,
  }

  //SmurfyWeaponData Classes
  var SmurfyWeaponData = {
    id: null,
    type: null, //BALLISTIC, BEAM
    tons: null,
    slots: null,
    price: null, //{id, mc, cb}
    name: null,
    translated_name: null,
    translated_desc: null,
    family: null,
    min_range: null,
    long_range: null,
    max_range: null,
    cooldown: null,
    speed: null,
    impulse: null,
    duration: null,
    heat: null,
    artemis_restricted_to: null,
    num_shots: null,
    calc_stats: null, //WeaponCalcStats
    min_heat_penalty_level: null,
    heat_penalty: null,
    heat_penalty_id: null,
    ammo_per_shot : null //added from addedweapondata.js
  }

  var SmurfyWeaponCalcStats = {
    damageMultiplier: null,
    baseDmg: null,
    dps: null,
    hps: null,
    ehs: null,
  }

  var SmurfyModuleData { //Common properties for SmurfyHeatsinkModuleData, SmurfyEngineModuleData
    id : null;
    type : null;
    name : null;
  }

  //ModuleData with type = CHeatSinkStats
  var SmurfyHeatsinkModuleData { //extends SmurfyModuleData
    stats : null; //HeatsinkStats
  }
  var SmurfyHeatsinkStats {
    cooling : null;
    engineCooling : null;
    heatbase : null;
    internal_heat_capacity : null; //added from addedheatsinkdata.js
    external_heat_capacity : null; //added from addedheatsinkdata.js
  }

  //ModuleData with type = CEngineStats
  var SmurfyEngineModuleData { //extends SmurfyModuleData
    stats : null;
  }
  var SmurfyEngineStats {
    rating : null;
    heatsinks : null;
  }

  var SmurfyAmmoData {
    id : null;
    type : null;
    name : null;
    num_shots : null;
    weapons : null; //weapons that use this ammo
  }
})();//namespace
