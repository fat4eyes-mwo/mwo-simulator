/// <reference path="../scripts/lib/jquery-3.2.d.ts" />
/// <reference path="moduleA.ts" />
/// <reference path="moduleB.ts" />
import * as ModuleA from "moduleA";
import * as ModuleA2 from "moduleA";
import * as ModuleB from "moduleB";
import * as ModuleC from "libtest/moduleC";
import * as StoreElemTest from "storedElemTest";
import {TouchTest} from "test-touch";
import {WeakmapTest} from "test-weakmap";

let foo : ModuleA.TypeA;
export function main() {
  ModuleA.setA("a1");
  ModuleA2.setA("a2"); //Should set the same variable a in moduleA.js
  ModuleC.funcC("foo");
  $("#debugText").text("Hello again from typescript" + ModuleA.funcA("Foo") + ModuleB.bfunc("Bar") +
              ` ModuleA.a=${ModuleA.getA()}` + ` ModuleA2.a=${ModuleA2.getA()}` + 
              ` ModuleB.getAFromB()=${ModuleB.getAfromB()}`);
  StoreElemTest.testStoredElem();
  
  TouchTest.touchTest();
}

$(document).ready(main);
