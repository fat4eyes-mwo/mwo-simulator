
"use strict";

//Router. Deals with interactions of the application state and the url hash fragment
//Uses the ./php/simulator-persistence.php for storing application state to server
var MechViewRouter = MechViewRouter || (function() {

  const PERSISTENCE_URL = "./php/simulator-persistence.php";
  const PERSISTENCE_STATE_FIELD = "state";
  const HASH_STATE_FIELD = "s";

  const HASH_MODIFIED_STATE = "MODIFIED";

  var isAppStateModified = true;
  var prevStateHash = "";
  var isLoading = false;

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
      isAppStateModified = false;
      prevStateHash = data.statehash;
      window.history.replaceState(
          null, "", "#" + HASH_STATE_FIELD + "=" + data.statehash);
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
    MechModel.clearModel();
    MechSimulatorLogic.resetSimulation();

    isLoading = true;
    //ajax get request to simulator-persistence
    $.ajax({
      url: PERSISTENCE_URL + "?" + HASH_STATE_FIELD + "=" + stateHash,
      type : 'GET',
      dataType : 'JSON'
    })
    .done(function(data) {
      let newAppState = new AppState(data);
      //set current app state
      let simulatorParameters = MechSimulatorLogic.getSimulatorParameters();
      if (!simulatorParameters) {
        simulatorParameters = new MechSimulatorLogic.SimulatorParameters();
      }
      simulatorParameters.range = newAppState.range;
      MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
      //Load mechs from smurfy and add them to model
      loadMechsFromSmurfy(newAppState, stateHash,
              successCallback, failCallback, alwaysCallback);
    })
    .fail(function(data){
      //restore previous history on fail
      let hash = "#" + HASH_STATE_FIELD + "=" + prevStateHash;
      window.history.replaceState(null, "", hash);
      failCallback(data);
      //On failure, call the alwaysCallback, becauuse the always handler on this
      //ajax call does nothing so as not to trigger the done callback early when
      //the request is Successfully
      isLoading = false;
      alwaysCallback(data);
    })
    .always(function(data) {
      //Do not call anything here, this is just the always callback of the
      //request to get state. The successCallback should only be called once
      //all the mech data have been loaded from calling the smurfyAPI
    });

    //Loads the smurfy mechs from the appState into the model. Only calls the
    //appropriate callback once ALL mechs have been loaded.
    var loadMechsFromSmurfy = function(newAppState, stateHash,
                                successCallback, failCallback, alwaysCallback) {
      let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
      let totalMechsToLoad; //total number of mechs to load
      let currMechsLoaded; //current number of mechs loaded
      if (!newAppState.teams) {
        //if no teams, immediately call the success callback
        successCallback(true);
        alwaysCallback(true);
        isLoading = false;
        return;
      }
      for (let team of teamList) {
        if (!newAppState.teams[team]) {
          newAppState.teams[team] = [];
        }
      }
      let combinedTeamList = newAppState.teams[MechModel.Team.BLUE].concat(
          newAppState.teams[MechModel.Team.RED]
      );
      totalMechsToLoad = combinedTeamList.length;
      currMechsLoaded = 0;
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
                  currMechsLoaded++;
                  MechView.updateLoadingScreenProgress(currMechsLoaded / totalMechsToLoad);
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
                    isAppStateModified = false;
                    prevStateHash = stateHash;
                    successCallback(true);
                  } else {
                    failCallback(false);
                  }
                  isLoading = false;
                  alwaysCallback(data);
                }
              });
        }
      }
    }
  }

  //Called to let the router know that the app state has changed
  var modifyAppState = function() {
    isAppStateModified = true;
    prevStateHash=HASH_MODIFIED_STATE;
    location.hash=HASH_STATE_FIELD + "=" + HASH_MODIFIED_STATE;
  }

  var getStateHashFromLocation = function() {
    let fragmentHash = location.hash;
    let regex = /#s=([^&]*)/;
    let results = regex.exec(fragmentHash);
    let hashState;
    if (!results) {
      hashState = null;
    } else {
      hashState = results[1];
    }
    return hashState;
  }

  var loadStateFromLocationHash = function(successCallback,
                                      failCallback, alwaysCallback) {

    let hashState = getStateHashFromLocation();
    if (!hashState) {
      hashState = "default";
      prevStateHash = hashState; //to avoid triggering the hash change handler
      location.hash = HASH_STATE_FIELD + "=default";
    }
    MechViewRouter.loadAppState(hashState,
      function(data) {
        console.log("Loaded application state from hash: " + hashState);
        successCallback(data);
      },
      function(data) {
        console.log("Fail on load app state. Hash: " + hashState);
        failCallback(data);
      },
      function(data) {
        console.log("Done on load app state. hash: " + hashState);
        alwaysCallback(data);
      });
  }

  var initViewRouter = function() {
    //Listen to hash changes
    window.addEventListener("hashchange", hashChangeListener, false);
  }

  var hashChangeListener = function() {
    console.log("Hash change: " + location.hash);
    if (isLoading) {
      //ignore hash change, change back to previous hash
      let hash = "#" + HASH_STATE_FIELD + "=" + prevStateHash;
      window.history.replaceState(null, "", hash);
      return;
    }
    let newHash = getStateHashFromLocation();
    if (newHash !== prevStateHash) {
      //if hash is different from previous hash, load new state
      MechView.showLoadingScreen();
      console.log("Hash change loading new state from hash : " + newHash);
      loadAppState(newHash,
        function(data) {
          //success
          MechModelView.refreshView(true);
          console.log("Hash change state load success: " + newHash);
        },
        function(data) {
          //fail
          //TODO show error dialog
          console.log("Hash change state load failed: " + newHash);
        },
        function(data) {
          //always
          MechView.hideLoadingScreen();
          console.log("Hash state change load done: " + newHash);
        });
    } else {
      //do nothing
    }
  }

  return {
    saveAppState : saveAppState,
    loadAppState : loadAppState,
    loadStateFromLocationHash : loadStateFromLocationHash,
    modifyAppState: modifyAppState,
    initViewRouter : initViewRouter,
  };
})();
