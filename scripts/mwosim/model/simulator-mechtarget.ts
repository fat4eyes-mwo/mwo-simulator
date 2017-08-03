"use strict";

namespace MechTargetMech  {
  type Mech = MechModel.Mech;
  type Pattern = ModelPatterns.Pattern;

  export type TargetMechPattern = (mech : Mech, enemyMechList : Mech[]) => Mech;
  //These functions return which enemy mech to target
  export var targetMechsInOrder : TargetMechPattern =
      function (mech : Mech, enemyMechList : Mech[]) : Mech {
    for (let enemyMech of enemyMechList) {
      if (enemyMech.getMechState().isAlive()) {
        return enemyMech;
      }
    }
    return null;
  }

  var targetMap = new Map<Mech, Mech>();
  export var targetRandomMech : TargetMechPattern =
      function (mech : Mech, enemyMechList : Mech[]) : Mech {
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

  var targetHighestFirepower : TargetMechPattern =
      function (mech : Mech, enemyMechList : Mech[]) : Mech {
    let maxFirepower : number;
    let maxFirepowerMech : Mech;
    let range = SimulatorSettings.getSimulatorParameters().range;
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

  var targetHeaviest : TargetMechPattern =
      function (mech : Mech, enemyMechList : Mech[]) : Mech {
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
        return patternEntry.pattern as TargetMechPattern;
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
