
"use strict";

var MechViewReport = MechViewReport || (function() {

  class VictoryReport {
    constructor(containerId) {
      let victoryReportDiv =
          MechViewWidgets.cloneTemplate("victoryReport-template");
      $(victoryReportDiv)
        .attr("id", "victoryReport")
        .appendTo("#" + containerId);

      $("#victoryReport [class~=closeReportButton]")
        .click(() => {
          MechViewReport.hideVictoryReport();
        });

      let victorTeam = MechModelView.getVictorTeam();
      if (victorTeam) {
        $("#victoryReport [class~=victorTitle]")
          .addClass(victorTeam)
          .html(TeamReport.prototype.translateTeamName(victorTeam) + " Victory");
      } else {
        $("#victoryReport [class~=victorTitle]").html("Draw");
      }

      let simParams = MechModelView.getSimulatorParameters();
      $("#victoryReport [class~=rangeValue]")
        .html(Number(simParams.range).toFixed(0) + "m");

      let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
      for (let team of teamList) {
        $("#victoryReport [class~="+ this.teamReportPanelId(team) + "]")
          .attr("id", this.teamReportPanelId(team));
        let teamReport = new TeamReport(team, this.teamReportPanelId(team));
      }
    }

    teamReportPanelId(team) {
      return team + "ReportContainer";
    }
  }

  class TeamReport {
    constructor(team, containerId) {
      let teamReport = MechModelView.getTeamReport(team);
      let teamReportDiv = MechViewWidgets.cloneTemplate("teamReport-template");
      $(teamReportDiv)
        .attr("id", this.teamReportId(team))
        .addClass(team)
        .appendTo("#" + containerId);

      let teamReportId = this.teamReportId(team);
      $("#" + teamReportId + " [class~=teamName]")
        .html(this.translateTeamName(team) + " team");

      let totalDamage = teamReport.getTotalDamage();
      let dps = teamReport.getDPS();
      let maxBurst = teamReport.getMaxBurst();
      $("#" + teamReportId + " [class~=damage]")
        .html(Number(totalDamage).toFixed(1));
      $("#" + teamReportId + " [class~=dps]")
        .html(Number(dps).toFixed(1))
      $("#" + teamReportId + " [class~=maxBurst]")
        .html(Number(maxBurst).toFixed(1));
      let mechBreakdownDivId = this.mechBreakdownId(team);
      $("#" + teamReportId + " [class~=mechBreakdownContainer]")
        .attr("id", mechBreakdownDivId);
      let mechBreakdown = new MechBreakdownTable(teamReport, mechBreakdownDivId);
      let weaponBreakdownDivId = this.weaponBreakdownId(team);
      $("#" + teamReportId + " [class~=weaponBreakdownContainer]")
        .attr("id", weaponBreakdownDivId);
      let weaponBreakdown = new WeaponBreakdownTable(teamReport, weaponBreakdownDivId);
    }

    teamReportId(team) {
      return team + "-teamReport";
    }

    mechBreakdownId(team) {
      return team + "-mechBreakdown";
    }

    weaponBreakdownId(team) {
      return team + "-weaponBreakdown";
    }

    translateTeamName(team) {
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
    constructor(teamReport, containerId) {
      //header
      let mechBreakdownHeaderDiv =
          MechViewWidgets.cloneTemplate("mechBreakdownHeader-template");
      $(mechBreakdownHeaderDiv)
        .removeAttr("id")
        .appendTo("#" + containerId);
      for (let mechReport of teamReport.mechReports) {
        let mechBreakdownRowDiv =
            MechViewWidgets.cloneTemplate("mechBreakdownRow-template");
        let rowJQ = $(mechBreakdownRowDiv)
                      .removeAttr("id")
                      .appendTo("#" + containerId);
        rowJQ.find("[class~=name]")
          .html(mechReport.mechName);
        rowJQ.find("[class~=damage]")
          .html(Number(mechReport.getTotalDamage()).toFixed(1));
        rowJQ.find("[class~=dps]")
          .html(Number(mechReport.getDPS()).toFixed(1));
        rowJQ.find("[class~=burst]")
          .html(Number(mechReport.getMaxBurstDamage()).toFixed(1));
        let timeAlive = mechReport.getTimeOfDeath();
        timeAlive = timeAlive ? timeAlive : MechSimulatorLogic.getSimTime();
        rowJQ.find("[class~=timeAlive]")
          .html(Number(timeAlive / 1000).toFixed(1) + "s");
      }
    }
  }

  class WeaponBreakdownTable {
    constructor(teamReport, containerId) {
      let weaponBreakdownHeaderDiv =
          MechViewWidgets.cloneTemplate("weaponBreakdownHeader-template");
      $(weaponBreakdownHeaderDiv)
        .removeAttr("id")
        .appendTo("#" + containerId);
      let teamWeaponStats = teamReport.getWeaponStats();
      for (let weaponStatEntry of teamWeaponStats) {
        let weaponBreakdownRowDiv =
            MechViewWidgets.cloneTemplate("weaponBreakdownRow-template");
        let rowJQ = $(weaponBreakdownRowDiv)
                      .removeAttr("id")
                      .appendTo("#" + containerId);
        rowJQ.find("[class~=name]").html(weaponStatEntry.name);
        rowJQ.find("[class~=damage]").html(Number(weaponStatEntry.damage).toFixed(1));
        //TODO: Fix DPS per weapon calculation
        // rowJQ.find("[class~=dps]").html(Number(weaponStatEntry.dps).toFixed(1));
        rowJQ.find("[class~=count]").html(Number(weaponStatEntry.count).toFixed(0));
      }
    }
  }

  var showVictoryReport = function() {
    $("#" + MechView.MODAL_DIALOG_ID)
      .addClass("wide")
      .empty();

    let teamReport = new MechViewReport.VictoryReport(MechView.MODAL_DIALOG_ID);

    $("#" + MechView.MODAL_SCREEN_ID).css("display", "block");
  }

  var hideVictoryReport = function() {
    $("#" + MechView.MODAL_SCREEN_ID).css("display", "none");
    $("#" + MechView.MODAL_DIALOG_ID).removeClass("wide").empty();
  }

  return {
    VictoryReport : VictoryReport,
    TeamReport : TeamReport,
    showVictoryReport : showVictoryReport,
    hideVictoryReport: hideVictoryReport,
  };
})();
