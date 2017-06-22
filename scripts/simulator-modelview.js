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

  //TODO: Move heat logic from view to here?
  var updateHeat = function(mech) {
    MechView.updateHeat(mech);
  }

  var updateCooldown = function(mech) {
    let mechState = mech.getMechState();
    for (let weaponIndex in mechState.weaponStateList) {
      let weaponState = mechState.weaponStateList[weaponIndex];
      let weaponInfo = weaponState.weaponInfo;
      let cooldownPercent = 0;
      if (weaponState.weaponCycle === MechModel.WeaponCycle.READY) {
        cooldownPercent = 0;
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.FIRING) {
        cooldownPercent = 1;
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.DISABLED) {
        cooldownPercent = 1;
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
        cooldownPercent = Number(weaponState.cooldownLeft) / Number(weaponInfo.cooldown);
      } else if (weaponState.weaponCycle === MechModel.WeaponCycle.SPOOLING) {
        cooldownPercent = 1 - (Number(weaponState.spoolupLeft) / Number(weaponInfo.spinup));
      }
      MechView.setWeaponCooldown(mech.getMechId(), weaponIndex, cooldownPercent);
    }
  }

  var updateWeaponStatus = function(mech) {
    let mechState = mech.getMechState();
    for (let weaponIndex in mechState.weaponStateList) {
      let weaponState = mechState.weaponStateList[weaponIndex];
      MechView.setWeaponState(mech.getMechId(), weaponIndex, weaponState.weaponCycle);
      let ammoState = mech.getMechState().ammoState;
      let weaponAmmoCount;
      let ammoCount = ammoState.ammoCounts[weaponState.weaponInfo.weaponId];
      if (ammoCount) {
        weaponAmmoCount = ammoCount.ammoCount;
      }  else {
        weaponAmmoCount = -1;
      }
      MechView.setWeaponAmmo(mech.getMechId(), weaponIndex, weaponAmmoCount);
    }
  }

  //TODO: Move health logic from view to here?
  var updateHealth = function(mech) {
    MechView.updatePaperDoll(mech);
    MechView.updateMechHealthNumbers(mech);
  }

  return {
    updateFull : updateFull,
    updateHealth : updateHealth,
    updateHeat : updateHeat,
    updateCooldown : updateCooldown,
    updateWeaponStatus : updateWeaponStatus
  };

})();
