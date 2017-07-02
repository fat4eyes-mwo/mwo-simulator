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
        initMechs();
      } else {
        console.log("Failed to load model init data");
        //TODO error dialog here
      }
    });
  }

  function initMechs() {
    let fragmentHash = location.hash;
    let regex = /#s=([^&]*)/;
    let results = regex.exec(fragmentHash);
    let hashState;
    if (!results) {
      hashState = "default";
      location.hash="s=default";
    } else {
      hashState = results[1];
    }
    MechViewRouter.loadAppState(hashState,
      function(data) {
        console.log("Loaded application state from hash: " + hashState);
        initUI();
      },
      function(data) {
        console.log("Fail on load app state. Hash: " + hashState);
        //TODO: Show error screen
      },
      function(data) {
        console.log("Done on load app state. hash: " + hashState);
        MechView.hideLoadingScreen();
      });
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
