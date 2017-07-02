"use strict";

var MechSimulator = MechSimulator || (function() {

  const DEFAULT_RANGE = 200;

  function init() {
    MechView.initView();
    MechView.showLoadingScreen();

    let simulatorParameters = new MechSimulatorLogic.SimulatorParameters(
                                DEFAULT_RANGE//range
                              );
    MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
    MechModel.initModelData((success) => {
      if (success) {
        console.log("Successfully loaded model init data");
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
