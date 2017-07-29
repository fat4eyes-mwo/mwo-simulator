"use strict";
/// <reference path="simulator-view-widgets.ts" />
/// <reference path="simulator-model.ts" />
//UI methods
//TODO: Remove direct references to MechModel
var MechView;
(function (MechView) {
    MechView.clearMechList = function (team) {
        let teamMechPanelId = team + "Team";
        $("#" + teamMechPanelId).empty();
    };
    MechView.clearMechStats = function (team) {
        MechViewTeamStats.clearTeamStats(team);
    };
    MechView.clear = function (team) {
        MechView.clearMechList(team);
        MechView.clearMechStats(team);
    };
    MechView.clearAll = function () {
        MechView.clear("blue");
        MechView.clear("red");
    };
    MechView.updateSimTime = function (simTime) {
        $("#simTime").html(simTime + "ms");
    };
    MechView.setDebugText = function (debugText) {
        $("#debugText").html(debugText);
    };
    MechView.initView = function () {
        $("#nojavascript").remove();
        initControlPanel();
        MechViewTeamStats.initPatternTypes();
        MechViewSimSettings.initRangeInput();
        initSpeedControl();
        initStateControl();
        initMiscControl();
    };
    var initControlPanel = function () {
        let controlPanelDiv = MechViewWidgets.cloneTemplate("controlPanel-template");
        $(controlPanelDiv)
            .appendTo("#controlPanelContainer");
    };
    var setSimulatorSpeedfactor = function (speedFactor) {
        let simulatorParams = MechSimulatorLogic.getSimulatorParameters();
        simulatorParams.setSpeedFactor(speedFactor);
        MechSimulatorLogic.setSimulatorParameters(simulatorParams);
        $("#simSpeed").html(speedFactor + "x");
    };
    var initSpeedControl = function () {
        $("#startSimulationDivButton").click(() => {
            if (MechModelView.getVictorTeam()) {
                //if a team already won, reset the sim
                MechView.resetSimulation();
            }
            MechSimulatorLogic.runSimulation();
        });
        $("#pauseSimulationDivButton").click(() => {
            MechSimulatorLogic.pauseSimulation();
        });
        $("#stepSimulationDivButton").click(() => {
            MechSimulatorLogic.stepSimulation();
        });
        $("#speed1xbutton").click(() => {
            setSimulatorSpeedfactor(1);
        });
        $("#speed2xbutton").click(() => {
            setSimulatorSpeedfactor(2);
        });
        $("#speed4xbutton").click(() => {
            setSimulatorSpeedfactor(4);
        });
        $("#speed8xbutton").click(() => {
            setSimulatorSpeedfactor(8);
        });
    };
    MechView.resetSimulation = function () {
        MechModel.resetState();
        MechSimulatorLogic.resetSimulation();
        MechModelView.refreshView([]);
    };
    var initStateControl = function () {
        $("#resetSimulationDivButton").click(() => {
            MechView.resetSimulation();
        });
        $("#showReportDivButton").click(() => {
            MechSimulatorLogic.pauseSimulation();
            MechViewReport.showVictoryReport();
        });
    };
    var permalinkTooltip;
    var modifiedTooltip;
    var loadErrorTooltip;
    var initMiscControl = function () {
        $("#permalinkButton").click(() => {
            let saveAppStatePromise = MechViewRouter.saveAppState();
            saveAppStatePromise
                .then(function (data) {
                showPermalinkTooltip(location.href);
                console.log("Success on save app state. Data: " + data);
                return data;
            })
                .catch(function (data) {
                console.error("Fail on save app state." + Error(data));
                return Error(data);
            })
                .then(function (data) {
                console.log("Done save app state. Data: " + data);
            });
        });
        modifiedTooltip = new MechViewWidgets.Tooltip("modifiedTooltip-template", "modifiedTooltip", "permalinkButton");
        permalinkTooltip = new MechViewWidgets.Tooltip("permalinkGeneratedTooltip-template", "permalinkGeneratedTooltip", "permalinkButton");
        loadErrorTooltip = new MechViewWidgets.Tooltip("loadErrorTooltip-template", "loadErrorTooltip", "miscControl");
        $("#settingsButton").click(() => {
            MechViewSimSettings.showSettingsDialog();
        });
    };
    var showModifiedToolip = function () {
        permalinkTooltip.hideTooltip();
        loadErrorTooltip.hideTooltip();
        modifiedTooltip.showTooltip();
    };
    var showPermalinkTooltip = function (link) {
        modifiedTooltip.hideTooltip();
        loadErrorTooltip.hideTooltip();
        $("#" + permalinkTooltip.id + " [class~=permaLink]")
            .attr("href", link);
        permalinkTooltip.showTooltip();
    };
    var showLoadErrorTooltip = function () {
        modifiedTooltip.hideTooltip();
        permalinkTooltip.hideTooltip();
        loadErrorTooltip.showTooltip();
    };
    //TODO: You now have multiple entities acting on the same event. Think about
    //setting up an event scheduler/listeners
    MechView.updateOnModifyAppState = function () {
        showModifiedToolip();
    };
    MechView.updateOnAppSaveState = function () {
        //make the view consistent with the current state
    };
    MechView.updateOnLoadAppState = function () {
        permalinkTooltip.hideTooltip();
        modifiedTooltip.hideTooltip();
        loadErrorTooltip.hideTooltip();
        doAutoRun();
    };
    MechView.updateOnLoadAppError = function () {
        permalinkTooltip.hideTooltip();
        modifiedTooltip.hideTooltip();
        loadErrorTooltip.showTooltip();
    };
    //called when the app is completely loaded
    MechView.updateOnAppLoaded = function () {
        doAutoRun();
    };
    var doAutoRun = function () {
        //set sim speed and run sim if run and speed url params are set
        let runParam = MechViewRouter.getRunFromLocation() === "true";
        let speedParam = Number(MechViewRouter.getSpeedFromLocation());
        if (speedParam) {
            setSimulatorSpeedfactor(speedParam);
        }
        if (runParam) {
            MechModel.resetState();
            MechSimulatorLogic.resetSimulation();
            MechSimulatorLogic.runSimulation();
        }
    };
    const LOADING_SCREEN_MECH_ID = "fakeLoadingScreenMechId";
    var loadingScreenAnimateInterval;
    const LOADING_SCREEN_ANIMATE_INTERVAL = 200; //ms
    MechView.showLoadingScreen = function () {
        let loadingScreenDiv = MechViewWidgets.cloneTemplate("loadingScreen-template");
        $(loadingScreenDiv)
            .attr("id", "loadingScreenContainer");
        MechViewWidgets.setModal(loadingScreenDiv);
        MechViewMechPanel.addPaperDoll(LOADING_SCREEN_MECH_ID, "loadingScreenPaperDollContainer");
        for (let componentIdx in MechModel.Component) {
            if (MechModel.Component.hasOwnProperty(componentIdx)) {
                let component = MechModel.Component[componentIdx];
                MechViewMechPanel.setPaperDollArmor(LOADING_SCREEN_MECH_ID, component, 1);
                MechViewMechPanel.setPaperDollStructure(LOADING_SCREEN_MECH_ID, component, 1);
            }
        }
        if (loadingScreenAnimateInterval) {
            window.clearInterval(loadingScreenAnimateInterval);
        }
        loadingScreenAnimateInterval = window.setInterval(function () {
            for (let componentIdx in MechModel.Component) {
                if (MechModel.Component.hasOwnProperty(componentIdx)) {
                    let component = MechModel.Component[componentIdx];
                    MechViewMechPanel.setPaperDollArmor(LOADING_SCREEN_MECH_ID, component, Math.random());
                    MechViewMechPanel.setPaperDollStructure(LOADING_SCREEN_MECH_ID, component, Math.random());
                }
            }
        }, LOADING_SCREEN_ANIMATE_INTERVAL);
        MechView.updateLoadingScreenProgress(0);
        MechViewWidgets.showModal();
    };
    MechView.hideLoadingScreen = function () {
        MechViewWidgets.hideModal();
        window.clearInterval(loadingScreenAnimateInterval);
    };
    MechView.updateLoadingScreenProgress = function (percent) {
        let progressBar = document.getElementById("loadingScreenProgress");
        let textPercent = Math.floor(Number(percent) * 100) + "%";
        progressBar.style.width = textPercent;
    };
    MechView.updateTitle = function (title) {
        document.title = title;
    };
})(MechView || (MechView = {}));
//# sourceMappingURL=simulator-view.js.map