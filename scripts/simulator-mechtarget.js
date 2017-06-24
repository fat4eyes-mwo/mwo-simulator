
var MechTargetMech = MechTargetMech || (function () {

  //These functions return which enemy mech to target
  //function(MechModel.Mech, [MechModel.Mech])-> MechModel.Mech
  var targetMechsInOrder(mech, enemyMechList) {
    for (let enemyMech of enemyMechList) {
      if (enemyMech.mechState.isAlive()) {
        return enemyMech;
      }
    }
    return null;
  }

  return {
    targetMechsInOrder : targetMechsInOrder,
  }

})();
