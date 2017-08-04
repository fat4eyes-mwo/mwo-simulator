"use strict";

namespace MechViewWidgets {
  // Paper doll UI functions
  //Color gradient for damage percentages. Must be in sorted ascending order
  type ColorGradient = ColorGradientEntry[];
  export interface ColorGradientEntry {
    value : number;
    RGB : RGBEntry;
  }
  export interface RGBEntry {
    r : number, g : number, b : number,
  }
  export const paperDollDamageGradient : ColorGradient = [
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
  ];
  //Colors for health numbers
  export const healthDamageGradient : ColorGradient = [
    {value : 0.0, RGB : {r: 230, g:20, b:20}},
    {value : 0.7, RGB : {r: 230, g:230, b:20}},
    // {value : 0.9, RGB : {r:20, g:230, b:20}},
    {value : 0.9, RGB : {r:255, g:235, b:24}},
    {value : 1, RGB : {r:170, g:170, b:170}}
  ];
  //Colors for individual component health numbers
  export const componentHealthDamageGradient : ColorGradient = [
    {value : 0.0, RGB : {r: 255, g:0, b:0}},
    {value : 0.7, RGB : {r:255, g:255, b:0}},
    // {value : 0.9, RGB : {r:0, g:255, b:0}},
    {value : 0.9, RGB : {r:255, g:235, b:24}},
    {value : 1, RGB : {r:170, g:170, b:170}}
  ];

  //gets the damage color for a given percentage of damage
  export var damageColor = function (percent : number,
                              damageGradient : ColorGradient)
                              : string {
    var damageIdx = Util.binarySearchClosest(
            damageGradient, percent, (key, colorValue) => {
      return key - colorValue.value;
    });
    if (damageIdx === -1) {
      damageIdx = 0;
    }
    let nextIdx = damageIdx + 1;
    nextIdx = (nextIdx < damageGradient.length) ? nextIdx : damageIdx;
    let rgb = damageGradient[damageIdx].RGB;
    let nextRgb = damageGradient[nextIdx].RGB;
    let percentDiff = (damageIdx !== nextIdx) ?
        (percent - damageGradient[damageIdx].value) /
            (damageGradient[nextIdx].value - damageGradient[damageIdx].value)
        : 1;
    let red = Math.round(Number(rgb.r) + (Number(nextRgb.r) - Number(rgb.r)) * percentDiff);
    let green = Math.round(Number(rgb.g) + (Number(nextRgb.g) - Number(rgb.g)) * percentDiff);
    let blue = Math.round(Number(rgb.b) + (Number(nextRgb.b) - Number(rgb.b)) * percentDiff);
    return "rgb(" + red + ","  + green + "," + blue + ")";
  }

  export class MechButton {
    domElement : Element;
    clickHandler : Util.AnyFunction;
    enabled : boolean;
    constructor(domElement : Element, clickHandler : Util.AnyFunction) {
      this.domElement = domElement;
      this.clickHandler = (function(context) {
          var clickContext = context;
          return function(event : any) {
            if (clickContext.enabled) {
              clickHandler.call(event.currentTarget);
            }
          }
      })(this);
      this.enabled = true;
      $(this.domElement).click(this.clickHandler);
    }

    setHtml(html : string) : void {
      $(this.domElement).html(html);
    }

    addClass(className : string) : void {
      $(this.domElement).addClass(className)
    }

    removeClass(className : string) : void {
      $(this.domElement).removeClass(className);
    }

    disable() : void {
      if (this.enabled) {
        $(this.domElement).addClass("disabled");
        this.enabled = false;
      }
    }

    enable() : void {
      if (!this.enabled) {
        $(this.domElement).removeClass("disabled");
        this.enabled = true;
      }
    }
  }

  export class Tooltip {
    id : string;
    domElement : Element;
    constructor(templateId : string,
                tooltipId : string,
                targetElement : Element) {
      this.id = tooltipId;
      this.domElement = MechViewWidgets.cloneTemplate(templateId);
      $(this.domElement)
        .addClass("tooltip")
        .addClass("hidden")
        .attr("id", tooltipId)
        .insertBefore(targetElement);
      //TODO Fix absolutely positioned tooltip location
      // let targetElement = $("#" + targetElementId)[0];
      // let thisLeft = targetElement.offsetLeft;
      // let thisTop = targetElement.offsetTop + targetElement.offsetHeight;
      // $("#" + this.id)
      //   .css({"left": thisLeft, "top" : thisTop});
    }

    showTooltip() {
      $("#" + this.id).removeClass("hidden");
    }

    hideTooltip() {
      $("#" + this.id).addClass("hidden");
    }
  }

  //Clones a template and returns the first element of the template
  export var cloneTemplate = function(templateName : string) : Element {
    let template : HTMLTemplateElement =
        document.querySelector("#" + templateName) as HTMLTemplateElement;
    let templateElement = document.importNode(template.content, true);
    return templateElement.firstElementChild;
  }

  const MODAL_SCREEN_ID = "mechModalScreen";
  const MODAL_DIALOG_ID = "mechModalDialog";

  //sets the content of the modal dialog to element, while optionally adding
  //a class to the dialog container
  export var setModal =
      function(element : Element, dialogClass : string = null) : void {
    let dialogJQ = $("#" + MODAL_DIALOG_ID);
    dialogJQ.empty();
    if (dialogClass) {
      dialogJQ.addClass(dialogClass);
    }
    dialogJQ.append(element);
  }

  export var showModal = function() : void {
    $("#" + MODAL_SCREEN_ID).css("display", "block");
  }

  //hides the modal dialog, while optionally removing a class from the dialog
  //container
  export var hideModal = function(dialogClass : string = null) : void {
    $("#" + MODAL_SCREEN_ID).css("display", "none");
    let dialogJQ = $("#" + MODAL_DIALOG_ID);
    dialogJQ.empty();
    if (dialogClass) {
      dialogJQ.removeClass(dialogClass);
    }
  }
}
