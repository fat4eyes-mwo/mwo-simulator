"use strict";

//returns index of matching entry, otherwise returns the closest lower entry in
//the array
function binarySearchClosest(array, key, keyCompare) {
  var low = 0;
  var high = array.length - 1;
  var mid = Math.floor(low + ((high - low) / 2));
  var midVal = array[mid];

  while (low <= high) {
    mid = Math.floor(low + ((high - low) / 2));
    midVal = array[mid];

    if (keyCompare(key, midVal) < 0){
      high = mid - 1;
    } else if (keyCompare(key, midVal) > 0){
      low = mid + 1;
    } else {
      return mid;
    }
  }

  if (keyCompare(key, midVal) < 0) {
    return Math.max(0, mid-1);
  } else {
    return mid;
  }
}

const TriggerState = {
  PENDING : "pending",
  DONE : "done"
}
const TriggerResult = {
  FAIL : "fail",
  SUCCESS : "success"
}
class TriggerEntry {
  constructor(state, result) {
    this.state = state;
    this.result = result;
  }
}
class Trigger {
  constructor(events) {
    this.eventMap = new Map();
    for (let eventIdx in events) {
      this.eventMap.set(events[eventIdx], new TriggerEntry(TriggerState.PENDING, null));
    }
  }
  setDone(event) {
    let entry = this.eventMap.get(event);
    if (!entry) {
      throw "Event not found in event map";
    }
    entry.state = TriggerState.DONE;
  }
  setFail(event) {
    let entry = this.eventMap.get(event);
    if (!event) {
      throw "Event not found in event map";
    }
    entry.result = TriggerResult.FAIL;
  }
  setSuccess(event) {
    let entry = this.eventMap.get(event);
    if (!event) {
      throw "Event not found in event map";
    }
    entry.result = TriggerResult.SUCCESS;
  }

  isDone() {
    for (let entry of this.eventMap.values()) {
      if (entry.state !== TriggerState.DONE) {
        return false;
      }
    }
    return true;
  }
  isSuccessful() {
    for (let entry of this.eventMap.values()) {
      if (entry.result !== TriggerResult.SUCCESS) {
        return false;
      }
    }
    return true;
  }
}
