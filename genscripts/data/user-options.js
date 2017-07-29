var MechSimulatorLogic;
(function (MechSimulatorLogic) {
    MechSimulatorLogic.UACJamMethod = {
        RANDOM: "random",
        EXPECTED_VALUE: "expected_value",
    };
    MechSimulatorLogic.UAC_DOUBLE_TAP_SETTING = {
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
    MechSimulatorLogic.UAC_JAM_SETTING = {
        property: "uacJAMMethod",
        name: "UAC Jam Method",
        values: [
            {
                id: "random",
                name: "Random",
                value: MechSimulatorLogic.UACJamMethod.RANDOM,
                description: "UACs jam at random, same as in game.",
                default: true,
            },
            {
                id: "expected_value",
                name: "Expected Value",
                value: MechSimulatorLogic.UACJamMethod.EXPECTED_VALUE,
                description: "Simulates UAC jams by adding (jamTime * jamChange) to the weapon cooldown.",
                default: false,
            },
        ],
    };
})(MechSimulatorLogic || (MechSimulatorLogic = {}));
//# sourceMappingURL=user-options.js.map