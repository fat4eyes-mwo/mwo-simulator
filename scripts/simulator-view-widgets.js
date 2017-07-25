"use strict";

var MechViewWidgets = MechViewWidgets || (function() {
  // Paper doll UI functions
  //Color gradient for damage percentages. Must be in sorted ascending order
  const paperDollDamageGradient = Object.freeze([
    {value : 0.0, RGB : {r: 28, g:22, b:6}},
    {value : 0.1, RGB : {r: 255, g:46, b:16}},
    {value : 0.2, RGB : {r: 255, g:73, b:20}},
    {value : 0.3, RGB : {r: 255, g:97, b:12}},
    {value : 0.4, RGB : {r: 255, g:164, b:22}},
    {value : 0.5, RGB : {r:255, g:176, b:18}},
    {value : 0.6, RGB : {r:255, g:198, b:24}},
    {value : 0.7, RGB : {r:255, g:211, b:23}},
    {value : 0.8, RGB : {r:255, g:224, b:28}},
    {value : 0.9, RGB : {r:255, g:235, b:24}},
    {value : 1, RGB : {r:101, g:79, b:38}}
  ]);
  //Colors for health numbers
  const healthDamageGradient = Object.freeze([
    {value : 0.0, RGB : {r: 230, g:20, b:20}},
    {value : 0.7, RGB : {r: 230, g:230, b:20}},
    // {value : 0.9, RGB : {r:20, g:230, b:20}},
    {value : 0.9, RGB : {r:255, g:235, b:24}},
    {value : 1, RGB : {r:170, g:170, b:170}}
  ]);
  //Colors for individual component health numbers
  const componentHealthDamageGradient = Object.freeze([
    {value : 0.0, RGB : {r: 255, g:0, b:0}},
    {value : 0.7, RGB : {r:255, g:255, b:0}},
    // {value : 0.9, RGB : {r:0, g:255, b:0}},
    {value : 0.9, RGB : {r:255, g:235, b:24}},
    {value : 1, RGB : {r:170, g:170, b:170}}
  ]);

  //gets the damage color for a given percentage of damage
  var damageColor = function (percent, damageGradient) {
    var damageIdx = binarySearchClosest(
            damageGradient, percent, (key, colorValue) => {
      return key - colorValue.value;
    });
    if (damageIdx == -1) {
      damageIdx = 0;
    }
    let nextIdx = damageIdx + 1;
    nextIdx = (nextIdx < damageGradient.length) ? nextIdx : damageIdx;
    let rgb = damageGradient[damageIdx].RGB;
    let nextRgb = damageGradient[nextIdx].RGB;
    let percentDiff = (damageIdx != nextIdx) ?
        (percent - damageGradient[damageIdx].value) /
            (damageGradient[nextIdx].value - damageGradient[damageIdx].value)
        : 1;
    let red = Math.round(Number(rgb.r) + (Number(nextRgb.r) - Number(rgb.r)) * percentDiff);
    let green = Math.round(Number(rgb.g) + (Number(nextRgb.g) - Number(rgb.g)) * percentDiff);
    let blue = Math.round(Number(rgb.b) + (Number(nextRgb.b) - Number(rgb.b)) * percentDiff);
    return "rgb(" + red + ","  + green + "," + blue + ")";
  }

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
        .insertBefore("#" + targetElementId);
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

  const MODAL_SCREEN_ID = "mechModalScreen";
  const MODAL_DIALOG_ID = "mechModalDialog";

  //sets the content of the modal dialog to element, while optionally adding
  //a class to the dialog container
  var setModal = function(element, dialogClass = null) {
    let dialogJQ = $("#" + MODAL_DIALOG_ID);
    dialogJQ.empty();
    if (dialogClass) {
      dialogJQ.addClass(dialogClass);
    }
    dialogJQ.append(element);
  }

  var showModal = function() {
    $("#" + MODAL_SCREEN_ID).css("display", "block");
  }

  //hides the modal dialog, while optionally removing a class from the dialog
  //container
  var hideModal = function(dialogClass = null) {
    $("#" + MODAL_SCREEN_ID).css("display", "none");
    let dialogJQ = $("#" + MODAL_DIALOG_ID);
    dialogJQ.empty();
    if (dialogClass) {
      dialogJQ.removeClass(dialogClass);
    }
  }

  return {
    damageColor : damageColor,
    healthDamageGradient: healthDamageGradient,
    componentHealthDamageGradient : componentHealthDamageGradient,
    paperDollDamageGradient : paperDollDamageGradient,
    Tooltip : Tooltip,
    MechButton: MechButton,
    cloneTemplate: cloneTemplate,
    setModal : setModal,
    showModal : showModal,
    hideModal : hideModal,
  }
})();
