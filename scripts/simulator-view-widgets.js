"use strict";

var MechViewWidgets = MechViewWidgets || (function() {
  class Tooltip {
    constructor(templateId, tooltipId, targetElementId) {
      this.id = tooltipId;
      $("#" + templateId)
        .clone(true)
        .removeClass("template")
        .addClass("tooltip")
        .addClass("hidden")
        .attr("id", tooltipId)
        .insertAfter("#" + targetElementId);
      let targetOffset = $("#" + targetElementId);
      let thisLeft = targetOffset.left;
      let thisTop = targetOffset.top + targetOffset.height;
      $("#" + this.id)
        .css({"left": thisLeft, "top" : thisTop});
    }

    showTooltip() {
      $("#" + this.id).removeClass("hidden");
    }

    hideTooltip() {
      $("#" + this.id).addClass("hidden");
    }
  }

  return {
    Tooltip : Tooltip,
  }
})();
