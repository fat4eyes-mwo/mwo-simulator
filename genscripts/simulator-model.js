"use strict";
/// <reference path="lib/jquery-3.2.d.ts" />
/// <reference path="simulator-model-quirks.ts" />
/// <reference path="simulator-model-weapons.ts" />
/// <reference path="simulator-smurfytypes.ts" />
/// <reference path="data/globalgameinfo.ts" />
/// <reference path="data/basehealth.ts" />
/// <reference path="data/addedheatsinkdata.ts" />
/// <reference path="data/addedweapondata.ts" />
//Classes that represent the states of the mechs in the simulation,
//and methos to populate them from smurfy data
var MechModel;
(function (MechModel) {
    //TODO: See if you can get a tighter type for enums. Try aliasing
    MechModel.Team = {
        BLUE: "blue",
        RED: "red"
    };
    MechModel.Component = {
        HEAD: "head",
        RIGHT_ARM: "right_arm",
        RIGHT_TORSO: "right_torso",
        CENTRE_TORSO: "centre_torso",
        LEFT_ARM: "left_arm",
        LEFT_TORSO: "left_torso",
        RIGHT_LEG: "right_leg",
        LEFT_LEG: "left_leg",
        LEFT_TORSO_REAR: "left_torso_rear",
        CENTRE_TORSO_REAR: "centre_torso_rear",
        RIGHT_TORSO_REAR: "right_torso_rear"
    };
    MechModel.isRearComponent = function (component) {
        return component === MechModel.Component.LEFT_TORSO_REAR ||
            component === MechModel.Component.CENTRE_TORSO_REAR ||
            component === MechModel.Component.RIGHT_TORSO_REAR;
    };
    MechModel.WeaponCycle = {
        READY: "Ready",
        FIRING: "Firing",
        DISABLED: "Disabled",
        COOLDOWN: "Cooldown",
        COOLDOWN_FIRING: "CooldownFiring",
        SPOOLING: "Spooling",
        JAMMED: "Jammed",
    };
    MechModel.Faction = {
        INNER_SPHERE: "InnerSphere",
        CLAN: "Clan"
    };
    MechModel.UpdateType = {
        FULL: "full",
        HEALTH: "health",
        HEAT: "heat",
        COOLDOWN: "cooldown",
        WEAPONSTATE: "weaponstate",
        STATS: "stats"
    };
    MechModel.EngineType = {
        STD: "std",
        XL: "xl",
        CLAN_XL: "clan_xl",
        LIGHT: "light",
    };
    var SmurfyWeaponData = null;
    var SmurfyAmmoData = null;
    var SmurfyModuleData = null;
    var SmurfyMechData = null;
    var SmurfyOmnipodData = {};
    var SmurfyCTOmnipods = {};
    MechModel.mechTeams = {};
    MechModel.mechTeams[MechModel.Team.BLUE] = [];
    MechModel.mechTeams[MechModel.Team.RED] = [];
    var teamStats = {}; //format is {<team> : <teamStats>}
    var mechIdMap = {};
    class MechInfo {
        constructor(mechId, smurfyMechLoadout) {
            this.mechId = mechId;
            this.smurfyMechId = smurfyMechLoadout.mech_id;
            this.smurfyLoadoutId = smurfyMechLoadout.id;
            var smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
            this.mechName = smurfyMechData.name;
            this.mechTranslatedName = smurfyMechData.translated_name;
            this.tons = Number(smurfyMechData.details.tons);
            //NOTE: Quirks should be set before creating WeaponInfos
            if (MechModel.isOmnimech(smurfyMechLoadout)) {
                this.quirks = MechModelQuirks.collectOmnipodQuirks(smurfyMechLoadout);
            }
            else {
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
    MechModel.MechInfo = MechInfo;
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
    MechModel.Heatsink = Heatsink;
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
            }
            else if (numDamage > this.armor) {
                numDamage = Number(numDamage) - Number(this.armor);
                ret.addArmorDamage(this.armor);
                this.armor = 0;
            }
            if (!MechModel.isRearComponent(this.location)) {
                if (numDamage <= this.structure) {
                    ret.addStructureDamage(numDamage);
                    this.structure = Number(this.structure) - numDamage;
                    numDamage = 0;
                }
                else {
                    ret.addStructureDamage(this.structure);
                    numDamage = Number(numDamage) - Number(this.structure);
                    this.structure = 0;
                }
            }
            else {
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
            return new ComponentHealth(this.location, this.armor, this.structure, this.maxArmor, this.maxStructure);
        }
    }
    MechModel.ComponentHealth = ComponentHealth;
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
        //TODO: Is acutally UpdateType. See if it can be made explicit
        setUpdate(updateType) {
            this.updateTypes[updateType] = true;
        }
        isAlive() {
            let mechHealth = this.mechHealth;
            let engineInfo = this.mechInfo.engineInfo;
            return mechHealth.isIntact(MechModel.Component.HEAD) &&
                mechHealth.isIntact(MechModel.Component.CENTRE_TORSO) &&
                (mechHealth.isIntact(MechModel.Component.LEFT_LEG)
                    || mechHealth.isIntact(MechModel.Component.RIGHT_LEG)) &&
                //xl engine implies both torsos still intact
                (!(engineInfo.getEngineType() === MechModel.EngineType.XL) ||
                    (mechHealth.isIntact(MechModel.Component.LEFT_TORSO)
                        && mechHealth.isIntact(MechModel.Component.RIGHT_TORSO))) &&
                //clan xl engine implies at least one side torso is intact
                (!(engineInfo.getEngineType() === MechModel.EngineType.CLAN_XL ||
                    engineInfo.getEngineType() === MechModel.EngineType.LIGHT) ||
                    (mechHealth.isIntact(MechModel.Component.LEFT_TORSO)
                        || mechHealth.isIntact(MechModel.Component.RIGHT_TORSO)));
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
                    if (location === MechModel.Component.LEFT_TORSO) {
                        destroyComponentDamage = this.destroyComponent(MechModel.Component.LEFT_ARM, true);
                        totalDamage.add(destroyComponentDamage);
                    }
                    else if (location === MechModel.Component.RIGHT_TORSO) {
                        destroyComponentDamage = this.destroyComponent(MechModel.Component.RIGHT_ARM, true);
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
            destructionDamage.addComponentDamage(new ComponentDamage(location, armorDamage, structureDamage));
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
                this.setUpdate(MechModel.UpdateType.WEAPONSTATE);
            }
            return destructionDamage;
        }
        disableWeapons(location) {
            for (let weaponState of this.weaponStateList) {
                let weaponInfo = weaponState.weaponInfo;
                if (weaponInfo.location === location) {
                    weaponState.gotoState(MechModel.WeaponCycle.DISABLED);
                    this.setUpdate(MechModel.UpdateType.WEAPONSTATE);
                }
            }
        }
        disableHeatsinks(location) {
            for (let heatsink of this.heatState.currHeatsinkList) {
                if (heatsink.location === location) {
                    heatsink.active = false;
                    this.setUpdate(MechModel.UpdateType.HEAT);
                }
            }
        }
        //update heat stats on component destruction
        updateHeatStats(location) {
            //reduce engine heat efficiency if clan xl engine
            let engineInfo = this.heatState.engineInfo;
            let heatState = this.heatState;
            if (engineInfo.getEngineType() === MechModel.EngineType.CLAN_XL ||
                engineInfo.getEngineType() === MechModel.EngineType.LIGHT) {
                if (location === MechModel.Component.LEFT_TORSO ||
                    location === MechModel.Component.RIGHT_TORSO) {
                    heatState.engineHeatEfficiency =
                        Number(GlobalGameInfo._MechGlobalGameInfo.clan_reduced_xl_heat_efficiency);
                }
            }
            //recompute heat stats
            let heatStats = calculateHeatStats(heatState.currHeatsinkList, heatState.engineInfo, heatState.engineHeatEfficiency, this.mechInfo.generalQuirkBonus);
            heatState.currHeatDissipation = heatStats.heatDissipation;
            heatState.currMaxHeat = heatStats.heatCapacity;
            this.setUpdate(MechModel.UpdateType.HEAT);
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
    MechModel.MechState = MechState;
    class HeatState {
        constructor(mechInfo) {
            this.currHeat = 0;
            this.engineHeatEfficiency = 1;
            let heatStats = calculateHeatStats(mechInfo.heatsinkInfoList, mechInfo.engineInfo, this.engineHeatEfficiency, mechInfo.generalQuirkBonus);
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
    MechModel.HeatState = HeatState;
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
            let ammoLocationOrderIndex = function (location) {
                const locationOrder = [MechModel.Component.HEAD, MechModel.Component.CENTRE_TORSO, MechModel.Component.RIGHT_TORSO, MechModel.Component.LEFT_TORSO,
                    MechModel.Component.LEFT_ARM, MechModel.Component.RIGHT_ARM, MechModel.Component.LEFT_LEG, MechModel.Component.RIGHT_LEG];
                let idx = 0;
                for (idx = 0; idx < locationOrder.length; idx++) {
                    if (location === locationOrder[idx]) {
                        return idx;
                    }
                }
            };
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
            }
            else {
                return 0;
            }
        }
        //tries to consume a given amount of ammo for a weaponInfo
        //returns the amount of ammo actually consumed
        consumeAmmo(weaponId, amount) {
            let ammoCount = this.ammoCounts[weaponId];
            if (ammoCount) {
                return ammoCount.consumeAmmo(amount);
            }
            else {
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
    MechModel.AmmoState = AmmoState;
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
                    }
                    else {
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
    MechModel.AmmoCount = AmmoCount;
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
            return new AmmoBox(this.type, this.location, this.weaponIds, this.ammoCount, this.intact);
        }
    }
    MechModel.AmmoBox = AmmoBox;
    class EngineInfo {
        constructor(engineId, name, heatsink, heatsinkCount) {
            this.engineId = engineId; //Same as module id in smurfy ModuleData
            this.name = name; //Readable name, from smurfy ModuleData
            this.heatsink = heatsink; //heatsink object that represents the type of heatsinks in the engine
            this.heatsinkCount = heatsinkCount;
        }
        clone() {
            return new EngineInfo(this.engineId, this.name, this.heatsink.clone(), this.heatsinkCount);
        }
        getEngineType() {
            let engineType;
            let engineMap = {
                "Engine_Std": MechModel.EngineType.STD,
                "Engine_XL": MechModel.EngineType.XL,
                "Engine_Clan_XL": MechModel.EngineType.CLAN_XL,
                "Engine_Light": MechModel.EngineType.LIGHT,
            };
            for (let enginePrefix in engineMap) {
                if (this.name.startsWith(enginePrefix)) {
                    return engineMap[enginePrefix];
                }
            }
            throw "Unknown engine type. Name: " + name;
        }
    }
    MechModel.EngineInfo = EngineInfo;
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
    MechModel.MechDamage = MechDamage;
    class ComponentDamage {
        constructor(location, armor, structure) {
            this.location = location;
            if (armor) {
                this.armor = armor;
            }
            else {
                this.armor = 0;
            }
            if (structure) {
                this.structure = structure;
            }
            else {
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
    MechModel.ComponentDamage = ComponentDamage;
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
    MechModel.WeaponDamage = WeaponDamage;
    //TODO: Try to move this out of model due to its dependence on WeaponFire
    //Or move WeaponFire here
    MechModel.BURST_DAMAGE_INTERVAL = 2000; //Interval considered for burst damage calculation
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
                if (simTime - weaponFire.createTime < MechModel.BURST_DAMAGE_INTERVAL) {
                    burstDamage += weaponFire.damageDone.totalDamage();
                }
                else {
                    break;
                }
            }
            return burstDamage;
        }
    }
    MechModel.MechStats = MechStats;
    class TeamStats {
        constructor() {
            this.maxBurstDamage = 0;
        }
    }
    MechModel.TeamStats = TeamStats;
    //Get weapon, ammo and mech data from smurfy
    const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
    const WEAPON_DATA_PATH = "data/weapons.json";
    const AMMO_DATA_PATH = 'data/ammo.json';
    const MODULE_DATA_PATH = 'data/modules.json';
    const MECH_DATA_PATH = 'data/mechs.json';
    const OMNIPOD_DATA_PATH = 'data/omnipods.json';
    var dataPaths = [WEAPON_DATA_PATH, AMMO_DATA_PATH, MODULE_DATA_PATH,
        MECH_DATA_PATH, OMNIPOD_DATA_PATH];
    var dataPathAssigns = {};
    //TODO: See what the right generic type for the promise is here
    var initDataPromise = function (path) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: SMURFY_PROXY_URL + path,
                type: 'GET',
                dataType: 'JSON'
            })
                .done(function (data) {
                console.log("Successfully loaded " + path);
                resolve(data);
            })
                .fail(function (data) {
                console.log("Smurfy " + path + " request failed: " + Error(data));
                reject(Error(data));
            });
        });
    };
    var flattenOmnipodData = function (smurfyOmnipodData) {
        let flatOmnipodData = {};
        let ctOmnipodMap = {};
        for (let chassis in smurfyOmnipodData) {
            for (let omnipodId in smurfyOmnipodData[chassis]) {
                let omnipodEntry = smurfyOmnipodData[chassis][omnipodId];
                flatOmnipodData[omnipodId] = omnipodEntry;
                if (omnipodEntry.details.component === "centre_torso") {
                    ctOmnipodMap[omnipodEntry.details.set] = omnipodEntry;
                }
            }
        }
        return { flatOmnipodData: flatOmnipodData, ctOmnipodMap: ctOmnipodMap };
    };
    MechModel.initModelData = function () {
        //assigns to the correct variable
        dataPathAssigns[WEAPON_DATA_PATH] = function (data) {
            SmurfyWeaponData = data;
        };
        dataPathAssigns[AMMO_DATA_PATH] = function (data) {
            SmurfyAmmoData = data;
        };
        dataPathAssigns[MODULE_DATA_PATH] = function (data) {
            SmurfyModuleData = data;
        };
        dataPathAssigns[MECH_DATA_PATH] = function (data) {
            SmurfyMechData = data;
        };
        dataPathAssigns[OMNIPOD_DATA_PATH] = function (data) {
            let flatData = flattenOmnipodData(data);
            SmurfyOmnipodData = flatData.flatOmnipodData;
            SmurfyCTOmnipods = flatData.ctOmnipodMap;
        };
        let initPromises = [];
        for (let path of dataPaths) {
            initPromises.push(initDataPromise(path));
        }
        let loadAllInitData = Promise.all(initPromises);
        return loadAllInitData.then(function (dataArray) {
            for (let idx in dataArray) {
                let path = dataPaths[idx];
                dataPathAssigns[path](dataArray[idx]);
            }
            MechModel.initAddedData();
        });
    };
    MechModel.initAddedData = function () {
        initHeatsinkIds();
        initAddedHeatsinkData();
        initAddedWeaponData();
    };
    const ISHeatsinkName = "HeatSink_MkI";
    const ISDoubleHeatsinkName = "DoubleHeatSink_MkI";
    const ClanDoubleHeatsinkName = "ClanDoubleHeatSink";
    var ISSingleHeatsinkId;
    var ISDoubleHeatsinkId;
    var ClanDoubleHeatsinkId;
    const heatsinkType = "CHeatSinkStats";
    var initHeatsinkIds = function () {
        for (let moduleId in SmurfyModuleData) {
            let moduleData = SmurfyModuleData[moduleId];
            if (moduleData.type === heatsinkType) {
                if (moduleData.name === ISHeatsinkName) {
                    ISSingleHeatsinkId = moduleId;
                }
                else if (moduleData.name === ISDoubleHeatsinkName) {
                    ISDoubleHeatsinkId = moduleId;
                }
                else if (moduleData.name === ClanDoubleHeatsinkName) {
                    ClanDoubleHeatsinkId = moduleId;
                }
            }
        }
    };
    //add additional data to heatsink moduledata
    //Addditional data can be found in data/addedheatsinkdata.js
    var initAddedHeatsinkData = function () {
        for (let idx in SmurfyModuleData) {
            let moduleData = SmurfyModuleData[idx];
            if (moduleData.type === "CHeatSinkStats") {
                let addedData = AddedData._AddedHeatsinkData[moduleData.name];
                $.extend(moduleData.stats, addedData);
            }
        }
    };
    //adds fields to smurfy weapon data
    //additional data can be found in data/addedweapondata.js
    var initAddedWeaponData = function () {
        for (let idx in SmurfyWeaponData) {
            let weaponData = SmurfyWeaponData[idx];
            let addedData = AddedData._AddedWeaponData[weaponData.name];
            $.extend(weaponData, addedData);
        }
    };
    //Load dummy data from javascript files in data folder
    MechModel.initDummyModelData = function () {
        SmurfyWeaponData = DummyWeaponData;
        SmurfyAmmoData = DummyAmmoData;
        SmurfyMechData = DummyMechData;
        SmurfyModuleData = DummyModuleData;
        let flatData = flattenOmnipodData(_DummyOmnipods);
        SmurfyOmnipodData = flatData.flatOmnipodData;
        SmurfyCTOmnipods = flatData.ctOmnipodMap;
        MechModel.initAddedData();
    };
    MechModel.getSmurfyMechData = function (smurfyMechId) {
        return SmurfyMechData[smurfyMechId];
    };
    MechModel.getSmurfyWeaponData = function (smurfyItemId) {
        return SmurfyWeaponData[smurfyItemId];
    };
    var smurfyWeaponNameMap = {};
    MechModel.getSmurfyWeaponDataByName = function (smurfyName) {
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
    };
    MechModel.getSmurfyModuleData = function (smurfyModuleId) {
        return SmurfyModuleData[smurfyModuleId];
    };
    MechModel.getSmurfyAmmoData = function (smurfyItemId) {
        return SmurfyAmmoData[smurfyItemId];
    };
    MechModel.getSmurfyOmnipodData = function (smurfyOmnipodId) {
        return SmurfyOmnipodData[smurfyOmnipodId];
    };
    MechModel.getSmurfyCTOmnipod = function (mechName) {
        return SmurfyCTOmnipods[mechName];
    };
    var isHeatsinkModule = function (smurfyModuleId) {
        let smurfyModuleData = MechModel.getSmurfyModuleData(smurfyModuleId);
        return smurfyModuleData && smurfyModuleData.type === "CHeatSinkStats";
    };
    var isEngineModule = function (smurfyModuleId) {
        let smurfyModuleData = MechModel.getSmurfyModuleData(smurfyModuleId);
        return smurfyModuleData && smurfyModuleData.type === "CEngineStats";
    };
    //base structure value computation for a given tonnage.
    //Reference: http://mwo.gamepedia.com/Internal_Structure
    MechModel.baseMechStructure = function (location, tonnage) {
        return GlobalGameInfo._MechBaseStructure[tonnage][location];
    };
    MechModel.baseMechArmor = function (location, tonnage) {
        if (location === MechModel.Component.HEAD) {
            return MechModel.baseMechStructure(location, tonnage);
        }
        else {
            return MechModel.baseMechStructure(location, tonnage) * 2;
        }
    };
    //Object creation methods.
    //TODO: see if it's better to put these in the object constructors instead
    var mechHealthFromSmurfyMechLoadout = function (smurfyMechLoadout, quirks) {
        var mechHealth;
        var smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
        var tonnage = smurfyMechData.details.tons;
        var componentHealthList = [];
        for (let smurfyMechComponent of smurfyMechLoadout.configuration) {
            let componentHealth = componentHealthFromSmurfyMechComponent(smurfyMechComponent, quirks, tonnage);
            componentHealthList.push(componentHealth);
        }
        mechHealth = new MechHealth(componentHealthList);
        return mechHealth;
    };
    var componentHealthFromSmurfyMechComponent = function (smurfyMechComponent, smurfyMechQuirks, tonnage) {
        var componentHealth; //return value
        var location = smurfyMechComponent.name;
        var armor = smurfyMechComponent.armor;
        var structure = MechModel.baseMechStructure(location, tonnage);
        let bonus = MechModelQuirks.getArmorStructureBonus(location, smurfyMechQuirks);
        componentHealth = new ComponentHealth(location, Number(armor) + Number(bonus.armor), Number(structure) + Number(bonus.structure), Number(armor) + Number(bonus.armor), Number(structure) + Number(bonus.structure));
        return componentHealth;
    };
    var collectFromSmurfyConfiguration = function (smurfyMechConfiguration, collectFunction) {
        var outputList = [];
        for (let smurfyMechComponent of smurfyMechConfiguration) {
            let location = smurfyMechComponent.name;
            for (let smurfyMechComponentItem of smurfyMechComponent.items) {
                let entry = collectFunction(location, smurfyMechComponentItem);
                if (entry) {
                    outputList.push(entry);
                }
            }
        }
        return outputList;
    };
    var weaponInfoListFromSmurfyMechLoadout = function (smurfyMechLoadout, mechInfo) {
        var weaponInfoList = [];
        weaponInfoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration, function (location, smurfyMechComponentItem) {
            if (smurfyMechComponentItem.type === "weapon") {
                let weaponId = smurfyMechComponentItem.id;
                let smurfyWeaponData = MechModel.getSmurfyWeaponData(weaponId);
                let weaponInfo = new MechModelWeapons.WeaponInfo(weaponId, location, smurfyWeaponData, mechInfo);
                return weaponInfo;
            }
            else {
                return null;
            }
        });
        return weaponInfoList;
    };
    var heatsinkListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
        var heatsinkList = [];
        heatsinkList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration, function (location, smurfyMechComponentItem) {
            let itemId = smurfyMechComponentItem.id;
            if (isHeatsinkModule(itemId)) {
                let heatsink = heatsinkFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
                return heatsink;
            }
            else {
                return null;
            }
        });
        return heatsinkList;
    };
    var heatsinkFromSmurfyMechComponentItem = function (location, smurfyMechComponentItem) {
        let heatsinkId = smurfyMechComponentItem.id;
        let smurfyModuleData = MechModel.getSmurfyModuleData(heatsinkId);
        let heatsink = new Heatsink(location, smurfyModuleData);
        return heatsink;
    };
    var ammoBoxListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
        var ammoList = [];
        ammoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration, function (location, smurfyMechComponentItem) {
            if (smurfyMechComponentItem.type === "ammo") {
                let ammoBox = ammoBoxFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
                return ammoBox;
            }
            else {
                return null;
            }
        });
        return ammoList;
    };
    var ammoBoxFromSmurfyMechComponentItem = function (location, smurfyMechComponentItem) {
        var ammoBox;
        let ammoData = MechModel.getSmurfyAmmoData(smurfyMechComponentItem.id);
        let type = ammoData.type;
        let ammoCount = ammoData.num_shots;
        let weaponIds = ammoData.weapons;
        ammoBox = new AmmoBox(type, location, weaponIds, ammoCount, true);
        return ammoBox;
    };
    //Gets the heatsink module id of the heatsinks in the engine.
    //Uses direct name matching because there doesn't seem to be an id reference
    //from the heatsink upgrade items to the associated heatsink
    var getEngineHeatsinkId = function (smurfyMechLoadout) {
        var upgradeToIdMap = {
            "STANDARD HEAT SINK": ISSingleHeatsinkId,
            "DOUBLE HEAT SINK": ISDoubleHeatsinkId,
            "CLAN DOUBLE HEAT SINK": ClanDoubleHeatsinkId
        };
        for (let mechUpgrade of smurfyMechLoadout.upgrades) {
            if (mechUpgrade.type === "HeatSink") {
                return upgradeToIdMap[mechUpgrade.name];
            }
        }
        return null; //should not happen
    };
    var getEngineSmurfyModuleData = function (smurfyMechLoadout) {
        for (let equipment of smurfyMechLoadout.stats.equipment) {
            let equipmentModuleData = MechModel.getSmurfyModuleData(equipment.id);
            if (equipmentModuleData.type === "CEngineStats") {
                return equipmentModuleData;
            }
        }
        return null; //should not happen
    };
    var isClanXLEngine = function (smurfyModuleData) {
        return smurfyModuleData.name.startsWith("Engine_Clan") &&
            smurfyModuleData.type === "CEngineStats";
    };
    var engineInfoFromSmurfyMechLoadout = function (smurfyMechLoadout) {
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
        let heatsink = new Heatsink(MechModel.Component.CENTRE_TORSO, MechModel.getSmurfyModuleData(engineHeatsinkId));
        let engineInfo = new EngineInfo(engineId, name, heatsink, heatsinkCount);
        return engineInfo;
    };
    MechModel.isOmnimech = function (smurfyMechLoadout) {
        for (let component of smurfyMechLoadout.configuration) {
            if (component.omni_pod) {
                return true;
            }
        }
        return false;
    };
    var numExternalHeatsinks = function (smurfyMechLoadout) {
        let heatsinkList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration, function (location, smurfyMechComponentItem) {
            let itemId = smurfyMechComponentItem.id;
            if (isHeatsinkModule(itemId) && location !== MechModel.Component.CENTRE_TORSO) {
                let heatsink = heatsinkFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
                return heatsink;
            }
            else {
                return null;
            }
        });
        return heatsinkList.length;
    };
    var calculateHeatStats = function (heatsinkInfoList, engineInfo, engineHeatEfficiency, generalQuirkBonus) {
        const BASE_HEAT_CAPACITY = 30;
        let heatCapacity = BASE_HEAT_CAPACITY;
        let heatDissipation = 0;
        //non-fixed heatsinks
        for (let heatsink of heatsinkInfoList) {
            if (!heatsink.active)
                continue;
            if (heatsink.location === MechModel.Component.CENTRE_TORSO) {
                //NOTE: internal non-fixed heatsinks are included in the engine heatsink count
                // heatCapacity += Number(heatsink.internalHeatCapacity);
                // heatDissipation += Number(heatsink.engineCooling);
            }
            else {
                //external non-fixed
                heatCapacity += Number(heatsink.externalHeatCapacity);
                heatDissipation += Number(heatsink.cooling);
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
            "heatCapacity": heatCapacity,
            "heatDissipation": heatDissipation
        };
    };
    var initWeaponStateList = function (mechState) {
        var weaponStateList = [];
        let mechInfo = mechState.mechInfo;
        for (let weaponInfo of mechInfo.weaponInfoList) {
            let weaponState = null;
            if (weaponInfo.hasDuration()) {
                weaponState =
                    new MechModelWeapons.WeaponStateDurationFire(weaponInfo, mechState);
            }
            else if (weaponInfo.isContinuousFire()) {
                weaponState =
                    new MechModelWeapons.WeaponStateContinuousFire(weaponInfo, mechState);
            }
            else {
                //single-fire
                if (weaponInfo.isOneShot) {
                    weaponState =
                        new MechModelWeapons.WeaponStateOneShot(weaponInfo, mechState);
                }
                else {
                    weaponState =
                        new MechModelWeapons.WeaponStateSingleFire(weaponInfo, mechState);
                }
            }
            weaponStateList.push(weaponState);
        }
        return weaponStateList;
    };
    //constructor
    class Mech {
        constructor(new_mech_id, team, smurfyMechLoadout) {
            this.smurfy_mech_id = smurfyMechLoadout.mech_id;
            this.smurfyMechData = MechModel.getSmurfyMechData(this.smurfy_mech_id);
            this.mech_id = new_mech_id;
            this.mechInfo = new MechInfo(new_mech_id, smurfyMechLoadout);
            this.mechState = new MechState(this.mechInfo);
            this.mechTeam = team;
            this.targetMech; //set by simulation
        }
        getName() {
            return this.smurfyMechData.name;
        }
        getTranslatedName() {
            return this.smurfyMechData.translated_name;
        }
        getMechId() {
            return this.mech_id;
        }
        getMechInfo() {
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
        setMechTeam(team) {
            this.mechTeam = team;
        }
        setTargetMech(newTarget) {
            this.targetMech = newTarget;
        }
        getTargetMech() {
            return this.targetMech;
        }
    }
    MechModel.Mech = Mech;
    MechModel.addMech = function (mech_id, team, smurfyMechLoadout) {
        var newMech = new Mech(mech_id, team, smurfyMechLoadout);
        MechModel.mechTeams[team].push(newMech);
        console.log("Added mech mech_id: " + mech_id +
            " translated_mech_name: " + newMech.getTranslatedName());
        MechModel.initMechPatterns(newMech);
        return newMech;
    };
    MechModel.addMechAtIndex = function (mech_id, team, smurfyMechLoadout, index) {
        var newMech = new Mech(mech_id, team, smurfyMechLoadout);
        MechModel.mechTeams[team][index] = newMech;
        console.log("Added mech mech_id: " + mech_id
            + " translated_mech_name: " + newMech.getTranslatedName()
            + " at index " + index);
        MechModel.initMechPatterns(newMech);
        return newMech;
    };
    var getMechPosFromId = function (mech_id) {
        let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
        for (let team of teamList) {
            let mechList = MechModel.mechTeams[team];
            for (let mechIdx in mechList) {
                let mech = mechList[mechIdx];
                if (mech.getMechId() === mech_id) {
                    return { team: team, index: Number(mechIdx) };
                }
            }
        }
        return null;
    };
    var getMechFromPos = function (mechPos) {
        return MechModel.mechTeams[mechPos.team][mechPos.index];
    };
    MechModel.deleteMech = function (mech_id) {
        let mechPos = getMechPosFromId(mech_id);
        if (!mechPos)
            return false;
        let mechList = MechModel.mechTeams[mechPos.team];
        mechList.splice(mechPos.index, 1);
        return true;
    };
    //removes src mech from its current position and inserts it before dest mech
    MechModel.moveMech = function (srcMechId, destMechId) {
        let srcMechPos = getMechPosFromId(srcMechId);
        if (!srcMechPos)
            return false;
        let srcMech = getMechFromPos(srcMechPos);
        let status = MechModel.deleteMech(srcMechId);
        if (!status)
            return false;
        //get dest pos AFTER delete to keep indices straight when moving in the same list
        let destMechPos = getMechPosFromId(destMechId);
        let deletedMechList = MechModel.mechTeams[srcMechPos.team];
        if (!destMechPos) {
            //reinsert deleted mech on error
            deletedMechList.splice(srcMechPos.index, 0, srcMech);
            return false;
        }
        srcMech.setMechTeam(destMechPos.team);
        let insertMechList = MechModel.mechTeams[destMechPos.team];
        insertMechList.splice(destMechPos.index, 0, srcMech);
        return true;
    };
    //Debug, set default mech patterns
    MechModel.initMechTeamPatterns = function (mechTeam) {
        for (let mech of mechTeam) {
            MechModel.initMechPatterns(mech);
        }
    };
    MechModel.initMechPatterns = function (mech) {
        mech.firePattern = MechFirePattern.getDefault();
        mech.componentTargetPattern = MechTargetComponent.getDefault();
        mech.mechTargetPattern = MechTargetMech.getDefault();
        mech.accuracyPattern = MechAccuracyPattern.getDefault();
    };
    MechModel.generateMechId = function (smurfyMechLoadout) {
        let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
        let mechName = smurfyMechData.name;
        let rand = function () {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        let newMechId = mechName + "-" +
            rand() + "-" + rand() + "-" + rand() + "-" + rand();
        while (mechIdMap[newMechId]) {
            newMechId = newMechId = mechName +
                rand() + "-" + rand() + "-" + rand() + "-" + rand();
        }
        mechIdMap[newMechId] = true;
        return newMechId;
    };
    //Resets the MechStates of all mechs to their fresh value
    MechModel.resetState = function () {
        let teams = [MechModel.Team.BLUE, MechModel.Team.RED];
        for (let team of teams) {
            let mechTeam = MechModel.mechTeams[team];
            for (let mech of mechTeam) {
                mech.resetMechState();
            }
        }
    };
    MechModel.isTeamAlive = function (team) {
        let mechTeam = MechModel.mechTeams[team];
        for (let mech of mechTeam) {
            if (mech.getMechState().isAlive()) {
                return true;
            }
        }
        return false;
    };
    //called every time team-level statistics need to be updated (e.g. when a weapon hits)
    MechModel.updateModelTeamStats = function (team) {
        let totalTeamBurstDamage = 0;
        let teamStatEntry = teamStats[team];
        if (!teamStatEntry) {
            teamStatEntry = new TeamStats();
            teamStats[team] = teamStatEntry;
        }
        for (let mech of MechModel.mechTeams[team]) {
            let burstDamage = mech.getMechState().mechStats.getBurstDamage(MechSimulatorLogic.getSimTime());
            totalTeamBurstDamage += burstDamage;
        }
        if (totalTeamBurstDamage > teamStatEntry.maxBurstDamage) {
            teamStatEntry.maxBurstDamage = totalTeamBurstDamage;
        }
    };
    MechModel.getTeamStats = function (team) {
        return teamStats[team];
    };
    var parseSmurfyURL = function (url) {
        let urlMatcher = /https?:\/\/mwo\.smurfy-net\.de\/mechlab#i=([0-9]+)&l=([a-z0-9]+)/;
        let results = urlMatcher.exec(url);
        if (results) {
            let id = results[1];
            let loadout = results[2];
            if (id && loadout) {
                return { "id": id, "loadout": loadout };
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    MechModel.loadSmurfyMechLoadoutFromURL = function (url) {
        let params = parseSmurfyURL(url);
        if (!params) {
            return null;
        }
        return MechModel.loadSmurfyMechLoadoutFromID(params.id, params.loadout);
    };
    MechModel.loadSmurfyMechLoadoutFromID = function (smurfyId, smurfyLoadoutId) {
        let ret = new Promise(function (resolve, reject) {
            var smurfyLoadoutURL = SMURFY_PROXY_URL + "data/mechs/" + smurfyId
                + "/loadouts/" + smurfyLoadoutId + ".json";
            $.ajax({
                url: smurfyLoadoutURL,
                type: 'GET',
                dataType: 'JSON'
            })
                .done(function (data) {
                resolve(data);
            })
                .fail(function (data) {
                reject(Error(data));
            });
        });
        return ret;
    };
    //returns a list of adjacent components
    //MechModel.Component -> [MechModel.Component...]
    MechModel.getAdjacentComponents = function (component) {
        if (component === MechModel.Component.HEAD) {
            return [];
        }
        else if (component === MechModel.Component.CENTRE_TORSO) {
            return [MechModel.Component.LEFT_TORSO, MechModel.Component.RIGHT_TORSO];
        }
        else if (component === MechModel.Component.LEFT_TORSO) {
            return [MechModel.Component.CENTRE_TORSO, MechModel.Component.LEFT_ARM];
        }
        else if (component === MechModel.Component.RIGHT_TORSO) {
            return [MechModel.Component.CENTRE_TORSO, MechModel.Component.RIGHT_ARM];
        }
        else if (component === MechModel.Component.RIGHT_ARM) {
            return [MechModel.Component.RIGHT_TORSO];
        }
        else if (component === MechModel.Component.LEFT_ARM) {
            return [MechModel.Component.LEFT_TORSO];
        }
        else if (component === MechModel.Component.LEFT_LEG) {
            return [MechModel.Component.LEFT_TORSO];
        }
        else if (component === MechModel.Component.RIGHT_LEG) {
            return [MechModel.Component.RIGHT_TORSO];
        }
        return [];
    };
    var getTransferDamageLocation = function (component) {
        if (component === MechModel.Component.HEAD) {
            return null;
        }
        else if (component === MechModel.Component.CENTRE_TORSO) {
            return null;
        }
        else if (component === MechModel.Component.LEFT_TORSO) {
            return MechModel.Component.CENTRE_TORSO;
        }
        else if (component === MechModel.Component.RIGHT_TORSO) {
            return MechModel.Component.CENTRE_TORSO;
        }
        else if (component === MechModel.Component.RIGHT_ARM) {
            return MechModel.Component.RIGHT_TORSO;
        }
        else if (component === MechModel.Component.LEFT_ARM) {
            return MechModel.Component.LEFT_TORSO;
        }
        else if (component === MechModel.Component.LEFT_LEG) {
            return MechModel.Component.LEFT_TORSO;
        }
        else if (component === MechModel.Component.RIGHT_LEG) {
            return MechModel.Component.RIGHT_TORSO;
        }
    };
    MechModel.getMechFromId = function (mechId) {
        let mechPos = getMechPosFromId(mechId);
        if (!mechPos)
            return null;
        return MechModel.mechTeams[mechPos.team][mechPos.index];
    };
    MechModel.clearModel = function () {
        MechModel.mechTeams[MechModel.Team.BLUE] = [];
        MechModel.mechTeams[MechModel.Team.RED] = [];
        teamStats = {};
    };
})(MechModel || (MechModel = {}));
//# sourceMappingURL=simulator-model.js.map