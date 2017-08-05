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
System.register("storevalue", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var StoreValue;
    return {
        setters: [],
        execute: function () {
            (function (StoreValue) {
                StoreValue.storeToElement = function (elem, key, value) {
                    let symbolKey = Symbol.for(key);
                    let anyElem = elem;
                    let prevValue = anyElem[symbolKey];
                    anyElem[symbolKey] = value;
                    return prevValue;
                };
                StoreValue.getFromElement = function (elem, key) {
                    let symbolKey = Symbol.for(key);
                    let anyElem = elem;
                    return anyElem[symbolKey];
                };
            })(StoreValue || (StoreValue = {}));
            exports_4("StoreValue", StoreValue);
        }
    };
});
/// <reference path="../scripts/lib/jquery-3.2.d.ts" />
System.register("storedElemTest", ["storevalue"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var storevalue_1, testInterval, testCtr, TestIntervalDuration, TestDiv, testRunning, testStoredElem, toggleTest, LargeClass;
    return {
        setters: [
            function (storevalue_1_1) {
                storevalue_1 = storevalue_1_1;
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
                        storevalue_1.StoreValue.storeToElement(newDiv, "testKey", new LargeClass(testCtr, 10000));
                        testJQ.append(newDiv);
                        if (testCtr % 100 === 0) {
                            testJQ.empty(); //clearing this should trigger garbage collection
                        }
                        let storedVal = storevalue_1.StoreValue.getFromElement(newDiv, "testKey");
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
System.register("main", ["moduleA", "moduleB", "libtest/moduleC", "storedElemTest"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    function main() {
        ModuleA.setA("a1");
        ModuleA2.setA("a2"); //Should set the same variable a in moduleA.js
        ModuleC.funcC("foo");
        $("#debugText").text("Hello again from typescript" + ModuleA.funcA("Foo") + ModuleB.bfunc("Bar") +
            ` ModuleA.a=${ModuleA.getA()}` + ` ModuleA2.a=${ModuleA2.getA()}` + ` ModuleB.getAFromB()=${ModuleB.getAfromB()}`);
        StoreElemTest.testStoredElem();
    }
    exports_6("main", main);
    var ModuleA, ModuleA2, ModuleB, ModuleC, StoreElemTest, foo;
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
            }
        ],
        execute: function () {
            $(document).ready(main);
        }
    };
});
//# sourceMappingURL=out.js.map