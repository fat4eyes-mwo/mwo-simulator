"use strict";

function main() {
  initHandlers();
  test();
}

$(document).ready(main);


//Test code
var uiTestInterval = null;
function test() {
  var blueIds = ["blue1", "blue2", "blue3", "blue4"];
  var components = ["head", "right_arm", "right_torso", "centre_torso", "left_arm", "left_torso", "right_leg", "left_leg"];

  $.each(blueIds, (index, newId) => {
    addMechPanel(newId, "#blueMechs");
  });
  testUI(blueIds);

  var redIds = ["red1", "red2", "red3"];
  $.each(redIds, (index, newId) => {
    addMechPanel(newId, "#redMechs");
  });
  testUI(redIds);

  $("#testUI").click(() => {
    if (uiTestInterval == null) {
      uiTestInterval = window.setInterval(() => {
        testUI(blueIds);
        testUI(redIds);
      }, 100);
    } else {
      window.clearInterval(uiTestInterval);
      uiTestInterval = null;
    }
  })
}

function testUI(mechIds) {
  var components = ["head", "right_arm", "right_torso", "centre_torso", "left_arm", "left_torso", "right_leg", "left_leg"];
  $.each(mechIds, (index, newId) => {
    for (var idx in components) {
      setPaperDollArmor(newId, components[idx], Math.random());
      setPaperDollStructure(newId, components[idx], Math.random());
    }
    setHeatbarValue(newId, Math.random());
  });
}
