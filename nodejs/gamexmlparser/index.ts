//Reads XML data from GameData.pak and generates javascript files
//for use in mwo-simulator

//NOTE: Nodejs module lookup is different for "./<file>" and "<file>"
//Whoever thought that was a good idea should be SHOT. GIVE MODULES CANONICAL NAMES MOTHERFUCKERS!
import {NumberIndexed, StringIndexed} from "./parser-common";
import {WeaponData} from  "./weapondata";
import {MechData} from "./mechdata";
import {SkillTreeData} from "./skilltreedata"
import program = require('commander');
import AdmZip = require('adm-zip');
import XML2js = require('xml2js');
import FS = require('fs');

const WEAPONSPATH = "Libs/Items/Weapons/Weapons.xml";
interface GameData {
  xmlWeaponData : WeaponData.XMLWeaponData;
  xmlSkillTreeData : SkillTreeData.XMLSkillTreeData;
}
interface GameDataPath {
  name : string,
  path : string,
}
const GameDataPaths : GameDataPath[] = [
  { name : "xmlWeaponData",
    path : "Libs/Items/Weapons/Weapons.xml",
  },
  { name : "xmlSkillTreeData",
    path : "Libs/MechPilotTalents/MechSkillTreeNodes.xml",
  }
]
var loadGameData = function(gameDataPakFile : string) : GameData {
  var gameDataZip = new AdmZip(gameDataPakFile);
  let ret : GameData = {
    xmlWeaponData : null,
    xmlSkillTreeData : null,
  };
  for (let gamePath of GameDataPaths) {
    var parseResult : any;
    let weaponsXML = gameDataZip.readAsText(gamePath.path);
    XML2js.parseString(weaponsXML, {attrkey:"attr"}, function(err : any, result : any) {
      parseResult = result;
    });
    (ret as StringIndexed)[gamePath.name] = parseResult;
  }

  return ret;
}

var loadMechData = function (mechPakFile : string) : MechData.XMLMechData {
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

var parseMechOmnipods = function(mechZip : AdmZip, mechName : string, mechPathInZip : string) : MechData.XMLOmnipodData {
  const OmnipodPathInZip = mechPathInZip + `${mechName}-omnipods.xml`;
  let omnipodXML = mechZip.readAsText(OmnipodPathInZip);
  var parsedXML : MechData.XMLOmnipodData;
  XML2js.parseString(omnipodXML, {attrkey:"attr"}, function(err: any, result: any) {
    parsedXML = result as MechData.XMLOmnipodData;
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
      //weapons
      let addedWeaponData = WeaponData.generateAddedWeaponData(gameData.xmlWeaponData);
      WeaponData.writeAddedWeaponData(addedWeaponData, scriptDataDir + "/addedweapondata.ts");
      //skills
      let skillData = SkillTreeData.generateSkillTreeData(gameData.xmlSkillTreeData);
      SkillTreeData.writeSkillTreeData(skillData, scriptDataDir + "/skilltreedata.ts");
      //Mech data
      const MechDir = mwoDir + "/Game/mechs/";
      let dirContents = FS.readdirSync(MechDir);
      for (let mechFile of dirContents) {
        let mechFilePath = MechDir + mechFile;
        console.log("Processing " + mechFilePath);
        let mechData = loadMechData(mechFilePath);
        MechData.collectOmnipodSets(mechData.xmlOmnipodData);
      }
      MechData.writeOmnipodSets(scriptDataDir + "/addedomnipoddata.ts");
    })
    .parse(process.argv);
}

main();
