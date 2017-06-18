"use strict";

function main() {
  initHandlers();
  test();
}

$(document).ready(main);

function test() {
  var newIds = ["blue1", "blue2", "blue3", "blue4"];
  var components = ["head", "right_arm", "right_torso", "centre_torso", "left_arm", "left_torso", "right_leg", "left_leg"];
  $.each(newIds, (index, newId) => {
    addPaperDoll(newId, "#blueMechs");
    var component = components[ Math.floor(components.length * Math.random()) ];
    setPaperDollArmor(newId, component, Math.random());
    setPaperDollStructure(newId, component, Math.random());
    addHeatbar(newId, "#blueMechs");
    setHeatbarValue(newId, Math.random());
  });

  newIds = ["red1", "red2", "red3"];
  $.each(newIds, (index, newId) => {
    addPaperDoll(newId, "#redMechs");
    addHeatbar(newId, "#redMechs");
    setHeatbarValue(newId, Math.random());
  });
}
