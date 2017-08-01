
namespace SimulatorSettings {
  var simulatorParameters : SimulatorParameters;

  //interval between UI updates. Set smaller than step duration to run the
  // simulation faster, but not too small as to lock the browser
  const DEFAULT_UI_UPDATE_INTERVAL = 50;

  export interface SimParamUserSettings {
    uacJAMMethod : UACJamMethod;
    useDoubleTap : boolean;
  }
  //Parameters of the simulation. Includes range
  export class SimulatorParameters {
    range : number;
    speedFactor : number;
    uacJAMMethod : UACJamMethod;
    useDoubleTap : boolean;

    constructor(range : number,
          speedFactor = 1,
          uacJamMethod = UACJamMethod.RANDOM,
          useDoubleTap = true) {
      this.range = range;
      this.speedFactor = speedFactor;
      this.uacJAMMethod = uacJamMethod;
      this.useDoubleTap = useDoubleTap;

    }
    get uiUpdateInterval() : number {
      return Math.floor(DEFAULT_UI_UPDATE_INTERVAL / Number(this.speedFactor));
    }

    setSpeedFactor(speedFactor : number) : void {
      this.speedFactor = speedFactor;
    }
    clone() {
      return new SimulatorParameters(this.range,
                                    this.speedFactor,
                                    this.uacJAMMethod,
                                    this.useDoubleTap);
    }

    //returns setting values and descriptions for the UI
    static getUserSettings() : SimUserSetting[] {
      return [
        UAC_DOUBLE_TAP_SETTING,
        UAC_JAM_SETTING
      ];
    }
  }

  //NOTE: This should only be called by MechSimulatorLogic.setSimulatorParameters,
  //but since I can't selectively export to particular namespaces, it's exposed to all
  export var setSimulatorParameters =
      function(parameters : SimulatorParameters) : void {
    simulatorParameters = parameters;
  }

  export var getSimulatorParameters = function() : SimulatorParameters {
    return simulatorParameters.clone();
  }
}
