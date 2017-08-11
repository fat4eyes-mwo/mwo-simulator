import {StringIndexed, NumberIndexed, Quirk} from "./parser-common";
import FS = require('fs');

export namespace MechData {
  export interface XMLMechData {
    mechName : string;
    xmlOmnipodData : XMLOmnipodData;
  }
  export interface XMLOmnipodData {
    OmniPods : XMLOmnipod;
  }
  export interface XMLOmnipod {
    Set : XMLOmnipodSet[];
  }
  export interface XMLOmnipodSet {
    SetBonuses : XMLSetBonus[];
    attr : StringIndexed;//{name}
  }
  export interface XMLSetBonus {
    Bonus : XMLBonus[];
  }
  export interface XMLBonus {
    Quirk : XMLQuirk[];
    attr : StringIndexed;//{piececount}
  }
  export interface XMLQuirk {
    attr : StringIndexed;//{name, value}
  }

  class OmnipodSet {
    name : string;
    setBonusQuirks : Quirk[];
    constructor(xmlOmnipodSet : XMLOmnipodSet) {
      this.name = xmlOmnipodSet.attr.name;
      this.setBonusQuirks = [];

      for (let xmlSetBonus of xmlOmnipodSet.SetBonuses) {
        for (let xmlBonus of xmlSetBonus.Bonus) {
          for (let xmlQuirk of xmlBonus.Quirk) {
            this.setBonusQuirks.push(new Quirk(xmlQuirk.attr.name, xmlQuirk.attr.value));
          }
        }
      }
    }
    quirksToString() : string {
      let ret = "";
      for (let quirk of this.setBonusQuirks) {
        ret += quirk.toString() + ", \n";
      }
      return ret;
    }
    toString() {
      return `{
        name : "${this.name}",
        setQuirks : [${this.quirksToString()}]
      }`
    }
  }

  let collectedOmnipodSets = new Map<string, OmnipodSet>();
  export var collectOmnipodSets = function(xmlData : XMLOmnipodData) {
    if (!xmlData) {
      return;
    }
    for (let omnipodSet of xmlData.OmniPods.Set) {
      let set = new OmnipodSet(omnipodSet);
      collectedOmnipodSets.set(set.name, set);
    }
  }

  export var writeOmnipodSets = function(filePath : string) {
    let jsonSets : StringIndexed= {};
    for (let setName of collectedOmnipodSets.keys()) {
      let set = collectedOmnipodSets.get(setName);
      jsonSets[set.name] = set;
    }
    let dataString = JSON.stringify(jsonSets, null, "\t");
    let writeString =
`//Generated from Game/mechs/*.pak on ${new Date().toUTCString()}
namespace AddedData {
  export var _AddedOmnipodData : {[index:string] : any} = ${dataString}
}
`;
    FS.writeFile(filePath, writeString, function(err : any) {
      if (err) {
        console.error("Error writing file " + filePath + " : " + err);
      } else {
        console.log("File written: " + filePath);
      }
    });
  }
}
