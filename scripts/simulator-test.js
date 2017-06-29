"use strict";

//Test code.
var MechTest = MechTest || (function() {

//Test code
var uiTestInterval = null;
var testIntervalLength = 100;
var mechIdWeaponCount = []; //number of weapons set for a given mechid

return {
    testUIWidgets : function () {
      MechModel.initDummyModelData();

      MechModel.addMech("testCheetahId", MechModel.Team.BLUE, DummyArcticCheetah);
      MechModel.addMech("testExecutionerId", MechModel.Team.BLUE, DummyExecutioner);
      MechModel.addMech("testStormcrowId", MechModel.Team.BLUE, DummyStormcrow);
      MechModel.addMech("testMaulerId", MechModel.Team.RED, DummyMauler);
      MechModel.addMech("testFirestarterId", MechModel.Team.RED, DummyFireStarter);
      MechModel.addMech("testBattlemasterId", MechModel.Team.RED, DummyBattleMaster);
      MechModel.addMech("testShadowhawkId", MechModel.Team.RED, DummyShadowhawk);

      MechModelView.refreshView();

      MechView.initHandlers();

      var Handler = function (context) {
        this.context = context;
        return () => {
          if (uiTestInterval == null) {
            uiTestInterval = window.setInterval(() => {
              context.testUI(MechModel.mechTeams[MechModel.Team.BLUE]);
              context.testUI(MechModel.mechTeams[MechModel.Team.RED]);
            }, testIntervalLength);
          } else {
            window.clearInterval(uiTestInterval);
            uiTestInterval = null;
          }
        };
      };
      var handler = new Handler(this);
      $("#testUI").removeClass("debugButton").click(handler);
    },

    testUI : function (mechTeam) {
      var weaponStates = [MechModel.WeaponCycle.READY,
          MechModel.WeaponCycle.FIRING,
          MechModel.WeaponCycle.DISABLED];
      $.each(mechTeam, (index, mech) => {
        for (var property in MechModel.Component) {
          if (MechModel.Component.hasOwnProperty(property)) {
            MechView.setPaperDollArmor(mech.getMechId(), MechModel.Component[property], Math.random());
            MechView.setPaperDollStructure(mech.getMechId(), MechModel.Component[property], Math.random());
          }
        }
        MechView.setHeatbarValue(mech.getMechId(), Math.random());
        for (var i = 0; i < mech.getMechInfo().weaponInfoList.length; i++) {
          MechView.setWeaponCooldown(mech.getMechId(), i, Math.random());
          MechView.setWeaponAmmo(mech.getMechId(), i, Math.random() > 0.2 ? Math.floor(Math.random() * 100) : -1);
          MechView.setWeaponState(mech.getMechId(), i, weaponStates[Math.floor(weaponStates.length * Math.random())]);
        }
      });
    },

    testModelInit : function () {
      MechModel.initModelData((success) => {
        if (success) {
          console.log("Successfully loaded model init data");
        } else {
          console.log("Failed to load model init data");
        }
      });
      // MechModel.initDummyModelData();
    },

    testDeque : function() {
      let dq = new DequeXX();
      dq.addFirst(1);
      dq.addLast(10);
      dq.addFirst(2);
      dq.addLast(20);
      console.log(dq.toString());
      let ret;
      ret = dq.removeFirst();
      console.log("ret: " + ret + " deque: " + dq.toString() + " length:" + dq.length());
      ret = dq.removeFirst();
      console.log("ret: " + ret + " deque: " + dq.toString() + " length:" + dq.length());
      ret = dq.removeFirst();
      console.log("ret: " + ret + " deque: " + dq.toString() + " length:" + dq.length());
      ret = dq.removeFirst();
      console.log("ret: " + ret + " deque: " + dq.toString() + " length:" + dq.length());
      //dq.removeFirst(); //exception

      dq.addFirst(1);
      dq.addLast(10);
      dq.addFirst(2);
      dq.addLast(20);
      ret = dq.removeLast();
      console.log("ret: " + ret + " deque: " + dq.toString() + " length:" + dq.length());
      ret = dq.removeLast();
      console.log("ret: " + ret + " deque: " + dq.toString() + " length:" + dq.length());
      ret = dq.removeLast();
      console.log("ret: " + ret + " deque: " + dq.toString() + " length:" + dq.length());
      ret = dq.removeLast();
      console.log("ret: " + ret + " deque: " + dq.toString() + " length:" + dq.length());
      //dq.removeLast(); //exception

      dq.addFirst(1);
      dq.addLast(10);
      dq.addFirst(2);
      dq.addLast(20);
      let iterator = dq.iterator();
      while (iterator.hasNext()) {
        console.log(iterator.next());
      }
      console.log("deque: " + dq.toString());
    },

    testModelOps : function () {
      MechModel.initDummyModelData();
      // MechModel.addMech("testCheetahId", MechModel.Team.BLUE, DummyArcticCheetah);
      // MechModel.addMech("testExecutionerId", MechModel.Team.BLUE, DummyExecutioner);
      MechModel.addMech("testMaulerId", MechModel.Team.RED, DummyMauler);
      // MechModel.addMech("testFirestarterId", MechModel.Team.RED, DummyFireStarter);
      MechModel.addMech("testBattlemasterId", MechModel.Team.RED, DummyBattleMaster);
    },

    testModelBaseHealth : function() {
      for (var tonnage = 20; tonnage <=100; tonnage += 5) {
        for (var property in MechModel.Component) {
          if (MechModel.Component.hasOwnProperty(property)) {
            var structure = MechModel.baseMechStructure(MechModel.Component[property], tonnage);
            var armor = MechModel.baseMechArmor(MechModel.Component[property], tonnage);
            console.log ("Tonnage: " + tonnage + " " + MechModel.Component[property] + " structure:" + structure + " armor:" + armor);
          }
        }
      }
    },

    testModelView : function (){
      MechModel.initDummyModelData();

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
    },

    testDamageAtRange : function() {
      var weaponInfoTest = new MechModel.WeaponInfo("300", "TestPPC", "Test PPC", null, 90, 540, 1080, 10, 1);
      console.log("Weapon " + weaponInfoTest.translatedName +
          " minRange: " + weaponInfoTest.minRange +
          " optRange: " + weaponInfoTest.optRange +
          " maxRange: " + weaponInfoTest.maxRange +
          " baseDmg: " + weaponInfoTest.baseDmg);

      let damage;
      let range;
      range = 0;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 90;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 180;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 540;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 810;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 1080;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 2000;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);

      weaponInfoTest = new MechModel.WeaponInfo("301", "TestSRM6", "Test SRM6", null, 0, 270, 270, 2.15, 6)
      range = 0;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 90;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 180;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 270;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 300;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
      range = 2000;
      damage = weaponInfoTest.damageAtRange(range);
      console.log("range: " + range + " damage: " + damage);
    },

    testListQuirks : function() {
      let quirkMap = {};
      for (let mechIdx in DummyMechData) {
        let smurfyMech = DummyMechData[mechIdx];
        let quirks = smurfyMech.details.quirks;
        if (quirks) {
          for (let quirkEntry of quirks) {
            quirkMap[quirkEntry.name] = true;
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
    },

    testSimulation : function() {
      //Use DummyData
      // MechModel.initDummyModelData();
      // this.generateTestUI( );

      //Load data from smurfy
      MechModel.initModelData((success) => {
        if (success) {
          console.log("Successfully loaded model init data");
          MechTest.generateTestUI();
        } else {
          console.log("Failed to load model init data");
        }
      });
    },

    generateTestUI : function() {
      const range = 120;
      MechModel.addMech("testKodiakId1", MechModel.Team.BLUE, DummyKodiak);
      MechModel.addMech("testExecutionerId", MechModel.Team.BLUE, DummyExecutioner);
      // MechModel.addMech("testTimberwolfId", MechModel.Team.BLUE, DummyTimberwolf);
      // MechModel.addMech("testStormcrowId", MechModel.Team.BLUE, DummyStormcrow);
      // MechModel.addMech("testCheetahId", MechModel.Team.BLUE, DummyArcticCheetah);
      // MechModel.addMech("testMadDogId", MechModel.Team.BLUE, DummyMadDog);

      MechModel.addMech("testMaulerId", MechModel.Team.RED, DummyMauler);
      MechModel.addMech("testBattlemasterId", MechModel.Team.RED, DummyBattleMaster);
      // MechModel.addMech("testWarhammerId", MechModel.Team.RED, DummyWarHammer);
      // MechModel.addMech("testShadowhawkId", MechModel.Team.RED, DummyShadowhawk);
      // MechModel.addMech("testFirestarterId", MechModel.Team.RED, DummyFireStarter);
      // MechModel.addMech("testCatapultId", MechModel.Team.RED, DummyCatapult);
      // MechModel.addMech("testUrbanmechId1", MechModel.Team.RED, DummyUrbanmech);

      MechModelView.refreshView();
      let simulatorParameters = new MechSimulatorLogic.SimulatorParameters(
                                  range//range
                                );
      MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
      MechModel.initMechTeamPatterns(MechModel.mechTeams[MechModel.Team.BLUE]);
      MechModel.initMechTeamPatterns(MechModel.mechTeams[MechModel.Team.RED]);

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
    },

    testScratch : function() {
    },
  } //return publics

})(); //namespace exec
