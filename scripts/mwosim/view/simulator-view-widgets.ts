"use strict";

//Widget design policy: No logic in HTML, no layout in Javascript.
//Javascript only provides behavior, it does NOT generate HTML unless it's from a template.
//On the converse side, HTML should not contain direct references to javascript entities
//(e.g. class constructors, methods). Makes it possible to do cosmetic and layout
//changes purely in HTML and CSS, and you keep out ugly unmaintainable HTML
//text strings out of javascript.
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

  export type ClickHandler = () => void;

  //Widgets that are stored in the dom using StoreValue.storeToElement
  //Would be better as a mixin, but initializing mixin classes is still syntactically messy,
  //so keep it a superclass
  export abstract class DomStoredWidget implements DomElementWidget {
    domElement : Element;
    constructor(domElement : Element) {
      this.domElement = domElement;
      //TODO: forcing storage in the constructor means that the DomKey must be passed 
      //through the entire chain of constructors in descendant classes. See about changing
      //the contract so that the descendant classes explicitly call storeToElement if
      //they want to be stored in the DOM. DomStoredWidget then just becomes a marker
      //'interface' to classes that may have at least one of their parents stored to dom.
      //This will also allow multiple Symbol property assignments to the element, one for each
      //class that wants to be stored in the DOM
    }

    //This method should be called by child constructors after the super call if they want to store
    //a reference to themselves in the domElement.
    storeToDom(DomKey : string) {
      DomStorage.storeToElement(this.domElement, DomKey, this);

      //marker attribute to make it visible in the element tree that there's an
      //object stored in the Element
      //NOTE: browsers automatically lowercase attribute names (at least chrome does)
      //We explicitly lowercase DomKey here to make that obvious so we don't try to
      //unset the attribute with a non-lowercase name
      this.domElement.setAttribute("data-symbol-" + DomKey.toLowerCase(), this.toString())
    }

    
    static fromDom<T extends DomStoredWidget>(domElement : Element, DomKey : string) : T {
      let ret : any = DomStorage.getFromElement(domElement, DomKey);
      return ret; //NOTE: Would be better with an instanceof check, but since T isn't really a value can't do that here
    }
  }

  export class Button extends DomStoredWidget {
    //NOTE: Can't use the same variable name for static objects in descendants because the child
    //fields will clobber the parent's field. 
    static readonly ButtonDomKey = "mwosim.Button.uiObject";
    clickHandler : Util.AnyFunction;
    enabled : boolean;
    constructor(domElement : Element, clickHandler : Util.AnyFunction) {
      super(domElement);
      this.storeToDom(Button.ButtonDomKey);
      this.clickHandler = (function(context) {
          var clickContext = context;
          return function(event : any) {
            if (clickContext.enabled) {
              if (clickHandler) {
                clickHandler.call(event.currentTarget);
              }
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

  export class ExpandButton extends Button {
    private static readonly ExpandButtonDomKey = "mwosim.ExpandButton.uiObject";
    elementsToExpand : Element[];
    constructor(domElement : Element, clickHandler : Util.AnyFunction, ...elementsToExpand : Element[]) {
      super(domElement, clickHandler);
      this.storeToDom(ExpandButton.ExpandButtonDomKey);
      if (elementsToExpand) {
        this.elementsToExpand = elementsToExpand;
      } else {
        this.elementsToExpand = [];
      }

      $(domElement).click(() => {
        if (!this.enabled) {
          return;
        }
        if (!this.expanded) {
          this.domElement.classList.add("expanded");
          for (let elementToExpand of this.elementsToExpand) {
            elementToExpand.classList.add("expanded");
          }
        } else {
          this.domElement.classList.remove("expanded");
          for (let elementToExpand of this.elementsToExpand) {
            elementToExpand.classList.remove("expanded");
          }
        }
      });
    }

    get expanded() {
      return this.domElement.classList.contains("expanded");
    }
  }

  export class Tooltip extends DomStoredWidget {
    static readonly TooltipDomKey = "mwosim.Tooltip.uiObject";
    id : string;
    domElement : Element;
    constructor(templateId : string,
                tooltipId : string,
                targetElement : Element) {
      let domElement = MechViewWidgets.cloneTemplate(templateId);
      super(domElement);
      this.storeToDom(Tooltip.TooltipDomKey);
      this.id = tooltipId;
      $(this.domElement)
        .addClass("tooltip")
        .addClass("hidden")
        .attr("id", tooltipId)
        .insertBefore(targetElement);
    }

    showTooltip() {
      $("#" + this.id).removeClass("hidden");
    }

    hideTooltip() {
      $("#" + this.id).addClass("hidden");
    }

  }

  export interface RenderedWidget {
    render : () => void;
  }
  export interface DomElementWidget {
    domElement : Element;
  }
  export interface Tab {
    tabTitle : RenderedWidget & DomElementWidget,
    tabContent : RenderedWidget & DomElementWidget,
  }

  export class TabPanel extends DomStoredWidget {
    private static readonly TabPanelDomKey = "mwosim.TabPanel.uiObject";
    private tabList : Tab[];
    private selectedTab : Tab;
    //TODO: Try to see if it is possible to specify the layout of tab panels
    //completely in HTML without code generation
    constructor(tabList : Tab[]) {
      let domElement = cloneTemplate("tabpanel-template");
      super(domElement);
      this.storeToDom(TabPanel.TabPanelDomKey);
      this.tabList = tabList;

      if (tabList.length > 0) {
        this.selectedTab = this.tabList[0];
      }
    }

    render() {
      for (let tab of this.tabList) {
        this.renderTab(tab);
      }
    }

    private renderTab(tab : Tab) {
      let tabTitlesJQ = $(this.domElement).find(".tabTitleContainer");
      let tabContentsJQ = $(this.domElement).find(".tabContentContainer")
      tab.tabTitle.render();
      tab.tabTitle.domElement.classList.add("tabTitle");
      tabTitlesJQ.append(tab.tabTitle.domElement);
      tab.tabContent.render();
      tab.tabContent.domElement.classList.add("tabContent");
      if (this.selectedTab === tab) {
        this.setSelected(tab, false);
      } else {
        this.unsetSelected(tab);
      }

      $(tab.tabTitle.domElement).click(() => {
        this.setSelected(tab);
      });

      tabContentsJQ.append(tab.tabContent.domElement);
    }

    private setSelected(tab: Tab, deselectOthers = true) : void {
      this.selectedTab = tab;
      tab.tabTitle.domElement.classList.add("selected");
      tab.tabContent.domElement.classList.remove("hidden");
      if (deselectOthers) {
        for (let currTab of this.tabList) {
          if (currTab !== tab) {
            this.unsetSelected(currTab);
          }
        }
      }
    }

    private unsetSelected(tab: Tab) {
      tab.tabTitle.domElement.classList.remove("selected");
      tab.tabContent.domElement.classList.add("hidden");
    }
  }

  export class SimpleWidget extends DomStoredWidget implements RenderedWidget {
    private static readonly SimpleWidgetDomKey = "mwosim.SimpleWidget.uiObject";
    constructor(templateId : string) {
      let domElement = cloneTemplate(templateId);
      super(domElement);
      this.storeToDom(SimpleWidget.SimpleWidgetDomKey);
    }

    render() {
      //do nothing
    }
  }

  export abstract class LoadFromURLDialog extends MechViewWidgets.DomStoredWidget {
    static readonly DomKey = "mwosim.LoadFromURLDialog.uiObject";
    okButton: Button;
    cancelButton: Button;
    loadButton: Button;
    dialogId: string;
    constructor(loadDialogTemplate: string, dialogId: string) {
      let loadDialogDiv = MechViewWidgets.cloneTemplate(loadDialogTemplate);
      super(loadDialogDiv);
      this.storeToDom(LoadFromURLDialog.DomKey);

      this.dialogId = dialogId;
      let thisJQ = $(loadDialogDiv)
        .attr("id", dialogId);

      let resultPanelJQ = thisJQ.find(".resultPanel");
      resultPanelJQ
        .removeClass("error")
        .empty()
        .on("animationend", function (data) {
          resultPanelJQ.removeClass("error");
          resultPanelJQ.off("animationend");
        });

      let okButtonHandler = this.createOkButtonHandler(this);
      let cancelButtonHandler = this.createCancelButtonHandler(this);
      let loadButtonHandler = this.createLoadButtonHandler(this);

      let okButtonJQ = thisJQ.find(".okButton");
      this.okButton =
        new MechViewWidgets.Button(okButtonJQ.get(0), okButtonHandler);

      let cancelButtonJQ = thisJQ.find(".cancelButton");
      this.cancelButton =
        new MechViewWidgets.Button(cancelButtonJQ.get(0), cancelButtonHandler);

      let loadButtonJQ = thisJQ.find(".loadButton");
      this.loadButton =
        new MechViewWidgets.Button(loadButtonJQ.get(0), loadButtonHandler);

      this.okButton.disable();
    }

    abstract createOkButtonHandler(dialog: LoadFromURLDialog): ClickHandler;
    abstract createCancelButtonHandler(dialog: LoadFromURLDialog): ClickHandler;
    abstract createLoadButtonHandler(dialog: LoadFromURLDialog): ClickHandler;

    getTextInput(): Element {
      return $(this.domElement).find(".textInput").get(0);
    }

    getTextInputValue(): string {
      return $(this.domElement).find(".textInput").val() as string;
    }

    getResultPanel(): Element {
      return $(this.domElement).find(".resultPanel").get(0);
    }

    setLoading(loading : boolean) {
      if (loading) {
        this.loadButton.disable();
        this.loadButton.addClass("loading");
        this.loadButton.setHtml("Loading...");
      } else {
        this.loadButton.enable();
        this.loadButton.removeClass("loading");
        this.loadButton.setHtml("Load");
      }
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
