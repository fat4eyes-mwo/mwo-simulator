"use strict";

//UI methods
var MechView = MechView || (function() {

  // Paper doll UI functions
  //Color gradient for damage percentages. Must be in sorted ascending order
  const damageGradient = Object.freeze([
    {value : 0.0, RGB : 0x15130c},
    {value : 0.1, RGB : 0xb32a12},
    {value : 0.2, RGB : 0xb53a13},
    {value : 0.3, RGB : 0xb84b16},
    {value : 0.4, RGB : 0xba5c17},
    {value : 0.5, RGB : 0xbd6d1a},
    {value : 0.6, RGB : 0xbc761a},
    {value : 0.7, RGB : 0xbc7e1a},
    {value : 0.8, RGB : 0xbc851a},
    {value : 0.9, RGB : 0xbb8e1a},
    {value : 1, RGB : 0x403720}
  ]);

  //gets the damage color for a given percentage of damage
  var damageColor = function (percent) {
    var damageIdx = binarySearchClosest(
            damageGradient, percent, (key, colorValue) => {
      return key - colorValue.value;
    });
    if (damageIdx == -1) {
      damageIdx = 0;
    }
    return damageGradient[damageIdx].RGB;
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
      .appendTo(paperDollContainer);
  }

  //Percent values from 0 to 1
  var setPaperDollArmor = function (mechId, location, percent) {
    var color = damageColor(percent);
    let query = "#" + paperDollId(mechId) + "> [data-location='" + location + "']";
    $(query)
      .css('border-color', "#" + color.toString(16));
  }
  var setPaperDollStructure = function (mechId, location, percent) {
    var color = damageColor(percent);
    let query = "#" + paperDollId(mechId) + "> [data-location='" + location + "']";
    $(query)
      .css('background-color', "#" + color.toString(16));
  }

  var updatePaperDoll = function(mech){
    let mechId = mech.getMechId();
    let mechHealth = mech.getMechState().mechHealth;
    for (let mechComponentHealth of mechHealth.componentHealth) {
      let location = mechComponentHealth.location;
      let armorPercent = Number(mechComponentHealth.armor) / Number(mechComponentHealth.maxArmor);
      let structurePercent = Number(mechComponentHealth.structure) / Number(mechComponentHealth.maxStructure);
      setPaperDollArmor(mechId, location, armorPercent);
      setPaperDollStructure(mechId, location, structurePercent);
    }
  }

  var mechHealthNumbersId = function (mechId) {
    return mechId + "-mechHealthNumbers";
  }
  var addMechHealthNumbers = function (mech, mechHealthNumbersContainer) {
    $("#mechHealthNumbers-template").
      clone(true)
      .attr("id", mechHealthNumbersId(mech.getMechId()))
      .attr("data-mech-id", mech.getMechId())
      .removeClass("template")
      .appendTo(mechHealthNumbersContainer);
    updateMechHealthNumbers(mech);
  }

  var updateMechHealthNumbers = function (mech) {
    let mechHealthNumbersDivId = "#" + mechHealthNumbersId(mech.getMechId());
    let mechHealth = mech.getMechState().mechHealth;
    for (let mechComponentHealth of mechHealth.componentHealth) {
      $(mechHealthNumbersDivId +
        " [data-location=" + mechComponentHealth.location + "] " +
        " [data-healthtype=armor]").html(Math.floor(mechComponentHealth.armor));
      $(mechHealthNumbersDivId +
        " [data-location=" + mechComponentHealth.location + "] " +
        " [data-healthtype=structure]").html(Math.floor(mechComponentHealth.structure));
    }
  }

  //Heatbar UI functions
  var heatbarId = function (mechId) {
    return mechId + "-heatbar";
  }
  var addHeatbar = function (mechId, heatbarContainer) {
    $("#heatbar-template").
    clone(true)
    .attr("id", heatbarId(mechId))
    .attr("data-mech-id", mechId)
    .removeClass("template")
    .appendTo(heatbarContainer);
  }
  //Sets the heatbar value for a given mech id to a specified percentage. Value of
  //percent is 0 to 1
  var setHeatbarValue = function (mechId, percent) {
    var invPercent = 1 - percent;
    $("#" + heatbarId(mechId) + " > [class=heatbar]")
      .height( (100 * invPercent) + "%");
  }

  var updateHeat = function(mech) {
    let heatState = mech.getMechState().heatState;
    let heatPercent = Number(heatState.currHeat) / Number(heatState.currMaxHeat);
    setHeatbarValue(mech.getMechId(), heatPercent);

    var heatNumberId = mech.getMechId() + "-heatbarNumber";
    let heatText = parseFloat(heatPercent * 100).toFixed(0) + "%" +
                    "(" + parseFloat(heatState.currHeat).toFixed(1) + ")";
    $("#" + heatNumberId).html(heatText);
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
    $("#" + weaponCooldownBarId(mechId, weaponIdx)).width(100*percent + "%");
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
    addPaperDoll(mechId, "#" + paperDollContainerId);
    updatePaperDoll(mech);

    var mechHealthNumbersId = mechId + "-mechHealthNumbers";
    $("#" + mechPanelId(mechId) + " [class~='mechHealthNumbers']")
      .attr("id", mechHealthNumbersId);
    addMechHealthNumbers(mech, "#" + mechHealthNumbersId);

    var heatbarContainerId = mechId + "-heatbarContainer";
    $("#" + mechPanelId(mechId) + " [class~='heatbarContainer']")
      .attr("id", heatbarContainerId);
    addHeatbar(mechId, "#" + heatbarContainerId);

    var heatNumberId = mechId + "-heatbarNumber";
    $("#" + mechPanelId(mechId) + " [class~='heatNumber']")
      .attr("id", heatNumberId);

    updateHeat(mech);

    var weaponPanelContainerId = mechId + "-weaponPanelContainer";
    $("#" + mechPanelId(mechId) + " [class~='weaponPanelContainer']")
      .attr("id", weaponPanelContainerId);
    addWeaponPanel(mechId, weaponStateList, ammoState, "#" + weaponPanelContainerId);

    var mechNamePanelId = mechId + "-mechName";
    $("#" + mechPanelId(mechId) + " [class~='statusPanel'] [class~='mechName']")
      .attr("id", mechNamePanelId)
      .html(mech.getMechInfo().mechTranslatedName);
  }

  var clear = function (team) {
    let teamId = team + "Team";
    $("#" + teamId).empty();
  }

  var clearAll = function () {
    clear("blue");
    clear("red");
  }

  var updateSimTime = function(simTime) {
    $("#simTime").html("Sim time: " + simTime);
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

  //public members
  return {
    setPaperDollArmor : setPaperDollArmor,
    setPaperDollStructure : setPaperDollStructure,
    setHeatbarValue : setHeatbarValue,
    addMechPanel : addMechPanel,
    initPaperDollHandlers: initPaperDollHandlers,
    initHandlers : initHandlers,
    setWeaponCooldown: setWeaponCooldown,
    setWeaponAmmo : setWeaponAmmo,
    setWeaponState : setWeaponState,
    updatePaperDoll : updatePaperDoll,
    updateMechHealthNumbers : updateMechHealthNumbers,
    updateHeat: updateHeat,
    updateSimTime : updateSimTime,
    clear : clear,
    clearAll : clearAll
  };
})();//namespace
