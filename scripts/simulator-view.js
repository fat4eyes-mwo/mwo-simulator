"use strict";

//Add a paper doll with the given mechId to the panel with the id mechPanel
//uses the template paperDoll-template from the main HTML file
function addPaperDoll(mechId, mechPanel) {
  $("#paperDoll-template")
    .clone(true)
    .attr("id",mechId)
    .attr("data-mech-id", mechId)
    .removeClass("template")
    .appendTo(mechPanel);
}

function onMouseOverPaperDoll() {
  var mechId = $(this).parent().data("mech-id");
  var location = $(this).data('location');
  console.log (mechId + " " + location);
}

function initPaperDollHandlers() {
  //attach onmouseover handlers to each of the components
  $("#paperDoll-template > [class^=mech]").mouseover(onMouseOverPaperDoll);
}
