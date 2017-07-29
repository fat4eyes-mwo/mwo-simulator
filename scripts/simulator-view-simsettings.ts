/// <reference path="simulator-view-widgets.ts" />
/// <reference path="simulator-modelview.ts" />
/// <reference path="simulator-logic.ts" />

"use strict";

namespace MechViewSimSettings {
  type SimulatorParameters = MechSimulatorLogic.SimulatorParameters;
  type SimParamUserSettings = MechSimulatorLogic.SimParamUserSettings;

  export var initRangeInput = function() : void {
    let rangeJQ = $("#rangeInput");
    let rangeButton = new MechViewWidgets.MechButton("setRangeButton", function() {
      let buttonMode = $(this).attr("data-button-mode");
      if (buttonMode === "not-editing") {
        rangeJQ
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
    rangeJQ.on("keydown", (event) => {
      if (event.which === 13 ) { //enter key
        setRangeValue();
      }
    });
  };

  export var setRangeValue = function() : void {
    let rangeJQ = $("#rangeInput");
    rangeJQ.addClass("disabled").attr("disabled", "true");
    let range = Number($("#rangeInput").val());
    //set the range using the converted number value so user is sure it was parsed properly
    rangeJQ.val(range);
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

  export var updateSimSettingsView =
      function(simulatorParameters : SimulatorParameters) : void {
    if (simulatorParameters) {
      let range = simulatorParameters.range;
      $("#rangeInput").val(range);
    }
  };

  class SettingsDialog {
    //this.domElement : root element of the dialog
    //this.propertyMap: property->valueId->value
    domElement : Element;
    propertyMap : Map<string, Map<string, any>>;
    //TODO: Proper type  for simParams
    constructor(simSettings : SimParamUserSettings) {
      let settingsDiv = MechViewWidgets.cloneTemplate("simSettings-template");
      this.domElement = settingsDiv;
      this.propertyMap = new Map();

      this.populateSettings(simSettings);

      let settingsJQ = $(settingsDiv);
      settingsJQ.find(".applyButton").click(() => {
        //TODO: set simulation settings
        hideSettingsDialog();
      });
      settingsJQ.find(".cancelButton").click(() => {
        hideSettingsDialog();
      });
    }

    settingEntryId(settingProperty : string) : string {
      return settingProperty + "-value";
    }
    getSettingValue(property : string, valueId : string) {
      return this.propertyMap.get(property).get(valueId);
    }

    populateSettings(simSettings : SimParamUserSettings) {
      let SimulatorParameters = MechSimulatorLogic.SimulatorParameters;
      let settingsList = SimulatorParameters.prototype.getSettings();
      let entryListJQ = $(this.domElement).find(".simSettingsList");
      for (let entry of settingsList) {
        let entryDiv = MechViewWidgets.cloneTemplate("simSettingsEntry-template");
        let entryJQ = $(entryDiv)
                          .attr("id", this.settingEntryId(entry.property))
                          .attr("data-property", entry.property);
        entryJQ.find(".label").text(entry.name);
        let entrySelectJQ = entryJQ.find(".value");
        entrySelectJQ.empty();
        this.propertyMap.set(entry.property, new Map());
        entryListJQ.append(entryJQ);
        for (let value of entry.values) {
          let valueJQ = $("<option></option>")
                              .attr("value", value.id)
                              .attr("data-description", value.description)
                              .text(value.name)
                              .appendTo(entrySelectJQ);
          this.propertyMap.get(entry.property).set(value.id, value);
          //TODO: set value from simSettings
          if (value.default) {
            entrySelectJQ.val(value.id);
            entryJQ.find(".description").text(value.description);
          }
        }
        entryJQ.on('change', (data) => {
          let selectedValue = String(entrySelectJQ.val());
          let settingValue = this.getSettingValue(entry.property, selectedValue);
          entryJQ.find(".description").text(settingValue.description);
        })
      }
    }
  }

  export var showSettingsDialog = function() {
    let simulatorParameters = MechSimulatorLogic.getSimulatorParameters();

    let dialog = new SettingsDialog(simulatorParameters);
    MechViewWidgets.setModal(dialog.domElement, "simSettingsDialog");
    MechViewWidgets.showModal();
  }

  export var hideSettingsDialog = function() {
    MechViewWidgets.hideModal("simSettingsDialog");
  }
}
