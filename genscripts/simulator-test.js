"use strict";
//NOTE:Most tests require dummy data, so make sure to change index.html to
//include the data/dummyXXX.js files when using these functions
//TODO: Move simulator-test and dummydata into a separate project
//Test code.
var MechTest;
(function (MechTest) {
    var uiTestInterval = null;
    var testIntervalLength = 100;
    var mechIdWeaponCount = []; //number of weapons set for a given mechid
    //Load dummy data from javascript files in data folder
    var initDummyModelData = function () {
        MechModel.setInitModelData(DummyWeaponData, DummyAmmoData, DummyMechData, DummyModuleData, _DummyOmnipods);
    };
    MechTest.testUIWidgets = function () {
        MechView.initView();
        initDummyModelData();
        MechModel.addMech("testCheetahId", MechModel.Team.BLUE, DummyArcticCheetah);
        MechModel.addMech("testExecutionerId", MechModel.Team.BLUE, DummyExecutioner);
        MechModel.addMech("testStormcrowId", MechModel.Team.BLUE, DummyStormcrow);
        MechModel.addMech("testMaulerId", MechModel.Team.RED, DummyMauler);
        MechModel.addMech("testFirestarterId", MechModel.Team.RED, DummyFireStarter);
        MechModel.addMech("testBattlemasterId", MechModel.Team.RED, DummyBattleMaster);
        MechModel.addMech("testShadowhawkId", MechModel.Team.RED, DummyShadowhawk);
        MechModelView.refreshView();
        var createHandler = function (context) {
            return () => {
                if (uiTestInterval == null) {
                    uiTestInterval = window.setInterval(() => {
                        context.testUI(MechModel.mechTeams[MechModel.Team.BLUE]);
                        context.testUI(MechModel.mechTeams[MechModel.Team.RED]);
                    }, testIntervalLength);
                }
                else {
                    window.clearInterval(uiTestInterval);
                    uiTestInterval = null;
                }
            };
        };
        var handler = createHandler(this);
        $("#testUI").removeClass("debugButton").click(handler);
    };
    MechTest.testUI = function (mechTeam) {
        var weaponStates = [MechModel.WeaponCycle.READY,
            MechModel.WeaponCycle.FIRING,
            MechModel.WeaponCycle.DISABLED];
        $.each(mechTeam, (index, mech) => {
            for (var property in MechModel.Component) {
                if (MechModel.Component.hasOwnProperty(property)) {
                    MechViewMechPanel.setPaperDollArmor(mech.getMechId(), MechModel.Component[property], Math.random());
                    MechViewMechPanel.setPaperDollStructure(mech.getMechId(), MechModel.Component[property], Math.random());
                }
            }
            MechViewMechPanel.setHeatbarValue(mech.getMechId(), Math.random());
            for (var i = 0; i < mech.getMechInfo().weaponInfoList.length; i++) {
                MechViewMechPanel.setWeaponCooldown(mech.getMechId(), i, Math.random());
                MechViewMechPanel.setWeaponAmmo(mech.getMechId(), i, Math.random() > 0.2 ? Math.floor(Math.random() * 100) : -1);
                MechViewMechPanel.setWeaponState(mech.getMechId(), i, weaponStates[Math.floor(weaponStates.length * Math.random())]);
            }
        });
    };
    MechTest.testModelInit = function () {
        MechModel.initModelData()
            .then(function () {
            console.log("Successfully loaded model init data");
        })
            .catch(function (err) {
            console.log("Failed to load model init data");
        });
    };
    MechTest.testModelOps = function () {
        initDummyModelData();
        // MechModel.addMech("testCheetahId", MechModel.Team.BLUE, DummyArcticCheetah);
        // MechModel.addMech("testExecutionerId", MechModel.Team.BLUE, DummyExecutioner);
        MechModel.addMech("testMaulerId", MechModel.Team.RED, DummyMauler);
        // MechModel.addMech("testFirestarterId", MechModel.Team.RED, DummyFireStarter);
        MechModel.addMech("testBattlemasterId", MechModel.Team.RED, DummyBattleMaster);
    };
    MechTest.testModelBaseHealth = function () {
        for (var tonnage = 20; tonnage <= 100; tonnage += 5) {
            for (var property in MechModel.Component) {
                if (MechModel.Component.hasOwnProperty(property)) {
                    var structure = MechModel.baseMechStructure(MechModel.Component[property], tonnage);
                    var armor = MechModel.baseMechArmor(MechModel.Component[property], tonnage);
                    console.log("Tonnage: " + tonnage + " " + MechModel.Component[property] + " structure:" + structure + " armor:" + armor);
                }
            }
        }
    };
    MechTest.testModelView = function () {
        MechView.initView();
        initDummyModelData();
        MechModel.addMech("testCheetahId", MechModel.Team.BLUE, DummyArcticCheetah);
        MechModel.addMech("testExecutionerId", MechModel.Team.BLUE, DummyExecutioner);
        MechModel.addMech("testStormcrowId", MechModel.Team.BLUE, DummyStormcrow);
        MechModel.addMech("testMaulerId", MechModel.Team.RED, DummyMauler);
        MechModel.addMech("testFirestarterId", MechModel.Team.RED, DummyFireStarter);
        MechModel.addMech("testBattlemasterId", MechModel.Team.RED, DummyBattleMaster);
        MechModel.addMech("testShadowhawkId", MechModel.Team.RED, DummyShadowhawk);
        MechModelView.refreshView();
        $("#resetState").removeClass("debugButton").click(() => {
            MechModel.resetState();
            MechModelView.refreshView();
        });
        $("#testModelView").removeClass("debugButton").click(() => {
            //set mech healths to random numbers
            let teams = [MechModel.Team.BLUE, MechModel.Team.RED];
            for (let team of teams) {
                for (let mech of MechModel.mechTeams[team]) {
                    let mechState = mech.getMechState();
                    //random component health
                    for (let mechComponentHealth of mechState.mechHealth.componentHealth) {
                        mechComponentHealth.armor = Math.random() * mechComponentHealth.maxArmor;
                        mechComponentHealth.structure = Math.random() * mechComponentHealth.maxStructure;
                    }
                    MechModelView.updateHealth(mech);
                    mechState.heatState.currHeat = Math.random() * mechState.heatState.currMaxHeat;
                    MechModelView.updateHeat(mech);
                    //random weapon state
                    for (let weaponIndex in mechState.weaponStateList) {
                        let weaponState = mechState.weaponStateList[weaponIndex];
                        let WEAPON_CYCLES = [];
                        for (let weaponCycle in MechModel.WeaponCycle) {
                            if (MechModel.WeaponCycle.hasOwnProperty(weaponCycle)) {
                                WEAPON_CYCLES.push(MechModel.WeaponCycle[weaponCycle]);
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
    };
    MechTest.testDamageAtRange = function () {
        initDummyModelData();
        let ppcID = 1009;
        let srm6ID = 1031;
        let atm12ID = 1252;
        let testIds = [ppcID, srm6ID, atm12ID];
        var mechInfo = new MechModel.MechInfo("testId", DummyStormcrow);
        for (let weaponId of testIds) {
            var weaponInfoTest = new MechModelWeapons.WeaponInfo(String(weaponId), "centre_torso", MechModel.getSmurfyWeaponData(String(weaponId)), mechInfo);
            console.log("Weapon " + weaponInfoTest.translatedName +
                " minRange: " + weaponInfoTest.minRange +
                " optRange: " + weaponInfoTest.optRange +
                " maxRange: " + weaponInfoTest.maxRange +
                " baseDmg: " + weaponInfoTest.baseDmg);
            let testRanges = [0, 90, 180, 270, 300, 500, 540, 810, 1080, 2000];
            const stepDuration = 50;
            for (let range of testRanges) {
                let damage = weaponInfoTest.damageAtRange(range);
                console.log("range: " + range + " damage: " + damage);
            }
        }
    };
    MechTest.testSpreadAdjacentDamage = function () {
        var printTestDamageTransform = function (testDamage, accuracyPattern) {
            let weaponDamage = new MechModel.WeaponDamage(testDamage);
            let transformedDamage = accuracyPattern(weaponDamage, 200);
            console.log("original damage: " + weaponDamage.toString());
            console.log("transformedDamage: " + transformedDamage.toString());
        };
        let accuracyPattern = MechAccuracyPattern.accuracySpreadToAdjacent(0.5, 0.5, 0);
        let accuracyPatternNext = MechAccuracyPattern.accuracySpreadToAdjacent(0.5, 0.3, 0.2);
        let testDamage = { "centre_torso": 10,
            "right_torso": 2.5,
            "left_torso": 2.5 };
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
    };
    MechTest.testListQuirks = function () {
        let quirkMap = {};
        //mech quirks
        for (let mechIdx in DummyMechData) {
            let smurfyMech = DummyMechData[mechIdx];
            let quirks = smurfyMech.details.quirks;
            if (quirks) {
                for (let quirkEntry of quirks) {
                    quirkMap[quirkEntry.name] = true;
                }
            }
        }
        //omnipod quirks
        for (let chassis in _DummyOmnipods) {
            for (let omnipodId in _DummyOmnipods[chassis]) {
                let omnipodData = _DummyOmnipods[chassis][omnipodId];
                let quirks = omnipodData.configuration.quirks;
                if (quirks) {
                    for (let quirkEntry of quirks) {
                        quirkMap[quirkEntry.name] = true;
                    }
                }
            }
        }
        let numQuirks = 0;
        let sortedQuirkNames = [];
        for (let quirkName in quirkMap) {
            sortedQuirkNames.push(quirkName);
        }
        sortedQuirkNames.sort();
        for (let quirkName of sortedQuirkNames) {
            console.log(quirkName);
            numQuirks++;
        }
        console.log("numQuirks : " + numQuirks);
    };
    MechTest.testSimulation = function () {
        //Use DummyData
        // initDummyModelData();
        // this.generateTestUI( );
        //Load data from smurfy
        MechView.initView();
        MechView.showLoadingScreen();
        MechModel.initModelData()
            .then(function () {
            console.log("Successfully loaded model init data");
            MechTest.generateTestUI();
        })
            .catch(function () {
            console.log("Failed to load model init data");
        });
    };
    MechTest.generateTestUI = function () {
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
                .then(function (data) {
                console.log("Success on save app state. Data: " + data);
                console.log("statehash: " + data.statehash);
                return data;
            })
                .catch(function (data) {
                console.log("Fail on save app state. Data: " + data);
            })).then(function (data) {
                console.log("Done save app state. Data: " + data);
            });
        });
        $("#loadStateButton").removeClass("debugButton").click(() => {
            let hashState = location.hash;
            let regex = /#s=([^&]*)/;
            let results = regex.exec(hashState);
            if (!results) {
                console.log("Invalid state in hash: " + hashState);
                return;
            }
            hashState = results[1];
            MechView.showLoadingScreen();
            Promise.resolve(MechViewRouter.loadAppState(hashState)
                .then(function (data) {
                console.log("Success on load app state. Data: " + data);
                MechModelView.refreshView();
                return data;
            })
                .catch(function (data) {
                console.log("Fail on load app state. Data: " + data);
            })).then(function (data) {
                console.log("Done on load app state. Data: " + data);
                MechView.hideLoadingScreen();
            });
        });
    };
    MechTest.testPersistence = function () {
        var statehash;
        initDummyModelData();
        initTestModelState();
        MechView.initView();
        MechView.showLoadingScreen();
        Promise.resolve(MechViewRouter.saveAppState()
            .then(function (data) {
            console.log("Success on save app state. Data: " + data);
            console.log("statehash: " + data.statehash);
            statehash = data.statehash;
            testGetAppState(statehash);
            return data;
        })
            .catch(function (data) {
            console.log("Fail on save app state. Data: " + data);
        })).then(function (data) {
            console.log("Done save app state. Data: " + data);
        });
        var testGetAppState = function (statehash) {
            Promise.resolve(MechViewRouter.loadAppState(statehash)
                .then(function (data) {
                console.log("Success on load app state. Data: " + data);
                MechModelView.refreshView();
                return data;
            })
                .catch(function (data) {
                console.log("Fail on load app state. Data: " + data);
            })).then(function (data) {
                MechView.hideLoadingScreen();
                console.log("Done on load app state. Data: " + data);
            });
        };
        $("#saveStateButton").removeClass("debugButton").click(() => {
            Promise.resolve(MechViewRouter.saveAppState()
                .then(function (data) {
                console.log("Success on save app state. Data: " + data);
                console.log("statehash: " + data.statehash);
                return data;
            })
                .catch(function (data) {
                console.log("Fail on save app state. Data: " + data);
            })).then(function (data) {
                console.log("Done save app state. Data: " + data);
            });
        });
        $("#loadStateButton").removeClass("debugButton").click(() => {
            let hashState = location.hash;
            let regex = /#s=([^&]*)/;
            let results = regex.exec(hashState);
            if (!results) {
                console.log("Invalid state in hash: " + hashState);
                return;
            }
            hashState = results[1];
            MechView.showLoadingScreen();
            Promise.resolve(MechViewRouter.loadAppState(hashState)
                .then(function (data) {
                console.log("Success on load app state. Data: " + data);
                MechModelView.refreshView();
                return data;
            })
                .catch(function (data) {
                console.log("Fail on load app state. Data: " + data);
            })).then(function (data) {
                console.log("Done on load app state. Data: " + data);
                MechView.hideLoadingScreen();
            });
        });
    };
    var initTestModelState = function () {
        const DEFAULT_RANGE = 200;
        MechModel.addMech("testKodiakId1", MechModel.Team.BLUE, DummyKodiak);
        MechModel.addMech("testExecutionerId", MechModel.Team.BLUE, DummyExecutioner);
        MechModel.addMech("testTimberwolfId", MechModel.Team.BLUE, DummyTimberwolf);
        MechModel.addMech("testStormcrowId", MechModel.Team.BLUE, DummyStormcrow);
        MechModel.addMech("testCheetahId", MechModel.Team.BLUE, DummyArcticCheetah);
        MechModel.addMech("testMadDogId", MechModel.Team.BLUE, DummyMadDog);
        MechModel.addMech("testMaulerId", MechModel.Team.RED, DummyMauler);
        MechModel.addMech("testBattlemasterId", MechModel.Team.RED, DummyBattleMaster);
        MechModel.addMech("testWarhammerId", MechModel.Team.RED, DummyWarHammer);
        MechModel.addMech("testShadowhawkId", MechModel.Team.RED, DummyShadowhawk);
        MechModel.addMech("testFirestarterId", MechModel.Team.RED, DummyFireStarter);
        MechModel.addMech("testCatapultId", MechModel.Team.RED, DummyCatapult);
        MechModel.addMech("testUrbanmechId1", MechModel.Team.RED, DummyUrbanmech);
        let simulatorParameters = new MechSimulatorLogic.SimulatorParameters(DEFAULT_RANGE, //range
        1 //speed factor
        );
        MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
        MechModel.initMechTeamPatterns(MechModel.mechTeams[MechModel.Team.BLUE]);
        MechModel.initMechTeamPatterns(MechModel.mechTeams[MechModel.Team.RED]);
    };
    MechTest.testLRMSpread = function () {
        var newTestDamage = () => {
            return new MechModel.WeaponDamage({ "centre_torso": 10 });
        };
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
        ];
        for (let lrm of lrmSpreadList) {
            console.log("----------------------------------------------");
            console.log(lrm.name + " spread");
            let lrmPattern = MechAccuracyPattern.seekerPattern(lrm.spread);
            let range = 180;
            let transformedDamage = lrmPattern(newTestDamage(), range);
            console.log("Range: " + range + " " + transformedDamage.toString());
            for (let range = 200; range <= 1000; range += 100) {
                let transformedDamage = lrmPattern(newTestDamage(), range);
                console.log("Range: " + range + " " + transformedDamage.toString());
            }
        }
    };
    var testScratch = function () {
    };
})(MechTest || (MechTest = {}));
//# sourceMappingURL=simulator-test.js.map