"use strict";

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
    LEFT_LEG : "left_leg"
  });

  const WeaponCycle = Object.freeze({
    ACTIVE : "Active",
    FIRING : "Firing",
    DISABLED : "Disabled",
    COOLDOWN : "Cooldown"
  });

  class MechInfo {
    constructor(mechId, mechName, mechHealth, weaponInfo, heatSinkInfo, engineInfo) {
      this.mechId = mechId;
      this.mechName = mechName;
      this.mechHealth = mechHealth;
      this.weaponInfo = weaponInfo; //[WeaponInfo...]
      this.heatSinkInfo = heatSinkInfo; //[Heatsink...]
      this.engineInfo = engineInfo;
    }
  }

  class WeaponInfo {
    constructor(weaponId, name, location,
      minRange, optRange, maxRange, baseDmg,
      heat, minHeatPenaltyLevel, heatPenalty, heatPenaltyId,
      cooldown, duration, spinup) {
        this.weaponId = weaponId; //smurfy weapon id
        this.name = name;
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
      }
  }

  class Heatsink {
    constructor(heatsinkId, active, location) {
      this.heatsinkId = heatsinkId;
      this.active = active;
      this.location = location;
    }
  }

  class MechHealth {
    constructor(componentHealth) {
      this.componentHealth = componentHealth; //[ComponentHealth...]
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
  }

  class MechState {
    constructor(mechHealth, heatState, weaponState, ammoState) {
      this.mechHealth = mechHealth;
      this.heatState = heatState;
      this.weaponState = weaponState;
      this.ammoState = ammoState;
    }
  }

  class HeatState {
    constructor(currHeat, currMaxHeat, currHeatDissapation, currHeatsinkInfo) {
      this.currHeat = currHeat;
      this.currMaxHeat = currMaxHeat;
      this.currHeatDissapation = currHeatDissapation;
      this.currHeatsinkInfo = currHeatsinkInfo;
    }
  }

  class WeaponState {
    constructor(weaponInfo, active, weaponCycle, cooldownLeft) {
      this.weaponInfo = weaponInfo;
      this.active = active; //boolean
      this.weaponCycle = weaponCycle;
      this.cooldownLeft = cooldownLeft; //cooldown time left in ms
    }
  }

  class AmmoState {
    constructor(ammoCounts, ammoInfo) {
      this.ammoCounts = ammoCounts; //weaponId->AmmoCount
      this.ammoInfo = ammoInfo; //[AmmoInfo...]
    }
  }

  class AmmoCount {
    constructor(weaponId, ammoCount) {
      this.weaponId = weaponId;
      this.ammoCount = ammoCount; //rounds left
    }
  }

  class AmmoInfo {
    constructor(weaponId, location, ammoCount) {
      this.weaponId = weaponId;
      this.location = location;
      this.ammoCount = ammoCount;
    }
  }

  class EngineInfo {
    constructor(engineId, name, heatsinkId, heatsinkCount) {
      this.engineId = engineId; //Same as module id in smurfy ModuleData
      this.name = name; //Readable name, from smurfy ModuleData
      this.heatsinkId; //id of the heatsink from smurfy ModuleData (i.e. single, double, clan double);
      this.heatsinkCount;
    }
  }

  var SmurfyWeaponData = {};
  var SmurfyAmmoData = {};
  var SmurfyMechData = {};
  var mechLists = {};
  mechLists[Team.BLUE] = [];
  mechLists[Team.RED] = [];

  //Get weapon, ammo and mech data from smurfy
  //TODO: JSONP not parsing the output correctly.
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

  //Load dummy data from javascript files in data folder
  var initDummyModelData = function() {
    SmurfyWeaponData = DummyWeaponData;
    SmurfyAmmoData = DummyAmmoData;
    SmurfyMechData = DummyMechData;
  };

  var getSmurfyMechData = function(smurfyMechId) {
    return SmurfyMechData[smurfyMechId];
  };

  var getSmurfyWeaponData = function(smurfyItemId) {
    return SmurfyWeaponData[smurfyItemId];
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
    var mechHealth = mechHealthFromSmurfyMechLoadout(smurfyMechLoadout);
    var weaponInfo = weaponInfoListFromSmurfyMechLoadout(smurfyMechLoadout);
    var heatSinkInfo = heatsinkListFromSmurfyMechLoadout(smurfyMechLoadout);
    var engineInfo = engineInfoFromSmurfyMechLoadout(smurfyMechLoadout);

    mechInfo = new MechInfo(mechId, mechName, mechHealth, weaponInfo, heatSinkInfo, engineInfo);
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

  var weaponInfoListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
    var weaponInfoList = [];
    var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
    //TODO: Implement
    for (let smurfyMechComponent of smurfyMechLoadout.configuration) {
      let location = smurfyMechComponent.name;
      for (let smurfyMechComponentItem of smurfyMechComponent.items) {
        if (smurfyMechComponentItem.type === "weapon") {
          let weaponId = smurfyMechComponentItem.id;
          let smurfyWeaponData = getSmurfyWeaponData(weaponId);
          let weaponInfo = weaponInfoFromSmurfyWeaponData(weaponId, location, smurfyWeaponData);
          weaponInfoList.push(weaponInfo);
        }
      }
    }
    return weaponInfoList;
  }

  var weaponInfoFromSmurfyWeaponData = function (weaponId, location, smurfyWeaponData) {
    let name = smurfyWeaponData.name;
    let minRange = smurfyWeaponData.min_range;
    let optRange = smurfyWeaponData.long_range;
    let maxRange = smurfyWeaponData.max_range;
    let baseDmg = smurfyWeaponData.calc_stats.baseDmg;
    let heat = smurfyWeaponData.heat;
    let minHeatPenaltyLevel = smurfyWeaponData.min_heat_penalty_level;
    let heatPenalty = smurfyWeaponData.heat_penalty;
    let heatPenaltyId = smurfyWeaponData.heat_penalty_id;
    let cooldown = smurfyWeaponData.cooldown;
    let duration = smurfyWeaponData.duration;
    let spinup = 0; //TODO: Populate spinup value for Gauss, RACs

    let weaponInfo = new WeaponInfo(
      weaponId, name, location,
      minRange, optRange, maxRange, baseDmg,
      heat, minHeatPenaltyLevel, heatPenalty, heatPenaltyId,
      cooldown, duration, spinup
    );
    return weaponInfo; //TODO: Implement
  }

  var heatsinkListFromSmurfyMechLoadout = function(smurfyMechLoadout) {
    return []; //TODO: Implement
  }

  var heatsinkFromSmurfyMechComponentItem = function (smurfyMechComponentItem) {
    return null; //TODO: Implement
  }

  var ammoInfoListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
    return null; //TODO: Implement
  }

  var ammoInfoFromSmurfyMechComponentItem = function(smurfyMechComponentItem) {
    return null; //TODO: Implement
  }

  var engineInfoFromSmurfyMechLoadout = function(smurfyMechLoadout) {
    return null; //TODO: Implement
  }

  //constructor
  var Mech = function (new_mech_id, smurfyMechLoadout) {
    var smurfy_mech_id = smurfyMechLoadout.mech_id;
    var smurfyMechData = getSmurfyMechData(smurfy_mech_id);
    var mech_id = new_mech_id;
    var mechInfo = mechInfoFromSmurfyMechLoadout(new_mech_id, smurfyMechLoadout);
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
      }
    };
  };

  var addMech = function(mech_id, team, smurfyMechLoadout) {
    var newMech = new Mech(mech_id, smurfyMechLoadout);
    mechLists[team].push(newMech);
    console.log("addMech mech_id: " + mech_id +
      " translated_mech_name: " + newMech.getTranslatedName());
  };

  //public members
  return {
    Component: Component,
    WeaponCycle: WeaponCycle,
    Team : Team,
    initModelData : initModelData,
    initDummyModelData : initDummyModelData,
    dataLoaded : dataLoaded,
    addMech : addMech,
    baseMechStructure : baseMechStructure,
    baseMechArmor : baseMechArmor
  };

})(); //namespace end
