"use strict";
var ModuleA;
(function (ModuleA) {
    function funcA(s) {
        let ret = "funcA(" + s + ")";
        console.log(ret);
        return ret;
    }
    ModuleA.funcA = funcA;
})(ModuleA || (ModuleA = {}));
var ModuleB;
(function (ModuleB) {
    function bfunc(s) {
        let ret = "bfunc(" + s + ")";
        console.log(ret);
        return ret;
    }
    ModuleB.bfunc = bfunc;
})(ModuleB || (ModuleB = {}));
/// <reference path="../scripts/lib/jquery-3.2.d.ts" />
/// <reference path="moduleA.ts" />
/// <reference path="moduleB.ts" />
var A = ModuleA;
var B = ModuleB;
var Main;
(function (Main) {
    function main() {
        $("#debugText").text("Hello again from typescript" + A.funcA("Foo") + B.bfunc("Bar"));
    }
    Main.main = main;
})(Main || (Main = {}));
$(document).ready(Main.main);
//# sourceMappingURL=out.js.map