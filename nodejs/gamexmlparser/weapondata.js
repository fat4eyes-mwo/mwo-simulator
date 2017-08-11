"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs");
var WeaponData;
(function (WeaponData) {
    var weaponIdMap = new Map();
    class Weapon {
        constructor(xmlWeaponEntry) {
            this.id = xmlWeaponEntry.attr.id;
            this.name = xmlWeaponEntry.attr.name;
            weaponIdMap.set(this.id, this);
            if (xmlWeaponEntry.attr.InheritFrom) {
                let parentWeapon = weaponIdMap.get(xmlWeaponEntry.attr.InheritFrom);
                this.inheritFrom(parentWeapon);
                return;
            }
            let xmlWeaponStats = xmlWeaponEntry.WeaponStats[0];
            this.ammo_per_shot = xmlWeaponStats.attr.ammoPerShot > 0 ?
                Number(xmlWeaponStats.attr.numFiring) : 0;
            if (xmlWeaponStats.attr.JammingChance) {
                this.jamming_chance = Number(xmlWeaponStats.attr.JammingChance);
                this.jammed_time = Number(xmlWeaponStats.attr.JammedTime);
            }
            if (xmlWeaponStats.attr.ShotsDuringCooldown) {
                this.shots_during_cooldown = Number(xmlWeaponStats.attr.ShotsDuringCooldown);
            }
            if (xmlWeaponStats.attr.chargeTime) {
                this.spinup = Number(xmlWeaponStats.attr.chargeTime);
            }
            if (xmlWeaponStats.attr.rof) {
                this.rof = Number(xmlWeaponStats.attr.rof);
            }
            if (xmlWeaponStats.attr.rampUpTime) {
                this.rampUpTime = Number(xmlWeaponStats.attr.rampUpTime);
            }
            if (xmlWeaponStats.attr.rampDownTime) {
                this.rampDownTime = Number(xmlWeaponStats.attr.rampDownTime);
            }
            if (xmlWeaponStats.attr.jamRampUpTime) {
                this.jamRampUpTime = Number(xmlWeaponStats.attr.jamRampUpTime);
            }
            if (xmlWeaponStats.attr.jamRampDownTime) {
                this.jamRampDownTime = Number(xmlWeaponStats.attr.jamRampDownTime);
            }
            if (xmlWeaponStats.attr.isOneShot) {
                this.isOneShot = xmlWeaponStats.attr.isOneShot !== 0;
            }
            if (xmlWeaponStats.attr.volleydelay) {
                this.volleyDelay = Number(xmlWeaponStats.attr.volleydelay);
            }
            //special case for machine guns: speed in XML files is just particle
            //speed not actual weapon speed (which is near instant). Set very high
            //speed for all machine gun weapons
            if (this.name.includes("MachineGun")) {
                this.speed = 10000;
            }
            this.ranges = [];
            for (let xmlRange of xmlWeaponEntry.Ranges[0].Range) {
                this.ranges.push(new RangeEntry(xmlRange));
            }
        }
        inheritFrom(otherWeapon) {
            for (let attr in otherWeapon) {
                if (attr !== "id" && attr !== "name") {
                    this[attr] = otherWeapon[attr];
                }
            }
        }
        serialize() {
            let ret = {};
            for (let attr in this) {
                if (attr !== 'id' && attr !== 'name') {
                    ret[attr] = this[attr];
                }
            }
            return ret;
        }
    }
    class RangeEntry {
        constructor(xmlRangeEntry) {
            this.start = Number(xmlRangeEntry.attr.start);
            this.damageModifier = Number(xmlRangeEntry.attr.damageModifier);
            this.interpolationToNextRange = xmlRangeEntry.attr.interpolationToNextRange;
        }
    }
    WeaponData.generateAddedWeaponData = function (parsedXML) {
        let ret = {};
        let weapons = [];
        for (let xmlWeapon of parsedXML.WeaponList.Weapon) {
            let weapon = new Weapon(xmlWeapon);
            ret[weapon.name] = weapon.serialize();
        }
        return ret;
    };
    WeaponData.writeAddedWeaponData = function (addedWeaponData, filePath) {
        let dataString = JSON.stringify(addedWeaponData, null, "\t");
        let writeString = "//Generated from GameData.pak " + new Date().toUTCString() + "\n";
        writeString += "namespace AddedData {\n\n";
        writeString += "export var _AddedWeaponData : {[index:string] : any} = ";
        writeString += dataString + ";";
        writeString += "\n}";
        FS.writeFile(filePath, writeString, function (err) {
            if (err) {
                console.error("Error writing file " + filePath + " : " + err);
            }
            else {
                console.log("File written: " + filePath);
            }
        });
    };
})(WeaponData = exports.WeaponData || (exports.WeaponData = {}));
//# sourceMappingURL=weapondata.js.map