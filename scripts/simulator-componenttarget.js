"use strict";

var MechTargetComponent = MechTargetComponent || (function () {

  //These functions return which component of a mech should be targeted
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

  var aimSideTorsoThenCenterTorso = function(sourceMech, targetMech) {
    let targetMechHealth = targetMech.getMechState().mechHealth;
    let Component = MechModel.Component;
    if (targetMechHealth.isIntact(Component.RIGHT_TORSO)) {
      return Component.RIGHT_TORSO;
    } else if (targetMechHealth.isIntact(Component.LEFT_TORSO)) {
      return Component.LEFT_TORSO
    } else {
      return Component.CENTRE_TORSO;
    }
  }

  var randomAim = function(sourceMech, targetMech) {
    let Component = MechModel.Component;
    let componentList = [
      Component.RIGHT_ARM,
      Component.RIGHT_TORSO,
      Component.CENTRE_TORSO,
      Component.LEFT_ARM,
      Component.LEFT_TORSO,
      Component.RIGHT_LEG,
      Component.LEFT_LEG,
    ];
    let intactComponentList = [];
    for (let component of componentList) {
      if (targetMech.getMechState().mechHealth.isIntact(component)) {
        intactComponentList.push(component);
      }
    }
    return intactComponentList[Math.floor(Math.random() * intactComponentList.length)];

  }

  var getDefault = function() {
    return MechTargetComponent.aimForCenterTorso;
  }

  return {
    aimForCenterTorso : aimForCenterTorso,
    aimForXLSideTorso : aimForXLSideTorso,
    aimForLegs : aimForLegs,
    aimSideTorsoThenCenterTorso: aimSideTorsoThenCenterTorso,
    randomAim : randomAim,
    getDefault : getDefault,
  }
})();
