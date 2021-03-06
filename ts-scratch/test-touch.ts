/// <reference path="../scripts/lib/jquery-3.2.d.ts" />
export namespace TouchTest {
  export var touchTest = function() {
    $("#touch1")
      .on("touchstart", touchStart)
      .on("touchend", touchEnd)
      .on("touchcancel", touchCancel)
      .on("touchmove", touchMove);

    $("#touch2")
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
    let currDropTarget = currDropTargetMap.get(touchEvent.target);
    let id = currDropTarget? currDropTarget.id : "undefined";
    console.log("Drop target: " + id + " source: " + (touchEvent.target as HTMLElement).id);
    hideTouchIcon(data.originalEvent as TouchEvent);
    if (currDropTarget) {
      let currDropTargetJQ = $(currDropTarget);
      currDropTargetJQ
        .removeClass("dropTarget")
        .addClass("flashSelected")
        .on("animationend", function() {
          currDropTargetJQ.removeClass("flashSelected")
          currDropTargetJQ.off("animationend");
        });
    }
  }

  var touchCancel = function(this: Element, data : JQuery.Event) {
    console.log(`touchCancel ${this.id} : ${data}`);
    hideTouchIcon(data.originalEvent as TouchEvent);
  }

  var currDropTargetMap = new Map<any, Element>();
  var touchMove = function(this: Element, data : JQuery.Event) {
    // console.log(`touchMove ${this.id} : ${data}`);
    let touchEvent = data.originalEvent as TouchEvent;
    touchEvent.preventDefault();
    let touch = touchEvent.touches[0];
    let touchTargetElem = document.elementFromPoint(touch.clientX, touch.clientY);
    let currDropTarget = currDropTargetMap.get(touchEvent.target);
    if (currDropTarget !== touchTargetElem) {
      console.log("Touch drop target: " + touchTargetElem.id);
      if (currDropTarget) {
        currDropTarget.classList.remove("dropTarget");
      }
      currDropTarget = touchTargetElem;
      currDropTargetMap.set(touchEvent.target, currDropTarget);
      currDropTarget.classList.add("dropTarget");
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