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
  var getWeaponAccuracyPattern = function(weaponInfo) {
    var weaponAccuracyMap =
      { "ClanERPPC" : MechAccuracyPattern.cERPPCPattern,
        "LRM5" : MechAccuracyPattern.seekerPatern(_LRM5Spread),
        "LRM10" : MechAccuracyPattern.seekerPatern(_LRM10Spread),
        "LRM15" : MechAccuracyPattern.seekerPatern(_LRM15Spread),
        "LRM20" : MechAccuracyPattern.seekerPatern(_LRM20Spread),
        "LRM5_Artemis" : MechAccuracyPattern.seekerPatern(_ALRM5Spread),
        "LRM10_Artemis" : MechAccuracyPattern.seekerPatern(_ALRM10Spread),
        "LRM15_Artemis" : MechAccuracyPattern.seekerPatern(_ALRM15Spread),
        "LRM20_Artemis" : MechAccuracyPattern.seekerPatern(_ALRM20Spread),
        "ClanLRM5" : MechAccuracyPattern.seekerPatern(_cLRM5Spread),
        "ClanLRM10" : MechAccuracyPattern.seekerPatern(_cLRM10Spread),
        "ClanLRM15" : MechAccuracyPattern.seekerPatern(_cLRM15Spread),
        "ClanLRM20" : MechAccuracyPattern.seekerPatern(_cLRM20Spread),
        "ClanLRM5_Artemis" : MechAccuracyPattern.seekerPatern(_cALRM5Spread),
        "ClanLRM10_Artemis" : MechAccuracyPattern.seekerPatern(_cALRM10Spread),
        "ClanLRM15_Artemis" : MechAccuracyPattern.seekerPatern(_cALRM15Spread),
        "ClanLRM20_Artemis" : MechAccuracyPattern.seekerPatern(_cALRM20Spread),
      };
    return weaponAccuracyMap[weaponInfo.name];
  }

  //cERPPC splash
  var cERPPCPattern = function(weaponDamage, range) {
    //assumes weaponDamage only has one entry (the targeted component) and adds
    //the appropriate amount of splash damage
    let baseERPPCDamage =
        Number(MechModel.getSmurfyWeaponDataByName(
                      "ClanERPPC").calc_stats.baseDmg);
    let totalBaseSplashDamage =
        Number(MechModel.getSmurfyWeaponDataByName(
                  "ClanERPPC").calc_stats.dmg)
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
  var seekerPatern = function(seekerSpreadData) {
    let seekerSpreadList = [];
    for (let range in seekerSpreadData) {
      seekerSpreadList.push(new SeekerSpread(range, seekerSpreadData[range]));
    }
    seekerSpreadList.sort((entry1, entry2) => {
      return Number(entry1.range) - Number(entry2.range);
    });

    return function(weaponDamage, range) {
      let baseIdx = 0;
      let nextIdx = 0;
      for (baseIdx = 0; baseIdx < seekerSpreadList.length; baseIdx ++) {
        if (seekerSpreadList[baseIdx].range < range) {
          break;
        }
      }
      if (baseIdx >= seekerSpreadList.length - 1) {
        baseIdx = seekerSpreadList.length - 2;
      }
      nextIdx = baseIdx + 1;
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

  var getDefault = function() {
    return accuracySpreadToAdjacent(1.0, 0.0, 0.0);
  }

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
        description:"85% damage to target component, 10% to adjacent, 5% to other components, 5% miss.",
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
        description:"30% damage to target component, 20% to adjacent, 10% to other components, 30% miss.",
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

  return {
    fullAccuracyPattern : fullAccuracyPattern,
    accuracySpreadToAdjacent : accuracySpreadToAdjacent,
    getWeaponAccuracyPattern : getWeaponAccuracyPattern,
    cERPPCPattern : cERPPCPattern,
    seekerPatern : seekerPatern,
    getDefault : getDefault,
    getPatterns : getPatterns,
  }

})();
