
export namespace DomStorage {
  export var storeToElement = function (elem : Element, key : string, value : any) : any {
    let symbolKey = Symbol.for(key);
    let anyElem = elem as any;
    let prevValue = anyElem[symbolKey];
    anyElem[symbolKey] = value;
    return prevValue;
  }

  export var getFromElement = function(elem : Element, key : string) : any {
    let symbolKey = Symbol.for(key);
    let anyElem = elem as any;
    return anyElem[symbolKey];
  }
}
