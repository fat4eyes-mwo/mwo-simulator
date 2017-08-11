"use strict";
//Reads XML data from GameData.pak and generates javascript files
//for use in mwo-simulator
Object.defineProperty(exports, "__esModule", { value: true });
const weapondata_1 = require("./weapondata");
const mechdata_1 = require("./mechdata");
const skilltreedata_1 = require("./skilltreedata");
const program = require("commander");
const AdmZip = require("adm-zip");
const XML2js = require("xml2js");
const FS = require("fs");
const WEAPONSPATH = "Libs/Items/Weapons/Weapons.xml";
const GameDataPaths = [
    { name: "xmlWeaponData",
        path: "Libs/Items/Weapons/Weapons.xml",
    },
    { name: "xmlSkillTreeData",
        path: "Libs/MechPilotTalents/MechSkillTreeNodes.xml",
    }
];
var loadGameData = function (gameDataPakFile) {
    var gameDataZip = new AdmZip(gameDataPakFile);
    let ret = {
        xmlWeaponData: null,
        xmlSkillTreeData: null,
    };
    for (let gamePath of GameDataPaths) {
        var parseResult;
        let weaponsXML = gameDataZip.readAsText(gamePath.path);
        XML2js.parseString(weaponsXML, { attrkey: "attr" }, function (err, result) {
            parseResult = result;
        });
        ret[gamePath.name] = parseResult;
    }
    return ret;
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
var main = function () {
    program
        .arguments("<mwo-dir> <script-data-dir>")
        .action(function (mwoDir, scriptDataDir) {
        console.log("MWO base dir: " + mwoDir);
        console.log("Script data dir: " + scriptDataDir);
        //GameData.pak
        let gameDataPath = mwoDir + "/Game/GameData.pak";
        console.log("Processing " + gameDataPath);
        let gameData = loadGameData(gameDataPath);
        //weapons
        let addedWeaponData = weapondata_1.WeaponData.generateAddedWeaponData(gameData.xmlWeaponData);
        weapondata_1.WeaponData.writeAddedWeaponData(addedWeaponData, scriptDataDir + "/addedweapondata.ts");
        //skills
        let skillData = skilltreedata_1.SkillTreeData.generateSkillTreeData(gameData.xmlSkillTreeData);
        skilltreedata_1.SkillTreeData.writeSkillTreeData(skillData, scriptDataDir + "/skilltreedata.ts");
        //Mech data
        const MechDir = mwoDir + "/Game/mechs/";
        let dirContents = FS.readdirSync(MechDir);
        for (let mechFile of dirContents) {
            let mechFilePath = MechDir + mechFile;
            console.log("Processing " + mechFilePath);
            let mechData = loadMechData(mechFilePath);
            mechdata_1.MechData.collectOmnipodSets(mechData.xmlOmnipodData);
        }
        mechdata_1.MechData.writeOmnipodSets(scriptDataDir + "/addedomnipoddata.ts");
    })
        .parse(process.argv);
};
main();
//# sourceMappingURL=index.js.map