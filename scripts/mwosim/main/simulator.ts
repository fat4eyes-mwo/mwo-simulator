"use strict";

namespace MechSimulator {
  import SimulatorParameters = SimulatorSettings.SimulatorParameters;
  import EventType = MechModelCommon.EventType;
  const DEFAULT_RANGE = 200;
  const DEFAULT_SPEED = 1;

  function init() : void {
    MechView.init();
    MechView.showLoadingScreen();

    let simulatorParameters =
      new SimulatorParameters(DEFAULT_RANGE, DEFAULT_SPEED);
    MechSimulatorLogic.setSimulatorParameters(simulatorParameters);

    MechModel.initModelData()
      .then(function() {
        Util.log("Successfully loaded model init data");
        //router should not be initialized before the smurfy data is
        //loaded since the hash change listener can start pulling in smurfy
        //loadout data
        MechViewRouter.initViewRouter();
        initMechs();
      })
      .catch(function() {
        Util.error("Failed to load model init data");
        MechView.hideLoadingScreen();
        MechModelView.getEventQueue().queueEvent({type : EventType.APP_STATE_LOAD_ERROR});
      });
  }

  function initMechs() : void {
    MechViewRouter.loadStateFromLocationHash()
      .then(function(data) {
        initUI();
        return data;
      })
      .catch(function(err) {
        Util.error("Error loading mech data: " + err);
        MechModelView.refreshView();
        MechModelView.getEventQueue().queueEvent({type : EventType.APP_STATE_LOAD_ERROR});
        location.hash = "";
      })
      .then(function(data) {
        MechView.hideLoadingScreen();
        MechView.updateOnAppLoaded();
      });
  }

  function initUI() : void {
    MechModelView.refreshView();
  }

  export function main() : void {
    init();
  }
}
