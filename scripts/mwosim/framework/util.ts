"use strict";

namespace Util {
  export type AnyFunction = (...params : any[]) => any;

  //returns index of matching entry, otherwise returns the closest lower entry in
  //the array
  //TODO: See if this method is still worth it
  export function binarySearchClosest(array : any[],
                                  key : any,
                                  keyCompare : (v1: any, v2: any) => number) {
    var low = 0;
    var high = array.length - 1;
    var mid = Math.floor(low + ((high - low) / 2));
    var midVal = array[mid];

    while (low <= high) {
      mid = Math.floor(low + ((high - low) / 2));
      midVal = array[mid];

      if (keyCompare(key, midVal) < 0) {
        high = mid - 1;
      } else if (keyCompare(key, midVal) > 0) {
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

  export class StringLogger {
    private logStr : string;
    constructor() {
      this.logStr = "";
    }
    log(msg : any) {
      this.logStr += `${msg}\n`;
    }
    warn(msg : any) {
      let err = Error(msg);
      this.logStr += `${msg}: ${err.stack}\n`;
    }
    error(msg: any) {
      let err = Error(msg);
      this.logStr += `${msg}: ${err.stack}\n`;
    }
    clear() {
      this.logStr = "";
    }
    getLog() {
      return this.logStr;
    }
  }

  export var getParamFromLocationHash = function(param : string) : string {
    let fragmentHash = location.hash;
    if (fragmentHash.startsWith("#")) {
      fragmentHash = fragmentHash.substring(1);
    }
    fragmentHash = "&" + fragmentHash;
    let regex = new RegExp(".*&" + param + "=([^&]*).*");
    let results = regex.exec(fragmentHash);
    if (results) {
      return results[1];
    } else {
      return null;
    }
  }

  let DEFAULT_DEBUG = true;
  var isDebug = function() {
    let debug = getParamFromLocationHash("debug");
    if (debug) {
      return debug === 'true';
    } else {
      return DEFAULT_DEBUG;
    }
  }

  export var log = function(msg? : any, ...optionalParams : any[]) {
    if (isDebug()) {
      console.log(msg, ...optionalParams);
    }
  }

  export var warn = function(msg? : any, ...optionalParams : any[]){
    if (isDebug()) {
      console.warn(msg, ...optionalParams);
    }
  }

  export var error = function(msg? : any, ...optionalParams : any[]) {
    if (isDebug()) {
      console.error(msg, ...optionalParams);
    }
  }
}
