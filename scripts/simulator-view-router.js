
"use strict";

//Router. Deals with interactions of the application state and the url hash fragment
//Uses the ./php/simulator-persistence.php for storing application state to server
var MechViewRouter = MechViewRouter || (function() {

  const PERSISTENCE_URL = "./php/simulator-persistence.php";
  const PERSISTENCE_STATE_FIELD = "state";
  const HASH_STATE_FIELD = "s";

  const HASH_MODIFIED_STATE = "MODIFIED";

  var isAppStateModified = true;

  //Note: storing the mechTeams in the URL is not feasible due to the sheer
  //length of the layoutids. Just persist the app state in the server and
  //send the hashed filename to the URL same as smurfy does.

  //The current state of the application
  //format is {range : <range>, teams : {blue : [{smurfyId1, smurfyLoadoutId1}, ...], red: [...]}
  class AppState {
    //if no parameters, from current app state
    //else read the contents of loadedAppState into the object
    constructor(loadedAppState) {
      if (arguments.length == 1) {
        this.range = loadedAppState.state.range;
        this.teams = loadedAppState.state.teams;
      } else if (arguments.length == 0) {
        //current app state
        this.range = MechSimulatorLogic.getSimulatorParameters().range;
        this.teams = {};
        let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
        for (let team of teamList) {
          this.teams[team] = [];
          for (let mech of MechModel.mechTeams[team]) {
            let mechInfo = mech.getMechState().mechInfo;
            let smurfyId = mechInfo.smurfyMechId;
            let smurfyLoadoutId = mechInfo.smurfyLoadoutId;
            this.teams[team].push({
              "smurfyId" : smurfyId,
              "smurfyLoadoutId" : smurfyLoadoutId
            });
          }
        }
      }
    }

    //returns a serialized version of the object. Can't just pass the object itself
    //because we may need to add methods to it, and that will show up if we pass
    //the appstate directly to ajax
    //Format of the result is
    //{state:
    //  { range: <range>,
    //    teams: {"blue" :[{"smurfyId" :<blueid1>, "smurfyLoadoutId": <blue1id>}...]}
    //            , "red" : [<redteamentries>]}}}
    serialize() {
      let ret = {};
      ret.range = this.range;
      ret.teams = {};
      let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
      for (let team of teamList) {
        ret.teams[team] = [];
        for (let teamEntry of this.teams[team]) {
          let newTeamEntry = {
            "smurfyId" : teamEntry.smurfyId,
            "smurfyLoadoutId" : teamEntry.smurfyLoadoutId
          };
          ret.teams[team].push(newTeamEntry);
        }
      }
      return {"state" : ret};
    }
  }

  //saves the current application state to the server for sharing
  var saveAppState = function(successCallback, failCallback, alwaysCallback) {
    let appState = new AppState();
    $.ajax({
      url : PERSISTENCE_URL,
      type : 'POST',
      dataType : 'JSON',
      data : appState.serialize(),
    })
    .done(function(data) {
      location.hash = HASH_STATE_FIELD + "=" + data.statehash;
      isAppStateModified = false;
      successCallback(data);
    })
    .fail(function(data) {
      failCallback(data);
    })
    .always(function(data) {
      alwaysCallback(data);
    });
  }

  var loadAppState = function(stateHash, successCallback, failCallback, alwaysCallback) {
    //TODO: Implement
    //ajax get simulator-persistence
    $.ajax({
      url: PERSISTENCE_URL + "?" + HASH_STATE_FIELD + "=" + stateHash,
      type : 'GET',
      dataType : 'JSON'
    })
    .done(function(data) {
      let newAppState = new AppState(data);
      //TODO: set current app state
      MechSimulatorLogic.setSimulatorParameters(newAppState.range);
      //TODO: Load mechs from smurfy and add them to model
      let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
      let combinedTeamList = newAppState.teams[MechModel.Team.BLUE].concat(
          newAppState.teams[MechModel.Team.RED]
      );
      let smurfyLoadTrigger = new Trigger(combinedTeamList);
      for (let team of teamList) {
        for (let mechIdx in newAppState.teams[team]) {
          let mechEntry = newAppState.teams[team][mechIdx];
          MechModel.loadSmurfyMechLoadoutFromID(
                mechEntry.smurfyId, mechEntry.smurfyLoadoutId,
              function(data) {
                  //success
                  let smurfyLoadout = data;
                  let mech_id = MechModel.generateMechId(team, smurfyLoadout);
                  MechModel.addMechAtIndex(mech_id, team, smurfyLoadout, mechIdx);
                  smurfyLoadTrigger.setSuccess(mechEntry);
              },
              function(data) {
                //fail
                smurfyLoadTrigger.setFail(mechEntry);
              },
              function(data) {
                //done
                smurfyLoadTrigger.setDone(mechEntry);
                if (smurfyLoadTrigger.isDone()) {
                  if (smurfyLoadTrigger.isSuccessful()) {
                    successCallback(true);
                  } else {
                    failCallback(false);
                  }
                  alwaysCallback(data);
                }
              });
        }
      }
    })
    .fail(function(data){
      failCallback(data);
    })
    .always(function(data) {
      //Do not call anything here, this is just the always callback of the
      //request to get state. The successCallback should only be called once
      //all the mech data have been loaded from calling the smurfyAPI
    });

    //Loads the smurfy mechs from the appState into the model. Only calls the
    //appropriate callback once ALL mechs have been loaded.
    var loadMechsFromSmurfy = function(appState, successCallback, failCallback, alwaysCallback) {

    }
  }

  var modifyAppState = function() {
    isAppStateModified = true;
    location.hash=HASH_MODIFIED_STATE;
  }

  return {
    saveAppState : saveAppState,
    loadAppState : loadAppState,
  };
})();
