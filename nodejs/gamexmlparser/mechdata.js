"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs");
var MechData;
(function (MechData) {
    class Quirk {
        constructor(name, value) {
            this.name = name;
            this.value = Number(value);
            this.translated_name = this.translateName();
        }
        translateName() {
            //TODO: translate names
            return this.name;
        }
        toString() {
            return `{name: "${this.name}", value: "${this.value}"}`;
        }
    }
    class OmnipodSet {
        constructor(xmlOmnipodSet) {
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
        quirksToString() {
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
      }`;
        }
    }
    let collectedOmnipodSets = new Map();
    MechData.collectOmnipodSets = function (xmlData) {
        if (!xmlData) {
            return;
        }
        for (let omnipodSet of xmlData.OmniPods.Set) {
            let set = new OmnipodSet(omnipodSet);
            collectedOmnipodSets.set(set.name, set);
        }
    };
    MechData.writeOmnipodSets = function (filePath) {
        let jsonSets = {};
        for (let setName of collectedOmnipodSets.keys()) {
            let set = collectedOmnipodSets.get(setName);
            jsonSets[set.name] = set;
        }
        let dataString = JSON.stringify(jsonSets, null, "\t");
        let writeString = `//Generated from Game/mechs/*.pak on ${new Date().toUTCString()}
namespace AddedData {
  export var _AddedOmnipodData : {[index:string] : any} = ${dataString}
}
`;
        FS.writeFile(filePath, writeString, function (err) {
            if (err) {
                console.error("Error writing file " + filePath + " : " + err);
            }
            else {
                console.log("File written: " + filePath);
            }
        });
    };
})(MechData = exports.MechData || (exports.MechData = {}));
//# sourceMappingURL=mechdata.js.map