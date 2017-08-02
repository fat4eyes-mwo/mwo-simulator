"use strict";
/// <reference path="common/simulator-model-common.ts" />
/// <reference path="simulator-model.ts" />
/// <reference path="simulator-model-weapons.ts" />
/// <reference path="simulator-patterns.ts" />

namespace MechTargetComponent {
  import Component = MechModelCommon.Component;
  import EngineType = MechModelCommon.EngineType;

  type Mech = MechModel.Mech;
  type Pattern = ModelPatterns.Pattern;

  export type TargetComponentPattern = (sourceMech : Mech, targetMech : Mech) => Component;
  //These functions return which component of a mech should be targeted
  //function(sourceMech, targetMech) -> MechModel.Component
  export var aimForCenterTorso =
      function(sourceMech : Mech, targetMech : Mech) : string {
    return Component.CENTRE_TORSO;
  }

  export var aimForXLSideTorso =
      function(sourceMech : Mech, targetMech : Mech) : Component {
    let mechInfo = targetMech.getMechInfo();
    if (mechInfo.engineInfo.getEngineType() === EngineType.XL) {
      return Component.RIGHT_TORSO;
    } else {
      return Component.CENTRE_TORSO;
    }
  }

  export var aimForLegs =
      function(sourceMech : Mech, targetMech : Mech) : Component {
    let mechState = targetMech.getMechState();
    if (mechState.mechHealth.isIntact(Component.LEFT_LEG)) {
      return Component.LEFT_LEG;
    } else {
      return Component.RIGHT_LEG;
    }
  }

  export var aimSideTorsoThenCenterTorso =
      function(sourceMech : Mech, targetMech : Mech) : Component {
    let targetMechHealth = targetMech.getMechState().mechHealth;
    if (targetMechHealth.isIntact(Component.RIGHT_TORSO)) {
      return Component.RIGHT_TORSO;
    } else if (targetMechHealth.isIntact(Component.LEFT_TORSO)) {
      return Component.LEFT_TORSO
    } else {
      return Component.CENTRE_TORSO;
    }
  }

  export var randomAim = function(sourceMech : Mech, targetMech : Mech) : Component {
    let componentList = [
      Component.RIGHT_ARM,
      Component.RIGHT_TORSO,
      Component.CENTRE_TORSO,
      Component.LEFT_ARM,
      Component.LEFT_TORSO,
      Component.RIGHT_LEG,
      Component.LEFT_LEG,
    ];
    let intactComponentList = [];
    for (let component of componentList) {
      if (targetMech.getMechState().mechHealth.isIntact(component)) {
        intactComponentList.push(component);
      }
    }
    return intactComponentList[Math.floor(Math.random() * intactComponentList.length)];
  }

  //component weights is an object of the form {<component> : <percentWeight>}.
  //The percent weights of all the components in the object should be
  //equal to one
  var weightedRandom =
      function(componentWeights : {[index:string] : number})
                : TargetComponentPattern {
    let cumulativePercentMap = new Map();
    let prevComponent;
    for (let component in componentWeights) {
      if (!componentWeights.hasOwnProperty(component)) {
        continue;
      }
      let weight = componentWeights[component];
      if (!prevComponent) {
        cumulativePercentMap.set(component, Number(weight));
      } else {
        cumulativePercentMap.set(component, Number(weight) + Number(cumulativePercentMap.get(prevComponent)));
      }
      prevComponent = component;
    }

    return function(sourceMech : Mech, targetMech : Mech) : Component {
      let rand = Math.random();
      //relies on map insertion order to be the same order as the iterator
      for (let component of cumulativePercentMap.keys()) {
        if (Number(rand) < Number(cumulativePercentMap.get(component))) {
          return component;
        }
      }
      return null;
    }
  }

  export var getDefault = function() : TargetComponentPattern {
    for (let patternEntry of getPatterns()) {
      if (patternEntry.default) {
        return patternEntry.pattern as TargetComponentPattern;
      }
    }
  }

  //returns a list of target patterns for the UI.
  //format of each entry is
  //{id : <patternid>, name : <readableName>, pattern : <function>, description : <desc text>, default: <boolean>}
  //Note: default must be the same as the pattern returned by getDefault()
  export var getPatterns = function() : Pattern[] {
    let patternList = [
      { id: "aimForCenterTorso",
        name: "Aim for CT",
        pattern: aimForCenterTorso,
        description: "Aim for the center torso.",
        default: true,
      },
      { id: "aimForXLSideTorso",
        name: "Aim for XL Side Torso",
        pattern: aimForXLSideTorso,
        description: "Aim for a side torso if the target has an IS XL Engine. Else aims for the center torso.",
        default: false,
      },
      { id: "aimForLegs",
        name: "Aim for Legs",
        pattern: aimForLegs,
        description: "Aim for the legs.",
        default: false,
      },
      {
        id: "aimForSideTorso",
        name: "Aim for Side Torsos",
        pattern: aimSideTorsoThenCenterTorso,
        description: "Aim for side torsos, then center torso.",
        default: false,
      },
      { id: "randomAim",
        name: "Random",
        pattern: randomAim,
        description: "Aim for a random component. Does not include the head.",
        default: false,
      },
      { id: "weightedRandomCT",
        name: "Weighted Random (CT)",
        pattern: weightedRandom(
                      { "centre_torso": 0.6,
                        "left_torso": 0.1,
                        "right_torso": 0.1,
                        "left_arm" : 0.05,
                        "right_arm" : 0.05,
                        "left_leg": 0.05,
                        "right_leg" : 0.05}),
        description: "60% chance to hit CT, 10% for side torsos, 5% for arms, 5% for legs",
        default: false,
      },
    ];
    return patternList;
  }

  export var reset = function() {
    //Used to reset any state used by the pattern.
  }
}
