/// <reference path="../scripts/lib/jquery-3.2.d.ts" />

import {StoreValue} from "storevalue";

let testInterval : number;
let testCtr : number = 0;
const TestIntervalDuration : number = 20;
const TestDiv = "storedElemTest";
let testRunning = false;
export var testStoredElem = function() {
  let testJQ = $("#storedElemTest");
  if (!testInterval) {
    testInterval = window.setInterval(function() {
      if (!testRunning) {
        return;
      }

      let newDivJQ = $("<span></span>").addClass("testSpan").text(testCtr);
      let newDiv = newDivJQ.get(0);
      StoreValue.storeToElement(newDiv, "testKey", new LargeClass(testCtr, 10000));
      testJQ.append(newDiv);

      if (testCtr % 100 === 0) {
        testJQ.empty(); //clearing this should trigger garbage collection
      }

      let storedVal : LargeClass = StoreValue.getFromElement(newDiv, "testKey");
      console.log(storedVal.getId());

      testCtr++;
    }, TestIntervalDuration);

    $("#storedElemTestButton").click(function() {
      toggleTest();
    })
  }
}

var toggleTest = function() {
  testRunning = !testRunning;
}

class LargeClass {
  largeArray : any[];
  id : number;
  constructor(id : number, size : number) {
    this.id = id;
    this.largeArray = new Array(size);
    for (let i = 0; i < size; i++) {
      this.largeArray[i] = i;
    }
  }

  getId() : number {
    return this.id;
  }
}
