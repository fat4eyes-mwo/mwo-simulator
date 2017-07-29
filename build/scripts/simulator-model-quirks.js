"use strict";
/// <reference path="data/quirkdata.ts" />
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-model-weapons.ts" />
/// <reference path="simulator-smurfytypes.ts" />
var MechModelQuirks;
(function (MechModelQuirks) {
    MechModelQuirks.collectOmnipodQuirks = function (smurfyMechLoadout) {
        let ret = [];
        if (!MechModel.isOmnimech(smurfyMechLoadout)) {
            return ret;
        }
        for (let component of smurfyMechLoadout.configuration) {
            let omnipodId = component.omni_pod;
            if (omnipodId) {
                let omnipodData = MechModel.getSmurfyOmnipodData(omnipodId);
                let omnipodQuirks = omnipodData.configuration.quirks;
                ret = ret.concat(omnipodQuirks);
            }
        }
        //add ct omnipod quirks (smurfy config does not put in omnipod ID for ct)
        let smurfyMechInfo = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
        let ctOmnipod = MechModel.getSmurfyCTOmnipod(smurfyMechInfo.name);
        if (ctOmnipod) {
            ret = ret.concat(ctOmnipod.configuration.quirks);
        }
        else {
            console.warn("Unable to find CT omnipod for " + smurfyMechInfo.name);
        }
        return ret;
    };
    MechModelQuirks.getGeneralBonus = function (quirkList) {
        let ret = {};
        for (let quirk of quirkList) {
            if (MechModelQuirks._quirkGeneral[quirk.name]) {
                if (!ret[quirk.name]) {
                    ret[quirk.name] = Number(quirk.value);
                }
                else {
                    ret[quirk.name] += Number(quirk.value);
                }
            }
        }
        return ret;
    };
    MechModelQuirks.getArmorStructureBonus = function (component, quirkList) {
        let ret = { armor: 0, structure: 0 };
        for (let quirk of quirkList) {
            if (quirk.name.startsWith(MechModelQuirks._quirkArmorPrefix)) {
                let quirkComponent = quirk.name.split("_")[1];
                if (MechModelQuirks._quirkComponentMap[component] !== quirkComponent)
                    continue;
                ret.armor += Number(quirk.value);
            }
            else if (quirk.name.startsWith(MechModelQuirks._quirkStructurePrefix)) {
                let quirkComponent = quirk.name.split("_")[1];
                if (MechModelQuirks._quirkComponentMap[component] !== quirkComponent)
                    continue;
                ret.structure += Number(quirk.value);
            }
        }
        return ret;
    };
    class ReverseWeaponQuirkMap {
        constructor() {
            this.reversedWeaponNameMap = null;
        }
        getApplicableQuirks(weaponName) {
            return this.getReversedWeaponNameMap()[weaponName];
        }
        getReversedWeaponNameMap() {
            if (!this.reversedWeaponNameMap) {
                this.reversedWeaponNameMap = this.initReversedWeaponNameMap();
            }
            return this.reversedWeaponNameMap;
        }
        //Initialize the map. Make sure that quirkData.js is loaded before simulator-model-quirks.js
        initReversedWeaponNameMap() {
            let ret = {};
            for (let quirkName in MechModelQuirks._weaponNameMap) {
                for (let weaponName of MechModelQuirks._weaponNameMap[quirkName]) {
                    let reverseEntry = ret[weaponName];
                    if (!reverseEntry) {
                        reverseEntry = new Set();
                        ret[weaponName] = reverseEntry;
                    }
                    reverseEntry.add(quirkName);
                }
            }
            return ret;
        }
    }
    var reversedWeaponQuirkMap = new ReverseWeaponQuirkMap();
    MechModelQuirks.getWeaponBonus = function (weaponInfo) {
        let quirkList = weaponInfo.mechInfo.quirks;
        let ret = { cooldown_multiplier: 0, duration_multiplier: 0,
            heat_multiplier: 0, range_multiplier: 0, velocity_multiplier: 0,
            jamchance_multiplier: 0 };
        for (let quirk of quirkList) {
            let quirkNameComponents = quirk.name.split("_");
            let firstNameComponent = quirkNameComponents[0];
            let restOfNameComponents = quirkNameComponents.slice(1).join("_");
            //general weapon bonuses
            if (MechModelQuirks._weaponClassMap[firstNameComponent]) {
                if (MechModelQuirks._weaponClassMap[firstNameComponent].includes(weaponInfo.type)) {
                    ret[restOfNameComponents] += Number(quirk.value);
                }
            }
            //specific weapon bonuses
            let applicableQuirks = reversedWeaponQuirkMap.getApplicableQuirks(weaponInfo.name);
            if (applicableQuirks && applicableQuirks.has(firstNameComponent)) {
                ret[restOfNameComponents] += Number(quirk.value);
            }
        }
        return ret;
    };
})(MechModelQuirks || (MechModelQuirks = {}));
//# sourceMappingURL=simulator-model-quirks.js.map