"use strict";

//Test code.
namespace MechTest {
  import Team = MechModelCommon.Team;
  import WeaponCycle = MechModelCommon.WeaponCycle;
  import Component = MechModelCommon.Component;
  import SimulatorParameters = SimulatorSettings.SimulatorParameters;

  type Mech = MechModel.Mech;
  type WeaponDamage = MechModel.WeaponDamage;
  type DamageMap = MechModel.DamageMap;
  type AccuracyPattern = MechAccuracyPattern.AccuracyPattern;

  var uiTestInterval: number = null;
  var testIntervalLength = 100;
  var mechIdWeaponCount = []; //number of weapons set for a given mechid

  //Load dummy data from javascript files in data folder
  var initDummyModelData = function() {
    MechModel.setInitModelData(
      DummyWeaponData,
      DummyAmmoData,
      DummyMechData,
      DummyModuleData,
      _DummyOmnipods);
  };

  export var testUIWidgets = function() {
    MechView.init();
    initDummyModelData();
    initTestModelState();
    MechModelView.refreshView();

    var createHandler = function() {
      return () => {
        if (uiTestInterval == null) {
          uiTestInterval = window.setInterval(() => {
            testUI(MechModel.getMechTeam(Team.BLUE));
            testUI(MechModel.getMechTeam(Team.RED));
          }, testIntervalLength);
        } else {
          window.clearInterval(uiTestInterval);
          uiTestInterval = null;
        }
      };
    };
    var handler = createHandler();
    $("#testUI").removeClass("debugButton").click(handler);
  }

  var testUI = function(mechTeam: Mech[]) {
    var weaponStates = [WeaponCycle.READY,
                        WeaponCycle.FIRING,
                        WeaponCycle.DISABLED];
    $.each(mechTeam, (index, mech) => {
      for (var property in Component) {
        if (Component.hasOwnProperty(property)) {
          let paperDoll = MechViewMechPanel.PaperDoll.getPaperDoll(mech.getMechId());
          paperDoll.setPaperDollArmor(Component[property], Math.random());
          paperDoll.setPaperDollStructure(Component[property], Math.random());
        }
      }
      let heatbar = MechViewMechPanel.Heatbar.getHeatbar(mech.getMechId());
      heatbar.setHeatbarValue(Math.random());
      for (var i = 0; i < mech.getMechInfo().weaponInfoList.length; i++) {
        let weaponPanel = MechViewMechPanel.WeaponPanel.getWeaponPanel(mech.getMechId());
        weaponPanel.setWeaponCooldown(i, Math.random());
        weaponPanel.setWeaponAmmo(i, Math.random() > 0.2 ? Math.floor(Math.random() * 100) : -1);
        weaponPanel.setWeaponState(i, weaponStates[Math.floor(weaponStates.length * Math.random())]);
      }
    });
  }

  export var testModelInit = function() {
    MechModel.initModelData()
      .then(function() {
        Util.log("Successfully loaded model init data");
      })
      .catch(function(err) {
        Util.log("Failed to load model init data");
      });
  }

  export var testModelOps = function() {
    initDummyModelData();
    // MechModel.addMech("testCheetahId", Team.BLUE, DummyArcticCheetah);
    // MechModel.addMech("testExecutionerId", Team.BLUE, DummyExecutioner);
    MechModel.addMech("testMaulerId", Team.RED, DummyMauler);
    // MechModel.addMech("testFirestarterId", Team.RED, DummyFireStarter);
    MechModel.addMech("testBattlemasterId", Team.RED, DummyBattleMaster);
  }

  export var testModelBaseHealth = function() {
    for (var tonnage = 20; tonnage <= 100; tonnage += 5) {
      for (var property in Component) {
        if (Component.hasOwnProperty(property)) {
          var structure = MechModel.baseMechStructure(Component[property], tonnage);
          var armor = MechModel.baseMechArmor(Component[property], tonnage);
          Util.log("Tonnage: " + tonnage + " " + Component[property] +
                        " structure:" + structure + " armor:" + armor);
        }
      }
    }
  }

  export var testModelView = function() {
    MechView.init();
    initDummyModelData();
    initTestModelState();

    MechModelView.refreshView();

    $("#resetState").removeClass("debugButton").click(() => {
      MechModel.resetState();
      MechModelView.refreshView();
    });

    $("#testModelView").removeClass("debugButton").click(() => {
      //set mech healths to random numbers
      let teams = [Team.BLUE, Team.RED];
      for (let team of teams) {
        for (let mech of MechModel.getMechTeam(team)) {
          let mechState = mech.getMechState();
          //random component health
          for (let mechComponentHealth of mechState.mechHealth.componentHealthList) {
            mechComponentHealth.armor = Math.random() * mechComponentHealth.maxArmor;
            mechComponentHealth.structure = Math.random() * mechComponentHealth.maxStructure;
          }
          MechModelView.updateHealth(mech);

          mechState.heatState.currHeat = Math.random() * mechState.heatState.currMaxHeat;
          MechModelView.updateHeat(mech);

          //random weapon state
          for (let weaponIndex in mechState.weaponStateList) {
            if (!mechState.weaponStateList.hasOwnProperty(weaponIndex)) {
              continue;
            }
            let weaponState = mechState.weaponStateList[weaponIndex];
            let WEAPON_CYCLES = [];
            for (let weaponCycle in WeaponCycle) {
              if (WeaponCycle.hasOwnProperty(weaponCycle)) {
                WEAPON_CYCLES.push(WeaponCycle[weaponCycle]);
              }
            }

            weaponState.weaponCycle = WEAPON_CYCLES[Math.floor(Math.random() * WEAPON_CYCLES.length)];
            let weaponInfo = weaponState.weaponInfo;
            weaponState.spoolupLeft = Math.random() * Number(weaponInfo.spinup);
            weaponState.cooldownLeft = Math.random() * Number(weaponInfo.cooldown);

          }

          //random weapon ammoState
          let ammoCounts = mechState.ammoState.ammoCounts;
          for (let weaponId in ammoCounts) {
            if (ammoCounts.hasOwnProperty(weaponId)) {
              let ammoCount = ammoCounts[weaponId];
              ammoCount.ammoCount = Math.floor(Math.random() * ammoCount.maxAmmoCount);
            }
          }
          MechModelView.updateCooldown(mech);
          MechModelView.updateWeaponStatus(mech);
        }
      }
    });
  }

  export var testDamageAtRange = function() {
    initDummyModelData();
    let ppcID = 1009;
    let srm6ID = 1031;
    let atm12ID = 1252;
    let testIds = [ppcID, srm6ID, atm12ID];
    var mechInfo = new MechModel.MechInfo("testId", DummyStormcrow);
    for (let weaponId of testIds) {
      var weaponInfoTest = new MechModelWeapons.WeaponInfo(String(weaponId), "centre_torso",
        MechModel.getSmurfyWeaponData(String(weaponId)), mechInfo);
      Util.log("Weapon " + weaponInfoTest.translatedName +
        " minRange: " + weaponInfoTest.minRange +
        " optRange: " + weaponInfoTest.optRange +
        " maxRange: " + weaponInfoTest.maxRange +
        " baseDmg: " + weaponInfoTest.baseDmg);
      let testRanges = [0, 90, 180, 270, 300, 500, 540, 810, 1080, 2000];
      const stepDuration = 50;
      for (let range of testRanges) {
        let damage = weaponInfoTest.damageAtRange(range);
        Util.log("range: " + range + " damage: " + damage);
      }
    }
  }

  export var testSpreadAdjacentDamage = function() {
    var printTestDamageTransform = function(damage: DamageMap, pattern: AccuracyPattern) {
      let weaponDamage = new MechModel.WeaponDamage(damage);
      let transformedDamage = accuracyPattern(weaponDamage, 200);
      Util.log("original damage: " + weaponDamage.toString());
      Util.log("transformedDamage: " + transformedDamage.toString());
    }
    let accuracyPattern = MechAccuracyPattern.accuracySpreadToAdjacent(0.5, 0.5, 0);
    let accuracyPatternNext = MechAccuracyPattern.accuracySpreadToAdjacent(0.5, 0.3, 0.2);
    let testDamage: DamageMap = {
        "centre_torso": 10,
        "right_torso": 2.5,
        "left_torso": 2.5,
      };
    printTestDamageTransform(testDamage, accuracyPattern);
    printTestDamageTransform(testDamage, accuracyPatternNext);

    testDamage = { "head": 10 };
    printTestDamageTransform(testDamage, accuracyPattern);
    printTestDamageTransform(testDamage, accuracyPatternNext);

    testDamage = { "left_torso": 10, "centre_torso": 2.5, "left_arm": 2.5 };
    printTestDamageTransform(testDamage, accuracyPattern);
    printTestDamageTransform(testDamage, accuracyPatternNext);

    testDamage = { "left_arm": 10, "left_torso": 2.5 };
    printTestDamageTransform(testDamage, accuracyPattern);
    printTestDamageTransform(testDamage, accuracyPatternNext);
  }

  export var testListQuirks = function() {
    MechModel.initModelData()
    .then(
      function() {
        Util.log("Loaded model data");
        var rawModelData = MechModel.getRawModelData();

        let quirkMap: { [index: string]: SmurfyTypes.SmurfyQuirk } = {};
        //mech quirks
        let rawMechData = rawModelData.mechData;
        for (let mechIdx in rawMechData) {
          if (!rawMechData.hasOwnProperty(mechIdx)) {
            continue;
          }
          let smurfyMech = rawMechData[mechIdx];
          let quirks = smurfyMech.details.quirks;
          if (quirks) {
            for (let quirkEntry of quirks) {
              if (!quirkMap[quirkEntry.name]) {
                  quirkMap[quirkEntry.name] = quirkEntry;
              }
            }
          }
        }
        //omnipod quirks
        let rawOmnipodData = rawModelData.omnipodData;
        for (let omnipodId in rawOmnipodData) {
          if (!rawOmnipodData.hasOwnProperty(omnipodId)) {
            continue;
          }
          let omnipodData = rawOmnipodData[omnipodId];
          let quirks = omnipodData.configuration.quirks;
          if (quirks) {
            for (let quirkEntry of quirks) {
              if (!quirkMap[quirkEntry.name]) {
                quirkMap[quirkEntry.name] = quirkEntry;
              }
            }
          }
        }
        //omnipod set quirks
        for (let omnipodSetName in AddedData._AddedOmnipodData ) {
          if (!AddedData._AddedOmnipodData.hasOwnProperty(omnipodSetName)) {
            continue;
          }
          let omnipodSet = AddedData._AddedOmnipodData[omnipodSetName] as SmurfyTypes.OmnipodSet;
          for (let quirkEntry of omnipodSet.setBonusQuirks) {
            if (!quirkMap[quirkEntry.name]) {
                quirkMap[quirkEntry.name] = quirkEntry;
            }
          }
        }
    
        //skill quirks
        for (let skillName in AddedData._SkillTreeData) {
          if (!AddedData._SkillTreeData.hasOwnProperty(skillName)) {
            continue;
          }
          let skillNode = AddedData._SkillTreeData[skillName];
          for (let skillEffect of skillNode.effects) {
            let quirkEntry = {
              name : skillEffect.quirkName,
              translated_name : skillEffect.quirkTranslatedName,
              value : 0, //filler value, we just need the names
            };
            if (!quirkMap[quirkEntry.name]) {
              quirkMap[quirkEntry.name] = quirkEntry;
            }
          }
        }
    
        //print out quirk list
        let numQuirks = 0;
        let sortedQuirkNames = [];
        for (let quirkName in quirkMap) {
          if (!quirkMap.hasOwnProperty(quirkName)) {
            continue;
          }
          sortedQuirkNames.push(quirkName);
        }
        sortedQuirkNames.sort();
        for (let quirkName of sortedQuirkNames) {
          let quirkEntry = quirkMap[quirkName];
          Util.log(`${quirkEntry.name}\t${quirkEntry.translated_name}`);
          numQuirks++;
        }
        Util.log("numQuirks : " + numQuirks);
      }
    )
    .catch(
      function() {
        Util.error("Unable to load model data");
      }
    )
  }

  export var testSimulation = function() {
    //Use DummyData
    // initDummyModelData();
    // this.generateTestUI( );

    //Load data from smurfy
    MechView.init();
    
    MechView.showLoadingScreen();
    MechModel.initModelData()
      .then(function() {
        Util.log("Successfully loaded model init data");
        MechTest.generateTestUI();
      })
      .catch(function() {
        Util.log("Failed to load model init data");
      });
  }

  export var generateTestUI = function() {
    MechView.hideLoadingScreen();

    initTestModelState();
    MechModelView.refreshView();

    $("#resetState").removeClass("debugButton").click(() => {
      MechModel.resetState();
      MechModelView.refreshView();
    });

    $("#runSimulationButton").removeClass("debugButton").click(() => {
      MechSimulatorLogic.runSimulation();
    });

    $("#pauseSimulationButton").removeClass("debugButton").click(() => {
      MechSimulatorLogic.pauseSimulation();
    });

    $("#resetSimulationButton").removeClass("debugButton").click(() => {
      MechSimulatorLogic.resetSimulation();
    });

    $("#stepSimulationButton").removeClass("debugButton").click(() => {
      MechSimulatorLogic.stepSimulation();
    });

    $("#refreshUIButton").removeClass("debugButton").click(() => {
      MechModelView.refreshView();
    });

    $("#saveStateButton").removeClass("debugButton").click(() => {
      Promise.resolve(MechViewRouter.saveAppState()
        .then(function(data) {
          Util.log("Success on save app state. Data: " + data);
          Util.log("statehash: " + data.statehash);
          return data;
        })
        .catch(function(data) {
          Util.log("Fail on save app state. Data: " + data);
        })
      ).then(function(data) {
        Util.log("Done save app state. Data: " + data);
      });
    });

    $("#loadStateButton").removeClass("debugButton").click(() => {
      let hashState = location.hash;
      let regex = /#s=([^&]*)/;
      let results = regex.exec(hashState);
      if (!results) {
        Util.log("Invalid state in hash: " + hashState);
        return;
      }
      hashState = results[1];
      MechView.showLoadingScreen();
      Promise.resolve(MechViewRouter.loadAppState(hashState)
        .then(function(data) {
          Util.log("Success on load app state. Data: " + data);
          MechModelView.refreshView();
          return data;
        })
        .catch(function(data) {
          Util.log("Fail on load app state. Data: " + data);
        })
      ).then(function(data) {
        Util.log("Done on load app state. Data: " + data);
        MechView.hideLoadingScreen();
      });
    });
  }

  export var testPersistence = function() {
    var statehash : string;
    initDummyModelData();
    initTestModelState();
    MechView.init();

    MechView.showLoadingScreen();
    Promise.resolve(MechViewRouter.saveAppState()
      .then(function(data) {
        Util.log("Success on save app state. Data: " + data);
        Util.log("statehash: " + data.statehash);
        statehash = data.statehash;
        testGetAppState(statehash);
        return data;
      })
      .catch(function(data) {
        Util.log("Fail on save app state. Data: " + data);
      })
    ).then(function(data) {
      Util.log("Done save app state. Data: " + data);
    });

    var testGetAppState = function(hash : string) {
      Promise.resolve(MechViewRouter.loadAppState(statehash)
        .then(function(data) {
          Util.log("Success on load app state. Data: " + data);
          MechModelView.refreshView();
          return data;
        })
        .catch(function(data) {
          Util.log("Fail on load app state. Data: " + data);
        })
      ).then(function(data) {
        MechView.hideLoadingScreen();
        Util.log("Done on load app state. Data: " + data);
      })
    };

    $("#saveStateButton").removeClass("debugButton").click(() => {
      Promise.resolve(MechViewRouter.saveAppState()
        .then(function(data) {
          Util.log("Success on save app state. Data: " + data);
          Util.log("statehash: " + data.statehash);
          return data;
        })
        .catch(function(data) {
          Util.log("Fail on save app state. Data: " + data);
        })
      ).then(function(data) {
        Util.log("Done save app state. Data: " + data);
      });
    });

    $("#loadStateButton").removeClass("debugButton").click(() => {
      let hashState = location.hash;
      let regex = /#s=([^&]*)/;
      let results = regex.exec(hashState);
      if (!results) {
        Util.log("Invalid state in hash: " + hashState);
        return;
      }
      hashState = results[1];
      MechView.showLoadingScreen();
      Promise.resolve(MechViewRouter.loadAppState(hashState)
        .then(function(data) {
          Util.log("Success on load app state. Data: " + data);
          MechModelView.refreshView();
          return data;
        })
        .catch(function(data) {
          Util.log("Fail on load app state. Data: " + data);
        })
      ).then(function(data) {
        Util.log("Done on load app state. Data: " + data);
        MechView.hideLoadingScreen();
      });
    });
  }

  var initTestModelState = function() {
    const DEFAULT_RANGE = 200;

    MechModel.addMech("testKodiakId1", Team.BLUE, DummyKodiak);
    MechModel.addMech("testExecutionerId", Team.BLUE, DummyExecutioner);
    MechModel.addMech("testTimberwolfId", Team.BLUE, DummyTimberwolf);
    MechModel.addMech("testStormcrowId", Team.BLUE, DummyStormcrow);
    MechModel.addMech("testCheetahId", Team.BLUE, DummyArcticCheetah);
    MechModel.addMech("testMadDogId", Team.BLUE, DummyMadDog);

    MechModel.addMech("testMaulerId", Team.RED, DummyMauler);
    MechModel.addMech("testBattlemasterId", Team.RED, DummyBattleMaster);
    MechModel.addMech("testWarhammerId", Team.RED, DummyWarHammer);
    MechModel.addMech("testShadowhawkId", Team.RED, DummyShadowhawk);
    MechModel.addMech("testFirestarterId", Team.RED, DummyFireStarter);
    MechModel.addMech("testCatapultId", Team.RED, DummyCatapult);
    MechModel.addMech("testUrbanmechId1", Team.RED, DummyUrbanmech);

    let simulatorParameters = new SimulatorParameters(
      DEFAULT_RANGE, //range
      1, //speed factor
    );
    MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
    MechModel.initMechTeamPatterns(MechModel.getMechTeam(Team.BLUE));
    MechModel.initMechTeamPatterns(MechModel.getMechTeam(Team.RED));
  }

  export var testLRMSpread = function() {
    var newTestDamage = () => {
      return new MechModel.WeaponDamage({ "centre_torso": 10 });
    }
    let testDamage = newTestDamage();

    let lrmSpreadList = [
      { name: "LRM5", spread: GlobalGameInfo._LRM5Spread },
      { name: "LRM10", spread: GlobalGameInfo._LRM10Spread },
      { name: "LRM15", spread: GlobalGameInfo._LRM15Spread },
      { name: "LRM20", spread: GlobalGameInfo._LRM20Spread },
      { name: "ALRM5", spread: GlobalGameInfo._ALRM5Spread },
      { name: "ALRM10", spread: GlobalGameInfo._ALRM10Spread },
      { name: "ALRM15", spread: GlobalGameInfo._ALRM15Spread },
      { name: "ALRM20", spread: GlobalGameInfo._ALRM20Spread },
      { name: "cLRM5", spread: GlobalGameInfo._cLRM5Spread },
      { name: "cLRM10", spread: GlobalGameInfo._cLRM10Spread },
      { name: "cLRM15", spread: GlobalGameInfo._cLRM15Spread },
      { name: "cLRM20", spread: GlobalGameInfo._cLRM20Spread },
      { name: "cALRM5", spread: GlobalGameInfo._cALRM5Spread },
      { name: "cALRM10", spread: GlobalGameInfo._cALRM10Spread },
      { name: "cALRM15", spread: GlobalGameInfo._cALRM15Spread },
      { name: "cALRM20", spread: GlobalGameInfo._cALRM20Spread },
    ]

    for (let lrm of lrmSpreadList) {
      Util.log("----------------------------------------------");
      Util.log(lrm.name + " spread");
      let lrmPattern = MechAccuracyPattern.seekerPattern(lrm.spread);
      let range = 180;
      let transformedDamage = lrmPattern(newTestDamage(), range);
      Util.log("Range: " + range + " " + transformedDamage.toString());

      for (range = 200; range <= 1000; range += 100) {
        transformedDamage = lrmPattern(newTestDamage(), range);
        Util.log("Range: " + range + " " + transformedDamage.toString());
      }
    }
  }

  export var testEventQueue = function() {
    let eventQueue = new Events.EventQueue();

    interface TestEvent extends Events.Event {
      data : string;
    }

    let listener1 = function(event : TestEvent) : void {
      Util.log(`listener1 ${event.type} ${event.data}`);
    }
    let listener2 = function(event : TestEvent) : void {
      Util.log(`listener2 ${event.type} ${event.data}`);
    }
    let listener3 = function(event : TestEvent) : void {
      Util.log(`listener3 ${event.type} ${event.data}`);
    }
    
    eventQueue.addListener(listener1, "foo", "bar");
    eventQueue.addListener(listener2, "foo", "baz");
    eventQueue.addListener(listener3, "baz");
    eventQueue.addListener(listener3, "foo");

    Util.log(eventQueue.debugString());

    eventQueue.queueEvent({type: "foo", data: "foo1"});
    eventQueue.queueEvent({type: "bar", data: "bar1"});
    eventQueue.queueEvent({type: "baz", data: "baz1"});
    eventQueue.queueEvent({type: "foo", data: "foo2"});
    eventQueue.queueEvent({type: "bar", data: "bar2"});
    eventQueue.queueEvent({type: "baz", data: "baz2"});

    setTimeout(() => {
      eventQueue.removeListener(listener1);
      eventQueue.removeListener(listener3, "foo");
      Util.log(eventQueue.debugString());

      eventQueue.queueEvent({type: "foo", data: "foo1"});
      eventQueue.queueEvent({type: "foo", data: "foo2"});
      eventQueue.queueEvent({type: "bar", data: "bar1"});
      eventQueue.queueEvent({type: "bar", data: "bar2"});
      eventQueue.queueEvent({type: "baz", data: "baz1"});
      eventQueue.queueEvent({type: "baz", data: "baz2"});

      setTimeout(()=> {
        eventQueue.removeListener(listener2);
        eventQueue.removeListener(listener3);
        Util.log(eventQueue.debugString());

        eventQueue.queueEvent({type: "foo", data: "foo1"});
        eventQueue.queueEvent({type: "foo", data: "foo2"});
        eventQueue.queueEvent({type: "bar", data: "bar1"});
        eventQueue.queueEvent({type: "bar", data: "bar2"});
        eventQueue.queueEvent({type: "baz", data: "baz1"});
        eventQueue.queueEvent({type: "baz", data: "baz2"});

        Util.log("Done");
      }, 1000);
      }, 1000);
  }

  var testScratch = function() {
    //Scratch test
  }

}
