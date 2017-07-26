"use strict";

var MechSimulator = MechSimulator || (function() {

  const DEFAULT_RANGE = 200;

  function init() {
    MechView.initView();
    MechView.showLoadingScreen();

    let simulatorParameters = new MechSimulatorLogic.SimulatorParameters(
                                DEFAULT_RANGE, //range
                                1 //speed factor
                              );
    MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
    MechModel.initModelData()
      .then(function() {
        console.log("Successfully loaded model init data");
        //router should not be initialized before the smurfy data is
        //loaded since the hash change listener can start pulling in smurfy
        //loadout data
        MechViewRouter.initViewRouter();
        initMechs();
      })
      .catch(function() {
        console.error("Failed to load model init data");
        MechView.hideLoadingScreen();
        MechView.updateOnLoadAppError();
      });
  }

  function initMechs() {
    MechViewRouter.loadStateFromLocationHash()
      .then(function(data) {
        initUI();
        return data;
      })
      .catch(function(err) {
        console.error("Error loading mech data: " + err);
        MechModelView.refreshView();
        MechView.updateOnLoadAppError();
        location.hash = "";
      })
      .then(function(data) {
        MechView.hideLoadingScreen();
        MechView.updateOnAppLoaded();
      });
  }

  function initUI() {
    MechModelView.refreshView();
  }

  function main() {
    // MechTest.testUIWidgets();
    // MechTest.testModelInit();
    // MechTest.testModelOps();
    // MechTest.testModelBaseHealth();
    // MechTest.testModelView();
    // MechTest.testDamageAtRange();
    // MechTest.testListQuirks();
    // MechTest.testSpreadAdjacentDamage();
    // MechTest.testSimulation();
    // MechTest.testPersistence();
    // MechTest.testLRMSpread();
    init();
  }

  return {
    main: main,
  }

})();

$(document).ready(MechSimulator.main);
