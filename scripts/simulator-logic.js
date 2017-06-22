
var MechSimulatorLogic = MechSimulatorLogic || (function () {

  var simulationInterval = null;
  var simRunning = false;
  var simTime = 0;
  const stepDuration = 50; //tick length in ms

  var runSimulation = function() {
    if (!simulationInterval) {
      var IntervalHandler = function(context) {
        this.context = context;
        return () => {
          if (simRunning) {
            this.context.step();
          }
        }
      };
      let intervalHandler = new IntervalHandler(this);
      simulationInterval = window.setInterval(intervalHandler, stepDuration);
    }
    simRunning = true;
  }

  var pauseSimulation = function() {
    simRunning = false;
  }

  var resetSimulation = function() {
    simRunning = false;
    if (simulationInterval) {
      window.clearInterval(simulationInterval);
      simulationInterval = null;
    }
    simTime = 0;
    MechModelView.updateSimTime(simTime);
  }

  var step = function() {
    simTime += stepDuration;
    MechModelView.updateSimTime(simTime);
  }

  return {
    runSimulation : runSimulation,
    pauseSimulation : pauseSimulation,
    resetSimulation : resetSimulation,
    step: step,
  }

})(); //end namespace
