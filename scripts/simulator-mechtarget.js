"use strict";

var MechTargetMech = MechTargetMech || (function () {

  //These functions return which enemy mech to target
  //function(MechModel.Mech, [MechModel.Mech])-> MechModel.Mech
  var targetMechsInOrder = function (mech, enemyMechList) {
    for (let enemyMech of enemyMechList) {
      if (enemyMech.getMechState().isAlive()) {
        return enemyMech;
      }
    }
    return null;
  }

  //{sourceMech, targetMech}
  var currTargetMap = {};
  var targetRandomMech = function (mech, enemyMechList) {
    let mechId = mech.getMechId();
    if (!currTargetMap[mechId] || !currTargetMap[mechId].getMechState().isAlive()) {
      let liveEnemyMechs = [];
      for (let enemyMech of enemyMechList) {
        if (enemyMech.getMechState().isAlive()) {
          liveEnemyMechs.push(enemyMech);
        }
      }
      let newTarget = liveEnemyMechs[Math.floor(Math.random() * liveEnemyMechs.length)];
      currTargetMap[mechId] = newTarget;
    }
    return currTargetMap[mechId];
  }

  return {
    targetMechsInOrder : targetMechsInOrder,
    targetRandomMech : targetRandomMech,
  }

})();
