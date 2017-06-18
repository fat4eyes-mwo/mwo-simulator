"use strict";

function main() {

  initPaperDollHandlers();

  var newIds = ["blue1", "blue2", "blue3", "blue4"];
  $.each(newIds, (index, newId) => {
    addPaperDoll(newId, "#blueMechs");
  });

  newIds = ["red1", "red2", "red3"];
  $.each(newIds, (index, newId) => {
    addPaperDoll(newId, "#redMechs");
  });
}

$(document).ready(main);
