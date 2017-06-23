"use strict";

//Classes that represent the states of the mechs in the simulation,
//and methos to populate them from smurfy data
var MechModel = MechModel || (function () {

  const Team = Object.freeze({
    BLUE : "blue",
    RED : "red"
  });

  const Component = Object.freeze({
    HEAD : "head",
    RIGHT_ARM :"right_arm",
    RIGHT_TORSO : "right_torso",
    CENTRE_TORSO : "centre_torso",
    LEFT_ARM : "left_arm",
    LEFT_TORSO : "left_torso",
    RIGHT_LEG : "right_leg",
    LEFT_LEG : "left_leg",
    LEFT_TORSO_REAR : "left_torso_rear",
    CENTRE_TORSO_REAR : "centre_torso_rear",
    RIGHT_TORSO_REAR : "right_torso_rear"
  });

  const WeaponCycle = Object.freeze({
    READY : "Ready",
    FIRING : "Firing",
    DISABLED : "Disabled",
    COOLDOWN : "Cooldown",
    SPOOLING : "Spooling"
  });

  const Faction = Object.freeze({
    INNER_SPHERE : "InnerSphere",
    CLAN : "Clan"
  });

  const UpdateType = {
    FULL : "full",
    HEALTH : "health",
    HEAT : "heat",
    COOLDOWN : "cooldown",
    WEAPONSTATE : "weaponstate",
    STATS : "stats"
  };

  class MechInfo {
    constructor(mechId, mechName, mechTranslatedName, mechHealth, weaponInfoList, heatsinkInfoList, ammoInfo, engineInfo) {
      this.mechId = mechId;
      this.mechName = mechName;
      this.mechTranslatedName = mechTranslatedName;
      this.mechHealth = mechHealth;
      this.weaponInfoList = weaponInfoList; //[WeaponInfo...]
      this.heatsinkInfoList = heatsinkInfoList; //[Heatsink...]
      this.ammoInfo = ammoInfo; //[AmmoInfo...]
      this.engineInfo = engineInfo;
    }
  }

  class WeaponInfo {
    constructor(weaponId, name, translatedName, location,
      minRange, optRange, maxRange, baseDmg,
      heat, minHeatPenaltyLevel, heatPenalty, heatPenaltyId,
      cooldown, duration, spinup, speed, ammoPerShot) {
        this.weaponId = weaponId; //smurfy weapon id
        this.name = name;
        this.translatedName = translatedName;
        this.location = location;
        this.minRange = minRange;
        this.optRange = optRange;
        this.maxRange = maxRange;
        this.baseDmg = baseDmg;
        this.heat = heat;
        this.minHeatPenaltyLevel = minHeatPenaltyLevel;
        this.heatPenalty = heatPenalty;
        this.heatPenaltyId = heatPenaltyId; //weapons with the same heat penalty id caause ghost heat if above the minHeatPenaltyLevel
        this.cooldown = cooldown;
        this.duration = duration;
        this.spinup = spinup;
        this.speed = speed;
        this.ammoPerShot = ammoPerShot;
      }
  }

  class Heatsink {
    constructor(heatsinkId, name, active, location, cooling, engineCooling, internalHeatCapacity, externalHeatCapacity) {
      this.heatsinkId = heatsinkId;
      this.name = name;
      this.active = active;
      this.location = location;
      this.cooling = cooling;
      this.engineCooling = engineCooling;
      this.internalHeatCapacity = internalHeatCapacity;
      this.externalHeatCapacity = externalHeatCapacity;
    }
    clone() {
      return new Heatsink(this.heatsinkId,
        this.name,
        this.active,
        this.location,
        this.cooling,
        this.engineCooling,
        this.internalHeatCapacity,
        this.externalHeatCapacity);
    }
  }

  class MechHealth {
    constructor(componentHealth) {
      this.componentHealth = componentHealth; //[ComponentHealth...]
    }
    clone() {
      let newComponentHealth = [];
      for (let componentHealthEntry of this.componentHealth) {
        newComponentHealth.push(componentHealthEntry.clone());
      }
      return new MechHealth(newComponentHealth);
    }
  }

  class ComponentHealth {
    constructor(location, armor, structure, maxArmor, maxStructure) {
      this.location = location;
      this.armor = armor; //current armor. used in state
      this.structure = structure;
      this.maxArmor = maxArmor; //maximum armor from loadout
      this.maxStructure = maxStructure; //maximum structure from loadout
    }
    clone() {
      return new ComponentHealth(this.location,
        this.armor,
        this.structure,
        this.maxArmor,
        this.maxStructure);
    }
  }

  class MechState {
    constructor(mechHealth, heatState, weaponStateList, ammoState) {
      this.mechHealth = mechHealth;
      this.heatState = heatState;
      this.weaponStateList = weaponStateList; //[WeaponState...]
      this.ammoState = ammoState;
      this.updateTypes = {}; //Update types triggered on the current simulation step
    }
  }

  class HeatState {
    constructor(currHeat, currMaxHeat, currHeatDissapation, currHeatsinkInfo, engineInfo, engineHeatEfficiency) {
      this.currHeat = currHeat;
      this.currMaxHeat = currMaxHeat; //computed value, must be consistent with heatsinkInfo + engine
      this.currHeatDissapation = currHeatDissapation; //computed value, must be consistent with heatsinkInfo + engine
      this.currHeatsinkInfo = currHeatsinkInfo; //[Heatsink...]
      this.engineInfo = engineInfo;
      this.engineHeatEfficiency = engineHeatEfficiency; //0 to 1
    }
  }

  class WeaponState {
    constructor(weaponInfo, active, weaponCycle, cooldownLeft, spoolupLeft, durationLeft) {
      this.weaponInfo = weaponInfo;
      this.active = active; //boolean
      this.weaponCycle = weaponCycle;
      this.cooldownLeft = cooldownLeft; //cooldown time left in ms
      this.spoolupLeft = spoolupLeft;
      this.durationLeft = durationLeft;
    }
    gotoState(weaponCycle, mech) {
      this.weaponCycle = weaponCycle;
      this.cooldownLeft = 0;
      this.spoolupLeft = 0;
      this.durationLeft = 0;
      if (weaponCycle === WeaponCycle.READY) {
        //do nothing
      } else if (weaponCycle === WeaponCycle.FIRING) {
        this.durationLeft = this.computeWeaponDuration(this.weaponInfo.duration);
      } else if (weaponCycle === WeaponCycle.COOLDOWN) {
        this.cooldownLeft = this.computeWeaponCooldown(this.weaponInfo.cooldown);
      } else if (weaponCycle === WeaponCycle.SPOOLING) {
        this.spoolupLeft = Number(this.weaponInfo.spinup);
      } else if (weaponCycle === WeaponCycle.DISABLED) {
        //set cooldown to max so it displays properly in the view
        this.cooldownLeft = Number(this.weaponInfo.cooldown);
        this.active = false;
      }
    }
    //Computes the cooldown for this weapon on a mech, taking modifiers into account
    computeWeaponCooldown(mech) {
      return Number(this.weaponInfo.cooldown);
    }

    //Computes this weapon's duration on a mech, taking modifiers into account
    computeWeaponDuration(mech) {
      return Number(this.weaponInfo.duration);
    }

  }

  class AmmoState {
    constructor(ammoCounts, ammoInfo) {
      this.ammoCounts = ammoCounts; //weaponId->AmmoCount
      this.ammoInfo = ammoInfo; //[AmmoInfo...]
    }
  }

  class AmmoCount {
    constructor(weaponIds, ammoCount) {
      this.weaponIds = weaponIds; //[weaponId...]
      this.ammoCount = ammoCount; //rounds left
      this.maxAmmoCount = 0; //Set during initialization
    }
  }

  class AmmoInfo {
    constructor(type, location, weaponIds, ammoCount) {
      this.type = type;
      this.location = location;
      this.weaponIds = weaponIds; //[weaponId...]
      this.ammoCount = ammoCount;
    }
    clone() {
      return new AmmoInfo(this.type,
        this.location,
        this.weaponIds,
        this.ammoCount);
    }
  }

  class EngineInfo {
    constructor(engineId, name, heatsink, heatsinkCount) {
      this.engineId = engineId; //Same as module id in smurfy ModuleData
      this.name = name; //Readable name, from smurfy ModuleData
      this.heatsink = heatsink; //heatsink object that represents the type of heatsinks in the engine
      this.heatsinkCount = heatsinkCount;
    }
    clone() {
      return new EngineInfo(this.engineId,
        this.name,
        this.heatsink.clone(),
        this.heatsinkCount);
    }
  }

  var SmurfyWeaponData = {};
  var SmurfyAmmoData = {};
  var SmurfyMechData = {};
  var SmurfyModuleData = {};
  var mechTeams = {};
  mechTeams[Team.BLUE] = [];
  mechTeams[Team.RED] = [];

  //Get weapon, ammo and mech data from smurfy
  //TODO: JSONP not working because smurfy's server doesn't support it. Work around it using a local proxy.
  var WEAPON_DATA_URL = "http://mwo.smurfy-net.de/api/data/weapons.json";
  var AMMO_DATA_URL = "http://mwo.smurfy-net.de/api/data/ammo.json";
  var LOADOUT_DATA_URL = "http:/mwo.smurfy-net.de/api/data/mechs/{ID}/loadouts/{LOADOUTID}.json";
  var dataLoaded = (function() {
    return {
      weaponsLoaded : false, //true when the request in successfully completed
      ammoLoaded : false,
      weaponsDone : false, //true when the request is finished (success or fail)
      ammoDone : false,
      isLoaded : function () {
        return this.weaponsLoaded && this.ammoLoaded;
      },
      isDone : function () {
        return this.weaponsDone && this.ammoDone;
      }
    };
  })();
  var initModelData = function (callback) {
    //Get weapon data
    $.ajax({
      url : WEAPON_DATA_URL,
      type : 'GET',
      dataType : 'JSONP'
      })
      .done(function (data) {
        console.log("Success " +data);
        MechModel.dataLoaded.weaponsLoaded = true;
      })
      .fail(function (data) {
        console.log("Request failed: " + data);
      })
      .always(function (data) {
        MechModel.dataLoaded.weaponsDone = true;
        if (MechModel.dataLoaded.isDone()) {
          callback(MechModel.dataLoaded.isLoaded());
        }
      });
    $.ajax({
      url : AMMO_DATA_URL,
      type : 'GET',
      dataType : 'JSONP'
      })
      .done(function (data) {
        console.log("Success " +data);
        MechModel.dataLoaded.ammoLoaded = true;
      })
      .fail(function (data) {
        console.log("Request failed: " + data);
      })
      .always(function (data) {
        MechModel.dataLoaded.ammoDone = true;
        if (MechModel.dataLoaded.isDone()) {
          callback(MechModel.dataLoaded.isLoaded());
        }
      });
  }

  const ISHeatsinkName = "HeatSink_MkI";
  const ISDoubleHeatsinkName = "DoubleHeatSink_MkI";
  const ClanDoubleHeatsinkName = "ClanDoubleHeatSink";
  var ISSingleHeatsinkId;
  var ISDoubleHeatsinkId;
  var ClanDoubleHeatsinkId;
  const heatsinkType = "CHeatSinkStats";
  var initHeatsinkIds = function() {
    for (let moduleId in SmurfyModuleData) {
      let moduleData = SmurfyModuleData[moduleId];
      if (moduleData.type === heatsinkType) {
        if (moduleData.name === ISHeatsinkName) {
          ISSingleHeatsinkId = moduleId;
        } else if (moduleData.name === ISDoubleHeatsinkName) {
          ISDoubleHeatsinkId = moduleId;
        } else if (moduleData.name === ClanDoubleHeatsinkName) {
          ClanDoubleHeatsinkId = moduleId;
        }
      }
    }
  }

  //add additional data to heatsink moduledata
  //Addditional data can be found in data/addedheatsinkdata.js
  var initAddedHeatsinkData = function() {
    for (let idx in SmurfyModuleData) {
      let moduleData = SmurfyModuleData[idx];
      if (moduleData.type === "CHeatSinkStats") {
        let addedData = _AddedHeatsinkData[moduleData.name];
        $.extend(moduleData.stats, addedData);
      }
    }
  }

  //adds fields to smurfy weapon data
  //additional data can be found in data/addedweapondata.js
  var initAddedWeaponData = function() {
    for (let idx in SmurfyWeaponData) {
      let weaponData = SmurfyWeaponData[idx];
      let addedData = _AddedWeaponData[weaponData.name];
      $.extend(weaponData, addedData);
    }
  }

  //Load dummy data from javascript files in data folder
  var initDummyModelData = function() {
    SmurfyWeaponData = DummyWeaponData;
    SmurfyAmmoData = DummyAmmoData;
    SmurfyMechData = DummyMechData;
    SmurfyModuleData = DummyModuleData;
    initHeatsinkIds();
    initAddedHeatsinkData();
    initAddedWeaponData();
  };

  var getSmurfyMechData = function(smurfyMechId) {
    return SmurfyMechData[smurfyMechId];
  };

  var getSmurfyWeaponData = function(smurfyItemId) {
    return SmurfyWeaponData[smurfyItemId];
  }

  var getSmurfyModuleData = function(smurfyModuleId) {
    return SmurfyModuleData[smurfyModuleId];
  }

  var getSmurfyAmmoData = function(smurfyItemId) {
    return SmurfyAmmoData[smurfyItemId];
  }

  var isHeatsinkModule = function(smurfyModuleId) {
    let smurfyModuleData = getSmurfyModuleData(smurfyModuleId);
    return smurfyModuleData && smurfyModuleData.type === "CHeatSinkStats";
  }

  var isEngineModule = function(smurfyModuleId) {
    let smurfyModuleData = getSmurfyModuleData(smurfyModuleId);
    return smurfyModuleData && smurfyModuleData.type === "CEngineStats";
  }

  //base structure value computation for a given tonnage.
  //Reference: http://mwo.gamepedia.com/Internal_Structure
  var baseMechStructure = function(location, tonnage) {
    return _MechBaseStructure[tonnage][location];
  }

  var baseMechArmor = function(location, tonnage) {
    if (location === Component.HEAD) {
      return baseMechStructure(location, tonnage);
    } else {
      return baseMechStructure(location, tonnage) * 2;
    }
  }

  var mechInfoFromSmurfyMechLoadout = function (mechId, smurfyMechLoadout) {
    var mechInfo;

    var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
    var mechName = smurfyMechData.name;
    var mechTranslatedName = smurfyMechData.translated_name;
    var mechHealth = mechHealthFromSmurfyMechLoadout(smurfyMechLoadout);
    var weaponInfoList = weaponInfoListFromSmurfyMechLoadout(smurfyMechLoadout);
    var heatsinkInfoList = heatsinkListFromSmurfyMechLoadout(smurfyMechLoadout);
    var ammoInfo = ammoInfoListFromSmurfyMechLoadout(smurfyMechLoadout);
    var engineInfo = engineInfoFromSmurfyMechLoadout(smurfyMechLoadout);

    mechInfo = new MechInfo(mechId, mechName, mechTranslatedName, mechHealth, weaponInfoList, heatsinkInfoList, ammoInfo, engineInfo);
    return mechInfo;
  }

  var mechHealthFromSmurfyMechLoadout = function (smurfyMechLoadout) {
    var mechHealth;

    var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
    var tonnage = smurfyMechData.details.tons;
    var quirks = smurfyMechData.details.quirks;
    var componentHealthList = [];
    for (let smurfyMechComponent of smurfyMechLoadout.configuration) {
      let componentHealth = componentHealthFromSmurfyMechComponent(smurfyMechComponent, quirks, tonnage);
      componentHealthList.push(componentHealth);
    }
    mechHealth = new MechHealth(componentHealthList);

    return mechHealth;
  }

  var componentHealthFromSmurfyMechComponent = function (smurfyMechComponent, smurfyMechQuirks, tonnage) {
    var componentHealth; //return value

    var location = smurfyMechComponent.name;
    var armor = smurfyMechComponent.armor;
    var structure = baseMechStructure(location, tonnage);
    //TODO: Add quirk values to armor and structure
    componentHealth = new ComponentHealth(location, armor, structure, armor, structure);
    return componentHealth;
  }

  //returns a list from a smurfy configuration list using a collectionFunction
  //collectFunction paramters are (location, smurfyMechComponentItem)
  //and returns a value if it is to be added to the list, undefined/null if not
  var collectFromSmurfyConfiguration = function (smurfyMechConfiguration, collectFunction) {
    var outputList = [];
    for (let smurfyMechComponent of smurfyMechConfiguration) {
      let location = smurfyMechComponent.name;
      for (let smurfyMechComponentItem of smurfyMechComponent.items) {
        let entry = collectFunction(location, smurfyMechComponentItem)
        if (entry) {
          outputList.push(entry);
        }
      }
    }
    return outputList;
  }

  var weaponInfoListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
    var weaponInfoList = [];
    weaponInfoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) {
        if (smurfyMechComponentItem.type ==="weapon") {
          let weaponId = smurfyMechComponentItem.id;
          let smurfyWeaponData = getSmurfyWeaponData(weaponId);
          let weaponInfo = weaponInfoFromSmurfyWeaponData(weaponId, location, smurfyWeaponData);
          return weaponInfo;
        } else {
          return null;
        }
    });
    return weaponInfoList;
  }

  var weaponInfoFromSmurfyWeaponData = function (weaponId, location, smurfyWeaponData) {
    let name = smurfyWeaponData.name;
    let translatedName = smurfyWeaponData.translated_name;
    let minRange = smurfyWeaponData.min_range;
    let optRange = smurfyWeaponData.long_range;
    let maxRange = smurfyWeaponData.max_range;
    let baseDmg = smurfyWeaponData.calc_stats.baseDmg;
    let heat = smurfyWeaponData.heat;
    let minHeatPenaltyLevel = smurfyWeaponData.min_heat_penalty_level;
    let heatPenalty = smurfyWeaponData.heat_penalty;
    let heatPenaltyId = smurfyWeaponData.heat_penalty_id;
    //Our cooldown/duration/spinup values are in milliseconds, smurfy is in seconds
    let cooldown = Number(smurfyWeaponData.cooldown) * 1000;
    let duration = Number(smurfyWeaponData.duration) * 1000;
    let spinup = 0 * 1000; //TODO: Populate spinup value for Gauss, RACs
    let speed = smurfyWeaponData.speed;
    let ammoPerShot = smurfyWeaponData.ammo_per_shot ?
          smurfyWeaponData.ammo_per_shot : 0;

    let weaponInfo = new WeaponInfo(
      weaponId, name, translatedName, location,
      minRange, optRange, maxRange, baseDmg,
      heat, minHeatPenaltyLevel, heatPenalty, heatPenaltyId,
      cooldown, duration, spinup, speed, ammoPerShot
    );
    return weaponInfo;
  }

  var heatsinkListFromSmurfyMechLoadout = function(smurfyMechLoadout) {
    var heatsinkList = [];
    heatsinkList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) {
        let itemId = smurfyMechComponentItem.id;
        if (isHeatsinkModule(itemId)) {
          let heatsink = heatsinkFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
          return heatsink;
        } else {
          return null;
        }
      });
    return heatsinkList;
  }

  var heatsinkFromSmurfyMechComponentItem = function (location, smurfyMechComponentItem) {
    let heatsinkId = smurfyMechComponentItem.id;
    let smurfyModuleData = getSmurfyModuleData(heatsinkId);

    let heatsink = heatsinkFromModuleData(location, smurfyModuleData);
    return heatsink;
  }

  var heatsinkFromModuleData = function (location, smurfyModuleData) {
    let heatsinkId = smurfyModuleData.id;
    let name = smurfyModuleData.name;
    let active = true;
    let cooling = smurfyModuleData.stats.cooling;
    let engineCooling = smurfyModuleData.stats.engineCooling;
    let internalHeatCapacity = smurfyModuleData.stats.internal_heat_capacity;
    let externalHeatCapacity = smurfyModuleData.stats.external_heat_capacity;

    let heatsink = new Heatsink(heatsinkId, name, active, location,
        cooling, engineCooling,
        internalHeatCapacity, externalHeatCapacity);
    return heatsink;
  }

  var ammoInfoListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
    var ammoList = [];
    ammoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) {
        if (smurfyMechComponentItem.type === "ammo") {
          let ammoInfo =ammoInfoFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
          return ammoInfo;
        } else {
          return null;
        }
      }
    );
    return ammoList;
  }

  var ammoInfoFromSmurfyMechComponentItem = function(location, smurfyMechComponentItem) {
    var ammoInfo;

    let ammoData = getSmurfyAmmoData(smurfyMechComponentItem.id);
    let type = ammoData.type;
    let ammoCount = ammoData.num_shots;
    let weaponIds = ammoData.weapons;
    ammoInfo = new AmmoInfo(type, location, weaponIds, ammoCount);

    return ammoInfo;
  }


  //Gets the heatsink module id of the heatsinks in the engine.
  //Uses direct name matching because there doesn't seem to be an id reference
  //from the heatsink upgrade items to the associated heatsink
  var getEngineHeatsinkId = function(smurfyMechLoadout) {
    var upgradeToIdMap = {
      "STANDARD HEAT SINK" : ISSingleHeatsinkId,
      "DOUBLE HEAT SINK" : ISDoubleHeatsinkId,
      "CLAN DOUBLE HEAT SINK" : ClanDoubleHeatsinkId
    };
    for (let mechUpgrade of smurfyMechLoadout.upgrades) {
      if (mechUpgrade.type === "HeatSink") {
        return upgradeToIdMap[mechUpgrade.name];
      }
    }
    return null; //should not happen
  }
  var getEngineSmurfyModuleData = function(smurfyMechLoadout) {
    for (let equipment of smurfyMechLoadout.stats.equipment) {
      let equipmentModuleData = getSmurfyModuleData(equipment.id);
      if (equipmentModuleData.type === "CEngineStats") {
        return equipmentModuleData;
      }
    }
    return null;//should not happen
  }

  var isClanXLEngine = function(smurfyModuleData) {
     return smurfyModuleData.name.startsWith("Engine_Clan") &&
      smurfyModuleData.type === "CEngineStats";
  }
  var engineInfoFromSmurfyMechLoadout = function(smurfyMechLoadout) {
    let smurfyEngineData = getEngineSmurfyModuleData(smurfyMechLoadout);
    let engineId = smurfyEngineData.id;
    let name = smurfyEngineData.name;
    let engineHeatsinkId = getEngineHeatsinkId(smurfyMechLoadout);
    //Heatsink number in module data is total max heatsinks (iincluding slots).
    //Clan XLs have fixed heatsinks so they are included in the engine count, but
    //IS mechs have a default 10 heatsinks unless the slots are filled. Those heatsinks
    //are caught in the loadout.configuration pass.
    let heatsinkCount = isClanXLEngine(smurfyEngineData) ? smurfyEngineData.stats.heatsinks : 10;
    let heatsink = heatsinkFromModuleData(Component.CENTRE_TORSO, getSmurfyModuleData(engineHeatsinkId));
    let engineInfo = new EngineInfo(engineId, name, heatsink, heatsinkCount);
    return engineInfo;
  }

  //state initialization methods
  var initMechState = function (mechInfo) {
    var mechState;

    var mechHealth = mechInfo.mechHealth.clone();
    var heatState = initHeatState(mechInfo);
    var weaponStateList = initWeaponStateList(mechInfo);
    var ammoState = initAmmoState(mechInfo);

    mechState = new MechState(mechHealth, heatState, weaponStateList, ammoState);
    return mechState;
  }

  //Calculates the total heat capacity and heat dissapation from a mechInfo
  var calculateHeatStats = function (mechInfo, engineHeatEfficiency) {
    const BASE_HEAT_CAPACITY = 30;
    let heatCapacity = BASE_HEAT_CAPACITY;
    let heatDissapation = 0;

    //non-fixed heatsinks
    for (let heatsink of mechInfo.heatsinkInfoList) {
      if (!heatsink.active) continue;
      if (heatsink.location === Component.CENTRE_TORSO) {
      //internal non-fixed
        heatCapacity += Number(heatsink.internalHeatCapacity);
        heatDissapation += Number(heatsink.engineCooling);
      } else {
      //external non-fixed
        heatCapacity += Number(heatsink.externalHeatCapacity);
        heatDissapation += Number(heatsink.cooling)
      }
    }

    //engine heatsinks
    let engineHeatsink = mechInfo.engineInfo.heatsink;
    heatCapacity += Number(mechInfo.engineInfo.heatsinkCount) *
                    Number(engineHeatsink.internalHeatCapacity) *
                    Number(engineHeatEfficiency);
    heatDissapation += Number(mechInfo.engineInfo.heatsinkCount) *
                      Number(engineHeatsink.engineCooling) *
                      Number(engineHeatEfficiency);

    //TODO: see where to get the data for fixed heatsinks

    return {
      "heatCapacity" : heatCapacity,
      "heatDissapation" : heatDissapation
    };
  }

  var initHeatState = function(mechInfo) {
    let currHeat = 0;
    let engineHeatEfficiency = 1;
    let heatStats = calculateHeatStats(mechInfo, engineHeatEfficiency);
    let currHeatDissapation = heatStats.heatDissapation;
    let currMaxHeat = heatStats.heatCapacity;
    //Copy engine info from mech info
    let engineInfo = mechInfo.engineInfo.clone();
    //Copy heatsink info from mech info
    let currHeatsinkInfo = [];
    for (let heatsink of mechInfo.heatsinkInfoList) {
      currHeatsinkInfo.push(heatsink.clone());
    }
    let heatState = new HeatState(currHeat, currMaxHeat, currHeatDissapation, currHeatsinkInfo, engineInfo, engineHeatEfficiency)
    return heatState;
  }

  var initWeaponStateList = function(mechInfo) {
    var weaponStateList = [];
    for (let weaponInfo of mechInfo.weaponInfoList) {
      weaponStateList.push(initWeaponState(weaponInfo));
    }
    return weaponStateList;
  }

  var initWeaponState = function(weaponInfo) {
    let active = true;
    let weaponCycle = WeaponCycle.READY;
    let cooldownLeft = 0;
    let spoolupLeft = 0;
    let durationLeft = 0;
    let weaponState = new WeaponState(weaponInfo, active, weaponCycle,
                              cooldownLeft, spoolupLeft, durationLeft);
    return weaponState;
  }

  var initAmmoState = function(mechInfo) {
    let ammoInfo = [];
    for (let ammoInfoEntry of mechInfo.ammoInfo) {
      ammoInfo.push(ammoInfoEntry.clone());
    }
    let ammoCounts = {}; //map from weaponId to AmmoCount
    for (let idx in ammoInfo) {
      let ammoInfoEntry = ammoInfo[idx];
      let firstWeaponId = ammoInfoEntry.weaponIds[0];
      //Create an ammocount for the weapon if it is not yet in the map, else
      //increment the ammocount
      if (!ammoCounts[firstWeaponId]) {
        let newAmmoCount = new AmmoCount(ammoInfoEntry.weaponIds, Number(ammoInfoEntry.ammoCount));
        ammoCounts[firstWeaponId] = newAmmoCount;
        //Map all the weapons that can use the ammo to the ammo count
        for (let weaponId of ammoInfoEntry.weaponIds) {
          ammoCounts[weaponId] = newAmmoCount;
          ammoCounts[weaponId].maxAmmoCount = ammoCounts[weaponId].ammoCount;
        }
      } else {
        ammoCounts[firstWeaponId].ammoCount += Number(ammoInfoEntry.ammoCount);
        ammoCounts[firstWeaponId].maxAmmoCount = ammoCounts[firstWeaponId].ammoCount;
      }
    }
    let ammoState = new AmmoState(ammoCounts, ammoInfo);
    return ammoState;
  }

  //constructor
  var Mech = function (new_mech_id, smurfyMechLoadout) {
    var smurfy_mech_id = smurfyMechLoadout.mech_id;
    var smurfyMechData = getSmurfyMechData(smurfy_mech_id);
    var mech_id = new_mech_id;
    var mechInfo = mechInfoFromSmurfyMechLoadout(new_mech_id, smurfyMechLoadout);
    var mechState = initMechState(mechInfo);
    return {
      getName : function() {
        return smurfyMechData.name;
      },
      getTranslatedName : function () {
        return smurfyMechData.translated_name;
      },
      getMechId : function() {
        return mech_id;
      },
      getMechInfo : function() {
        return mechInfo;
      },
      getMechState : function() {
        return mechState;
      },
      resetMechState : function() {
        mechState = initMechState(mechInfo);
      }
    };
  };

  var addMech = function(mech_id, team, smurfyMechLoadout) {
    var newMech = new Mech(mech_id, smurfyMechLoadout);
    mechTeams[team].push(newMech);
    console.log("addMech mech_id: " + mech_id +
      " translated_mech_name: " + newMech.getTranslatedName());
    return newMech;
  };

  //Resets the MechStates of all mechs to their fresh value
  var resetState = function() {
    let teams = [Team.BLUE, Team.RED];
    for (let team of teams) {
      let mechTeam = mechTeams[team];
      for (let mech of mechTeam) {
        mech.resetMechState();
      }
    }
  }

  //public members
  return {
    Component: Component,
    WeaponCycle: WeaponCycle,
    Team : Team,
    Faction : Faction,
    UpdateType : UpdateType,
    Mech : Mech,
    mechTeams : mechTeams,
    initModelData : initModelData,
    initDummyModelData : initDummyModelData,
    dataLoaded : dataLoaded,
    addMech : addMech,
    resetState : resetState,
    //Note: made public only because of testing. Should not be accessed outside this module
    baseMechStructure : baseMechStructure,
    baseMechArmor : baseMechArmor
  };

})(); //namespace end
