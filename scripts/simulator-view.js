"use strict";

var MechView = MechView || (function() {

  // Paper doll UI functions
  //Color gradient for damage percentages. Must be in sorted ascending order
  var damageGradient = [
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
  ];

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
    $("#" + paperDollId(mechId) + "> [data-location='" + location + "']")
      .css('border-color', "#" + color.toString(16));
  }
  var setPaperDollStructure = function (mechId, location, percent) {
    var color = damageColor(percent);
    $("#" + paperDollId(mechId) + "> [data-location='" + location + "']")
      .css('background-color', "#" + color.toString(16));
  }
  var setMaxArmorAndStructure = function (mechId) {
    var components = ["head", "right_arm", "right_torso", "centre_torso", "left_arm", "left_torso", "right_leg", "left_leg"];
    for (var idx in components) {
      setPaperDollArmor(mechId, components[idx], 1);
      setPaperDollStructure(mechId, components[idx], 1);
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

  //Adds a list of weaponRows to the given weaponPanel. Prototype of weaponList is
  //[(name, location, ammo, state)] where state is Active, Firing or Disabled
  var WeaponData = function (name, location, ammo, state) {
    this.name = name;
    this.location = location;
    this.ammo = ammo;
    this.state = state;
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
  var weaponLocAbbr = {
    "head" : "H",
    "left_arm" : "LA",
    "left_torso" : "LT",
    "centre_torso" : "CT",
    "right_torso" : "RT",
    "right_arm" : "RA",
    "left_leg" : "LL",
    "right_leg" : "RL"
  }
  var addWeaponPanel = function (mechId, weaponList, weaponPanel) {
    for (var idx in weaponList) {
      var weapon = weaponList[idx];
      $("#weaponRow-template")
        .clone(true)
        .attr("id", weaponRowId(mechId, idx))
        .attr("data-mech-id", mechId)
        .attr("data-weapon-idx", idx)
        .removeClass("template")
        .appendTo(weaponPanel);
      $("#" + weaponRowId(mechId, idx) + " .weaponName")
        .attr("id", weaponRowId(mechId, idx) + "-weaponName")
        .html(weapon.name);
      $("#" + weaponRowId(mechId, idx) + " .weaponLocation")
        .attr("id", weaponRowId(mechId, idx) + "-weaponLocation")
        .html(weaponLocAbbr[weapon.location]);
      $("#" + weaponRowId(mechId, idx) + " .weaponCooldownBar")
        .attr("id", weaponCooldownBarId(mechId, idx));
      $("#" + weaponRowId(mechId, idx) + " .weaponAmmo")
        .attr("id", weaponAmmoId(mechId, idx)); //infinity symbol
      setWeaponAmmo(mechId, idx, weapon.ammo);
      setWeaponState(mechId, idx, weapon.state);
    }
  }
  var setWeaponCooldown = function (mechId, weaponIdx, percent) {
    $("#" + weaponCooldownBarId(mechId, weaponIdx)).width(100*percent + "%");
  }
  var setWeaponAmmo = function (mechId, weaponIdx, ammo) {
    $("#" + weaponAmmoId(mechId, weaponIdx)).html(ammo != -1 ? ammo : "&#x221e;");
  }
  var setWeaponState = function (mechId, weaponIdx, state) {
    $("#" + weaponRowId(mechId, weaponIdx)).removeClass("Active Firing Disabled");
    $("#" + weaponRowId(mechId, weaponIdx)).addClass(state);
  }

  //adds a mech panel (which contains a paperDoll, a heatbar and a weaponPanel)
  var mechPanelId = function (mechId) {
    return mechId + "-mechPanel";
  }
  var addMechPanel = function (mechId, weaponList, mechPanelList) {
    $("#mechPanel-template")
      .clone(true)
      .attr("id", mechPanelId(mechId))
      .attr("data-mech-id", mechId)
      .removeClass("template")
      .appendTo(mechPanelList);

    //TODO: messy repetitive code to add paperDoll and heatbar. Try to see if this
    //can be done inside a single search for the children of the mechPanel
    var paperDollContainerId = mechId + "-paperDollContainer";
    $("#" + mechPanelId(mechId) + " [class~='paperDollContainer']")
      .attr("id", paperDollContainerId);
    addPaperDoll(mechId, "#" + paperDollContainerId);
    setMaxArmorAndStructure(mechId);

    var heatbarContainerId = mechId + "-heatbarContainer";
    $("#" + mechPanelId(mechId) + " [class~='heatbarContainer']")
      .attr("id", heatbarContainerId);
    addHeatbar(mechId, "#" + heatbarContainerId);

    var weaponPanelContainerId = mechId + "-weaponPanelContainer";
    $("#" + mechPanelId(mechId) + " [class~='weaponPanelContainer']")
      .attr("id", weaponPanelContainerId);
    addWeaponPanel(mechId, weaponList, "#" + weaponPanelContainerId);
  }

  var initHandlers = function () {
    initPaperDollHandlers();
  }

  var onMouseOverPaperDoll = function () {
    var mechId = $(this).parent().data("mech-id");
    var location = $(this).data('location');
    console.log (mechId + " " + location);
  }

  var initPaperDollHandlers = function () {
    //attach onmouseover handlers to each of the components
    $("#paperDoll-template > [class^=mech]").mouseover(onMouseOverPaperDoll);
  }

  //public memebers
  return {
    setPaperDollArmor : setPaperDollArmor,
    setPaperDollStructure : setPaperDollStructure,
    setMaxArmorAndStructure : setMaxArmorAndStructure,
    setHeatbarValue : setHeatbarValue,
    addMechPanel : addMechPanel,
    initPaperDollHandlers: initPaperDollHandlers,
    initHandlers : initHandlers,
    WeaponData : WeaponData,
    setWeaponCooldown: setWeaponCooldown,
    setWeaponAmmo : setWeaponAmmo,
    setWeaponState : setWeaponState
  };
})();//namespace
