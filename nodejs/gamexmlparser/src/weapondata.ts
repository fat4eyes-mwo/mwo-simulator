import {NumberIndexed, StringIndexed} from "./parser-common";
import FS = require('fs');

export namespace WeaponData {
  //TODO: Tighten these types
  export interface XMLWeaponData {
    WeaponList : any;
  }
  export interface XMLWeaponEntry {
    attr : any;
    Ranges : any[];
    WeaponStats : any[];
  }
  export interface XMLRangeEntry {
    attr : any;
  }

  var weaponIdMap = new Map();
  class Weapon {
    id : string;
    name : string;
    ammo_per_shot : number;
    jamming_chance : number;
    jammed_time : number;
    shots_during_cooldown : number;
    spinup : number;
    rof : number;
    rampUpTime : number;
    rampDownTime : number;
    jamRampUpTime : number;
    jamRampDownTime : number;
    isOneShot : boolean;
    volleyDelay : number;
    speed : number;
    ranges : RangeEntry[];
    constructor(xmlWeaponEntry : XMLWeaponEntry) {
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
    inheritFrom(otherWeapon : Weapon) {
      for (let attr in otherWeapon) {
        if (attr !== "id" && attr !== "name") {
          (this as StringIndexed)[attr] = (otherWeapon as StringIndexed)[attr];
        }
      }
    }
    serialize() {
      let ret : StringIndexed = {};
      for (let attr in this) {
        if (attr !== 'id' && attr !== 'name') {
          ret[attr] = this[attr];
        }
      }
      return ret;
    }
  }
  class RangeEntry {
    start : number;
    damageModifier : number;
    interpolationToNextRange : string;
    constructor(xmlRangeEntry : XMLRangeEntry) {
      this.start = Number(xmlRangeEntry.attr.start);
      this.damageModifier = Number(xmlRangeEntry.attr.damageModifier);
      this.interpolationToNextRange = xmlRangeEntry.attr.interpolationToNextRange;
    }
  }
  export var generateAddedWeaponData = function (parsedXML : XMLWeaponData) {
    let ret : StringIndexed = {};
    let weapons = [];
    for (let xmlWeapon of parsedXML.WeaponList.Weapon) {
      let weapon = new Weapon(xmlWeapon);
      ret[weapon.name] = weapon.serialize();
    }
    return ret;
  }

  export var writeAddedWeaponData = function(addedWeaponData : StringIndexed, filePath : string) {
    let dataString = JSON.stringify(addedWeaponData, null, "\t");
    let writeString = "//Generated from GameData.pak " + new Date().toUTCString() + "\n";
    writeString += "namespace AddedData {\n\n";
    writeString += "export var _AddedWeaponData : {[index:string] : any} = ";
    writeString += dataString + ";";
    writeString += "\n}";
    FS.writeFile(filePath, writeString, function(err : any) {
      if (err) {
        console.error("Error writing file " + filePath + " : " + err);
      } else {
        console.log("File written: " + filePath);
      }
    });
  }
}
