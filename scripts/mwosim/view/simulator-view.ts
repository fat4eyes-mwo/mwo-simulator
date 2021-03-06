"use strict";

//UI methods
namespace MechView {
  import Component = MechModelCommon.Component;
  import MechPanel = MechViewMechPanel.MechPanel;
  import EndMechPanel = MechViewMechPanel.EndMechPanel;
  import EventType = MechModelCommon.EventType;

  type Mech = MechModel.Mech;
  type Team = MechModelCommon.Team;
  type Tooltip = Widgets.Tooltip;

  var teamListPanel = function(team : Team) {
    return  team + "Team";
  }
  export var addMechPanel = function(mech : Mech, team : Team) {
    let mechPanel = new MechPanel(mech, team);
    //TODO: The appends happen inside mechpanel (due to WeaponPanel updates needing document.geElementbyId)
    //Try to find a way around this
  }
  export var getMechPanel = function(mechId : string) {
    return MechPanel.getMechPanel(mechId);
  }
  export var clearMechList = function(team : Team) : void {
    let teamMechPanelId = teamListPanel(team);
    let mechTeamListJQ = $("#" + teamMechPanelId).empty();

    let endMechPanel = new MechViewMechPanel.EndMechPanel(team);
    mechTeamListJQ.append(endMechPanel.domElement);
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

  export var init = function() : void {
    $("#nojavascript").remove();
    initControlPanel();
    MechViewTeamStats.initPatternTypes();
    MechViewSimSettings.initRangeInput();
    initSpeedControl();
    initStateControl();
    initMiscControl();
    MechViewMechPanel.init();
    MechViewAddMech.init();

    MechModelView.init();

    //Event listeners
    let eventQueue = MechModelView.getEventQueue();
    eventQueue.addListener(updateOnModifyAppState, EventType.APP_STATE_CHANGE);
    eventQueue.addListener(updateOnAppSaveState, EventType.APP_STATE_SAVED);
    eventQueue.addListener(updateOnLoadAppState, EventType.APP_STATE_LOADED);
    eventQueue.addListener(updateOnLoadAppError, EventType.APP_STATE_LOAD_ERROR);
  }

  var initControlPanel = function() : void {
    let controlPanelDiv = Widgets.cloneTemplate("controlPanel-template");
    $(controlPanelDiv)
      .appendTo("#controlPanelContainer");
  }

  var setSimulatorSpeedfactor = function(speedFactor : number) : void {
    let simulatorParams = SimulatorSettings.getSimulatorParameters();
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
    MechModelView.resetModel();
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

  const ModifiedTooltipId = "modifiedTooltip";
  const PermalinkTooltipId = "permalinkGeneratedTooltip";
  const LoadErrorTooltipId = "loadErrorTooltip";
  const StatusTooltipIdList = [ModifiedTooltipId, PermalinkTooltipId, LoadErrorTooltipId];
  var initMiscControl = function() : void {
    let permalinkButtonJQ =
      $("#permalinkButton").click(() => {
        let saveAppStatePromise = MechViewRouter.saveAppState();
        saveAppStatePromise
          .then(function(data : any) {
            showPermalinkTooltip(location.href);
            Util.log("Success on save app state. Data: " + data);
            return data;
          })
          .catch(function(data : any) {
            Util.error("Fail on save app state." + Error(data));
            return Error(data);
          })
          .then(function(data : any) {
            Util.log("Done save app state. Data: " + data);
          });
      });
    //NOTE: We don't actually use the tooltip variable, it's just there to make tslint 
    //shut up about unused expressions. The tooltips themselves are stored in the DOM
    let tooltip : Widgets.Tooltip;
    tooltip = new Widgets.Tooltip("modifiedTooltip-template",
                                "modifiedTooltip",
                                permalinkButtonJQ.get(0));
    tooltip = new Widgets.Tooltip("permalinkGeneratedTooltip-template",
                                "permalinkGeneratedTooltip",
                                permalinkButtonJQ.get(0));
    let miscControlJQ = $("#" + "miscControl");
    tooltip = new Widgets.Tooltip("loadErrorTooltip-template",
                                "loadErrorTooltip",
                                miscControlJQ.get(0));
    $("#settingsButton").click(() => {
      MechSimulatorLogic.pauseSimulation();
      MechViewSimSettings.showSettingsDialog();
    });
  }

  var getStatusTooltip = function(tooltipId : string) : Tooltip {
    let element = document.getElementById(tooltipId);
    return Widgets.Tooltip.fromDom(element, Widgets.Tooltip.TooltipDomKey);
  }

  var showStatusTooltip = function(tooltipId : string) : void {
    for (let currId of StatusTooltipIdList) {
      let tooltip = getStatusTooltip(currId);
      if (currId === tooltipId) {
        tooltip.showTooltip();
      } else {
        tooltip.hideTooltip();
      }
    }
  }

  var hideStatusTooltips = function() : void {
    showStatusTooltip(null);
  }

  var showModifiedToolip = function() : void {
    showStatusTooltip(ModifiedTooltipId);
  }

  var showPermalinkTooltip = function(link : string) : void {
    $(`#${PermalinkTooltipId} [class~=permaLink]`)
      .attr("href", link);
    showStatusTooltip(PermalinkTooltipId);
  }

  var showLoadErrorTooltip = function() : void {
    showStatusTooltip(LoadErrorTooltipId);
  }

  var updateOnModifyAppState = function(event : Events.Event) : void {
    showModifiedToolip();
  }

  var updateOnAppSaveState = function(event : Events.Event) : void {
    //make the view consistent with the current state
  }

  var updateOnLoadAppState = function(event : Events.Event) : void {
    hideStatusTooltips();
    doAutoRun();
  }

  var updateOnLoadAppError = function(event : Events.Event) : void {
    showStatusTooltip(LoadErrorTooltipId);
  }

  var doAutoRun = function() : void {
    //set sim speed and run sim if run and speed url params are set
    let runParam : boolean = MechViewRouter.getRunFromLocation() === "true";
    let speedParam : number = Number(MechViewRouter.getSpeedFromLocation());
    if (speedParam) {
      setSimulatorSpeedfactor(speedParam);
    }
    if (runParam) {
      MechModelView.resetModel();
      MechSimulatorLogic.resetSimulation();
      MechSimulatorLogic.runSimulation();
    }
  }

  const LOADING_SCREEN_MECH_ID = "fakeLoadingScreenMechId";
  var loadingScreenAnimateInterval : number;
  const LOADING_SCREEN_ANIMATE_INTERVAL = 200; //ms
  export var showLoadingScreen = function() : void {
    let loadingScreenDiv =
        Widgets.cloneTemplate("loadingScreen-template");
    $(loadingScreenDiv)
      .attr("id", "loadingScreenContainer");
    Widgets.setModal(loadingScreenDiv);

    let loadingScreenPaperDollJQ = $("#loadingScreenPaperDollContainer");
    let paperDoll = new MechViewMechPanel.PaperDoll(LOADING_SCREEN_MECH_ID);
    loadingScreenPaperDollJQ.append(paperDoll.domElement);
    for (let componentIdx in Component) {
      if (Component.hasOwnProperty(componentIdx)) {
        let component = Component[componentIdx];
        paperDoll.setPaperDollArmor(component, 1);
        paperDoll.setPaperDollStructure(component, 1);
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
            paperDoll.setPaperDollArmor(component, Math.random());
            paperDoll.setPaperDollStructure(component, Math.random());
          }
        }
      }
      , LOADING_SCREEN_ANIMATE_INTERVAL);

    updateLoadingScreenProgress(0);
    Widgets.showModal();
  }

  export var hideLoadingScreen = function() : void {
    Widgets.hideModal();
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
