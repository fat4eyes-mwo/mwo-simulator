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
  var teamMechPipsContainerId = function(team) {
    return team + "-mechPipsContainer";
  }
  var teamMechPipId = function(mechId) {
    return mechId + "-mechPip";
  }
  var teamLiveMechsId = function(team) {
    return team + "-liveMechs";
  }
  var teamHealthValueId = function(team) {
    return team + "-teamHealthValue";
  }
  var teamDamageId = function(team) {
    return team + "-teamDamage";
  }
  var teamDPSValueId = function(team) {
    return team + "-teamDPSValue";
  }
  var teamBurstDamageId = function(team) {
    return team + "-teamBurstDamage";
  }
  var teamSettingsButtonId = function(team) {
    return team + "-teamSettingsButton"
  }
  var teamSettingsId = function(team) {
    return team + "-teamSettings";
  }
  var addMechButtonMap = {};
  var addTeamStatsPanel = function(team, mechIds) {
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
    let addMechButtonPanelId = addMechButtonId(team);
    if (!addMechButtonHandler) {
      addMechButtonHandler = new AddMechButtonHandler(this);
    }
    $("#" + teamStatsContainerPanelId + " [class~=addMechButton]")
        .attr("id", addMechButtonPanelId)
        .attr("data-team", team);
    addMechButtonMap[team] = new MechButton(addMechButtonPanelId, addMechButtonHandler);

    //mech pips
    let teamMechPipsContainerDivId = teamMechPipsContainerId(team);
    $("#" + teamStatsContainerPanelId + " [class~=mechPipsContainer]")
        .attr("id", teamMechPipsContainerDivId);
    for (let mechId of mechIds) {
      $("#mechPip-template")
        .clone(true)
        .attr("id", teamMechPipId(mechId))
        .attr("data-team", team)
        .attr("data-mech-id", mechId)
        .removeClass("template")
        .appendTo("#" + teamMechPipsContainerDivId);
      //TODO: click handler on pip
    }
    //Mech health (liveMechs and teamHealthValue)
    $("#" + teamStatsContainerPanelId + " [class~=liveMechs]")
      .attr("id", teamLiveMechsId(team));
    $("#" + teamStatsContainerPanelId + " [class~=teamHealthValue]")
      .attr("id", teamHealthValueId(team));
    //teamDMG
    $("#" + teamStatsContainerPanelId + " [class~=teamDamageValue]")
      .attr("id", teamDamageId(team));
    //teamDPS
    $("#" + teamStatsContainerPanelId + " [class~=teamDPSValue]")
      .attr("id", teamDPSValueId(team));
    //teamBurstDamage
    $("#" + teamStatsContainerPanelId + " [class~=teamBurstDamageValue]")
      .attr("id", teamBurstDamageId(team));
    //team settings
    $("#" + teamStatsContainerPanelId + " [class~=teamSettingsButton]")
      .attr("data-team", team)
      .attr("id", teamSettingsButtonId(team))
      .click(teamSettingsButtonHandler);
    $("#" + teamStatsContainerPanelId + " [class~=teamSettings]")
      .attr("data-team", team)
      .attr("id", teamSettingsId(team));
    //Populate the team settings panel
    for (let patternType of patternTypes) {
      populateTeamPattern(team, patternType);
    }
  }

  //store selected value (since we do a lot of refreshViews which recreates this panel)
  var patternTypes;
  //values used to initialize the contents of the team settings panel.
  var initPatternTypes = function() {
    patternTypes = [
      {
        id : "teamTargetMechComponent",
        //function that returns the patternList for the type
        patternsFunction : MechTargetComponent.getPatterns,
        //prefix of the css class name for the UI divs for the patterntype
        classNamePrefix: "teamTargetMechComponent",
        //function used to assign the pattern to MechModel.Mech objects
        setTeamPatternFunction : MechModelView.setTeamComponentTargetPattern,
      },
      {
        id : "teamFirePattern",
        patternsFunction : MechFirePattern.getPatterns,
        classNamePrefix: "teamFirePattern",
        setTeamPatternFunction : MechModelView.setTeamFirePattern,
      },
      {
        id : "teamTargetMechPattern",
        patternsFunction : MechTargetMech.getPatterns,
        classNamePrefix: "teamTargetMechPattern",
        setTeamPatternFunction : MechModelView.setTeamMechTargetPattern,
      },
      {
        id : "teamAccuracy",
        patternsFunction : MechAccuracyPattern.getPatterns,
        classNamePrefix: "teamAccuracy",
        setTeamPatternFunction : MechModelView.setTeamAccuracyPattern,
      },
    ];
  }

  var selectedPatterns = {}; //format is {<team>: {<patternTypeId>: <pattern>, ...}}
  var patternLists = {} //format is {<patternTypeId>: [patternList]}

  var findPatternWithId = function(patternId, patternList) {
    for (let entry of patternList) {
      if (entry.id === patternId) {
        return entry.pattern;
      }
    }
    return null;
  }
  var findPatternTypeWithId = function(patternTypeId) {
    for (let patternType of patternTypes) {
      if (patternType.id === patternTypeId) {
        return patternType;
      }
    }
    return null;
  }
  var populateTeamPattern = function(team, patternType) {
    if (!patternLists[patternType.id]) {
      patternLists[patternType.id] = patternType.patternsFunction();
    }

    let teamStatsContainerPanelId = teamStatsContainerId(team);
    let teamPatternValueJQ =
      $("#" + teamStatsContainerPanelId + " [class~=" + patternType.classNamePrefix + "Value]");

    let teamPatternDescJQ =
      $("#" + teamStatsContainerPanelId + " [class~=" + patternType.classNamePrefix + "Desc]")

    teamPatternValueJQ.empty();
    selectedPatterns[team] = selectedPatterns[team] ? selectedPatterns[team] : {};
    let selectedPattern = selectedPatterns[team][patternType.id];
    for (let patternEntry of patternLists[patternType.id]) {
      $("<option></option>")
        .attr("value", patternEntry.id)
        .attr("data-description", patternEntry.description)
        .html(patternEntry.name)
        .appendTo(teamPatternValueJQ);

        //if it is the currently selected pattern
        if (selectedPatterns[team][patternType.id] === patternEntry.id) {
          teamPatternValueJQ.val(patternEntry.id);
          teamPatternDescJQ.html(patternEntry.description);
        }
        //if default and no selected pattern, set it as the selected pattern
        if (patternEntry.default && !selectedPattern) {
          teamPatternValueJQ.val(patternEntry.id);
          teamPatternDescJQ.html(patternEntry.description);
          selectedPatterns[team][patternType.id]  = patternEntry.id;
        }
    }
    //change handler
    teamPatternValueJQ.on('change', (data) => {
      let selectedValue=teamPatternValueJQ.val();
      let selectedOption = teamPatternValueJQ.find("[value='" + selectedValue + "']");

      teamPatternDescJQ.html(selectedOption.attr("data-description"));
      selectedPatterns[team][patternType.id] = selectedValue;

      let pattern = findPatternWithId(selectedValue, patternLists[patternType.id]);
      patternType.setTeamPatternFunction(team, pattern);
    });
  }

  //assigns the selected patterns for the given team
  var setSelectedTeamPatterns = function(team) {
    let currSelectedPatterns = selectedPatterns[team];
    for (let patternTypeId in currSelectedPatterns) {
      let patternType = findPatternTypeWithId(patternTypeId);
      let patternId = currSelectedPatterns[patternTypeId];
      let pattern = findPatternWithId(patternId, patternLists[patternType.id]);
      patternType.setTeamPatternFunction(team, pattern);
    }
  }

  var teamSettingsButtonHandler = function() {
    let team = $(this).attr("data-team");
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    let teamSettingsJQ =
      $("#" + teamStatsContainerPanelId + " [class~=teamSettings]");
    let teamSettingsArrowJQ =
      $("#" + teamStatsContainerPanelId + " [class~=teamSettingsButtonArrow]");
    if (teamSettingsJQ.hasClass("expanded")) {
      teamSettingsJQ.removeClass("expanded");
      teamSettingsArrowJQ.removeClass("expanded");
    } else {
      teamSettingsJQ.addClass("expanded");
      teamSettingsArrowJQ.addClass("expanded");
    }
  }

  var AddMechButtonHandler = function(clickContext) {
    var context = clickContext;
    return function() {
      let team = $(this).data('team');
      context.showAddMechDialog(team);
    }
  }
  var addMechButtonHandler;//set on click handler assignment

  var updateTeamStats = function(team, mechHealthList, damage, dps, burstDamage) {
    let totalTeamCurrHealth = 0;
    let totalTeamMaxHealth = 0;
    let liveMechs = 0;
    for (let mechHealth of mechHealthList) {
      let mechId = mechHealth.mechId;
      let currHealth = mechHealth.currHealth;
      let maxHealth = mechHealth.maxHealth;
      let isAlive = mechHealth.isAlive;

      let mechPipDiv = document.getElementById(teamMechPipId(mechId));
      let percentHealth = Number(currHealth) / Number(maxHealth);

      let color = damageColor(percentHealth, healthDamageGradient);
      mechPipDiv.style.color = color;
      if (isAlive) {
        mechPipDiv.innerHTML = "&#9632;";
      } else {
        mechPipDiv.innerHTML = "&#9633;";
      }

      liveMechs += isAlive ? 1 : 0;
      totalTeamCurrHealth += isAlive ? currHealth : 0;
      totalTeamMaxHealth += maxHealth;
    }
    //live mechs
    let liveMechsDiv = document.getElementById(teamLiveMechsId(team));
    let totalMechs = mechHealthList.length;
    let percentAlive = totalMechs > 0 ? liveMechs / totalMechs : 0;
    let color = damageColor(percentAlive, healthDamageGradient);
    liveMechsDiv.style.color = color;
    liveMechsDiv.innerHTML = liveMechs + "/" + totalMechs;

    //team health
    let healthValueDiv = document.getElementById(teamHealthValueId(team));
    let teamHealthPercent = totalTeamMaxHealth > 0 ?
            totalTeamCurrHealth / totalTeamMaxHealth : 0;
    color = damageColor(teamHealthPercent, healthDamageGradient);
    healthValueDiv.style.color = color;
    healthValueDiv.innerHTML = "(" + Number(teamHealthPercent * 100).toFixed(1) + "%)";

    //damage
    let teamDamageDiv = document.getElementById(teamDamageId(team));
    teamDamageDiv.innerHTML = Number(damage).toFixed(1);
    //dps
    let teamDPSValueDiv = document.getElementById(teamDPSValueId(team));
    teamDPSValueDiv.innerHTML = Number(dps).toFixed(1);
    //burst
    let teamBurstDamageDiv = document.getElementById(teamBurstDamageId(team));
    teamBurstDamageDiv.innerHTML = Number(burstDamage).toFixed(1);
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
      .addClass(team)
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
      console.log("Mech loaded. team: " + team + " URL: " + url);
      //TODO: Avoid accessing MechModel directly here. Create a method in ModelView to do this
      let smurfyMechLoadout = MechView.loadedSmurfyLoadout;
      let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
      let mechTranslatedName = smurfyMechData.translated_name;
      let mechName = smurfyMechData.name;
      let newMechId = MechModel.generateMechId(team, MechView.loadedSmurfyLoadout);
      MechModel.addMech(newMechId, team, smurfyMechLoadout);
      //TODO: set patterns of added mech to selected team patterns
      setSelectedTeamPatterns(team);
      MechViewRouter.modifyAppState();
      //TODO: should not require a full view refresh. See what can be done.
      MechModelView.refreshView(true);
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
            .html("Failed to load " + url);
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
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    $("#" + teamMechPanelId).empty();
    $("#" + teamStatsContainerPanelId).empty();
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

  var initHandlers = function () {
    initPaperDollHandlers();
  }

  var initView = function() {
    initPatternTypes();
    initRangeInput();
    initSpeedControl();
    initStateControl();
    initMiscControl();
  }

  var initRangeInput = function() {
    let rangeButton = new MechButton("setRangeButton", function() {
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
        $(this)
          .attr("data-button-mode", "not-editing")
          .html("Change");
      } else {
        throw "Invalid button state";
      }
    });
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
      //TODO: doesn't need to refresh entire view, see what can be isolated
      MechModelView.refreshView(false);
    });

    $("#showReportDivButton").click(() => {
      MechView.showVictoryReport();
    });
  }

  var initMiscControl = function() {
    $("#permalinkButton").click(() => {
      MechViewRouter.saveAppState(
        function(data) {
          //TODO: Show dialog containing the current URL
          console.log("Success on save app state. Data: " + data);
        },
        function(data) {
          console.log("Fail on save app state. Data: " + data);
        },
        function(data) {
          console.log("Done save app state. Data: " + data);
        });
    });
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

  var teamReportPanelId = function(team) {
    return team + "ReportContainer";
  }
  var showVictoryReport = function() {
    $("#" + MODAL_DIALOG_ID)
      .addClass("wide")
      .empty();
    $("#victoryReport-template")
      .clone(true)
      .attr("id", "victoryReport")
      .removeClass("template")
      .appendTo("#" + MODAL_DIALOG_ID);

    $("#victoryReport [class~=closeReportButton]")
      .click(() => {
        MechView.hideVictoryReport();
      });

    //TODO: Implement
    let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
    for (let team of teamList) {
      addTeamReport(team, teamReportPanelId(team));
    }

    $("#" + MODAL_SCREEN_ID).css("display", "block");
  }

  var addTeamReport = function(team, reportPanelId) {
    let teamReport = MechModelView.getTeamReport(team);
    let teamWeaponStats = teamReport.getWeaponStats();
    console.log("debug");
  }

  var hideVictoryReport = function() {
    $("#" + MODAL_SCREEN_ID).css("display", "none");
    $("#" + MODAL_DIALOG_ID).removeClass("wide").empty();
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
    initView : initView,
    setWeaponCooldown: setWeaponCooldown,
    setWeaponAmmo : setWeaponAmmo,
    setWeaponState : setWeaponState,
    updateMechHealthNumbers : updateMechHealthNumbers,
    updateMechStatusPanel : updateMechStatusPanel,
    updateMechTitlePanel : updateMechTitlePanel,
    updateHeat: updateHeat,
    updateTeamStats : updateTeamStats,
    updateSimTime : updateSimTime,
    updateControlPanel: updateControlPanel,
    setDebugText : setDebugText,
    clear : clear,
    clearAll : clearAll,
    showAddMechDialog: showAddMechDialog,
    hideAddMechDialog: hideAddMechDialog,
    showLoadingScreen : showLoadingScreen,
    updateLoadingScreenProgress: updateLoadingScreenProgress,
    hideLoadingScreen : hideLoadingScreen,
    showVictoryReport : showVictoryReport,
    hideVictoryReport: hideVictoryReport,

    //functions that should be private but I need to acceess (usually in handlers)
    loadedSmurfyLoadout: null,
  };
})();//namespace
