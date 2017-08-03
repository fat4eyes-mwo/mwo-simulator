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
System.register("main", ["moduleA", "moduleB", "libtest/moduleC"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function main() {
        ModuleA.setA("a1");
        ModuleA2.setA("a2"); //Should set the same variable a in moduleA.js
        ModuleC.funcC("foo");
        $("#debugText").text("Hello again from typescript" + ModuleA.funcA("Foo") + ModuleB.bfunc("Bar") +
            ` ModuleA.a=${ModuleA.getA()}` + ` ModuleA2.a=${ModuleA2.getA()}` + ` ModuleB.getAFromB()=${ModuleB.getAfromB()}`);
    }
    exports_4("main", main);
    var ModuleA, ModuleA2, ModuleB, ModuleC, foo;
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
            }
        ],
        execute: function () {
            $(document).ready(main);
        }
    };
});
//# sourceMappingURL=out.js.map