"use strict";

//Router. Deals with interactions of the application state and the url hash fragment
//Uses the ./php/simulator-persistence.php for storing application state to server
namespace MechViewRouter {
  import Team = MechModelCommon.Team;
  import SimulatorParameters = SimulatorSettings.SimulatorParameters;
  import EventType = MechModelCommon.EventType;

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
    skills? : PersistedSkillState,
  }
  interface PersistedSkillState {
    type : string,
    state : string,
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
          let mechTeam = MechModel.getMechTeam(team);
          for (let mechIdx in mechTeam) {
            if (!mechTeam.hasOwnProperty(mechIdx)) {
              continue;
            }
            let mech = MechModel.getMechTeam(team)[mechIdx];
            let mechInfo = mech.getMechState().mechInfo;
            let smurfyId = mechInfo.smurfyMechId;
            let smurfyLoadoutId = mechInfo.smurfyLoadoutId;
            let teamEntry : PersistedMechState = {
              "smurfyId" : smurfyId,
              "smurfyLoadoutId" : smurfyLoadoutId,
            };
            if (mechInfo.skillState) {
              teamEntry.skills = mechInfo.skillState;
            }
            this.teams[team].push(teamEntry);
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
          let newTeamEntry : PersistedMechState = {
            "smurfyId" : teamEntry.smurfyId,
            "smurfyLoadoutId" : teamEntry.smurfyLoadoutId
          };
          if (teamEntry.skills) {
            newTeamEntry.skills = teamEntry.skills;
          }
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
        MechModelView.getEventQueue().queueEvent({type: EventType.APP_STATE_SAVED});
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
            MechModelView.getEventQueue().queueEvent({type: EventType.APP_STATE_LOADED});
            return mechLoadoutData;
          });
      });

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
      let newStateTeams = newAppState.teams[team];
      for (let mechIdx in newStateTeams) {
        if (!newStateTeams.hasOwnProperty(mechIdx)) {
          continue;
        }
        let mechEntry = newAppState.teams[team][mechIdx];
        combinedTeamList.push(createCombinedListEntry(team, Number(mechIdx), mechEntry));
      }
    }

    totalMechsToLoad = combinedTeamList.length;
    currMechsLoaded = 0;

    let promiseToEntryMap = new Map<Promise<any>, CombinedListEntry>();
    let combinedTeamPromiseList = combinedTeamList.map(function(combinedTeamEntry) {
      let mechEntry = combinedTeamEntry.mechEntry;

      let mechAndSkillPromises : Array<Promise<any>> = [];
      let loadMechPromise =
        MechModel.loadSmurfyMechLoadoutFromID(mechEntry.smurfyId,
                                              mechEntry.smurfyLoadoutId);
      mechAndSkillPromises.push(loadMechPromise);
      if (mechEntry.skills) {
        let skillLoader = MechModelSkills.getSkillLoader(mechEntry.skills.type);
        let loadSkillsPromise = skillLoader.loadSkillsFromState(mechEntry.skills.state);
        mechAndSkillPromises.push(loadSkillsPromise);
      }

      let combinedPromise = Promise.all(mechAndSkillPromises);
      
      promiseToEntryMap.set(combinedPromise, combinedTeamEntry);
      return combinedPromise;
    });

    let retPromise = combinedTeamPromiseList.reduce(function(prevPromise, currPromise) {
      return prevPromise.then(function() {
          return currPromise.then(function(data) {
            //immediate action on loading a mech
            let smurfyLoadout = data[0];
            let combinedTeamEntry = promiseToEntryMap.get(currPromise);
            let team = combinedTeamEntry.team;
            let mechIdx = combinedTeamEntry.index;
            let mechId = MechModel.generateMechId(smurfyLoadout);
            let newMech = MechModel.addMechAtIndex(mechId, team, smurfyLoadout, mechIdx);
            if (combinedTeamEntry.mechEntry.skills) {
              let skillData = data[1];
              let skillState = combinedTeamEntry.mechEntry.skills;
              newMech.setSkillState(skillState);
              let skillLoader = MechModelSkills.getSkillLoader(skillState.type);
              let skillQuirks = skillLoader.convertDataToMechQuirks(skillData, mechId);
              newMech.applySkillQuirks(skillQuirks);
            }
            currMechsLoaded++;
            MechView.updateLoadingScreenProgress(currMechsLoaded / totalMechsToLoad);
            return data;
          });
      });
    }, Promise.resolve([]));

    return retPromise;
  }

  //listener to APP_STATE_CHANGE event
  var modifyAppState = function(event : Events.Event) {
    isAppStateModified = true;
    prevStateHash = HASH_MODIFIED_STATE;
    setParamToLocationHash(HASH_STATE_FIELD, HASH_MODIFIED_STATE);
  }

  var setParamToLocationHash =
      function(param : string, value : string, replaceHistory = false) : void {
    let paramValues = new Map<string, string>();
    for (let currParam of HASH_FIELDS) {
      let currValue = Util.getParamFromLocationHash(currParam);
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

  export var getRunFromLocation = function() : string {
    return Util.getParamFromLocationHash(HASH_RUN_FIELD);
  }

  export var getSpeedFromLocation = function() : string {
    return Util.getParamFromLocationHash(HASH_SPEED_FIELD);
  }

  var getStateHashFromLocation = function() :string {
    return Util.getParamFromLocationHash(HASH_STATE_FIELD);
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

    //Event queue listener
    MechModelView.getEventQueue().addListener(modifyAppState, EventType.APP_STATE_CHANGE);
  }

  var hashChangeListener = function() : void {
    Util.log("Hash change: " + location.hash);
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
      Util.log("Hash change loading new state from hash : " + newHash);
        loadAppState(newHash)
          .then(function() {
            //success
            MechModelView.refreshView();
            Util.log("Hash change state load success: " + newHash);
          })
          .catch(function() {
            //fail
            MechModelView.refreshView();
            MechModelView.getEventQueue().queueEvent({type: EventType.APP_STATE_LOAD_ERROR});
            Util.log("Hash change state load failed: " + newHash);
          })
          .then(function() {
            //always
            MechView.hideLoadingScreen();
            Util.log("Hash state change load done: " + newHash);
          });
    } else {
      //do nothing if hash did not change
      //TODO: see if this should check if the app is in error and load in data
      //if it is.
    }
  }
}
