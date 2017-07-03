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

  var targetRandomMech = function (mech, enemyMechList) {
    let mechId = mech.getMechId();
    let liveEnemyMechs = [];
    for (let enemyMech of enemyMechList) {
      if (enemyMech.getMechState().isAlive()) {
        liveEnemyMechs.push(enemyMech);
      }
    }
    let newTarget = liveEnemyMechs[Math.floor(Math.random() * liveEnemyMechs.length)];
    return newTarget;
  }

  var getDefault = function() {
    return targetMechsInOrder;
  }

  var getPatterns = function() {
    let patternList = [
      {
        id: "targetMechsInOrder",
        name: "Mechs in order.",
        pattern: targetMechsInOrder,
        description: "Target mechs from the top to the bottom of the list.",
        default: true,
      },
      {
        id: "targetRandomMech",
        name: "Random mech",
        pattern: targetRandomMech,
        description: "Target a random live mech.",
        default: false,
      },
    ];
    return patternList;
  }

  return {
    targetMechsInOrder : targetMechsInOrder,
    targetRandomMech : targetRandomMech,
    getDefault : getDefault,
    getPatterns : getPatterns,
  }

})();
