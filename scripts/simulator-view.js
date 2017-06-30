"use strict";

//UI methods
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
    {value : 0.5, RGB : {r: 230, g:230, b:20}},
    {value : 0.9, RGB : {r:20, g:230, b:20}},
    {value : 1, RGB : {r:170, g:170, b:170}}
  ]);
  //Colors for individual component health numbers
  const componentHealthDamageGradient = Object.freeze([
    {value : 0.0, RGB : {r: 255, g:0, b:0}},
    {value : 0.5, RGB : {r:255, g:255, b:0}},
    {value : 0.9, RGB : {r:0, g:255, b:0}},
    {value : 1, RGB : {r:170, g:170, b:170}}
  ]);

  class MechButton {
    constructor(id, clickHandler) {
      this.id = id;
      this.clickHandler = (function(context) {
          var clickContext = context;
          return function(event) {
            if (clickContext.enabled) {
              clickHandler.call(event.currentTarget);
            }
          }
      })(this);
      this.enabled = true;
      $("#" + this.id).click(this.clickHandler);
    }

    setHtml(html) {
      $("#" + this.id).html(html);
    }

    addClass(className) {
      $("#" + this.id).addClass(className)
    }

    removeClass(className) {
      $("#" + this.id).removeClass(className);
    }

    disable() {
      if (this.enabled) {
        $("#" + this.id).addClass("disabled");
        this.enabled = false;
      }
    }

    enable() {
      if (!this.enabled) {
        $("#" + this.id).removeClass("disabled");
        this.enabled = true;
      }
    }
  }

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
      armorLocationDiv.style.color = armorColor;
    }

    let structureLocationDiv = document.getElementById(structureLocationDivId);
    if (structureLocationDiv) {
      structureLocationDiv.innerHTML = Math.round(structure)
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
      let weaponAmmoCount;
      let ammoCount = ammoState.ammoCounts[weaponState.weaponInfo.weaponId];
      if (ammoCount) {
        weaponAmmoCount = ammoCount.ammoCount;
      }  else {
        weaponAmmoCount = -1;
      }
      setWeaponAmmo(mechId, idx, weaponAmmoCount);
      setWeaponState(mechId, idx, weaponState.weaponCycle);
      setWeaponCooldown(mechId, idx, 0);
    }
  }
  var setWeaponCooldown = function (mechId, weaponIdx, percent) {
    //TODO, NOTE: jQuery on weapon cooldowns takes way too much compute time. Use
    //plain javascript for this and other often updated elements
    //$("#" + weaponCooldownBarId(mechId, weaponIdx)).width(100*percent + "%");
    let cooldownDiv = document.getElementById(weaponCooldownBarId(mechId, weaponIdx));
    cooldownDiv.style.width = (100*percent) + "%";
  }
  var setWeaponAmmo = function (mechId, weaponIdx, ammo) {
    $("#" + weaponAmmoId(mechId, weaponIdx)).html(ammo != -1 ? ammo : "&#x221e;");
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
  var mechPanelId = function (mechId) {
    return mechId + "-mechPanel";
  }
  var mechSummaryHealthPanelId = function(mechId) {
    return mechId + "-mechSummaryHealth";
  }
  var mechNamePanelId = function(mechId) {
    return mechId + "-mechName";
  }
  var heatNumberPanelId = function(mechId) {
    return mechId + "-heatbarNumber";
  }
  var mechTargetPanelId = function(mechId) {
    return mechId + "-mechTarget";
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

    //TODO: messy repetitive code to add paperDoll and heatbar. Try to see if this
    //can be done inside a single search for the children of the mechPanel
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
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechName']")
      .attr("id", mechNameId)
      .html(mech.getMechInfo().mechTranslatedName);

    let mechSummaryHealthId = mechSummaryHealthPanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechSummaryHealthText']")
      .attr("id", mechSummaryHealthId)
      .html("");

    let mechTargetId = mechTargetPanelId(mechId);
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechTargetText']")
      .attr("id", mechTargetId)
      .html("");
  }

  var updateMechStatusPanel = function(mechId, mechName,
                mechIsAlive, mechCurrTotalHealth, mechCurrMaxHealth, targetMechName) {
    let mechNameId = mechNamePanelId(mechId);
    let mechSummaryHealthId = mechSummaryHealthPanelId(mechId);

    //set mech name
    let mechNameDiv = document.getElementById(mechNameId);
    mechNameDiv.innerHTML = mechName;

    //set mech summary health
    let mechSummaryHealthText = "";
    let percentHealth = 0;
    if (mechCurrTotalHealth > 0 && mechIsAlive) {
      percentHealth = Number(mechCurrTotalHealth) / Number(mechCurrMaxHealth);
      mechSummaryHealthText = ((percentHealth * 100).toFixed(0)) + "%";
    } else {
      percentHealth = 0;
      mechSummaryHealthText = "KIA";
    }
    let mechSummaryHealthDiv = document.getElementById(mechSummaryHealthId);
    mechSummaryHealthDiv.style.color =
                  damageColor(percentHealth, healthDamageGradient);
    mechSummaryHealthDiv.innerHTML = mechSummaryHealthText;

    //update mech target
    let mechTargetId = mechTargetPanelId(mechId);
    let mechTargetDiv = document.getElementById(mechTargetId);
    mechTargetDiv.innerHTML = targetMechName;
  }

  var teamStatsContainerId = function(team) {
    return team + "TeamStatsContainer";
  }
  var teamStatsId = function(team) {
    return team + "-teamStatsPanel";
  }
  var addMechButtonId = function(team) {
    return team + "-addMechButton";
  }
  var teamDisplayName = function(team) {
    let displayNameMap = {"blue" : "Blue team", "red" : "Red team"};
    return displayNameMap[team];
  }
  var addMechButtonMap = {};
  var addTeamStatsPanel = function(team) {
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    $("#teamStats-template")
      .clone(true)
      .attr("id", teamStatsId(team))
      .attr("data-team", team)
      .removeClass("template")
      .addClass(team)
      .appendTo("#" + teamStatsContainerPanelId);
    //Change team name
    $("#" + teamStatsContainerPanelId + " [class~=teamName]")
            .html(teamDisplayName(team));

    //Add mech button
    //TODO: add click handler to add mech button
    let addMechButtonPanelId = addMechButtonId(team);
    if (!addMechButtonHandler) {
      addMechButtonHandler = new AddMechButtonHandler(this);
    }
    $("#" + teamStatsContainerPanelId + " [class~=addMechButton]")
        .attr("id", addMechButtonPanelId)
        .attr("data-team", team);
    addMechButtonMap[team] = new MechButton(addMechButtonPanelId, addMechButtonHandler);
  }
  var AddMechButtonHandler = function(clickContext) {
    var context = clickContext;
    return function() {
      let team = $(this).data('team');
      context.showAddMechDialog(team);
    }
  }
  var addMechButtonHandler;//set on click handler assignment

  var updateTeamStats = function(team) {
    //TODO: Implement
  }

  const MODAL_SCREEN_ID = "mechModalScreen";
  const MODAL_DIALOG_ID = "mechModalDialog";
  var addMechOKButton;
  var addMechCancelButton;
  var addMechLoadButton;
  var showAddMechDialog = function(team) {
    $("#" + MODAL_DIALOG_ID).empty();
    $("#addMechDialog-template")
      .clone(true)
      .attr("id", "addMechDialogContainer")
      .removeClass("template")
      .appendTo("#" + MODAL_DIALOG_ID);

    if (!addMechDialog_OK_Handler) {
      addMechDialog_OK_Handler = new AddMechDialog_OK(this);
    }
    if (!addMechDialog_Cancel_Handler) {
      addMechDialog_Cancel_Handler = new AddMechDialog_Cancel(this);
    }
    if (!addMechDialog_Load_Handler) {
      addMechDialog_Load_Handler =new AddMechDialog_Load(this);
    }
    $("#addMechDialog-ok").attr("data-team", team);
    addMechOKButton =
        new MechButton("addMechDialog-ok", addMechDialog_OK_Handler);
    $("#addMechDialog-cancel").attr("data-team", team);
    addMechCancelButton =
        new MechButton("addMechDialog-cancel", addMechDialog_Cancel_Handler);
    $("#addMechDialog-load").attr("data-team", team);
    addMechLoadButton =
        new MechButton("addMechDialog-load", addMechDialog_Load_Handler);

    addMechOKButton.disable();

    $("#" + MODAL_SCREEN_ID).css("display", "block");

    $("#addMechDialog-text").focus();
  }

  var hideAddMechDialog = function(team) {
    $("#" + MODAL_SCREEN_ID).css("display", "none");
    $("#" + MODAL_DIALOG_ID).empty();
  }

  var AddMechDialog_OK = function(context) {
    var clickContext = context;
    return function() {
      let team = $(this).data('team');
      let url = $("#addMechDialog-text").val()
      console.log("Ok. team: " + team + " URL: " + url);
      let smurfyMechLoadout = MechView.loadedSmurfyLoadout;
      let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
      let mechTranslatedName = smurfyMechData.translated_name;
      let mechName = smurfyMechData.name;
      let newMechId = MechModel.generateMechId(team, MechView.loadedSmurfyLoadout);
      MechModel.addMech(newMechId, team, smurfyMechLoadout);
      MechModelView.refreshView(); //TODO: Too heavyweight to redo all panels, just add one mechpanel instead
      clickContext.hideAddMechDialog(team);
    }
  };
  var addMechDialog_OK_Handler; //set on dialog creation, singleton

  var AddMechDialog_Cancel = function(context) {
    var clickContext = context;
    return function() {
      let team = $(this).data('team');
      clickContext.hideAddMechDialog(team);
    }
  };
  var addMechDialog_Cancel_Handler; //set on dialog creation, singleton

  const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
  var AddMechDialog_Load = function(context) {
    var clickContext = context;

    return function() {
      let team = $(this).data('team');
      let url = $("#addMechDialog-text").val();
      console.log("Load. team: " + team + " URL: " + url);

      let doneCallback = function(data) {
        MechView.loadedSmurfyLoadout = data;
        let smurfyMechData = MechModel.getSmurfyMechData(MechView.loadedSmurfyLoadout.mech_id);
        let mechTranslatedName = smurfyMechData.translated_name;
        let mechName = smurfyMechData.name;
        //TODO: put fancy summary of loaded mech in result pane
        $("#addMechDialog-result")
            .removeClass("error")
            .html("Loaded " + mechTranslatedName);
        addMechOKButton.enable();
      };
      let failCallback = function(data) {
        $("#addMechDialog-result")
            .addClass("error")
            .html("Failed to load " + smurfyLoadoutURL);
      };
      let alwaysCallback = function(data) {
        addMechLoadButton.enable();
        addMechLoadButton.removeClass("loading");
        addMechLoadButton.setHtml("Load");
      };
      let status = MechModel.loadSmurfyMechLoadoutFromURL(url, doneCallback, failCallback, alwaysCallback);
      if (status) {
        $("#addMechDialog-result")
              .removeClass("error")
              .html("Loading url : " + url);
        addMechLoadButton.disable();
        addMechLoadButton.addClass("loading");
        addMechLoadButton.setHtml("Loading...");
      } else {
        $("#addMechDialog-result")
            .addClass("error")
            .html("Invalid smurfy URL. Expected format is 'http://mwo.smurfy-net.de/mechlab#i=mechid&l=loadoutid'");
        addMechLoadButton.enable();
        addMechLoadButton.removeClass("loading");
        addMechLoadButton.setHtml("Load");
        console.log("Invalid smurfy url");
      }
    }
  }
  var addMechDialog_Load_Handler; //set on dialog creation, singleton

  var clear = function (team) {
    let teamMechPanelId = team + "Team";
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    $("#" + teamMechPanelId).empty();
    $("#" + teamStatsContainerPanelId).empty();
  }

  var clearAll = function () {
    clear("blue");
    clear("red");
  }

  var updateSimTime = function(simTime) {
    $("#simTime").html("Sim time: " + simTime + "ms");
  }

  var setDebugText = function(debugText) {
    $("#debugText").html(debugText);
  }

  var initHandlers = function () {
    initPaperDollHandlers();
  }

  var onMouseOverPaperDoll = function () {
    var mechId = $(this).parent().data("mech-id");
    var location = $(this).data('location');
    //TODO: Implement onmouseover
  }

  var initPaperDollHandlers = function () {
    //attach onmouseover handler to each of the components
    $("#paperDoll-template > [class^=mech]").mouseover(onMouseOverPaperDoll);
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

    //TODO add paper doll and paperdoll animation interval
    $("#" + MODAL_SCREEN_ID).css("display", "block");
  }

  var hideLoadingScreen = function() {
    $("#" + MODAL_SCREEN_ID).css("display", "none");
    $("#" + MODAL_DIALOG_ID).empty();
    window.clearInterval(loadingScreenAnimateInterval);
  }

  //public members
  return {
    setPaperDollArmor : setPaperDollArmor,
    setPaperDollStructure : setPaperDollStructure,
    setHeatbarValue : setHeatbarValue,
    addMechPanel : addMechPanel,
    addTeamStatsPanel : addTeamStatsPanel,
    initPaperDollHandlers: initPaperDollHandlers,
    initHandlers : initHandlers,
    setWeaponCooldown: setWeaponCooldown,
    setWeaponAmmo : setWeaponAmmo,
    setWeaponState : setWeaponState,
    updateMechHealthNumbers : updateMechHealthNumbers,
    updateMechStatusPanel : updateMechStatusPanel,
    updateHeat: updateHeat,
    updateTeamStats : updateTeamStats,
    updateSimTime : updateSimTime,
    setDebugText : setDebugText,
    clear : clear,
    clearAll : clearAll,
    showAddMechDialog: showAddMechDialog,
    hideAddMechDialog: hideAddMechDialog,
    loadedSmurfyLoadout: null,
    showLoadingScreen : showLoadingScreen,
    hideLoadingScreen : hideLoadingScreen,
  };
})();//namespace
