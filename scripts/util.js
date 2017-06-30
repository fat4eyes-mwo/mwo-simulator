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
