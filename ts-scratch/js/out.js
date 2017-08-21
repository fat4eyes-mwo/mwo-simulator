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
System.register("test-observables", ["../node_modules/rxjs/Rx"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Rx, TestObservables;
    return {
        setters: [
            function (Rx_1) {
                Rx = Rx_1;
            }
        ],
        execute: function () {
            (function (TestObservables) {
                var eventQueue;
                var initEventQueue = function () {
                    const INIT_MAX = 10000;
                    eventQueue = new Array(INIT_MAX);
                    for (let i = 0; i < INIT_MAX; i++) {
                        eventQueue[i] = i;
                    }
                };
                TestObservables.testObservables = function () {
                    let observable = Rx.default.Observable;
                    initEventQueue();
                    for (let OBSERVERS = 1; OBSERVERS <= 20; OBSERVERS++) {
                        let eventQueueObservable = observable.create(function (observer) {
                            setTimeout(() => {
                                console.time(`Rx_${OBSERVERS}_observer`);
                                observer.next(2);
                                observer.next(4);
                                observer.complete();
                                console.timeEnd(`Rx_${OBSERVERS}_observer`);
                            }, 1000);
                        })
                            .map(function (x) { return x; });
                        for (let ctr = 0; ctr < OBSERVERS; ctr++) {
                            eventQueueObservable
                                .subscribe(function (x) {
                                let y = x * ctr;
                                console.log(`Observer#${ctr} : ${y}`);
                            });
                        }
                    }
                };
            })(TestObservables || (TestObservables = {}));
            exports_7("TestObservables", TestObservables);
        }
    };
});
System.register("main", ["moduleA", "moduleB", "libtest/moduleC", "storedElemTest", "test-touch", "test-observables"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function main() {
        ModuleA.setA("a1");
        ModuleA2.setA("a2"); //Should set the same variable a in moduleA.js
        ModuleC.funcC("foo");
        $("#debugText").text("Hello again from typescript" + ModuleA.funcA("Foo") + ModuleB.bfunc("Bar") +
            ` ModuleA.a=${ModuleA.getA()}` + ` ModuleA2.a=${ModuleA2.getA()}` +
            ` ModuleB.getAFromB()=${ModuleB.getAfromB()}`);
        StoreElemTest.testStoredElem();
        test_touch_1.TouchTest.touchTest();
        test_observables_1.TestObservables.testObservables();
    }
    exports_8("main", main);
    var ModuleA, ModuleA2, ModuleB, ModuleC, StoreElemTest, test_touch_1, test_observables_1, foo;
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
            function (test_observables_1_1) {
                test_observables_1 = test_observables_1_1;
            }
        ],
        execute: function () {
            $(document).ready(main);
        }
    };
});
//# sourceMappingURL=out.js.map