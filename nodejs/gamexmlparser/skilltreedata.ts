import FS = require('fs');

export namespace SkillTreeData {

  export interface XMLSkillTreeData {
    MechSkillTree: XMLMechSkillTree;
  }
  export interface XMLMechSkillTree {
    Node : XMLSkillNode[];
  }
  export interface XMLSkillNode {
    attr : any; //{names}
    Effect : XMLSkillEffect[];
    Affects : XMLSkillAffectedEquipment[];
  }
  export interface XMLSkillEffect {
    attr : any; //{name, value}
    Faction : XMLSkillFaction[];
  }
  export interface XMLSkillAffectedEquipment {
    attr : any; //{weapon}
  }
  export interface XMLSkillFaction {
    attr : any; //{name : IS|Clan, value}
    WeightClass?: XMLSkillWeightClass[];
  }
  export interface XMLSkillWeightClass {
    attr : any; //{name : Light | Medium | Heavy | Asssault, value}
    Tonnage: XMLSkillTonnage[];
  }
  export interface XMLSkillTonnage {
    attr: any; //{name : <tons>, value}
  }
  export interface SkillTreeData {
    [index:string] : SkillNode
  }
  export interface SkillNode {
    baseName : string;
    effects : SkillEffect[]
  }
  export interface SkillEffect {
    quirkName : string;
    quirkValues : SkillValue[];
  }
  export interface SkillValue {
    faction? : string,
    weightClass? : string,
    tonnage? : number,
    quirkValue : number,
  }
  export class SkillNode implements SkillNode {
    baseName : string;
    effects: SkillEffect[];
    constructor(xmlSkillNode : XMLSkillNode) {
      let names = xmlSkillNode.attr.names.split(",");
      let matcher = /^([A-Za-z]+)[0-9]*$/
      let match = matcher.exec(names[0]);
      this.baseName = match[1];
      this.effects = [];
      for (let xmlEffect of xmlSkillNode.Effect) {
        let skillEffect = new SkillEffect(xmlEffect);
        this.effects.push(skillEffect);
      }
    }
  }
  export class SkillEffect implements SkillEffect {
    quirkName : string;
    quirkValues : SkillValue[];
    constructor(xmlSkillEffect : XMLSkillEffect) {
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
                    quirkValue});
                }
              } else {
                let weightClass = weightClassEntry.attr.name;
                let quirkValue = Number(weightClassEntry.attr.value);
                this.quirkValues.push({
                  faction,
                  weightClass,
                  quirkValue});
              }
            }
          } else {
            let quirkValue = Number(factionEntry.attr.value);
            this.quirkValues.push({
              faction,
              quirkValue});
          }
        }
      } else {
        let quirkValue = Number(xmlSkillEffect.attr.value);
        this.quirkValues.push({quirkValue});
      }
    }
  }
  export var generateSkillTreeData = function(xmlSkillData : XMLSkillTreeData ) : SkillTreeData  {
    let ret : SkillTreeData= {};
    for (let xmlSkillNode of xmlSkillData.MechSkillTree.Node) {
      let skillNode = new SkillNode(xmlSkillNode);
      ret[skillNode.baseName] = skillNode;
    }
    return ret;
  }
  export var writeSkillTreeData = function(skillTreeData : SkillTreeData, filePath : string) {
    let dataString = JSON.stringify(skillTreeData, null, "\t");
    let writeString =
`//Generated from GameData.pak on ${new Date().toUTCString()}
namespace AddedData {
  export var _SkillTreeData : {[index:string] : any} = ${dataString}
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
