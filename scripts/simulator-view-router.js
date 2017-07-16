
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
          for (let mechIdx in MechModel.mechTeams[team]) {
            let mech = MechModel.mechTeams[team][mechIdx];
            let mechInfo = mech.getMechState().mechInfo;
            let smurfyId = mechInfo.smurfyMechId;
            let smurfyLoadoutId = mechInfo.smurfyLoadoutId;
            this.teams[team].push({
              "smurfyId" : smurfyId,
              "smurfyLoadoutId" : smurfyLoadoutId,
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
  var saveAppState = function() {
    let ret = new Promise(function(resolve, reject) {
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
        MechView.updateOnAppSaveState();
        resolve(data);
      })
      .fail(function(data) {
        reject(Error(data));
      });
    });
    return ret;
  }

  var loadAppState = function(stateHash) {
    //load state from hash
    let loadStatePromise = new Promise(function(resolve, reject) {
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
        resolve(data);
      })
      .fail(function(data){
        reject(Error(data));
      })
    });

    //load mechs from the state
    let loadStateThenMechsPromise = loadStatePromise
      .then(function(data) {
          let newAppState = new AppState(data);
          //set current app state
          let simulatorParameters = MechSimulatorLogic.getSimulatorParameters();
          if (!simulatorParameters) {
            simulatorParameters = new MechSimulatorLogic.SimulatorParameters();
          }
          simulatorParameters.range = newAppState.range;
          MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
          let loadMechPromise = loadMechsFromSmurfy(newAppState);
          return loadMechPromise.then(function(data) {
            isAppStateModified = false;
            MechView.updateOnLoadAppState();
            return data;
          });
      });

    //TODO: See if the state bookkeeping (isLoading and prevstatehash) can be
    //put in an 'always' block in this function
    return loadStateThenMechsPromise
        .then(function(data) {
          isLoading = false;
          prevStateHash = stateHash;
          return data;
        })
        .catch(function(err) {
          isLoading = false;
          prevStateHash = stateHash;
          throw err;
        });
  }

  //Loads the smurfy mechs from the appState into the model.
  var loadMechsFromSmurfy = function(newAppState) {
    let teamList = [MechModel.Team.BLUE, MechModel.Team.RED];
    let totalMechsToLoad; //total number of mechs to load
    let currMechsLoaded; //current number of mechs loaded
    if (!newAppState.teams) {
      //if no teams, immediately resolve
      isLoading = false;
      return Promise.resolve({});
    }
    for (let team of teamList) {
      if (!newAppState.teams[team]) {
        newAppState.teams[team] = [];
      }
    }

    let CombinedListEntry = function(team, index, mechEntry) {
      return {
        "team" : team,
        "index" : index,
        "mechEntry" : mechEntry,
      }
    };
    let combinedTeamList = [];
    for (let team of teamList) {
      for (let mechIdx in newAppState.teams[team]) {
        let mechEntry = newAppState.teams[team][mechIdx];
        combinedTeamList.push(new CombinedListEntry(team, mechIdx, mechEntry));
      }
    }

    totalMechsToLoad = combinedTeamList.length;
    currMechsLoaded = 0;

    let promiseToEntryMap = new Map();
    let combinedTeamPromiseList = combinedTeamList.map(function(combinedTeamEntry) {
      let mechEntry = combinedTeamEntry.mechEntry;
      let loadMechPromise = MechModel.loadSmurfyMechLoadoutFromID(
        mechEntry.smurfyId, mechEntry.smurfyLoadoutId);
      promiseToEntryMap.set(loadMechPromise, combinedTeamEntry);
      return loadMechPromise;
    });

    let retPromise = combinedTeamPromiseList.reduce(function(prevPromise, currPromise) {
      return prevPromise.then(function() {
          return currPromise.then(function(data) {
            //immediate action on loading a mech
            let smurfyLoadout = data;
            let combinedTeamEntry = promiseToEntryMap.get(currPromise);
            let team = combinedTeamEntry.team;
            let mechIdx = combinedTeamEntry.index;
            let mech_id = MechModel.generateMechId(team, smurfyLoadout);
            MechModel.addMechAtIndex(mech_id, team, smurfyLoadout, mechIdx);
            currMechsLoaded++;
            MechView.updateLoadingScreenProgress(currMechsLoaded / totalMechsToLoad);
            return data;
          });
      });
    }, Promise.resolve());

    return retPromise;
  }

  //Called to let the router know that the app state has changed
  var modifyAppState = function() {
    isAppStateModified = true;
    prevStateHash=HASH_MODIFIED_STATE;
    location.hash=HASH_STATE_FIELD + "=" + HASH_MODIFIED_STATE;
    MechView.updateOnModifyAppState();
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
    Promise.resolve(
      loadAppState(hashState)
        .then(function(data) {
          console.log("Loaded application state from hash: " + hashState);
          successCallback(data);
        })
        .catch(function(data) {
          console.error("Fail on load app state. Hash: " + hashState);
          failCallback(data);
        })
    ).then(function(data) {
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
      Promise.resolve(
        loadAppState(newHash)
          .then(function() {
            //success
            MechModelView.refreshView(true);
            console.log("Hash change state load success: " + newHash);
          })
          .catch(function() {
            //fail
            MechModelView.refreshView(true);
            MechView.updateOnLoadAppError();
            console.log("Hash change state load failed: " + newHash);
          })
      ).then(function() {
        //always
        MechView.hideLoadingScreen();
        console.log("Hash state change load done: " + newHash);
      });
    } else {
      //do nothing if hash did not change
      //TODO: see if this should check if the app is in error and load in data
      //if it is.
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
