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
    for (var idx in components) {
      setPaperDollArmor(newId, components[idx], 1 - (idx / components.length));
      setPaperDollStructure(newId, components[idx], idx/components.length);
    }
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
