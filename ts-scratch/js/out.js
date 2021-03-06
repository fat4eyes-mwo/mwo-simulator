System.register("moduleA", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function funcA(s) {
        let ret = "funcA(" + s + ")";
        console.log(ret);
        return ret;
    }
    exports_1("funcA", funcA);
    function setA(s) {
        exports_1("a", a = s);
    }
    exports_1("setA", setA);
    function getA() {
        return a;
    }
    exports_1("getA", getA);
    var a, constA;
    return {
        setters: [],
        execute: function () {
            exports_1("constA", constA = "foo A");
        }
    };
});
System.register("moduleB", ["moduleA"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function bfunc(s) {
        let ret = "bfunc(" + s + ")";
        console.log(ret);
        return ret;
    }
    exports_2("bfunc", bfunc);
    function getAfromB() {
        return ModuleA.getA();
    }
    exports_2("getAfromB", getAfromB);
    var ModuleA;
    return {
        setters: [
            function (ModuleA_1) {
                ModuleA = ModuleA_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("libtest/moduleC", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function funcC(s) {
        let ret = "funcC(" + s + ")";
        console.log(ret);
        return ret;
    }
    exports_3("funcC", funcC);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("domstorage", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var DomStorage;
    return {
        setters: [],
        execute: function () {
            (function (DomStorage) {
                DomStorage.storeToElement = function (elem, key, value) {
                    let symbolKey = Symbol.for(key);
                    let anyElem = elem;
                    let prevValue = anyElem[symbolKey];
                    anyElem[symbolKey] = value;
                    return prevValue;
                };
                DomStorage.getFromElement = function (elem, key) {
                    let symbolKey = Symbol.for(key);
                    let anyElem = elem;
                    return anyElem[symbolKey];
                };
            })(DomStorage || (DomStorage = {}));
            exports_4("DomStorage", DomStorage);
        }
    };
});
/// <reference path="../scripts/lib/jquery-3.2.d.ts" />
System.register("storedElemTest", ["domstorage"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var domstorage_1, testInterval, testCtr, TestIntervalDuration, TestDiv, testRunning, testStoredElem, toggleTest, LargeClass;
    return {
        setters: [
            function (domstorage_1_1) {
                domstorage_1 = domstorage_1_1;
            }
        ],
        execute: function () {
            testCtr = 0;
            TestIntervalDuration = 20;
            TestDiv = "storedElemTest";
            testRunning = false;
            exports_5("testStoredElem", testStoredElem = function () {
                let testJQ = $("#storedElemTest");
                if (!testInterval) {
                    testInterval = window.setInterval(function () {
                        if (!testRunning) {
                            return;
                        }
                        let newDivJQ = $("<span></span>").addClass("testSpan").text(testCtr);
                        let newDiv = newDivJQ.get(0);
                        domstorage_1.DomStorage.storeToElement(newDiv, "testKey", new LargeClass(testCtr, 10000));
                        testJQ.append(newDiv);
                        if (testCtr % 100 === 0) {
                            testJQ.empty(); //clearing this should trigger garbage collection
                        }
                        let storedVal = domstorage_1.DomStorage.getFromElement(newDiv, "testKey");
                        console.log(storedVal.getId());
                        testCtr++;
                    }, TestIntervalDuration);
                    $("#storedElemTestButton").click(function () {
                        toggleTest();
                    });
                }
            });
            toggleTest = function () {
                testRunning = !testRunning;
            };
            LargeClass = class LargeClass {
                constructor(id, size) {
                    this.id = id;
                    this.largeArray = new Array(size);
                    for (let i = 0; i < size; i++) {
                        this.largeArray[i] = i;
                    }
                }
                getId() {
                    return this.id;
                }
            };
        }
    };
});
System.register("test-touch", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var TouchTest;
    return {
        setters: [],
        execute: function () {
            /// <reference path="../scripts/lib/jquery-3.2.d.ts" />
            (function (TouchTest) {
                TouchTest.touchTest = function () {
                    $("#touch1")
                        .on("touchstart", touchStart)
                        .on("touchend", touchEnd)
                        .on("touchcancel", touchCancel)
                        .on("touchmove", touchMove);
                    $("#touch2")
                        .on("touchstart", touchStart)
                        .on("touchend", touchEnd)
                        .on("touchcancel", touchCancel)
                        .on("touchmove", touchMove);
                };
                var touchStart = function (data) {
                    console.log(`touchStart ${this.id} : ${data}`);
                    showTouchIcon(data.originalEvent);
                };
                var touchEnd = function (data) {
                    console.log(`touchEnd ${this.id} : ${data}`);
                    let touchEvent = data.originalEvent;
                    let currDropTarget = currDropTargetMap.get(touchEvent.target);
                    let id = currDropTarget ? currDropTarget.id : "undefined";
                    console.log("Drop target: " + id + " source: " + touchEvent.target.id);
                    hideTouchIcon(data.originalEvent);
                    if (currDropTarget) {
                        let currDropTargetJQ = $(currDropTarget);
                        currDropTargetJQ
                            .removeClass("dropTarget")
                            .addClass("flashSelected")
                            .on("animationend", function () {
                            currDropTargetJQ.removeClass("flashSelected");
                            currDropTargetJQ.off("animationend");
                        });
                    }
                };
                var touchCancel = function (data) {
                    console.log(`touchCancel ${this.id} : ${data}`);
                    hideTouchIcon(data.originalEvent);
                };
                var currDropTargetMap = new Map();
                var touchMove = function (data) {
                    // console.log(`touchMove ${this.id} : ${data}`);
                    let touchEvent = data.originalEvent;
                    touchEvent.preventDefault();
                    let touch = touchEvent.touches[0];
                    let touchTargetElem = document.elementFromPoint(touch.clientX, touch.clientY);
                    let currDropTarget = currDropTargetMap.get(touchEvent.target);
                    if (currDropTarget !== touchTargetElem) {
                        console.log("Touch drop target: " + touchTargetElem.id);
                        if (currDropTarget) {
                            currDropTarget.classList.remove("dropTarget");
                        }
                        currDropTarget = touchTargetElem;
                        currDropTargetMap.set(touchEvent.target, currDropTarget);
                        currDropTarget.classList.add("dropTarget");
                    }
                    moveTouchIcon(data.originalEvent);
                };
                var showTouchIcon = function (event) {
                    let touch = event.touches[0];
                    let dragIcon = document.getElementById("touchDragIcon");
                    if (dragIcon != null) {
                        moveTouchIcon(event);
                        dragIcon.classList.remove("hidden");
                    }
                };
                var moveTouchIcon = function (event) {
                    let touch = event.touches[0];
                    let dragIcon = document.getElementById("touchDragIcon");
                    if (dragIcon != null) {
                        let left = Math.floor(touch.clientX).toString() + "px";
                        let top = Math.floor(touch.clientY).toString() + "px";
                        dragIcon.style.left = left;
                        dragIcon.style.top = top;
                    }
                };
                var hideTouchIcon = function (event) {
                    let touch = event.touches[0];
                    let dragIcon = document.getElementById("touchDragIcon");
                    if (dragIcon != null) {
                        dragIcon.classList.add("hidden");
                    }
                };
            })(TouchTest || (TouchTest = {}));
            exports_6("TouchTest", TouchTest);
        }
    };
});
System.register("test-weakmap", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var WeakmapTest;
    return {
        setters: [],
        execute: function () {
            (function (WeakmapTest) {
                WeakmapTest.testWeakmap = function () {
                    let weakMap = new WeakMap();
                    let key1 = "foo";
                    weakMap.set(key1, 1);
                    //Weakmaps only accept objects as keys. bummer.
                    let key2 = "";
                    key2 += "foo";
                    weakMap.set(key2, 2);
                    console.log(`key ${key1} val ${weakMap.get(key1)}`);
                    console.log(`key ${key2} val ${weakMap.get(key2)}`);
                };
            })(WeakmapTest || (WeakmapTest = {}));
            exports_7("WeakmapTest", WeakmapTest);
        }
    };
});
System.register("test-classname", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var TestClassname;
    return {
        setters: [],
        execute: function () {
            (function (TestClassname) {
                class A {
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
                var getClassname = function (c) {
                    if (typeof c === 'function') {
                        if (c.prototype && c.prototype.constructor) {
                            return c.prototype.constructor.name;
                        }
                        else {
                            return null;
                        }
                    }
                    else if (typeof c === 'object') {
                        if (c.constructor) {
                            return c.constructor.name;
                        }
                        else {
                            return null;
                        }
                    }
                    return null;
                };
                TestClassname.testClassname = function () {
                    let b = new B();
                    let c = new C();
                    let bb = new BB();
                    let cc = new CC();
                    console.log(`b: ${getClassname(b)} ${getClassname(B)}`);
                    console.log(`c: ${getClassname(c)} ${getClassname(C)}`);
                    console.log(`bb: ${getClassname(bb)} ${getClassname(BB)}`);
                    console.log(`cc: ${getClassname(cc)} ${getClassname(CC)}`);
                };
            })(TestClassname || (TestClassname = {}));
            exports_8("TestClassname", TestClassname);
        }
    };
});
System.register("test-enum", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var TestEnum;
    return {
        setters: [],
        execute: function () {
            (function (TestEnum) {
                let Names;
                (function (Names) {
                    Names["FIRST"] = "First";
                    Names["LAST"] = "Last";
                })(Names || (Names = {}));
                //weird case, they transpile enums into namespace-like objects, so you can add more entries to the enum later
                //in a completely different location like so. Not sure if a bug or feature, 
                //it's too intentional to be an accident of implementation
                (function (Names) {
                    Names["MIDDLE"] = "Middle";
                })(Names || (Names = {}));
                let Flavors;
                (function (Flavors) {
                    Flavors["Up"] = "Up";
                    Flavors["Down"] = "Down";
                })(Flavors || (Flavors = {}));
                TestEnum.testEnum = function () {
                    let name;
                    let flavor;
                    name = Names.FIRST;
                    console.log(`${name} ${name.toString()}`);
                    name = Names.MIDDLE;
                    console.log(`${name} ${name.toString()}`);
                };
            })(TestEnum || (TestEnum = {}));
            exports_9("TestEnum", TestEnum);
        }
    };
});
System.register("main", ["moduleA", "moduleB", "libtest/moduleC", "storedElemTest", "test-touch", "test-classname", "test-enum"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    function main() {
        ModuleA.setA("a1");
        ModuleA2.setA("a2"); //Should set the same variable a in moduleA.js
        ModuleC.funcC("foo");
        $("#debugText").text("Hello again from typescript" + ModuleA.funcA("Foo") + ModuleB.bfunc("Bar") +
            ` ModuleA.a=${ModuleA.getA()}` + ` ModuleA2.a=${ModuleA2.getA()}` +
            ` ModuleB.getAFromB()=${ModuleB.getAfromB()}`);
        StoreElemTest.testStoredElem();
        test_touch_1.TouchTest.touchTest();
        test_classname_1.TestClassname.testClassname();
        test_enum_1.TestEnum.testEnum();
    }
    exports_10("main", main);
    var ModuleA, ModuleA2, ModuleB, ModuleC, StoreElemTest, test_touch_1, test_classname_1, test_enum_1, foo;
    return {
        setters: [
            function (ModuleA_2) {
                ModuleA = ModuleA_2;
                ModuleA2 = ModuleA_2;
            },
            function (ModuleB_1) {
                ModuleB = ModuleB_1;
            },
            function (ModuleC_1) {
                ModuleC = ModuleC_1;
            },
            function (StoreElemTest_1) {
                StoreElemTest = StoreElemTest_1;
            },
            function (test_touch_1_1) {
                test_touch_1 = test_touch_1_1;
            },
            function (test_classname_1_1) {
                test_classname_1 = test_classname_1_1;
            },
            function (test_enum_1_1) {
                test_enum_1 = test_enum_1_1;
            }
        ],
        execute: function () {
            $(document).ready(main);
        }
    };
});
//# sourceMappingURL=out.js.map