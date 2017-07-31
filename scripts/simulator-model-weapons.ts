"use strict";
/// <reference path="common/simulator-model-common.ts" />
/// <reference path="simulator-smurfytypes.ts" />
/// <reference path="simulator-model.ts" />

//Weapon state classes
namespace MechModelWeapons {
  import WeaponCycle = MechModelCommon.WeaponCycle;

  type MechInfo = MechModel.MechInfo;
  type MechState = MechModel.MechState;

  export class WeaponInfo {
    weaponId : string;
    location : string;
    mechInfo : MechInfo;
    name : string;
    translatedName : string;
    baseMinRange : number;
    baseOptRange : number;
    baseMaxRange : number;
    ranges : SmurfyTypes.SmurfyWeaponRange[];
    baseDmg : number;
    damageMultiplier : number;
    heat : number;
    minHeatPenaltyLevel : number;
    heatPenalty : number;
    heatPenaltyId : number;
    cooldown : number;
    duration : number;
    spinup : number;
    baseSpeed : number;
    ammoPerShot : number;
    dps : number; //TODO see if we still need this
    type : string;
    jamChance : number;
    jamTime : number;
    shotsDuringCooldown : number;
    timeBetweenAutoShots : number;
    rampUpTime : number;
    rampDownTime : number;
    jamRampUpTime : number;
    jamRampDownTime : number;
    isOneShot : boolean;
    volleyDelay : number;
    weaponBonus : {[index:string] : number};
    constructor(weaponId : string,
                location : string,
                smurfyWeaponData : SmurfyTypes.SmurfyWeaponData ,
                mechInfo : MechInfo) {
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
        this.volleyDelay = Number(smurfyWeaponData.volleyDelay) * 1000;

        //Continuous fire weapon fields
        //time between shots on automatic fire for continuous fire weapons (flamers, MGs, RACs);
        this.timeBetweenAutoShots = smurfyWeaponData.rof ?
                      1000 / Number(smurfyWeaponData.rof): 0; //rof is in shots per second
        this.rampUpTime = smurfyWeaponData.rampUpTime ?
                      Number(smurfyWeaponData.rampUpTime) * 1000 : 0;
        this.rampDownTime = smurfyWeaponData.rampDownTime ?
                      Number(smurfyWeaponData.rampDownTime) * 1000 : 0;
        this.jamRampUpTime = smurfyWeaponData.jamRampUpTime ?
                      Number(smurfyWeaponData.jamRampUpTime) * 1000 : 0;
        this.jamRampDownTime = smurfyWeaponData.jamRampDownTime ?
                      Number(smurfyWeaponData.jamRampDownTime) * 1000 : 0;

        //One shot weapon fields
        this.isOneShot = smurfyWeaponData.isOneShot ? true : false;

        //Computed fields
        this.weaponBonus = MechModelQuirks.getWeaponBonus(this);
        //recompute heat to be heat per SHOT for continuous fire weapons
        //(in smurfy heat is heat per second, not per shot)
        if (this.isContinuousFire()) {
          this.heat = this.heat / Number(smurfyWeaponData.rof);
        }
      }
      get speed() {
        let speedMultiplier = 1 + Number(this.weaponBonus.velocity_multiplier);
        return this.baseSpeed * speedMultiplier;
      }
      set speed(data) {
        throw Error("speed cannot be set.");
      }
      get minRange() {
        //min range not affected by multiplier
        return this.baseMinRange;
      }
      set minRange(value) {
        throw Error("minRange cannot be set.");
      }
      get optRange() {
        let rangeMultiplier = 1 + Number(this.weaponBonus.range_multiplier);
        return this.baseOptRange * rangeMultiplier;
      }
      set optRange(value) {
        throw Error("optRange cannot be set.");
      }
      get maxRange() {
        let rangeMultiplier = 1 + Number(this.weaponBonus.range_multiplier);
        return this.baseMaxRange * rangeMultiplier;
      }
      set maxRange(value) {
        throw Error("maxRange cannot be set.");
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
      damageAtRange(range : number) {
        let totalDamage = Number(this.baseDmg) * Number(this.damageMultiplier);
        let ret = totalDamage;
        let rangeMultiplier = 1 + Number(this.weaponBonus.range_multiplier);

        if (Number(range) < Number(this.minRange)
            || Number(range) > Number(this.maxRange)) {
          return 0;
        }
        for (let rangeIdx in this.ranges) {
          let rangeEntry = this.ranges[rangeIdx];
          let nextEntry = Number(rangeIdx) < this.ranges.length - 1 ?
                            this.ranges[Number(rangeIdx) + 1] :
                            this.ranges[rangeIdx];
          let lowerBound = Number(rangeIdx) === 0 ?
                      Number(rangeEntry.start) :
                      Number(rangeEntry.start) * rangeMultiplier;
          let upperBound = nextEntry.start * rangeMultiplier;
          if (upperBound - lowerBound <= 0) {
            continue; //no difference, continue to next
          }
          if (range >= lowerBound && range <= upperBound) {
            if (rangeEntry.interpolationToNextRange === "linear") {
              let fraction = (range - lowerBound) / (upperBound - lowerBound);
              let currDamage = totalDamage * rangeEntry.damageModifier;
              let nextDamage = totalDamage * nextEntry.damageModifier;
              ret = currDamage - (currDamage - nextDamage) * fraction;
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

  export interface WeaponStateChange {
    newState? : WeaponCycle;
    weaponFired? : boolean;
    ammoConsumed? : number;
    cooldownChanged? : boolean;
  }

  //abstract class for weapon state. concrete classes follow below
  //WeaponStateDurationFire, WeaponStateSingleFire, WeaponStateContinuousFire
  export abstract class WeaponState {
    mechState : MechState;
    weaponInfo : WeaponInfo;
    active : boolean;
    weaponCycle : WeaponCycle;
    cooldownLeft : number;
    volleyDelayLeft : number;
    //TODO: see if these fields can be pushed to subclasses without too much method duplication
    durationLeft : number;
    jamLeft : number;
    spoolupLeft : number;
    currShotsDuringCooldown : number;

    constructor(weaponInfo : WeaponInfo, mechState : MechState) {
      this.mechState = mechState;
      this.weaponInfo = weaponInfo;
      this.active = true;
      this.weaponCycle = WeaponCycle.READY;
      this.cooldownLeft = 0;
      this.resetVolleyDelay();
    }

    resetVolleyDelay() : void {
      this.volleyDelayLeft = this.weaponInfo.volleyDelay;
    }

    //returns {newState: <new state>, weaponFired:<boolean>, ammoConsumed:<number>}
    abstract fireWeapon() : WeaponStateChange;

    //processes cooldowns on the weapon, making state changes as necessary
    abstract step(stepDuration : number) : WeaponStateChange;

    //Computes the maximum DPS a weapon can deliver at the given range
    abstract computeMaxDPS(range : number) : number;

    stepPrechecks(stepDuration : number) : WeaponStateChange {
      let newState = null;
      let weaponFired = false;
      let ammoConsumed = 0;
      let cooldownChanged = false;
      if (!this.active) { //if weapon disabled, return
        return {newState : newState,
                weaponFired : weaponFired,
                ammoConsumed: ammoConsumed,
                cooldownChanged: cooldownChanged};
      }
      if (this.weaponCycle !== WeaponCycle.FIRING) {
        this.volleyDelayLeft = Math.max(0, this.volleyDelayLeft - stepDuration);
      }
      return null;
    }

    stepStandardFire(stepDuration : number) : WeaponStateChange {
      //if weapon is firing, reduce durationLeft. if durationLeft <=0, change state to COOLDOWN
      let newState = null;
      let cooldownChanged = false;
      let newDurationLeft = Number(this.durationLeft) - stepDuration;
      this.durationLeft = Math.max(newDurationLeft, 0);
      if (this.durationLeft <= 0) {
        newState = WeaponCycle.COOLDOWN;
        this.gotoState(newState);
        //if duration ended in the middle of the tick, subtract the
        //extra time from the cooldown
        this.cooldownLeft +=  newDurationLeft;
      }
      cooldownChanged = true;
      return {newState : newState, cooldownChanged: cooldownChanged};
    }

    stepCooldown(stepDuration : number) {
      //if weapon is on cooldown, reduce cooldownLeft.
      //if cooldownLeft <=0, change state to ready
      let newState = null;
      let cooldownChanged = false;

      let newCooldownLeft = Number(this.cooldownLeft) - stepDuration;
      this.cooldownLeft = Math.max(newCooldownLeft, 0);
      if (this.cooldownLeft <= 0) {
        newState = WeaponCycle.READY;
        this.gotoState(newState);
      }
      cooldownChanged = true;
      return {newState: newState, cooldownChanged : cooldownChanged};
    }

    stepJammed(stepDuration : number) {
      let newState = null;
      let cooldownChanged = false;
      let newJamLeft = Number(this.jamLeft) - stepDuration;
      this.jamLeft = Math.max(newJamLeft, 0);
      if (this.jamLeft <= 0) {
        newState = WeaponCycle.COOLDOWN;
        this.gotoState(newState);
        this.cooldownLeft += newJamLeft;
        cooldownChanged = true;
      }
      return {newState: newState, cooldownChanged: cooldownChanged};
    }

    gotoState(weaponCycle : WeaponCycle, updateTimers = true) {
      let prevCooldownLeft = this.cooldownLeft;
      this.weaponCycle = weaponCycle;
      if (updateTimers) {
        this.cooldownLeft = 0;
        this.spoolupLeft = 0;
        this.durationLeft = 0;
        if (weaponCycle === WeaponCycle.READY) {
          this.currShotsDuringCooldown = this.weaponInfo.shotsDuringCooldown;
        } else if (weaponCycle === WeaponCycle.FIRING) {
          this.durationLeft = this.computeWeaponDuration();
          this.resetVolleyDelay();
        } else if (weaponCycle === WeaponCycle.COOLDOWN) {
          this.cooldownLeft = this.computeWeaponCooldown();
        } else if (weaponCycle === WeaponCycle.COOLDOWN_FIRING) {
          this.cooldownLeft = prevCooldownLeft;
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
    }

    getAvailableAmmo() {
      if (this.weaponInfo.requiresAmmo()) {
        let ammoState = this.mechState.ammoState;
        let ammoCount = ammoState.ammoCounts[this.weaponInfo.weaponId];
        let ret = ammoCount ? ammoCount.ammoCount : 0;
        return ret;
      } else {
        return -1; //does not need ammo
      }
    }

    consumeAmmo() {
      let weaponInfo = this.weaponInfo;
      let ammoState = this.mechState.ammoState;
      let ammoConsumed = 0;
      if (this.weaponInfo.requiresAmmo()) {
        ammoConsumed = ammoState.consumeAmmo(weaponInfo.weaponId,
                                                      weaponInfo.ammoPerShot);
      }
      return ammoConsumed;
    }

    abstract canFire() : boolean;

    isReady() {
      return this.weaponCycle === WeaponCycle.READY;
    }
    isOnCooldown() {
      return this.weaponCycle === WeaponCycle.COOLDOWN;
    }
    isJammed() {
      return this.weaponCycle === WeaponCycle.JAMMED;
    }
    hasJamBar() {
      return false;
    }
    getJamProgress() : number {
      throw Error("getJamProgress should only be called if hasJamBar() is true");
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

    computeJamChance() {
      let weaponBonus = this.weaponInfo.weaponBonus;
      let jamMultiplier = 1.0 + weaponBonus.jamchance_multiplier;
      return Number(this.weaponInfo.jamChance) * jamMultiplier;
    }

    computeJamTime() {
      //TODO: See if any quirks affect jam time
      return Number(this.weaponInfo.jamTime);
    }

    computeTimeBetweenAutoShots() {
      return Number(this.weaponInfo.timeBetweenAutoShots);
    }
  }

  //state for duration fire weapons (e.g. lasers)
  export class WeaponStateDurationFire extends WeaponState {
    constructor(weaponInfo : WeaponInfo, mechState : MechState) {
      super(weaponInfo, mechState);
      this.durationLeft = 0;
    }

    fireWeapon() : WeaponStateChange {
      let newState = null;
      //if not ready to fire, proceed to next weapon
      if (!this.active || !this.canFire()) {
        return {weaponFired: false, ammoConsumed: 0};
      }
      newState = WeaponCycle.FIRING;
      this.gotoState(newState);
      //assumes duration weapons don't consume ammo
      return {newState: newState, weaponFired: true, ammoConsumed: 0};
    }

    step(stepDuration : number) {
      let ammoConsumed = 0;
      let weaponFired = false;
      let newState = null;
      let cooldownChanged = false;
      let weaponInfo = this.weaponInfo;
      let precheckStatus = this.stepPrechecks(stepDuration);
      if (precheckStatus) {
        return precheckStatus;
      }
      if (this.weaponCycle === WeaponCycle.FIRING) {
        let fireStatus = this.stepStandardFire(stepDuration);
        newState = fireStatus.newState;
        cooldownChanged = fireStatus.cooldownChanged;
      } else if (this.weaponCycle === WeaponCycle.COOLDOWN) {
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

    computeMaxDPS(range : number) : number {
      let weaponInfo = this.weaponInfo;
      let baseDamage = weaponInfo.damageAtRange(range);
      return baseDamage
          / (this.computeWeaponCooldown() + this.computeWeaponDuration());
    }
  }

  //Single fire weapons (ACs, PPCs, UACs, Gauss)
  export class WeaponStateSingleFire extends WeaponState {
    constructor(weaponInfo : WeaponInfo, mechState : MechState) {
      super(weaponInfo, mechState);
      this.spoolupLeft = 0;
      this.jamLeft = 0;
      this.currShotsDuringCooldown = weaponInfo.shotsDuringCooldown;
    }

    fireWeapon() : WeaponStateChange {
      let newState = null;
      let weaponInfo = this.weaponInfo;
      let mechState = this.mechState;
      //if not ready to fire, proceed to next weapon
      if (!this.active || !this.canFire()) {
        return {newState: newState, weaponFired: false, ammoConsumed: 0};
      }
      //if no ammo, return
      if (weaponInfo.requiresAmmo() &&
          this.getAvailableAmmo() <= 0) {
        return {newState: newState, weaponFired: false, ammoConsumed: 0};
      }
      if (weaponInfo.spinup > 0) {
        //if weapon has spoolup, set state to SPOOLING and set value of spoolupLeft
        newState = WeaponCycle.SPOOLING;
        this.gotoState(newState);
        return {newState: newState, weaponFired: false, ammoConsumed: 0};
      } else {
        let weaponFired = false;
        let ammoConsumed = 0;
        if (this.weaponCycle === WeaponCycle.READY) {
          newState = WeaponCycle.FIRING;
          this.gotoState(newState);
          weaponFired = true;
        } else if (this.weaponCycle === WeaponCycle.COOLDOWN) {
          //check jam chance
          let rand = Math.random();
          if (rand <= this.computeJamChance()) {
          // if (true) {
            //JAM
            console.log("Jam: " + this.weaponInfo.name);
            newState = WeaponCycle.JAMMED;
            this.gotoState(newState);
            weaponFired = false;
          } else {
            console.log("Double tap: " + this.weaponInfo.name);
            newState = WeaponCycle.COOLDOWN_FIRING;
            this.gotoState(newState);
            this.currShotsDuringCooldown -= 1;
            weaponFired = true;
          }
        }
        if (weaponFired) {
          if (weaponInfo.requiresAmmo()) {
            ammoConsumed = this.consumeAmmo();;
          }
        }
        return {newState : newState, weaponFired : weaponFired, ammoConsumed: ammoConsumed};
      }
    }

    step(stepDuration : number) : WeaponStateChange {
      let ammoConsumed = 0;
      let weaponFired = false;
      let newState = null;
      let cooldownChanged = false;
      let weaponInfo = this.weaponInfo;
      let precheckStatus = this.stepPrechecks(stepDuration);
      if (precheckStatus) {
        return precheckStatus;
      }
      //if weapon is spooling, reduce spoolleft.
      //if spoolLeft <=0, change state to COOLDOWN
      //(assumes all spoolup weapons have no duration,
      //otherwise next state would be FIRING)
      if (this.weaponCycle === WeaponCycle.SPOOLING) {
        let newSpoolLeft = Number(this.spoolupLeft) - stepDuration;
        this.spoolupLeft = Math.max(newSpoolLeft, 0);
        if (this.spoolupLeft <= 0) {
          newState = WeaponCycle.COOLDOWN;
          this.gotoState(newState);

          //if the spooling ended in the middle of the tick, subtract the
          //extra time from the cooldown
          this.cooldownLeft += newSpoolLeft;
          //Consume ammo
          if (weaponInfo.requiresAmmo()) {
            ammoConsumed = this.consumeAmmo();;
          }
          weaponFired = true;
        }
        cooldownChanged = true;
      } else if (this.weaponCycle === WeaponCycle.FIRING) {
        let fireStatus = this.stepStandardFire(stepDuration);
        newState = fireStatus.newState;
        cooldownChanged = fireStatus.cooldownChanged;
      } else if (this.weaponCycle === WeaponCycle.COOLDOWN ||
                  this.weaponCycle === WeaponCycle.COOLDOWN_FIRING) {
        if (this.weaponCycle === WeaponCycle.COOLDOWN_FIRING) {
          newState = WeaponCycle.COOLDOWN;
          this.gotoState(newState, false);
        }
        let cooldownStatus = this.stepCooldown(stepDuration);
        newState = newState || cooldownStatus.newState;
        cooldownChanged = cooldownStatus.cooldownChanged;
      } else if (this.weaponCycle === WeaponCycle.JAMMED) {
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
             this.currShotsDuringCooldown > 0 &&
             this.volleyDelayLeft <= 0);
    }

    computeMaxDPS(range : number) : number {
      let weaponInfo = this.weaponInfo;
      let baseDamage = weaponInfo.damageAtRange(range);
      //Double tap
      if (weaponInfo.shotsDuringCooldown) {
        baseDamage += weaponInfo.shotsDuringCooldown * baseDamage;
      }
      return baseDamage / (this.computeWeaponCooldown());
    }
  }

  //Continuous fire weapons (MGs, Flamers, RACs)
  const MAXJAM = 100;
  export class WeaponStateContinuousFire extends WeaponState {
    timeToNextAutoShot : number;
    isOnAutoFire : boolean;
    jamBarProgress : number;
    rampUpLeft : number;

    constructor(weaponInfo : WeaponInfo, mechState : MechState) {
      super(weaponInfo, mechState);
      this.timeToNextAutoShot = 0;
      this.isOnAutoFire = false;
      this.jamLeft = 0;
      this.jamBarProgress = 0; //0 to MAXJAM
      this.resetRampup();
    }

    hasJamBar() : boolean {
      return this.weaponInfo.jamRampUpTime > 0;
    }
    //returns 0 to 1
    getJamProgress() : number {
      return this.jamBarProgress / MAXJAM;
    }

    incrementJamBar(stepDuration : number) : void {
      let stepProgress = MAXJAM * (stepDuration / this.weaponInfo.jamRampUpTime);
      this.jamBarProgress = Math.min(MAXJAM, this.jamBarProgress + stepProgress);
    }

    decrementJamBar(stepDuration : number) : void {
      let stepProgress = MAXJAM * (stepDuration / this.weaponInfo.jamRampDownTime);
      this.jamBarProgress = Math.max(0, this.jamBarProgress - stepProgress);
    }

    resetRampup() : void {
      this.rampUpLeft = this.weaponInfo.rampUpTime ?
                          Number(this.weaponInfo.rampUpTime) : 0;
    }

    fireWeapon() : WeaponStateChange {
      let newState = null;
      let weaponInfo = this.weaponInfo;
      let mechState = this.mechState;

      //if not ready to fire, proceed to next weapon
      if (!this.active || !this.canFire()) {
        return {newState: newState, weaponFired: false, ammoConsumed: 0};
      }
      //if no ammo, proceed to next weapon
      if (weaponInfo.requiresAmmo() &&
        this.getAvailableAmmo() <= 0) {
        return {newState: newState, weaponFired: false, ammoConsumed: 0};
      }
      //if weapon has no duration, set state to FIRING, will go to cooldown on the next step
      let weaponFired = false;
      let ammoConsumed = 0;
      if (this.weaponCycle === WeaponCycle.READY) {
        newState = WeaponCycle.FIRING;
        this.gotoState(newState);
        this.isOnAutoFire = true;
        //weapon not fired here, will be handled by step()
      } else if (this.weaponCycle === WeaponCycle.FIRING) {
        //auto fire, step() will handle the actual firing of the weapon
        this.isOnAutoFire = true;
      }
      if (weaponFired) {
        if (weaponInfo.requiresAmmo()) {
          ammoConsumed = this.consumeAmmo();;
        }
      }
      return {newState: newState, weaponFired : weaponFired, ammoConsumed: ammoConsumed};
    }

    step(stepDuration : number) : WeaponStateChange {
      let ammoConsumed = 0;
      let weaponFired = false;
      let newState = null;
      let cooldownChanged = false;
      let weaponInfo = this.weaponInfo;
      let precheckStatus = this.stepPrechecks(stepDuration);
      if (precheckStatus) {
        return precheckStatus;
      }

      if (this.weaponCycle === WeaponCycle.FIRING) {
        this.incrementJamBar(stepDuration);
        cooldownChanged = true;
        this.rampUpLeft = Math.max(0, this.rampUpLeft - stepDuration);
        if (this.rampUpLeft <= 0) {
          if (this.hasJamBar() && this.jamBarProgress >= MAXJAM) {
            //check for jam
            let rand = Math.random();
            if (rand <= this.computeJamChance()) {
              console.log("Jam: " + this.weaponInfo.name);
              newState = WeaponCycle.JAMMED;
              this.gotoState(newState);
              weaponFired = false;
            }
          }
          if (this.weaponCycle !== WeaponCycle.JAMMED) {
            let autoFireStatus = this.stepAutoFire(stepDuration);
            newState = autoFireStatus.newState;
            weaponFired = autoFireStatus.weaponFired;
            ammoConsumed = autoFireStatus.ammoConsumed;
            cooldownChanged = cooldownChanged || autoFireStatus.cooldownChanged;
          }
        }
      } else {
        this.decrementJamBar(stepDuration);
        this.resetRampup();
        if (this.weaponCycle === WeaponCycle.COOLDOWN) {
          let cooldownStatus = this.stepCooldown(stepDuration);
          newState = cooldownStatus.newState;
          cooldownChanged = cooldownStatus.cooldownChanged;
        } else if (this.weaponCycle === WeaponCycle.JAMMED) {
          let jamStatus = this.stepJammed(stepDuration);
          newState = jamStatus.newState;
          cooldownChanged = jamStatus.cooldownChanged;
        }
      }
      return {newState : newState,
              weaponFired : weaponFired,
              ammoConsumed: ammoConsumed,
              cooldownChanged: cooldownChanged};
    }

    stepAutoFire(stepDuration : number) : WeaponStateChange {
      let newState = null;
      let weaponFired = false;
      let ammoConsumed = 0;
      let cooldownChanged = false;
      let weaponInfo = this.weaponInfo;
      //Continuous fire weapons autofire
      let newTimeToAutoShot = Number(this.timeToNextAutoShot) - stepDuration;
      this.timeToNextAutoShot = Math.max(0, newTimeToAutoShot);
      if (this.isOnAutoFire) {
        if (this.timeToNextAutoShot <= 0) {
          if (weaponInfo.requiresAmmo()) {
            ammoConsumed = this.consumeAmmo();;
          }
          //decrease time to next auto shot with newTimetoAutoShot if the shot
          //occurs in the middle of the tick
          this.timeToNextAutoShot =
                  this.computeTimeBetweenAutoShots() + newTimeToAutoShot;
          weaponFired = true;
          //set new state just so the view gets an update to the weapon status (which includes ammo)
          newState = WeaponCycle.FIRING;
        }
      } else {
        newState = WeaponCycle.COOLDOWN;
        this.gotoState(newState);
        //TODO: not strictly correct, should count down whenever the weapon is
        //not firing. However since rampup times are larger than autoshot times,
        //this should not affect correctness of behavior
        this.timeToNextAutoShot = 0;
      }
      //set isOnAutoFire to false, mech must continue to try firing the
      //weapon for this to be set to true in the next step
      this.isOnAutoFire = false;
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

    computeMaxDPS(range : number) : number {
      let weaponInfo = this.weaponInfo;
      let baseDamage = weaponInfo.damageAtRange(range);

      //number of autoshots per second
      let rof = 1000 / this.computeTimeBetweenAutoShots();
      return baseDamage * rof;
    }
  }

  export class WeaponStateOneShot extends WeaponStateSingleFire {
    ammoRemaining : number;

    constructor(weaponInfo : WeaponInfo, mechState : MechState) {
      super(weaponInfo, mechState);
      this.ammoRemaining = Number(this.weaponInfo.ammoPerShot);
    }

    getAvailableAmmo() {
      if (this.weaponInfo.requiresAmmo()) {
        return this.ammoRemaining;
      } else {
        throw Error("Unexpected: single shot weapon that does not require ammo");
      }
    }

    consumeAmmo() {
      let ret = this.ammoRemaining;
      this.ammoRemaining = 0;
      return ret;
    }

    computeMaxDPS(range : number) : number {
      let weaponInfo = this.weaponInfo;
      let baseDamage = weaponInfo.damageAtRange(range);
      return baseDamage;
    }
  }
};
