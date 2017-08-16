/// <reference path="../scripts/lib/jquery-3.2.d.ts" />
export namespace TouchTest {
  export var touchTest = function() {
    $("#touch1")
      .on("touchstart", touchStart)
      .on("touchend", touchEnd)
      .on("touchcancel", touchCancel)
      .on("touchmove", touchMove);
  }

  var touchStart = function(this: Element, data : JQuery.Event) {
    console.log(`touchStart ${this.id} : ${data}`);
  }

  var touchEnd = function(this: Element, data : JQuery.Event) {
    console.log(`touchEnd ${this.id} : ${data}`);
  }

  var touchCancel = function(this: Element, data : JQuery.Event) {
    console.log(`touchCancel ${this.id} : ${data}`);
  }

  var currDropTarget : Element;
  var touchMove = function(this: Element, data : JQuery.Event) {
    // console.log(`touchMove ${this.id} : ${data}`);
    let touchEvent = data.originalEvent as TouchEvent;
    let touch = touchEvent.touches[0];
    let touchTargetElem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (currDropTarget !== touchTargetElem) {
      console.log("Touch drop target: " + touchTargetElem.id);
      currDropTarget = touchTargetElem;
    }
  }
}