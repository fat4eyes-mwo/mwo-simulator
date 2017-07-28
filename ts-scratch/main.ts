/// <reference path="../scripts/lib/jquery-3.2.d.ts" />
/// <reference path="moduleA.ts" />
/// <reference path="moduleB.ts" />

import A = ModuleA;
import B = ModuleB;

namespace Main {
  export function main() {
    $("#debugText").text("Hello again from typescript" + A.funcA("Foo") + B.bfunc("Bar"));
  }
}

$(document).ready(Main.main);
