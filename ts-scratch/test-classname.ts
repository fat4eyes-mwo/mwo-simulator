export namespace TestClassname {
  abstract class A {
    constructor() {
    }
  }
  class B extends A {
    constructor() {
      super();
    }
  }

  class C extends A {
    constructor() {
      super();
    }
  }
  class BB extends B {
    constructor() {
      super();
    }
  }
  class CC extends C {
    constructor() {
      super();
    }
  }

  //TODO: see if you can tighten the type of c. It should be (Object | ClassDecl), 
  //if there is any such thing in typescript
  var getClassname = function(c : any) {
    if (typeof c === 'function') {
      if (c.prototype && c.prototype.constructor) {
        return c.prototype.constructor.name;
      } else {
        return null;
      }
    } else if (typeof c === 'object') {
      if (c.constructor) {
        return c.constructor.name;
      } else {
        return null;
      }
    }
    return null;
  }
  export var testClassname = function() {
    let b = new B();
    let c = new C();
    let bb = new BB();
    let cc = new CC();
    console.log(`b: ${getClassname(b)} ${getClassname(B)}`);
    console.log(`c: ${getClassname(c)} ${getClassname(C)}`);
    console.log(`bb: ${getClassname(bb)} ${getClassname(BB)}`);
    console.log(`cc: ${getClassname(cc)} ${getClassname(CC)}`);
  }
}