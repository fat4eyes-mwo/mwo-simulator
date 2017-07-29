"use strict";
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-model-weapons.ts" />
/// <reference path="simulator-accuracypattern.ts" />
/// <reference path="simulator-componenttarget.ts" />
/// <reference path="simulator-firepattern.ts" />
/// <reference path="simulator-mechtarget.ts" />
/// <reference path="simulator-patterns.ts" />
/// <reference path="simulator-view-mechPanel.ts" />
//Methods that update the MechView from the MechModel, and vice versa
var MechModelView;
(function (MechModelView) {
    MechModelView.ViewUpdate = {
        TEAMSTATS: "teamstats",
        MECHLISTS: "mechlists",
    };
    MechModelView.refreshView = function (updates = [MechModelView.ViewUpdate.TEAMSTATS, MechModelView.ViewUpdate.MECHLISTS]) {
        document.title = getPageTitle();
        let mechTeamList = [MechModel.Team.BLUE, MechModel.Team.RED];
        for (let team of mechTeamList) {
            if (updates.includes(MechModelView.ViewUpdate.MECHLISTS)) {
                MechView.clearMechList(team);
            }
            if (updates.includes(MechModelView.ViewUpdate.TEAMSTATS)) {
                MechView.clearMechStats(team);
            }
            let mechIdList = [];
            for (let mech of MechModel.mechTeams[team]) {
                mechIdList.push(mech.getMechId());
            }
            if (updates.includes(MechModelView.ViewUpdate.TEAMSTATS)) {
                MechViewTeamStats.addTeamStatsPanel(team, mechIdList);
            }
            for (let mech of MechModel.mechTeams[team]) {
                if (updates.includes(MechModelView.ViewUpdate.MECHLISTS)) {
                    MechViewMechPanel.addMechPanel(mech, team);
                }
                updateAll(mech);
            }
            MechModelView.updateTeamStats(team);
        }
        let simulatorParameters = MechSimulatorLogic.getSimulatorParameters();
        MechViewSimSettings.updateSimSettingsView(simulatorParameters);
    };
    const BASE_PAGE_TITLE = "MWO Loadout Simulator";
    const TITLE_MAX_MECHS = 2;
    var getPageTitle = function () {
        let mechTeamList = [MechModel.Team.BLUE, MechModel.Team.RED];
        let teamTitle = {};
        for (let team of mechTeamList) {
            teamTitle[team] = "";
            let mechTeam = MechModel.mechTeams[team];
            let idx = "0";
            for (idx in mechTeam) {
                if (Number(idx) >= TITLE_MAX_MECHS)
                    break;
                let mech = mechTeam[idx];
                if (Number(idx) > 0) {
                    teamTitle[team] += ", ";
                }
                teamTitle[team] += mech.getTranslatedName();
            }
            if (Number(idx) >= TITLE_MAX_MECHS) {
                teamTitle[team] += ", " + (mechTeam.length - Number(idx)) + " more";
            }
        }
        return BASE_PAGE_TITLE + " : " +
            teamTitle[MechModel.Team.BLUE] + " VS "
            + teamTitle[MechModel.Team.RED];
    };
    MechModelView.updateHeat = function (mech) {
        let heatState = mech.getMechState().heatState;
        MechViewMechPanel.updateHeat(mech.getMechId(), heatState.currHeat, heatState.currMaxHeat);
    };
    MechModelView.updateCooldown = function (mech) {
        let mechState = mech.getMechState();
        for (let weaponIndex in mechState.weaponStateList) {
            let type = "cooldown";
            let weaponState = mechState.weaponStateList[weaponIndex];
            let weaponInfo = weaponState.weaponInfo;
            let cooldownPercent = 0;
            if (weaponState.weaponCycle === MechModel.WeaponCycle.READY) {
                cooldownPercent = 0;
            }
            else if (weaponState.weaponCycle === MechModel.WeaponCycle.FIRING) {
                if (weaponState.hasJamBar()) {
                    cooldownPercent = weaponState.getJamProgress();
                    type = "jamBar";
                }
                else {
                    cooldownPercent = 1;
                }
            }
            else if (weaponState.weaponCycle === MechModel.WeaponCycle.DISABLED) {
                cooldownPercent = 1;
            }
            else if (weaponState.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
                cooldownPercent = Number(weaponState.cooldownLeft) / Number(weaponState.computeWeaponCooldown());
            }
            else if (weaponState.weaponCycle === MechModel.WeaponCycle.SPOOLING) {
                cooldownPercent = 1 - (Number(weaponState.spoolupLeft) / Number(weaponInfo.spinup));
            }
            else if (weaponState.weaponCycle === MechModel.WeaponCycle.JAMMED) {
                cooldownPercent = 1;
            }
            MechViewMechPanel.setWeaponCooldown(mech.getMechId(), Number(weaponIndex), cooldownPercent, type);
        }
    };
    MechModelView.updateWeaponStatus = function (mech) {
        let mechState = mech.getMechState();
        for (let weaponIndex in mechState.weaponStateList) {
            let weaponState = mechState.weaponStateList[weaponIndex];
            MechViewMechPanel.setWeaponState(mech.getMechId(), Number(weaponIndex), weaponState.weaponCycle);
            let ammoState = mech.getMechState().ammoState;
            let weaponAmmoCount = weaponState.getAvailableAmmo();
            MechViewMechPanel.setWeaponAmmo(mech.getMechId(), Number(weaponIndex), weaponAmmoCount);
        }
    };
    var updatePaperDoll = function (mech) {
        let mechId = mech.getMechId();
        let mechHealth = mech.getMechState().mechHealth;
        for (let mechComponentHealth of mechHealth.componentHealth) {
            let location = mechComponentHealth.location;
            let armorPercent = Number(mechComponentHealth.armor) / Number(mechComponentHealth.maxArmor);
            let structurePercent = Number(mechComponentHealth.structure) / Number(mechComponentHealth.maxStructure);
            MechViewMechPanel.setPaperDollArmor(mechId, location, armorPercent);
            MechViewMechPanel.setPaperDollStructure(mechId, location, structurePercent);
        }
    };
    var updateMechHealthNumbers = function (mech) {
        let mechHealth = mech.getMechState().mechHealth;
        for (let mechComponentHealth of mechHealth.componentHealth) {
            MechViewMechPanel.updateMechHealthNumbers(mech.getMechId(), {
                location: mechComponentHealth.location,
                armor: mechComponentHealth.armor,
                structure: mechComponentHealth.structure,
                maxArmor: mechComponentHealth.maxArmor,
                maxStructure: mechComponentHealth.maxStructure
            });
        }
    };
    var updateMechStatus = function (mech) {
        let mechName = mech.getTranslatedName();
        let mechHealth = mech.getMechState().mechHealth;
        let currTotalHealth = mechHealth.totalCurrHealth();
        let currMaxHealth = mechHealth.totalMaxHealth();
        let isAlive = mech.getMechState().isAlive();
        let targetMechName = mech.getTargetMech() ?
            mech.getTargetMech().getTranslatedName() : "";
        let mechStats = mech.getMechState().mechStats;
        let simTime = MechSimulatorLogic.getSimTime();
        let totalDmg = Number(mechStats.totalDamage);
        let dps = simTime > 0 ? Number(mechStats.totalDamage) / simTime * 1000 : 0;
        let burst = mechStats.getBurstDamage(simTime);
        MechViewMechPanel.updateMechStatusPanel(mech.getMechId(), isAlive, currTotalHealth, currMaxHealth, targetMechName, dps, burst, totalDmg);
    };
    var updateMechTitle = function (mech) {
        let mechName = mech.getTranslatedName();
        let mechInfo = mech.getMechState().mechInfo;
        MechViewMechPanel.updateMechTitlePanel(mech.getMechId(), mechName, mechInfo.smurfyMechId, mechInfo.smurfyLoadoutId);
    };
    MechModelView.updateHealth = function (mech) {
        updatePaperDoll(mech);
        updateMechHealthNumbers(mech);
        updateMechStatus(mech);
    };
    MechModelView.updateSimTime = function (simTime) {
        MechView.updateSimTime(simTime);
    };
    MechModelView.updateMech = function (mech) {
        let mechState = mech.getMechState();
        let updateFunctionMap = {};
        updateFunctionMap[MechModel.UpdateType.FULL] = updateAll;
        updateFunctionMap[MechModel.UpdateType.HEALTH] = MechModelView.updateHealth;
        updateFunctionMap[MechModel.UpdateType.HEAT] = MechModelView.updateHeat;
        updateFunctionMap[MechModel.UpdateType.COOLDOWN] = MechModelView.updateCooldown;
        updateFunctionMap[MechModel.UpdateType.WEAPONSTATE] = MechModelView.updateWeaponStatus;
        updateFunctionMap[MechModel.UpdateType.STATS] = updateStats;
        for (let updateType in mechState.updateTypes) {
            if (mechState.updateTypes[updateType]) {
                updateFunctionMap[updateType](mech);
            }
        }
        mechState.updateTypes = {};
    };
    var updateStats = function (mech) {
        updateMechStatus(mech);
    };
    var updateAll = function (mech) {
        updateMechTitle(mech);
        MechModelView.updateHealth(mech);
        MechModelView.updateHeat(mech);
        MechModelView.updateCooldown(mech);
        MechModelView.updateWeaponStatus(mech);
        updateStats(mech);
    };
    class MechHealthToView {
        constructor(mechId, currHealth, maxHealth, isAlive) {
            this.mechId = mechId;
            this.currHealth = currHealth;
            this.maxHealth = maxHealth;
            this.isAlive = isAlive;
        }
    }
    MechModelView.updateTeamStats = function (team) {
        let mechHealthList = [];
        let totalTeamDamage = 0;
        let totalTeamBurstDamage = 0;
        for (let mech of MechModel.mechTeams[team]) {
            let mechStats = mech.getMechState().mechStats;
            totalTeamDamage += Number(mechStats.totalDamage);
            let burstDamage = mechStats.getBurstDamage(MechSimulatorLogic.getSimTime());
            totalTeamBurstDamage += Number(burstDamage);
            let mechHealth = mech.getMechState().mechHealth;
            let mechHealthToView = new MechHealthToView(mech.getMechId(), mechHealth.totalCurrHealth(), mechHealth.totalMaxHealth(), mech.getMechState().isAlive());
            mechHealthList.push(mechHealthToView);
        }
        let dps = MechSimulatorLogic.getSimTime() > 0 ?
            Number(totalTeamDamage) / MechSimulatorLogic.getSimTime() * 1000 : 0;
        MechViewTeamStats.updateTeamStats(team, mechHealthList, Number(totalTeamDamage), dps, totalTeamBurstDamage);
    };
    MechModelView.updateDebugText = function (text) {
        MechView.setDebugText(text);
    };
    MechModelView.getSimulatorParameters = function () {
        return MechSimulatorLogic.getSimulatorParameters();
    };
    MechModelView.setSimulatorParameters = function (simulatorParameters) {
        MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
    };
    MechModelView.setTeamFirePattern = function (team, firePattern) {
        let mechList = MechModel.mechTeams[team];
        for (let mech of mechList) {
            mech.firePattern = firePattern;
        }
    };
    MechModelView.setTeamComponentTargetPattern = function (team, componentTargetPattern) {
        let mechList = MechModel.mechTeams[team];
        for (let mech of mechList) {
            mech.componentTargetPattern = componentTargetPattern;
        }
    };
    MechModelView.setTeamAccuracyPattern = function (team, accuracyPattern) {
        let mechList = MechModel.mechTeams[team];
        for (let mech of mechList) {
            mech.accuracyPattern = accuracyPattern;
        }
    };
    MechModelView.setTeamMechTargetPattern = function (team, mechTargetPattern) {
        let mechList = MechModel.mechTeams[team];
        for (let mech of mechList) {
            mech.mechTargetPattern = mechTargetPattern;
        }
    };
    class TeamReport {
        constructor(team) {
            this.team = team;
            this.weaponStats = new Map();
            this.mechReports = [];
            let mechTeam = MechModel.mechTeams[team];
            for (let mech of mechTeam) {
                let mechStats = mech.getMechState().mechStats;
                let mechReport = new MechReport(mech.getMechId(), mech.getTranslatedName(), mechStats);
                this.mechReports.push(mechReport);
            }
            this.computeWeaponStats();
        }
        //consolidate all the weaponStats from the mechs
        computeWeaponStats() {
            for (let mechReport of this.mechReports) {
                let mechWeaponStats = mechReport.weaponReport.weaponStats;
                for (let weaponId of mechWeaponStats.keys()) {
                    let weaponStat = this.weaponStats.get(weaponId);
                    let mechWeaponStat = mechWeaponStats.get(weaponId);
                    if (!weaponStat) {
                        //create new entry to avoid changing the contents of mechWeaponStats
                        weaponStat = new WeaponStat(mechWeaponStat.name, mechWeaponStat.count, mechWeaponStat.damage, mechWeaponStat.dps);
                        this.weaponStats.set(weaponId, weaponStat);
                    }
                    else {
                        weaponStat.damage += mechWeaponStat.damage;
                        weaponStat.dps = (weaponStat.dps * weaponStat.count
                            + mechWeaponStat.dps * mechWeaponStat.count) /
                            (weaponStat.count + mechWeaponStat.count);
                        weaponStat.count += mechWeaponStat.count;
                    }
                }
            }
        }
        //returns [{name: <weaponName>, damage: <weaponDamage>, dps: <weaponDPS>}]
        getWeaponStats() {
            let ret = [];
            for (let stats of this.weaponStats.values()) {
                ret.push(stats);
            }
            return ret;
        }
        getTotalDamage() {
            let totalDamage = 0;
            for (let mechReport of this.mechReports) {
                totalDamage += mechReport.getTotalDamage();
            }
            return totalDamage;
        }
        getDPS() {
            let simTime = MechSimulatorLogic.getSimTime();
            return simTime > 0 ? this.getTotalDamage() / simTime * 1000 : 0;
        }
        getMaxBurst() {
            let teamStats = MechModel.getTeamStats(this.team);
            return teamStats ? teamStats.maxBurstDamage : 0;
        }
    }
    class MechReport {
        constructor(mechId, mechName, mechStats) {
            this.mechId = mechId;
            this.mechName = mechName;
            this.mechStats = mechStats; //DO NOT ACCESS DIRECTLY IN VIEW. Use the methods instead
            this.weaponReport = new WeaponReport(mechStats.weaponFires);
        }
        getMaxBurstDamage() {
            return this.weaponReport.getMaxBurstDamage();
        }
        getTotalDamage() {
            return this.mechStats.totalDamage;
        }
        getTimeOfDeath() {
            return this.mechStats.timeOfDeath;
        }
        getDPS() {
            let endTime = this.mechStats.timeOfDeath ?
                this.mechStats.timeOfDeath
                : MechSimulatorLogic.getSimTime();
            return endTime > 0 ?
                this.getTotalDamage() / endTime * 1000
                : 0;
        }
    }
    class WeaponReport {
        constructor(weaponFires) {
            this.weaponFires = weaponFires; //DO NOT ACCESS THIS DIRECTLY IN VIEW. Use the methods instead
            this.maxBurstDamage = null; //will be filled in by computeWeaponStats
            this.weaponStats = new Map(); //weaponId -> {translatedName, count, damage, dps}
            this.computeWeaponStats();
        }
        computeWeaponStats() {
            let burstDamageStartIdx = null;
            for (let idx in this.weaponFires) {
                let weaponFire = this.weaponFires[idx];
                let weaponInfo = weaponFire.weaponState.weaponInfo;
                let weaponStat = this.weaponStats.get(weaponInfo.weaponId);
                let mechState = weaponFire.sourceMech.getMechState();
                //Latest time the weapon's mech was alive. Used to calculate DPS
                let endTime = mechState.isAlive() ?
                    MechSimulatorLogic.getSimTime() :
                    mechState.mechStats.timeOfDeath;
                if (!weaponStat) {
                    weaponStat = new WeaponStat(weaponInfo.translatedName, 1, weaponFire.damageDone.totalDamage(), weaponFire.damageDone.totalDamage() / endTime * 1000);
                    this.weaponStats.set(weaponInfo.weaponId, weaponStat);
                }
                else {
                    //Add to weapon damage, count and recompute DPS
                    weaponStat.count++;
                    weaponStat.damage += weaponFire.damageDone.totalDamage();
                    let currDPS = weaponFire.damageDone.totalDamage() / endTime * 1000;
                    weaponStat.dps = ((weaponStat.dps * (weaponStat.count - 1)) + currDPS) / weaponStat.count;
                }
                //Compute burst damage
                if (!burstDamageStartIdx) {
                    this.maxBurstDamage = weaponFire.damageDone.totalDamage();
                    burstDamageStartIdx = Number(idx);
                }
                else {
                    let currTime = weaponFire.createTime;
                    let burstInterval = MechModel.BURST_DAMAGE_INTERVAL;
                    while ((currTime - this.weaponFires[burstDamageStartIdx].createTime) > burstInterval) {
                        burstDamageStartIdx++;
                    }
                    let currBurstDamage = 0;
                    for (let burstIdx = burstDamageStartIdx; burstIdx <= Number(idx); burstIdx++) {
                        currBurstDamage += this.weaponFires[burstIdx].damageDone.totalDamage();
                    }
                    if (currBurstDamage > this.maxBurstDamage) {
                        this.maxBurstDamage = currBurstDamage;
                    }
                }
            }
        }
        getMaxBurstDamage() {
            return this.maxBurstDamage;
        }
        //returns [{name: <weaponName>, damage: <weaponDamage>, dps: <weaponDPS>}]
        getWeaponStats() {
            let ret = [];
            for (let stats of this.weaponStats.values()) {
                ret.push(stats);
            }
            return ret;
        }
    }
    class WeaponStat {
        constructor(name, count, damage, dps) {
            this.name = name;
            this.count = count;
            this.damage = damage;
            this.dps = dps;
        }
    }
    MechModelView.getTeamReport = function (team) {
        return new TeamReport(team);
    };
    MechModelView.updateVictory = function (team) {
        MechViewReport.showVictoryReport();
        // MechModelView.updateDebugText("Team Victory: " + team);
    };
    MechModelView.getVictorTeam = function () {
        if (!MechModel.isTeamAlive(MechModel.Team.BLUE) &&
            MechModel.isTeamAlive(MechModel.Team.RED)) {
            return MechModel.Team.RED;
        }
        if (!MechModel.isTeamAlive(MechModel.Team.RED) &&
            MechModel.isTeamAlive(MechModel.Team.BLUE)) {
            return MechModel.Team.BLUE;
        }
        return null;
    };
    MechModelView.getMechName = function (mechId, team) {
        let mech = MechModel.getMechFromId(mechId);
        if (mech) {
            return mech.getTranslatedName();
        }
        else {
            return null;
        }
    };
})(MechModelView || (MechModelView = {}));
//# sourceMappingURL=simulator-modelview.js.map