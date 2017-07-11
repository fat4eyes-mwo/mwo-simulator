"use strict";

//UI methods
//TODO: Wrap panel construction in classes, and split them off from this file. It's getting too big.

var MechView = MechView || (function() {

  // Paper doll UI functions
  //Color gradient for damage percentages. Must be in sorted ascending order
  const paperDollDamageGradient = Object.freeze([
    {value : 0.0, RGB : {r: 28, g:22, b:6}},
    {value : 0.1, RGB : {r: 255, g:46, b:16}},
    {value : 0.2, RGB : {r: 255, g:73, b:20}},
    {value : 0.3, RGB : {r: 255, g:97, b:12}},
    {value : 0.4, RGB : {r: 255, g:164, b:22}},
    {value : 0.5, RGB : {r:255, g:176, b:18}},
    {value : 0.6, RGB : {r:255, g:198, b:24}},
    {value : 0.7, RGB : {r:255, g:211, b:23}},
    {value : 0.8, RGB : {r:255, g:224, b:28}},
    {value : 0.9, RGB : {r:255, g:235, b:24}},
    {value : 1, RGB : {r:101, g:79, b:38}}
  ]);
  //Colors for health numbers
  const healthDamageGradient = Object.freeze([
    {value : 0.0, RGB : {r: 230, g:20, b:20}},
    {value : 0.7, RGB : {r: 230, g:230, b:20}},
    // {value : 0.9, RGB : {r:20, g:230, b:20}},
    {value : 0.9, RGB : {r:255, g:235, b:24}},
    {value : 1, RGB : {r:170, g:170, b:170}}
  ]);
  //Colors for individual component health numbers
  const componentHealthDamageGradient = Object.freeze([
    {value : 0.0, RGB : {r: 255, g:0, b:0}},
    {value : 0.7, RGB : {r:255, g:255, b:0}},
    // {value : 0.9, RGB : {r:0, g:255, b:0}},
    {value : 0.9, RGB : {r:255, g:235, b:24}},
    {value : 1, RGB : {r:170, g:170, b:170}}
  ]);

  //gets the damage color for a given percentage of damage
  var damageColor = function (percent, damageGradient) {
    var damageIdx = binarySearchClosest(
            damageGradient, percent, (key, colorValue) => {
      return key - colorValue.value;
    });
    if (damageIdx == -1) {
      damageIdx = 0;
    }
    let nextIdx = damageIdx + 1;
    nextIdx = (nextIdx < damageGradient.length) ? nextIdx : damageIdx;
    let rgb = damageGradient[damageIdx].RGB;
    let nextRgb = damageGradient[nextIdx].RGB;
    let percentDiff = (damageIdx != nextIdx) ?
        (percent - damageGradient[damageIdx].value) /
            (damageGradient[nextIdx].value - damageGradient[damageIdx].value)
        : 1;
    let red = Math.round(Number(rgb.r) + (Number(nextRgb.r) - Number(rgb.r)) * percentDiff);
    let green = Math.round(Number(rgb.g) + (Number(nextRgb.g) - Number(rgb.g)) * percentDiff);
    let blue = Math.round(Number(rgb.b) + (Number(nextRgb.b) - Number(rgb.b)) * percentDiff);
    return "rgb(" + red + ","  + green + "," + blue + ")";
  }

  //Add a paper doll with the given mechId to the element with the id
  //paperDollContainer uses the template paperDoll-template from the main HTML file
  var paperDollId =function (mechId) {
    return mechId + "-paperDoll";
  }
  var addPaperDoll = function (mechId, paperDollContainer) {
    $("#paperDoll-template")
      .clone(true)
      .attr("id", paperDollId(mechId))
      .attr("data-mech-id", mechId)
      .removeClass("template")
      .appendTo("#" + paperDollContainer);
  }

  //Percent values from 0 to 1
  var setPaperDollArmor = function (mechId, location, percent) {
    var color = damageColor(percent, paperDollDamageGradient);
    let query = "#" + paperDollId(mechId) + "> [data-location='" + location + "']";
    $(query)
      .css('border-color', color);
  }
  var setPaperDollStructure = function (mechId, location, percent) {
    var color = damageColor(percent, paperDollDamageGradient);
    let query = "#" + paperDollId(mechId) + "> [data-location='" + location + "']";
    $(query)
      .css('background-color', color);
  }

  var mechHealthNumbersId = function (mechId) {
    return mechId + "-mechHealthNumbers";
  }
  var mechHealthNumbersArmorId = function(mechId, location) {
    return mechId + "-mechHealthNumbers-" + location + "-armor";
  }
  var mechHealthNumbersStructureId = function(mechId, location) {
    return mechId + "-mechHealthNumbers-" + location + "-structure";
  }
  var addMechHealthNumbers = function (mech, mechHealthNumbersContainer) {
    let mechId = mech.getMechId();
    let mechHealthNumbersDivId = mechHealthNumbersId(mechId);
    $("#mechHealthNumbers-template").
      clone(true)
      .attr("id", mechHealthNumbersDivId)
      .attr("data-mech-id", mechId)
      .removeClass("template")
      .appendTo(mechHealthNumbersContainer);

    for (let locationIdx in MechModel.Component) {
      if (MechModel.Component.hasOwnProperty(locationIdx)) {
        let location = MechModel.Component[locationIdx];
        $("#" + mechHealthNumbersDivId +
          " [data-location=" + location + "] " +
          " [data-healthtype=armor]")
            .attr("id", mechHealthNumbersArmorId(mechId, location));
        $("#" + mechHealthNumbersDivId +
          " [data-location=" + location + "] " +
          " [data-healthtype=structure]")
          .attr("id", mechHealthNumbersStructureId(mechId, location));
      }
    }
  }

  var updateMechHealthNumbers = function(mechId, location, armor, structure,
                                          maxArmor, maxStructure) {
    let mechHealthNumbersDivId = mechHealthNumbersId(mechId);
    let armorPercent = Number(armor) / Number(maxArmor);
    let structurePercent = Number(structure) / Number(maxStructure);
    let armorColor = damageColor(armorPercent, componentHealthDamageGradient);
    let structureColor = damageColor(structurePercent, componentHealthDamageGradient);

    let armorLocationDivId = mechHealthNumbersArmorId(mechId, location);
    let structureLocationDivId = mechHealthNumbersStructureId(mechId, location);

    let armorLocationDiv = document.getElementById(armorLocationDivId);
    if (armorLocationDiv) {
      armorLocationDiv.innerHTML = Math.round(armor);
      //NOTE: Title change too expensive
      // armorLocationDiv.setAttribute("title", (Number(armor)).toFixed(2));
      armorLocationDiv.style.color = armorColor;
    }

    let structureLocationDiv = document.getElementById(structureLocationDivId);
    if (structureLocationDiv) {
      structureLocationDiv.innerHTML = Math.round(structure)
      //NOTE: Title change too expensive
      // structureLocationDiv.setAttribute("title", (Number(structure)).toFixed(2));
      structureLocationDiv.style.color = structureColor;
    }

    //Jquery calls are too expensive in frequent UI updates.
    // $("#" + mechHealthNumbersDivId +
    //   " [data-location=" + location + "] " +
    //   " [data-healthtype=armor]")
    //     .css("color", armorColor)
    //     .html(Math.round(armor));
    // $("#" + mechHealthNumbersDivId +
    //   " [data-location=" + location + "] " +
    //   " [data-healthtype=structure]")
    //   .css("color", structureColor)
    //   .html(Math.round(structure));
  }

  //Heatbar UI functions
  var heatbarId = function (mechId) {
    return mechId + "-heatbar";
  }
  var heatbarValueId = function (mechId) {
    return mechId + "-heatbarValue";
  }
  var addHeatbar = function (mechId, heatbarContainer) {
    $("#heatbar-template").clone(true)
    .attr("id", heatbarId(mechId))
    .attr("data-mech-id", mechId)
    .removeClass("template")
    .appendTo(heatbarContainer);
    $("#" + heatbarId(mechId) + " > [class~=heatbar]")
      .attr("id", heatbarValueId(mechId))
      .attr("data-mech-id", mechId);
  }
  //Sets the heatbar value for a given mech id to a specified percentage. Value of
  //percent is 0 to 1
  var setHeatbarValue = function (mechId, percent) {
    var invPercent = 1 - percent;
    //NOTE: jquery too expensive
    // $("#" + heatbarId(mechId) + " > [class=heatbar]")
    //   .height( (100 * invPercent) + "%");

    let heatbarValueDiv = document.getElementById(heatbarValueId(mechId));
    heatbarValueDiv.style.height = (100 * invPercent) + "%";
  }

  var updateHeat = function(mechId, currHeat, currMaxHeat) {
    let heatPercent = Number(currHeat) / Number(currMaxHeat);
    setHeatbarValue(mechId, heatPercent);

    var heatNumberId = heatNumberPanelId(mechId);
    let heatText = parseFloat(heatPercent * 100).toFixed(0) + "%" +
                    " (" + parseFloat(currHeat).toFixed(1) + ")";
    let heatNumberDiv = document.getElementById(heatNumberId);

    // $("#" + heatNumberId).html(heatText);
    heatNumberDiv.innerHTML = heatText;
  }

  var weaponRowId = function (mechId, idx) {
    return mechId + "-" + idx + "-weaponrow";
  }
  var weaponCooldownBarId = function (mechId, idx) {
    return weaponRowId(mechId, idx) + "-weaponCooldownBar";
  }
  var weaponAmmoId = function(mechId, idx) {
    return weaponRowId(mechId, idx) + "-weaponAmmo";
  }
  const weaponLocAbbr = {
    "head" : "H",
    "left_arm" : "LA",
    "left_torso" : "LT",
    "centre_torso" : "CT",
    "right_torso" : "RT",
    "right_arm" : "RA",
    "left_leg" : "LL",
    "right_leg" : "RL"
  }
  var addWeaponPanel = function (mechId, weaponStateList, ammoState, weaponPanel) {
    for (var idx in weaponStateList) {
      var weaponState = weaponStateList[idx];
      $("#weaponRow-template")
        .clone(true)
        .attr("id", weaponRowId(mechId, idx))
        .attr("data-mech-id", mechId)
        .attr("data-weapon-idx", idx)
        .removeClass("template")
        .appendTo(weaponPanel);
      $("#" + weaponRowId(mechId, idx) + " .weaponName")
        .attr("id", weaponRowId(mechId, idx) + "-weaponName")
        .html(weaponState.weaponInfo.translatedName);
      $("#" + weaponRowId(mechId, idx) + " .weaponLocation")
        .attr("id", weaponRowId(mechId, idx) + "-weaponLocation")
        .html(weaponLocAbbr[weaponState.weaponInfo.location]);
      $("#" + weaponRowId(mechId, idx) + " .weaponCooldownBar")
        .attr("id", weaponCooldownBarId(mechId, idx));
      $("#" + weaponRowId(mechId, idx) + " .weaponAmmo")
        .attr("id", weaponAmmoId(mechId, idx));

      setWeaponAmmo(mechId, idx, 0);
      setWeaponState(mechId, idx, weaponState.weaponCycle);
      setWeaponCooldown(mechId, idx, 0);
    }
  }
  var setWeaponCooldown = function (mechId, weaponIdx, percent) {
    //NOTE: jQuery on weapon cooldowns takes way too much compute time. Use
    //plain javascript for this and other often updated elements
    //$("#" + weaponCooldownBarId(mechId, weaponIdx)).width(100*percent + "%");
    let cooldownDiv = document.getElementById(weaponCooldownBarId(mechId, weaponIdx));
    cooldownDiv.style.width = (100*percent) + "%";
  }
  var setWeaponAmmo = function (mechId, weaponIdx, ammo) {
    let weaponAmmoDiv = document.getElementById(weaponAmmoId(mechId, weaponIdx));
    weaponAmmoDiv.innerHTML = ammo != -1 ? ammo : "&#x221e;";
    //slow jquery
    // $("#" + weaponAmmoId(mechId, weaponIdx)).html(ammo != -1 ? ammo : "&#x221e;");
  }
  var setWeaponState = function (mechId, weaponIdx, state) {
    //Note: the remove class string must include all the MechModel.WeaponCycle strings
    let removeClassString = "";
    for (let weaponCycle in MechModel.WeaponCycle) {
      if (MechModel.WeaponCycle.hasOwnProperty(weaponCycle)) {
        removeClassString += MechModel.WeaponCycle[weaponCycle] + " ";
      }
    }
    $("#" + weaponRowId(mechId, weaponIdx)).removeClass(removeClassString);
    $("#" + weaponRowId(mechId, weaponIdx)).addClass(state);
  }

  //adds a mech panel (which contains a paperDoll, a heatbar and a weaponPanel)
  function mechPanelId(mechId) {
    return mechId + "-mechPanel";
  }
  var mechSummaryHealthPanelId = function(mechId) {
    return mechId + "-mechSummaryHealth";
  }
  var mechNamePanelId = function(mechId) {
    return mechId + "-mechName";
  }
  var mechDeleteButtonId = function(mechId) {
    return mechId + "-deleteButton";
  }
  var heatNumberPanelId = function(mechId) {
    return mechId + "-heatbarNumber";
  }
  var mechTargetPanelId = function(mechId) {
    return mechId + "-mechTarget";
  }
  var mechHealthAndWeaponsId = function(mechId) {
    return mechId + "-mechHealthAndWeapons";
  }
  var mechDPSPanelId = function(mechId) {
    return mechId + "-mechDPSText";
  }
  var mechBurstPanelId = function(mechId) {
    return mechId + "-mechBurstText";
  }
  var mechTotalDamagePanelId = function(mechId) {
    return mechId + "-mechTotalDamageText";
  }
  var addMechPanel = function (mech, team) {
    let mechId = mech.getMechId();
    let mechState = mech.getMechState();
    let weaponStateList = mechState.weaponStateList;
    let ammoState = mechState.ammoState;
    let mechPanelContainer = "#" + team + "Team";
    $("#mechPanel-template")
      .clone(true)
      .attr("id", mechPanelId(mechId))
      .attr("data-mech-id", mechId)
      .removeClass("template")
      .appendTo(mechPanelContainer);

    var mechHealthAndWeaponsDivId = mechHealthAndWeaponsId(mechId);
    $("#" + mechPanelId(mechId) + " [class~=mechHealthAndWeapons]")
      .attr("id", mechHealthAndWeaponsDivId);

    var paperDollContainerId = mechId + "-paperDollContainer";
    $("#" + mechPanelId(mechId) + " [class~='paperDollContainer']")
      .attr("id", paperDollContainerId);
    addPaperDoll(mechId, paperDollContainerId);

    var mechHealthNumbersId = mechId + "-mechHealthNumbers";
    $("#" + mechPanelId(mechId) + " [class~='mechHealthNumbers']")
      .attr("id", mechHealthNumbersId);
    addMechHealthNumbers(mech, "#" + mechHealthNumbersId);

    var heatbarContainerId = mechId + "-heatbarContainer";
    $("#" + mechPanelId(mechId) + " [class~='heatbarContainer']")
      .attr("id", heatbarContainerId);
    addHeatbar(mechId, "#" + heatbarContainerId);

    var heatNumberId = heatNumberPanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='heatNumber']")
      .attr("id", heatNumberId);

    var weaponPanelContainerId = mechId + "-weaponPanelContainer";
    $("#" + mechPanelId(mechId) + " [class~='weaponPanelContainer']")
      .attr("id", weaponPanelContainerId);
    addWeaponPanel(mechId, weaponStateList, ammoState, "#" + weaponPanelContainerId);

    let mechNameId =  mechNamePanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='titlePanel'] [class~='mechName']")
      .attr("id", mechNameId)
      .html("");

    //delete button
    if (!deleteMechButton_Handler) {
      deleteMechButton_Handler = new DeleteMechButton_Handler(this);
    }
    let mechDeleteButtonDivId = mechDeleteButtonId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='titlePanel'] [class~='deleteMechButton']")
      .attr("id", mechDeleteButtonDivId)
      .attr("data-mech-id", mechId)
      .attr("data-team", team)
      .click(deleteMechButton_Handler);


    let mechSummaryHealthId = mechSummaryHealthPanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechSummaryHealthText']")
      .attr("id", mechSummaryHealthId)
      .html("");

    let mechTargetId = mechTargetPanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechTargetText']")
      .attr("id", mechTargetId)
      .html("");

    let mechDPSId = mechDPSPanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechDPSText']")
      .attr("id", mechDPSId)
      .html("");

    let mechBurstId = mechBurstPanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechBurstText']")
      .attr("id", mechBurstId)
      .html("");

    let mechTotalDamageId = mechTotalDamagePanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechTotalDamageText']")
      .attr("id", mechTotalDamageId)
      .html("");
  }

  const SMURFY_BASE_URL= "http://mwo.smurfy-net.de/mechlab#";
  var updateMechTitlePanel = function(mechId, mechName, smurfyMechId, smurfyLayoutId) {
    let mechNameId = mechNamePanelId(mechId);
    //Create smurfy link then set the mech name
    let smurfyLink = SMURFY_BASE_URL + "i=" + smurfyMechId + "&l=" + smurfyLayoutId;
    let mechNameDiv = document.getElementById(mechNameId);

    mechNameDiv.innerHTML = $("<a></a>")
                                  .attr("href", smurfyLink)
                                  .attr("target", "_blank")
                                  .html(mechName)
                                  .prop("outerHTML");
  }

  var updateMechStatusPanel = function(mechId, mechIsAlive,
        mechCurrTotalHealth, mechCurrMaxHealth, targetMechName, dps, burst, totalDmg) {
    let mechSummaryHealthId = mechSummaryHealthPanelId(mechId);
    let mechHealthAndWeaponsDivId = mechHealthAndWeaponsId(mechId);
    let mechHealthAndWeaponsDiv =
          document.getElementById(mechHealthAndWeaponsDivId);

    //set mech summary health
    let mechSummaryHealthText = "";
    let percentHealth = Number(mechCurrTotalHealth) / Number(mechCurrMaxHealth);
    if (mechCurrTotalHealth > 0 && mechIsAlive) {
      mechSummaryHealthText = ((percentHealth * 100).toFixed(0)) + "%";
      if (mechHealthAndWeaponsDiv.classList.contains("kia")) {
        mechHealthAndWeaponsDiv.classList.remove("kia");
      }
    } else {
      mechSummaryHealthText =
        "KIA" + "(" + ((percentHealth * 100).toFixed(0)) + "%" + ")";
      percentHealth = 0;
      if (!mechHealthAndWeaponsDiv.classList.contains("kia"))  {
        mechHealthAndWeaponsDiv.classList.add("kia");
      }
    }
    let mechSummaryHealthDiv = document.getElementById(mechSummaryHealthId);
    mechSummaryHealthDiv.style.color =
                  damageColor(percentHealth, healthDamageGradient);
    mechSummaryHealthDiv.innerHTML = mechSummaryHealthText;

    //update mech target
    let mechTargetId = mechTargetPanelId(mechId);
    let mechTargetDiv = document.getElementById(mechTargetId);
    mechTargetDiv.innerHTML = targetMechName;

    //set mech total damage
    let mechTotalDamageId = mechTotalDamagePanelId(mechId);
    let mechTotalDamageDiv = document.getElementById(mechTotalDamageId);
    mechTotalDamageDiv.innerHTML = Number(totalDmg).toFixed(1);

    //set mech dps
    let mechDPSId = mechDPSPanelId(mechId);
    let mechDPSDiv = document.getElementById(mechDPSId);
    mechDPSDiv.innerHTML = Number(dps).toFixed(1);

    //set mech burst
    let mechBurstId = mechBurstPanelId(mechId);
    let mechBurstDiv = document.getElementById(mechBurstId);
    mechBurstDiv.innerHTML = Number(burst).toFixed(1);
  }



  const MODAL_SCREEN_ID = "mechModalScreen";
  const MODAL_DIALOG_ID = "mechModalDialog";

  var DeleteMechButton_Handler = function(context) {
    var clickContext = context;

    return function() {
      let mechId = $(this).data("mech-id");
      let team = $(this).data("team");
      console.log("Deleting " + mechId + " of team " + team);
      let result = MechModel.deleteMech(mechId, team);
      if (!result) {
        throw "Error deleting " + mechId;
      }
      MechViewRouter.modifyAppState();
      let mechPanelDivId = mechPanelId(mechId);
      $("#" + mechPanelDivId).remove();
      //TODO: should not require a full view refresh. Modify updateTeamStats so
      //the number of mechpips is consistent when a mech is deleted
      MechModelView.refreshView(true);
    };
  }
  var deleteMechButton_Handler; //singleton

  var clear = function (team) {
    let teamMechPanelId = team + "Team";
    $("#" + teamMechPanelId).empty();

    MechViewTeamStats.clearTeamStats(team);
  }

  var clearAll = function () {
    clear("blue");
    clear("red");
  }

  var updateSimTime = function(simTime) {
    $("#simTime").html(simTime + "ms");
  }

  var updateControlPanel = function(simulatorParameters) {
    if (simulatorParameters) {
      let range = simulatorParameters.range;
      $("#rangeInput").val(range);
    }
  }

  var setDebugText = function(debugText) {
    $("#debugText").html(debugText);
  }

  var initView = function() {
    MechViewTeamStats.initPatternTypes();
    initRangeInput();
    initSpeedControl();
    initStateControl();
    initMiscControl();
  }

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
  }

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
  }

  var initSpeedControl = function() {
    $("#startSimulationDivButton").click(() => {
      MechSimulatorLogic.runSimulation();
    });

    $("#pauseSimulationDivButton").click(() => {
      MechSimulatorLogic.pauseSimulation();
    });

    $("#stepSimulationDivButton").click(() => {
      MechSimulatorLogic.stepSimulation();
    });

    var setSimulatorSpeedfactor = function(speedFactor) {
      let simulatorParams = MechSimulatorLogic.getSimulatorParameters();
      simulatorParams.setSpeedFactor(speedFactor);
      MechSimulatorLogic.setSimulatorParameters(simulatorParams);
    }
    $("#speed1xbutton").click(() => {
      setSimulatorSpeedfactor(1);
      $("#simSpeed").html("1x");
    });
    $("#speed2xbutton").click(() => {
      setSimulatorSpeedfactor(2);
      $("#simSpeed").html("2x");
    });
    $("#speed4xbutton").click(() => {
      setSimulatorSpeedfactor(4);
      $("#simSpeed").html("4x");
    });
    $("#speed8xbutton").click(() => {
      setSimulatorSpeedfactor(8);
      $("#simSpeed").html("8x");
    });
  }

  var initStateControl = function() {
    $("#resetSimulationDivButton").click(() => {
      MechModel.resetState();
      MechSimulatorLogic.resetSimulation();
      MechModelView.refreshView(false);
    });

    $("#showReportDivButton").click(() => {
      MechSimulatorLogic.pauseSimulation();
      MechViewReport.showVictoryReport();
    });
  }

  var permalinkTooltip;
  var modifiedTooltip;
  var loadErrorTooltip;
  var initMiscControl = function() {
    $("#permalinkButton").click(() => {
      MechViewRouter.saveAppState(
        function(data) {
          showPermalinkTooltip(location.href);
          console.log("Success on save app state. Data: " + data);
        },
        function(data) {
          console.log("Fail on save app state. Data: " + data);
        },
        function(data) {
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
  }

  var showModifiedToolip = function() {
    permalinkTooltip.hideTooltip();
    loadErrorTooltip.hideTooltip();
    modifiedTooltip.showTooltip();
  }

  var showPermalinkTooltip = function(link) {
    modifiedTooltip.hideTooltip();
    loadErrorTooltip.hideTooltip();
    $("#" + permalinkGeneratedTooltip.id + " [class~=permaLink]")
      .attr("href", link);
    permalinkTooltip.showTooltip();
  }

  var showLoadErrorTooltip = function() {
    modifiedTooltip.hideTooltip();
    permalinkTooltip.hideTooltip();
    loadErrorTooltip.showTooltip();
  }

  //TODO: You now have multiple entities acting on the same event. Think about
  //setting up an event scheduler/listeners
  var updateOnModifyAppState = function() {
    showModifiedToolip();
  }

  var updateOnAppSaveState = function() {
    //make the view consistent with the current state
  }

  var updateOnLoadAppState = function() {
    permalinkTooltip.hideTooltip();
    modifiedTooltip.hideTooltip();
    loadErrorTooltip.hideTooltip();
  }

  var updateOnLoadAppError = function() {
    permalinkTooltip.hideTooltip();
    modifiedTooltip.hideTooltip();
    loadErrorTooltip.showTooltip();
  }

  const LOADING_SCREEN_MECH_ID = "fakeLoadingScreenMechId";
  var loadingScreenAnimateInterval;
  const LOADING_SCREEN_ANIMATE_INTERVAL = 200; //ms
  var showLoadingScreen = function() {
    $("#" + MODAL_DIALOG_ID).empty();
    $("#loadingScreen-template")
      .clone(true)
      .attr("id", "loadingScreenContainer")
      .removeClass("template")
      .appendTo("#" + MODAL_DIALOG_ID);

    addPaperDoll(LOADING_SCREEN_MECH_ID, "loadingScreenPaperDollContainer");
    for (let componentIdx in MechModel.Component) {
      if (MechModel.Component.hasOwnProperty(componentIdx)) {
        let component = MechModel.Component[componentIdx];
        MechView.setPaperDollArmor(LOADING_SCREEN_MECH_ID, component, 1);
        MechView.setPaperDollStructure(LOADING_SCREEN_MECH_ID, component, 1);
      }
    }
    if (loadingScreenAnimateInterval) {
      window.clearInterval(loadingScreenAnimateInterval);
    }
    loadingScreenAnimateInterval = window.setInterval(
      function () {
        for (let componentIdx in MechModel.Component) {
          if (MechModel.Component.hasOwnProperty(componentIdx)) {
            let component = MechModel.Component[componentIdx];
            MechView.setPaperDollArmor(LOADING_SCREEN_MECH_ID, component, Math.random());
            MechView.setPaperDollStructure(LOADING_SCREEN_MECH_ID, component, Math.random());
          }
        }
      }
      , LOADING_SCREEN_ANIMATE_INTERVAL);

    updateLoadingScreenProgress(0);
    $("#" + MODAL_SCREEN_ID).css("display", "block");
  }

  var hideLoadingScreen = function() {
    $("#" + MODAL_SCREEN_ID).css("display", "none");
    $("#" + MODAL_DIALOG_ID).empty();
    window.clearInterval(loadingScreenAnimateInterval);
  }

  var updateLoadingScreenProgress = function(percent) {
    let progressBar = document.getElementById("loadingScreenProgress");
    let textPercent = Math.floor(Number(percent) * 100) + "%";
    progressBar.style.width = textPercent;
  }

  var updateTitle = function(title) {
    document.title = title;
  }

  //public members
  return {
    damageColor: damageColor,
    healthDamageGradient: healthDamageGradient,
    mechPanelId: mechPanelId,
    setPaperDollArmor : setPaperDollArmor,
    setPaperDollStructure : setPaperDollStructure,
    setHeatbarValue : setHeatbarValue,
    addMechPanel : addMechPanel,
    initView : initView,
    setWeaponCooldown: setWeaponCooldown,
    setWeaponAmmo : setWeaponAmmo,
    setWeaponState : setWeaponState,
    updateMechHealthNumbers : updateMechHealthNumbers,
    updateMechStatusPanel : updateMechStatusPanel,
    updateMechTitlePanel : updateMechTitlePanel,
    updateHeat: updateHeat,
    updateSimTime : updateSimTime,
    updateControlPanel: updateControlPanel,
    setDebugText : setDebugText,
    clear : clear,
    clearAll : clearAll,
    showLoadingScreen : showLoadingScreen,
    updateLoadingScreenProgress: updateLoadingScreenProgress,
    hideLoadingScreen : hideLoadingScreen,
    updateTitle: updateTitle,

    updateOnModifyAppState: updateOnModifyAppState,
    updateOnAppSaveState: updateOnAppSaveState,
    updateOnLoadAppState: updateOnLoadAppState,
    updateOnLoadAppError: updateOnLoadAppError,

    MODAL_SCREEN_ID: MODAL_SCREEN_ID,
    MODAL_DIALOG_ID: MODAL_DIALOG_ID,
  };
})();//namespace
