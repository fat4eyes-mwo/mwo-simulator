
export namespace StoreValue {
  //NOTE: elem should be an Element, but I can't get around the typescript errors
  //(was not allowing use of symbol as an index)
  export var storeToElement = function (elem : any, key : string, value : any) : any {
    let symbolKey = Symbol.for(key);
    let prevValue = elem[symbolKey];
    elem[symbolKey] = value;
    return prevValue;
  }

  export var getFromElement = function(elem : any, key : string) : any {
    let symbolKey = Symbol.for(key);
    return elem[symbolKey];
  }
}
