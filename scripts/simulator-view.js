"use strict";

//Add a paper doll with the given mechId to the panel with the id mechPanel
//uses the template paperDoll-template from the main HTML file


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
function damageColor(percent) {
  var damageIdx = binarySearchClosest(damageGradient, percent, (key, colorValue) => {
    return key - colorValue.value;
  });
  if (damageIdx == -1) {
    damageIdx = 0;
  }
  return damageGradient[damageIdx].RGB;
}

function paperDollId(mechId) {
  return mechId + "-paperDoll";
}

function addPaperDoll(mechId, mechPanel) {
  $("#paperDoll-template")
    .clone(true)
    .attr("id", paperDollId(mechId))
    .attr("data-mech-id", mechId)
    .removeClass("template")
    .appendTo(mechPanel);
}

//Percent values from 0 to 1
function setPaperDollArmor(mechId, location, percent) {
  var color = damageColor(percent);
  $("#" + paperDollId(mechId) + "> [data-location='" + location + "']").css('border-color', "#" + color.toString(16));
}
function setPaperDollStructure(mechId, location, percent) {
  var color = damageColor(percent);
  $("#" + paperDollId(mechId) + "> [data-location='" + location + "']").css('background-color', "#" + color.toString(16));
}

//Heatbar UI functions
function addHeatbar(mechId, mechPanel) {
  $("#heatbar-template").
  clone(true)
  .attr("id", mechId + "-heatbar")
  .attr("data-mech-id", mechId)
  .removeClass("template")
  .appendTo(mechPanel);
}

//Sets the heatbar value for a given mech id to a specified percentage. Value of
//percent is 0 to 1
function setHeatbarValue(mechId, percent) {
  var invPercent = 1 - percent;
  $("#" + mechId + "-heatbar > [class=heatbar]").height( (100 * invPercent) + "%");
}

function onMouseOverPaperDoll() {
  var mechId = $(this).parent().data("mech-id");
  var location = $(this).data('location');
  console.log (mechId + " " + location);
}


function initHandlers() {
  initPaperDollHandlers();
}

function initPaperDollHandlers() {
  //attach onmouseover handlers to each of the components
  $("#paperDoll-template > [class^=mech]").mouseover(onMouseOverPaperDoll);
}
