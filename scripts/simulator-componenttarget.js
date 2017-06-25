"use strict";

var MechTargetComponent = MechTargetComponent || (function () {

  //These functions return which component of a mech should be targetted
  //function(sourceMech, targetMech) -> MechModel.Component
  var aimForCenterTorso = function(sourceMech, targetMech) {
    return MechModel.Component.CENTRE_TORSO;
  }

  var aimForXLSideTorso = function(sourceMech, targetMech) {
    let mechInfo = targetMech.getMechInfo();
    if (mechInfo.engineInfo.getEngineType() === MechModel.EngineType.XL) {
      return MechModel.Component.RIGHT_TORSO;
    } else {
      return MechModel.Component.CENTRE_TORSO;
    }
  }

  var aimForLegs = function(sourceMech, targetMech) {
    let mechState = targetMech.getMechState();
    if (mechState.mechHealth.isIntact(MechModel.Component.LEFT_LEG)) {
      return MechModel.Component.LEFT_LEG;
    } else {
      return MechModel.Component.RIGHT_LEG;
    }
  }

  return {
    aimForCenterTorso : aimForCenterTorso,
    aimForXLSideTorso : aimForXLSideTorso,
    aimForLegs : aimForLegs,
  }
})();
