"use strict";

var MechViewWidgets = MechViewWidgets || (function() {

  class MechButton {
    constructor(id, clickHandler) {
      this.id = id;
      this.clickHandler = (function(context) {
          var clickContext = context;
          return function(event) {
            if (clickContext.enabled) {
              clickHandler.call(event.currentTarget);
            }
          }
      })(this);
      this.enabled = true;
      $("#" + this.id).click(this.clickHandler);
    }

    setHtml(html) {
      $("#" + this.id).html(html);
    }

    addClass(className) {
      $("#" + this.id).addClass(className)
    }

    removeClass(className) {
      $("#" + this.id).removeClass(className);
    }

    disable() {
      if (this.enabled) {
        $("#" + this.id).addClass("disabled");
        this.enabled = false;
      }
    }

    enable() {
      if (!this.enabled) {
        $("#" + this.id).removeClass("disabled");
        this.enabled = true;
      }
    }
  }

  class Tooltip {
    constructor(templateId, tooltipId, targetElementId) {
      this.id = tooltipId;
      let tooltipDiv = MechViewWidgets.cloneTemplate(templateId);
      $(tooltipDiv)
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

  //Clones a template and returns the first element of the template
  var cloneTemplate = function(templateName) {
    let template = document.querySelector("#" + templateName);
    let templateElement = document.importNode(template.content, true);
    return templateElement.firstElementChild;
  }

  return {
    Tooltip : Tooltip,
    MechButton: MechButton,
    cloneTemplate: cloneTemplate,
  }
})();
