
namespace DomStorage {
  //Stores an arbitrary value as a symbol indexed property in Element
  //Goal is to map DOM elements to the UI objects that represent them without
  //overly complicated bookkeeping in the app. Garbage collection seems to handle
  //circular references between an object and a deleted dom element well
  //(at least for chrome and firefox)

  //relies on the DOM being stable (e.g. the browser not replacing an Element with a copy,
  //which would lose our mapping). If this doesn't turn out to be so, you can still simulate
  //it using weakmaps.
  export var storeToElement = function (elem : Element, key : string, value : any) : any {
    let symbolKey = Symbol.for(key);
    let anyElem = elem as any;
    let prevValue = anyElem[symbolKey];
    anyElem[symbolKey] = value;
    return prevValue;
  }

  export var getFromElement = function(elem : Element, key : string) : any {
    if (!elem) {
      return null;
    }
    let symbolKey = Symbol.for(key);
    let anyElem = elem as any;
    return anyElem[symbolKey];
  }
}
