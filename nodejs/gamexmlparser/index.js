"use strict";
//Reads XML data from GameData.pak and generates javascript files
//for use in mwo-simulator
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const AdmZip = require("adm-zip");
const XML2js = require("xml2js");
const FS = require("fs");
const WEAPONSPATH = "Libs/Items/Weapons/Weapons.xml";
var loadGameData = function (gameDataPakFile) {
    var gameDataZip = new AdmZip(gameDataPakFile);
    var parseResult;
    let weaponsXML = gameDataZip.readAsText(WEAPONSPATH);
    XML2js.parseString(weaponsXML, { attrkey: "attr" }, function (err, result) {
        parseResult = result;
    });
    return {
        xmlWeaponData: parseResult
    };
};
var loadMechData = function (mechPakFile) {
    let mechNameRegex = /^.*[\\\\\/]([A-Za-z]+)\.pak$/; //Regexes are still unreadable AF.
    let matches = mechNameRegex.exec(mechPakFile);
    let mechName = matches[1];
    const MechPathInZip = `Objects/mechs/${mechName}/`;
    let mechZip = new AdmZip(mechPakFile);
    let xmlOmnipodData = parseMechOmnipods(mechZip, mechName, MechPathInZip);
    return {
        mechName,
        xmlOmnipodData
    };
};
var parseMechOmnipods = function (mechZip, mechName, mechPathInZip) {
    const OmnipodPathInZip = mechPathInZip + `${mechName}-omnipods.xml`;
    let omnipodXML = mechZip.readAsText(OmnipodPathInZip);
    var parsedXML;
    XML2js.parseString(omnipodXML, { attrkey: "attr" }, function (err, result) {
        parsedXML = result;
    });
    return parsedXML;
};
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
            this.isOneShot = xmlWeaponStats.attr.isOneShot != 0;
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
var generateAddedWeaponData = function (parsedXML) {
    let ret = {};
    let weapons = [];
    for (let xmlWeapon of parsedXML.WeaponList.Weapon) {
        let weapon = new Weapon(xmlWeapon);
        ret[weapon.name] = weapon.serialize();
    }
    return ret;
};
var writeAddedWeaponData = function (addedWeaponData, filePath) {
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
var main = function () {
    program
        .arguments("<mwo-dir> <script-data-dir>")
        .action(function (mwoDir, scriptDataDir) {
        console.log("MWO base dir: " + mwoDir);
        console.log("Script data dir: " + scriptDataDir);
        //GameData.pak
        let gameData = loadGameData(mwoDir + "/Game/GameData.pak");
        let addedWeaponData = generateAddedWeaponData(gameData.xmlWeaponData);
        writeAddedWeaponData(addedWeaponData, scriptDataDir + "/addedweapondata.ts");
        //Mech data
        const MechDir = mwoDir + "/Game/mechs/";
        let dirContents = FS.readdirSync(MechDir);
        for (let mechFile of dirContents) {
            let mechFilePath = MechDir + mechFile;
            console.log("Processing " + mechFilePath);
            let mechData = loadMechData(mechFilePath);
        }
    })
        .parse(process.argv);
};
main();
//# sourceMappingURL=index.js.map