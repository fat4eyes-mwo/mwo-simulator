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
namespace MechModelView {
  type Team = MechModel.Team;
  type Mech = MechModel.Mech;
  type WeaponState = MechModelWeapons.WeaponState;
  type SimulatorParameters = MechSimulatorLogic.SimulatorParameters;
  type FirePattern = MechFirePattern.FirePattern;
  type AccuracyPattern = MechAccuracyPattern.AccuracyPattern;
  type TargetComponentPattern = MechTargetComponent.TargetComponentPattern;
  type TargetMechPattern = MechTargetMech.TargetMechPattern;
  type MechStats = MechModel.MechStats;
  type WeaponFire = MechSimulatorLogic.WeaponFire;

  //clears the view and recreates all UI elements
  export type ViewUpdate = string;
  export const ViewUpdate : {[index:string] : ViewUpdate} = {
    TEAMSTATS : "teamstats",
    MECHLISTS : "mechlists",
  };

  export var refreshView =
      function (updates : ViewUpdate[] = [ViewUpdate.TEAMSTATS, ViewUpdate.MECHLISTS]) : void {
    document.title = getPageTitle();
    let mechTeamList = [MechModel.Team.BLUE, MechModel.Team.RED];
    for (let team of mechTeamList) {
      if (updates.includes(ViewUpdate.MECHLISTS)) {
        MechView.clearMechList(team);
      }
      if (updates.includes(ViewUpdate.TEAMSTATS)) {
        MechView.clearMechStats(team);
      }
      let mechIdList = [];
      for (let mech of MechModel.mechTeams[team]) {
        mechIdList.push(mech.getMechId());
      }
      if (updates.includes(ViewUpdate.TEAMSTATS)) {
        MechViewTeamStats.addTeamStatsPanel(team, mechIdList);
      }
      for (let mech of MechModel.mechTeams[team]) {
        if (updates.includes(ViewUpdate.MECHLISTS)) {
          MechViewMechPanel.addMechPanel(mech, team);
        }
        updateAll(mech);
      }
      updateTeamStats(team);
    }
    let simulatorParameters = MechSimulatorLogic.getSimulatorParameters();
    MechViewSimSettings.updateSimSettingsView(simulatorParameters);
  }

  const BASE_PAGE_TITLE = "MWO Loadout Simulator";
  const TITLE_MAX_MECHS = 2;
  var getPageTitle = function() : string {
    let mechTeamList : Team[] = [MechModel.Team.BLUE, MechModel.Team.RED];
    let teamTitle : {[index:string] : Team} = {};

    for (let team of mechTeamList) {
      teamTitle[team] = "";
      let mechTeam = MechModel.mechTeams[team];
      let idx :string = "0";
      for (idx in mechTeam) {
        if (Number(idx) >= TITLE_MAX_MECHS) break;
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
  }

  export var updateHeat = function(mech : Mech) : void {
    let heatState = mech.getMechState().heatState;

    MechViewMechPanel.updateHeat(mech.getMechId(), heatState.currHeat, heatState.currMaxHeat);
  }

  export var updateCooldown = function(mech : Mech) : void {
    let mechState = mech.getMechState();
    for (let weaponIndex in mechState.weaponStateList) {
      let type = "cooldown";
      let weaponState = mechState.weaponStateList[weaponIndex];
      let weaponInfo = weaponState.weaponInfo;
      let cooldownPercent = 0;
      if (weaponState.weaponCycle === MechModel.WeaponCycle.READY) {
        cooldownPercent = 0;
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.FIRING) {
        if (weaponState.hasJamBar()) {
          cooldownPercent = weaponState.getJamProgress();
          type = "jamBar";
        } else {
          cooldownPercent = 1;
        }
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.DISABLED) {
        cooldownPercent = 1;
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
        cooldownPercent = Number(weaponState.cooldownLeft) / Number(weaponState.computeWeaponCooldown());
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.SPOOLING) {
        cooldownPercent = 1 - (Number(weaponState.spoolupLeft) / Number(weaponInfo.spinup));
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.JAMMED) {
        cooldownPercent = 1;
      }
      MechViewMechPanel.setWeaponCooldown(mech.getMechId(), Number(weaponIndex), cooldownPercent, type);
    }
  }

  export var updateWeaponStatus = function(mech : Mech) : void {
    let mechState = mech.getMechState();
    for (let weaponIndex in mechState.weaponStateList) {
      let weaponState = mechState.weaponStateList[weaponIndex];
      MechViewMechPanel.setWeaponState(mech.getMechId(), Number(weaponIndex), weaponState.weaponCycle);
      let ammoState = mech.getMechState().ammoState;
      let weaponAmmoCount = weaponState.getAvailableAmmo();
      MechViewMechPanel.setWeaponAmmo(mech.getMechId(), Number(weaponIndex), weaponAmmoCount);
    }
  }

  var updatePaperDoll = function(mech : Mech) : void {
    let mechId = mech.getMechId();
    let mechHealth = mech.getMechState().mechHealth;
    for (let mechComponentHealth of mechHealth.componentHealth) {
      let location = mechComponentHealth.location;
      let armorPercent = Number(mechComponentHealth.armor) / Number(mechComponentHealth.maxArmor);
      let structurePercent = Number(mechComponentHealth.structure) / Number(mechComponentHealth.maxStructure);
      MechViewMechPanel.setPaperDollArmor(mechId, location, armorPercent);
      MechViewMechPanel.setPaperDollStructure(mechId, location, structurePercent);
    }
  }

  var updateMechHealthNumbers = function (mech : Mech) : void {
    let mechHealth = mech.getMechState().mechHealth;
    for (let mechComponentHealth of mechHealth.componentHealth) {
      MechViewMechPanel.updateMechHealthNumbers(mech.getMechId(),
                            {
                              location: mechComponentHealth.location,
                              armor: mechComponentHealth.armor,
                              structure: mechComponentHealth.structure,
                              maxArmor: mechComponentHealth.maxArmor,
                              maxStructure: mechComponentHealth.maxStructure
                            });
    }
  }

  var updateMechStatus = function (mech : Mech) : void {
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
    let dps = simTime > 0 ? Number(mechStats.totalDamage) / simTime * 1000: 0;
    let burst = mechStats.getBurstDamage(simTime);

    MechViewMechPanel.updateMechStatusPanel(mech.getMechId(), isAlive,
                          currTotalHealth, currMaxHealth, targetMechName,
                          dps, burst, totalDmg);
  }

  var updateMechTitle = function (mech : Mech) : void {
    let mechName = mech.getTranslatedName();
    let mechInfo = mech.getMechState().mechInfo;
    MechViewMechPanel.updateMechTitlePanel(mech.getMechId(), mechName,
            mechInfo.smurfyMechId, mechInfo.smurfyLoadoutId);
  }

  export var updateHealth = function(mech : Mech) : void {
    updatePaperDoll(mech);
    updateMechHealthNumbers(mech);
    updateMechStatus(mech);
  }

  export var updateSimTime = function(simTime : number) : void {
    MechView.updateSimTime(simTime);
  }

  export var updateMech = function(mech : Mech) : void {
    let mechState = mech.getMechState();
    let updateFunctionMap : {[index:string] : (mech : Mech) => void}= {};
    updateFunctionMap[MechModel.UpdateType.FULL] = updateAll;
    updateFunctionMap[MechModel.UpdateType.HEALTH] = updateHealth;
    updateFunctionMap[MechModel.UpdateType.HEAT] = updateHeat;
    updateFunctionMap[MechModel.UpdateType.COOLDOWN] = updateCooldown;
    updateFunctionMap[MechModel.UpdateType.WEAPONSTATE] = updateWeaponStatus;
    updateFunctionMap[MechModel.UpdateType.STATS] = updateStats;

    for (let updateType in mechState.updateTypes) {
      if (mechState.updateTypes[updateType]) {
        updateFunctionMap[updateType](mech);
      }
    }
    mechState.updateTypes = {};
  }

  var updateStats = function(mech : Mech) : void {
    updateMechStatus(mech);
  }

  var updateAll = function(mech : Mech) : void {
    updateMechTitle(mech);
    updateHealth(mech);
    updateHeat(mech);
    updateCooldown(mech);
    updateWeaponStatus(mech);
    updateStats(mech);
  }

  class MechHealthToView {
    mechId : string;
    currHealth : number;
    maxHealth : number;
    isAlive : boolean;

    constructor(mechId : string,
                currHealth : number,
                maxHealth : number,
                isAlive : boolean) {
      this.mechId = mechId;
      this.currHealth = currHealth;
      this.maxHealth = maxHealth;
      this.isAlive = isAlive;
    }
  }
  export var updateTeamStats = function(team : Team) : void {
    let mechHealthList = [];
    let totalTeamDamage = 0;
    let totalTeamBurstDamage = 0;
    for (let mech of MechModel.mechTeams[team]) {
      let mechStats = mech.getMechState().mechStats;
      totalTeamDamage += Number(mechStats.totalDamage);
      let burstDamage = mechStats.getBurstDamage(MechSimulatorLogic.getSimTime());
      totalTeamBurstDamage += Number(burstDamage);
      let mechHealth = mech.getMechState().mechHealth;
      let mechHealthToView =
            new MechHealthToView(mech.getMechId(),
                                mechHealth.totalCurrHealth(),
                                mechHealth.totalMaxHealth(),
                                mech.getMechState().isAlive());
      mechHealthList.push(mechHealthToView);
    }
    let dps = MechSimulatorLogic.getSimTime() > 0 ?
                Number(totalTeamDamage)/MechSimulatorLogic.getSimTime() * 1000 : 0;
    MechViewTeamStats.updateTeamStats(team, mechHealthList,
            Number(totalTeamDamage), dps, totalTeamBurstDamage);
  }

  export var updateDebugText = function (text : string) : void {
    MechView.setDebugText(text);
  }

  export var getSimulatorParameters = function() : SimulatorParameters {
    return MechSimulatorLogic.getSimulatorParameters();
  }

  export var setSimulatorParameters =
      function(simulatorParameters : SimulatorParameters) : void {
    MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
  }

  export var setTeamFirePattern = function(team : Team, firePattern : FirePattern) : void {
    let mechList = MechModel.mechTeams[team];
    for (let mech of mechList) {
      mech.firePattern = firePattern;
    }
  }

  export var setTeamComponentTargetPattern =
      function(team : Team,
              componentTargetPattern : TargetComponentPattern)
              : void {
    let mechList = MechModel.mechTeams[team];
    for (let mech of mechList) {
      mech.componentTargetPattern = componentTargetPattern;
    }
  }

  export var setTeamAccuracyPattern =
      function(team : Team,
              accuracyPattern : AccuracyPattern)
              : void {
    let mechList = MechModel.mechTeams[team];
    for (let mech of mechList) {
      mech.accuracyPattern = accuracyPattern;
    }
  }

  export var setTeamMechTargetPattern =
      function(team : Team,
              mechTargetPattern : TargetMechPattern)
              : void {
    let mechList = MechModel.mechTeams[team];
    for (let mech of mechList) {
      mech.mechTargetPattern = mechTargetPattern;
    }
  }

  class TeamReport {
    team : Team;
    weaponStats : Map<string, WeaponStat>; //TODO Tighten type
    mechReports : MechReport[];
    constructor(team : Team) {
      this.team = team;
      this.weaponStats = new Map();
      this.mechReports = [];
      let mechTeam = MechModel.mechTeams[team];
      for (let mech of mechTeam) {
        let mechStats = mech.getMechState().mechStats;
        let mechReport = new MechReport(mech.getMechId(),
                                          mech.getTranslatedName(),
                                          mechStats);
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
            weaponStat = new WeaponStat(mechWeaponStat.name,
                              mechWeaponStat.count,
                              mechWeaponStat.damage,
                              mechWeaponStat.dps);
            this.weaponStats.set(weaponId, weaponStat);
          } else {
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
    getWeaponStats() : WeaponStat[] {
      let ret = [];
      for (let stats of this.weaponStats.values()) {
        ret.push(stats);
      }
      return ret;
    }
    getTotalDamage() : number {
      let totalDamage = 0;
      for (let mechReport of this.mechReports) {
        totalDamage += mechReport.getTotalDamage();
      }
      return totalDamage;
    }
    getDPS() : number {
      let simTime = MechSimulatorLogic.getSimTime();
      return simTime > 0 ? this.getTotalDamage() / simTime * 1000 : 0;
    }
    getMaxBurst() : number {
      let teamStats = MechModel.getTeamStats(this.team);
      return teamStats ? teamStats.maxBurstDamage : 0;
    }
  }

  class MechReport {
    mechId : string;
    mechName : string;
    private mechStats : MechStats;
    weaponReport : WeaponReport;

    constructor(mechId : string, mechName : string, mechStats : MechStats) {
      this.mechId = mechId;
      this.mechName = mechName;
      this.mechStats = mechStats; //DO NOT ACCESS DIRECTLY IN VIEW. Use the methods instead
      this.weaponReport = new WeaponReport(mechStats.weaponFires);
    }
    getMaxBurstDamage() : number {
      return this.weaponReport.getMaxBurstDamage();
    }
    getTotalDamage() : number {
      return this.mechStats.totalDamage;
    }
    getTimeOfDeath() : number {
      return this.mechStats.timeOfDeath;
    }
    getDPS() : number {
      let endTime = this.mechStats.timeOfDeath ?
                        this.mechStats.timeOfDeath
                        : MechSimulatorLogic.getSimTime();
      return endTime > 0 ?
                this.getTotalDamage() / endTime * 1000
                : 0;
    }
  }

  class WeaponReport {
    private weaponFires : WeaponFire[];
    maxBurstDamage : number;
    weaponStats : Map<string, WeaponStat>;

    constructor(weaponFires : WeaponFire[]) {
      this.weaponFires = weaponFires; //DO NOT ACCESS THIS DIRECTLY IN VIEW. Use the methods instead
      this.maxBurstDamage = null; //will be filled in by computeWeaponStats
      this.weaponStats = new Map(); //weaponId -> {translatedName, count, damage, dps}
      this.computeWeaponStats();
    }
    computeWeaponStats() : void {
      let burstDamageStartIdx : number = null;
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
          weaponStat = new WeaponStat(
                            weaponInfo.translatedName,
                            1,
                            weaponFire.damageDone.totalDamage(),
                            weaponFire.damageDone.totalDamage() / endTime * 1000);
          this.weaponStats.set(weaponInfo.weaponId, weaponStat);
        } else {
          //Add to weapon damage, count and recompute DPS
          weaponStat.count ++;
          weaponStat.damage += weaponFire.damageDone.totalDamage();
          let currDPS = weaponFire.damageDone.totalDamage() / endTime * 1000;
          weaponStat.dps = ((weaponStat.dps * (weaponStat.count - 1)) + currDPS) / weaponStat.count;
        }

        //Compute burst damage
        if (!burstDamageStartIdx) {
          this.maxBurstDamage = weaponFire.damageDone.totalDamage();
          burstDamageStartIdx = Number(idx);
        } else {
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

    getMaxBurstDamage() : number {
      return this.maxBurstDamage;
    }
    //returns [{name: <weaponName>, damage: <weaponDamage>, dps: <weaponDPS>}]
    getWeaponStats() : WeaponStat[] {
      let ret : WeaponStat[] = [];
      for (let stats of this.weaponStats.values()) {
        ret.push(stats);
      }
      return ret;
    }
  }

  class WeaponStat {
    name : string;
    count : number;
    damage : number;
    dps : number;
    constructor(name : string, count : number, damage : number, dps : number) {
      this.name = name;
      this.count = count;
      this.damage = damage;
      this.dps = dps;
    }
  }

  export var getTeamReport = function(team : Team) : TeamReport {
    return new TeamReport(team);
  }

  export var updateVictory = function (team : Team) : void {
    MechViewReport.showVictoryReport();
    // MechModelView.updateDebugText("Team Victory: " + team);
  }

  export var getVictorTeam = function () {
    if (!MechModel.isTeamAlive(MechModel.Team.BLUE) &&
        MechModel.isTeamAlive(MechModel.Team.RED)) {
      return MechModel.Team.RED;
    }
    if (!MechModel.isTeamAlive(MechModel.Team.RED) &&
        MechModel.isTeamAlive(MechModel.Team.BLUE)) {
      return MechModel.Team.BLUE;
    }
    return null;
  }

  export var getMechName = function(mechId : string, team : Team) {
    let mech = MechModel.getMechFromId(mechId);
    if (mech) {
      return mech.getTranslatedName();
    } else {
      return null;
    }
  }
}