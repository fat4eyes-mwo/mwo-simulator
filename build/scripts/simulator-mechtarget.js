"use strict";
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-model-weapons.ts" />
/// <reference path="simulator-patterns.ts" />
var MechTargetMech;
(function (MechTargetMech) {
    //These functions return which enemy mech to target
    //function(MechModel.Mech, [MechModel.Mech])-> MechModel.Mech
    MechTargetMech.targetMechsInOrder = function (mech, enemyMechList) {
        for (let enemyMech of enemyMechList) {
            if (enemyMech.getMechState().isAlive()) {
                return enemyMech;
            }
        }
        return null;
    };
    var targetMap = new Map();
    MechTargetMech.targetRandomMech = function (mech, enemyMechList) {
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
    };
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
    };
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
    };
    MechTargetMech.getDefault = function () {
        for (let patternEntry of MechTargetMech.getPatterns()) {
            if (patternEntry.default) {
                return patternEntry.pattern;
            }
        }
    };
    MechTargetMech.reset = function () {
        targetMap = new Map();
    };
    //returns a list of mech target patterns for the UI
    MechTargetMech.getPatterns = function () {
        let patternList = [
            {
                id: "targetMechsInOrder",
                name: "Mechs in order",
                pattern: MechTargetMech.targetMechsInOrder,
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
                pattern: MechTargetMech.targetRandomMech,
                description: "Target a random live mech.",
                default: false,
            },
        ];
        return patternList;
    };
})(MechTargetMech || (MechTargetMech = {}));
//# sourceMappingURL=simulator-mechtarget.js.map