"use strict";
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-model-weapons.ts" />
/// <reference path="simulator-patterns.ts" />

namespace MechTargetMech  {
  import Mech = MechModel.Mech;
  import Pattern = ModelPatterns.Pattern;

  export type TargetMechPattern = (mech : Mech, enemyMechList : Mech[]) => Mech;
  //These functions return which enemy mech to target
  //function(MechModel.Mech, [MechModel.Mech])-> MechModel.Mech
  export var targetMechsInOrder =
      function (mech : Mech, enemyMechList : Mech[]) : Mech {
    for (let enemyMech of enemyMechList) {
      if (enemyMech.getMechState().isAlive()) {
        return enemyMech;
      }
    }
    return null;
  }

  var targetMap = new Map<Mech, Mech>();
  export var targetRandomMech = function (mech : Mech, enemyMechList : Mech[]) : Mech {
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

  var targetHighestFirepower =
      function (mech : Mech, enemyMechList : Mech[]) : Mech {
    let maxFirepower : number;
    let maxFirepowerMech : Mech;
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

  var targetHeaviest = function (mech : Mech, enemyMechList : Mech[]) : Mech {
    let maxWeight : number;
    let maxWeightMech : Mech;
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

  export var getDefault = function() : TargetMechPattern {
    for (let patternEntry of getPatterns()) {
      if (patternEntry.default) {
        return patternEntry.pattern;
      }
    }
  }

  export var reset = function() : void {
    targetMap = new Map();
  }

  //returns a list of mech target patterns for the UI
  export var getPatterns = function() : Pattern[] {
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
}
