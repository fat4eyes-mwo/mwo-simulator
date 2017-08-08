"use strict";
//Reads XML data from GameData.pak and generates javascript files
//for use in mwo-simulator
Object.defineProperty(exports, "__esModule", { value: true });
const weapondata_1 = require("./weapondata");
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
var main = function () {
    program
        .arguments("<mwo-dir> <script-data-dir>")
        .action(function (mwoDir, scriptDataDir) {
        console.log("MWO base dir: " + mwoDir);
        console.log("Script data dir: " + scriptDataDir);
        //GameData.pak
        let gameData = loadGameData(mwoDir + "/Game/GameData.pak");
        let addedWeaponData = weapondata_1.WeaponData.generateAddedWeaponData(gameData.xmlWeaponData);
        weapondata_1.WeaponData.writeAddedWeaponData(addedWeaponData, scriptDataDir + "/addedweapondata.ts");
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