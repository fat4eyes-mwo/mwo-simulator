"use strict";

//Classes that represent the states of the mechs in the simulation,
//and methos to populate them from smurfy data
var MechModelWeapons = MechModelWeapons || (function () {
  var WeaponCycle = MechModel.WeaponCycle;
  
  class WeaponInfo {
    constructor(weaponId, location, smurfyWeaponData, mechInfo) {
        this.weaponId = weaponId; //smurfy weapon id
        this.location = location;
        this.mechInfo = mechInfo;

        this.name = smurfyWeaponData.name;
        this.translatedName = smurfyWeaponData.translated_name;
        this.baseMinRange = Number(smurfyWeaponData.min_range);
        this.baseOptRange = Number(smurfyWeaponData.long_range);
        this.baseMaxRange = Number(smurfyWeaponData.max_range);
        this.ranges = smurfyWeaponData.ranges;
        this.baseDmg = Number(smurfyWeaponData.calc_stats.baseDmg);
        this.damageMultiplier = Number(smurfyWeaponData.calc_stats.damageMultiplier);
        this.heat = Number(smurfyWeaponData.heat);
        this.minHeatPenaltyLevel = Number(smurfyWeaponData.min_heat_penalty_level);
        this.heatPenalty = Number(smurfyWeaponData.heat_penalty);
        this.heatPenaltyId = smurfyWeaponData.heat_penalty_id;
        //Our cooldown/duration/spinup values are in milliseconds, smurfy is in seconds
        this.cooldown = Number(smurfyWeaponData.cooldown) * 1000;
        this.duration = Number(smurfyWeaponData.duration) * 1000;
        //Spinup data from data/addedweapondata.js
        this.spinup = (smurfyWeaponData.spinup ? Number(smurfyWeaponData.spinup) : 0) * 1000;
        this.baseSpeed = Number(smurfyWeaponData.speed);
        this.ammoPerShot = smurfyWeaponData.ammo_per_shot ?
              Number(smurfyWeaponData.ammo_per_shot) : 0;
        this.dps = Number(smurfyWeaponData.calc_stats.dps);
        this.type = smurfyWeaponData.type;
        this.jamChance = smurfyWeaponData.jamming_chance ?
                      Number(smurfyWeaponData.jamming_chance) : 0;
        this.jamTime = smurfyWeaponData.jammed_time ?
                      Number(smurfyWeaponData.jammed_time) * 1000 : 0; //convert to milliseconds
        this.shotsDuringCooldown = smurfyWeaponData.shots_during_cooldown ?
                      Number(smurfyWeaponData.shots_during_cooldown) : 0;
        //time between shots on automatic fire for continuous fire weapons (flamers, MGs, RACs);
        this.timeBetweenAutoShots = smurfyWeaponData.rof ?
                      1000 / Number(smurfyWeaponData.rof): 0; //rof is in shots per second
        this.weaponBonus = MechModelQuirks.getWeaponBonus(this);
        //recompute heat to be heat per SHOT for continuous fire weapons (in smurfy heat is heat per second, not per shot)
        if (this.isContinuousFire()) {
          this.heat = this.heat / Number(smurfyWeaponData.rof);
        }
      }
      get speed() {
        let speedMultiplier = 1 + Number(this.weaponBonus.velocity_multiplier);
        return this.baseSpeed * speedMultiplier;
      }
      set speed(data) {
        throw "speed cannot be set.";
      }
      get minRange() {
        //min range not affected by multiplier
        return this.baseMinRange;
      }
      set minRange(value) {
        throw "minRange cannot be set."
      }
      get optRange() {
        let rangeMultiplier = 1 + Number(this.weaponBonus.range_multiplier);
        return this.baseOptRange * rangeMultiplier;
      }
      set optRange(value) {
        throw "optRange cannot be set."
      }
      get maxRange() {
        let rangeMultiplier = 1 + Number(this.weaponBonus.range_multiplier);
        return this.baseMaxRange * rangeMultiplier;
      }
      set maxRange(value) {
        throw "maxRange cannot be set."
      }
      isContinuousFire() {
        return Number(this.duration) < 0;
      }
      hasDuration() {
        return Number(this.duration) > 0;
      }
      hasTravelTime() {
        return Number(this.speed) > 0;
      }
      requiresAmmo() {
        return this.ammoPerShot > 0;
      }
      //range in meters, stepDuration in ms
      damageAtRange(range, stepDuration) {
        let totalDamage = Number(this.baseDmg) * Number(this.damageMultiplier);
        let ret = totalDamage;
        let rangeMultiplier = 1 + Number(this.weaponBonus.range_multiplier);

        if (Number(range) < Number(this.minRange)
            || Number(range) > Number(this.maxRange)) {
          return 0;
        }
        for (let rangeIdx in this.ranges) {
          rangeIdx = Number(rangeIdx);
          let rangeEntry = this.ranges[rangeIdx];
          let nextEntry = rangeIdx < this.ranges.length - 1 ?
                            this.ranges[rangeIdx + 1] :
                            this.ranges[rangeIdx];
          let lowerBound = rangeIdx === 0 ?
                      Number(rangeEntry.start) :
                      Number(rangeEntry.start) * rangeMultiplier;
          let upperBound = nextEntry.start * rangeMultiplier;
          if (upperBound - lowerBound <= 0) continue; //no difference, continue to next
          if (range >= lowerBound && range <= upperBound) {
            if (rangeEntry.interpolationToNextRange === "linear") {
              let fraction = (range - lowerBound) / (upperBound - lowerBound);
              let currDamage = totalDamage * rangeEntry.damageModifier;
              let nextDamage = totalDamage * nextEntry.damageModifier;
              let ret = currDamage - (currDamage - nextDamage) * fraction;
              return ret;
            } else if (rangeEntry.interpolationToNextRange === "exponential") {
              //TODO: Implement exponential damage interpolation
              return 0;
            }
          }
        }
        //not in ranges
        return 0;
      }
  }

  //abstract class for weapon state. concrete classes follow below
  //WeaponStateDurationFire, WeaponStateSingleFire, WeaponStateContinuousFire
  class WeaponState {
    constructor(weaponInfo, mechState) {
      this.mechState = mechState;
      this.weaponInfo = weaponInfo;
      this.active = true;
      this.weaponCycle = WeaponCycle.READY;
      this.cooldownLeft = 0;
    }

    //returns {weaponFired:<boolean>, ammoConsumed:<number>}
    fireWeapon() {
      throw "Abstract method, should not be called";
    }

    //processes cooldowns on the weapon, making state changes as necessary
    step(stepDuration) {
      throw "Abstract method, should not be called";
    }

    stepStandardFire(stepDuration) {
      //if weapon is firing, reduce durationLeft. if durationLeft <=0, change state to COOLDOWN
      let newState = null;
      let cooldownChanged = false;
      let newDurationLeft = Number(this.durationLeft) - stepDuration;
      this.durationLeft = Math.max(newDurationLeft, 0);
      if (this.durationLeft <= 0) {
        newState = MechModel.WeaponCycle.COOLDOWN;
        this.gotoState(newState);
        //if duration ended in the middle of the tick, subtract the
        //extra time from the cooldown
        this.cooldownLeft +=  newDurationLeft;
      }
      cooldownChanged = true;
      return {newState : newState, cooldownChanged: cooldownChanged};
    }

    stepCooldown(stepDuration) {
      //if weapon is on cooldown, reduce cooldownLeft.
      //if cooldownLeft <=0, change state to ready
      let newState = null;
      let cooldownChanged = false;

      let newCooldownLeft = Number(this.cooldownLeft) - stepDuration;
      this.cooldownLeft = Math.max(newCooldownLeft, 0);
      if (this.cooldownLeft <= 0) {
        newState = MechModel.WeaponCycle.READY;
        this.gotoState(newState);
      }
      cooldownChanged = true;
      return {newState: newState, cooldownChanged : cooldownChanged};
    }

    stepJammed(stepDuration) {
      let newState = null;
      let cooldownChanged = false;
      let newJamLeft = Number(this.jamLeft) - stepDuration;
      this.jamLeft = Math.max(newJamLeft, 0);
      if (this.jamLeft <= 0) {
        newState = MechModel.WeaponCycle.COOLDOWN;
        this.gotoState(newState);
        this.cooldownLeft += newJamLeft;
        cooldownChanged = true;
      }
      return {newState: newState, cooldownChanged: cooldownChanged};
    }

    gotoState(weaponCycle) {
      let prevCycle = this.weaponCycle;
      this.weaponCycle = weaponCycle;
      this.cooldownLeft = 0;
      this.spoolupLeft = 0;
      this.durationLeft = 0;
      if (weaponCycle === WeaponCycle.READY) {
        this.currShotsDuringCooldown = this.weaponInfo.shotsDuringCooldown;
        //do nothing
      } else if (weaponCycle === WeaponCycle.FIRING) {
        this.durationLeft = this.computeWeaponDuration();
      } else if (weaponCycle === WeaponCycle.COOLDOWN) {
        this.cooldownLeft = this.computeWeaponCooldown();
      } else if (weaponCycle === WeaponCycle.SPOOLING) {
        this.spoolupLeft = Number(this.weaponInfo.spinup);
      } else if (weaponCycle === WeaponCycle.DISABLED) {
        //set cooldown to max so it displays properly in the view
        this.cooldownLeft = this.computeWeaponCooldown();
        this.active = false;
      } else if (weaponCycle === WeaponCycle.JAMMED) {
        this.cooldownLeft = this.computeWeaponCooldown();
        //TODO Check uacJamMethod to compute jam time
        this.jamLeft = this.computeJamTime();
        this.currShotsDuringCooldown = 0;
      }
    }
    canFire() {
      return this.weaponCycle === WeaponCycle.READY ||
            (this.weaponCycle === WeaponCycle.COOLDOWN &&
             this.currShotsDuringCooldown > 0) ||
            (this.weaponCycle === WeaponCycle.FIRING &&
            this.weaponInfo.isContinuousFire());
    }
    isReady() {
      return this.weaponCycle === WeaponCycle.READY;
    }
    isOnCooldown() {
      return this.weaponCycle === WeaponCycle.COOLDOWN;
    }
    //Computes the cooldown for this weapon on a mech, taking modifiers into account
    computeWeaponCooldown() {
      let weaponBonus = this.weaponInfo.weaponBonus;
      let cooldownMultiplier = 1.0 + weaponBonus.cooldown_multiplier;
      return Number(this.weaponInfo.cooldown * cooldownMultiplier);
    }

    //Computes this weapon's duration on a mech, taking modifiers into account
    computeWeaponDuration() {
      let weaponBonus = this.weaponInfo.weaponBonus;
      let durationMultiplier = 1.0 + weaponBonus.duration_multiplier;
      return Number(this.weaponInfo.duration * durationMultiplier);
    }

    //Computes this weapon's heat on a given mech, taking modifiers into account
    computeHeat() {
      let weaponBonus = this.weaponInfo.weaponBonus;
      let heatMultiplier = 1.0 + weaponBonus.heat_multiplier;
      return Number(this.weaponInfo.heat * heatMultiplier);
    }

    computeJamTime() {
      //TODO: See if any quirks affect jam time
      return Number(this.weaponInfo.jamTime);
    }
  }

  //state for duration fire weapons (e.g. lasers)
  class WeaponStateDurationFire extends WeaponState {
    constructor(weaponInfo, mechState) {
      super(weaponInfo, mechState);
      this.durationLeft = 0;
    }

    fireWeapon() {
      //if not ready to fire, proceed to next weapon
      if (!this.active || !this.canFire()) {
        return {weaponFired: false, ammoConsumed: 0};
      }
      this.gotoState(MechModel.WeaponCycle.FIRING);
      //assumes duration weapons don't consume ammo
      return {weaponFired: true, ammoConsumed: 0};
    }

    step(stepDuration) {
      let ammoConsumed = 0;
      let weaponFired = false;
      let newState = null;
      let cooldownChanged = false;
      let weaponInfo = this.weaponInfo;
      let ammoState = this.mechState.ammoState;
      if (!this.active) { //if weapon disabled, return
        return {newState : newState,
                weaponFired : weaponFired,
                ammoConsumed: ammoConsumed,
                cooldownChanged: cooldownChanged};
      }
      if (this.weaponCycle === MechModel.WeaponCycle.FIRING) {
        let fireStatus = this.stepStandardFire(stepDuration);
        newState = fireStatus.newState;
        cooldownChanged = fireStatus.cooldownChanged;
      } else if (this.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
        let cooldownStatus = this.stepCooldown(stepDuration);
        newState = cooldownStatus.newState;
        cooldownChanged = cooldownStatus.cooldownChanged;
      }
      return {newState : newState,
              weaponFired : weaponFired,
              ammoConsumed: ammoConsumed,
              cooldownChanged: cooldownChanged};
    }

    canFire() {
      return this.weaponCycle === WeaponCycle.READY;
    }
  }

  //Single fire weapons (ACs, PPCs, UACs, Gauss)
  class WeaponStateSingleFire extends WeaponState {
    constructor(weaponInfo, mechState) {
      super(weaponInfo, mechState);
      this.spoolupLeft = 0;
      this.jamLeft = 0;
      this.currShotsDuringCooldown = weaponInfo.shotsDuringCooldown;
    }

    fireWeapon() {
      let weaponInfo = this.weaponInfo;
      let mechState = this.mechState;
      //if not ready to fire, proceed to next weapon
      if (!this.active || !this.canFire()) {
        return {weaponFired: false, ammoConsumed: 0};
      }
      //if no ammo, return
      if (weaponInfo.requiresAmmo() &&
        mechState.ammoState.ammoCountForWeapon(weaponInfo.weaponId) <= 0) {
        return {weaponFired: false, ammoConsumed: 0};
      }
      if (weaponInfo.spinup > 0) {
        //if weapon has spoolup, set state to SPOOLING and set value of spoolupLeft
        this.gotoState(MechModel.WeaponCycle.SPOOLING);
        return {weaponFired: false, ammoConsumed: 0};
      } else {
        let weaponFired = false;
        let ammoConsumed = 0;
        if (this.weaponCycle === MechModel.WeaponCycle.READY) {
          this.gotoState(MechModel.WeaponCycle.FIRING);
          weaponFired = true;
        } else if (this.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
          //DOUBLE TAP
          console.log("Double tap: " + this.weaponInfo.name);
          //check jam chance
          let rand = Math.random();
          if (rand <= Number(this.weaponInfo.jamChance)) {
          // if (true) {
            //JAM
            console.log("Jam: " + this.weaponInfo.name);
            this.gotoState(MechModel.WeaponCycle.JAMMED);
            weaponFired = false;
          } else {
            this.currShotsDuringCooldown -= 1;
            weaponFired = true;
          }
        }
        if (weaponFired) {
          if (weaponInfo.requiresAmmo()) {
            ammoConsumed = mechState.ammoState.consumeAmmo(weaponInfo.weaponId,
                                                          weaponInfo.ammoPerShot);
          }
        }
        return {weaponFired : weaponFired, ammoConsumed: ammoConsumed};
      }
    }

    step(stepDuration) {
      let ammoConsumed = 0;
      let weaponFired = false;
      let newState = null;
      let cooldownChanged = false;
      let weaponInfo = this.weaponInfo;
      let ammoState = this.mechState.ammoState;
      if (!this.active) { //if weapon disabled, return
        return {newState : newState,
                weaponFired : weaponFired,
                ammoConsumed: ammoConsumed,
                cooldownChanged: cooldownChanged};
      }
      //if weapon is spooling, reduce spoolleft.
      //if spoolLeft <=0, change state to COOLDOWN
      //(assumes all spoolup weapons have no duration,
      //otherwise next state would be FIRING)
      if (this.weaponCycle === MechModel.WeaponCycle.SPOOLING) {
        let newSpoolLeft = Number(this.spoolupLeft) - stepDuration;
        this.spoolupLeft = Math.max(newSpoolLeft, 0);
        if (this.spoolupLeft <= 0) {
          newState = MechModel.WeaponCycle.COOLDOWN;
          this.gotoState(newState);

          //if the spooling ended in the middle of the tick, subtract the
          //extra time from the cooldown
          this.cooldownLeft += newSpoolLeft;
          //Consume ammo
          if (weaponInfo.requiresAmmo()) {
            ammoConsumed = ammoState.consumeAmmo(weaponInfo.weaponId,
                                                weaponInfo.ammoPerShot);
          }
          weaponFired = true;
        }
        cooldownChanged = true;
      } else if (this.weaponCycle === MechModel.WeaponCycle.FIRING) {
        let fireStatus = this.stepStandardFire(stepDuration);
        newState = fireStatus.newState;
        cooldownChanged = fireStatus.cooldownChanged;
      } else if (this.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
        let cooldownStatus = this.stepCooldown(stepDuration);
        newState = cooldownStatus.newState;
        cooldownChanged = cooldownStatus.cooldownChanged;
      } else if (this.weaponCycle === MechModel.WeaponCycle.JAMMED) {
        let jamStatus = this.stepJammed(stepDuration);
        newState = jamStatus.newState;
        cooldownChanged = jamStatus.cooldownChanged;
      }
      return {newState : newState,
              weaponFired : weaponFired,
              ammoConsumed: ammoConsumed,
              cooldownChanged: cooldownChanged};
    }

    canFire() {
      return this.weaponCycle === WeaponCycle.READY ||
            (this.weaponCycle === WeaponCycle.COOLDOWN &&
             this.currShotsDuringCooldown > 0);
    }
  }

  //Continuous fire weapons (MGs, Flamers, RACs)
  class WeaponStateContinuousFire extends WeaponState {
    constructor(weaponInfo, mechState) {
      super(weaponInfo, mechState);
      this.timeToNextAutoShot = 0;
      this.isOnAutoFire = false;
    }

    fireWeapon() {
      let weaponInfo = this.weaponInfo;
      let mechState = this.mechState;

      //if not ready to fire, proceed to next weapon
      if (!this.active || !this.canFire()) {
        return {weaponFired: false, ammoConsumed: 0};
      }
      //if no ammo, proceed to next weapon
      if (weaponInfo.requiresAmmo() &&
        mechState.ammoState.ammoCountForWeapon(weaponInfo.weaponId) <= 0) {
        return {weaponFired: false, ammoConsumed: 0};
      }
      //if weapon has no duration, set state to FIRING, will go to cooldown on the next step
      let weaponFired = false;
      let ammoConsumed = 0;
      if (this.weaponCycle === MechModel.WeaponCycle.READY) {
        this.gotoState(MechModel.WeaponCycle.FIRING);
        this.isOnAutoFire = true;
        this.timeToNextAutoShot = this.weaponInfo.timeBetweenAutoShots;
        weaponFired = true;
      } else if (this.weaponCycle === MechModel.WeaponCycle.FIRING) {
        //auto fire, step() will handle the actual firing of the weapon
        this.isOnAutoFire = true;
      }
      if (weaponFired) {
        if (weaponInfo.requiresAmmo()) {
          ammoConsumed = mechState.ammoState.consumeAmmo(weaponInfo.weaponId,
                                                        weaponInfo.ammoPerShot);
        }
      }
      return {weaponFired : weaponFired, ammoConsumed: ammoConsumed};
    }

    step(stepDuration) {
      let ammoConsumed = 0;
      let weaponFired = false;
      let newState = null;
      let cooldownChanged = false;
      let weaponInfo = this.weaponInfo;
      let ammoState = this.mechState.ammoState;
      if (!this.active) { //if weapon disabled, return
        return {newState : newState,
                weaponFired : weaponFired,
                ammoConsumed: ammoConsumed,
                cooldownChanged: cooldownChanged};
      }

      if (this.weaponCycle === MechModel.WeaponCycle.FIRING) {
        //Continuous fire weapons autofire
        let newTimeToAutoShot = Number(this.timeToNextAutoShot) - stepDuration;
        this.timeToNextAutoShot = Math.max(0, newTimeToAutoShot);
        if (this.isOnAutoFire) {
          if (this.timeToNextAutoShot <= 0) {
            if (weaponInfo.requiresAmmo()) {
              ammoConsumed = ammoState.consumeAmmo(weaponInfo.weaponId,
                                                  weaponInfo.ammoPerShot);
            }
            //decrease time to next auto shot with newTimetoAutoShot if the shot
            //occurs in the middle of the tick
            this.timeToNextAutoShot =
                    this.weaponInfo.timeBetweenAutoShots + newTimeToAutoShot;
            weaponFired = true;
            //set new state just so the view gets an update to the weapon status (which includes ammo)
            newState = MechModel.WeaponCycle.FIRING;
          }
        } else {
          newState = MechModel.WeaponCycle.COOLDOWN;
          this.gotoState(newState);
          this.timeToNextAutoShot = 0; //TODO: not strictly correct, should count down whenever the weapon is not firing.
        }
        //set isOnAutoFire to false, mech must continue to try firing the
        //weapon for this to be set to true in the next step
        this.isOnAutoFire = false;
      }
      else if (this.weaponCycle === MechModel.WeaponCycle.COOLDOWN) {
        let cooldownStatus = this.stepCooldown(stepDuration);
        newState = cooldownStatus.newState;
        cooldownChanged = cooldownStatus.cooldownChanged;
      } else if (this.weaponCycle === MechModel.WeaponCycle.JAMMED) {
        let jamStatus = this.stepJammed(stepDuration);
        newState = jamStatus.newState;
        cooldownChanged = jamStatus.cooldownChanged;
      }
      return {newState : newState,
              weaponFired : weaponFired,
              ammoConsumed: ammoConsumed,
              cooldownChanged: cooldownChanged};
    }

    canFire() {
      return this.weaponCycle === WeaponCycle.READY ||
            (this.weaponCycle === WeaponCycle.FIRING &&
            this.weaponInfo.isContinuousFire());
    }
  }

  return {
    WeaponInfo : WeaponInfo,
    WeaponStateDurationFire : WeaponStateDurationFire,
    WeaponStateSingleFire : WeaponStateSingleFire,
    WeaponStateContinuousFire : WeaponStateContinuousFire,
  }
})();
