
var MechTargetComponent = MechTargetComponent || (function () {

  //These functions return which component of a mech should be targetted
  //function(sourceMech, targetMech) -> MechModel.Component
  var aimForCenterTorso(sourceMech, targetMech) {
    return MechModel.Component.CENTRE_TORSO;
  }

  return {
    aimForCenterTorso : aimForCenterTorso,
  }
})();
