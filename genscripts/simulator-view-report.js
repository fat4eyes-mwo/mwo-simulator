/// <reference path="simulator-view-widgets.ts" />
/// <reference path="simulator-model.ts" />
"use strict";
var MechViewReport;
(function (MechViewReport) {
    class VictoryReport {
        constructor() {
            let victoryReportDiv = MechViewWidgets.cloneTemplate("victoryReport-template");
            let reportJQ = $(victoryReportDiv).attr("id", "victoryReport");
            this.domElement = victoryReportDiv;
            reportJQ.find("[class~=closeReportButton]")
                .click(() => {
                MechViewReport.hideVictoryReport();
            });
            let victorTeam = MechModelView.getVictorTeam();
            if (victorTeam) {
                reportJQ.find("[class~=victorTitle]")
                    .addClass(victorTeam)
                    .html(TeamReport.prototype.translateTeamName(victorTeam) + " Victory");
            }
            else {
                reportJQ.find("[class~=victorTitle]").html("Draw");
            }
            let simParams = MechModelView.getSimulatorParameters();
            reportJQ.find("[class~=rangeValue]")
                .html(Number(simParams.range).toFixed(0) + "m");
            let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
            for (let team of teamList) {
                let teamReport = new TeamReport(team);
                reportJQ.find("[class~=" + this.teamReportPanelId(team) + "]")
                    .attr("id", this.teamReportPanelId(team))
                    .append(teamReport.domElement);
            }
        }
        teamReportPanelId(team) {
            return team + "ReportContainer";
        }
    }
    MechViewReport.VictoryReport = VictoryReport;
    class TeamReport {
        constructor(team) {
            let teamReport = MechModelView.getTeamReport(team);
            let teamReportDiv = MechViewWidgets.cloneTemplate("teamReport-template");
            let teamReportJQ = $(teamReportDiv)
                .attr("id", this.teamReportId(team))
                .addClass(team);
            this.domElement = teamReportDiv;
            let teamReportId = this.teamReportId(team);
            teamReportJQ.find("[class~=teamName]")
                .html(this.translateTeamName(team) + " team");
            let totalDamage = teamReport.getTotalDamage();
            let dps = teamReport.getDPS();
            let maxBurst = teamReport.getMaxBurst();
            teamReportJQ.find("[class~=damage]")
                .html(Number(totalDamage).toFixed(1));
            teamReportJQ.find("[class~=dps]")
                .html(Number(dps).toFixed(1));
            teamReportJQ.find("[class~=maxBurst]")
                .html(Number(maxBurst).toFixed(1));
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
            }
            else if (team === "red") {
                return "Red";
            }
            else {
                throw "Unexpected team: " + team;
            }
        }
    }
    MechViewReport.TeamReport = TeamReport;
    class MechBreakdownTable {
        constructor(teamReport) {
            let tableDiv = MechViewWidgets.cloneTemplate("mechBreakdownTable-template");
            this.domElement = tableDiv;
            //header
            let mechBreakdownHeaderDiv = MechViewWidgets.cloneTemplate("mechBreakdownHeader-template");
            $(mechBreakdownHeaderDiv)
                .removeAttr("id")
                .appendTo(tableDiv);
            for (let mechReport of teamReport.mechReports) {
                let mechBreakdownRowDiv = MechViewWidgets.cloneTemplate("mechBreakdownRow-template");
                let rowJQ = $(mechBreakdownRowDiv)
                    .removeAttr("id")
                    .appendTo(tableDiv);
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
        constructor(teamReport) {
            let tableDiv = MechViewWidgets.cloneTemplate("weaponBreakdownTable-template");
            this.domElement = tableDiv;
            let weaponBreakdownHeaderDiv = MechViewWidgets.cloneTemplate("weaponBreakdownHeader-template");
            $(weaponBreakdownHeaderDiv)
                .removeAttr("id")
                .appendTo(tableDiv);
            let teamWeaponStats = teamReport.getWeaponStats();
            for (let weaponStatEntry of teamWeaponStats) {
                let weaponBreakdownRowDiv = MechViewWidgets.cloneTemplate("weaponBreakdownRow-template");
                let rowJQ = $(weaponBreakdownRowDiv)
                    .removeAttr("id")
                    .appendTo(tableDiv);
                rowJQ.find("[class~=name]").html(weaponStatEntry.name);
                rowJQ.find("[class~=damage]").html(Number(weaponStatEntry.damage).toFixed(1));
                //TODO: Fix DPS per weapon calculation
                // rowJQ.find("[class~=dps]").html(Number(weaponStatEntry.dps).toFixed(1));
                rowJQ.find("[class~=count]").html(Number(weaponStatEntry.count).toFixed(0));
            }
        }
    }
    MechViewReport.showVictoryReport = function () {
        let teamReport = new MechViewReport.VictoryReport();
        MechViewWidgets.setModal(teamReport.domElement, "wide");
        MechViewWidgets.showModal();
    };
    MechViewReport.hideVictoryReport = function () {
        MechViewWidgets.hideModal("wide");
    };
})(MechViewReport || (MechViewReport = {}));
//# sourceMappingURL=simulator-view-report.js.map