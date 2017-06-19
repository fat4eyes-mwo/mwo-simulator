"use strict";

function main() {
  MechTest.testUIWidgets();
  MechTest.testModelInit();
  MechTest.testModelOps();
}

$(document).ready(main);
