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
  export var testClassname = function() {
    let b = new B();
    let c = new C();
    let bb = new BB();
    let cc = new CC();
    console.log(`b: ${b.constructor.name}`);
    console.log(`c: ${c.constructor.name}`);
    console.log(`bb: ${bb.constructor.name}`);
    console.log(`cc: ${cc.constructor.name}`);
  }
}