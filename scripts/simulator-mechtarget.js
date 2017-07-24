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

  var targetMap = new Map();
  var targetRandomMech = function (mech, enemyMechList) {
    let targetMech = targetMap.get(mech);
    if (!targetMech || !targetMech.getMechState().isAlive()) {
      let liveEnemyMechs = [];
      for (let enemyMech of enemyMechList) {
        if (enemyMech.getMechState().isAlive()) {
          liveEnemyMechs.push(enemyMech);
        }
      }
      targetMech = liveEnemyMechs[Math.floor(Math.random() * liveEnemyMechs.length)];
      targetMap.set(mech, targetMech);
    }
    return targetMech;
  }

  var targetHighestFirepower = function (mech, enemyMechList) {
    let maxFirepower;
    let maxFirepowerMech;
    let range = MechSimulatorLogic.getSimulatorParameters().range;
    for (let enemyMech of enemyMechList) {
      if (enemyMech.getMechState().isAlive()) {
        let firepower = enemyMech.getMechState().getTotalDamageAtRange(range);
        if (!maxFirepower || firepower > maxFirepower) {
          maxFirepower = firepower;
          maxFirepowerMech = enemyMech;
        }
      }
    }
    return maxFirepowerMech;
  }

  var targetHeaviest = function (mech, enemyMechList) {
    let maxWeight;
    let maxWeightMech;
    for (let enemyMech of enemyMechList) {
      if (enemyMech.getMechState().isAlive()) {
        let mechInfo = enemyMech.getMechState().mechInfo;
        let weight = mechInfo.tons;
        if (!maxWeight || Number(weight) > Number(maxWeight)) {
          maxWeight = weight;
          maxWeightMech = enemyMech;
        }
      }
    }
    return maxWeightMech;
  }

  var getDefault = function() {
    return targetMechsInOrder;
  }

  var reset = function() {
    targetMap = new Map();
  }

  //returns a list of mech target patterns for the UI
  var getPatterns = function() {
    let patternList = [
      {
        id: "targetMechsInOrder",
        name: "Mechs in order",
        pattern: targetMechsInOrder,
        description: "Target mechs from the top to the bottom of the list.",
        default: true,
      },
      {
        id: "targetHighestFirepower",
        name: "Highest Firepower First",
        pattern: targetHighestFirepower,
        description: "Target the enemy mech with the highest firepower at the current range.",
        default: false,
      },
      {
        id: "targetHeaviest",
        name: "Heaviest First",
        pattern: targetHeaviest,
        description: "Target the heaviest mech first.",
        default: false,
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
    reset : reset,
  }

})();
