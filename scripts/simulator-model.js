"use strict";

var MechModel = MechModel || (function () {

  var Team = {
    BLUE : "blue",
    RED : "red"
  };

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

  var SmurfyWeaponData = {};
  var SmurfyAmmoData = {};
  var SmurfyMechData = {};
  var mechLists = {};
  mechLists[Team.BLUE] = [];
  mechLists[Team.RED] = [];

  //Get weapon, ammo and mech data from smurfy
  //TODO: JSONP not parsing the output correctly.
  var WEAPON_DATA_URL = "http://mwo.smurfy-net.de/api/data/weapons.json";
  var AMMO_DATA_URL = "http://mwo.smurfy-net.de/api/data/ammo.json";
  var LOADOUT_DATA_URL = "http:/mwo.smurfy-net.de/api/data/mechs/{ID}/loadouts/{LOADOUTID}.json";
  var dataLoaded = (function() {
    return {
      weaponsLoaded : false, //true when the request in successfully completed
      ammoLoaded : false,
      weaponsDone : false, //true when the request is finished (success or fail)
      ammoDone : false,
      isLoaded : function () {
        return this.weaponsLoaded && this.ammoLoaded;
      },
      isDone : function () {
        return this.weaponsDone && this.ammoDone;
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
  }

  //Load dummy data from javascript files in data folder
  var initDummyModelData = function() {
    SmurfyWeaponData = DummyWeaponData;
    SmurfyAmmoData = DummyAmmoData;
    SmurfyMechData = DummyMechData;
  };

  var getSmurfyMechData = function(smurfyMechId) {
    return SmurfyMechData[smurfyMechId];
  };

  //constructor
  var Mech = function (new_mech_id, smurfyMechLoadout) {
    var smurfy_mech_id = smurfyMechLoadout.mech_id;
    var smurfyMechData = getSmurfyMechData(smurfy_mech_id);
    var mech_id = new_mech_id;
    return {
      getName : function() {
        return smurfyMechData.name;
      },
      getTranslatedName : function () {
        return smurfyMechData.translated_name;
      },
      getMechId : function() {
        return mech_id;
      }
    };
  };

  var addMech = function(mech_id, team, smurfyMechLoadout) {
    var newMech = new Mech(mech_id, smurfyMechLoadout);
    mechLists[team].push(newMech);
    console.log("addMech mech_id: " + mech_id +
      " translated_mech_name: " + newMech.getTranslatedName());
  };

  //public members
  return {
    Component: Component,
    WeaponState: WeaponState,
    Team : Team,
    initModelData : initModelData,
    initDummyModelData : initDummyModelData,
    dataLoaded : dataLoaded,
    addMech : addMech
  };

})(); //namespace end
