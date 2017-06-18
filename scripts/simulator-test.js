"use strict";

//Test code
var uiTestInterval = null;
var testIntervalLength = 100;
var mechIdWeaponCount = []; //number of weapons set for a given mechid

function test() {
  var blueIds = ["blue1", "blue2", "blue3", "blue4", "blue5", "blue6", "blue7", "blue8", "blue9", "blue10", "blue11", "blue12"];
  var redIds = ["red1", "red2", "red3","red4", "red5", "red6", "red7", "red8", "red9", "red10", "red11", "red12",];
  var components = ["head", "right_arm", "right_torso", "centre_torso", "left_arm", "left_torso", "right_leg", "left_leg"];
  var testWeapons = [
    [
      {name : "SMALL PULSE LASER", location : "left_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "left_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "left_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "left_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "left_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "left_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "right_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "right_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "right_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "right_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "right_arm", ammo : "-1", state : "Active"},
      {name : "SMALL PULSE LASER", location : "right_arm", ammo : "-1", state : "Active"}
    ],
    [ {name : "MEDIUM LASER", location : "centre_torso", ammo : "-1", state: "Active"},
      {name : "MEDIUM LASER", location : "left_torso", ammo : "-1", state: "Active"},
      {name : "SRM6", location : "left_arm", ammo : "200"}
    ],
    [ {name : "ER LARGE LASER", location : "left_torso", ammo : "-1", state: "Active"},
      {name : "ER LARGE LASER", location : "right_torso", ammo : "-1", state: "Active"},
      {name : "AC 10", location : "right_torso", ammo : "80", state: "Active"},
      {name : "AC 5", location : "left_torso", ammo : "120", state: "Active"},
    ]
  ];

  $.each(blueIds, (index, mechId) => {
    var testWeaponList = testWeapons[Math.floor(testWeapons.length * Math.random())];
    addMechPanel(mechId, testWeaponList, "#blueMechs");
    mechIdWeaponCount[mechId] = testWeaponList.length;
  });
  // testUI(blueIds);

  $.each(redIds, (index, mechId) => {
    var testWeaponList = testWeapons[Math.floor(testWeapons.length * Math.random())];
    addMechPanel(mechId, testWeaponList, "#redMechs");
    mechIdWeaponCount[mechId] = testWeaponList.length;
  });
  // testUI(redIds);

  $("#testUI").click(() => {
    if (uiTestInterval == null) {
      uiTestInterval = window.setInterval(() => {
        testUI(blueIds);
        testUI(redIds);
      }, testIntervalLength);
    } else {
      window.clearInterval(uiTestInterval);
      uiTestInterval = null;
    }
  })
}

function testUI(mechIds) {
  var components = ["head", "right_arm", "right_torso", "centre_torso", "left_arm", "left_torso", "right_leg", "left_leg"];
  var weaponStates = ["Active", "Firing", "Disabled"];
  $.each(mechIds, (index, mechId) => {
    for (var idx in components) {
      setPaperDollArmor(mechId, components[idx], Math.random());
      setPaperDollStructure(mechId, components[idx], Math.random());
    }
    setHeatbarValue(mechId, Math.random());
    for (var i = 0; i < mechIdWeaponCount[mechId]; i++) {
      setWeaponCooldown(mechId, i, Math.random());
      setWeaponAmmo(mechId, i, Math.random() > 0.2 ? Math.floor(Math.random() * 100) : -1);
      setWeaponState(mechId, i, weaponStates[Math.floor(weaponStates.length * Math.random())]);
    }
  });
}
