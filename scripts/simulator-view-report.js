
"use strict";

var MechViewReport = MechViewReport || (function() {

  class VictoryReport {
    constructor(containerId) {
      $("#victoryReport-template")
        .clone(true)
        .attr("id", "victoryReport")
        .removeClass("template")
        .appendTo("#" + containerId);

      $("#victoryReport [class~=closeReportButton]")
        .click(() => {
          MechView.hideVictoryReport();
        });

      let simParams = MechModelView.getSimulatorParameters();
      $("#victoryReport [class~=rangeValue]")
        .html(simParams.range);

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
      let teamWeaponStats = teamReport.getWeaponStats();

      $("#teamReport-template")
        .clone(true)
        .attr("id", this.teamReportId(team))
        .removeClass("template")
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
    }

    teamReportId(team) {
      return team + "-teamReport";
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

  return {
    VictoryReport : VictoryReport,
    TeamReport : TeamReport,
  };
})();
