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
    constructor(mechId, smurfyMechId, smurfyLoadoutId, mechName,
        mechTranslatedName, mechHealth, weaponInfoList, heatsinkInfoList,
        ammoBoxList, engineInfo, tons) {
      this.mechId = mechId; //Our mech id (not smurfy's)
      this.smurfyMechId = smurfyMechId;
      this.smurfyLoadoutId = smurfyLoadoutId;
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
      cooldown, duration, spinup, speed, ammoPerShot, dps) {
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
        this.dps = dps;
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
      //range in meters, stepDuration in ms
      damageAtRange(range, stepDuration) {
        let totalDamage = Number(this.baseDmg) * Number(this.damageMultiplier);
        //special case for continuous fire weapons (duration < 0)
        //use smurfy calculated dps multiplied by the stepDuration so the
        //damage per tick * number of ticks a second equals the calculated dps
        if (this.duration < 0) {
          totalDamage = this.dps * stepDuration / 1000;
        }
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
    constructor(mechInfo) {
      this.mechInfo = mechInfo;
      this.mechHealth = mechInfo.mechHealth.clone();
      this.heatState = new HeatState(mechInfo);
      this.weaponStateList = initWeaponStateList(mechInfo);
      this.ammoState = new AmmoState(mechInfo);

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
    //MechDamage includes damage from destroyed components
    //reference: http://mwomercs.com/forums/topic/176345-understanding-damage/
    takeDamage(weaponDamage) {
      let totalDamage = new MechDamage();
      for (let location in weaponDamage.damageMap) {
        let numDamage = weaponDamage.getDamage(location);
        //apply damage to location
        let componentDamage = this.mechHealth.takeDamage(location, numDamage);
        totalDamage.addComponentDamage(componentDamage);
        //TODO: apply transfer damage to adjacent component


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
          heatState.currHeatDissipation = heatStats.heatDissipation;
          heatState.currMaxHeat = heatStats.heatCapacity;
          this.updateTypes[UpdateType.HEAT];
        }
      }
    }


  }

  class HeatState {
    constructor(mechInfo) {
      this.currHeat = 0;
      this.engineHeatEfficiency = 1;
      let heatStats = calculateHeatStats(
              mechInfo.heatsinkInfoList,
              mechInfo.engineInfo,
              this.engineHeatEfficiency);
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

  class WeaponState {
    constructor(weaponInfo, mechInfo) {
      this.mechInfo = mechInfo; //store mechInfo for quirk modifiers
      this.weaponInfo = weaponInfo;
      this.active = true;
      this.weaponCycle = WeaponCycle.READY;
      this.cooldownLeft = 0;
      this.spoolupLeft = 0;
      this.durationLeft = 0;
    }

    gotoState(weaponCycle) {
      this.weaponCycle = weaponCycle;
      this.cooldownLeft = 0;
      this.spoolupLeft = 0;
      this.durationLeft = 0;
      if (weaponCycle === WeaponCycle.READY) {
        //do nothing
      } else if (weaponCycle === WeaponCycle.FIRING) {
        this.durationLeft = this.computeWeaponDuration();
      } else if (weaponCycle === WeaponCycle.COOLDOWN) {
        this.cooldownLeft = this.computeWeaponCooldown();
      } else if (weaponCycle === WeaponCycle.SPOOLING) {
        this.spoolupLeft = Number(this.weaponInfo.spinup);
      } else if (weaponCycle === WeaponCycle.DISABLED) {
        //set cooldown to max so it displays properly in the view
        this.cooldownLeft = this.computeWeaponCooldown();
        this.active = false;
      }
    }
    isReady() {
      return this.weaponCycle === WeaponCycle.READY;
    }
    //Computes the cooldown for this weapon on a mech, taking modifiers into account
    //TODO: process effect of mech quirks
    computeWeaponCooldown(mechState) {
      return Number(this.weaponInfo.cooldown);
    }

    //Computes this weapon's duration on a mech, taking modifiers into account
    //TODO: process effect of mech quirks
    computeWeaponDuration(mechState) {
      return Number(this.weaponInfo.duration);
    }

    //Computes this weapon's heat on a given mech, taking modifiers into account
    //TODO: process effect of mech quirks
    computeHeat(mechState) {
      return Number(this.weaponInfo.heat);
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
  var SmurfyModuleData = {};
  var SmurfyMechData = {};
  var mechTeams = {};
  mechTeams[Team.BLUE] = [];
  mechTeams[Team.RED] = [];

  //Get weapon, ammo and mech data from smurfy
  const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
  const WEAPON_DATA_PATH = "data/weapons.json";
  const AMMO_DATA_PATH = 'data/ammo.json';
  const MODULE_DATA_PATH = 'data/modules.json';
  const MECH_DATA_PATH = 'data/mechs.json';
  var initDataTrigger;
  var dataPaths = [WEAPON_DATA_PATH , AMMO_DATA_PATH, MODULE_DATA_PATH, MECH_DATA_PATH];
  var dataPathAssigns = {};
  var initModelData = function (callback) {
    //assigns to the correct variable
    //TODO: Just turn all the smurfy data into a map to avoid this
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
    initDataTrigger = new Trigger(dataPaths);

    for (let path of dataPaths) {
      $.ajax({
        url : SMURFY_PROXY_URL + path,
        type : 'GET',
        dataType : 'JSON'
        })
        .done(function (data) {
          console.log("Successfully loaded " + path);
          dataPathAssigns[path](data);
          initDataTrigger.setSuccess(path);
        })
        .fail(function (data) {
          console.log("Smurfy " + path + " request failed: " + data);
          initDataTrigger.setFail(path);
        })
        .always(function (data) {
          initDataTrigger.setDone(path);
          if (initDataTrigger.isDone()) {
            if (initDataTrigger.isSuccessful()) {
              MechModel.initAddedData();
            }
            callback(initDataTrigger.isSuccessful());
          }
        });
    }
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

    var smurfyMechId = smurfyMechLoadout.mech_id;
    var smurfyLoadoutId = smurfyMechLoadout.id;
    var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
    var mechName = smurfyMechData.name;
    var mechTranslatedName = smurfyMechData.translated_name;
    var mechHealth = mechHealthFromSmurfyMechLoadout(smurfyMechLoadout);
    var weaponInfoList = weaponInfoListFromSmurfyMechLoadout(smurfyMechLoadout);
    var heatsinkInfoList = heatsinkListFromSmurfyMechLoadout(smurfyMechLoadout);
    var ammoBoxList = ammoBoxListFromSmurfyMechLoadout(smurfyMechLoadout);
    var engineInfo = engineInfoFromSmurfyMechLoadout(smurfyMechLoadout);
    var tons = smurfyMechData.details.tons;

    mechInfo = new MechInfo(mechId, smurfyMechId, smurfyLoadoutId,
          mechName, mechTranslatedName, mechHealth,
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
    let dps = smurfyWeaponData.calc_stats.dps;

    let weaponInfo = new WeaponInfo(
      weaponId, name, translatedName, location,
      minRange, optRange, maxRange, baseDmg, damageMultiplier,
      heat, minHeatPenaltyLevel, heatPenalty, heatPenaltyId,
      cooldown, duration, spinup, speed, ammoPerShot, dps
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

  //Calculates the total heat capacity and heat dissipation from a mechInfo
  var calculateHeatStats = function (heatsinkInfoList, engineInfo, engineHeatEfficiency) {
    const BASE_HEAT_CAPACITY = 30;
    let heatCapacity = BASE_HEAT_CAPACITY;
    let heatDissipation = 0;

    //non-fixed heatsinks
    for (let heatsink of heatsinkInfoList) {
      if (!heatsink.active) continue;
      if (heatsink.location === Component.CENTRE_TORSO) {
      //internal non-fixed
        heatCapacity += Number(heatsink.internalHeatCapacity);
        heatDissipation += Number(heatsink.engineCooling);
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

    //TODO: see where to get the data for fixed heatsinks

    return {
      "heatCapacity" : heatCapacity,
      "heatDissipation" : heatDissipation
    };
  }

  var initWeaponStateList = function(mechInfo) {
    var weaponStateList = [];
    for (let weaponInfo of mechInfo.weaponInfoList) {
      weaponStateList.push(new WeaponState(weaponInfo, mechInfo));
    }
    return weaponStateList;
  }

  //constructor
  var Mech = function (new_mech_id, team, smurfyMechLoadout) {
    var smurfy_mech_id = smurfyMechLoadout.mech_id;
    //TODO: Load mech data from smurfy instead of a global variable (full mech data file is way to big at 1Mb)
    var smurfyMechData = getSmurfyMechData(smurfy_mech_id);
    var mech_id = new_mech_id;
    var mechInfo = mechInfoFromSmurfyMechLoadout(new_mech_id, smurfyMechLoadout);
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
    mech.firePattern = MechFirePattern.alphaNoOverheat;
    mech.componentTargetPattern = MechTargetComponent.randomAim;
    mech.mechTargetPattern = MechTargetMech.targetRandomMech;
    mech.accuracyPattern = MechAccuracyPattern.accuracySpreadToAdjacent(1.0, 0.0);
  }


  var mechIdMap = {};
  var generateMechId = function(team, smurfyMechLoadout) {
    let smurfyMechData =
      MechModel.getSmurfyMechData(MechView.loadedSmurfyLoadout.mech_id);
    let mechName = smurfyMechData.name;
    let rand = function() {
      return Math.floor(Math.random() * 0x10000).toString(16);
    }
    let newMechId = team + "-" + mechName + "-" +
        rand() + "-" + rand() + "-" + rand() + "-" + rand();
    while (mechIdMap[newMechId]) {
      newMechId = newMechId = team + "-" + mechName +
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

  var loadSmurfyMechLoadoutFromURL = function(url, doneCallback,
                                        failCallback, alwaysCallback) {
    let params = parseSmurfyURL(url);
    if (!params) {
      return null;
    }
    return loadSmurfyMechLoadoutFromID(params.id, params.loadout,
                    doneCallback, failCallback, alwaysCallback)
  }

  var loadSmurfyMechLoadoutFromID = function(smurfyId, smurfyLoadoutId,
                                  doneCallback, failCallback, alwaysCallback) {
    var smurfyLoadoutURL = SMURFY_PROXY_URL + "data/mechs/" + smurfyId
        + "/loadouts/" + smurfyLoadoutId + ".json";
    $.ajax({
        url : smurfyLoadoutURL,
        type : 'GET',
        dataType : 'JSON'
    })
    .done(function(data) {
      doneCallback(data);
    })
    .fail(function(data) {
      failCallback(data);
    })
    .always(function(data) {
      alwaysCallback(data);
    });
    return true;
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
    addMech : addMech,
    deleteMech : deleteMech,
    generateMechId : generateMechId,
    initMechPatterns: initMechPatterns,
    initMechTeamPatterns : initMechTeamPatterns,
    resetState : resetState,
    isTeamAlive : isTeamAlive,
    getAdjacentComponents : getAdjacentComponents,
    //Note: made public only because of testing. Should not be accessed outside this module
    baseMechStructure : baseMechStructure,
    baseMechArmor : baseMechArmor,

    //smurfy data helper functions. Used by view
    getSmurfyMechData : getSmurfyMechData,
    getSmurfyWeaponData : getSmurfyWeaponData,
    getSmurfyWeaponDataByName : getSmurfyWeaponDataByName,
    getSmurfyModuleData : getSmurfyModuleData,
    getSmurfyAmmoData : getSmurfyAmmoData,
    loadSmurfyMechLoadoutFromURL : loadSmurfyMechLoadoutFromURL,
  };

})(); //namespace end
