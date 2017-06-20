"use strict";

function main() {
  MechTest.testUIWidgets();
  MechTest.testModelInit();
  MechTest.testModelOps();
  //MechTest.testModelBaseHealth();
}

$(document).ready(main);
