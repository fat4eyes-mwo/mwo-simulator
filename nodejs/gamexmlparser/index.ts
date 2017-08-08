//Reads XML data from GameData.pak and generates javascript files
//for use in mwo-simulator

//NOTE: Nodejs module lookup is different for ./<file> and <file>
//Whoever thought that was a good idea should be SHOT. GIVE MODULES CANONICAL NAMES MOTHERFUCKERS!
import {NumberIndexed, StringIndexed} from "./common";
import {WeaponData} from  "./weapondata";
import program = require('commander');
import AdmZip = require('adm-zip');
import XML2js = require('xml2js');
import FS = require('fs');

const WEAPONSPATH = "Libs/Items/Weapons/Weapons.xml";
interface GameData {
  xmlWeaponData : WeaponData.XMLWeaponData;
}
var loadGameData = function(gameDataPakFile : string) : GameData {
  var gameDataZip = new AdmZip(gameDataPakFile);

  var parseResult : WeaponData.XMLWeaponData;
  let weaponsXML = gameDataZip.readAsText(WEAPONSPATH);
  XML2js.parseString(weaponsXML, {attrkey:"attr"}, function(err : any, result : any) {
    parseResult = result as WeaponData.XMLWeaponData;
  });

  return {
    xmlWeaponData : parseResult
  };
}

interface XMLMechData {
  mechName : string;
  xmlOmnipodData : XMLOmnipodData;
}
interface XMLOmnipodData {
  attr : any;
}
var loadMechData = function (mechPakFile : string) : XMLMechData {
  let mechNameRegex : RegExp = /^.*[\\\\\/]([A-Za-z]+)\.pak$/ //Regexes are still unreadable AF.
  let matches : NumberIndexed = mechNameRegex.exec(mechPakFile);
  let mechName = (matches as NumberIndexed)[1];
  const MechPathInZip = `Objects/mechs/${mechName}/`;

  let mechZip = new AdmZip(mechPakFile);
  let xmlOmnipodData = parseMechOmnipods(mechZip, mechName, MechPathInZip);
  return {
    mechName,
    xmlOmnipodData
  }
}

var parseMechOmnipods = function(mechZip : AdmZip, mechName : string, mechPathInZip : string) : XMLOmnipodData {
  const OmnipodPathInZip = mechPathInZip + `${mechName}-omnipods.xml`;
  let omnipodXML = mechZip.readAsText(OmnipodPathInZip);
  var parsedXML :XMLOmnipodData;
  XML2js.parseString(omnipodXML, {attrkey:"attr"}, function(err: any, result: any) {
    parsedXML = result as XMLOmnipodData;
  });
  return parsedXML;
}

var main = function() {
  program
    .arguments("<mwo-dir> <script-data-dir>")
    .action(function(mwoDir : string, scriptDataDir : string) {
      console.log("MWO base dir: " + mwoDir);
      console.log("Script data dir: " + scriptDataDir);

      //GameData.pak
      let gameData = loadGameData(mwoDir + "/Game/GameData.pak");
      let addedWeaponData = WeaponData.generateAddedWeaponData(gameData.xmlWeaponData);
      WeaponData.writeAddedWeaponData(addedWeaponData, scriptDataDir + "/addedweapondata.ts");

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
}

main();
