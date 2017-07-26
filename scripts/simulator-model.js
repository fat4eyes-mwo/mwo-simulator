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

  var isRearComponent = function(component) {
    return component === Component.LEFT_TORSO_REAR ||
        component === Component.CENTRE_TORSO_REAR ||
        component === Component.RIGHT_TORSO_REAR;
  };

  const WeaponCycle = Object.freeze({
    READY : "Ready",
    FIRING : "Firing",
    DISABLED : "Disabled",
    COOLDOWN : "Cooldown",
    COOLDOWN_FIRING : "CooldownFiring", //Double tap while on cooldown
    SPOOLING : "Spooling",
    JAMMED : "Jammed",
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

  const EngineType = {
    STD : "std",
    XL : "xl",
    CLAN_XL : "clan_xl",
    LIGHT : "light",
  };

  var SmurfyWeaponData = {};
  var SmurfyAmmoData = {};
  var SmurfyModuleData = {};
  var SmurfyMechData = {};
  var SmurfyOmnipodData = {};
  var SmurfyCTOmnipods = {};
  var mechTeams = {};
  mechTeams[Team.BLUE] = [];
  mechTeams[Team.RED] = [];
  var teamStats = {}; //format is {<team> : <teamStats>}
  var mechIdMap = {};

  class MechInfo {
    constructor(mechId, smurfyMechLoadout) {
      this.mechId = mechId;
      this.smurfyMechId = smurfyMechLoadout.mech_id;
      this.smurfyLoadoutId = smurfyMechLoadout.id;
      var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
      this.mechName = smurfyMechData.name;
      this.mechTranslatedName = smurfyMechData.translated_name;
      this.tons = smurfyMechData.details.tons;
      //NOTE: Quirks should be set before creating WeaponInfos
      if (isOmnimech(smurfyMechLoadout)) {
        this.quirks = MechModelQuirks.collectOmnipodQuirks(smurfyMechLoadout);
      } else {
        this.quirks = smurfyMechData.details.quirks;
      }
      //NOTE: General quirk bonus must be computed before collecting heatsinks
      //(bonus is used in computing heatdissipation)
      this.generalQuirkBonus = MechModelQuirks.getGeneralBonus(this.quirks);
      this.mechHealth = mechHealthFromSmurfyMechLoadout(smurfyMechLoadout, this.quirks);
      this.weaponInfoList = weaponInfoListFromSmurfyMechLoadout(smurfyMechLoadout, this);
      this.heatsinkInfoList = heatsinkListFromSmurfyMechLoadout(smurfyMechLoadout);
      this.ammoBoxList = ammoBoxListFromSmurfyMechLoadout(smurfyMechLoadout);
      this.engineInfo = engineInfoFromSmurfyMechLoadout(smurfyMechLoadout);
    }
  }

  class Heatsink {
    constructor(location, smurfyModuleData) {
      this.location = location;
      this.heatsinkId = smurfyModuleData.id;
      this.name = smurfyModuleData.name;
      this.active = true;
      this.cooling = smurfyModuleData.stats.cooling;
      this.engineCooling = smurfyModuleData.stats.engineCooling;
      this.internalHeatCapacity = smurfyModuleData.stats.internal_heat_capacity;
      this.externalHeatCapacity = smurfyModuleData.stats.external_heat_capacity;

      //keep smurfy module data for cloning
      this.smurfyModuleData = smurfyModuleData;
    }
    clone() {
      return new Heatsink(this.location, this.smurfyModuleData);
    }
  }

  //Reference for damage mechanics:
  //http://mwomercs.com/forums/topic/176345-understanding-damage/
  //TODO: Find a non-random way to simulate critical hits
  class MechHealth {
    constructor(componentHealth) {
      //TODO: try to get rid of this componentHealth list
      this.componentHealth = componentHealth; //[ComponentHealth...]
      this.componentHealthMap = {};
      for (let component of componentHealth) {
        this.componentHealthMap[component.location] = component;
      }
    }
    getComponentHealth(location) {
      return this.componentHealthMap[location];
    }
    isIntact(location) {
      return this.getComponentHealth(location).isIntact();
    }
    takeDamage(location, numDamage) {
      return this.componentHealthMap[location].takeDamage(numDamage);
    }
    totalCurrHealth() {
      let ret = 0;
      for (let componentHealthEntry of this.componentHealth) {
        ret = Number(ret) + componentHealthEntry.totalCurrHealth();
      }
      return ret;
    }
    totalMaxHealth() {
      let ret = 0;
      for (let componentHealthEntry of this.componentHealth) {
        ret = Number(ret) + componentHealthEntry.totalMaxHealth();
      }
      return ret;
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
    isIntact() {
      return this.structure > 0;
    }
    //returns a ComponentDamage with actual damage dealt
    //NOTE: Does not take rear components into account
    takeDamage(numDamage) {
      let ret = new ComponentDamage(this.location, 0, 0);
      if (numDamage <= this.armor) {
        this.armor = Number(this.armor) - numDamage;
        ret.addArmorDamage(numDamage);
        numDamage = 0;
      } else if (numDamage > this.armor) {
        numDamage = Number(numDamage) - Number(this.armor);
        ret.addArmorDamage(this.armor);
        this.armor = 0;
      }
      if (!isRearComponent(this.location)) {
        if (numDamage <= this.structure) {
          ret.addStructureDamage(numDamage);
          this.structure = Number(this.structure) - numDamage;
          numDamage = 0;
        } else {
          ret.addStructureDamage(this.structure);
          numDamage = Number(numDamage) - Number(this.structure);
          this.structure = 0;
        }
      } else {
        //TODO: Deal with rear structure damage
      }
      return ret;
    }
    totalCurrHealth() {
      return Number(this.armor) +
          ((this.structure) ? Number(this.structure) : 0); //special case for undefined structure in rear components
    }
    totalMaxHealth() {
      return Number(this.maxArmor) +
        ((this.maxStructure) ? Number(this.maxStructure) : 0); //special case for undefined structure in rear components
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
    constructor(mechInfo) {
      this.mechInfo = mechInfo;
      this.mechHealth = mechInfo.mechHealth.clone();
      this.heatState = new HeatState(mechInfo);
      this.weaponStateList = initWeaponStateList(this);
      this.ammoState = new AmmoState(mechInfo);

      this.updateTypes = {}; //Update types triggered on the current simulation step
      this.ghostHeatMap = {}; //weaponId -> [GhostHeatEntry]. Used in ghost heat computations.
      this.mechStats = new MechStats(); //stats set in simulation logic
    }
    setUpdate(updateType) {
      this.updateTypes[updateType] = true;
    }
    isAlive() {
      let mechHealth = this.mechHealth;
      let engineInfo = this.mechInfo.engineInfo;
      return mechHealth.isIntact(Component.HEAD) &&
        mechHealth.isIntact(Component.CENTRE_TORSO) &&
        (mechHealth.isIntact(Component.LEFT_LEG)
            || mechHealth.isIntact(Component.RIGHT_LEG)) &&
        //xl engine implies both torsos still intact
        (!(engineInfo.getEngineType() === EngineType.XL) ||
            (mechHealth.isIntact(Component.LEFT_TORSO)
            && mechHealth.isIntact(Component.RIGHT_TORSO))) &&
        //clan xl engine implies at least one side torso is intact
        (!(engineInfo.getEngineType() === EngineType.CLAN_XL ||
            engineInfo.getEngineType() === EngineType.LIGHT) ||
            (mechHealth.isIntact(Component.LEFT_TORSO)
            || mechHealth.isIntact(Component.RIGHT_TORSO)));
    }
    //Takes damage to components specified in weaponDamage.
    //Returns a MechDamage object that describes how much damage the mech took
    //MechDamage includes damage from destroyed components
    //reference: http://mwomercs.com/forums/topic/176345-understanding-damage/
    takeDamage(weaponDamage) {
      let totalDamage = new MechDamage();
      for (let location in weaponDamage.damageMap) {
        let numDamage = weaponDamage.getDamage(location);
        //apply damage to location
        let componentDamage = this.mechHealth.takeDamage(location, numDamage);
        totalDamage.addComponentDamage(componentDamage);


        //destroy components if necessary
        if (!this.mechHealth.isIntact(location) && componentDamage.totalDamage() > 0) {
          if (numDamage > componentDamage.totalDamage()) {
            let transferDamage = numDamage - componentDamage.totalDamage();
            let transferLocation = getTransferDamageLocation(location);
            if (transferLocation) {
              let transferResult = this.mechHealth.takeDamage(transferLocation, transferDamage);
              totalDamage.addComponentDamage(transferResult);
            }
          }

          let destroyComponentDamage = this.destroyComponent(location, false);
          totalDamage.add(destroyComponentDamage);
          //destroy connected arms if torsos are destroyed
          if (location === Component.LEFT_TORSO) {
            destroyComponentDamage = this.destroyComponent(Component.LEFT_ARM, true);
            totalDamage.add(destroyComponentDamage);
          } else if (location === Component.RIGHT_TORSO) {
            destroyComponentDamage = this.destroyComponent(Component.RIGHT_ARM, true);
            totalDamage.add(destroyComponentDamage);
          }
          //update heatStat changes due to component destruction
          this.updateHeatStats(location);
        }
      }
      return totalDamage;
    }

    //Disables all weapons, heatsinks and ammoboxes in a component.
    //Also destroys adjacent arm components if the component is a torso
    //Returns a MechDamage that contains any extra damage caused by
    //the component destruction
    //includeArmor is true if the remaining armor shoud be added to the component
    //destruction damage (i.e. when destroying arms after a torso destruction)
    destroyComponent(location, includeArmor) {
      let destructionDamage = new MechDamage();
      let componentHealth = this.mechHealth.getComponentHealth(location);

      //add remaining structure to destruction damage.
      let structureDamage = componentHealth.structure;
      let armorDamage = includeArmor ? componentHealth.armor : 0;
      destructionDamage.addComponentDamage(
          new ComponentDamage(location, armorDamage, structureDamage));

      //reduce the component health values
      componentHealth.structure = 0;
      if (includeArmor) {
          componentHealth.armor = 0;
      }

      //disable weapons in the component
      this.disableWeapons(location);
      //disable heatsinks in the component
      this.disableHeatsinks(location);

      //disable ammoboxes in the component
      let disabledAmmo = this.ammoState.disableAmmoBoxes(location);
      if (disabledAmmo.length > 0) {
        this.setUpdate(UpdateType.WEAPONSTATE);
      }

      return destructionDamage;
    }

    disableWeapons(location) {
      for (let weaponState of this.weaponStateList) {
        let weaponInfo = weaponState.weaponInfo;
        if (weaponInfo.location === location) {
          weaponState.gotoState(WeaponCycle.DISABLED);
          this.setUpdate(UpdateType.WEAPONSTATE);
        }
      }
    }

    disableHeatsinks(location) {
      for (let heatsink of this.heatState.currHeatsinkList) {
        if (heatsink.location === location) {
          heatsink.active = false;
          this.setUpdate(UpdateType.HEAT);
        }
      }
    }

    //update heat stats on component destruction
    updateHeatStats(location) {
      //reduce engine heat efficiency if clan xl engine
      let engineInfo = this.heatState.engineInfo;
      let heatState = this.heatState;
      if (engineInfo.getEngineType() === EngineType.CLAN_XL ||
          engineInfo.getEngineType() === EngineType.LIGHT) {
        if (location === Component.LEFT_TORSO ||
            location === Component.RIGHT_TORSO) {
          heatState.engineHeatEfficiency = Number(_MechGlobalGameInfo.clan_reduced_xl_heat_efficiency);

        }
      }
      //recompute heat stats
      let heatStats = calculateHeatStats(
            heatState.currHeatsinkList,
            heatState.engineInfo,
            heatState.engineHeatEfficiency,
            this.mechInfo.generalQuirkBonus);
      heatState.currHeatDissipation = heatStats.heatDissipation;
      heatState.currMaxHeat = heatStats.heatCapacity;
      this.setUpdate(UpdateType.HEAT);
    }

    clearMechStats() {
      this.mechStats = new MechStats();
    }

    getTotalDamageAtRange(range, stepDuration) {
      let totalDamage = 0;
      for (let weaponState of this.weaponStateList) {
        if (!weaponState.active) {
          continue;
        }
        totalDamage += Number(weaponState.weaponInfo.damageAtRange(range, stepDuration));
      }
      return totalDamage;
    }
  }

  class HeatState {
    constructor(mechInfo) {
      this.currHeat = 0;
      this.engineHeatEfficiency = 1;
      let heatStats = calculateHeatStats(
              mechInfo.heatsinkInfoList,
              mechInfo.engineInfo,
              this.engineHeatEfficiency,
              mechInfo.generalQuirkBonus);
      console.log("Heatcalc: " + mechInfo.mechName
                + " dissipation: " + heatStats.heatDissipation
                + " capacity: " + heatStats.heatCapacity);
      this.currHeatDissipation = heatStats.heatDissipation;
      this.currMaxHeat = heatStats.heatCapacity;
      //Copy engine info from mech info
      this.engineInfo = mechInfo.engineInfo.clone();
      //Copy heatsink info from mech info
      this.currHeatsinkList = [];
      for (let heatsink of mechInfo.heatsinkInfoList) {
        this.currHeatsinkList.push(heatsink.clone());
      }
    }
  }

  class AmmoState {
    constructor(mechInfo) {
      let sourceAmmoBoxList = mechInfo.ammoBoxList;
      this.ammoCounts = {}; //weaponId->AmmoCount
      this.ammoBoxList = [];

      for (let ammoBox of sourceAmmoBoxList) {
        this.ammoBoxList.push(ammoBox.clone());
      }

      //sort ammoBoxList in ammo consumption order so the lists in the ammoCounts
      //are also sorted in consumption order
      //reference: https://mwomercs.com/forums/topic/65553-guide-ammo-depleting-priorities-or-in-what-order-is-your-ammo-being-used/
      let ammoLocationOrderIndex = function(location) {
        const locationOrder =
          [Component.HEAD, Component.CENTRE_TORSO, Component.RIGHT_TORSO, Component.LEFT_TORSO,
            Component.LEFT_ARM, Component.RIGHT_ARM, Component.LEFT_LEG, Component.RIGHT_LEG];
        let idx = 0;
        for (idx = 0; idx < locationOrder.length; idx++) {
          if (location === locationOrder[idx]) {
            return idx;
          }
        }
      }
      this.ammoBoxList.sort((x, y) => {
        return ammoLocationOrderIndex(x.location) -
                  ammoLocationOrderIndex(y.location);
      });

      for (let idx in this.ammoBoxList) {
        let ammoBox = this.ammoBoxList[idx];
        let firstWeaponId = ammoBox.weaponIds[0];
        //Create an ammocount for the weapon if it is not yet in the map
        if (!this.ammoCounts[firstWeaponId]) {
          let newAmmoCount = new AmmoCount();
          this.ammoCounts[firstWeaponId] = newAmmoCount;
          //Map all the weapons that can use the ammo to the ammo count
          for (let weaponId of ammoBox.weaponIds) {
            this.ammoCounts[weaponId] = newAmmoCount;
          }
        }
        //Add the ammoBox to the ammoCount for the weapon
        this.ammoCounts[firstWeaponId].addAmmoBox(ammoBox);
      }
    }

    //returns the amount of ammo available for a given weapon id.
    ammoCountForWeapon(weaponId) {
      let ammoCount = this.ammoCounts[weaponId];
      if (ammoCount) {
        return ammoCount.ammoCount;
      } else {
        return 0;
      }
    }

    //tries to consume a given amount of ammo for a weaponInfo
    //returns the amount of ammo actually consumed
    consumeAmmo(weaponId, amount) {
      let ammoCount = this.ammoCounts[weaponId];
      if (ammoCount) {
        return ammoCount.consumeAmmo(amount);
      } else {
        return 0;
      }
    }

    //Disables ammo boxes and reduces the corresponding AmmoCount
    //Returns the set of disabled ammo boxes
    disableAmmoBoxes(location) {
      let ret = [];
      for (let ammoBox of this.ammoBoxList) {
        if (ammoBox.location === location) {
          ammoBox.intact = false;
          let firstWeaponId = ammoBox.weaponIds[0];
          let ammoCount = this.ammoCounts[firstWeaponId];
          ammoCount.ammoCount = Number(ammoCount.ammoCount) - Number(ammoBox.ammoCount);
          ammoBox.ammoCount = 0;
          ret.push(ammoBox);
        }
      }
      return ret;
    }
  }

  //The amount of ammo for a given set of weapons
  class AmmoCount {
    constructor() {
      this.weaponIds = [];
      this.ammoCount = 0; //Total ammo count of all the boxes in the ammoBoxList
      this.ammoBoxList = []; //[AmmoBox...]
      this.maxAmmoCount = 0;
      this.currAmmoBoxIdx = 0;
    }

    addAmmoBox(ammoBox) {
      this.weaponIds = ammoBox.weaponIds;
      this.ammoCount += Number(ammoBox.ammoCount);
      this.maxAmmoCount += Number(ammoBox.ammoCount);
      this.ammoBoxList.push(ammoBox);
    }

    //tries to consume a given amount of ammo. returns the actual amount of ammo
    //consumed
    consumeAmmo(amount) {
      let amountConsumed = 0;
      while (amount > 0 && this.currAmmoBoxIdx < this.ammoBoxList.length) {
        let currAmmoBox = this.ammoBoxList[this.currAmmoBoxIdx];
        if (currAmmoBox.intact) {
          //If box contains enough ammo
          if (currAmmoBox.ammoCount >= amount) {
            amountConsumed += Number(amount);
            currAmmoBox.ammoCount -= Number(amount);
            amount = 0;
            break;
          } else {
          //if box does not contain enough ammo, consume what remains
          //and proceed to the next box
            amountConsumed += currAmmoBox.ammoCount;
            amount -= currAmmoBox.ammoCount;
            currAmmoBox.ammoCount = 0;
          }
        }
        this.currAmmoBoxIdx++;
      }
      this.ammoCount -= amountConsumed; //update the total ammo count
      return amountConsumed;
    }
  }

  //Represents an ammo box on the mech.
  class AmmoBox {
    constructor(type, location, weaponIds, ammoCount, intact) {
      this.type = type;
      this.location = location;
      this.weaponIds = weaponIds; //[weaponId...]
      this.ammoCount = ammoCount;
      this.intact = intact;
    }
    clone() {
      return new AmmoBox(this.type,
        this.location,
        this.weaponIds,
        this.ammoCount,
        this.intact);
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
    getEngineType() {
      let engineType;
      let engineMap = {
        "Engine_Std" : EngineType.STD,
        "Engine_XL" : EngineType.XL,
        "Engine_Clan_XL" : EngineType.CLAN_XL,
        "Engine_Light" : EngineType.LIGHT,
      }
      for (let enginePrefix in engineMap) {
        if (this.name.startsWith(enginePrefix)) {
          return engineMap[enginePrefix];
        }
      }
      throw "Unknown engine type. Name: " + name;
    }
  }

  //represents damage done to a mech
  //A map from MechModel.Components -> ComponentDamage
  class MechDamage {
    constructor() {
      this.componentDamage = {}; //Component->ComponentDamage
    }
    add(mechDamage) {
      for (let location in mechDamage.componentDamage) {
        if (!this.componentDamage[location]) {
          this.componentDamage[location] = new ComponentDamage(location, 0, 0);
        }
        this.componentDamage[location].add(mechDamage.componentDamage[location]);
      }
    }
    addComponentDamage(componentDamage) {
      let location = componentDamage.location;
      if (!this.componentDamage[location]) {
        this.componentDamage[location] = new ComponentDamage(location, 0, 0);
      }
      this.componentDamage[location].add(componentDamage);
    }
    getComponentDamage(location) {
      return this.componentDamage[location];
    }
    totalDamage() {
      let ret = 0;
      for (let component in this.componentDamage) {
        ret = Number(ret) + this.componentDamage[component].totalDamage();
      }
      return ret;
    }
    toString() {
      let ret = "";
      for (let location in this.componentDamage) {
        ret = ret + " " + this.componentDamage[location].toString();
      }
      return ret;
    }
  }

  class ComponentDamage {
    constructor(location, armor, structure) {
      this.location = location;
      if (armor) {
        this.armor = armor;
      } else {
        this.armor = 0;
      }
      if (structure) {
        this.structure = structure;
      } else {
        this.structure = 0;
      }
    }
    add(componentDamage) {
      this.armor += Number(componentDamage.armor);
      this.structure += Number(componentDamage.structure);
      return this;
    }
    addArmorDamage(damage) {
      this.armor += Number(damage);
    }
    addStructureDamage(damage) {
      this.structure += Number(damage);
    }
    totalDamage() {
      return Number(this.armor) + Number(this.structure);
    }
    toString() {
      return "location: " + this.location + " armordmg: " + this.armor + " structdmg: " + this.structure;
    }
  }

  //Damage dealt by a weapon.
  class WeaponDamage {
    constructor(damageMap) {
      this.damageMap = damageMap; //MechModel.Component -> Number
    }
    getDamage(component) {
      return this.damageMap[component];
    }
    multiply(multiplier) {
      for (var location in this.damageMap) {
        this.damageMap[location] =
            Number(this.damageMap[location]) * Number(multiplier);
      }
    }
    getTotalDamage() {
      let totalDamage = 0;
      for (let component in this.damageMap) {
        totalDamage += this.damageMap[component];
      }
      return totalDamage;
    }
    toString() {
      let ret = "totalDamage: " + this.getTotalDamage();
      for (let component in this.damageMap) {
        ret = ret + " " + component + "=" + this.damageMap[component];
      }
      return ret;
    }
    clone() {
      var newDamageMap = {};
      for (let component in this.damageMap) {
        newDamageMap[component] = this.damageMap[component];
      }
      return new WeaponDamage(newDamageMap);
    }
  }

  //TODO: Try to move this out of model due to its dependence on WeaponFire
  //Or move WeaponFire here
  const BURST_DAMAGE_INTERVAL = 2000; //Interval considered for burst damage calculation
  class MechStats {
    constructor() {
      this.totalDamage = 0;
      this.totalHeat = 0;
      //list of completed weaponFires. Assumed to be sorted in
      //ascending order of createTime
      this.weaponFires = [];
      this.timeOfDeath = null;
    }
    //assumes simTime >= createTime of last element in the weaponFire list
    getBurstDamage(simTime) {
      let burstDamage = 0;
      for (let idx = this.weaponFires.length - 1; idx > 0; idx--) {
        let weaponFire = this.weaponFires[idx];
        if (simTime - weaponFire.createTime < BURST_DAMAGE_INTERVAL) {
          burstDamage += weaponFire.damageDone.totalDamage();
        } else {
          break;
        }
      }
      return burstDamage;
    }
  }

  class TeamStats {
    constructor() {
      this.maxBurstDamage = 0;
    }
  }

  //Get weapon, ammo and mech data from smurfy
  const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
  const WEAPON_DATA_PATH = "data/weapons.json";
  const AMMO_DATA_PATH = 'data/ammo.json';
  const MODULE_DATA_PATH = 'data/modules.json';
  const MECH_DATA_PATH = 'data/mechs.json';
  const OMNIPOD_DATA_PATH = 'data/omnipods.json';
  var dataPaths = [WEAPON_DATA_PATH , AMMO_DATA_PATH, MODULE_DATA_PATH,
                    MECH_DATA_PATH, OMNIPOD_DATA_PATH];
  var dataPathAssigns = {};

  var initDataPromise = function(path) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url : SMURFY_PROXY_URL + path,
        type : 'GET',
        dataType : 'JSON'
        })
        .done(function(data) {
          console.log("Successfully loaded " + path);
          resolve(data);
        })
        .fail(function(data) {
          console.log("Smurfy " + path + " request failed: " + Error(data));
          reject(Error(data));
        });
    });
  }

  //NOTE: Process the omnipod data so the omnipod ID is the
  //main index (instead of the chassis name)
  //also finds the CT omnipods and puts them in a set->omnipod map
  var flattenOmnipodData = function(smurfyOmnipodData) {
    let flatOmnipodData = {};
    let ctOmnipodMap = {};
    for (let chassis in smurfyOmnipodData) {
      for (let omnipodId in smurfyOmnipodData[chassis]) {
        let omnipodEntry = smurfyOmnipodData[chassis][omnipodId];
        flatOmnipodData[omnipodId] = omnipodEntry;
        if (omnipodEntry.details.component === "centre_torso") {
          ctOmnipodMap[omnipodEntry.details.set] = omnipodEntry
        }
      }
    }
    return {flatOmnipodData : flatOmnipodData, ctOmnipodMap : ctOmnipodMap};
  }
  var initModelData = function () {
    //assigns to the correct variable
    dataPathAssigns[WEAPON_DATA_PATH] = function(data) {
      SmurfyWeaponData = data;
    };
    dataPathAssigns[AMMO_DATA_PATH] = function(data) {
      SmurfyAmmoData = data;
    };
    dataPathAssigns[MODULE_DATA_PATH] = function(data) {
      SmurfyModuleData = data;
    };
    dataPathAssigns[MECH_DATA_PATH] = function(data) {
      SmurfyMechData = data;
    };
    dataPathAssigns[OMNIPOD_DATA_PATH] = function(data) {
      let flatData = flattenOmnipodData(data);
      SmurfyOmnipodData = flatData.flatOmnipodData;
      SmurfyCTOmnipods = flatData.ctOmnipodMap;
    }

    let initPromises = [];
    for (let path of dataPaths) {
      initPromises.push(initDataPromise(path));
    }

    let loadAllInitData = Promise.all(initPromises);
    return loadAllInitData.then(function(dataArray) {
      for (let idx in dataArray) {
        let path = dataPaths[idx];
        dataPathAssigns[path](dataArray[idx]);
      }
      initAddedData();
    });
  }

  var initAddedData = function() {
    initHeatsinkIds();
    initAddedHeatsinkData();
    initAddedWeaponData();
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
    let flatData = flattenOmnipodData(_DummyOmnipods);
    SmurfyOmnipodData = flatData.flatOmnipodData;
    SmurfyCTOmnipods = flatData.ctOmnipodMap;
    initAddedData();
  };

  var getSmurfyMechData = function(smurfyMechId) {
    return SmurfyMechData[smurfyMechId];
  };

  var getSmurfyWeaponData = function(smurfyItemId) {
    return SmurfyWeaponData[smurfyItemId];
  }

  var smurfyWeaponNameMap = {};
  var getSmurfyWeaponDataByName = function(smurfyName) {
    if (smurfyWeaponNameMap[smurfyName]) {
      return smurfyWeaponNameMap[smurfyName];
    }
    for (let id in SmurfyWeaponData) {
      let smurfyWeapon = SmurfyWeaponData[id];
      if (smurfyName === smurfyWeapon.name) {
        smurfyWeaponNameMap[smurfyName] = smurfyWeapon;
        return smurfyWeaponNameMap[smurfyName];
      }
    }
    return null;
  }

  var getSmurfyModuleData = function(smurfyModuleId) {
    return SmurfyModuleData[smurfyModuleId];
  }

  var getSmurfyAmmoData = function(smurfyItemId) {
    return SmurfyAmmoData[smurfyItemId];
  }

  var getSmurfyOmnipodData = function(smurfyOmnipodId) {
    return SmurfyOmnipodData[smurfyOmnipodId];
  }

  var getSmurfyCTOmnipod = function(mechName) {
    return SmurfyCTOmnipods[mechName];
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

  //Object creation methods.
  //TODO: see if it's better to put these in the object constructors instead
  var mechHealthFromSmurfyMechLoadout = function (smurfyMechLoadout, quirks) {
    var mechHealth;

    var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
    var tonnage = smurfyMechData.details.tons;
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
    let bonus = MechModelQuirks.getArmorStructureBonus(location, smurfyMechQuirks);
    componentHealth = new ComponentHealth(location,
                                  Number(armor) + Number(bonus.armor),
                                  Number(structure) + Number(bonus.structure),
                                  Number(armor) + Number(bonus.armor),
                                  Number(structure) + Number(bonus.structure));
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

  var weaponInfoListFromSmurfyMechLoadout = function (smurfyMechLoadout, mechInfo) {
    var weaponInfoList = [];
    weaponInfoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) {
        if (smurfyMechComponentItem.type ==="weapon") {
          let weaponId = smurfyMechComponentItem.id;
          let smurfyWeaponData = getSmurfyWeaponData(weaponId);
          let weaponInfo = new MechModelWeapons.WeaponInfo(weaponId, location,
                                        smurfyWeaponData, mechInfo);
          return weaponInfo;
        } else {
          return null;
        }
    });
    return weaponInfoList;
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

    let heatsink = new Heatsink(location, smurfyModuleData);
    return heatsink;
  }

  var ammoBoxListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
    var ammoList = [];
    ammoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) {
        if (smurfyMechComponentItem.type === "ammo") {
          let ammoBox = ammoBoxFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
          return ammoBox;
        } else {
          return null;
        }
      }
    );
    return ammoList;
  }

  var ammoBoxFromSmurfyMechComponentItem = function(location, smurfyMechComponentItem) {
    var ammoBox;
    let ammoData = getSmurfyAmmoData(smurfyMechComponentItem.id);
    let type = ammoData.type;
    let ammoCount = ammoData.num_shots;
    let weaponIds = ammoData.weapons;
    ammoBox = new AmmoBox(type, location, weaponIds, ammoCount, true);

    return ammoBox;
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
    //NOTE: The true number of engine internal heatsinks is computed by subtracting
    //the number of external heatsinks from the smurfy stats heatsink count.
    //This is because fixed internal heatsinks (e.g. on omnimechs) dont appear as
    //items in the cetre_torso of smurfyLoadout.configuration.
    let externalHeatsinkCount = numExternalHeatsinks(smurfyMechLoadout);
    let smurfyHeatsinkCount = Number(smurfyMechLoadout.stats.heatsinks);
    let heatsinkCount = smurfyHeatsinkCount - externalHeatsinkCount;
    let heatsink = new Heatsink(Component.CENTRE_TORSO, getSmurfyModuleData(engineHeatsinkId));
    let engineInfo = new EngineInfo(engineId, name, heatsink, heatsinkCount);
    return engineInfo;
  }

  var isOmnimech = function(smurfyMechLoadout) {
    for (let component of smurfyMechLoadout.configuration) {
      if (component.omni_pod) {
        return true;
      }
    }
    return false;
  }

  var numExternalHeatsinks = function(smurfyMechLoadout) {
    let heatsinkList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) {
        let itemId = smurfyMechComponentItem.id;
        if (isHeatsinkModule(itemId) && location !== Component.CENTRE_TORSO) {
          let heatsink = heatsinkFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
          return heatsink;
        } else {
          return null;
        }
      });
    return heatsinkList.length;
  }

  //Calculates the total heat capacity and heat dissipation from a mechInfo
  var calculateHeatStats = function (heatsinkInfoList, engineInfo,
                                      engineHeatEfficiency, generalQuirkBonus) {
    const BASE_HEAT_CAPACITY = 30;
    let heatCapacity = BASE_HEAT_CAPACITY;
    let heatDissipation = 0;

    //non-fixed heatsinks
    for (let heatsink of heatsinkInfoList) {
      if (!heatsink.active) continue;
      if (heatsink.location === Component.CENTRE_TORSO) {
      //NOTE: internal non-fixed heatsinks are included in the engine heatsink count
        // heatCapacity += Number(heatsink.internalHeatCapacity);
        // heatDissipation += Number(heatsink.engineCooling);
      } else {
      //external non-fixed
        heatCapacity += Number(heatsink.externalHeatCapacity);
        heatDissipation += Number(heatsink.cooling)
      }
    }

    //engine heatsinks
    let engineHeatsink = engineInfo.heatsink;
    heatCapacity += Number(engineInfo.heatsinkCount) *
                    Number(engineHeatsink.internalHeatCapacity);
    //Only dissipation is affected by engine efficiency
    heatDissipation += Number(engineInfo.heatsinkCount) *
                      Number(engineHeatsink.engineCooling) *
                      Number(engineHeatEfficiency);
    let heatDissipationMultiplier = 1.0;
    //TODO: Find the difference between heatloss and heatdissipation
    if (generalQuirkBonus.heatloss_multiplier) {
      heatDissipationMultiplier += generalQuirkBonus.heatloss_multiplier;
    }
    if (generalQuirkBonus.heatdissipation_multiplier) {
      heatDissipationMultiplier += generalQuirkBonus.heatdissipation_multiplier;
    }
    heatDissipation = heatDissipation * heatDissipationMultiplier;
    return {
      "heatCapacity" : heatCapacity ,
      "heatDissipation" : heatDissipation
    };
  }

  var initWeaponStateList = function(mechState) {
    var weaponStateList = [];
    let mechInfo = mechState.mechInfo;
    for (let weaponInfo of mechInfo.weaponInfoList) {
      let weaponState = null;
      if (weaponInfo.hasDuration()) {
        weaponState =
          new MechModelWeapons.WeaponStateDurationFire(weaponInfo, mechState);
      } else if (weaponInfo.isContinuousFire()) {
        weaponState =
          new MechModelWeapons.WeaponStateContinuousFire(weaponInfo, mechState);
      } else {
        //single-fire
        if (weaponInfo.isOneShot) {
          weaponState =
            new MechModelWeapons.WeaponStateOneShot(weaponInfo, mechState);
        } else {
          weaponState =
            new MechModelWeapons.WeaponStateSingleFire(weaponInfo, mechState);
        }
      }
      weaponStateList.push(weaponState);
    }
    return weaponStateList;
  }

  //constructor
  var Mech = function (new_mech_id, team, smurfyMechLoadout) {
    var smurfy_mech_id = smurfyMechLoadout.mech_id;
    var smurfyMechData = getSmurfyMechData(smurfy_mech_id);
    var mech_id = new_mech_id;
    var mechInfo = new MechInfo(new_mech_id, smurfyMechLoadout);
    var mechState = new MechState(mechInfo);
    var mechTeam = team;
    var targetMech; //set by simulation
    return {
      firePattern : null, //Set after initialization
      componentTargetPattern : null, //Set after initialization
      mechTargetPattern : null, //set after initialization
      accuracyPattern : null, //set after initialization
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
        mechState = new MechState(mechInfo);
      },
      getMechTeam : function() {
        return mechTeam;
      },
      setTargetMech : function(newTarget) {
        targetMech = newTarget;
      },
      getTargetMech : function() {
        return targetMech;
      }
    };
  };

  var addMech = function(mech_id, team, smurfyMechLoadout) {
    var newMech = new Mech(mech_id, team, smurfyMechLoadout);
    mechTeams[team].push(newMech);
    console.log("Added mech mech_id: " + mech_id +
      " translated_mech_name: " + newMech.getTranslatedName());
    initMechPatterns(newMech);
    return newMech;
  };

  var addMechAtIndex = function(mech_id, team, smurfyMechLoadout, index) {
    var newMech = new Mech(mech_id, team, smurfyMechLoadout);
    mechTeams[team][index] = newMech;
    console.log("Added mech mech_id: " + mech_id
      + " translated_mech_name: " + newMech.getTranslatedName()
      + " at index " + index);
    initMechPatterns(newMech);
    return newMech;
  }

  var deleteMech = function(mech_id, team) {
    let mechList = mechTeams[team];
    for (let mechIdx in mechList) {
      let mech = mechList[mechIdx];
      if (mech.getMechId() === mech_id) {
        mechList.splice(mechIdx, 1);
        return true;
      }
    }
    return false;
  }

  //Debug, set default mech patterns
  var initMechTeamPatterns = function(mechTeam) {
    for (let mech of mechTeam) {
      initMechPatterns(mech);
    }
  }
  var initMechPatterns = function(mech) {
    mech.firePattern = MechFirePattern.getDefault();
    mech.componentTargetPattern = MechTargetComponent.getDefault();
    mech.mechTargetPattern = MechTargetMech.getDefault();
    mech.accuracyPattern = MechAccuracyPattern.getDefault();
  }


  var generateMechId = function(smurfyMechLoadout) {
    let smurfyMechData =
      MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
    let mechName = smurfyMechData.name;
    let rand = function() {
      return Math.floor(Math.random() * 0x10000).toString(16);
    }
    let newMechId = mechName + "-" +
        rand() + "-" + rand() + "-" + rand() + "-" + rand();
    while (mechIdMap[newMechId]) {
      newMechId = newMechId = mechName +
          rand() + "-" + rand() + "-" + rand() + "-" + rand();
      mechIdMap[newMechId] = true;
    }
    return newMechId;
  }

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

  var isTeamAlive = function(team) {
    let mechTeam = mechTeams[team];
    for (let mech of mechTeam) {
      if (mech.getMechState().isAlive()) {
        return true;
      }
    }
    return false;
  }

  //called every time team-level statistics need to be updated (e.g. when a weapon hits)
  var updateModelTeamStats = function(team) {
    let totalTeamBurstDamage = 0;
    let teamStatEntry = teamStats[team];
    if (!teamStatEntry) {
      teamStatEntry = new TeamStats();
      teamStats[team] = teamStatEntry;
    }
    for (let mech of mechTeams[team]) {
      let burstDamage = mech.getMechState().mechStats.getBurstDamage(MechSimulatorLogic.getSimTime());
      totalTeamBurstDamage += burstDamage;
    }
    if (totalTeamBurstDamage > teamStatEntry.maxBurstDamage) {
      teamStatEntry.maxBurstDamage = totalTeamBurstDamage;
    }
  }

  var getTeamStats = function(team) {
    return teamStats[team];
  }

  //returns {"i"=<id>, "l"=<loadout>}
  var parseSmurfyURL = function(url) {
    let urlMatcher = /https?:\/\/mwo\.smurfy-net\.de\/mechlab#i=([0-9]+)&l=([a-z0-9]+)/;
    let results = urlMatcher.exec(url);
    if (results) {
      let id = results[1];
      let loadout = results[2];
      if (id && loadout) {
        return {"id" : id, "loadout" : loadout};
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  var loadSmurfyMechLoadoutFromURL = function(url) {
    let params = parseSmurfyURL(url);
    if (!params) {
      return null;
    }
    return loadSmurfyMechLoadoutFromID(params.id, params.loadout);
  }

  var loadSmurfyMechLoadoutFromID = function(smurfyId, smurfyLoadoutId) {
    let ret = new Promise(function(resolve, reject) {
      var smurfyLoadoutURL = SMURFY_PROXY_URL + "data/mechs/" + smurfyId
          + "/loadouts/" + smurfyLoadoutId + ".json";
      $.ajax({
          url : smurfyLoadoutURL,
          type : 'GET',
          dataType : 'JSON'
      })
      .done(function(data) {
        resolve(data);
      })
      .fail(function(data) {
        reject(Error(data));
      });
    });
    return ret;
  }

  //returns a list of adjacent components
  //MechModel.Component -> [MechModel.Component...]
  var getAdjacentComponents = function(component) {
    if (component === Component.HEAD) {
      return [];
    } else if (component === Component.CENTRE_TORSO) {
      return [Component.LEFT_TORSO, Component.RIGHT_TORSO];
    } else if (component === Component.LEFT_TORSO) {
      return [Component.CENTRE_TORSO, Component.LEFT_ARM];
    } else if (component === Component.RIGHT_TORSO) {
      return [Component.CENTRE_TORSO, Component.RIGHT_ARM];
    } else if (component === Component.RIGHT_ARM) {
      return [Component.RIGHT_TORSO];
    } else if (component === Component.LEFT_ARM) {
      return [Component.LEFT_TORSO];
    } else if (component === Component.LEFT_LEG) {
      return [Component.LEFT_TORSO];
    } else if (component === Component.RIGHT_LEG) {
      return [Component.RIGHT_TORSO];
    }
    return [];
  }

  var getTransferDamageLocation = function(component) {
    if (component === Component.HEAD) {
      return null;
    } else if (component === Component.CENTRE_TORSO) {
      return null;
    } else if (component === Component.LEFT_TORSO) {
      return Component.CENTRE_TORSO;
    } else if (component === Component.RIGHT_TORSO) {
      return Component.CENTRE_TORSO;
    } else if (component === Component.RIGHT_ARM) {
      return Component.RIGHT_TORSO;
    } else if (component === Component.LEFT_ARM) {
      return Component.LEFT_TORSO;
    } else if (component === Component.LEFT_LEG) {
      return Component.LEFT_TORSO;
    } else if (component === Component.RIGHT_LEG) {
      return Component.RIGHT_TORSO;
    }
  }

  var getMechFromId = function(mechId, team) {
    //TODO: add a map if this method gets called often
    for (let mech of mechTeams[team]) {
      if (mechId === mech.getMechId()) {
        return mech;
      }
    }
    return null;
  }

  var clearModel = function() {
    mechTeams[Team.BLUE] = [];
    mechTeams[Team.RED] = [];
    teamStats = {};
  }

  //public members
  return {
    Component: Component,
    WeaponCycle: WeaponCycle,
    Team : Team,
    Faction : Faction,
    UpdateType : UpdateType,
    EngineType : EngineType,
    MechDamage : MechDamage,
    WeaponDamage : WeaponDamage,
    Mech : Mech,
    MechInfo : MechInfo,
    BURST_DAMAGE_INTERVAL: BURST_DAMAGE_INTERVAL,
    mechTeams : mechTeams,
    initModelData : initModelData,
    initDummyModelData : initDummyModelData,
    initAddedData : initAddedData,
    addMech : addMech,
    addMechAtIndex : addMechAtIndex,
    deleteMech : deleteMech,
    clearModel : clearModel,
    generateMechId : generateMechId,
    initMechPatterns: initMechPatterns,
    initMechTeamPatterns : initMechTeamPatterns,
    resetState : resetState,
    isTeamAlive : isTeamAlive,
    getAdjacentComponents : getAdjacentComponents,
    updateModelTeamStats: updateModelTeamStats,
    getTeamStats: getTeamStats,
    getMechFromId: getMechFromId,
    isOmnimech: isOmnimech,
    //Note: made public only because of testing. Should not be accessed outside this module
    baseMechStructure : baseMechStructure,
    baseMechArmor : baseMechArmor,

    //smurfy data helper functions.
    getSmurfyMechData : getSmurfyMechData,
    getSmurfyWeaponData : getSmurfyWeaponData,
    getSmurfyWeaponDataByName : getSmurfyWeaponDataByName,
    getSmurfyModuleData : getSmurfyModuleData,
    getSmurfyAmmoData : getSmurfyAmmoData,
    getSmurfyOmnipodData: getSmurfyOmnipodData,
    getSmurfyCTOmnipod: getSmurfyCTOmnipod,
    loadSmurfyMechLoadoutFromURL : loadSmurfyMechLoadoutFromURL,
    loadSmurfyMechLoadoutFromID : loadSmurfyMechLoadoutFromID,
  };

})(); //namespace end
