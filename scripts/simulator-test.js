"use strict";

var MechTest = MechTest || (function() {

//Test code
var uiTestInterval = null;
var testIntervalLength = 100;
var mechIdWeaponCount = []; //number of weapons set for a given mechid

return {
    test : function () {
      //UI tests
      var numBlues = 4;
      var numReds = 5;
      var blueIds = [];
      var redIds = [];
      for (var i = 0; i < numBlues; i++) {
        blueIds.push("blue" + (i+1));
      }
      for (var i = 0; i < numReds; i++) {
        redIds.push("red" + (i+1));
      }

      var testWeapons = [
        [ new MechView.WeaponData("SMALL PULSE LASER", "left_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "left_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "left_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "left_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "left_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "left_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "right_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "right_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "right_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "right_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "right_arm", -1, "Active"),
          new MechView.WeaponData("SMALL PULSE LASER", "right_arm", -1, "Active")
        ],
        [ new MechView.WeaponData("MEDIUM LASER", "centre_torso", -1, "Active"),
          new MechView.WeaponData("MEDIUM LASER", "left_torso", -1, "Active"),
          new MechView.WeaponData("MEDIUM SRM6", "left_arm", -1, "Active")
        ],
        [ new MechView.WeaponData("ER LARGE LASER", "left_torso", -1, "Active"),
          new MechView.WeaponData("ER LARGE LASER", "right_torso", -1, "Active"),
          new MechView.WeaponData("AC 10", "right_torso", 80, "Active"),
          new MechView.WeaponData("AC 5", "left_torso", 120, "Active")
        ]
      ];

      MechView.initHandlers();

      $.each(blueIds, (index, mechId) => {
        var testWeaponList = testWeapons[Math.floor(testWeapons.length * Math.random())];
        MechView.addMechPanel(mechId, testWeaponList, "#blueMechs");
        mechIdWeaponCount[mechId] = testWeaponList.length;
      });

      $.each(redIds, (index, mechId) => {
        var testWeaponList = testWeapons[Math.floor(testWeapons.length * Math.random())];
        MechView.addMechPanel(mechId, testWeaponList, "#redMechs");
        mechIdWeaponCount[mechId] = testWeaponList.length;
      });

      var Handler = function (context) {
        this.context = context;
        return () => {
          if (uiTestInterval == null) {
            uiTestInterval = window.setInterval(() => {
              context.testUI(blueIds);
              context.testUI(redIds);
            }, testIntervalLength);
          } else {
            window.clearInterval(uiTestInterval);
            uiTestInterval = null;
          }
        };
      };
      var handler = new Handler(this);
      $("#testUI").click(handler);
    },

    testUI : function (mechIds) {
      var weaponStates = [MechModel.WeaponState.ACTIVE,
          MechModel.WeaponState.FIRING,
          MechModel.WeaponState.DISABLED];
      $.each(mechIds, (index, mechId) => {
        for (var property in MechModel.Component) {
          if (MechModel.Component.hasOwnProperty(property)) {
            MechView.setPaperDollArmor(mechId, MechModel.Component[property], Math.random());
            MechView.setPaperDollStructure(mechId, MechModel.Component[property], Math.random());
          }
        }
        MechView.setHeatbarValue(mechId, Math.random());
        for (var i = 0; i < mechIdWeaponCount[mechId]; i++) {
          MechView.setWeaponCooldown(mechId, i, Math.random());
          MechView.setWeaponAmmo(mechId, i, Math.random() > 0.2 ? Math.floor(Math.random() * 100) : -1);
          MechView.setWeaponState(mechId, i, weaponStates[Math.floor(weaponStates.length * Math.random())]);
        }
      });
    },

    testModelInit : function () {
      // MechModel.initModelData((success) => {
      //   if (success) {
      //     console.log("Successfully loaded model init data");
      //   } else {
      //     console.log("Failed to load model init data");
      //   }
      // });
      MechModel.initDummyModelData();
    }
  }

})(); //namespace exec
