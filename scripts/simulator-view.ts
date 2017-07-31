/// <reference path="common/simulator-model-common.ts" />
/// <reference path="simulator-view-widgets.ts" />
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-view-simsettings.ts" />
"use strict";

//UI methods
//TODO: Remove direct references to MechModel
namespace MechView {
  import Component = MechModelCommon.Component;

  type Team = MechModelCommon.Team;
  type Tooltip = MechViewWidgets.Tooltip;

  export var clearMechList = function(team : Team) : void {
    let teamMechPanelId = team + "Team";
    $("#" + teamMechPanelId).empty();
  }

  export var clearMechStats = function(team : Team) : void {
    MechViewTeamStats.clearTeamStats(team);
  }

  export var clear = function (team : Team) : void {
    clearMechList(team);
    clearMechStats(team);
  }

  export var clearAll = function () : void{
    clear("blue");
    clear("red");
  }

  export var updateSimTime = function(simTime : number) : void{
    $("#simTime").html(simTime + "ms");
  }

  export var setDebugText = function(debugText : string) : void {
    $("#debugText").html(debugText);
  }

  export var initView = function() : void {
    $("#nojavascript").remove();
    initControlPanel();
    MechViewTeamStats.initPatternTypes();
    MechViewSimSettings.initRangeInput();
    initSpeedControl();
    initStateControl();
    initMiscControl();
  }

  var initControlPanel = function() : void {
    let controlPanelDiv = MechViewWidgets.cloneTemplate("controlPanel-template");
    $(controlPanelDiv)
      .appendTo("#controlPanelContainer");
  }

  var setSimulatorSpeedfactor = function(speedFactor : number) : void {
    let simulatorParams = MechSimulatorLogic.getSimulatorParameters();
    simulatorParams.setSpeedFactor(speedFactor);
    MechSimulatorLogic.setSimulatorParameters(simulatorParams);
    $("#simSpeed").html(speedFactor + "x");
  }

  var initSpeedControl = function() : void {
    $("#startSimulationDivButton").click(() => {
      if (MechModelView.getVictorTeam()) {
        //if a team already won, reset the sim
        resetSimulation();
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
  }

  export var resetSimulation = function() : void {
    MechModel.resetState();
    MechSimulatorLogic.resetSimulation();
    MechModelView.refreshView([]);
  }

  var initStateControl = function() : void {
    $("#resetSimulationDivButton").click(() => {
      resetSimulation();
    });

    $("#showReportDivButton").click(() => {
      MechSimulatorLogic.pauseSimulation();
      MechViewReport.showVictoryReport();
    });
  }

  var permalinkTooltip : Tooltip;
  var modifiedTooltip : Tooltip;
  var loadErrorTooltip : Tooltip;
  var initMiscControl = function() : void {
    $("#permalinkButton").click(() => {
      let saveAppStatePromise = MechViewRouter.saveAppState();
      saveAppStatePromise
        .then(function(data : any) {
          showPermalinkTooltip(location.href);
          console.log("Success on save app state. Data: " + data);
          return data;
        })
        .catch(function(data : any) {
          console.error("Fail on save app state." + Error(data));
          return Error(data);
        })
        .then(function(data : any) {
          console.log("Done save app state. Data: " + data);
        });
    });
    modifiedTooltip = new MechViewWidgets.Tooltip(
                                "modifiedTooltip-template",
                                "modifiedTooltip",
                                "permalinkButton");
    permalinkTooltip = new MechViewWidgets.Tooltip(
                                "permalinkGeneratedTooltip-template",
                                "permalinkGeneratedTooltip",
                                "permalinkButton");
    loadErrorTooltip = new MechViewWidgets.Tooltip(
                                "loadErrorTooltip-template",
                                "loadErrorTooltip",
                                "miscControl");
    $("#settingsButton").click(() => {
      MechViewSimSettings.showSettingsDialog();
    });
  }

  var showModifiedToolip = function() : void {
    permalinkTooltip.hideTooltip();
    loadErrorTooltip.hideTooltip();
    modifiedTooltip.showTooltip();
  }

  var showPermalinkTooltip = function(link : string) : void {
    modifiedTooltip.hideTooltip();
    loadErrorTooltip.hideTooltip();
    $(`#${permalinkTooltip.id} [class~=permaLink]`)
      .attr("href", link);
    permalinkTooltip.showTooltip();
  }

  var showLoadErrorTooltip = function() : void {
    modifiedTooltip.hideTooltip();
    permalinkTooltip.hideTooltip();
    loadErrorTooltip.showTooltip();
  }

  //TODO: You now have multiple entities acting on the same event. Think about
  //setting up an event scheduler/listeners
  export var updateOnModifyAppState = function() : void {
    showModifiedToolip();
  }

  export var updateOnAppSaveState = function() : void {
    //make the view consistent with the current state
  }

  export var updateOnLoadAppState = function() : void {
    permalinkTooltip.hideTooltip();
    modifiedTooltip.hideTooltip();
    loadErrorTooltip.hideTooltip();
    doAutoRun();
  }

  export var updateOnLoadAppError = function() : void {
    permalinkTooltip.hideTooltip();
    modifiedTooltip.hideTooltip();
    loadErrorTooltip.showTooltip();
  }

  //called when the app is completely loaded
  export var updateOnAppLoaded = function() : void {
    doAutoRun();
  }

  var doAutoRun = function() : void {
    //set sim speed and run sim if run and speed url params are set
    let runParam : boolean = MechViewRouter.getRunFromLocation() === "true";
    let speedParam : number = Number(MechViewRouter.getSpeedFromLocation());
    if (speedParam) {
      setSimulatorSpeedfactor(speedParam);
    }
    if (runParam) {
      MechModel.resetState();
      MechSimulatorLogic.resetSimulation();
      MechSimulatorLogic.runSimulation();
    }
  }

  const LOADING_SCREEN_MECH_ID = "fakeLoadingScreenMechId";
  var loadingScreenAnimateInterval : number;
  const LOADING_SCREEN_ANIMATE_INTERVAL = 200; //ms
  export var showLoadingScreen = function() : void {
    let loadingScreenDiv =
        MechViewWidgets.cloneTemplate("loadingScreen-template");
    $(loadingScreenDiv)
      .attr("id", "loadingScreenContainer");
    MechViewWidgets.setModal(loadingScreenDiv);

    MechViewMechPanel.addPaperDoll(LOADING_SCREEN_MECH_ID, "loadingScreenPaperDollContainer");
    for (let componentIdx in Component) {
      if (Component.hasOwnProperty(componentIdx)) {
        let component = Component[componentIdx];
        MechViewMechPanel.setPaperDollArmor(LOADING_SCREEN_MECH_ID, component, 1);
        MechViewMechPanel.setPaperDollStructure(LOADING_SCREEN_MECH_ID, component, 1);
      }
    }
    if (loadingScreenAnimateInterval) {
      window.clearInterval(loadingScreenAnimateInterval);
    }
    loadingScreenAnimateInterval = window.setInterval(
      function () {
        for (let componentIdx in Component) {
          if (Component.hasOwnProperty(componentIdx)) {
            let component = Component[componentIdx];
            MechViewMechPanel.setPaperDollArmor(LOADING_SCREEN_MECH_ID, component, Math.random());
            MechViewMechPanel.setPaperDollStructure(LOADING_SCREEN_MECH_ID, component, Math.random());
          }
        }
      }
      , LOADING_SCREEN_ANIMATE_INTERVAL);

    updateLoadingScreenProgress(0);
    MechViewWidgets.showModal();
  }

  export var hideLoadingScreen = function() : void {
    MechViewWidgets.hideModal();
    window.clearInterval(loadingScreenAnimateInterval);
  }

  export var updateLoadingScreenProgress = function(percent : number) : void {
    let progressBar = document.getElementById("loadingScreenProgress");
    let textPercent = Math.floor(Number(percent) * 100) + "%";
    progressBar.style.width = textPercent;
  }

  export var updateTitle = function(title : string) : void {
    document.title = title;
  }
}
