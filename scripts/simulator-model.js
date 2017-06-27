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

  const EngineType = {
    STD : "std",
    XL : "xl",
    CLAN_XL : "clan_xl",
  };



  class MechInfo {
    constructor(mechId, mechName, mechTranslatedName, mechHealth,
      weaponInfoList, heatsinkInfoList, ammoBoxList, engineInfo, tons) {
      this.mechId = mechId;
      this.mechName = mechName;
      this.mechTranslatedName = mechTranslatedName;
      this.mechHealth = mechHealth;
      this.weaponInfoList = weaponInfoList; //[WeaponInfo...]
      this.heatsinkInfoList = heatsinkInfoList; //[Heatsink...]
      this.ammoBoxList = ammoBoxList; //[AmmoBox...]
      this.engineInfo = engineInfo;
      this.tons = tons;
    }
  }

  class WeaponInfo {
    constructor(weaponId, name, translatedName, location,
      minRange, optRange, maxRange, baseDmg, damageMultiplier,
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
        this.damageMultiplier = damageMultiplier;
        this.heat = heat;
        this.minHeatPenaltyLevel = minHeatPenaltyLevel;
        this.heatPenalty = heatPenalty;
        this.heatPenaltyId = heatPenaltyId; //weapons with the same heat penalty id caause ghost heat if above the minHeatPenaltyLevel
        this.cooldown = cooldown; //cooldown in milliseconds
        this.duration = duration; //duration in milliseconds
        this.spinup = spinup; //spinup in milliseconds
        this.speed = speed; //speed in m/s
        this.ammoPerShot = ammoPerShot;
      }
      hasDuration() {
        return Number(this.duration) > 0;
      }
      hasTravelTime() {
        return Number(this.speed) > 0;
      }
      requiresAmmo() {
        return this.ammoPerShot > 0;
      }
      damageAtRange(range) {
        let totalDamage = Number(this.baseDmg) * Number(this.damageMultiplier);
        if (Number(range) < Number(this.minRange)
            || Number(range) > Number(this.maxRange)) {
          return 0;
        }
        if (Number(this.minRange) <= Number(range) && Number(range) < Number(this.optRange)) {
          return Number(totalDamage);
        }
        if (Number(range) >= Number(this.optRange) && (Number(range) <= Number(this.maxRange))) {
          let optMaxDiff = Number(this.maxRange) - Number(this.optRange);
          let rangeOptDiff = Number(range) - Number(this.optRange);
          if (optMaxDiff === 0) {
            return Number(totalDamage);
          }
          return Number(totalDamage) * (1 - (rangeOptDiff / optMaxDiff));
        }
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
      if (numDamage <= this.structure) {
        ret.addStructureDamage(numDamage);
        this.structure = Number(this.structure) - numDamage;
        numDamage = 0;
      } else {
        ret.addStructureDamage(this.structure);
        numDamage = Number(numDamage) - Number(this.structure);
        this.structure = 0;
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
    constructor(mechInfo, mechHealth, heatState, weaponStateList, ammoState) {
      this.mechInfo = mechInfo;
      this.mechHealth = mechHealth;
      this.heatState = heatState;
      this.weaponStateList = weaponStateList; //[WeaponState...]
      this.ammoState = ammoState;
      this.updateTypes = {}; //Update types triggered on the current simulation step
      this.ghostHeatMap = {}; //weaponId -> [GhostHeatEntry]. Used in ghost heat computations.
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
        (!(engineInfo.getEngineType() === EngineType.CLAN_XL) ||
            (mechHealth.isIntact(Component.LEFT_TORSO)
            || mechHealth.isIntact(Component.RIGHT_TORSO)));
    }
    //Takes damage to components specified in weaponDamage.
    //Returns a MechDamage object that describes how much damage the mech took
    //MechDamage includes
    takeDamage(weaponDamage) {
      let totalDamage = new MechDamage();
      for (let location in weaponDamage.damageMap) {
        let numDamage = weaponDamage.getDamage(location);
        //apply damage to location
        let componentDamage = this.mechHealth.takeDamage(location, numDamage);
        totalDamage.addComponentDamage(componentDamage);
        //TODO: apply transfer damage to adjacent components

        //destroy components if necessary
        if (!this.mechHealth.isIntact(location)) {
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
          //update engine stat changes due to component destruction
          //i.e. reduce clan engine efficiency
          this.updateEngineHeatStats(location);
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
        this.updateTypes[UpdateType.WEAPONSTATE] = true;
      }

      return destructionDamage;
    }

    disableWeapons(location) {
      for (let weaponState of this.weaponStateList) {
        let weaponInfo = weaponState.weaponInfo;
        if (weaponInfo.location === location) {
          weaponState.gotoState(WeaponCycle.DISABLED);
          this.updateTypes[UpdateType.WEAPONSTATE] = true;
        }
      }
    }

    disableHeatsinks(location) {
      for (let heatsink of this.heatState.currHeatsinkList) {
        if (heatsink.location === location) {
          heatsink.active = false;
          this.updateTypes[UpdateType.HEAT] = true;
        }
      }
    }

    updateEngineHeatStats(location) {
      //reduce engine heat efficiency if clan xl engine
      let engineInfo = this.heatState.engineInfo;
      let heatState = this.heatState;
      if (engineInfo.getEngineType() === EngineType.CLAN_XL) {
        if (location === Component.LEFT_TORSO ||
            location === Component.RIGHT_TORSO) {
          heatState.engineHeatEfficiency = Number(_MechGlobalGameInfo.clan_reduced_xl_heat_efficiency);
          //recompute heat stats
          let heatStats = calculateHeatStats(
                heatState.currHeatsinkList,
                heatState.engineInfo,
                heatState.engineHeatEfficiency);
          heatState.currHeatDissapation = heatStats.heatDissapation;
          heatState.currMaxHeat = heatStats.heatCapacity;
          this.updateTypes[UpdateType.HEAT];
        }
      }
    }


  }

  class HeatState {
    constructor(currHeat, currMaxHeat, currHeatDissapation, currHeatsinkList, engineInfo, engineHeatEfficiency) {
      this.currHeat = currHeat;
      this.currMaxHeat = currMaxHeat; //computed value, must be consistent with heatsinkInfo + engine
      this.currHeatDissapation = currHeatDissapation; //computed value, must be consistent with heatsinkInfo + engine
      this.currHeatsinkList = currHeatsinkList; //[Heatsink...]
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
    gotoState(weaponCycle) {
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
    isReady() {
      return this.weaponCycle === WeaponCycle.READY;
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
    constructor(sourceAmmoBoxList) {
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
      if (this.name.startsWith("Engine_Std")) {
        return EngineType.STD;
      } else if (this.name.startsWith("Engine_XL")) {
        return EngineType.XL;
      } else if (this.name.startsWith("Engine_Clan_XL")) {
        return EngineType.CLAN_XL;
      } else {
        throw "Unknown engine type. Name: " + name;
      }
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
      this.armor = armor;
      this.structure = structure;
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
    toString() {
      let ret = "";
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

  var SmurfyWeaponData = {};
  var SmurfyAmmoData = {};
  var SmurfyMechData = {};
  var SmurfyModuleData = {};
  var mechTeams = {};
  mechTeams[Team.BLUE] = [];
  mechTeams[Team.RED] = [];

  //Get weapon, ammo and mech data from smurfy
  const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
  const WEAPON_DATA_PATH = "data/weapons.json";
  const AMMO_DATA_PATH = 'data/ammo.json';
  const MODULE_DATA_PATH = 'data/modules.json';
  var dataLoaded = (function() {
    return {
      weaponsLoaded : false, //true when the request in successfully completed
      ammoLoaded : false,
      weaponsDone : false, //true when the request is finished (success or fail)
      ammoDone : false,
      modulesLoaded : false,
      modulesDone : false,
      isLoaded : function () {
        return this.weaponsLoaded && this.ammoLoaded && this.modulesLoaded;
      },
      isDone : function () {
        return this.weaponsDone && this.ammoDone && this.modulesDone;
      }
    };
  })();
  var initModelData = function (callback) {
    //Get weapon data
    $.ajax({
      url : SMURFY_PROXY_URL + WEAPON_DATA_PATH,
      type : 'GET',
      dataType : 'JSON'
      })
      .done(function (data) {
        console.log("Success");
        SmurfyWeaponData = data;
        MechModel.dataLoaded.weaponsLoaded = true;
      })
      .fail(function (data) {
        console.log("Request failed: " + data);
      })
      .always(function (data) {
        MechModel.dataLoaded.weaponsDone = true;
        if (MechModel.dataLoaded.isDone()) {
          if (MechModel.dataLoaded.isLoaded()) {
            MechModel.initAddedData();
          }
          callback(MechModel.dataLoaded.isLoaded());
        }
      });
    $.ajax({
      url : SMURFY_PROXY_URL + AMMO_DATA_PATH,
      type : 'GET',
      dataType : 'JSON'
      })
      .done(function (data) {
        console.log("Success");
        SmurfyAmmoData = data;
        MechModel.dataLoaded.ammoLoaded = true;
      })
      .fail(function (data) {
        console.log("Request failed: " + data);
      })
      .always(function (data) {
        MechModel.dataLoaded.ammoDone = true;
        if (MechModel.dataLoaded.isDone()) {
          if (MechModel.dataLoaded.isLoaded()) {
            MechModel.initAddedData();
          }
          callback(MechModel.dataLoaded.isLoaded());
        }
      });
    $.ajax({
      url : SMURFY_PROXY_URL + MODULE_DATA_PATH,
      type : 'GET',
      dataType : 'JSON'
      })
      .done(function (data) {
        console.log("Success ");
        SmurfyModuleData = data;
        MechModel.dataLoaded.modulesLoaded = true;
      })
      .fail(function (data) {
        console.log("Request failed: " + data);
      })
      .always(function (data) {
        MechModel.dataLoaded.modulesDone = true;
        if (MechModel.dataLoaded.isDone()) {
          if (MechModel.dataLoaded.isLoaded()) {
            MechModel.initAddedData();
          }
          callback(MechModel.dataLoaded.isLoaded());
        }
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
    initAddedData();
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

  //Object creation methods.
  //TODO: see if it's better to put these in the object constructors instead
  var mechInfoFromSmurfyMechLoadout = function (mechId, smurfyMechLoadout) {
    var mechInfo;

    var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
    var mechName = smurfyMechData.name;
    var mechTranslatedName = smurfyMechData.translated_name;
    var mechHealth = mechHealthFromSmurfyMechLoadout(smurfyMechLoadout);
    var weaponInfoList = weaponInfoListFromSmurfyMechLoadout(smurfyMechLoadout);
    var heatsinkInfoList = heatsinkListFromSmurfyMechLoadout(smurfyMechLoadout);
    var ammoBoxList = ammoBoxListFromSmurfyMechLoadout(smurfyMechLoadout);
    var engineInfo = engineInfoFromSmurfyMechLoadout(smurfyMechLoadout);
    var tons = smurfyMechData.details.tons;

    mechInfo = new MechInfo(mechId, mechName, mechTranslatedName, mechHealth,
          weaponInfoList, heatsinkInfoList, ammoBoxList, engineInfo, tons);
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
    let damageMultiplier = smurfyWeaponData.calc_stats.damageMultiplier;
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
      minRange, optRange, maxRange, baseDmg, damageMultiplier,
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

  var ammoBoxListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
    var ammoList = [];
    ammoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) {
        if (smurfyMechComponentItem.type === "ammo") {
          let ammoBox =ammoBoxFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
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

    mechState = new MechState(mechInfo, mechHealth, heatState,
                              weaponStateList, ammoState);
    return mechState;
  }

  //Calculates the total heat capacity and heat dissapation from a mechInfo
  var calculateHeatStats = function (heatsinkInfoList, engineInfo, engineHeatEfficiency) {
    const BASE_HEAT_CAPACITY = 30;
    let heatCapacity = BASE_HEAT_CAPACITY;
    let heatDissapation = 0;

    //non-fixed heatsinks
    for (let heatsink of heatsinkInfoList) {
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
    let engineHeatsink = engineInfo.heatsink;
    heatCapacity += Number(engineInfo.heatsinkCount) *
                    Number(engineHeatsink.internalHeatCapacity) *
                    Number(engineHeatEfficiency);
    heatDissapation += Number(engineInfo.heatsinkCount) *
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
    let heatStats = calculateHeatStats(
            mechInfo.heatsinkInfoList,
            mechInfo.engineInfo,
            engineHeatEfficiency);
    let currHeatDissapation = heatStats.heatDissapation;
    let currMaxHeat = heatStats.heatCapacity;
    //Copy engine info from mech info
    let engineInfo = mechInfo.engineInfo.clone();
    //Copy heatsink info from mech info
    let currHeatsinkList = [];
    for (let heatsink of mechInfo.heatsinkInfoList) {
      currHeatsinkList.push(heatsink.clone());
    }
    let heatState = new HeatState(currHeat, currMaxHeat, currHeatDissapation,
                            currHeatsinkList, engineInfo, engineHeatEfficiency)
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
    let ammoState = new AmmoState(mechInfo.ammoBoxList);
    return ammoState;
  }

  //constructor
  var Mech = function (new_mech_id, team, smurfyMechLoadout) {
    var smurfy_mech_id = smurfyMechLoadout.mech_id;
    //TODO: Load mech data from smurfy instead of a global variable
    var smurfyMechData = getSmurfyMechData(smurfy_mech_id);
    var mech_id = new_mech_id;
    var mechInfo = mechInfoFromSmurfyMechLoadout(new_mech_id, smurfyMechLoadout);
    var mechState = initMechState(mechInfo);
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
        mechState = initMechState(mechInfo);
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

  var isTeamAlive = function(team) {
    let mechTeam = mechTeams[team];
    for (let mech of mechTeam) {
      if (mech.getMechState().isAlive()) {
        return true;
      }
    }
    return false;
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
    WeaponInfo : WeaponInfo,
    mechTeams : mechTeams,
    initModelData : initModelData,
    initDummyModelData : initDummyModelData,
    initAddedData : initAddedData,
    dataLoaded : dataLoaded,
    addMech : addMech,
    resetState : resetState,
    isTeamAlive : isTeamAlive,
    //Note: made public only because of testing. Should not be accessed outside this module
    baseMechStructure : baseMechStructure,
    baseMechArmor : baseMechArmor
  };

})(); //namespace end
