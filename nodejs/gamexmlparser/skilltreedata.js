"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs");
var SkillTreeData;
(function (SkillTreeData) {
    class SkillNode {
        constructor(xmlSkillNode) {
            let names = xmlSkillNode.attr.names.split(",");
            let matcher = /^([A-Za-z]+)[0-9]*$/;
            let match = matcher.exec(names[0]);
            this.baseName = match[1];
            this.effects = [];
            for (let xmlEffect of xmlSkillNode.Effect) {
                let skillEffect = new SkillEffect(xmlEffect);
                this.effects.push(skillEffect);
            }
        }
    }
    SkillTreeData.SkillNode = SkillNode;
    class SkillEffect {
        constructor(xmlSkillEffect) {
            this.quirkName = xmlSkillEffect.attr.name;
            this.quirkValues = [];
            if (xmlSkillEffect.Faction) {
                for (let factionEntry of xmlSkillEffect.Faction) {
                    let faction = factionEntry.attr.name;
                    if (factionEntry.WeightClass) {
                        for (let weightClassEntry of factionEntry.WeightClass) {
                            if (weightClassEntry.Tonnage) {
                                for (let tonnageEntry of weightClassEntry.Tonnage) {
                                    let tonnage = Number(tonnageEntry.attr.name);
                                    let quirkValue = Number(tonnageEntry.attr.value);
                                    this.quirkValues.push({
                                        faction,
                                        tonnage,
                                        quirkValue
                                    });
                                }
                            }
                            else {
                                let weightClass = weightClassEntry.attr.name;
                                let quirkValue = Number(weightClassEntry.attr.value);
                                this.quirkValues.push({
                                    faction,
                                    weightClass,
                                    quirkValue
                                });
                            }
                        }
                    }
                    else {
                        let quirkValue = Number(factionEntry.attr.value);
                        this.quirkValues.push({
                            faction,
                            quirkValue
                        });
                    }
                }
            }
            else {
                let quirkValue = Number(xmlSkillEffect.attr.value);
                this.quirkValues.push({ quirkValue });
            }
        }
    }
    SkillTreeData.SkillEffect = SkillEffect;
    SkillTreeData.generateSkillTreeData = function (xmlSkillData) {
        let ret = {};
        for (let xmlSkillNode of xmlSkillData.MechSkillTree.Node) {
            let skillNode = new SkillNode(xmlSkillNode);
            ret[skillNode.baseName] = skillNode;
        }
        return ret;
    };
    SkillTreeData.writeSkillTreeData = function (skillTreeData, filePath) {
        let dataString = JSON.stringify(skillTreeData, null, "\t");
        let writeString = `//Generated from GameData.pak on ${new Date().toUTCString()}
namespace AddedData {
  export var _SkillTreeData : {[index:string] : any} = ${dataString}
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
})(SkillTreeData = exports.SkillTreeData || (exports.SkillTreeData = {}));
//# sourceMappingURL=skilltreedata.js.map