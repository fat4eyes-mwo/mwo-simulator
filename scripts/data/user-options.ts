//User-changable options in SimulatorParameters. Used in
//simulator-view-simsettings to populate the settings dialog
namespace MechSimulatorLogic {
  export type UACJamMethod = string;
  export const UACJamMethod : {[index:string] : string}= {
    RANDOM : "random",
    EXPECTED_VALUE : "expected_value",
  };

  export interface SimUserSetting {
    property : string,
    name : string,
    values : SimUserSettingValue[],
  }
  export interface SimUserSettingValue {
    id : string,
    name : string,
    value : any, //TODO : see if you can make this type tighter
    description : string,
    default: boolean,
  }

  export const UAC_DOUBLE_TAP_SETTING : SimUserSetting = {
    property: "useDoubleTap",
    name: "Use UAC Double Tap",
    values: [
      {
        id: "enable",
        name: "Enabled",
        value: true,
        description: "Allows use of UAC double taps",
        default: true,
      },
      {
        id: "disable",
        name: "Disabled",
        value: false,
        description: "Disallows use of UAC double taps",
        default: false,
      },
    ],
  };

  export const UAC_JAM_SETTING : SimUserSetting = {
    property: "uacJAMMethod",
    name: "UAC Jam Method",
    values: [
      {
        id: "random",
        name: "Random",
        value: UACJamMethod.RANDOM,
        description: "UACs jam at random, same as in game.",
        default: true,
      },
      {
        id: "expected_value",
        name: "Expected Value",
        value: UACJamMethod.EXPECTED_VALUE,
        description: "Simulates UAC jams by adding (jamTime * jamChange) to the weapon cooldown.",
        default: false,
      },
    ],
  }
}
