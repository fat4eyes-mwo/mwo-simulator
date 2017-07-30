/// <reference path="simulator-view-widgets.ts" />
/// <reference path="simulator-model.ts" />

"use strict";

namespace MechViewReport {
  type Team = MechModel.Team;

  export class VictoryReport {
    domElement : Element;

    constructor() {
      let victoryReportDiv =
          MechViewWidgets.cloneTemplate("victoryReport-template");
      let reportJQ =$(victoryReportDiv).attr("id", "victoryReport");
      this.domElement = victoryReportDiv;

      reportJQ.find("[class~=closeReportButton]")
        .click(() => {
          MechViewReport.hideVictoryReport();
        });

      let victorTeam = MechModelView.getVictorTeam();
      if (victorTeam) {
        reportJQ.find("[class~=victorTitle]")
          .addClass(victorTeam)
          .text(`${TeamReport.prototype.translateTeamName(victorTeam)} Victory`);
      } else {
        reportJQ.find("[class~=victorTitle]").text("Draw");
      }

      let simParams = MechModelView.getSimulatorParameters();
      reportJQ.find("[class~=rangeValue]")
        .text(`${Number(simParams.range).toFixed(0)}m`);

      let teamList : Team[] = [MechModel.Team.BLUE, MechModel.Team.RED];
      for (let team of teamList) {
        let teamReport = new TeamReport(team);
        reportJQ.find(`[class~=${this.teamReportPanelId(team)}]`)
          .attr("id", this.teamReportPanelId(team))
          .append(teamReport.domElement);
      }
    }

    teamReportPanelId(team : Team) : string {
      return team + "ReportContainer";
    }
  }

  export class TeamReport {
    domElement : Element;

    constructor(team : Team) {
      let teamReport = MechModelView.getTeamReport(team);
      let teamReportDiv = MechViewWidgets.cloneTemplate("teamReport-template");
      let teamReportJQ = $(teamReportDiv)
                            .attr("id", this.teamReportId(team))
                            .addClass(team);
      this.domElement = teamReportDiv;

      let teamReportId = this.teamReportId(team);
      teamReportJQ.find("[class~=teamName]")
        .text(this.translateTeamName(team) + " team");

      let totalDamage = teamReport.getTotalDamage();
      let dps = teamReport.getDPS();
      let maxBurst = teamReport.getMaxBurst();
      teamReportJQ.find("[class~=damage]")
        .text(Number(totalDamage).toFixed(1));
      teamReportJQ.find("[class~=dps]")
        .text(Number(dps).toFixed(1))
      teamReportJQ.find("[class~=maxBurst]")
        .text(Number(maxBurst).toFixed(1));

      let mechBreakdown = new MechBreakdownTable(teamReport);
      let mechBreakdownDivId = this.mechBreakdownId(team);
      teamReportJQ.find("[class~=mechBreakdownContainer]")
              .attr("id", mechBreakdownDivId)
              .append(mechBreakdown.domElement);

      let weaponBreakdown = new WeaponBreakdownTable(teamReport);
      let weaponBreakdownDivId = this.weaponBreakdownId(team);
      let weaponBreakdownJQ = teamReportJQ.find("[class~=weaponBreakdownContainer]")
        .attr("id", weaponBreakdownDivId)
        .append(weaponBreakdown.domElement);
    }

    teamReportId(team : Team) : string {
      return team + "-teamReport";
    }

    mechBreakdownId(team : Team) : string {
      return team + "-mechBreakdown";
    }

    weaponBreakdownId(team : Team) : string {
      return team + "-weaponBreakdown";
    }

    translateTeamName(team : Team) : string {
      if (team === "blue") {
        return "Blue";
      } else if (team === "red") {
        return "Red";
      } else {
        throw "Unexpected team: " + team;
      }
    }
  }

  class MechBreakdownTable {
    domElement : Element;

    constructor(teamReport : MechModelView.TeamReport) {
      let tableDiv = MechViewWidgets.cloneTemplate("mechBreakdownTable-template");
      this.domElement = tableDiv;
      //header
      let mechBreakdownHeaderDiv =
          MechViewWidgets.cloneTemplate("mechBreakdownHeader-template");
      $(mechBreakdownHeaderDiv)
        .removeAttr("id")
        .appendTo(tableDiv);
      for (let mechReport of teamReport.mechReports) {
        let mechBreakdownRowDiv =
            MechViewWidgets.cloneTemplate("mechBreakdownRow-template");
        let rowJQ = $(mechBreakdownRowDiv)
                      .removeAttr("id")
                      .appendTo(tableDiv);
        rowJQ.find("[class~=name]")
          .text(mechReport.mechName);
        rowJQ.find("[class~=damage]")
          .text(Number(mechReport.getTotalDamage()).toFixed(1));
        rowJQ.find("[class~=dps]")
          .text(Number(mechReport.getDPS()).toFixed(1));
        rowJQ.find("[class~=burst]")
          .text(Number(mechReport.getMaxBurstDamage()).toFixed(1));
        let timeAlive = mechReport.getTimeOfDeath();
        timeAlive = timeAlive ? timeAlive : MechSimulatorLogic.getSimTime();
        rowJQ.find("[class~=timeAlive]")
          .text(`${Number(timeAlive / 1000).toFixed(1)}s`);
      }
    }
  }

  class WeaponBreakdownTable {
    domElement : Element;

    constructor(teamReport : MechModelView.TeamReport) {
      let tableDiv = MechViewWidgets.cloneTemplate("weaponBreakdownTable-template");
      this.domElement = tableDiv;
      let weaponBreakdownHeaderDiv =
          MechViewWidgets.cloneTemplate("weaponBreakdownHeader-template");
      $(weaponBreakdownHeaderDiv)
        .removeAttr("id")
        .appendTo(tableDiv);
      let teamWeaponStats = teamReport.getWeaponStats();
      for (let weaponStatEntry of teamWeaponStats) {
        let weaponBreakdownRowDiv =
            MechViewWidgets.cloneTemplate("weaponBreakdownRow-template");
        let rowJQ = $(weaponBreakdownRowDiv)
                      .removeAttr("id")
                      .appendTo(tableDiv);
        rowJQ.find("[class~=name]").text(weaponStatEntry.name);
        rowJQ.find("[class~=damage]").text(Number(weaponStatEntry.damage).toFixed(1));
        //TODO: Fix DPS per weapon calculation
        // rowJQ.find("[class~=dps]").text(Number(weaponStatEntry.dps).toFixed(1));
        rowJQ.find("[class~=count]").text(Number(weaponStatEntry.count).toFixed(0));
      }
    }
  }

  export var showVictoryReport = function() {
    let teamReport = new MechViewReport.VictoryReport();
    MechViewWidgets.setModal(teamReport.domElement, "wide");
    MechViewWidgets.showModal();
  }

  export var hideVictoryReport = function() {
    MechViewWidgets.hideModal("wide");
  }
}
