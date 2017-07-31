/// <reference path="../scripts/lib/jquery-3.2.d.ts" />
/// <reference path="moduleA.ts" />
/// <reference path="moduleB.ts" />

namespace Main {
  export function main() {
    $("#debugText").text("Hello again from typescript" + ModuleA.funcA("Foo") + ModuleB.bfunc("Bar"));
  }
}

$(document).ready(Main.main);
