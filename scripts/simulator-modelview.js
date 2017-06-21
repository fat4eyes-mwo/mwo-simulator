"use strict";

var MechModelView = MechModelView || (function() {

  var updateFull = function () {
    let mechTeamList = [MechModel.Team.BLUE, MechModel.Team.RED];
    for (let team of mechTeamList) {
      MechView.clear(team);
      for (let mech of MechModel.mechTeams[team]) {
        MechView.addMechPanel(mech, team);
      }
    }
  }

  var updateHeat = function(mech) {

  }

  var updateCooldown = function(mech) {

  }

  var updateWeaponStatus = function(mech) {
    
  }

  return {
    updateFull : updateFull
  };

})();
