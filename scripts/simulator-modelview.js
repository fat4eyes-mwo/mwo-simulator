"use strict";

var MechModelView = MechModelView || (function() {

  const UIUpdateType = {
    FULL : "full",
    HEALTH : "health",
    HEAT : "heat",
    COOLDOWN : "cooldown",
    WEAPONSTATE : "weaponstate",
    STATS : "stats"
  };

  var updateFull = function () {
    let mechTeamList = [MechModel.Team.BLUE, MechModel.Team.RED];
    for (let team of mechTeamList) {
      MechView.clear(team);
      for (let mech of MechModel.mechTeams[team]) {
        MechView.addMechPanel(mech, team);
      }
    }
  }

  return {
    UIUpdateType : UIUpdateType,
    updateFull : updateFull
  };

})();
