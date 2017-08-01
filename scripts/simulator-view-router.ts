/// <reference path="common/simulator-model-common.ts" />
/// <reference path="common/simulator-settings.ts" />
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-view.ts" />
/// <reference path="simulator-logic.ts" />
"use strict";

//Router. Deals with interactions of the application state and the url hash fragment
//Uses the ./php/simulator-persistence.php for storing application state to server
namespace MechViewRouter {
  import Team = MechModelCommon.Team;
  import SimulatorParameters = SimulatorSettings.SimulatorParameters;

  const PERSISTENCE_URL = "./php/simulator-persistence.php";
  const PERSISTENCE_STATE_FIELD = "state";
  const HASH_STATE_FIELD = "s";
  const HASH_RUN_FIELD = "autorun";
  const HASH_SPEED_FIELD = "speed";
  const HASH_FIELDS = [HASH_STATE_FIELD, HASH_RUN_FIELD, HASH_SPEED_FIELD];

  const HASH_MODIFIED_STATE = "MODIFIED";
  const HASH_DEFAULT_STATE = "default";

  var isAppStateModified = true;
  var prevStateHash = "";
  var isLoading = false;

  //Note: storing the mechTeams in the URL is not feasible due to the sheer
  //length of the layoutids. Just persist the app state in the server and
  //send the hashed filename to the URL same as smurfy does.

  //The object transmitted/received from the server
  interface RemotePersistedState {
    state : PersistedState;
  }
  //The current state of the application
  interface PersistedState {
    range : number,
    teams : {[index:string] : PersistedMechState[]}
  }
  interface PersistedMechState {
    smurfyId : string,
    smurfyLoadoutId : string,
  }
  class AppState {
    range : number;
    teams : {[index:string] : PersistedMechState[]};

    //if no parameters, from current app state
    //else read the contents of loadedAppState into the object
    constructor(loadedAppState? : RemotePersistedState) {
      if (arguments.length === 1) {
        this.range = loadedAppState.state.range;
        this.teams = loadedAppState.state.teams;
      } else if (arguments.length === 0) {
        //current app state
        this.range = SimulatorSettings.getSimulatorParameters().range;
        this.teams = {};
        let teamList = [Team.BLUE, Team.RED];
        for (let team of teamList) {
          this.teams[team] = [];
          for (let mechIdx in MechModel.getMechTeam(team)) {
            let mech = MechModel.getMechTeam(team)[mechIdx];
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
    serialize() : RemotePersistedState {
      let ret : PersistedState = {range : null, teams : {}};
      ret.range = this.range;
      ret.teams = {};
      let teamList = [Team.BLUE, Team.RED];
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
  export var saveAppState = function() : Promise<any> {
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
        setParamToLocationHash(HASH_STATE_FIELD, data.statehash, true);
        MechView.updateOnAppSaveState();
        resolve(data);
      })
      .fail(function(data) {
        reject(Error(String(data)));
      });
    });
    return ret;
  }

  export var loadAppState = function(stateHash : string) : Promise<any> {
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
        reject(Error(String(data)));
      })
    });

    //load mechs from the state
    let loadStateThenMechsPromise = loadStatePromise
      .then(function(stateData) {
          let newAppState = new AppState(stateData as RemotePersistedState);
          //set current app state
          let simulatorParameters = SimulatorSettings.getSimulatorParameters();
          if (!simulatorParameters) {
            simulatorParameters =
                new SimulatorParameters(newAppState.range);
          }
          simulatorParameters.range = newAppState.range;
          MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
          let loadMechPromise = loadMechsFromSmurfy(newAppState);
          return loadMechPromise.then(function(mechLoadoutData) {
            isAppStateModified = false;
            MechView.updateOnLoadAppState();
            return mechLoadoutData;
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
  var loadMechsFromSmurfy = function(newAppState : AppState) : Promise<any> {
    let teamList = [Team.BLUE, Team.RED];
    let totalMechsToLoad : number; //total number of mechs to load
    let currMechsLoaded : number; //current number of mechs loaded
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

    interface CombinedListEntry {
      team : Team;
      index : number;
      mechEntry : PersistedMechState;
    }
    let createCombinedListEntry =
        function(team : Team,
                index : number,
                mechEntry : PersistedMechState)
                : CombinedListEntry {
      return {
        "team" : team,
        "index" : index,
        "mechEntry" : mechEntry,
      }
    };

    let combinedTeamList : CombinedListEntry[] = [];
    for (let team of teamList) {
      for (let mechIdx in newAppState.teams[team]) {
        let mechEntry = newAppState.teams[team][mechIdx];
        combinedTeamList.push(createCombinedListEntry(team, Number(mechIdx), mechEntry));
      }
    }

    totalMechsToLoad = combinedTeamList.length;
    currMechsLoaded = 0;

    let promiseToEntryMap = new Map<Promise<any>, CombinedListEntry>();
    let combinedTeamPromiseList = combinedTeamList.map(function(combinedTeamEntry) {
      let mechEntry = combinedTeamEntry.mechEntry;
      let loadMechPromise =
        MechModel.loadSmurfyMechLoadoutFromID(mechEntry.smurfyId,
                                              mechEntry.smurfyLoadoutId);
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
            let mechId = MechModel.generateMechId(smurfyLoadout);
            MechModel.addMechAtIndex(mechId, team, smurfyLoadout, mechIdx);
            currMechsLoaded++;
            MechView.updateLoadingScreenProgress(currMechsLoaded / totalMechsToLoad);
            return data;
          });
      });
    }, Promise.resolve());

    return retPromise;
  }

  //Called to let the router know that the app state has changed
  export var modifyAppState = function() {
    isAppStateModified = true;
    prevStateHash = HASH_MODIFIED_STATE;
    setParamToLocationHash(HASH_STATE_FIELD, HASH_MODIFIED_STATE);
    MechView.updateOnModifyAppState();
  }

  var setParamToLocationHash =
      function(param : string, value : string, replaceHistory = false) : void {
    let paramValues = new Map<string, string>();
    for (let currParam of HASH_FIELDS) {
      let currValue = getParamFromLocationHash(currParam);
      if (!currValue && param !== currParam) {
        continue;
      }
      if (param === currParam) {
        paramValues.set(currParam, value);
      } else {
        paramValues.set(currParam, currValue);
      }
    }
    let first = true;
    let newHashString = "";
    for (let currParam of paramValues.keys()) {
      if (!first) {
        newHashString += "&";
      } else {
        first = false;
      }
      newHashString += `${currParam}=${paramValues.get(currParam)}`;
    }
    if (!replaceHistory) {
      location.hash = newHashString;
    } else {
      window.history.replaceState(null, "", "#" + newHashString);
    }
  }

  var getParamFromLocationHash = function(param : string) : string {
    let fragmentHash = location.hash;
    if (fragmentHash.startsWith("#")) {
      fragmentHash = fragmentHash.substring(1);
    }
    fragmentHash = "&" + fragmentHash;
    let regex = new RegExp(".*&" + param + "=([^&]*).*");
    let results = regex.exec(fragmentHash);
    if (results) {
      return results[1];
    } else {
      return null;
    }
  }

  export var getRunFromLocation = function() : string {
    return getParamFromLocationHash(HASH_RUN_FIELD);
  }

  export var getSpeedFromLocation = function() : string {
    return getParamFromLocationHash(HASH_SPEED_FIELD);
  }

  var getStateHashFromLocation = function() :string {
    return getParamFromLocationHash(HASH_STATE_FIELD);
  }

  export var loadStateFromLocationHash = function() : Promise<any> {
    let hashState = getStateHashFromLocation();
    if (!hashState) {
      hashState = HASH_DEFAULT_STATE;
      prevStateHash = hashState; //to avoid triggering the hash change handler
      setParamToLocationHash(HASH_STATE_FIELD, HASH_DEFAULT_STATE);
    }
    return loadAppState(hashState);
  }

  export var initViewRouter = function() : void {
    //Listen to hash changes
    window.addEventListener("hashchange", hashChangeListener, false);
  }

  var hashChangeListener = function() : void {
    console.log("Hash change: " + location.hash);
    if (isLoading) {
      //ignore hash change, change back to previous hash
      let hash = `#${HASH_STATE_FIELD}=${prevStateHash}`;
      setParamToLocationHash(HASH_STATE_FIELD, prevStateHash, true);
      return;
    }
    let newHash = getStateHashFromLocation();
    if (newHash !== prevStateHash) {
      //if hash is different from previous hash, load new state
      MechView.showLoadingScreen();
      console.log("Hash change loading new state from hash : " + newHash);
        loadAppState(newHash)
          .then(function() {
            //success
            MechModelView.refreshView();
            console.log("Hash change state load success: " + newHash);
          })
          .catch(function() {
            //fail
            MechModelView.refreshView();
            MechView.updateOnLoadAppError();
            console.log("Hash change state load failed: " + newHash);
          })
          .then(function() {
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
}
