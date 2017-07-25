"use strict";

var MechAccuracyPattern = MechAccuracyPattern || (function () {

  //Functions that determine how damage from a weapon is spread
  //type is function(MechModel.WeaponDamage, range) -> MechModel.WeaponDamage
  var fullAccuracyPattern = function(weaponDamage, range) {
    //Does not spread the damage
    return weaponDamage;
  }

  //Spreads the damage to adjacent components and those two components over,
  //with the given percentages percentOnTarget, percentOnAdjacent,
  //percentOnNextToAdjacent between 0 and 1,
  //and their total must be less than one
  //Any left over is considered a miss
  var accuracySpreadToAdjacent = function(percentOnTarget,
                                            percentOnAdjacent,
                                            percentOnNextToAdjacent) {
    if (percentOnTarget + percentOnAdjacent + percentOnNextToAdjacent > 1) {
      console.warn("Total damage percentage exceeds 1");
    }
    return function(weaponDamage, range) {
      let transformedDamage = new MechModel.WeaponDamage({});

      for (let component in weaponDamage.damageMap) {
        let newComponentDamage =
            Number(weaponDamage.damageMap[component]) *
            Number(percentOnTarget);

        let totalAdjacentDamage =
            Number(weaponDamage.damageMap[component]) *
            Number(percentOnAdjacent);
        let currentDamage = transformedDamage.damageMap[component];
        transformedDamage.damageMap[component] = currentDamage ?
                                    currentDamage + newComponentDamage
                                    : newComponentDamage;
        //Assumes there are always 2 adjacent components. If the getAdjacentComponents
        //method only returns one, then half of the totalAdjacentDamage is lost
        //e.g. if the component is an arm, it applies half of the percentOnAdjacent * damge to the connected torso,
        //while the other half misses
        let perAdjacentComponentDamage = totalAdjacentDamage / 2;
        let adjacentComponents = MechModel.getAdjacentComponents(component);
        for (let adjacentComponent of adjacentComponents) {
          let currentDamage = transformedDamage.damageMap[adjacentComponent];
          transformedDamage.damageMap[adjacentComponent] = currentDamage ?
                                    currentDamage + perAdjacentComponentDamage
                                    : perAdjacentComponentDamage;
        }

        let totalNextToAdjacentDamage =
                  Number(weaponDamage.damageMap[component]) *
                  Number(percentOnNextToAdjacent);

        let nextToAdjacentComponents = [];
        let alreadyProcessed = new Set(adjacentComponents);
        alreadyProcessed.add(component);
        //Find next to adjacent components
        for (let adjacentComponent of adjacentComponents) {
          let nextComponents = MechModel.getAdjacentComponents(adjacentComponent);
          for (let nextComponent of nextComponents) {
            if (!alreadyProcessed.has(nextComponent)) {
              nextToAdjacentComponents.push(nextComponent);
              alreadyProcessed.add(nextComponent);
            }
          }
        }
        //assumes there are also just 2 components next to the adjacent components
        //Damage to torso will not transfer to legs in this model (but damage to
        //legs can transfer to the torso). See MechModel.getAdjacentComponents for
        //the connectivity graph
        let perNextAdjacentComponentDamage = totalNextToAdjacentDamage / 2;
        for (let nextComponent of nextToAdjacentComponents) {
          let currentDamage = transformedDamage.damageMap[nextComponent];
          transformedDamage.damageMap[nextComponent] = currentDamage ?
                                  currentDamage + perNextAdjacentComponentDamage
                                  : perNextAdjacentComponentDamage;
        }
      }
      return transformedDamage;
    }
  }

  //Weapon specific accuracy patterns
  //MUST be applied as the first transform on the raw weapon damage (even before mech accuracy)
  var weaponAccuracyMap;
  var getWeaponAccuracyPattern = function(weaponInfo) {
    weaponAccuracyMap = weaponAccuracyMap ||
      { "ClanERPPC" : MechAccuracyPattern.splashPPCPattern("ClanERPPC"),
        "HeavyPPC" : MechAccuracyPattern.splashPPCPattern("HeavyPPC"), //in preparation for newtech
        "LRM5" : MechAccuracyPattern.seekerPattern(_LRM5Spread),
        "LRM10" : MechAccuracyPattern.seekerPattern(_LRM10Spread),
        "LRM15" : MechAccuracyPattern.seekerPattern(_LRM15Spread),
        "LRM20" : MechAccuracyPattern.seekerPattern(_LRM20Spread),
        "LRM5_Artemis" : MechAccuracyPattern.seekerPattern(_ALRM5Spread),
        "LRM10_Artemis" : MechAccuracyPattern.seekerPattern(_ALRM10Spread),
        "LRM15_Artemis" : MechAccuracyPattern.seekerPattern(_ALRM15Spread),
        "LRM20_Artemis" : MechAccuracyPattern.seekerPattern(_ALRM20Spread),
        "ClanLRM5" : MechAccuracyPattern.seekerPattern(_cLRM5Spread),
        "ClanLRM10" : MechAccuracyPattern.seekerPattern(_cLRM10Spread),
        "ClanLRM15" : MechAccuracyPattern.seekerPattern(_cLRM15Spread),
        "ClanLRM20" : MechAccuracyPattern.seekerPattern(_cLRM20Spread),
        "ClanLRM5_Artemis" : MechAccuracyPattern.seekerPattern(_cALRM5Spread),
        "ClanLRM10_Artemis" : MechAccuracyPattern.seekerPattern(_cALRM10Spread),
        "ClanLRM15_Artemis" : MechAccuracyPattern.seekerPattern(_cALRM15Spread),
        "ClanLRM20_Artemis" : MechAccuracyPattern.seekerPattern(_cALRM20Spread),
        "SRM2" : MechAccuracyPattern.directFireSpreadPattern(_SRM2Spread),
        "SRM4" : MechAccuracyPattern.directFireSpreadPattern(_SRM4Spread),
        "SRM6" : MechAccuracyPattern.directFireSpreadPattern(_SRM6Spread),
        "SRM2_Artemis" : MechAccuracyPattern.directFireSpreadPattern(_ASRM2Spread),
        "SRM4_Artemis" : MechAccuracyPattern.directFireSpreadPattern(_ASRM4Spread),
        "SRM6_Artemis" : MechAccuracyPattern.directFireSpreadPattern(_ASRM6Spread),
        "ClanSRM2": MechAccuracyPattern.directFireSpreadPattern(_cSRM2Spread),
        "ClanSRM4": MechAccuracyPattern.directFireSpreadPattern(_cSRM4Spread),
        "ClanSRM6": MechAccuracyPattern.directFireSpreadPattern(_cSRM6Spread),
        "ClanSRM2_Artemis": MechAccuracyPattern.directFireSpreadPattern(_cASRM2Spread),
        "ClanSRM4_Artemis": MechAccuracyPattern.directFireSpreadPattern(_cASRM4Spread),
        "ClanSRM6_Artemis": MechAccuracyPattern.directFireSpreadPattern(_cASRM6Spread),
        "StreakSRM2" : MechAccuracyPattern.seekerPattern(_StreakSpread),
        "ClanStreakSRM2" : MechAccuracyPattern.seekerPattern(_StreakSpread),
        "ClanStreakSRM4" : MechAccuracyPattern.seekerPattern(_StreakSpread),
        "ClanStreakSRM6" : MechAccuracyPattern.seekerPattern(_StreakSpread),
        "MRM10" : MechAccuracyPattern.directFireSpreadPattern(_MRM10Spread),
        "MRM20" : MechAccuracyPattern.directFireSpreadPattern(_MRM20Spread),
        "MRM30" : MechAccuracyPattern.directFireSpreadPattern(_MRM30Spread),
        "MRM40" : MechAccuracyPattern.directFireSpreadPattern(_MRM40Spread),
        "ClanATM3" : MechAccuracyPattern.seekerPattern(_cATM3Spread),
        "ClanATM6" : MechAccuracyPattern.seekerPattern(_cATM6Spread),
        "ClanATM9" : MechAccuracyPattern.seekerPattern(_cATM9Spread),
        "ClanATM12" : MechAccuracyPattern.seekerPattern(_cATM12Spread),
      };
    return weaponAccuracyMap[weaponInfo.name];
  }

  //cERPPC splash
  var splashPPCPattern = function(ppcName) {
    return function(weaponDamage, range) {
      //assumes weaponDamage only has one entry (the targeted component) and adds
      //the appropriate amount of splash damage
      let baseERPPCDamage =
          Number(MechModel.getSmurfyWeaponDataByName(
                        ppcName).calc_stats.baseDmg);
      let totalBaseSplashDamage =
          Number(MechModel.getSmurfyWeaponDataByName(
                    ppcName).calc_stats.dmg)
                    - baseERPPCDamage;
      let baseRangeDamage;
      let targetLocation;
      for (targetLocation in weaponDamage.damageMap) {
        baseRangeDamage = weaponDamage.damageMap[targetLocation];
        break;
      }
      let damageFraction = Number(baseRangeDamage) / Number(baseERPPCDamage);
      //splash damage per component. Halve the total splash damage and scale it to
      //the damagefraction
      let splashRangeDamage = totalBaseSplashDamage / 2 * damageFraction;
      let transformedDamage = weaponDamage.clone();
      let adjacentComponents = MechModel.getAdjacentComponents(targetLocation);
      for (let adjacentLocation of adjacentComponents) {
        transformedDamage.damageMap[adjacentLocation] = splashRangeDamage;
      }
      return transformedDamage;
    }
  }

  //seeking missile spread
  class SeekerSpread {
    constructor(range, spread) {
      this.range = Number(range);
      this.spread = {}
      for (let component in MechModel.Component) {
        let componentVal = MechModel.Component[component]
        if (MechModel.Component.hasOwnProperty(component)) {
          let percentDamage = spread[componentVal] ? Number(spread[componentVal]) : 0;
          if (percentDamage) {
            this.spread[componentVal] = percentDamage;
          } else {
            this.spread[componentVal] = 0;
          }
        }
      }
    }
    toString() {
      let ret = "range : " + this.range;
      for (let component in this.spread) {
        ret+= " " + component + ":" + this.spread[component];
      }
    }
  }

  var findSpreadBaseIdx = function(spreadList, range) {
    let baseIdx = 0;
    for (baseIdx = spreadList.length - 1; baseIdx > 0; baseIdx --) {
      if (Number(spreadList[baseIdx].range) < Number(range)) {
        break;
      }
    }
    if (baseIdx >= spreadList.length - 1) {
      baseIdx = spreadList.length - 2;
    }
    return baseIdx;
  }
  var seekerPattern = function(seekerSpreadData) {
    let seekerSpreadList = [];
    for (let range in seekerSpreadData) {
      seekerSpreadList.push(new SeekerSpread(range, seekerSpreadData[range]));
    }
    seekerSpreadList.sort((entry1, entry2) => {
      return Number(entry1.range) - Number(entry2.range);
    });

    return function(weaponDamage, range) {
      range = Number(range);
      let baseIdx = findSpreadBaseIdx(seekerSpreadList, range);
      let nextIdx = baseIdx + 1;
      let baseEntry = seekerSpreadList[baseIdx];
      let nextEntry = seekerSpreadList[nextIdx];
      let rangeDiff = range - baseEntry.range;

      let computedSpread = {};
      for (let component in MechModel.Component) {
        let componentVal = MechModel.Component[component];
        if (MechModel.Component.hasOwnProperty(component)) {
          let slope =
            (Number(nextEntry.spread[componentVal]) - Number(baseEntry.spread[componentVal])) /
            (Number(nextEntry.range) - Number(baseEntry.range));
          let computedPercent = baseEntry.spread[componentVal] + rangeDiff * slope;
          //sanity check on computedPercent
          if (computedPercent < 0) {
            computedPercent = 0;
          }
          if (computedPercent > 1) {
            computedPercent = 1;
          }
          computedSpread[componentVal] = computedPercent;
        }
      }
      let computedSeekerSpread = new SeekerSpread(range, computedSpread);
      //sanity check on computed spread
      let totalPercent = 0;
      for (let component in computedSeekerSpread.spread) {
        totalPercent += computedSeekerSpread.spread[component];
      }
      if (totalPercent > 1) {
        console.warn("Seeker percentages over 100%:" + computedSeekerSpread.toString());
      }
      let totalDamage = weaponDamage.getTotalDamage();
      //transform totalDamage
      let transformedDamage = weaponDamage.clone();
      for (let component in computedSeekerSpread.spread) {
        transformedDamage.damageMap[component] =
            totalDamage * computedSeekerSpread.spread[component];
      }
      return transformedDamage;
    }
  }

  class DirectFireSpread {
    constructor(range, spread) {
      this.range = Number(range);
      this.spread = spread;
    }
  }
  var directFireSpreadPattern = function(spreadData) {
    let spreadList = [];
    for (let spreadRange in spreadData) {
      let directFireSpread = new DirectFireSpread(spreadRange, spreadData[spreadRange]);
      spreadList.push(directFireSpread);
    }
    spreadList.sort((entry1, entry2) => {
      return entry1.range - entry2.range;
    });

    return function(weaponDamage, range) {
      range = Number(range);
      let baseIdx = findSpreadBaseIdx(spreadList, range);
      let nextIdx = baseIdx + 1;

      let baseRange = Number(spreadList[baseIdx].range);
      let nextRange = Number(spreadList[nextIdx].range);
      let computedSpread = {};
      for (let field in spreadList[baseIdx].spread) {
        let basePercent = spreadList[baseIdx].spread[field];
        let nextPercent = spreadList[nextIdx].spread[field];
        let slope = (Number(nextPercent) - Number(basePercent)) / (nextRange - baseRange);
        let computedPercent = basePercent + slope * (range - baseRange);
        computedSpread[field] = computedPercent;
      }

      //sanity check on computed spread
      let totalPercent = 0;
      for (let field in computedSpread) {
        totalPercent += Number(computedSpread[field]);
      }
      if (totalPercent > 1) {
        console.warn("Direct fire percentages greater than 1: " + totalPercent);
      }

      return accuracySpreadToAdjacent(computedSpread.target,
                                        computedSpread.adjacent,
                                        computedSpread.nextAdjacent)(weaponDamage, range);

    }
  }

  var getDefault = function() {
    for (let patternEntry of getPatterns()) {
      if (patternEntry.default) {
        return patternEntry.pattern;
      }
    }
  }

  //Returns a list of accuracy patterns for the UI
  var getPatterns = function() {
    let patternList = [
      {
        id:"accuracyPerfect",
        name:"Perfect accuracy",
        pattern: accuracySpreadToAdjacent(1.0, 0.0, 0.0),
        description:"100% damage to target component.",
        default:true,
      },
      {
        id:"accuracyTier1",
        name:"Tier 1",
        pattern: accuracySpreadToAdjacent(0.80, 0.10, 0.05),
        description:"80% damage to target component, 10% to adjacent, 5% to other components, 5% miss.",
        default:false,
      },
      {
        id:"accuracyTier2",
        name:"Tier 2",
        pattern: accuracySpreadToAdjacent(0.70, 0.15, 0.05),
        description:"70% damage to target component, 15% to adjacent, 5% to other components, 10% miss.",
        default:false,
      },
      {
        id:"accuracyTier3",
        name:"Tier 3",
        pattern: accuracySpreadToAdjacent(0.6, 0.20, 0.05),
        description:"60% damage to target component, 20% to adjacent, 5% to other components, 15% miss.",
        default:false,
      },
      {
        id:"accuracyTier4",
        name:"Tier 4",
        pattern: accuracySpreadToAdjacent(0.4, 0.3, 0.1),
        description:"40% damage to target component, 30% to adjacent, 10% to other components, 20% miss.",
        default:false,
      },
      {
        id:"accuracyTier5",
        name:"Tier 5",
        pattern: accuracySpreadToAdjacent(0.3, 0.2, 0.1),
        description:"30% damage to target component, 20% to adjacent, 10% to other components, 20% miss.",
        default:false,
      },
      {
        id:"accuracyPotato",
        name:"Tier Potato",
        pattern: accuracySpreadToAdjacent(0.1, 0.05, 0.05),
        description:"10% damage to target component, 5% to adjacent, 5% to other components, 80% miss.",
        default:false,
      },
    ];
    return patternList;
  }

  var reset = function() {

  }

  return {
    fullAccuracyPattern : fullAccuracyPattern,
    accuracySpreadToAdjacent : accuracySpreadToAdjacent,
    getWeaponAccuracyPattern : getWeaponAccuracyPattern,
    splashPPCPattern : splashPPCPattern,
    seekerPattern : seekerPattern,
    directFireSpreadPattern : directFireSpreadPattern,
    getDefault : getDefault,
    getPatterns : getPatterns,
    reset : reset,
  }

})();
