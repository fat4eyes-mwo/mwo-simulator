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
    MechModel.initModelData((success) => {
      if (success) {
        console.log("Successfully loaded model init data");
        //router should not be initialized before the smurfy data is
        //loaded since the
        MechViewRouter.initViewRouter();
        initMechs();
      } else {
        console.log("Failed to load model init data");
        //TODO error dialog here
      }
    });
  }

  function initMechs() {
    MechViewRouter.loadStateFromLocationHash(
      function(data) {
        initUI();
      },
      function(data) {
        //TODO: Show error screen
        console.log("Error loading mech data: " + data);
      },
      function(data) {
        MechView.hideLoadingScreen();
      }
    );
  }

  function initUI() {
    MechModelView.refreshView();
  }

  function main() {
    // MechTest.testUIWidgets();
    // MechTest.testModelInit();
    // MechTest.testModelOps();
    //MechTest.testModelBaseHealth();
    // MechTest.testModelView();
    // MechTest.testDamageAtRange();
    // MechTest.testListQuirks();
    // MechTest.testSpreadAdjacentDamage();
    // MechTest.testSimulation();
    // MechTest.testPersistence();
    init();
  }

  return {
    main: main,
  }

})();

$(document).ready(MechSimulator.main);
