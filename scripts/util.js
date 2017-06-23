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

class Deque {
  constructor() {
    this.queue = {};
    this.startIdx = 0;
    this.endIdx = -1;
  }

  isEmpty() {
    return this.endIdx < this.startIdx;
  }

  addFirst(obj) {
    this.startIdx--;
    this.queue[this.startIdx] = obj;
  }

  addLast(obj) {
    this.endIdx++;
    this.queue[this.endIdx] = obj;
  }

  removeFirst() {
    if (this.isEmpty()) throw "Deque is empty";
    let ret = this.queue[this.startIdx];
    this.queue[this.startIdx] = undefined;
    this.startIdx++;
    return ret;
  }

  removeLast() {
    if (this.isEmpty()) throw "Deque is empty";
    let ret = this.queue[this.endIdx];
    this.queue[this.endIdx] = undefined;
    this.endIdx--;
    return ret;
  }

  iterator() {
    return (() => {
      var startIdx = this.startIdx;
      var endIdx = this.endIdx;
      var queue = this.queue;

      return {
        next : () => {
          let ret = queue[startIdx];
          startIdx++;
          return ret;
        },
        hasNext : () => {
          return startIdx <= endIdx;
        }
      }
    })();
  }

  toString() {
    let ret = "";
    for (let i = this.startIdx; i <= this.endIdx; i++) {
      ret = ret + " " + this.queue[i].toString();
    }
    return ret;
  }
}
