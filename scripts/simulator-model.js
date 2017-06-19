"use strict";

var MechModel = MechModel || (function () {

  var Component = {
    HEAD : "head",
    RIGHT_ARM :"right_arm",
    RIGHT_TORSO : "right_torso",
    CENTRE_TORSO : "centre_torso",
    LEFT_ARM : "left_arm",
    LEFT_TORSO : "left_torso",
    RIGHT_LEG : "right_leg",
    LEFT_LEG : "left_leg"
  };

  var WeaponState = {
    ACTIVE : "Active",
    FIRING : "Firing",
    DISABLED : "Disabled"
  };

  var WeaponData = {};
  var AmmoData = {};
  var MechData = {};

  //Get weapon, ammo and mech data from smurfy
  var WEAPON_DATA_URL = "http://mwo.smurfy-net.de/api/data/weapons.json";
  var AMMO_DATA_URL = "http://mwo.smurfy-net.de/api/data/ammo.json";
  var MECH_DATA_URL = "http://mwo.smurfy-net.de/api/data/mechs.json";
  var LOADOUT_DATA_URL = "http:/mwo.smurfy-net.de/api/data/mechs/{ID}/loadouts/{LOADOUTID}.json";
  var dataLoaded = (function() {
    return {
      weaponsLoaded : false, //true when the request in successfully completed
      ammoLoaded : false,
      mechsLoaded : false,
      weaponsDone : false, //true when the request is finished (success or fail)
      ammoDone : false,
      mechsDone : false,
      isLoaded : function () {
        return this.weaponsLoaded && this.ammoLoaded && this.mechsLoaded;
      },
      isDone : function () {
        return this.weaponsDone && this.ammoDone && this.mechsDone;
      }
    };
  })();
  var initModelData = function (callback) {
    //Get weapon data
    $.ajax({
      url : WEAPON_DATA_URL,
      type : 'GET',
      dataType : 'JSONP'
      })
      .done(function (data) {
        console.log("Success " +data);
        MechModel.dataLoaded.weaponsLoaded = true;
      })
      .fail(function (data) {
        console.log("Request failed: " + data);
      })
      .always(function (data) {
        MechModel.dataLoaded.weaponsDone = true;
        if (MechModel.dataLoaded.isDone()) {
          callback(MechModel.dataLoaded.isLoaded());
        }
      });
    $.ajax({
      url : AMMO_DATA_URL,
      type : 'GET',
      dataType : 'JSONP'
      })
      .done(function (data) {
        console.log("Success " +data);
        MechModel.dataLoaded.ammoLoaded = true;
      })
      .fail(function (data) {
        console.log("Request failed: " + data);
      })
      .always(function (data) {
        MechModel.dataLoaded.ammoDone = true;
        if (MechModel.dataLoaded.isDone()) {
          callback(MechModel.dataLoaded.isLoaded());
        }
      });
    $.ajax({
      url : MECH_DATA_URL,
      type : 'GET',
      dataType : 'JSONP'
      })
      .done(function (data) {
        console.log("Success " +data);
        MechModel.dataLoaded.mechsLoaded = true;
      })
      .fail(function (data) {
        console.log("Request failed: " + data);
      })
      .always(function (data) {
        MechModel.dataLoaded.mechsDone = true;
        if (MechModel.dataLoaded.isDone()) {
          callback(MechModel.dataLoaded.isLoaded());
        }
      });
  }

  var initDummyModelData = function() {
    this.WeaponData = DummyWeaponData;
    this.AmmoData = DummyAmmoData;
    this.MechData = DummyMechData;
  }

  //public members
  return {
    Component: Component,
    WeaponState: WeaponState,
    initModelData : initModelData,
    initDummyModelData : initDummyModelData,
    dataLoaded : dataLoaded
  };

})(); //namespace end
