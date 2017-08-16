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
    showTouchIcon(data.originalEvent as TouchEvent);
  }

  var touchEnd = function(this: Element, data : JQuery.Event) {
    console.log(`touchEnd ${this.id} : ${data}`);
    let touchEvent = data.originalEvent as TouchEvent;
    console.log("Drop target: " + currDropTarget.id);
    hideTouchIcon(data.originalEvent as TouchEvent);
  }

  var touchCancel = function(this: Element, data : JQuery.Event) {
    console.log(`touchCancel ${this.id} : ${data}`);
    hideTouchIcon(data.originalEvent as TouchEvent);
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
    moveTouchIcon(data.originalEvent as TouchEvent);
  }

  var showTouchIcon = function(event : TouchEvent) {
    let touch = event.touches[0];
    let dragIcon = document.getElementById("touchDragIcon");
    if (dragIcon != null) {
      moveTouchIcon(event);
      dragIcon.classList.remove("hidden");
    }
  }

  var moveTouchIcon = function(event : TouchEvent) {
    let touch = event.touches[0];
    let dragIcon = document.getElementById("touchDragIcon");
    if (dragIcon != null) {
      let left = Math.floor(touch.clientX).toString() + "px";
      let top = Math.floor(touch.clientY).toString() + "px";
      dragIcon.style.left = left;
      dragIcon.style.top = top;
    }
  }

  var hideTouchIcon = function(event : TouchEvent) {
    let touch = event.touches[0];
    let dragIcon = document.getElementById("touchDragIcon");
    if (dragIcon != null) {
      dragIcon.classList.add("hidden");
    }
  }
}