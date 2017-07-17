"use strict";

var MechViewSimSettings = MechViewSimSettings || (function() {

  var initRangeInput = function() {
    let rangeButton = new MechViewWidgets.MechButton("setRangeButton", function() {
      let buttonMode = $(this).attr("data-button-mode");
      if (buttonMode === "not-editing") {
        $("#rangeInput")
            .removeClass("disabled")
            .removeAttr("disabled")
            .focus();
        $(this)
          .attr("data-button-mode", "editing")
          .html("Set Range");
      } else if (buttonMode === "editing"){
        setRangeValue();
      } else {
        throw "Invalid button state";
      }
    });
    $("#rangeInput").on("keydown", (event) => {
      if (event.which === 13 ) { //enter key
        setRangeValue();
      }
    });
  };

  var setRangeValue = function() {
    $("#rangeInput").addClass("disabled").attr("disabled", "true");
    let range = Number($("#rangeInput").val());
    //set the range using the converted number value so user is sure it was parsed properly
    $("#rangeInput").val(range);
    let simulatorParameters = MechModelView.getSimulatorParameters();
    simulatorParameters.range = range;
    //not strictly necessary, but it makes it explicit that we're changing
    //the simulator parameters. Handy when searching for code that changes
    //app state
    MechViewRouter.modifyAppState();
    MechModelView.setSimulatorParameters(simulatorParameters);
    $("#setRangeButton")
      .attr("data-button-mode", "not-editing")
      .html("Change");
  };

  var updateControlPanel = function(simulatorParameters) {
    if (simulatorParameters) {
      let range = simulatorParameters.range;
      $("#rangeInput").val(range);
    }
  };

  return {
    initRangeInput: initRangeInput,
    setRangeValue : setRangeValue,
    updateControlPanel : updateControlPanel,
  };
})();
