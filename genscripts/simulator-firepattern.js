"use strict";
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-model-weapons.ts" />
/// <reference path="simulator-patterns.ts" />
//Fire patterns are functions that take a mech and return a list of weaponstates
//which represent the weapons to fire
var MechFirePattern;
(function (MechFirePattern) {
    MechFirePattern.alphaAtZeroHeat = function (mech, range) {
        let mechState = mech.getMechState();
        if (mechState.heatState.currHeat <= 0) {
            return mechState.weaponStateList;
        }
        else {
            return null;
        }
    };
    //Will always try to fire the weapons with the highest damage to heat ratio
    //If not possible will wait until enough heat is available
    //Avoids ghost heat
    MechFirePattern.maximumDmgPerHeat = function (mech, range) {
        let mechState = mech.getMechState();
        let sortedByDmgPerHeat = Array.from(mechState.weaponStateList);
        //sort weaponsToFire by damage/heat at the given range in decreasing order
        sortedByDmgPerHeat.sort(damagePerHeatComparator(range));
        let weaponsToFire = [];
        for (let weaponState of sortedByDmgPerHeat) {
            let weaponInfo = weaponState.weaponInfo;
            if (!canFire(weaponState) //not ready to fire
                || !willDoDamage(weaponState, range) //will not do damage
                || (weaponInfo.requiresAmmo() && weaponState.getAvailableAmmo() <= 0)) {
                continue; //skip weapon
            }
            //fit as many ready weapons as possible into the available heat
            //starting with those with the best damage:heat ratio
            weaponsToFire.push(weaponState);
            let overheat = willOverheat(mech, weaponsToFire);
            let ghostheat = willGhostHeat(mech, weaponsToFire);
            if (overheat || ghostheat) {
                weaponsToFire.pop();
                if (ghostheat) {
                    continue;
                }
                else if (overheat) {
                    break; //if near heatcap, wait for the better heat/dmg weapon
                }
            }
        }
        return weaponsToFire;
    };
    //Always alpha, as long as it does not cause an overheat
    MechFirePattern.alphaNoOverheat = function (mech, range) {
        let mechState = mech.getMechState();
        let weaponsToFire = [];
        //check if all weapons are ready
        for (let weaponState of mechState.weaponStateList) {
            if (!canFire(weaponState) && !weaponState.isJammed())
                return [];
        }
        weaponsToFire = Array.from(mechState.weaponStateList);
        if (!willOverheat(mech, weaponsToFire)) {
            return weaponsToFire;
        }
        else {
            return [];
        }
    };
    MechFirePattern.maxFireNoGhostHeat = function (mech, range) {
        let mechState = mech.getMechState();
        let weaponsToFire = [];
        for (let weaponState of mechState.weaponStateList) {
            if (!canFire(weaponState) || !willDoDamage(weaponState, range))
                continue;
            weaponsToFire.push(weaponState);
            if (willGhostHeat(mech, weaponsToFire) || willOverheat(mech, weaponsToFire)) {
                weaponsToFire.pop();
                continue;
            }
        }
        return weaponsToFire;
    };
    MechFirePattern.fireWhenReady = function (mech, range) {
        let mechState = mech.getMechState();
        let weaponsToFire = [];
        for (let weaponState of mechState.weaponStateList) {
            if (weaponState.weaponCycle === MechModel.WeaponCycle.READY) {
                weaponsToFire.push(weaponState);
            }
        }
        return weaponsToFire;
    };
    //Util functions
    var damagePerHeatComparator = function (range) {
        return (weaponA, weaponB) => {
            let weaponInfoA = weaponA.weaponInfo;
            let dmgPerHeatA = weaponInfoA.heat > 0 ?
                weaponInfoA.damageAtRange(range)
                    / weaponInfoA.heat :
                Number.MAX_VALUE;
            let weaponInfoB = weaponB.weaponInfo;
            let dmgPerHeatB = weaponInfoB.heat > 0 ?
                weaponInfoB.damageAtRange(range)
                    / weaponInfoB.heat :
                Number.MAX_VALUE;
            return dmgPerHeatB - dmgPerHeatA;
        };
    };
    var willOverheat = function (mech, weaponsToFire) {
        let predictedHeat = MechSimulatorLogic.predictHeat(mech, weaponsToFire);
        let heatState = mech.getMechState().heatState;
        return heatState.currHeat + predictedHeat > heatState.currMaxHeat;
    };
    var willGhostHeat = function (mech, weaponsToFire) {
        let predictedHeat = MechSimulatorLogic.predictHeat(mech, weaponsToFire);
        let baseHeat = MechSimulatorLogic.predictBaseHeat(mech, weaponsToFire);
        return predictedHeat > baseHeat;
    };
    var willDoDamage = function (weaponState, range) {
        return weaponState.weaponInfo.damageAtRange(range) > 0;
    };
    //Helper method for determining whether the firepattern can fire a weapon
    //Uses the useDoubleTap field of SimulatorParameters
    var canFire = function (weaponState) {
        let simParams = MechSimulatorLogic.getSimulatorParameters();
        if (simParams.useDoubleTap) {
            return weaponState.canFire();
        }
        else {
            return weaponState.isReady();
        }
    };
    MechFirePattern.getDefault = function () {
        for (let patternEntry of MechFirePattern.getPatterns()) {
            if (patternEntry.default) {
                return patternEntry.pattern;
            }
        }
    };
    //Returns a list of fire patterns for the UI
    MechFirePattern.getPatterns = function () {
        let patternList = [
            { id: "maximumDmgPerHeat",
                name: "Max DMG per Heat",
                pattern: MechFirePattern.maximumDmgPerHeat,
                description: "Maximize damage per heat.",
                default: true,
            },
            { id: "alphaNoOverheat",
                name: "Alpha, no Overheat",
                pattern: MechFirePattern.alphaNoOverheat,
                description: "Always alpha as long as it doesn't cause an overheat.",
                default: false,
            },
            { id: "maxFireNoGhostHeat",
                name: "Maximum fire rate",
                pattern: MechFirePattern.maxFireNoGhostHeat,
                description: "Maximize weapons fired as long as it doesn't cause ghost heat.",
                default: false,
            },
            { id: "alphaAtZeroHeat",
                name: "Alpha when at zero heat",
                pattern: MechFirePattern.alphaAtZeroHeat,
                description: "Fire all weapons when heat is zero.",
                default: false,
            },
        ];
        return patternList;
    };
    MechFirePattern.reset = function () {
    };
})(MechFirePattern || (MechFirePattern = {}));
//# sourceMappingURL=simulator-firepattern.js.map