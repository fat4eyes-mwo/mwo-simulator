"use strict";

//Classes that represent the states of the mechs in the simulation,
//and methos to populate them from smurfy data
namespace MechModel  {
  import Team = MechModelCommon.Team;
  import Component = MechModelCommon.Component;
  import WeaponCycle = MechModelCommon.WeaponCycle;
  import Faction = MechModelCommon.Faction;
  import UpdateType = MechModelCommon.UpdateType;
  import EngineType = MechModelCommon.EngineType;

  type MechQuirk = MechModelQuirks.MechQuirk;

  type WeaponInfo = MechModelWeapons.WeaponInfo;
  type WeaponState = MechModelWeapons.WeaponState;
  type SmurfyMechLoadout = SmurfyTypes.SmurfyMechLoadout;
  type SmurfyMechData = SmurfyTypes.SmurfyMechData;
  type SmurfyQuirk = SmurfyTypes.SmurfyQuirk;
  type SmurfyWeaponData = SmurfyTypes.SmurfyWeaponData;
  type SmurfyMechComponent = SmurfyTypes.SmurfyMechComponent;
  type SmurfyMechComponentItem = SmurfyTypes.SmurfyMechComponentItem;
  type SmurfyModuleData = SmurfyTypes.SmurfyModuleData;
  type SmurfyWeaponDataList = SmurfyTypes.SmurfyWeaponDataList;
  type SmurfyMechDataList = SmurfyTypes.SmurfyMechDataList;
  type SmurfyModuleDataList = SmurfyTypes.SmurfyModuleDataList;
  type SmurfyAmmoDataList = SmurfyTypes.SmurfyAmmoDataList;
  type SmurfyHeatsinkModuleData = SmurfyTypes.SmurfyHeatsinkModuleData;
  type SmurfyOmnipod = SmurfyTypes.SmurfyOmnipod;
  type SmurfyOmnipodData = SmurfyTypes.SmurfyOmnipodData;

  var SmurfyWeaponData : SmurfyWeaponDataList = null;
  var SmurfyAmmoData : SmurfyAmmoDataList = null;
  var SmurfyModuleData : SmurfyModuleDataList = null;
  var SmurfyMechData : SmurfyMechDataList = null;
  var SmurfyOmnipodData : FlatOmnipodData = null;
  var SmurfyCTOmnipods : CTOmnipodMap = null;
  var mechTeams : {[index:string] : Mech[]} = {}; //Team -> Mech[]
  mechTeams[Team.BLUE] = [];
  mechTeams[Team.RED] = [];
  var teamStats : {[index:string] : TeamStats} = {}; //format is {<team> : <teamStats>}
  var mechIdMap : {[index:string] : boolean}= {}; //mechId -> boolean

  export class MechInfo {
    mechId : string;
    smurfyMechId : string;
    smurfyLoadoutId : string;
    mechName : string;
    mechTranslatedName : string;
    tons : number;
    mechType : string; //light, medium, heavy, assault
    faction : string; //InnerSphere, Clan
    quirks : MechQuirk[];
    skillQuirks : MechQuirk[];
    generalQuirkBonus : MechModelQuirks.GeneralBonus;
    mechHealth : MechHealth;
    weaponInfoList : MechModelWeapons.WeaponInfo[];
    heatsinkInfoList : Heatsink[];
    ammoBoxList : AmmoBox[];
    engineInfo : EngineInfo;
    skillState : MechModelSkills.SkillState;
    //NOTE: DO NOT ACCESS THIS MEMBER'S FIELDS. It is here only to reconstruct the data in applySkillQuirks
    smurfyMechLoadout : SmurfyMechLoadout; 

    constructor(mechId : string, smurfyMechLoadout : SmurfyMechLoadout) {
      this.mechId = mechId;
      this.smurfyMechId = smurfyMechLoadout.mech_id;
      this.smurfyLoadoutId = smurfyMechLoadout.id;
      var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
      this.mechName = smurfyMechData.name;
      this.mechTranslatedName = smurfyMechData.translated_name;
      this.tons = Number(smurfyMechData.details.tons);
      this.mechType = smurfyMechData.mech_type;
      this.faction = smurfyMechData.faction;
      this.smurfyMechLoadout = smurfyMechLoadout;
      //NOTE: Quirks should be set before creating WeaponInfos
      if (isOmnimech(smurfyMechLoadout)) {
        this.quirks = MechModelQuirks.collectOmnipodQuirks(smurfyMechLoadout);
      } else {
        this.quirks = MechModelQuirks.collectMechQuirks(smurfyMechData);
      }
      this.skillQuirks = []; //is set using applySkillQuirks
      this.initComputedValues();
    }

    initComputedValues() {
      //NOTE: General quirk bonus must be computed before collecting heatsinks
      //(bonus is used in computing heatdissipation)
      let combinedQuirks = this.quirks;
      if (this.skillQuirks) {
        combinedQuirks = combinedQuirks.concat(this.skillQuirks);
      }

      this.generalQuirkBonus = MechModelQuirks.getGeneralBonus(combinedQuirks);
      this.mechHealth = mechHealthFromSmurfyMechLoadout(this.smurfyMechLoadout, combinedQuirks);
      this.weaponInfoList = weaponInfoListFromSmurfyMechLoadout(this.smurfyMechLoadout, this);
      this.heatsinkInfoList = heatsinkListFromSmurfyMechLoadout(this.smurfyMechLoadout);
      this.ammoBoxList = ammoBoxListFromSmurfyMechLoadout(this.smurfyMechLoadout, combinedQuirks);
      this.engineInfo = engineInfoFromSmurfyMechLoadout(this.smurfyMechLoadout);
    }

    applySkillQuirks(skillQuirks : MechQuirk[]) {
      this.skillQuirks = skillQuirks;
      this.initComputedValues();
    }

    setSkillState(skillState : MechModelSkills.SkillState) {
      this.skillState = skillState;
    }
  }

  export class Heatsink {
    location : string;
    heatsinkId : string;
    name : string;
    active : boolean;
    cooling : number;
    engineCooling : number;
    internalHeatCapacity : number;
    externalHeatCapacity : number;
    smurfyModuleData : SmurfyHeatsinkModuleData;

    constructor(location : string,
                smurfyModuleData : SmurfyHeatsinkModuleData) {
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
    componentHealth : ComponentHealth[];
    //Component -> ComponentHealth
    componentHealthMap : {[index : string] : ComponentHealth};
    constructor(componentHealth : ComponentHealth[]) {
      //TODO: try to get rid of this componentHealth list
      this.componentHealth = componentHealth; //[ComponentHealth...]
      this.componentHealthMap = {};
      for (let component of componentHealth) {
        this.componentHealthMap[component.location] = component;
      }
    }
    getComponentHealth(location : string) : ComponentHealth {
      return this.componentHealthMap[location];
    }
    isIntact(location : string) : boolean {
      return this.getComponentHealth(location).isIntact();
    }
    takeDamage(location : string, numDamage : number) : ComponentDamage {
      return this.componentHealthMap[location].takeDamage(numDamage);
    }
    totalCurrHealth() : number {
      let ret = 0;
      for (let componentHealthEntry of this.componentHealth) {
        ret = Number(ret) + componentHealthEntry.totalCurrHealth();
      }
      return ret;
    }
    totalMaxHealth() : number {
      let ret = 0;
      for (let componentHealthEntry of this.componentHealth) {
        ret = Number(ret) + componentHealthEntry.totalMaxHealth();
      }
      return ret;
    }
    clone() : MechHealth {
      let newComponentHealth : ComponentHealth[] = [];
      for (let componentHealthEntry of this.componentHealth) {
        newComponentHealth.push(componentHealthEntry.clone());
      }
      return new MechHealth(newComponentHealth);
    }
  }

  export class ComponentHealth {
    location : string;
    armor : number;
    structure : number;
    baseMaxArmor : number;
    baseMaxStructure : number;
    quirkBonus : MechModelQuirks.HealthBonus;

    constructor(location : string,
                armor : number, structure : number,
                maxArmor : number, maxStructure : number) {
      this.location = location;
      this.armor = armor; //current armor. used in state
      this.structure = structure;
      this.baseMaxArmor = maxArmor; //maximum armor from loadout
      this.baseMaxStructure = maxStructure; //maximum structure from loadout
    }
    //applies bonus from quirks.
    applyQuirkBonus(bonus : MechModelQuirks.HealthBonus) {
      this.quirkBonus = bonus;
      this.resetToFullHealth();
    }
    resetToFullHealth() {
      this.armor = this.maxArmor;
      this.structure = this.maxStructure;
    }
    get maxArmor() : number{
      let ret = this.baseMaxArmor;
      if (this.quirkBonus) {
        ret += Number(this.quirkBonus.armor);
        ret = ret * Number(this.quirkBonus.armor_multiplier);
      }
      return ret;
    }
    get maxStructure() : number{
      let ret = this.baseMaxStructure;
      if (this.quirkBonus) {
        ret += Number(this.quirkBonus.structure);
        ret = ret * Number(this.quirkBonus.structure_multiplier);
      }
      return ret;
    }
    isIntact() : boolean {
      return this.structure > 0;
    }
    //returns a ComponentDamage with actual damage dealt
    //NOTE: Does not take rear components into account
    takeDamage(numDamage : number) : ComponentDamage {
      let ret : ComponentDamage  = new ComponentDamage(this.location, 0, 0);
      if (numDamage <= this.armor) {
        this.armor = Number(this.armor) - numDamage;
        ret.addArmorDamage(numDamage);
        numDamage = 0;
      } else if (numDamage > this.armor) {
        numDamage = Number(numDamage) - Number(this.armor);
        ret.addArmorDamage(this.armor);
        this.armor = 0;
      }
      if (!MechModelCommon.isRearComponent(this.location)) {
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
    totalCurrHealth() : number {
      return Number(this.armor) +
          ((this.structure) ? Number(this.structure) : 0); //special case for undefined structure in rear components
    }
    totalMaxHealth() : number {
      return Number(this.maxArmor) +
        ((this.maxStructure) ? Number(this.maxStructure) : 0); //special case for undefined structure in rear components
    }
    clone() : ComponentHealth {
      let ret = new ComponentHealth(this.location,
        this.armor,
        this.structure,
        this.baseMaxArmor,
        this.baseMaxStructure);
      if (this.quirkBonus) {
        ret.applyQuirkBonus(this.quirkBonus);
      }
      return ret;
    }
  }

  export class GhostHeatEntry {
    timeFired : number;
    weaponState : WeaponState;

    constructor(timeFired : number, weaponState : WeaponState) {
      this.timeFired = timeFired;
      this.weaponState = weaponState;
    }
  }

  //TODO : is actually UpdateTypes -> boolean, try to see if it can be made explicit
  export interface UpdateSet {
    [index:string] : boolean
  };
  export interface GhostHeatMap {
    [index:string] : GhostHeatEntry[] //heatPenaltyId -> GhostHeatEntry[]
  }
  export class MechState {
    mechInfo : MechInfo;
    mechHealth : MechHealth;
    heatState : HeatState;
    weaponStateList : MechModelWeapons.WeaponState[];
    ammoState : AmmoState;
    updateTypes : UpdateSet;
    ghostHeatMap : GhostHeatMap;
    mechStats : MechStats;

    constructor(mechInfo : MechInfo) {
      this.mechInfo = mechInfo;
      this.mechHealth = mechInfo.mechHealth.clone();
      this.heatState = new HeatState(mechInfo);
      this.weaponStateList = initWeaponStateList(this);
      this.ammoState = new AmmoState(mechInfo);

      this.updateTypes = {}; //Update types triggered on the current simulation step
      this.ghostHeatMap = {}; //weaponId -> [GhostHeatEntry]. Used in ghost heat computations.
      this.mechStats = new MechStats(); //stats set in simulation logic
    }
    setUpdate(updateType : UpdateType) : void {
      this.updateTypes[updateType] = true;
    }
    isAlive() : boolean {
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
    takeDamage(weaponDamage : WeaponDamage) : MechDamage {
      let totalDamage = new MechDamage();
      for (let location in weaponDamage.damageMap) {
        if (!weaponDamage.damageMap.hasOwnProperty(location)) {
          continue;
        }
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
    destroyComponent(location : string, includeArmor : boolean) : MechDamage {
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

    disableWeapons(location : string) : void {
      for (let weaponState of this.weaponStateList) {
        let weaponInfo = weaponState.weaponInfo;
        if (weaponInfo.location === location) {
          weaponState.gotoState(WeaponCycle.DISABLED);
          this.setUpdate(UpdateType.WEAPONSTATE);
        }
      }
    }

    disableHeatsinks(location : string) : void {
      for (let heatsink of this.heatState.currHeatsinkList) {
        if (heatsink.location === location) {
          heatsink.active = false;
          this.setUpdate(UpdateType.HEAT);
        }
      }
    }

    //update heat stats on component destruction
    updateHeatStats(location : string) : void {
      //reduce engine heat efficiency if clan xl engine
      let engineInfo = this.heatState.engineInfo;
      let heatState = this.heatState;
      if (engineInfo.getEngineType() === EngineType.CLAN_XL ||
          engineInfo.getEngineType() === EngineType.LIGHT) {
        if (location === Component.LEFT_TORSO ||
            location === Component.RIGHT_TORSO) {
          heatState.engineHeatEfficiency =
            Number(GlobalGameInfo._MechGlobalGameInfo.clan_reduced_xl_heat_efficiency);
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

    clearMechStats() : void {
      this.mechStats = new MechStats();
    }

    getTotalDamageAtRange(range : number) : number {
      let totalDamage = 0;
      for (let weaponState of this.weaponStateList) {
        if (!weaponState.active) {
          continue;
        }
        totalDamage += Number(weaponState.weaponInfo.damageAtRange(range));
      }
      return totalDamage;
    }


    //Compute the heat caused by firing a set of weapons
    //Ghost heat reference: http://mwomercs.com/forums/topic/127904-heat-scale-the-maths/
    computeHeat (weaponsFired : WeaponState[], simTime: number) : number {
      let totalHeat = 0;

      //sort weaponInfoList in increasing order of heat for ghost heat processing
      var compareHeat = function(weapon1 : WeaponState, weapon2 : WeaponState) : number {
        return Number(weapon1.computeHeat()) - Number(weapon1.computeHeat());
      }
      weaponsFired.sort(compareHeat);

      for (let weaponState of weaponsFired) {
        let weaponInfo = weaponState.weaponInfo;
        totalHeat += Number(weaponState.computeHeat()); // base heat
        let ghostHeat = this.computeGhostHeat(weaponState, simTime);
        totalHeat += ghostHeat;
      }

      return totalHeat;
    }

    //Calculates the ghost heat incurred by a weapon
    //Note that this method has a side effect: it removes stale GhostHeatEntries
    //and adds a new GhostHeatEntry for the weapon
    computeGhostHeat = function (this : MechState,
                                weaponState : WeaponState,
                                simTime: number) : number {
      const HEATMULTIPLIER =
        [0, 0, 0.08, 0.18, 0.30, 0.45, 0.60, 0.80, 1.10, 1.50, 2.00, 3.00, 5.00];
      let weaponInfo = weaponState.weaponInfo;

      let mechState = this;

      //Get the list of ghost heat weapons of the same heatPenaltyId fired from the mech
      if (!mechState.ghostHeatMap) {
        mechState.ghostHeatMap = {};
      }
      let ghostHeatWeapons = mechState.ghostHeatMap[weaponInfo.heatPenaltyId];
      if (!ghostHeatWeapons) {
        ghostHeatWeapons = [];
        mechState.ghostHeatMap[weaponInfo.heatPenaltyId] = ghostHeatWeapons;
      }
      //Go through the list of ghost heat weapons and remove those that have been
      //fired outside the ghost heat interval
      while (ghostHeatWeapons.length > 0
        && (simTime - ghostHeatWeapons[0].timeFired > GlobalGameInfo.GHOST_HEAT_INTERVAL)) {
        ghostHeatWeapons.shift();
      }
      //see if any of the remaining entries are from the same weapon. In that case
      //just update the time fired field instead of adding a new entry
      let addNewEntry = true;
      for (let ghostHeatIdx in ghostHeatWeapons) {
        if (!ghostHeatWeapons.hasOwnProperty(ghostHeatIdx)) {
          continue;
        }
        let ghostHeatEntry = ghostHeatWeapons[ghostHeatIdx];
        if (ghostHeatEntry.weaponState === weaponState) {
          //update time, remove from array and put at the end of the queue
          ghostHeatEntry.timeFired = simTime;
          ghostHeatWeapons.splice(Number(ghostHeatIdx), 1);
          ghostHeatWeapons.push(ghostHeatEntry);
          addNewEntry = false;
          break;
        }
      }
      if (addNewEntry) {
        let ghostHeatEntry = new GhostHeatEntry(simTime, weaponState);
        ghostHeatWeapons.push(ghostHeatEntry);
      }

      //calcluate ghost heat
      let ghostHeat = 0;
      if (ghostHeatWeapons.length >= weaponInfo.minHeatPenaltyLevel) {
        ghostHeat = HEATMULTIPLIER[ghostHeatWeapons.length]
                    * Number(weaponInfo.heatPenalty)
                    * Number(weaponInfo.heat);
      }

      return ghostHeat;
    }

    private copyGhostHeatMap (ghostHeatMap : GhostHeatMap) : GhostHeatMap  {
      if (!ghostHeatMap) {
        return ghostHeatMap;
      }
      let ret : GhostHeatMap = {};
      for (let key in ghostHeatMap) {
        if (!ghostHeatMap.hasOwnProperty(key)) {
          continue;
        }
        ret[key] = Array.from(ghostHeatMap[key]);
      }
      return ret;
    }

    //Computes total heat for the set of weapons fired, but restores the
    //ghost heat map to its previous state afterwards
    predictHeat (this: MechState,
                weaponsFired : WeaponState[],
                simTime : number)
                : number {
      let mechState = this;
      let prevGhostHeatMap = mechState.ghostHeatMap;
      mechState.ghostHeatMap = this.copyGhostHeatMap(prevGhostHeatMap);
      let ret = this.computeHeat(weaponsFired, simTime);
      mechState.ghostHeatMap = prevGhostHeatMap;
      return ret;
    }

     predictBaseHeat(weaponsFired : WeaponState[]) : number {
      let ret = 0;
      for (let weaponState of weaponsFired) {
        ret = ret + Number(weaponState.computeHeat());
      }
      return ret;
    }
  }

  export class HeatState {
    currHeat : number;
    engineHeatEfficiency : number;
    currHeatDissipation : number;
    currMaxHeat : number;
    engineInfo : EngineInfo;
    currHeatsinkList : Heatsink[];

    constructor(mechInfo : MechInfo) {
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

  interface AmmoCountMap {
    //weaponId -> AmmoCount
    [index : string] : AmmoCount
  };
  export class AmmoState {
    ammoCounts : AmmoCountMap;
    ammoBoxList : AmmoBox[];

    constructor(mechInfo : MechInfo) {
      let sourceAmmoBoxList = mechInfo.ammoBoxList;
      this.ammoCounts = {}; //weaponId->AmmoCount
      this.ammoBoxList = [];

      for (let ammoBox of sourceAmmoBoxList) {
        this.ammoBoxList.push(ammoBox.clone());
      }

      //sort ammoBoxList in ammo consumption order so the lists in the ammoCounts
      //are also sorted in consumption order
      //reference:
      //https://mwomercs.com/forums/topic/
      //65553-guide-ammo-depleting-priorities-or-in-what-order-is-your-ammo-being-used/
      let ammoLocationOrderIndex = function(location : string) {
        const locationOrder =
          [Component.HEAD, Component.CENTRE_TORSO, Component.RIGHT_TORSO,
            Component.LEFT_TORSO, Component.LEFT_ARM, Component.RIGHT_ARM,
            Component.LEFT_LEG, Component.RIGHT_LEG];
        let idx = 0;
        for (idx = 0; idx < locationOrder.length; idx++) {
          if (location === locationOrder[idx]) {
            return idx;
          }
        }
      }
      this.ammoBoxList.sort((x : AmmoBox, y : AmmoBox) => {
        return ammoLocationOrderIndex(x.location) -
                  ammoLocationOrderIndex(y.location);
      });

      for (let idx in this.ammoBoxList) {
        if (!this.ammoBoxList.hasOwnProperty(idx)) {
          continue;
        }
        let ammoBox = this.ammoBoxList[idx];
        let firstWeaponId = ammoBox.weaponIds[0];
        //Create an ammocount for the weapon if it is not yet in the map
        if (!this.ammoCounts[firstWeaponId]) {
          let newAmmoCount = new AmmoCount(ammoBox.type);
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
    ammoCountForWeapon(weaponId : string) : number {
      let ammoCount = this.ammoCounts[weaponId];
      if (ammoCount) {
        return ammoCount.ammoCount;
      } else {
        return 0;
      }
    }

    //tries to consume a given amount of ammo for a weaponInfo
    //returns the amount of ammo actually consumed
    consumeAmmo(weaponId : string, amount : number) : number {
      let ammoCount = this.ammoCounts[weaponId];
      if (ammoCount) {
        return ammoCount.consumeAmmo(amount);
      } else {
        return 0;
      }
    }

    //Disables ammo boxes and reduces the corresponding AmmoCount
    //Returns the set of disabled ammo boxes
    disableAmmoBoxes(location : string) : AmmoBox[] {
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
  export class AmmoCount {
    type : string;
    weaponIds : string[];
    ammoCount : number;
    ammoBoxList : AmmoBox[];
    maxAmmoCount : number;
    currAmmoBoxIdx : number;

    constructor(type : string) {
      this.type = type;
      this.weaponIds = [];
      this.ammoCount = 0; //Total ammo count of all the boxes in the ammoBoxList
      this.ammoBoxList = []; //[AmmoBox...]
      this.maxAmmoCount = 0;
      this.currAmmoBoxIdx = 0;
    }

    addAmmoBox(ammoBox : AmmoBox) {
      this.weaponIds = ammoBox.weaponIds;
      this.ammoCount += Number(ammoBox.ammoCount);
      this.maxAmmoCount += Number(ammoBox.ammoCount);
      this.ammoBoxList.push(ammoBox);
    }

    //tries to consume a given amount of ammo. returns the actual amount of ammo
    //consumed
    consumeAmmo(amount : number) {
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
  export class AmmoBox {
    type : string;
    location : string;
    weaponIds : string[];
    ammoCount : number;
    intact : boolean;

    constructor(type : string, location: string,
                weaponIds : string[], ammoCount : number, intact : boolean) {
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

  export class EngineInfo {
    engineId : string;
    name : string;
    heatsink : Heatsink;
    heatsinkCount : number;

    constructor(engineId : string, name : string, heatsink : Heatsink, heatsinkCount : number) {
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
    getEngineType() : string {
      let engineType;
      let engineMap : {[index:string] : string} = {
        "Engine_Std" : EngineType.STD,
        "Engine_XL" : EngineType.XL,
        "Engine_Clan_XL" : EngineType.CLAN_XL,
        "Engine_Light" : EngineType.LIGHT,
      }
      for (let enginePrefix in engineMap) {
        if (!engineMap.hasOwnProperty(enginePrefix)) {
          continue;
        }
        if (this.name.startsWith(enginePrefix)) {
          return engineMap[enginePrefix];
        }
      }
      throw Error("Unknown engine type. Name: " + name);
    }
  }

  //Represents damage currently being done by a weapon. This gets put in the
  //  weaponFireQueue every time a weapon is fired and its values
  //  (durationLeft or travelLeft as the case may be) are updated every step
  //  by processWeaponFires().
  //When the damage is completed, it is taken off the queue and its total
  //  damage done is added to the sourceMech's stats
  export class WeaponFire {
    sourceMech : Mech;
    targetMech : Mech;
    weaponState : WeaponState;
    range : number;
    createTime : number;
    ammoConsumed : number;
    weaponDamage : WeaponDamage;
    tickWeaponDamage : WeaponDamage;
    damageDone : MechDamage;
    totalDuration : number;
    totalTravel : number;
    durationLeft : number;
    travelLeft : number;
    complete : boolean;
    stepDurationFunction : () => number; //returns the length of the step duration
                              //may be used later when changing duration length
                              //for smoother animation

    constructor(sourceMech : Mech,
                targetMech : Mech,
                weaponState : WeaponState,
                range : number,
                createTime : number,
                ammoConsumed : number,
                stepDurationFunction : () => number) {
      this.sourceMech = sourceMech;
      this.targetMech = targetMech;
      this.weaponState = weaponState;
      this.weaponDamage = null; //full weapon damage
      this.tickWeaponDamage = null; //WeaponDamage done per tick for duration weapons
      this.range = range;
      this.createTime = createTime;
      this.damageDone = new MechDamage();
      this.ammoConsumed = ammoConsumed;
      this.stepDurationFunction = stepDurationFunction;
      let weaponInfo = weaponState.weaponInfo;

      this.totalDuration = weaponInfo.hasDuration() ?
          Number(weaponInfo.duration) : 0;
      this.totalTravel = weaponInfo.hasTravelTime() ?
          Number(range) / Number(weaponInfo.speed) * 1000 : 0; //travel time in milliseconds

      this.durationLeft = this.totalDuration;
      this.travelLeft = this.totalTravel;
      this.complete = false;

      this.initComputedValues(range, stepDurationFunction);
    }

    initComputedValues(range : number, stepDurationFunction : () => number) : void {
      let targetComponent = this.sourceMech.componentTargetPattern(this.sourceMech, this.targetMech);
      let weaponInfo = this.weaponState.weaponInfo;
      //baseWeaponDamage applies all damage to the target component
      let baseWeaponDamageMap : DamageMap = {};
      let baseDamage = weaponInfo.damageAtRange(range);
      if (weaponInfo.requiresAmmo()) {
        baseDamage = Number(baseDamage) * this.ammoConsumed / weaponInfo.ammoPerShot;
      }
      baseWeaponDamageMap[targetComponent] = baseDamage;
      let baseWeaponDamage = new WeaponDamage(baseWeaponDamageMap);

      let weaponAccuracyPattern =
          MechAccuracyPattern.getWeaponAccuracyPattern(weaponInfo);
      if (weaponAccuracyPattern) {
        let weaponAccuracyDamage = weaponAccuracyPattern(baseWeaponDamage, range);
        baseWeaponDamage = weaponAccuracyDamage;
      }
      //transform the baseWeaponDamage using the mech's accuracy pattern
      let transformedWeaponDamage = this.sourceMech.accuracyPattern(baseWeaponDamage, range);
      this.weaponDamage = transformedWeaponDamage;

      if (this.totalDuration >0) {
        let tickDamageMap : DamageMap = {};
        for (let component in this.weaponDamage.damageMap) {
          if (!this.weaponDamage.damageMap.hasOwnProperty(component)) {
            continue;
          }
          tickDamageMap[component] =
              Number(this.weaponDamage.getDamage(component))
              / Number(this.totalDuration) * stepDurationFunction();
        }
        this.tickWeaponDamage = new WeaponDamage(tickDamageMap);
      } else {
        this.tickWeaponDamage = this.weaponDamage.clone();
      }
    }

    isComplete() : boolean {
      return this.complete;
    }

    step(stepDuration : number) : void {
      let weaponInfo = this.weaponState.weaponInfo;
      let sourceMechState = this.sourceMech.getMechState();
      let targetMechState = this.targetMech.getMechState();
      if (weaponInfo.hasDuration()) {
        this.durationLeft = Number(this.durationLeft) - stepDuration;
        if (this.weaponState.active && sourceMechState.isAlive()) {
          let tickDamageDone;
          if (this.durationLeft <=0) {
            let lastTickDamage = this.tickWeaponDamage.clone();
            let damageFraction = (stepDuration + this.durationLeft) / stepDuration;
            lastTickDamage.multiply(damageFraction);
            tickDamageDone = targetMechState.takeDamage(lastTickDamage);
            this.damageDone.add(tickDamageDone);
            this.complete = true;
          } else {
            tickDamageDone = targetMechState.takeDamage(this.tickWeaponDamage);
            this.damageDone.add(tickDamageDone)
          }
          targetMechState.setUpdate(UpdateType.HEALTH);
        } else {
          //Weapon disabled before end of burn
          //add weaponFire.damageDone to mech stats
          this.complete = true;
        }
      } else if (weaponInfo.hasTravelTime()) {
        this.travelLeft = Number(this.travelLeft) - stepDuration;
        if (this.travelLeft <= 0) {
          let damageDone = targetMechState.takeDamage(this.weaponDamage);
          this.damageDone.add(damageDone);
          targetMechState.setUpdate(UpdateType.HEALTH);
          //add weaponFire.damageDone to mechStats
          this.complete = true;
        } else {
          //still has travel time
        }
      } else {
        //should not happen
        throw Error("Unexpected WeaponFire type");
      }
    }

    toString() : string {
      let weaponInfo = this.weaponState.weaponInfo;
      return "WeaponFire" +
          " createTime: " + this.createTime +
          (weaponInfo.hasDuration() ? " durationLeft : " + this.durationLeft : "") +
          (weaponInfo.hasTravelTime() ? " travelLeft: " + this.travelLeft : "") +
          " source: " + this.sourceMech.getMechInfo().mechTranslatedName +
          " target: " + this.targetMech.getMechInfo().mechTranslatedName +
          " weapon: " + this.weaponState.weaponInfo.name +
          " weaponDamage: " + this.weaponDamage.toString() +
          " tickWeaponDamage: " + this.tickWeaponDamage.toString() +
          " damageDone: " + this.damageDone.toString();
    }
  }

  //represents damage done to a mech
  //A map from Components -> ComponentDamage
  export class MechDamage {
    //Component -> ComponentDamage
    componentDamage : {[index:string] : ComponentDamage};
    constructor() {
      this.componentDamage = {}; //Component->ComponentDamage
    }

    add(mechDamage : MechDamage) : void {
      for (let location in mechDamage.componentDamage) {
        if (!mechDamage.componentDamage.hasOwnProperty(location)) {
          continue;
        }
        if (!this.componentDamage[location]) {
          this.componentDamage[location] = new ComponentDamage(location, 0, 0);
        }
        this.componentDamage[location].add(mechDamage.componentDamage[location]);
      }
    }
    addComponentDamage(componentDamage : ComponentDamage) : void {
      let location = componentDamage.location;
      if (!this.componentDamage[location]) {
        this.componentDamage[location] = new ComponentDamage(location, 0, 0);
      }
      this.componentDamage[location].add(componentDamage);
    }
    getComponentDamage(location : string) : ComponentDamage {
      return this.componentDamage[location];
    }
    totalDamage() : number {
      let ret = 0;
      for (let component in this.componentDamage) {
        if (!this.componentDamage.hasOwnProperty(component)) {
          continue;
        }
        ret = Number(ret) + this.componentDamage[component].totalDamage();
      }
      return ret;
    }
    toString() : string {
      let ret = "";
      for (let location in this.componentDamage) {
        if (!this.componentDamage.hasOwnProperty(location)) {
          continue;
        }
        ret = ret + " " + this.componentDamage[location].toString();
      }
      return ret;
    }
  }

  export class ComponentDamage {
    location : string;
    armor : number;
    structure : number;

    constructor(location : string, armor : number, structure : number) {
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
    add(componentDamage : ComponentDamage) : ComponentDamage {
      this.armor += Number(componentDamage.armor);
      this.structure += Number(componentDamage.structure);
      return this;
    }
    addArmorDamage(damage : number) : void {
      this.armor += Number(damage);
    }
    addStructureDamage(damage : number) : void {
      this.structure += Number(damage);
    }
    totalDamage() : number {
      return Number(this.armor) + Number(this.structure);
    }
    toString() : string {
      return "location: " + this.location + " armordmg: " + this.armor + " structdmg: " + this.structure;
    }
  }

  //Damage dealt by a weapon.
  //Component -> Number
  export interface DamageMap {
    [index:string] : number
  };
  export class WeaponDamage {
    damageMap : DamageMap;

    constructor(damageMap : DamageMap) {
      this.damageMap = damageMap;
    }
    getDamage(component : string) : number {
      return this.damageMap[component];
    }
    multiply(multiplier : number) : void {
      for (var location in this.damageMap) {
        if (!this.damageMap.hasOwnProperty(location)) {
          continue;
        }
        this.damageMap[location] =
            Number(this.damageMap[location]) * Number(multiplier);
      }
    }
    getTotalDamage() : number {
      let totalDamage = 0;
      for (let component in this.damageMap) {
        if (!this.damageMap.hasOwnProperty(component)) {
          continue;
        }
        totalDamage += this.damageMap[component];
      }
      return totalDamage;
    }
    toString() : string {
      let ret = "totalDamage: " + this.getTotalDamage();
      for (let component in this.damageMap) {
        if (!this.damageMap.hasOwnProperty(component)) {
          continue;
        }
        ret = ret + " " + component + "=" + this.damageMap[component];
      }
      return ret;
    }
    clone() : WeaponDamage {
      var newDamageMap : DamageMap = {};
      for (let component in this.damageMap) {
        if (!this.damageMap.hasOwnProperty(component)) {
          continue;
        }
        newDamageMap[component] = this.damageMap[component];
      }
      return new WeaponDamage(newDamageMap);
    }
  }

  export class MechStats {
    totalDamage : number;
    totalHeat : number;
    weaponFires : WeaponFire[];
    timeOfDeath : number;

    constructor() {
      this.totalDamage = 0;
      this.totalHeat = 0;
      //list of completed weaponFires. Assumed to be sorted in
      //ascending order of createTime
      this.weaponFires = [];
      this.timeOfDeath = null;
    }
    //assumes simTime >= createTime of last element in the weaponFire list
    getBurstDamage(simTime : number) : number {
      let burstDamage = 0;
      for (let idx = this.weaponFires.length - 1; idx > 0; idx--) {
        let weaponFire = this.weaponFires[idx];
        if (simTime - weaponFire.createTime < MechModelCommon.BURST_DAMAGE_INTERVAL) {
          burstDamage += weaponFire.damageDone.totalDamage();
        } else {
          break;
        }
      }
      return burstDamage;
    }
  }

  export class TeamStats {
    maxBurstDamage : number;

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
  type DataPathAssignFunction = (data: any) => void;
  //dataPath -> DataPathAssignFunction
  var dataPathAssigns : {[index:string] : DataPathAssignFunction} = {};

  //TODO: See what the right generic type for the promise is here
  var initDataPromise = function(path : string) : Promise<any> {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url : SMURFY_PROXY_URL + path,
        type : 'GET',
        dataType : 'JSON'
        })
        .done(function(data : any) {
          console.log("Successfully loaded " + path);
          resolve(data);
        })
        .fail(function(data : any) {
          console.log("Smurfy " + path + " request failed: " + Error(data));
          reject(Error(data));
        });
    });
  }

  //NOTE: Process the omnipod data so the omnipod ID is the
  //main index (instead of the chassis name)
  //also finds the CT omnipods and puts them in a set->omnipod map
  interface FlatOmnipodData {
    //OmnipodId -> SmurfyOmnipod
    [index:string] : SmurfyOmnipod
  };
  interface CTOmnipodMap {
    //OmnipodSetName -> SmurfyOmnipod
    [index:string] : SmurfyOmnipod
  };
  var flattenOmnipodData = function(smurfyOmnipodData : SmurfyOmnipodData) {
    let flatOmnipodData : FlatOmnipodData = {};
    let ctOmnipodMap : CTOmnipodMap = {};
    for (let chassis in smurfyOmnipodData) {
      if (!smurfyOmnipodData.hasOwnProperty(chassis)) {
        continue;
      }
      for (let omnipodId in smurfyOmnipodData[chassis]) {
        if (!smurfyOmnipodData[chassis].hasOwnProperty(omnipodId)) {
          continue;
        }
        let omnipodEntry = smurfyOmnipodData[chassis][omnipodId];
        flatOmnipodData[omnipodId] = omnipodEntry;
        if (omnipodEntry.details.component === "centre_torso") {
          ctOmnipodMap[omnipodEntry.details.set] = omnipodEntry
        }
      }
    }
    return {flatOmnipodData : flatOmnipodData, ctOmnipodMap : ctOmnipodMap};
  }
  export var initModelData = function () : Promise<void> {
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

    let initPromises : Array<Promise<string>> = [];
    for (let path of dataPaths) {
      initPromises.push(initDataPromise(path));
    }

    let loadAllInitData = Promise.all(initPromises);
    return loadAllInitData.then(function(dataArray) {
      for (let idx in dataArray) {
        if (!dataArray.hasOwnProperty(idx)) {
          continue;
        }
        let path = dataPaths[idx];
        dataPathAssigns[path](dataArray[idx]);
      }
      initAddedData();
    });
  }

  export var initAddedData = function() : void {
    initHeatsinkIds();
    initAddedHeatsinkData();
    initAddedWeaponData();
  }

  const ISHeatsinkName = "HeatSink_MkI";
  const ISDoubleHeatsinkName = "DoubleHeatSink_MkI";
  const ClanDoubleHeatsinkName = "ClanDoubleHeatSink";
  var ISSingleHeatsinkId : string;
  var ISDoubleHeatsinkId : string;
  var ClanDoubleHeatsinkId : string;
  const heatsinkType = "CHeatSinkStats";
  var initHeatsinkIds = function() : void {
    for (let moduleId in SmurfyModuleData) {
      if (!SmurfyModuleData.hasOwnProperty(moduleId)) {
        continue;
      }
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
      if (!SmurfyModuleData.hasOwnProperty(idx)) {
        continue;
      }
      let moduleData = SmurfyModuleData[idx];
      if (moduleData.type === "CHeatSinkStats") {
        let addedData = AddedData._AddedHeatsinkData[moduleData.name];
        $.extend(moduleData.stats, addedData);
      }
    }
  }

  //adds fields to smurfy weapon data
  //additional data can be found in data/addedweapondata.js
  var initAddedWeaponData = function() {
    for (let idx in SmurfyWeaponData) {
      if (!SmurfyWeaponData.hasOwnProperty(idx)) {
        continue;
      }
      let weaponData = SmurfyWeaponData[idx];
      let addedData = AddedData._AddedWeaponData[weaponData.name];
      $.extend(weaponData, addedData);
    }
  }

  //Used by test
  export var setInitModelData = function(
    weaponData : SmurfyWeaponDataList,
    ammoData : SmurfyAmmoDataList,
    mechData : SmurfyMechDataList,
    moduleData : SmurfyModuleDataList,
    omnipodData : SmurfyOmnipodData,
    ): void {
      SmurfyWeaponData = weaponData;
      SmurfyAmmoData = ammoData;
      SmurfyMechData = mechData;
      SmurfyModuleData = moduleData;
      let flatData = flattenOmnipodData(omnipodData);
      SmurfyOmnipodData = flatData.flatOmnipodData;
      SmurfyCTOmnipods = flatData.ctOmnipodMap;
      initAddedData();
  }

  export var getSmurfyMechData =
      function(smurfyMechId : string) : SmurfyMechData {
    return SmurfyMechData[smurfyMechId];
  };

  export var getSmurfyWeaponData =
      function(smurfyItemId : string) : SmurfyWeaponData {
    return SmurfyWeaponData[smurfyItemId];
  }

  //weaponName -> SmurfyWeaponData
  var smurfyWeaponNameMap : {[index:string] : SmurfyWeaponData} = {};
  export var getSmurfyWeaponDataByName = function(smurfyName : string) : SmurfyWeaponData {
    if (smurfyWeaponNameMap[smurfyName]) {
      return smurfyWeaponNameMap[smurfyName];
    }
    for (let id in SmurfyWeaponData) {
      if (!SmurfyWeaponData.hasOwnProperty(id)) {
        continue;
      }
      let smurfyWeapon = SmurfyWeaponData[id];
      if (smurfyName === smurfyWeapon.name) {
        smurfyWeaponNameMap[smurfyName] = smurfyWeapon;
        return smurfyWeaponNameMap[smurfyName];
      }
    }
    return null;
  }

  export var getSmurfyModuleData = function(smurfyModuleId : string) {
    return SmurfyModuleData[smurfyModuleId];
  }

  export var getSmurfyAmmoData = function(smurfyItemId : string) {
    return SmurfyAmmoData[smurfyItemId];
  }

  export var getSmurfyOmnipodData = function(smurfyOmnipodId : string) {
    return SmurfyOmnipodData[smurfyOmnipodId];
  }

  export var getSmurfyCTOmnipod = function(mechName : string) {
    return SmurfyCTOmnipods[mechName];
  }

  var isHeatsinkModule = function(smurfyModuleId : string) {
    let smurfyModuleData = getSmurfyModuleData(smurfyModuleId);
    return smurfyModuleData && smurfyModuleData.type === "CHeatSinkStats";
  }

  var isEngineModule = function(smurfyModuleId : string) {
    let smurfyModuleData = getSmurfyModuleData(smurfyModuleId);
    return smurfyModuleData && smurfyModuleData.type === "CEngineStats";
  }

  //base structure value computation for a given tonnage.
  //Reference: http://mwo.gamepedia.com/Internal_Structure
  export var baseMechStructure = function(location : string, tonnage : number) : number {
    return GlobalGameInfo._MechBaseStructure[tonnage][location];
  }

  export var baseMechArmor = function(location : string, tonnage : number) : number {
    if (location === Component.HEAD) {
      return baseMechStructure(location, tonnage);
    } else {
      return baseMechStructure(location, tonnage) * 2;
    }
  }

  //Object creation methods.
  //TODO: see if it's better to put these in the object constructors instead
  var mechHealthFromSmurfyMechLoadout =
      function (smurfyMechLoadout : SmurfyMechLoadout,
                quirks : MechQuirk[]) {
    var mechHealth;

    var smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
    var tonnage = smurfyMechData.details.tons;
    var componentHealthList : ComponentHealth[] = [];
    for (let smurfyMechComponent of smurfyMechLoadout.configuration) {
      let componentHealth = componentHealthFromSmurfyMechComponent(smurfyMechComponent, quirks, tonnage);
      componentHealthList.push(componentHealth);
    }
    mechHealth = new MechHealth(componentHealthList);

    return mechHealth;
  }

  var componentHealthFromSmurfyMechComponent =
      function (smurfyMechComponent : SmurfyMechComponent,
                quirkList : MechQuirk[],
                tonnage : number) : ComponentHealth {
    var componentHealth; //return value

    var location = smurfyMechComponent.name;
    var armor = smurfyMechComponent.armor;
    var structure = baseMechStructure(location, tonnage);
    let bonus = MechModelQuirks.getHealthBonus(location, quirkList);
    componentHealth = new ComponentHealth(location,
                                  Number(armor),
                                  Number(structure),
                                  Number(armor),
                                  Number(structure));
    componentHealth.applyQuirkBonus(bonus);
    return componentHealth;
  }

  //returns a list from a smurfy configuration list using a collectionFunction
  //collectFunction paramters are (location, smurfyMechComponentItem)
  //and returns a value if it is to be added to the list, undefined/null if not
  type CollectorFunction =
    (location: string,
      componentItem : SmurfyMechComponentItem)
        => any;
  var collectFromSmurfyConfiguration =
      function (smurfyMechConfiguration : SmurfyMechComponent[],
                collectFunction : CollectorFunction) {
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

  var weaponInfoListFromSmurfyMechLoadout =
      function (smurfyMechLoadout : SmurfyMechLoadout,
                mechInfo : MechInfo) {
    var weaponInfoList = [];
    weaponInfoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) : WeaponInfo {
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

  var heatsinkListFromSmurfyMechLoadout =
      function(smurfyMechLoadout : SmurfyMechLoadout) {
    var heatsinkList = [];
    heatsinkList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) : Heatsink {
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

  var heatsinkFromSmurfyMechComponentItem =
      function (location : string,
                smurfyMechComponentItem : SmurfyMechComponentItem) : Heatsink {
    let heatsinkId = smurfyMechComponentItem.id;
    let smurfyModuleData = getSmurfyModuleData(heatsinkId);

    let heatsink = new Heatsink(location, smurfyModuleData);
    return heatsink;
  }

  var ammoBoxListFromSmurfyMechLoadout =
      function (smurfyMechLoadout : SmurfyMechLoadout,
                quirks : MechQuirk[]) {
    var ammoList = [];
    ammoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location, smurfyMechComponentItem) : AmmoBox {
        if (smurfyMechComponentItem.type === "ammo") {
          let ammoBox = ammoBoxFromSmurfyMechComponentItem(location, smurfyMechComponentItem, quirks);
          return ammoBox;
        } else {
          return null;
        }
      }
    );
    return ammoList;
  }

  var ammoBoxFromSmurfyMechComponentItem =
      function(location : string,
                smurfyMechComponentItem : SmurfyMechComponentItem,
                quirks : MechQuirk[])
                : AmmoBox {
    var ammoBox;
    let ammoData = getSmurfyAmmoData(smurfyMechComponentItem.id);
    let type = ammoData.type;
    let ammoCount = ammoData.num_shots;
    let weaponIds = ammoData.weapons;
    for (let quirk of quirks) {
      let ammoType = MechModelQuirks._ammoCapacityMap[quirk.name];
      if (ammoType === type) {
        ammoCount += Number(quirk.value);
      }
    }
    ammoBox = new AmmoBox(type, location, weaponIds, ammoCount, true);

    return ammoBox;
  }


  //Gets the heatsink module id of the heatsinks in the engine.
  //Uses direct name matching because there doesn't seem to be an id reference
  //from the heatsink upgrade items to the associated heatsink
  var getEngineHeatsinkId = function(smurfyMechLoadout: SmurfyMechLoadout) : string {
    var upgradeToIdMap : {[index:string] : string} = {
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
  var getEngineSmurfyModuleData = function(smurfyMechLoadout: SmurfyMechLoadout) {
    for (let equipment of smurfyMechLoadout.stats.equipment) {
      let equipmentModuleData = getSmurfyModuleData(equipment.id);
      if (equipmentModuleData.type === "CEngineStats") {
        return equipmentModuleData;
      }
    }
    return null;//should not happen
  }

  var isClanXLEngine = function(smurfyModuleData : SmurfyModuleData) {
     return smurfyModuleData.name.startsWith("Engine_Clan") &&
      smurfyModuleData.type === "CEngineStats";
  }
  var engineInfoFromSmurfyMechLoadout =
      function(smurfyMechLoadout: SmurfyMechLoadout) : EngineInfo {
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

  export var isOmnimech =
      function(smurfyMechLoadout: SmurfyMechLoadout) : boolean {
    for (let component of smurfyMechLoadout.configuration) {
      if (component.omni_pod) {
        return true;
      }
    }
    return false;
  }

  var numExternalHeatsinks =
      function(smurfyMechLoadout: SmurfyMechLoadout) : number {
    let heatsinkList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration,
      function (location : string, smurfyMechComponentItem : SmurfyMechComponentItem) {
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
  interface HeatStats {
    heatCapacity : number,
    heatDissipation : number,
  }
  var calculateHeatStats = function (heatsinkInfoList : Heatsink[],
                          engineInfo : EngineInfo,
                          engineHeatEfficiency : number,
                          generalQuirkBonus : MechModelQuirks.GeneralBonus)
                          : HeatStats {
    const BASE_HEAT_CAPACITY = 30;
    let heatCapacity = BASE_HEAT_CAPACITY;
    let heatDissipation = 0;

    //non-fixed heatsinks
    for (let heatsink of heatsinkInfoList) {
      if (!heatsink.active) {
        continue;
      }
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
    let heatCapacityMultiplier = 1.0;
    //TODO: Find the difference between heatloss and heatdissipation
    if (generalQuirkBonus.heatloss_multiplier) {
      heatDissipationMultiplier += generalQuirkBonus.heatloss_multiplier;
    }
    if (generalQuirkBonus.heatdissipation_multiplier) {
      heatDissipationMultiplier += generalQuirkBonus.heatdissipation_multiplier;
    }
    if (generalQuirkBonus.maxheat_multiplier) {
      heatCapacityMultiplier += Number(generalQuirkBonus.maxheat_multiplier);
    }
    heatDissipation = heatDissipation * heatDissipationMultiplier;
    heatCapacity = heatCapacity * heatCapacityMultiplier;
    return {
      "heatCapacity" : heatCapacity ,
      "heatDissipation" : heatDissipation
    };
  }

  var initWeaponStateList = function(mechState : MechState) : MechModelWeapons.WeaponState[] {
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
  export class Mech {
    firePattern : MechFirePattern.FirePattern; //Set after initialization
    componentTargetPattern : MechTargetComponent.TargetComponentPattern; //Set after initialization
    mechTargetPattern : MechTargetMech.TargetMechPattern; //set after initialization
    accuracyPattern : MechAccuracyPattern.AccuracyPattern; //set after initialization
    private smurfyMechId : string;
    private smurfyMechData : SmurfyMechData;
    private mechId : string;
    private mechInfo : MechInfo;
    private mechState : MechState;
    private mechTeam : string;
    private targetMech : Mech;

    constructor(newMechId : string,
                team : string,
                smurfyMechLoadout : SmurfyMechLoadout) {
      this.smurfyMechId = smurfyMechLoadout.mech_id;
      this.smurfyMechData = getSmurfyMechData(this.smurfyMechId);
      this.mechId = newMechId;
      this.mechInfo = new MechInfo(newMechId, smurfyMechLoadout);
      this.mechState = new MechState(this.mechInfo);
      this.mechTeam = team;
      this.targetMech = null; //set by simulation
    }

    getName() {
      return this.smurfyMechData.name;
    }
    getTranslatedName() {
      return this.smurfyMechData.translated_name;
    }
    getMechId() {
      return this.mechId;
    }
    getMechInfo()  {
      return this.mechInfo;
    }
    getMechState() {
      return this.mechState;
    }
    resetMechState() {
      this.mechState = new MechState(this.mechInfo);
    }
    getMechTeam() {
      return this.mechTeam;
    }
    setMechTeam(team : string) {
      this.mechTeam = team;
    }
    setTargetMech(newTarget : Mech) {
      this.targetMech = newTarget;
    }
    getTargetMech() {
      return this.targetMech;
    }
    applySkillQuirks(skillQuirks : MechQuirk[]) {
      this.mechInfo.applySkillQuirks(skillQuirks);
      this.resetMechState();
    }
    setSkillState(skillState : MechModelSkills.SkillState) {
      this.mechInfo.setSkillState(skillState);
    }
  }

  export var getMechTeam = function(team: Team) : Mech[] {
    return mechTeams[team];
  }

  export var addMech = function(mechId : string,
                                team : string,
                                smurfyMechLoadout : SmurfyMechLoadout)
                                : Mech {
    var newMech = new Mech(mechId, team, smurfyMechLoadout);
    mechTeams[team].push(newMech);
    console.log("Added mech mech_id: " + mechId +
      " translated_mech_name: " + newMech.getTranslatedName());
    initMechPatterns(newMech);
    return newMech;
  };

  export var addMechAtIndex = function(mechId : string,
                                  team : string,
                                  smurfyMechLoadout : SmurfyMechLoadout,
                                  index : number)
                                  : Mech {
    var newMech = new Mech(mechId, team, smurfyMechLoadout);
    mechTeams[team][index] = newMech;
    console.log("Added mech mech_id: " + mechId
      + " translated_mech_name: " + newMech.getTranslatedName()
      + " at index " + index);
    initMechPatterns(newMech);
    return newMech;
  }

  //TODO: Put in maps if this gets called often
  interface MechPos {
    team : string;
    index : number;
  }
  var getMechPosFromId = function(mechId : string) : MechPos {
    let teamList = [Team.BLUE, Team.RED];
    for (let team of teamList) {
      let mechList = mechTeams[team];
      for (let mechIdx in mechList) {
        if (!mechList.hasOwnProperty(mechIdx)) {
          continue;
        }
        let mech = mechList[mechIdx];
        if (mech.getMechId() === mechId) {
          return {team: team, index: Number(mechIdx)};
        }
      }
    }
    return null;
  }

  var getMechFromPos = function(mechPos : MechPos) : Mech {
    return mechTeams[mechPos.team][mechPos.index];
  }

  export var deleteMech = function(mechId : string) : boolean {
    let mechPos = getMechPosFromId(mechId);
    if (!mechPos) {
      return false;
    }
    let mechList = mechTeams[mechPos.team];
    mechList.splice(mechPos.index, 1);
    releaseMechId(mechId);
    return true;
  }

  //removes src mech from its current position and inserts it before dest mech
  export var moveMech =
      function(srcMechId : string, destMechId : string) : boolean {
    let srcMechPos = getMechPosFromId(srcMechId);
    if (!srcMechPos) {
      return false;
    }

    let srcMech = getMechFromPos(srcMechPos);

    let status = deleteMech(srcMechId);
    if (!status) {
      return false;
    }

    //get dest pos AFTER delete to keep indices straight when moving in the same list
    let destMechPos = getMechPosFromId(destMechId);
    let deletedMechList = mechTeams[srcMechPos.team];
    if (!destMechPos) {
      //reinsert deleted mech on error
      deletedMechList.splice(srcMechPos.index, 0, srcMech);
      return false;
    }

    srcMech.setMechTeam(destMechPos.team);
    let insertMechList = mechTeams[destMechPos.team];
    insertMechList.splice(destMechPos.index, 0, srcMech);
    return true;
  }

  export var moveMechToEndOfList = function(srcMechId : string, team : Team) : boolean {
    let srcMechPos = getMechPosFromId(srcMechId);
    if (!srcMechPos) {
      return false;
    }

    let srcMech = getMechFromPos(srcMechPos);

    let status = deleteMech(srcMechId);
    if (!status) {
      return false;
    }
    let insertMechList = mechTeams[team];
    insertMechList.splice(insertMechList.length, 0, srcMech);
    return true;
  }

  //Debug, set default mech patterns
  export var initMechTeamPatterns = function(mechTeam : Mech[]) : void {
    for (let mech of mechTeam) {
      initMechPatterns(mech);
    }
  }
  export var initMechPatterns = function(mech : Mech) {
    mech.firePattern = MechFirePattern.getDefault();
    mech.componentTargetPattern = MechTargetComponent.getDefault();
    mech.mechTargetPattern = MechTargetMech.getDefault();
    mech.accuracyPattern = MechAccuracyPattern.getDefault();
  }

  export var generateMechId = function(smurfyMechLoadout : SmurfyMechLoadout) {
    let smurfyMechData = getSmurfyMechData(smurfyMechLoadout.mech_id);
    let mechName = smurfyMechData.name;
    let rand = function() {
      return Math.floor(Math.random() * 0x10000).toString(16);
    }
    let newMechId = mechName + "-" +
        rand() + "-" + rand() + "-" + rand() + "-" + rand();
    while (mechIdMap[newMechId]) {
      newMechId = newMechId = mechName +
          rand() + "-" + rand() + "-" + rand() + "-" + rand();
    }
    mechIdMap[newMechId] = true;
    return newMechId;
  }

  var releaseMechId = function(mechId : string) {
    mechIdMap[mechId] = false;
  }

  //Resets the MechStates of all mechs to their fresh value
  export var resetState = function() {
    let teams = [Team.BLUE, Team.RED];
    for (let team of teams) {
      let mechTeam = mechTeams[team];
      for (let mech of mechTeam) {
        mech.resetMechState();
      }
    }
  }

  export var isTeamAlive = function(team : string) : boolean {
    let mechTeam = mechTeams[team];
    for (let mech of mechTeam) {
      if (mech.getMechState().isAlive()) {
        return true;
      }
    }
    return false;
  }

  //called every time team-level statistics need to be updated (e.g. when a weapon hits)
  export var updateModelTeamStats = function(team : Team, simTime : number) : void {
    let totalTeamBurstDamage = 0;
    let teamStatEntry = teamStats[team];
    if (!teamStatEntry) {
      teamStatEntry = new TeamStats();
      teamStats[team] = teamStatEntry;
    }
    for (let mech of mechTeams[team]) {
      let burstDamage = mech.getMechState().mechStats.getBurstDamage(simTime);
      totalTeamBurstDamage += burstDamage;
    }
    if (totalTeamBurstDamage > teamStatEntry.maxBurstDamage) {
      teamStatEntry.maxBurstDamage = totalTeamBurstDamage;
    }
  }

  export var getTeamStats = function(team : string) : TeamStats {
    return teamStats[team];
  }

  interface SmurfyLoadoutId {
    id : string;
    loadout : string;
  }
  var parseSmurfyURL = function(url : string) : SmurfyLoadoutId {
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

  export var loadSmurfyMechLoadoutFromURL = function(url : string) {
    let params = parseSmurfyURL(url);
    if (!params) {
      return null;
    }
    return loadSmurfyMechLoadoutFromID(params.id, params.loadout);
  }

  export var loadSmurfyMechLoadoutFromID =
        function(smurfyId : string, smurfyLoadoutId : string) : Promise<any> {
    let ret = new Promise(function(resolve, reject) {
      var smurfyLoadoutURL = SMURFY_PROXY_URL + "data/mechs/" + smurfyId
          + "/loadouts/" + smurfyLoadoutId + ".json";
      $.ajax({
          url : smurfyLoadoutURL,
          type : 'GET',
          dataType : 'JSON'
      })
      .done(function(data : any) {
        resolve(data);
      })
      .fail(function(data : any) {
        reject(Error(data));
      });
    });
    return ret;
  }

  //returns a list of adjacent components
  //Component -> [Component...]
  export var getAdjacentComponents = function(component : string) : string[] {
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

  var getTransferDamageLocation = function(component : string) : string {
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

  //NOTE: This is currently O(n) on the number of mechs. Not too bad given we don't have that many mechs,
  //but try to avoid calling this inside the simulation loop. It's ok for user initiated UI actions.
  export var getMechFromId = function(mechId : string) : Mech {
    let mechPos = getMechPosFromId(mechId);
    if (!mechPos) {
      return null;
    }

    return mechTeams[mechPos.team][mechPos.index];
  }

  export var clearModel = function() : void{
    mechTeams[Team.BLUE] = [];
    mechTeams[Team.RED] = [];
    teamStats = {};
  }
}
