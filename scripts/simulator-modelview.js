"use strict";

//Methods that update the MechView from the MechModel, and vice versa
var MechModelView = MechModelView || (function() {

  var updateFull = function () {
    let mechTeamList = [MechModel.Team.BLUE, MechModel.Team.RED];
    for (let team of mechTeamList) {
      MechView.clear(team);
      for (let mech of MechModel.mechTeams[team]) {
        MechView.addMechPanel(mech, team);
        updateAll(mech);
      }
    }
  }

  var updateHeat = function(mech) {
    let heatState = mech.getMechState().heatState;

    MechView.updateHeat(mech.getMechId(), heatState.currHeat, heatState.currMaxHeat);
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

  var updatePaperDoll = function(mech){
    let mechId = mech.getMechId();
    let mechHealth = mech.getMechState().mechHealth;
    for (let mechComponentHealth of mechHealth.componentHealth) {
      let location = mechComponentHealth.location;
      let armorPercent = Number(mechComponentHealth.armor) / Number(mechComponentHealth.maxArmor);
      let structurePercent = Number(mechComponentHealth.structure) / Number(mechComponentHealth.maxStructure);
      MechView.setPaperDollArmor(mechId, location, armorPercent);
      MechView.setPaperDollStructure(mechId, location, structurePercent);
    }
  }

  var updateMechHealthNumbers = function (mech) {
    let mechHealth = mech.getMechState().mechHealth;
    for (let mechComponentHealth of mechHealth.componentHealth) {
      MechView.updateMechHealthNumbers(mech.getMechId(),
                        mechComponentHealth.location,
                        mechComponentHealth.armor,
                        mechComponentHealth.structure);
    }
  }

  //TODO: Move health logic from view to here?
  var updateHealth = function(mech) {
    updatePaperDoll(mech);
    updateMechHealthNumbers(mech);
  }

  var updateSimTime = function(simTime) {
    MechView.updateSimTime(simTime);
  }

  var updateMech = function(mech) {
    let mechState = mech.getMechState();
    let updateFunctionMap = {};
    updateFunctionMap[MechModel.UpdateType.FULL] = updateAll;
    updateFunctionMap[MechModel.UpdateType.HEALTH] = updateHealth;
    updateFunctionMap[MechModel.UpdateType.HEAT] = updateHeat;
    updateFunctionMap[MechModel.UpdateType.COOLDOWN] = updateCooldown;
    updateFunctionMap[MechModel.UpdateType.WEAPONSTATE] = updateWeaponStatus;
    //updateFunctionMap[MechModel.UpdateType.STATS] = TODO;

    for (let updateType in mechState.updateTypes) {
      if (mechState.updateTypes[updateType]) {
        updateFunctionMap[updateType](mech);
      }
    }
    mechState.updateTypes = [];
  }

  var updateAll = function(mech) {
    updateHealth(mech);
    updateHeat(mech);
    updateCooldown(mech);
    updateWeaponStatus(mech);
    //TODO updateStats(mech);
  }

  var updateDebugText = function (text) {
    MechView.setDebugText(text);
  }

  return {
    updateFull : updateFull,
    updateHealth : updateHealth,
    updateHeat : updateHeat,
    updateCooldown : updateCooldown,
    updateWeaponStatus : updateWeaponStatus,
    updateMech: updateMech,
    updateSimTime: updateSimTime,
    updateDebugText: updateDebugText,
  };

})();
