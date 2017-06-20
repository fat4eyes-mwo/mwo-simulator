"use strict";

//Classes representing smurfy types. Only used for reference and autocompletion

var SmurfyTypes = SmurfyTypes || (function () {

  //Loadout types
  var MechLoadout = {
    id: null, //loadout id used in smurfy get param
    mech_id: null, //used to refer to MechData.id
    configuration: null, //[MechComponent...]
    upgrades: null, //[MechUpgrade]
    stats: null, //MechStats
  }

  //a mech component (e.g. center torso)
  var MechComponent = {
    name: null, //values are from MechModel.Component
    armor: null,
    actuators: null, //[MechComponentItem...]
    items: null, //[MechComponentItem...]
  }

  var MechComponentItem = {
    id: null, //refers to WeaponData.id, ModuleData.id, AmmoData.id
    type: null,
    name: null,
  }

  //Endo/Ferro/DoubleHeatsinks/Artemis
  var MechUpgrade = {
    id: null, //no reference
    type: null,
    name: null,
  }

  var MechStats = {
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
    armaments: null, //[MechArmamentEntry...]
    ammunition: null,
    equipment: null, //[MechEquipmentEntry...]
  }

  var MechArmamentEntry = {
    id: null, //Refers to WeaponData.id
    type: null,
    name: null,
    count: null,
  }

  var MechEquipmentEntry = {
    id: null, //Refers to ModuleData.id
    type: null,
    name: null,
    count: null,
  }

  //MechData classes
  var MechData = {
    id: null,
    name: null,
    faction: null,
    mech_type: null, //light, medium, heavy, assault
    family: null, //short name for chassis
    chassis_translated: null, //long name for chassis
    translated_name: null,
    translated_short_name: null,
    details: null, //MechDetails
  }

  var MechDetails = {
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
    hardpoints: null, //MechHardpoints
    tuning_config: null, //MechTuningConfig. Note: just mobility stats, ignored for now
    price: null, //{id, mc, cb}
    max_armor: null,
    quirks: null, //[MechQuirk...]
  }

  var MechHardpoints = { //hardpoint counts
    ams: null,
    beam: null,
    ballistic: null,
    missile: null,
    ecm: null,
  }

  var MechQuirk = {
    name: null,
    translated_name: null,
    value: null,
  }

  //WeaponData Classes
  var WeaponData = {
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
  }

  var WeaponCalcStats = {
    damageMultiplier: null,
    baseDmg: null,
    dps: null,
    hps: null,
    ehs: null,
  }

  var ModuleData { //Common properties for HeatsinkModuleData, EngineModuleData
    id : null;
    type : null;
    name : null;
  }

  //ModuleData with type = CHeatSinkStats
  var HeatsinkModuleData { //extends ModuleData
    stats : null; //HeatsinkStats
  }
  var HeatsinkStats {
    cooling : null;
    engineCooling : null;
    heatbase : null;
  }

  //ModuleData with type = CEngineStats
  var EngineModuleData { //extends ModuleData
    stats : null;
  }
  var EngineStats {
    rating : null;
    heatsinks : null;
  }

  var AmmoData {
    id : null;
    type : null;
    name : null;
    num_shots : null;
    weapons : null; //weapons that use this ammo
  }
})();//namespace
