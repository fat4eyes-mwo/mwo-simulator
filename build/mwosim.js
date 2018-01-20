"use strict";
var DomStorage;
(function (DomStorage) {
    //Stores an arbitrary value as a symbol indexed property in Element
    //Goal is to map DOM elements to the UI objects that represent them without
    //overly complicated bookkeeping in the app. Garbage collection seems to handle
    //circular references between an object and a deleted dom element well
    //(at least for chrome and firefox)
    //relies on the DOM being stable (e.g. the browser not replacing an Element with a copy,
    //which would lose our mapping). If this doesn't turn out to be so, you can still simulate
    //it using weakmaps.
    DomStorage.storeToElement = function (elem, key, value) {
        let symbolKey = Symbol.for(key);
        let anyElem = elem;
        let prevValue = anyElem[symbolKey];
        anyElem[symbolKey] = value;
        return prevValue;
    };
    DomStorage.getFromElement = function (elem, key) {
        if (!elem) {
            return null;
        }
        let symbolKey = Symbol.for(key);
        let anyElem = elem;
        return anyElem[symbolKey];
    };
})(DomStorage || (DomStorage = {}));
//Additional heatsink data to account for info not in smurfy
//Reference: http://steamcommunity.com/sharedfiles/filedetails/?id=686548357
var AddedData;
//Additional heatsink data to account for info not in smurfy
//Reference: http://steamcommunity.com/sharedfiles/filedetails/?id=686548357
(function (AddedData) {
    //HeatsinkName -> AddedHeatsinkData
    AddedData._AddedHeatsinkData = {
        "HeatSink_MkI": {
            internal_heat_capacity: 1.1,
            external_heat_capacity: 1.2
        },
        "DoubleHeatSink_MkI": {
            internal_heat_capacity: 2,
            external_heat_capacity: 1.5
        },
        "ClanDoubleHeatSink": {
            internal_heat_capacity: 2,
            external_heat_capacity: 1.1
        }
    };
})(AddedData || (AddedData = {}));
//Generated from Game/mechs/*.pak on Wed, 13 Dec 2017 18:21:52 GMT
var AddedData;
//Generated from Game/mechs/*.pak on Wed, 13 Dec 2017 18:21:52 GMT
(function (AddedData) {
    AddedData._AddedOmnipodData = {
        "adr-prime": {
            "name": "adr-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "CLAN ER PPC VELOCITY"
                },
                {
                    "name": "clanerppc_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "ER PPC HEAT GENERATION"
                }
            ]
        },
        "adr-a": {
            "name": "adr-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "torso_yawangle_additive",
                    "value": 10,
                    "translated_name": "Torso Yaw Angle"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "laser_range_multiplier",
                    "value": 0.05,
                    "translated_name": "LASER RANGE"
                }
            ]
        },
        "adr-d": {
            "name": "adr-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "adr-b": {
            "name": "adr-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "lbxautocannon_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "LB-X Autocannon Cooldown"
                },
                {
                    "name": "torso_yawangle_additive",
                    "value": 10,
                    "translated_name": "Torso Yaw Angle"
                }
            ]
        },
        "adr-cn": {
            "name": "adr-cn",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.05,
                    "translated_name": "ENERGY RANGE"
                },
                {
                    "name": "laser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "LASER DURATION"
                }
            ]
        },
        "ach-prime": {
            "name": "ach-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "ach-a": {
            "name": "ach-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "ach-b": {
            "name": "ach-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "ach-c": {
            "name": "ach-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.15,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.15,
                    "translated_name": "DECELERATION RATE"
                },
                {
                    "name": "turnrate_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                }
            ]
        },
        "ach-sh": {
            "name": "ach-sh",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "ach-e": {
            "name": "ach-e",
            "setBonusQuirks": [
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.05,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanmediumpulselaser_range_multiplier",
                    "value": 0.05,
                    "translated_name": "Clan Medium Pulse Laser Range"
                }
            ]
        },
        "acw-prime": {
            "name": "acw-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanstreaksrm_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "Clan Streak Cooldown"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "acw-a": {
            "name": "acw-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "missile_velocity_multiplier",
                    "value": 0.05,
                    "translated_name": "MISSILE VELOCITY"
                }
            ]
        },
        "acw-p": {
            "name": "acw-p",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                }
            ]
        },
        "cou-prime": {
            "name": "cou-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "cou-c": {
            "name": "cou-c",
            "setBonusQuirks": [
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "clanerlaser_range_multiplier",
                    "value": 0.05,
                    "translated_name": "Clan ER Laser Range"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "cou-d": {
            "name": "cou-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.25,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "cou-e": {
            "name": "cou-e",
            "setBonusQuirks": [
                {
                    "name": "all_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "atm_spread_multiplier",
                    "value": -0.05,
                    "translated_name": "ATM SPREAD"
                }
            ]
        },
        "cou-h": {
            "name": "cou-h",
            "setBonusQuirks": [
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.25,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "all_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "cou-ba": {
            "name": "cou-ba",
            "setBonusQuirks": [
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "dwf-prime": {
            "name": "dwf-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.3,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "dwf-a": {
            "name": "dwf-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "dwf-b": {
            "name": "dwf-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanultraautocannon2_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan UAC2 Heat"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.05,
                    "translated_name": "ENERGY RANGE"
                }
            ]
        },
        "dwf-s": {
            "name": "dwf-s",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "dwf-w": {
            "name": "dwf-w",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "torso_yawspeed_multiplier",
                    "value": 0.1,
                    "translated_name": "Torso Yaw Speed"
                }
            ]
        },
        "dwf-uv": {
            "name": "dwf-uv",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanultraautocannon2_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan UAC2 Heat"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "ebj-prime": {
            "name": "ebj-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "ebj-a": {
            "name": "ebj-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ultraautocannon20_jamchance_multiplier",
                    "value": -0.15,
                    "translated_name": "UAC/20 JAM CHANCE"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                }
            ]
        },
        "ebj-b": {
            "name": "ebj-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                }
            ]
        },
        "ebj-c": {
            "name": "ebj-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_spread_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE SPREAD"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.2,
                    "translated_name": "UAC JAM CHANCE"
                }
            ]
        },
        "ebj-ec": {
            "name": "ebj-ec",
            "setBonusQuirks": [
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "ebj-d": {
            "name": "ebj-d",
            "setBonusQuirks": [
                {
                    "name": "erlaser_range_multiplier",
                    "value": 0.05,
                    "translated_name": "ER LASER RANGE"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.2,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "exe-prime": {
            "name": "exe-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "erlaser_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "ER LASER HEAT GENERATION"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "exe-a": {
            "name": "exe-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.1,
                    "translated_name": "ENERGY RANGE"
                }
            ]
        },
        "exe-b": {
            "name": "exe-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.2,
                    "translated_name": "UAC JAM CHANCE"
                }
            ]
        },
        "exe-d": {
            "name": "exe-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "torso_yawspeed_multiplier",
                    "value": 0.05,
                    "translated_name": "Torso Yaw Speed"
                },
                {
                    "name": "torso_pitchspeed_multiplier",
                    "value": 0.05,
                    "translated_name": "Torso Pitch Speed"
                },
                {
                    "name": "pulselaser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "PULSE LASER HEAT GEN."
                }
            ]
        },
        "exe-c": {
            "name": "exe-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.2,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.2,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.2,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "missile_spread_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE SPREAD"
                }
            ]
        },
        "exe-ch": {
            "name": "exe-ch",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "exe-e": {
            "name": "exe-e",
            "setBonusQuirks": [
                {
                    "name": "atm_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "ATM HEAT"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "heavylaser_range_multiplier",
                    "value": 0.1,
                    "translated_name": "Heavy Laser Range"
                }
            ]
        },
        "gar-prime": {
            "name": "gar-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                }
            ]
        },
        "gar-a": {
            "name": "gar-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanppc_velocity_multiplier",
                    "value": 0.2,
                    "translated_name": "Clan PPC Velocity"
                },
                {
                    "name": "laser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "LASER DURATION"
                }
            ]
        },
        "gar-d": {
            "name": "gar-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "laser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "LASER DURATION"
                }
            ]
        },
        "gar-c": {
            "name": "gar-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "gar-b": {
            "name": "gar-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "gar-kw": {
            "name": "gar-kw",
            "setBonusQuirks": [
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.05,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "gar-e": {
            "name": "gar-e",
            "setBonusQuirks": [
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.05,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "hbr-prime": {
            "name": "hbr-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "hbr-a": {
            "name": "hbr-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "hbr-b": {
            "name": "hbr-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.075,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "hbr-fl": {
            "name": "hbr-fl",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.075,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "hbr-vi": {
            "name": "hbr-vi",
            "setBonusQuirks": [
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "hbr-p": {
            "name": "hbr-p",
            "setBonusQuirks": [
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerlaser_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "CLAN ER LASER HEAT GENERATION"
                }
            ]
        },
        "hmn-prime": {
            "name": "hmn-prime",
            "setBonusQuirks": [
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE HEAT GENERATION"
                }
            ]
        },
        "hmn-a": {
            "name": "hmn-a",
            "setBonusQuirks": [
                {
                    "name": "pulselaser_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "PULSE LASER COOLDOWN"
                },
                {
                    "name": "pulselaser_range_multiplier",
                    "value": 0.1,
                    "translated_name": "PULSE LASER RANGE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "hmn-b": {
            "name": "hmn-b",
            "setBonusQuirks": [
                {
                    "name": "clanlbxautocannon10_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan LB-X10 Cooldown"
                },
                {
                    "name": "ballistic_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "BALLISTIC VELOCITY"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "hmn-c": {
            "name": "hmn-c",
            "setBonusQuirks": [
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.15,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "lrm_spread_multiplier",
                    "value": -0.1,
                    "translated_name": "LRM 5/10/15/20 SPREAD"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "hmn-p": {
            "name": "hmn-p",
            "setBonusQuirks": [
                {
                    "name": "erlaser_range_multiplier",
                    "value": 0.05,
                    "translated_name": "ER LASER RANGE"
                },
                {
                    "name": "streaksrm_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "Streak 2/4/6 Cooldown"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "hmn-pa": {
            "name": "hmn-pa",
            "setBonusQuirks": [
                {
                    "name": "missile_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "MISSILE VELOCITY"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.15,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "kfx-prime": {
            "name": "kfx-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.1,
                    "translated_name": "ENERGY RANGE"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "kfx-d": {
            "name": "kfx-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.05,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "missile_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE HEAT GENERATION"
                }
            ]
        },
        "kfx-s": {
            "name": "kfx-s",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "Energy Heat"
                }
            ]
        },
        "kfx-c": {
            "name": "kfx-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.1,
                    "translated_name": "ENERGY RANGE"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "kfx-pr": {
            "name": "kfx-pr",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.1,
                    "translated_name": "ENERGY RANGE"
                },
                {
                    "name": "laser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "LASER DURATION"
                }
            ]
        },
        "kfx-g": {
            "name": "kfx-g",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "lbk-prime": {
            "name": "lbk-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "CLAN ER PPC VELOCITY"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "lbk-a": {
            "name": "lbk-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanlrm_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "Clan LRM Cooldown"
                },
                {
                    "name": "clanerlaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan ER Laser Duration"
                }
            ]
        },
        "lbk-b": {
            "name": "lbk-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clangaussrifle_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan Gauss Cooldown"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Energy Heat"
                }
            ]
        },
        "lbk-c": {
            "name": "lbk-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                }
            ]
        },
        "lbk-d": {
            "name": "lbk-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerlaser_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "Clan ER Laser Cooldown"
                },
                {
                    "name": "clanstreaksrm_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan Streak Cooldown"
                }
            ]
        },
        "lbk-rl": {
            "name": "lbk-rl",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "lbk-h": {
            "name": "lbk-h",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.05,
                    "translated_name": "ENERGY RANGE"
                },
                {
                    "name": "heavylaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "Heavy Laser Duration"
                }
            ]
        },
        "mdd-prime": {
            "name": "mdd-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanpulselaser_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "Clan Pulse Laser Heat"
                },
                {
                    "name": "missile_spread_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE SPREAD"
                }
            ]
        },
        "mdd-a": {
            "name": "mdd-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanppc_velocity_multiplier",
                    "value": 0.2,
                    "translated_name": "Clan PPC Velocity"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "mdd-b": {
            "name": "mdd-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "missile_velocity_multiplier",
                    "value": 0.05,
                    "translated_name": "MISSILE VELOCITY"
                }
            ]
        },
        "mdd-c": {
            "name": "mdd-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "critchance_receiving_multiplier",
                    "value": -0.15,
                    "translated_name": "CRIT HIT CHANCE (RECEIVING)"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "mdd-ba": {
            "name": "mdd-ba",
            "setBonusQuirks": [
                {
                    "name": "clanlaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan Laser Cooldown"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "mdd-h": {
            "name": "mdd-h",
            "setBonusQuirks": [
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "heavylaser_duration_multiplier",
                    "value": -0.1,
                    "translated_name": "Heavy Laser Duration"
                }
            ]
        },
        "mlx-prime": {
            "name": "mlx-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.1,
                    "translated_name": "MACHINE GUN ROF"
                }
            ]
        },
        "mlx-b": {
            "name": "mlx-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "mlx-c": {
            "name": "mlx-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerlaser_cooldown_multiplier",
                    "value": -0.2,
                    "translated_name": "Clan ER Laser Cooldown"
                },
                {
                    "name": "clanerlaser_range_multiplier",
                    "value": 0.1,
                    "translated_name": "Clan ER Laser Range"
                }
            ]
        },
        "mlx-a": {
            "name": "mlx-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.1,
                    "translated_name": "MACHINE GUN ROF"
                }
            ]
        },
        "mlx-d": {
            "name": "mlx-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "mlx-ed": {
            "name": "mlx-ed",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_spread_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE SPREAD"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "mlx-g": {
            "name": "mlx-g",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "ntg-prime": {
            "name": "ntg-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ultraautocannon_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "UAC Cooldown"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.05,
                    "translated_name": "ENERGY RANGE"
                }
            ]
        },
        "ntg-a": {
            "name": "ntg-a",
            "setBonusQuirks": [
                {
                    "name": "ballistic_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "BALLISTIC VELOCITY"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "ntg-b": {
            "name": "ntg-b",
            "setBonusQuirks": [
                {
                    "name": "clangaussrifle_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan Gauss Cooldown"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "ntg-c": {
            "name": "ntg-c",
            "setBonusQuirks": [
                {
                    "name": "energy_range_multiplier",
                    "value": 0.1,
                    "translated_name": "ENERGY RANGE"
                },
                {
                    "name": "ballistic_velocity_multiplier",
                    "value": 0.2,
                    "translated_name": "BALLISTIC VELOCITY"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "ntg-d": {
            "name": "ntg-d",
            "setBonusQuirks": [
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.05,
                    "translated_name": "ENERGY RANGE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "ntg-jk": {
            "name": "ntg-jk",
            "setBonusQuirks": [
                {
                    "name": "missile_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "MISSILE VELOCITY"
                },
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.25,
                    "translated_name": "CLAN ER PPC VELOCITY"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "nva-prime": {
            "name": "nva-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "overheatdamage_multiplier",
                    "value": -0.1,
                    "translated_name": "OVERHEAT DAMAGE"
                },
                {
                    "name": "clanermediumlaser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan ER Mediun Laser Heat"
                }
            ]
        },
        "nva-b": {
            "name": "nva-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "laser_duration_multiplier",
                    "value": -0.04,
                    "translated_name": "LASER DURATION"
                }
            ]
        },
        "nva-s": {
            "name": "nva-s",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanmediumpulselaser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan Medium Pulse Laser Heat"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.1,
                    "translated_name": "MACHINE GUN ROF"
                }
            ]
        },
        "nva-a": {
            "name": "nva-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.05,
                    "translated_name": "CLAN ER PPC VELOCITY"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Energy Heat"
                }
            ]
        },
        "nva-c": {
            "name": "nva-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.075,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "nva-d": {
            "name": "nva-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.075,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "nva-bk": {
            "name": "nva-bk",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.075,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.15,
                    "translated_name": "MACHINE GUN ROF"
                }
            ]
        },
        "nct-prime": {
            "name": "nct-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanppc_velocity_multiplier",
                    "value": 0.05,
                    "translated_name": "Clan PPC Velocity"
                },
                {
                    "name": "erlaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "ER LASER DURATION"
                }
            ]
        },
        "nct-a": {
            "name": "nct-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "erlaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "ER LASER DURATION"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.1,
                    "translated_name": "ENERGY RANGE"
                }
            ]
        },
        "nct-b": {
            "name": "nct-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "targetdecayduration_additive",
                    "value": 0.5,
                    "translated_name": "TARGET DECAY"
                }
            ]
        },
        "nct-c": {
            "name": "nct-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.05,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "nct-d": {
            "name": "nct-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "heavylaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "Heavy Laser Duration"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "nct-cc": {
            "name": "nct-cc",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                }
            ]
        },
        "shc-prime": {
            "name": "shc-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                }
            ]
        },
        "shc-a": {
            "name": "shc-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Energy Heat"
                }
            ]
        },
        "shc-b": {
            "name": "shc-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                }
            ]
        },
        "shc-p": {
            "name": "shc-p",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "ballistic_range_multiplier",
                    "value": 0.1,
                    "translated_name": "BALLISTIC RANGE"
                }
            ]
        },
        "shc-mi": {
            "name": "shc-mi",
            "setBonusQuirks": [
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.2,
                    "translated_name": "UAC JAM CHANCE"
                }
            ]
        },
        "shc-h": {
            "name": "shc-h",
            "setBonusQuirks": [
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "heavylaser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Heavy Laser Heat"
                }
            ]
        },
        "scr-prime": {
            "name": "scr-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerlaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan ER Laser Duration"
                }
            ]
        },
        "scr-c": {
            "name": "scr-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "lbxautocannon_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "LB-X Autocannon Cooldown"
                },
                {
                    "name": "pulselaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "PULSE LASER DURATION"
                }
            ]
        },
        "scr-d": {
            "name": "scr-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanlrm20_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan LRM20 Cooldown"
                },
                {
                    "name": "clansrm2_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan SRM2 Heat"
                }
            ]
        },
        "scr-a": {
            "name": "scr-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "lrm_spread_multiplier",
                    "value": -0.1,
                    "translated_name": "LRM 5/10/15/20 SPREAD"
                },
                {
                    "name": "missile_velocity_multiplier",
                    "value": 0.05,
                    "translated_name": "MISSILE VELOCITY"
                }
            ]
        },
        "scr-b": {
            "name": "scr-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.2,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "clanermediumlaser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan ER Mediun Laser Heat"
                }
            ]
        },
        "scr-lc": {
            "name": "scr-lc",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "lbxautocannon_spread_multiplier",
                    "value": -0.05,
                    "translated_name": "LB-X SPREAD"
                },
                {
                    "name": "erlaser_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "ER LASER COOLDOWN"
                }
            ]
        },
        "smn-prime": {
            "name": "smn-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "CLAN ER PPC VELOCITY"
                }
            ]
        },
        "smn-b": {
            "name": "smn-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanlrm20_spread_multiplier",
                    "value": -0.1,
                    "translated_name": "Clan LRM20 Spread"
                },
                {
                    "name": "missile_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "MISSILE HEAT GENERATION"
                }
            ]
        },
        "smn-d": {
            "name": "smn-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "torso_yawangle_additive",
                    "value": 20,
                    "translated_name": "Torso Yaw Angle"
                },
                {
                    "name": "torso_yawspeed_multiplier",
                    "value": 0.05,
                    "translated_name": "Torso Yaw Speed"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "laser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "LASER DURATION"
                }
            ]
        },
        "smn-c": {
            "name": "smn-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.1,
                    "translated_name": "UAC JAM CHANCE"
                }
            ]
        },
        "smn-ml": {
            "name": "smn-ml",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.05,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "energy_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Energy Heat"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "smn-fl": {
            "name": "smn-fl",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.05,
                    "translated_name": "TURN RATE"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.2,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        },
        "smn-pd": {
            "name": "smn-pd",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "tbr-prime": {
            "name": "tbr-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.2,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                }
            ]
        },
        "tbr-c": {
            "name": "tbr-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ultraautocannon_jamchance_multiplier",
                    "value": -0.2,
                    "translated_name": "UAC JAM CHANCE"
                },
                {
                    "name": "missile_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "MISSILE VELOCITY"
                }
            ]
        },
        "tbr-s": {
            "name": "tbr-s",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "torso_yawspeed_multiplier",
                    "value": 0.3,
                    "translated_name": "Torso Yaw Speed"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                }
            ]
        },
        "tbr-d": {
            "name": "tbr-d",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.2,
                    "translated_name": "CLAN ER PPC VELOCITY"
                },
                {
                    "name": "clanerppc_heat_multiplier",
                    "value": -0.1,
                    "translated_name": "ER PPC HEAT GENERATION"
                }
            ]
        },
        "tbr-a": {
            "name": "tbr-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "torso_yawspeed_multiplier",
                    "value": 0.2,
                    "translated_name": "Torso Yaw Speed"
                },
                {
                    "name": "torso_yawangle_additive",
                    "value": 5,
                    "translated_name": "Torso Yaw Angle"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "clanmediumpulselaser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "Clan Medium Pulse Laser Heat"
                }
            ]
        },
        "tbr-war": {
            "name": "tbr-war",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "lbxautocannon_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "LB-X Autocannon Cooldown"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "turnlerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "TURN RATE"
                }
            ]
        },
        "vpr-prime": {
            "name": "vpr-prime",
            "setBonusQuirks": [
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "vpr-a": {
            "name": "vpr-a",
            "setBonusQuirks": [
                {
                    "name": "laser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "LASER HEAT GENERATION"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "vpr-b": {
            "name": "vpr-b",
            "setBonusQuirks": [
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.3,
                    "translated_name": "CLAN ER PPC VELOCITY"
                },
                {
                    "name": "laser_range_multiplier",
                    "value": 0.1,
                    "translated_name": "LASER RANGE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "vpr-c": {
            "name": "vpr-c",
            "setBonusQuirks": [
                {
                    "name": "clanmachinegun_rof_multiplier",
                    "value": 0.05,
                    "translated_name": "MACHINE GUN ROF"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "vpr-d": {
            "name": "vpr-d",
            "setBonusQuirks": [
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "energy_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "ENERGY COOLDOWN"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "vpr-m": {
            "name": "vpr-m",
            "setBonusQuirks": [
                {
                    "name": "laser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "LASER HEAT GENERATION"
                },
                {
                    "name": "laser_range_multiplier",
                    "value": 0.1,
                    "translated_name": "LASER RANGE"
                },
                {
                    "name": "accellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "ACCELERATION RATE"
                },
                {
                    "name": "decellerp_all_multiplier",
                    "value": 0.1,
                    "translated_name": "DECELERATION RATE"
                },
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                }
            ]
        },
        "whk-prime": {
            "name": "whk-prime",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.15,
                    "translated_name": "MISSILE COOLDOWN"
                },
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.1,
                    "translated_name": "CLAN ER PPC VELOCITY"
                }
            ]
        },
        "whk-a": {
            "name": "whk-a",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "energy_range_multiplier",
                    "value": 0.1,
                    "translated_name": "ENERGY RANGE"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                }
            ]
        },
        "whk-b": {
            "name": "whk-b",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "erlaser_heat_multiplier",
                    "value": -0.05,
                    "translated_name": "ER LASER HEAT GENERATION"
                }
            ]
        },
        "whk-c": {
            "name": "whk-c",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "clanerppc_velocity_multiplier",
                    "value": 0.05,
                    "translated_name": "CLAN ER PPC VELOCITY"
                },
                {
                    "name": "pulselaser_duration_multiplier",
                    "value": -0.05,
                    "translated_name": "PULSE LASER DURATION"
                }
            ]
        },
        "whk-nq": {
            "name": "whk-nq",
            "setBonusQuirks": [
                {
                    "name": "xpbonus_multiplier",
                    "value": 0.025,
                    "translated_name": "XP Bonus"
                },
                {
                    "name": "ballistic_cooldown_multiplier",
                    "value": -0.05,
                    "translated_name": "BALLISTIC COOLDOWN"
                },
                {
                    "name": "missile_cooldown_multiplier",
                    "value": -0.1,
                    "translated_name": "MISSILE COOLDOWN"
                }
            ]
        }
    };
})(AddedData || (AddedData = {}));
//Generated from GameData.pak Wed, 13 Dec 2017 18:21:23 GMT
var AddedData;
//Generated from GameData.pak Wed, 13 Dec 2017 18:21:23 GMT
(function (AddedData) {
    AddedData._AddedWeaponData = {
        "AutoCannon20": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "MediumLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LRM20": {
            "ammo_per_shot": 20,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SmallLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 150,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 300,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SRM4": {
            "ammo_per_shot": 4,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ERLargeLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 675,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1350,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ERPPC": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 810,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1620,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "Flamer": {
            "ammo_per_shot": 0,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 90,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LargeLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 450,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "PPC": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 90,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1080,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LargePulseLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 365,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 730,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "MediumPulseLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 220,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 440,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SmallPulseLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 110,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 220,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "AntiMissileSystem": {
            "ammo_per_shot": 1,
            "rof": 30,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 165,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 250,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "AutoCannon2": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 720,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1440,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "AutoCannon5": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 620,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1240,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "AutoCannon10": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 450,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "GaussRifle": {
            "ammo_per_shot": 1,
            "spinup": 0.75,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 660,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1320,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LBXAutoCannon10": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1620,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "MachineGun": {
            "ammo_per_shot": 1,
            "rof": 10,
            "volleyDelay": 0,
            "speed": 10000,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 130,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 260,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "UltraAutoCannon5": {
            "ammo_per_shot": 1,
            "jamming_chance": 0.15,
            "jammed_time": 6,
            "shots_during_cooldown": 1,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 600,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1200,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LRM5": {
            "ammo_per_shot": 5,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LRM10": {
            "ammo_per_shot": 10,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LRM15": {
            "ammo_per_shot": 15,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "NarcBeacon": {
            "ammo_per_shot": 1,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 450,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SRM2": {
            "ammo_per_shot": 2,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SRM6": {
            "ammo_per_shot": 6,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "StreakSRM2": {
            "ammo_per_shot": 2,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "TAG": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 750,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SRM2_Artemis": {
            "ammo_per_shot": 2,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SRM4_Artemis": {
            "ammo_per_shot": 4,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SRM6_Artemis": {
            "ammo_per_shot": 6,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LRM5_Artemis": {
            "ammo_per_shot": 5,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LRM10_Artemis": {
            "ammo_per_shot": 10,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LRM15_Artemis": {
            "ammo_per_shot": 15,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LRM20_Artemis": {
            "ammo_per_shot": 20,
            "volleyDelay": 0.5,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ERSmallLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 200,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 400,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ERMediumLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 720,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LightPPC": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 90,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1080,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "HeavyPPC": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 90,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1080,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "SnubNosePPC": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 630,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LBXAutoCannon2": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 810,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 2430,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LBXAutoCannon5": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 700,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 2100,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LBXAutoCannon20": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1080,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "UltraAutoCannon2": {
            "ammo_per_shot": 1,
            "jamming_chance": 0.15,
            "jammed_time": 3.5,
            "shots_during_cooldown": 1,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 700,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1400,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "UltraAutoCannon10": {
            "ammo_per_shot": 2,
            "jamming_chance": 0.15,
            "jammed_time": 7.5,
            "shots_during_cooldown": 1,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 450,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "UltraAutoCannon20": {
            "ammo_per_shot": 3,
            "jamming_chance": 0.15,
            "jammed_time": 7.5,
            "shots_during_cooldown": 1,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LightGaussRifle": {
            "ammo_per_shot": 1,
            "spinup": 0.5,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 750,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1500,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "HeavyGaussRifle": {
            "ammo_per_shot": 1,
            "spinup": 0.75,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "RotaryAutoCannon2": {
            "ammo_per_shot": 1,
            "jamming_chance": 0.037,
            "jammed_time": 10,
            "rof": 7.275,
            "rampUpTime": 0.75,
            "rampDownTime": 2,
            "jamRampUpTime": 6,
            "jamRampDownTime": 9.5,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1080,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "RotaryAutoCannon5": {
            "ammo_per_shot": 1,
            "jamming_chance": 0.037,
            "jammed_time": 10,
            "rof": 7.275,
            "rampUpTime": 1,
            "rampDownTime": 2,
            "jamRampUpTime": 6,
            "jamRampDownTime": 9.5,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 450,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LightMachineGun": {
            "ammo_per_shot": 1,
            "rof": 10,
            "volleyDelay": 0,
            "speed": 10000,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 250,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 500,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "HeavyMachineGun": {
            "ammo_per_shot": 1,
            "rof": 10,
            "volleyDelay": 0,
            "speed": 10000,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 100,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 200,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "StreakSRM4": {
            "ammo_per_shot": 4,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "StreakSRM6": {
            "ammo_per_shot": 6,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "MRM10": {
            "ammo_per_shot": 10,
            "volleyDelay": 0.0556,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 550,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "MRM20": {
            "ammo_per_shot": 20,
            "volleyDelay": 0.0263,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 550,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "MRM30": {
            "ammo_per_shot": 30,
            "volleyDelay": 0.0172,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 550,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "MRM40": {
            "ammo_per_shot": 40,
            "volleyDelay": 0.0128,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 550,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "RocketLauncher10": {
            "ammo_per_shot": 10,
            "isOneShot": true,
            "volleyDelay": 0.1,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 50,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "RocketLauncher15": {
            "ammo_per_shot": 15,
            "isOneShot": true,
            "volleyDelay": 0.1,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 50,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 450,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "RocketLauncher20": {
            "ammo_per_shot": 20,
            "isOneShot": true,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 50,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "LaserAntiMissileSystem": {
            "ammo_per_shot": 0,
            "rof": 30,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 165,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 250,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLBXAutoCannon2": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1800,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLBXAutoCannon5": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 720,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1440,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLBXAutoCannon10": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1080,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLBXAutoCannon20": {
            "ammo_per_shot": 1,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 720,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanUltraAutoCannon2": {
            "ammo_per_shot": 1,
            "jamming_chance": 0.17,
            "jammed_time": 3.75,
            "shots_during_cooldown": 1,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 810,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1620,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanUltraAutoCannon5": {
            "ammo_per_shot": 2,
            "jamming_chance": 0.17,
            "jammed_time": 6.5,
            "shots_during_cooldown": 1,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 630,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1260,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanUltraAutoCannon10": {
            "ammo_per_shot": 3,
            "jamming_chance": 0.17,
            "jammed_time": 8,
            "shots_during_cooldown": 1,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1080,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanUltraAutoCannon20": {
            "ammo_per_shot": 4,
            "jamming_chance": 0.17,
            "jammed_time": 8,
            "shots_during_cooldown": 1,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 720,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanGaussRifle": {
            "ammo_per_shot": 1,
            "spinup": 0.75,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 660,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1320,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanMachineGun": {
            "ammo_per_shot": 1,
            "rof": 10,
            "volleyDelay": 0,
            "speed": 10000,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 130,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 260,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanFlamer": {
            "ammo_per_shot": 0,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 90,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanERSmallLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 200,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 400,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanERMediumLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 400,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 800,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanERLargeLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 740,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1480,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanSmallPulseLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 165,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 297,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanMediumPulseLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 330,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 561,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLargePulseLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 600,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 840,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanERPPC": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 810,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1620,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLRM5": {
            "ammo_per_shot": 5,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "exponential"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLRM10": {
            "ammo_per_shot": 10,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "exponential"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLRM15": {
            "ammo_per_shot": 15,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "exponential"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLRM20": {
            "ammo_per_shot": 20,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "exponential"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLRM5_Artemis": {
            "ammo_per_shot": 5,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "exponential"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLRM10_Artemis": {
            "ammo_per_shot": 10,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "exponential"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLRM15_Artemis": {
            "ammo_per_shot": 15,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "exponential"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLRM20_Artemis": {
            "ammo_per_shot": 20,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "exponential"
                },
                {
                    "start": 180,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanSRM2": {
            "ammo_per_shot": 2,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanSRM4": {
            "ammo_per_shot": 4,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanSRM6": {
            "ammo_per_shot": 6,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanSRM2_Artemis": {
            "ammo_per_shot": 2,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanSRM4_Artemis": {
            "ammo_per_shot": 4,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanSRM6_Artemis": {
            "ammo_per_shot": 6,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanStreakSRM2": {
            "ammo_per_shot": 2,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanStreakSRM4": {
            "ammo_per_shot": 4,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanStreakSRM6": {
            "ammo_per_shot": 6,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanNarcBeacon": {
            "ammo_per_shot": 1,
            "volleyDelay": 0.25,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 600,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanTAG": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 750,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanAntiMissileSystem": {
            "ammo_per_shot": 1,
            "rof": 30,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 165,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 250,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanAutoCannon2": {
            "ammo_per_shot": 1,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1800,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanAutoCannon5": {
            "ammo_per_shot": 2,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 720,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1440,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanAutoCannon10": {
            "ammo_per_shot": 3,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1080,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanAutoCannon20": {
            "ammo_per_shot": 4,
            "volleyDelay": 0.11,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 360,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 720,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLightMachineGun": {
            "ammo_per_shot": 1,
            "rof": 10,
            "volleyDelay": 0,
            "speed": 10000,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 250,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 500,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanHeavyMachineGun": {
            "ammo_per_shot": 1,
            "rof": 10,
            "volleyDelay": 0,
            "speed": 10000,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 100,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 200,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanERMicroLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 150,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 300,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanMicroPulseLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 90,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 180,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanHeavySmallLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 115,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 230,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanHeavyMediumLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 540,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanHeavyLargeLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 450,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 900,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanATM3": {
            "ammo_per_shot": 3,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 120,
                    "damageModifier": 1.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 320,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 500,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 550,
                    "damageModifier": 0.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1100,
                    "damageModifier": 0.5,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanATM6": {
            "ammo_per_shot": 6,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 120,
                    "damageModifier": 1.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 320,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 500,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 550,
                    "damageModifier": 0.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1100,
                    "damageModifier": 0.5,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanATM9": {
            "ammo_per_shot": 9,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 120,
                    "damageModifier": 1.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 320,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 500,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 550,
                    "damageModifier": 0.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1100,
                    "damageModifier": 0.5,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanATM12": {
            "ammo_per_shot": 12,
            "volleyDelay": 0.05,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 0,
                    "interpolationToNextRange": "step"
                },
                {
                    "start": 120,
                    "damageModifier": 1.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 270,
                    "damageModifier": 1.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 320,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 500,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 550,
                    "damageModifier": 0.5,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 1100,
                    "damageModifier": 0.5,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLightTAG": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 450,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "ClanLaserAntiMissileSystem": {
            "ammo_per_shot": 0,
            "rof": 30,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 165,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 250,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "DropShipLargePulseLaser": {
            "ammo_per_shot": 0,
            "volleyDelay": 0,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 300,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                }
            ]
        },
        "FakeMachineGun": {
            "ammo_per_shot": 1,
            "rof": 10,
            "volleyDelay": 0,
            "speed": 10000,
            "ranges": [
                {
                    "start": 0,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 120,
                    "damageModifier": 1,
                    "interpolationToNextRange": "linear"
                },
                {
                    "start": 240,
                    "damageModifier": 0,
                    "interpolationToNextRange": "linear"
                }
            ]
        }
    };
})(AddedData || (AddedData = {}));
//base mech structure. Reference: http://mwo.gamepedia.com/Internal_Structure
var GlobalGameInfo;
//base mech structure. Reference: http://mwo.gamepedia.com/Internal_Structure
(function (GlobalGameInfo) {
    GlobalGameInfo._MechBaseStructure = {
        "20": {
            "head": 18,
            "left_arm": 6,
            "right_arm": 6,
            "left_leg": 8,
            "right_leg": 8,
            "right_torso": 10,
            "centre_torso": 12,
            "left_torso": 10
        },
        "25": {
            "head": 18,
            "left_arm": 8,
            "right_arm": 8,
            "left_leg": 12,
            "right_leg": 12,
            "right_torso": 12,
            "centre_torso": 16,
            "left_torso": 12
        },
        "30": {
            "head": 18,
            "left_arm": 10,
            "right_arm": 10,
            "left_leg": 14,
            "right_leg": 14,
            "right_torso": 14,
            "centre_torso": 20,
            "left_torso": 14
        },
        "35": {
            "head": 18,
            "left_arm": 12,
            "right_arm": 12,
            "left_leg": 16,
            "right_leg": 16,
            "right_torso": 16,
            "centre_torso": 22,
            "left_torso": 16
        },
        "40": {
            "head": 18,
            "left_arm": 12,
            "right_arm": 12,
            "left_leg": 20,
            "right_leg": 20,
            "right_torso": 20,
            "centre_torso": 24,
            "left_torso": 20
        },
        "45": {
            "head": 18,
            "left_arm": 14,
            "right_arm": 14,
            "left_leg": 22,
            "right_leg": 22,
            "right_torso": 22,
            "centre_torso": 28,
            "left_torso": 22
        },
        "50": {
            "head": 18,
            "left_arm": 16,
            "right_arm": 16,
            "left_leg": 24,
            "right_leg": 24,
            "right_torso": 24,
            "centre_torso": 32,
            "left_torso": 24
        },
        "55": {
            "head": 18,
            "left_arm": 18,
            "right_arm": 18,
            "left_leg": 26,
            "right_leg": 26,
            "right_torso": 26,
            "centre_torso": 36,
            "left_torso": 26
        },
        "60": {
            "head": 18,
            "left_arm": 20,
            "right_arm": 20,
            "left_leg": 28,
            "right_leg": 28,
            "right_torso": 28,
            "centre_torso": 40,
            "left_torso": 28
        },
        "65": {
            "head": 18,
            "left_arm": 20,
            "right_arm": 20,
            "left_leg": 30,
            "right_leg": 30,
            "right_torso": 30,
            "centre_torso": 42,
            "left_torso": 30
        },
        "70": {
            "head": 18,
            "left_arm": 22,
            "right_arm": 22,
            "left_leg": 30,
            "right_leg": 30,
            "right_torso": 30,
            "centre_torso": 44,
            "left_torso": 30
        },
        "75": {
            "head": 18,
            "left_arm": 24,
            "right_arm": 24,
            "left_leg": 32,
            "right_leg": 32,
            "right_torso": 32,
            "centre_torso": 46,
            "left_torso": 32
        },
        "80": {
            "head": 18,
            "left_arm": 26,
            "right_arm": 26,
            "left_leg": 34,
            "right_leg": 34,
            "right_torso": 34,
            "centre_torso": 50,
            "left_torso": 34
        },
        "85": {
            "head": 18,
            "left_arm": 28,
            "right_arm": 28,
            "left_leg": 36,
            "right_leg": 36,
            "right_torso": 36,
            "centre_torso": 54,
            "left_torso": 36
        },
        "90": {
            "head": 18,
            "left_arm": 30,
            "right_arm": 30,
            "left_leg": 38,
            "right_leg": 38,
            "right_torso": 38,
            "centre_torso": 58,
            "left_torso": 38
        },
        "95": {
            "head": 18,
            "left_arm": 32,
            "right_arm": 32,
            "left_leg": 40,
            "right_leg": 40,
            "right_torso": 40,
            "centre_torso": 60,
            "left_torso": 40
        },
        "100": {
            "head": 18,
            "left_arm": 34,
            "right_arm": 34,
            "left_leg": 42,
            "right_leg": 42,
            "right_torso": 42,
            "centre_torso": 62,
            "left_torso": 42
        }
    };
})(GlobalGameInfo || (GlobalGameInfo = {}));
var GlobalGameInfo;
(function (GlobalGameInfo) {
    GlobalGameInfo._MechGlobalGameInfo = {
        //reference: https://mwomercs.com/news/2017/01/1698-patch-notes-14101-24jan2017
        reduced_xl_heat_efficiency: 0.6,
        ghost_heat_interval: 500,
    };
})(GlobalGameInfo || (GlobalGameInfo = {}));
//Constants used by simulator-model-quirks.js to compute quirk bonuses
var MechModelQuirksData;
//Constants used by simulator-model-quirks.js to compute quirk bonuses
(function (MechModelQuirksData) {
    //quirks that apply to the mech, not a component or weapon
    //NOTE: Many other skill quirks fit in here, add them whenever they become relevant to the simulation
    MechModelQuirksData._quirkGeneral = {
        "heatloss_multiplier": true,
        "heatdissipation_multiplier": true,
        "maxheat_multiplier": true,
        "externalheat_multiplier": true,
        "sensorrange_additive": true,
        "critchance_receiving_multiplier": true,
        "falldamage_multiplier": true,
        "torso_yawspeed_multiplier": true,
        "torso_yawangle_multiplier": true,
        "torso_pitchangle_multiplier": true,
        "accellerp_all_multiplier": true,
        "decellerp_all_multiplier": true,
        "turnlerp_all_multiplier": true,
        "turnrate_multiplier": true,
        "mechtopspeed_multiplier": true,
        "jumpjets_initialthrust_multiplier": true,
        "jumpjets_forwardthrust_multiplier": true,
        "jumpjets_burntime_multiplier": true,
        "jumpjets_heat_multiplier": true,
        "startupduration_multiplier": true,
        "hillclimb_multiplier": true,
        "speedretention_multiplier": true,
        "sensorrange_multiplier": true,
        "targetinfogathering_multiplier": true,
        "targetdecayduration_additive": true,
        "radardeprivation_multiplier": true,
        "advancedzoom_additive": true,
        "seismicsensorrange_additive": true,
        "backfacetargetretentionrange_additive": true,
        "extraconsumableslot_additive": true,
        "uavcapacity_additive": true,
        "uavrange_multiplier": true,
        "uavduration_additive": true,
        "coolshotcapacity_additive": true,
        "coolshotcooling_multiplier": true,
        "coolshotcooldown_multiplier": true,
        "strategicstrikecapacity_additive": true,
        "strategicstrikenumshells_multiplier": true,
        "strategicstrikeduration_multiplier": true,
        "strategicstrikespread_multiplier": true,
        "captureaccelerator_multiplier": true,
        "ecmtargetrangereduction_multiplier": true,
        "stealtharmorcooldown_multiplier": true,
        "screenshake_multiplier": true,
        "torso_pitchangle_additive": true,
        "torso_pitchspeed_multiplier": true,
        "torso_yawangle_additive": true,
        "xpbonus_multiplier": true,
        "jumpjetslots_additive": true,
        "reversespeed_multiplier": true,
    };
    //Defensive quirks
    MechModelQuirksData._quirkComponentMap = {
        "centre_torso": "ct",
        "left_arm": "ra",
        "left_leg": "ll",
        "left_torso": "lt",
        "right_arm": "ra",
        "right_leg": "rl",
        "right_torso": "rt",
        "head": "hd",
    };
    MechModelQuirksData.QuirkArmorAdditivePrefix = "armorresist";
    MechModelQuirksData.QuirkStructureAdditivePrefix = "internalresist";
    MechModelQuirksData.QuirkArmorMultiplier = "increasedarmor_multiplier";
    MechModelQuirksData.QuirkStructureMultiplier = "increasedstructure_multiplier";
    //Weapon quirks
    //Map from quirk name weapon types to smurfy weapon types
    MechModelQuirksData._weaponClassMap = {
        "all": ["BALLISTIC", "BEAM", "MISSLE"],
        "ballistic": ["BALLISTIC"],
        "energy": ["BEAM"],
        "missile": ["MISSLE"] //(sic) from smurfy data
    };
    //Map from quirk weapon names to smurfy weapon names
    MechModelQuirksData._weaponNameMap = {
        "atm": ["ClanATM3", "ClanATM6", "ClanATM9", "ClanATM12"],
        "atm3": ["ClanATM3"],
        "atm6": ["ClanATM6"],
        "atm9": ["ClanATM9"],
        "atm12": ["ClanATM12"],
        "isautocannon10": ["AutoCannon10"],
        "isautocannon20": ["AutoCannon20"],
        "isautocannon2": ["AutoCannon2"],
        "isautocannon5": ["AutoCannon5"],
        "iserlargelaser": ["ERLargeLaser"],
        "iserppc": ["ERPPC"],
        "isflamer": ["Flamer"],
        "isgaussrifle": ["GaussRifle"],
        "islargelaser": ["LargeLaser"],
        "islargepulselaser": ["LargePulseLaser"],
        "islbxautocannon10": ["LBXAutoCannon10"],
        "islrm5": ["LRM5", "LRM5_Artemis"],
        "islrm10": ["LRM10", "LRM10_Artemis"],
        "islrm15": ["LRM15", "LRM15_Artemis"],
        "islrm20": ["LRM20", "LRM20_Artemis"],
        "islrm": ["LRM5", "LRM10", "LRM15", "LRM20",
            "LRM5_Artemis", "LRM10_Artemis", "LRM15_Artemis", "LRM20_Artemis"],
        "ismachinegun": ["MachineGun"],
        "ismediumlaser": ["MediumLaser"],
        "ismediumpulselaser": ["MediumPulseLaser"],
        "isnarcbeacon": ["NarcBeacon"],
        "isppc": ["PPC"],
        "issrm2": ["SRM2", "SRM2_Artemis"],
        "issrm4": ["SRM4", "SRM4_Artemis"],
        "issrm6": ["SRM6", "SRM6_Artemis"],
        "issrm": ["SRM2", "SRM2_Artemis", "SRM4", "SRM4_Artemis", "SRM6", "SRM6_Artemis"],
        "isstdlaser": ["SmallLaser", "MediumLaser", "LargeLaser"],
        "isstreaksrm": ["StreakSRM2", "StreakSRM4", "StreakSRM6"],
        "isultraautocannon5": ["UltraAutoCannon5"],
        "laser": ["SmallLaser", "MediumLaser", "ERLargeLaser", "LargeLaser",
            "LargePulseLaser", "MediumPulseLaser", "SmallPulseLaser",
            "ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser",
            "ClanSmallPulseLaser", "ClanMediumPulseLaser", "ClanLargePulseLaser"],
        "lrm": ["LRM5", "LRM10", "LRM15", "LRM20",
            "LRM5_Artemis", "LRM10_Artemis", "LRM15_Artemis", "LRM20_Artemis",
            "ClanLRM5", "ClanLRM10", "ClanLRM15", "ClanLRM20",
            "ClanLRM5_Artemis", "ClanLRM10_Artemis", "ClanLRM15_Artemis", "ClanLRM20_Artemis"],
        "mediumpulselaser": ["MediumPulseLaser", "ClanMediumPulseLaser"],
        "nonpulselaser": ["SmallLaser", "MediumLaser", "ERLargeLaser", "LargeLaser",
            "ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser"],
        "ppc": ["ERPPC", "PPC", "ClanERPPC", "LightPPC", "HeavyPPC", "SnubNosePPC"],
        "pulselaser": ["LargePulseLaser", "MediumPulseLaser", "SmallPulseLaser",
            "ClanSmallPulseLaser", "ClanMediumPulseLaser", "ClanLargePulseLaser"],
        "ultraautocannon": ["UltraAutoCannon5", "UltraAutoCannon2", "UltraAutoCannon10", "UltraAutoCannon20",
            "ClanUltraAutoCannon2", "ClanUltraAutoCannon5", "ClanUltraAutoCannon10", "ClanUltraAutoCannon20"],
        "ultraautocannon20": ["UltraAutoCannon20", "ClanUltraAutoCannon20"],
        "ac": ["AutoCannon20", "AutoCannon2", "AutoCannon5", "AutoCannon10", "LBXAutoCannon10",
            "UltraAutoCannon5", "UltraAutoCannon2", "UltraAutoCannon10", "UltraAutoCannon20",
            "ClanLBXAutoCannon2", "ClanLBXAutoCannon5", "ClanLBXAutoCannon10", "ClanLBXAutoCannon20",
            "ClanUltraAutoCannon2", "ClanUltraAutoCannon5", "ClanUltraAutoCannon10", "ClanUltraAutoCannon20",
            "ClanAutoCannon2", "ClanAutoCannon5", "ClanAutoCannon10", "ClanAutoCannon20"],
        "clanantimissilesystem": ["ClanAntiMissileSystem"],
        "clanerlaser": ["ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser"],
        "clanermediumlaser": ["ClanERMediumLaser"],
        "clanlbxautocannon10": ["ClanLBXAutoCannon10"],
        "clanerppc": ["ClanERPPC"],
        "clangaussrifle": ["ClanGaussRifle"],
        "clanlaser": ["ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser", "ClanERMicroLaser",
            "ClanSmallPulseLaser", "ClanMediumPulseLaser", "ClanLargePulseLaser", "ClanMicroPulseLaser",
            "ClanHeavySmallLaser", "ClanHeavyMediumLaser", "ClanHeavyLargeLaser",
        ],
        "clanlrm": ["ClanLRM5", "ClanLRM10", "ClanLRM15", "ClanLRM20",
            "ClanLRM5_Artemis", "ClanLRM10_Artemis", "ClanLRM15_Artemis", "ClanLRM20_Artemis"],
        "clanlrm5": ["ClanLRM5", "ClanLRM5_Artemis"],
        "clanlrm10": ["ClanLRM10", "ClanLRM10_Artemis"],
        "clanlrm15": ["ClanLRM15", "ClanLRM15_Artemis"],
        "clanlrm20": ["ClanLRM20", "ClanLRM20_Artemis"],
        "clanmachinegun": ["ClanMachineGun"],
        "clanmediumpulselaser": ["ClanMediumPulseLaser"],
        "clanppc": ["ClanERPPC"],
        "clanpulselaser": ["ClanSmallPulseLaser", "ClanMediumPulseLaser", "ClanLargePulseLaser", "ClanMicroPulseLaser",],
        "clansrm2": ["ClanSRM2", "ClanSRM2_Artemis"],
        "clansrm4": ["ClanSRM4", "ClanSRM4_Artemis"],
        "clansrm6": ["ClanSRM6", "ClanSRM6_Artemis"],
        "clansrm": ["ClanSRM2", "ClanSRM2_Artemis", "ClanSRM4", "ClanSRM4_Artemis", "ClanSRM6", "ClanSRM6_Artemis"],
        "clanstreaksrm2": ["ClanStreakSRM2"],
        "clanstreaksrm4": ["ClanStreakSRM4"],
        "clanstreaksrm6": ["ClanStreakSRM6"],
        "clanstreaksrm": ["ClanStreakSRM2", "ClanStreakSRM4", "ClanStreakSRM6"],
        "clanultraautocannon2": ["ClanUltraAutoCannon2"],
        "clanultraautocannon5": ["ClanUltraAutoCannon5"],
        "clanultraautocannon10": ["ClanUltraAutoCannon10"],
        "clanultraautocannon20": ["ClanUltraAutoCannon20"],
        "erlaser": ["ERLargeLaser", "ERMediumLaser", "ERSmallLaser",
            "ClanERMicroLaser", "ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser"],
        "heavylaser": ["ClanHeavySmallLaser", "ClanHeavyMediumLaser", "ClanHeavyLargeLaser",],
        "isantimissilesystem": ["AntiMissileSystem"],
        "lbxautocannon": ["LBXAutoCannon10", "LBXAutoCannon2", "LBXAutoCannon5", "LBXAutoCannon20",
            "ClanLBXAutoCannon2", "ClanLBXAutoCannon5", "ClanLBXAutoCannon10", "ClanLBXAutoCannon20",],
        "rotaryautocannon": ["RotaryAutoCannon2", "RotaryAutoCannon5"],
        "srm": ["SRM2", "SRM2_Artemis", "SRM4", "SRM4_Artemis", "SRM6", "SRM6_Artemis",
            "ClanSRM2", "ClanSRM2_Artemis", "ClanSRM4", "ClanSRM4_Artemis", "ClanSRM6", "ClanSRM6_Artemis"],
        "streaksrm": ["StreakSRM2", "StreakSRM4", "StreakSRM6", "ClanStreakSRM2", "ClanStreakSRM4", "ClanStreakSRM6"]
    };
    //ammo skill quirk name -> ammo type
    MechModelQuirksData._ammoCapacityMap = {
        "ammocapacity_ac10_additive": "AC10Ammo",
        "ammocapacity_ac20_additive": "AC20Ammo",
        "ammocapacity_ac2_additive": "AC2Ammo",
        "ammocapacity_ac5_additive": "AC5Ammo",
        "ammocapacity_cac10_additive": "ClanAC10Ammo",
        "ammocapacity_cac20_additive": "ClanAC20Ammo",
        "ammocapacity_cac2_additive": "ClanAC2Ammo",
        "ammocapacity_cac5_additive": "ClanAC5Ammo",
        "ammocapacity_catm_additive": "ClanATMAmmo",
        "ammocapacity_cgauss_additive": "ClanGaussAmmo",
        "ammocapacity_cheavymachinegun_additive": "ClanHeavyMachineGunAmmo",
        "ammocapacity_clb10x_additive": "ClanLB10-XACAmmo",
        "ammocapacity_clb20x_additive": "ClanLB20-XACAmmo",
        "ammocapacity_clb2x_additive": "ClanLB2-XACAmmo",
        "ammocapacity_clb5x_additive": "ClanLB5-XACAmmo",
        "ammocapacity_clightmachinegun_additive": "ClanLightMachineGunAmmo",
        "ammocapacity_clrm_additive": "ClanLRMAmmo",
        "ammocapacity_clrm_artemis_additive": "ClanLRMAmmoArtemis",
        "ammocapacity_cmachinegun_additive": "ClanMachineGunAmmo",
        "ammocapacity_cnarc_additive": "ClanNARCAmmo",
        "ammocapacity_csrm_additive": "ClanSRMAmmo",
        "ammocapacity_csrm_artemis_additive": "ClanSRMAmmoArtemis",
        "ammocapacity_cstreak_srm_additive": "ClanStreakSRMAmmo",
        "ammocapacity_cultraac10_additive": "ClanUltraAC10Ammo",
        "ammocapacity_cultraac20_additive": "ClanUltraAC20Ammo",
        "ammocapacity_cultraac2_additive": "ClanUltraAC2Ammo",
        "ammocapacity_cultraac5_additive": "ClanUltraAC5Ammo",
        "ammocapacity_gauss_additive": "GaussAmmo",
        "ammocapacity_heavygauss_additive": "HeavyGaussAmmo",
        "ammocapacity_heavymachinegun_additive": "HeavyMachineGunAmmo",
        "ammocapacity_lb10x_additive": "LB10-XACAmmo",
        "ammocapacity_lb20x_additive": "LB20-XACAmmo",
        "ammocapacity_lb2x_additive": "LB2-XACAmmo",
        "ammocapacity_lb5x_additive": "LB5-XACAmmo",
        "ammocapacity_lightgauss_additive": "LightGaussAmmo",
        "ammocapacity_lightmachinegun_additive": "LightMachineGunAmmo",
        "ammocapacity_lrm_additive": "LRMAmmo",
        "ammocapacity_lrm_artemis_additive": "LRMAmmoArtemis",
        "ammocapacity_machinegun_additive": "MachineGunAmmo",
        "ammocapacity_mrm_additive": "MRMAmmo",
        "ammocapacity_narc_additive": "NARCAmmo",
        "ammocapacity_rotary_ac2_additive": "RotaryAC2Ammo",
        "ammocapacity_rotary_ac5_additive": "RotaryAC5Ammo",
        "ammocapacity_srm_additive": "SRMAmmo",
        "ammocapacity_srm_artemis_additive": "SRMAmmoArtemis",
        "ammocapacity_streak_srm_additive": "StreakSRMAmmo",
        "ammocapacity_ultraac10_additive": "UltraAC10Ammo",
        "ammocapacity_ultraac20_additive": "UltraAC20Ammo",
        "ammocapacity_ultraac2_additive": "UltraAC2Ammo",
        "ammocapacity_ultraac5_additive": "UltraAC5Ammo",
    };
})(MechModelQuirksData || (MechModelQuirksData = {}));
//User-changable options in SimulatorParameters. Used in
//simulator-view-simsettings to populate the settings dialog
var SimulatorSettings;
//User-changable options in SimulatorParameters. Used in
//simulator-view-simsettings to populate the settings dialog
(function (SimulatorSettings) {
    SimulatorSettings.UACJamMethod = {
        RANDOM: "random",
        EXPECTED_VALUE: "expected_value",
    };
    SimulatorSettings.UAC_DOUBLE_TAP_SETTING = {
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
    SimulatorSettings.UAC_JAM_SETTING = {
        property: "uacJAMMethod",
        name: "UAC Jam Method",
        values: [
            {
                id: "random",
                name: "Random",
                value: SimulatorSettings.UACJamMethod.RANDOM,
                description: "UACs jam at random, same as in game.",
                default: true,
            },
            {
                id: "expected_value",
                name: "Expected Value",
                value: SimulatorSettings.UACJamMethod.EXPECTED_VALUE,
                description: "Simulates UAC jams by adding (jamTime * jamChance) to the weapon cooldown.",
                default: false,
            },
        ],
    };
})(SimulatorSettings || (SimulatorSettings = {}));
var ExternalSkillTrees;
(function (ExternalSkillTrees) {
    //Kitlaan skill name -> GameData skill name
    ExternalSkillTrees._KitlaanSkillNameMap = {
        "AC Cooldown": null,
        "AC Range": null,
        "AC Velocity": null,
        "Advanced Salvos": "ExtendedBombardment",
        "Advanced Zoom": "AdvancedZoom",
        "AMS Overload": "AMSOverload",
        "Anchor Turn": "AnchorTurn",
        "Arm Pitch": null,
        "Arm Speed": null,
        "Armor Hardening": "ArmorHardening",
        "Capture Assist": "CaptureAssist",
        "Consumable Slot": "ConsumableSlot",
        "Cool Run": "CoolRun",
        "Coolant Reserves": "CoolantReserves",
        "Cooldown": "Cooldown",
        "Coolshot Cooldown": "CoolshotCooldown",
        "Enhanced Coolshot": "EnhancedCoolshot",
        "Enhanced ECM": "EnhancedECM",
        "Enhanced NARC": "EnhancedNARC",
        "Enhanced Spotting": "EnhancedSpotting",
        "Enhanced UAC/RAC": "UACJamChance",
        "Expanded Reserves": "ExpandedReserves",
        "Extended Bombardment": "ExtendedBombardment",
        "Extra UAV": "ExtraUAV",
        "Fall Damage": "ShockAbsorbance",
        "Flamer Ventilation": "FlamerVentilation",
        "Gauss Charge": "GaussCharge",
        "Gauss Cooldown": null,
        "Gauss Extd. Charge": null,
        "Gauss Range": null,
        "Gauss Velocity": null,
        "Hard Brake": "HardBrake",
        "Heat Containment": "HeatContainment",
        "Heat Gen": "HeatGen",
        "Heat Shielding": "HeatShielding",
        "High Explosive": "HighExplosive",
        "Hill Climb": "HillClimb",
        "Improved Gyros": "ImprovedGyros",
        "Kinetic Burst": "KineticBurst",
        "Laser Cooldown": null,
        "Laser Duration": "LaserDuration",
        "Laser Heat": null,
        "Laser Range": null,
        "LBX Cooldown": null,
        "LBX Range": null,
        "LBX Spread": "LBXSpread",
        "LBX Velocity": null,
        "Lift Speed": "LiftSpeed",
        "LRM Cooldown": null,
        "LRM Range": null,
        "LRM Spread": null,
        "LRM Velocity": null,
        "Magazine Capacity": "MagazineCapacity",
        "Missile Rack": "MissileRack",
        "Missile Spread": "MissileSpread",
        "PPC Cooldown": null,
        "PPC Heat": null,
        "PPC Range": null,
        "PPC Velocity": null,
        "Pulse Laser Cooldown": null,
        "Pulse Laser Duration": null,
        "Pulse Laser Heat": null,
        "Pulse Laser Range": null,
        "Quick Ignition": "QuickIgnition",
        "Radar Deprivation": "RadarDeprivation",
        "Range": "Range",
        "Reinforced Casing": "ReinforcedCasing",
        "Seismic Sensor": "SeismicSensor",
        "Sensor Range": "SensorRange",
        "Shock Absorbance": "ShockAbsorbance",
        "Skeletal Density": "SkeletalDensity",
        "Speed Retention": "SpeedRetention",
        "Speed Tweak": "SpeedTweak",
        "SRM Cooldown": null,
        "SRM Range": null,
        "SRM Spread": null,
        "SRM Velocity": null,
        "Streak SRM Cooldown": null,
        "Streak SRM Heat": null,
        "Streak SRM Range": null,
        "Streak SRM Velocity": null,
        "Target Decay": "TargetDecay",
        "Target Info Gathering": "TargetInfoGathering",
        "Target Retention": "TargetRetention",
        "Torso Pitch": "TorsoPitch",
        "Torso Speed": "TorsoSpeed",
        "Torso Yaw": "TorsoYaw",
        "Turn Rate": "AnchorTurn",
        "UAC Cooldown": null,
        "UAC Jam Chance": "UACJamChance",
        "UAC Range": null,
        "UAC Velocity": null,
        "UAV Duration": "UAVTime",
        "UAV Range": "UAVRange",
        "Vectoring": "Vectoring",
        "Velocity": "Velocity",
        "Vent Calibration": "VentCalibration"
    };
})(ExternalSkillTrees || (ExternalSkillTrees = {}));
//Generated from GameData.pak on Wed, 13 Dec 2017 18:21:23 GMT
var AddedData;
//Generated from GameData.pak on Wed, 13 Dec 2017 18:21:23 GMT
(function (AddedData) {
    AddedData._SkillTreeData = {
        "Range": {
            "baseName": "Range",
            "effects": [
                {
                    "quirkName": "all_range_multiplier",
                    "quirkTranslatedName": "RANGE",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 0.01
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": 0.01
                        }
                    ]
                }
            ]
        },
        "Velocity": {
            "baseName": "Velocity",
            "effects": [
                {
                    "quirkName": "all_velocity_multiplier",
                    "quirkTranslatedName": "VELOCITY",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 0.03
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": 0.03
                        }
                    ]
                }
            ]
        },
        "Cooldown": {
            "baseName": "Cooldown",
            "effects": [
                {
                    "quirkName": "all_cooldown_multiplier",
                    "quirkTranslatedName": "COOLDOWN",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.0075
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": -0.006
                        }
                    ]
                }
            ]
        },
        "HeatGen": {
            "baseName": "HeatGen",
            "effects": [
                {
                    "quirkName": "all_heat_multiplier",
                    "quirkTranslatedName": "HEAT GEN",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.0075
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": -0.0075
                        }
                    ]
                }
            ]
        },
        "LaserDuration": {
            "baseName": "LaserDuration",
            "effects": [
                {
                    "quirkName": "laser_duration_multiplier",
                    "quirkTranslatedName": "LASER DURATION",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.0375
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": -0.025
                        }
                    ]
                }
            ]
        },
        "HighExplosive": {
            "baseName": "HighExplosive",
            "effects": [
                {
                    "quirkName": "missile_critdamage_multiplier",
                    "quirkTranslatedName": "MISSILE CRIT DAMAGE",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 0.075
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": 0.075
                        }
                    ]
                }
            ]
        },
        "MissileSpread": {
            "baseName": "MissileSpread",
            "effects": [
                {
                    "quirkName": "missile_spread_multiplier",
                    "quirkTranslatedName": "MISSILE SPREAD",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.025
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": -0.025
                        }
                    ]
                }
            ]
        },
        "LBXSpread": {
            "baseName": "LBXSpread",
            "effects": [
                {
                    "quirkName": "lbxautocannon_spread_multiplier",
                    "quirkTranslatedName": "LB-X SPREAD",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.05
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": -0.05
                        }
                    ]
                }
            ]
        },
        "GaussCharge": {
            "baseName": "GaussCharge",
            "effects": [
                {
                    "quirkName": "gaussextendedcharge_additive",
                    "quirkTranslatedName": "GAUSS CHARGE",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 0.75
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": 0.75
                        }
                    ]
                }
            ]
        },
        "UACJamChance": {
            "baseName": "UACJamChance",
            "effects": [
                {
                    "quirkName": "ultraautocannon_jamduration_multiplier",
                    "quirkTranslatedName": "UAC JAM DURATION",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.075
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": -0.075
                        }
                    ]
                },
                {
                    "quirkName": "rotaryautocannon_jamrampdownduration_multiplier",
                    "quirkTranslatedName": "RAC JAM DURATION",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.075
                        }
                    ]
                }
            ]
        },
        "ReinforcedCasing": {
            "baseName": "ReinforcedCasing",
            "effects": [
                {
                    "quirkName": "critchance_receiving_multiplier",
                    "quirkTranslatedName": "CRIT HIT CHANCE (RECEIVING)",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.01
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": -0.01
                        }
                    ]
                }
            ]
        },
        "FlamerVentilation": {
            "baseName": "FlamerVentilation",
            "effects": [
                {
                    "quirkName": "flamer_rampdownduration_multiplier",
                    "quirkTranslatedName": "FLAMER RAMPDOWN",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": -0.075
                        },
                        {
                            "faction": "Clan",
                            "quirkValue": -0.075
                        }
                    ]
                }
            ]
        },
        "ArmorHardening": {
            "baseName": "ArmorHardening",
            "effects": [
                {
                    "quirkName": "increasedarmor_multiplier",
                    "quirkTranslatedName": "ARMOR",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "tonnage": 20,
                            "quirkValue": 0.026
                        },
                        {
                            "faction": "IS",
                            "tonnage": 25,
                            "quirkValue": 0.025
                        },
                        {
                            "faction": "IS",
                            "tonnage": 30,
                            "quirkValue": 0.024
                        },
                        {
                            "faction": "IS",
                            "tonnage": 35,
                            "quirkValue": 0.023
                        },
                        {
                            "faction": "IS",
                            "tonnage": 40,
                            "quirkValue": 0.022
                        },
                        {
                            "faction": "IS",
                            "tonnage": 45,
                            "quirkValue": 0.021
                        },
                        {
                            "faction": "IS",
                            "tonnage": 50,
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "IS",
                            "tonnage": 55,
                            "quirkValue": 0.019
                        },
                        {
                            "faction": "IS",
                            "tonnage": 60,
                            "quirkValue": 0.018
                        },
                        {
                            "faction": "IS",
                            "tonnage": 65,
                            "quirkValue": 0.017
                        },
                        {
                            "faction": "IS",
                            "tonnage": 70,
                            "quirkValue": 0.016
                        },
                        {
                            "faction": "IS",
                            "tonnage": 75,
                            "quirkValue": 0.015
                        },
                        {
                            "faction": "IS",
                            "tonnage": 80,
                            "quirkValue": 0.014
                        },
                        {
                            "faction": "IS",
                            "tonnage": 85,
                            "quirkValue": 0.013
                        },
                        {
                            "faction": "IS",
                            "tonnage": 90,
                            "quirkValue": 0.012
                        },
                        {
                            "faction": "IS",
                            "tonnage": 95,
                            "quirkValue": 0.011
                        },
                        {
                            "faction": "IS",
                            "tonnage": 100,
                            "quirkValue": 0.01
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 20,
                            "quirkValue": 0.026
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 25,
                            "quirkValue": 0.025
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 30,
                            "quirkValue": 0.024
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 35,
                            "quirkValue": 0.023
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 40,
                            "quirkValue": 0.022
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 45,
                            "quirkValue": 0.021
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 50,
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 55,
                            "quirkValue": 0.019
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 60,
                            "quirkValue": 0.018
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 65,
                            "quirkValue": 0.017
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 70,
                            "quirkValue": 0.016
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 75,
                            "quirkValue": 0.015
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 80,
                            "quirkValue": 0.014
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 85,
                            "quirkValue": 0.013
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 90,
                            "quirkValue": 0.012
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 95,
                            "quirkValue": 0.011
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 100,
                            "quirkValue": 0.01
                        }
                    ]
                }
            ]
        },
        "SkeletalDensity": {
            "baseName": "SkeletalDensity",
            "effects": [
                {
                    "quirkName": "increasedstructure_multiplier",
                    "quirkTranslatedName": "STRUCTURE",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "tonnage": 20,
                            "quirkValue": 0.041
                        },
                        {
                            "faction": "IS",
                            "tonnage": 25,
                            "quirkValue": 0.04
                        },
                        {
                            "faction": "IS",
                            "tonnage": 30,
                            "quirkValue": 0.039
                        },
                        {
                            "faction": "IS",
                            "tonnage": 35,
                            "quirkValue": 0.038
                        },
                        {
                            "faction": "IS",
                            "tonnage": 40,
                            "quirkValue": 0.037
                        },
                        {
                            "faction": "IS",
                            "tonnage": 45,
                            "quirkValue": 0.036
                        },
                        {
                            "faction": "IS",
                            "tonnage": 50,
                            "quirkValue": 0.035
                        },
                        {
                            "faction": "IS",
                            "tonnage": 55,
                            "quirkValue": 0.034
                        },
                        {
                            "faction": "IS",
                            "tonnage": 60,
                            "quirkValue": 0.033
                        },
                        {
                            "faction": "IS",
                            "tonnage": 65,
                            "quirkValue": 0.032
                        },
                        {
                            "faction": "IS",
                            "tonnage": 70,
                            "quirkValue": 0.031
                        },
                        {
                            "faction": "IS",
                            "tonnage": 75,
                            "quirkValue": 0.03
                        },
                        {
                            "faction": "IS",
                            "tonnage": 80,
                            "quirkValue": 0.029
                        },
                        {
                            "faction": "IS",
                            "tonnage": 85,
                            "quirkValue": 0.028
                        },
                        {
                            "faction": "IS",
                            "tonnage": 90,
                            "quirkValue": 0.027
                        },
                        {
                            "faction": "IS",
                            "tonnage": 95,
                            "quirkValue": 0.026
                        },
                        {
                            "faction": "IS",
                            "tonnage": 100,
                            "quirkValue": 0.025
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 20,
                            "quirkValue": 0.041
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 25,
                            "quirkValue": 0.04
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 30,
                            "quirkValue": 0.039
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 35,
                            "quirkValue": 0.038
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 40,
                            "quirkValue": 0.037
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 45,
                            "quirkValue": 0.036
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 50,
                            "quirkValue": 0.035
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 55,
                            "quirkValue": 0.034
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 60,
                            "quirkValue": 0.033
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 65,
                            "quirkValue": 0.032
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 70,
                            "quirkValue": 0.031
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 75,
                            "quirkValue": 0.03
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 80,
                            "quirkValue": 0.029
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 85,
                            "quirkValue": 0.028
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 90,
                            "quirkValue": 0.027
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 95,
                            "quirkValue": 0.026
                        },
                        {
                            "faction": "Clan",
                            "tonnage": 100,
                            "quirkValue": 0.025
                        }
                    ]
                }
            ]
        },
        "ShockAbsorbance": {
            "baseName": "ShockAbsorbance",
            "effects": [
                {
                    "quirkName": "falldamage_multiplier",
                    "quirkTranslatedName": "FALL DAMAGE",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "weightClass": "Light",
                            "quirkValue": -0.1
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Medium",
                            "quirkValue": -0.1
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Heavy",
                            "quirkValue": -0.1
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Assault",
                            "quirkValue": -0.1
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Light",
                            "quirkValue": -0.1
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Medium",
                            "quirkValue": -0.1
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Heavy",
                            "quirkValue": -0.1
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Assault",
                            "quirkValue": -0.1
                        }
                    ]
                }
            ]
        },
        "AMSOverload": {
            "baseName": "AMSOverload",
            "effects": [
                {
                    "quirkName": "antimissilesystem_damage_additive",
                    "quirkTranslatedName": "AMS DAMAGE",
                    "quirkValues": [
                        {
                            "quirkValue": 0.75
                        }
                    ]
                }
            ]
        },
        "EnhancedNARC": {
            "baseName": "EnhancedNARC",
            "effects": [
                {
                    "quirkName": "narcbeacon_velocity_multiplier",
                    "quirkTranslatedName": "NARC VELOCITY",
                    "quirkValues": [
                        {
                            "quirkValue": 0.1
                        }
                    ]
                },
                {
                    "quirkName": "narcbeacon_narcduration_multiplier",
                    "quirkTranslatedName": "NARC DURATION",
                    "quirkValues": [
                        {
                            "quirkValue": 0.15
                        }
                    ]
                }
            ]
        },
        "TorsoSpeed": {
            "baseName": "TorsoSpeed",
            "effects": [
                {
                    "quirkName": "torso_yawspeed_multiplier",
                    "quirkTranslatedName": "Torso Yaw Speed",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "weightClass": "Light",
                            "quirkValue": 0.05
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Medium",
                            "quirkValue": 0.04
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Heavy",
                            "quirkValue": 0.035
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Assault",
                            "quirkValue": 0.035
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Light",
                            "quirkValue": 0.05
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Medium",
                            "quirkValue": 0.04
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Heavy",
                            "quirkValue": 0.035
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Assault",
                            "quirkValue": 0.035
                        }
                    ]
                }
            ]
        },
        "TorsoYaw": {
            "baseName": "TorsoYaw",
            "effects": [
                {
                    "quirkName": "torso_yawangle_multiplier",
                    "quirkTranslatedName": "Torso Yaw Angle",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "weightClass": "Light",
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Medium",
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Heavy",
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Assault",
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Light",
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Medium",
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Heavy",
                            "quirkValue": 0.02
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Assault",
                            "quirkValue": 0.02
                        }
                    ]
                }
            ]
        },
        "TorsoPitch": {
            "baseName": "TorsoPitch",
            "effects": [
                {
                    "quirkName": "torso_pitchangle_multiplier",
                    "quirkTranslatedName": "Torso Pitch Angle",
                    "quirkValues": [
                        {
                            "quirkValue": 0.02
                        }
                    ]
                }
            ]
        },
        "KineticBurst": {
            "baseName": "KineticBurst",
            "effects": [
                {
                    "quirkName": "accellerp_all_multiplier",
                    "quirkTranslatedName": "ACCELERATION RATE",
                    "quirkValues": [
                        {
                            "quirkValue": 0.035
                        }
                    ]
                }
            ]
        },
        "HardBrake": {
            "baseName": "HardBrake",
            "effects": [
                {
                    "quirkName": "decellerp_all_multiplier",
                    "quirkTranslatedName": "DECELERATION RATE",
                    "quirkValues": [
                        {
                            "quirkValue": 0.035
                        }
                    ]
                }
            ]
        },
        "AnchorTurn": {
            "baseName": "AnchorTurn",
            "effects": [
                {
                    "quirkName": "turnlerp_all_multiplier",
                    "quirkTranslatedName": "TURN RATE",
                    "quirkValues": [
                        {
                            "quirkValue": 0.05
                        }
                    ]
                }
            ]
        },
        "SpeedTweak": {
            "baseName": "SpeedTweak",
            "effects": [
                {
                    "quirkName": "mechtopspeed_multiplier",
                    "quirkTranslatedName": "TOP SPEED",
                    "quirkValues": [
                        {
                            "quirkValue": 0.015
                        }
                    ]
                }
            ]
        },
        "LiftSpeed": {
            "baseName": "LiftSpeed",
            "effects": [
                {
                    "quirkName": "jumpjets_initialthrust_multiplier",
                    "quirkTranslatedName": "JUMP JETS INITIAL THRUST",
                    "quirkValues": [
                        {
                            "quirkValue": 0.03
                        }
                    ]
                }
            ]
        },
        "Vectoring": {
            "baseName": "Vectoring",
            "effects": [
                {
                    "quirkName": "jumpjets_forwardthrust_multiplier",
                    "quirkTranslatedName": "JUMP JETS FORWARD THRUST",
                    "quirkValues": [
                        {
                            "quirkValue": 0.25
                        }
                    ]
                }
            ]
        },
        "VentCalibration": {
            "baseName": "VentCalibration",
            "effects": [
                {
                    "quirkName": "jumpjets_burntime_multiplier",
                    "quirkTranslatedName": "JUMP JETS BURN TIME",
                    "quirkValues": [
                        {
                            "quirkValue": 0.03
                        }
                    ]
                }
            ]
        },
        "HeatShielding": {
            "baseName": "HeatShielding",
            "effects": [
                {
                    "quirkName": "jumpjets_heat_multiplier",
                    "quirkTranslatedName": "JUMP JETS HEAT",
                    "quirkValues": [
                        {
                            "quirkValue": -0.06
                        }
                    ]
                }
            ]
        },
        "QuickIgnition": {
            "baseName": "QuickIgnition",
            "effects": [
                {
                    "quirkName": "startupduration_multiplier",
                    "quirkTranslatedName": "QUICK IGNITION",
                    "quirkValues": [
                        {
                            "quirkValue": -0.07
                        }
                    ]
                }
            ]
        },
        "HeatContainment": {
            "baseName": "HeatContainment",
            "effects": [
                {
                    "quirkName": "maxheat_multiplier",
                    "quirkTranslatedName": "HEAT CAPACITY",
                    "quirkValues": [
                        {
                            "quirkValue": 0.03
                        }
                    ]
                }
            ]
        },
        "CoolRun": {
            "baseName": "CoolRun",
            "effects": [
                {
                    "quirkName": "heatdissipation_multiplier",
                    "quirkTranslatedName": "Heat Dissipation",
                    "quirkValues": [
                        {
                            "quirkValue": 0.02
                        }
                    ]
                }
            ]
        },
        "HillClimb": {
            "baseName": "HillClimb",
            "effects": [
                {
                    "quirkName": "hillclimb_multiplier",
                    "quirkTranslatedName": "HILL CLIMB",
                    "quirkValues": [
                        {
                            "quirkValue": 0.05
                        }
                    ]
                }
            ]
        },
        "ImprovedGyros": {
            "baseName": "ImprovedGyros",
            "effects": [
                {
                    "quirkName": "screenshake_multiplier",
                    "quirkTranslatedName": "IMPROVED GYROS",
                    "quirkValues": [
                        {
                            "quirkValue": -0.175
                        }
                    ]
                }
            ]
        },
        "SpeedRetention": {
            "baseName": "SpeedRetention",
            "effects": [
                {
                    "quirkName": "speedretention_multiplier",
                    "quirkTranslatedName": "SPEED RETENTION",
                    "quirkValues": [
                        {
                            "quirkValue": 0.1
                        }
                    ]
                }
            ]
        },
        "MagazineCapacity": {
            "baseName": "MagazineCapacity",
            "effects": [
                {
                    "quirkName": "ammocapacity_machinegun_additive",
                    "quirkTranslatedName": "MG AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 200
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_lightmachinegun_additive",
                    "quirkTranslatedName": "LMG AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 250
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_heavymachinegun_additive",
                    "quirkTranslatedName": "HMG AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 100
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_ac2_additive",
                    "quirkTranslatedName": "AC2 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 8
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_ac5_additive",
                    "quirkTranslatedName": "AC5 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 3
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_ac10_additive",
                    "quirkTranslatedName": "AC10 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 2
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_ac20_additive",
                    "quirkTranslatedName": "AC20 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 1
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_lb2x_additive",
                    "quirkTranslatedName": "LB-X2 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 8
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_lb5x_additive",
                    "quirkTranslatedName": "LB-X5 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 3
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_lb10x_additive",
                    "quirkTranslatedName": "LB-X10 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 2
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_lb20x_additive",
                    "quirkTranslatedName": "LB-X20 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 1
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_gauss_additive",
                    "quirkTranslatedName": "GAUSS AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 1
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_lightgauss_additive",
                    "quirkTranslatedName": "LIGHT GAUSS AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 2
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_heavygauss_additive",
                    "quirkTranslatedName": "HEAVY GAUSS AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 1
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_ultraac2_additive",
                    "quirkTranslatedName": "UAC/2 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 8
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_ultraac5_additive",
                    "quirkTranslatedName": "UAC/5 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 3
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_ultraac10_additive",
                    "quirkTranslatedName": "UAC/10 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 4
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_ultraac20_additive",
                    "quirkTranslatedName": "UAC/20 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 3
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_rotary_ac2_additive",
                    "quirkTranslatedName": "RAC 2 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 30
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_rotary_ac5_additive",
                    "quirkTranslatedName": "RAC 5 AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 15
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_clightmachinegun_additive",
                    "quirkTranslatedName": "CLAN LMG AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 250
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cmachinegun_additive",
                    "quirkTranslatedName": "CLAN MG AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 200
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cheavymachinegun_additive",
                    "quirkTranslatedName": "CLAN HMG AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 100
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_clb2x_additive",
                    "quirkTranslatedName": "CLAN LB-X2 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 8
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_clb5x_additive",
                    "quirkTranslatedName": "CLAN LB-X5 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 3
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_clb10x_additive",
                    "quirkTranslatedName": "CLAN LB-X10 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 2
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_clb20x_additive",
                    "quirkTranslatedName": "CLAN LB-X20 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 1
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cultraac2_additive",
                    "quirkTranslatedName": "CLAN UAC/2 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 8
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cultraac5_additive",
                    "quirkTranslatedName": "CLAN UAC/5 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 6
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cultraac10_additive",
                    "quirkTranslatedName": "CLAN UAC/10 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 6
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cultraac20_additive",
                    "quirkTranslatedName": "CLAN UAC/20 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 4
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cgauss_additive",
                    "quirkTranslatedName": "CLAN GAUSS AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 1
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cac2_additive",
                    "quirkTranslatedName": "CLAN AC2 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 8
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cac5_additive",
                    "quirkTranslatedName": "CLAN AC5 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 6
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cac10_additive",
                    "quirkTranslatedName": "CLAN AC10 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 6
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cac20_additive",
                    "quirkTranslatedName": "CLAN AC20 AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 4
                        }
                    ]
                }
            ]
        },
        "MissileRack": {
            "baseName": "MissileRack",
            "effects": [
                {
                    "quirkName": "ammocapacity_lrm_additive",
                    "quirkTranslatedName": "LRM AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 18
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_srm_additive",
                    "quirkTranslatedName": "SRM AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 10
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_streak_srm_additive",
                    "quirkTranslatedName": "STREAK AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 10
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_narc_additive",
                    "quirkTranslatedName": "NARC AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 1
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_lrm_artemis_additive",
                    "quirkTranslatedName": "ALRM AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 18
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_srm_artemis_additive",
                    "quirkTranslatedName": "ASRM AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 10
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_mrm_additive",
                    "quirkTranslatedName": "MRM AMMO",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "quirkValue": 30
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_clrm_additive",
                    "quirkTranslatedName": "CLAN LRM AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 18
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_csrm_additive",
                    "quirkTranslatedName": "CLAN SRM AMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 10
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cstreak_srm_additive",
                    "quirkTranslatedName": "CLAN STREAK AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 10
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_cnarc_additive",
                    "quirkTranslatedName": "CLAN NARC AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 1
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_clrm_artemis_additive",
                    "quirkTranslatedName": "CLAN ALRM AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 18
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_csrm_artemis_additive",
                    "quirkTranslatedName": "CLAN ASRM AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 10
                        }
                    ]
                },
                {
                    "quirkName": "ammocapacity_catm_additive",
                    "quirkTranslatedName": "CLAN ATM AMMO",
                    "quirkValues": [
                        {
                            "faction": "Clan",
                            "quirkValue": 9
                        }
                    ]
                }
            ]
        },
        "SensorRange": {
            "baseName": "SensorRange",
            "effects": [
                {
                    "quirkName": "sensorrange_multiplier",
                    "quirkTranslatedName": "SENSOR RANGE",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "weightClass": "Light",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Medium",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Heavy",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Assault",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Light",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Medium",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Heavy",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Assault",
                            "quirkValue": 0.07
                        }
                    ]
                }
            ]
        },
        "TargetInfoGathering": {
            "baseName": "TargetInfoGathering",
            "effects": [
                {
                    "quirkName": "targetinfogathering_multiplier",
                    "quirkTranslatedName": "TARGET INFO GATHERING",
                    "quirkValues": [
                        {
                            "faction": "IS",
                            "weightClass": "Light",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Medium",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Heavy",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "IS",
                            "weightClass": "Assault",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Light",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Medium",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Heavy",
                            "quirkValue": 0.07
                        },
                        {
                            "faction": "Clan",
                            "weightClass": "Assault",
                            "quirkValue": 0.07
                        }
                    ]
                }
            ]
        },
        "TargetDecay": {
            "baseName": "TargetDecay",
            "effects": [
                {
                    "quirkName": "targetdecayduration_additive",
                    "quirkTranslatedName": "TARGET DECAY",
                    "quirkValues": [
                        {
                            "quirkValue": 0.7
                        }
                    ]
                }
            ]
        },
        "RadarDeprivation": {
            "baseName": "RadarDeprivation",
            "effects": [
                {
                    "quirkName": "radardeprivation_multiplier",
                    "quirkTranslatedName": "RADAR DEPRIVATION",
                    "quirkValues": [
                        {
                            "quirkValue": 0.2
                        }
                    ]
                }
            ]
        },
        "AdvancedZoom": {
            "baseName": "AdvancedZoom",
            "effects": [
                {
                    "quirkName": "advancedzoom_additive",
                    "quirkTranslatedName": "ADVANCED ZOOM",
                    "quirkValues": [
                        {
                            "quirkValue": 1
                        }
                    ]
                }
            ]
        },
        "SeismicSensor": {
            "baseName": "SeismicSensor",
            "effects": [
                {
                    "quirkName": "seismicsensorrange_additive",
                    "quirkTranslatedName": "SEISMIC SENSOR RANGE",
                    "quirkValues": [
                        {
                            "quirkValue": 100
                        }
                    ]
                }
            ]
        },
        "TargetRetention": {
            "baseName": "TargetRetention",
            "effects": [
                {
                    "quirkName": "backfacetargetretentionrange_additive",
                    "quirkTranslatedName": "TARGET RETENTION",
                    "quirkValues": [
                        {
                            "quirkValue": 200
                        }
                    ]
                }
            ]
        },
        "ConsumableSlot": {
            "baseName": "ConsumableSlot",
            "effects": [
                {
                    "quirkName": "extraconsumableslot_additive",
                    "quirkTranslatedName": "CONSUMABLE SLOT",
                    "quirkValues": [
                        {
                            "quirkValue": 1
                        }
                    ]
                }
            ]
        },
        "ExtraUAV": {
            "baseName": "ExtraUAV",
            "effects": [
                {
                    "quirkName": "uavcapacity_additive",
                    "quirkTranslatedName": "UAV CAPACITY",
                    "quirkValues": [
                        {
                            "quirkValue": 1
                        }
                    ]
                }
            ]
        },
        "UAVRange": {
            "baseName": "UAVRange",
            "effects": [
                {
                    "quirkName": "uavrange_multiplier",
                    "quirkTranslatedName": "UAV RANGE",
                    "quirkValues": [
                        {
                            "quirkValue": 0.2
                        }
                    ]
                }
            ]
        },
        "UAVTime": {
            "baseName": "UAVTime",
            "effects": [
                {
                    "quirkName": "uavduration_additive",
                    "quirkTranslatedName": "UAV DURATION",
                    "quirkValues": [
                        {
                            "quirkValue": 10
                        }
                    ]
                }
            ]
        },
        "CoolantReserves": {
            "baseName": "CoolantReserves",
            "effects": [
                {
                    "quirkName": "coolshotcapacity_additive",
                    "quirkTranslatedName": "COOLSHOT CAPACITY",
                    "quirkValues": [
                        {
                            "quirkValue": 1
                        }
                    ]
                }
            ]
        },
        "EnhancedCoolshot": {
            "baseName": "EnhancedCoolshot",
            "effects": [
                {
                    "quirkName": "coolshotcooling_multiplier",
                    "quirkTranslatedName": "COOLSHOT COOLING",
                    "quirkValues": [
                        {
                            "quirkValue": 0.15
                        }
                    ]
                }
            ]
        },
        "CoolshotCooldown": {
            "baseName": "CoolshotCooldown",
            "effects": [
                {
                    "quirkName": "coolshotcooldown_multiplier",
                    "quirkTranslatedName": "COOLSHOT COOLDOWN",
                    "quirkValues": [
                        {
                            "quirkValue": -0.25
                        }
                    ]
                }
            ]
        },
        "ExpandedReserves": {
            "baseName": "ExpandedReserves",
            "effects": [
                {
                    "quirkName": "strategicstrikecapacity_additive",
                    "quirkTranslatedName": "STRIKE CAPACITY",
                    "quirkValues": [
                        {
                            "quirkValue": 1
                        }
                    ]
                }
            ]
        },
        "ExtendedBombardment": {
            "baseName": "ExtendedBombardment",
            "effects": [
                {
                    "quirkName": "strategicstrikenumshells_multiplier",
                    "quirkTranslatedName": "STRIKE SHELLS",
                    "quirkValues": [
                        {
                            "quirkValue": 0.15
                        }
                    ]
                },
                {
                    "quirkName": "strategicstrikeduration_multiplier",
                    "quirkTranslatedName": "STRIKE DURATION",
                    "quirkValues": [
                        {
                            "quirkValue": 0.15
                        }
                    ]
                }
            ]
        },
        "EnhancedSpotting": {
            "baseName": "EnhancedSpotting",
            "effects": [
                {
                    "quirkName": "strategicstrikespread_multiplier",
                    "quirkTranslatedName": "STRIKE SPREAD",
                    "quirkValues": [
                        {
                            "quirkValue": -0.2
                        }
                    ]
                }
            ]
        },
        "CaptureAssist": {
            "baseName": "CaptureAssist",
            "effects": [
                {
                    "quirkName": "captureaccelerator_multiplier",
                    "quirkTranslatedName": "CAPTURE ACCELERATION",
                    "quirkValues": [
                        {
                            "quirkValue": 0.05
                        }
                    ]
                }
            ]
        },
        "EnhancedECM": {
            "baseName": "EnhancedECM",
            "effects": [
                {
                    "quirkName": "ecmtargetrangereduction_multiplier",
                    "quirkTranslatedName": "ENHANCED ECM",
                    "quirkValues": [
                        {
                            "quirkValue": 0.225
                        }
                    ]
                },
                {
                    "quirkName": "stealtharmorcooldown_multiplier",
                    "quirkTranslatedName": "STEALTH ARMOR ACTIVATION",
                    "quirkValues": [
                        {
                            "quirkValue": -0.1
                        }
                    ]
                }
            ]
        }
    };
})(AddedData || (AddedData = {}));
//Reference: https://mwomercs.com/forums/topic/254199-lrm-spread-experiments/
//Non-ct damage are eyeball estimates
////////////////////////////////////////////////////////////////////////////////
var GlobalGameInfo;
//Reference: https://mwomercs.com/forums/topic/254199-lrm-spread-experiments/
//Non-ct damage are eyeball estimates
////////////////////////////////////////////////////////////////////////////////
(function (GlobalGameInfo) {
    //Seeker damage spread
    //each spread should have at least 2 entries for extrapolation
    //format is {<range> : {<component1>:<percentdmg1>, ...}, ...}
    //IS LRMS
    GlobalGameInfo._LRM5Spread = {
        190: { "centre_torso": 0.5343,
            "left_torso": 0.20, "right_torso": 0.20 },
        800: { "centre_torso": 0.4506,
            "left_torso": 0.15, "right_torso": 0.15,
            "left_leg": 0.05, "right_leg": 0.05 },
    };
    GlobalGameInfo._LRM10Spread = {
        190: { "centre_torso": 0.5666,
            "left_torso": 0.19, "right_torso": 0.19 },
        800: { "centre_torso": 0.4452,
            "left_torso": 0.15, "right_torso": 0.15,
            "left_leg": 0.05, "right_leg": 0.05 },
    };
    GlobalGameInfo._LRM15Spread = {
        190: { "centre_torso": 0.4021,
            "left_torso": 0.15, "right_torso": 0.15,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.05, "right_arm": 0.05, },
        800: { "centre_torso": 0.3561,
            "left_torso": 0.16, "right_torso": 0.16,
            "left_leg": 0.06, "right_leg": 0.06,
            "left_arm": 0.06, "right_arm": 0.06, },
    };
    GlobalGameInfo._LRM20Spread = {
        190: { "centre_torso": 0.425,
            "left_torso": 0.14, "right_torso": 0.14,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.05, "right_arm": 0.05, },
        800: { "centre_torso": 0.3339,
            "left_torso": 0.16, "right_torso": 0.16,
            "left_leg": 0.06, "right_leg": 0.06,
            "left_arm": 0.06, "right_arm": 0.06, },
    };
    GlobalGameInfo._ALRM5Spread = {
        190: { "centre_torso": 0.68,
            "left_torso": 0.15, "right_torso": 0.15 },
        800: { "centre_torso": 0.5753,
            "left_torso": 0.12, "right_torso": 0.12,
            "left_leg": 0.02, "right_leg": 0.02 },
    };
    GlobalGameInfo._ALRM10Spread = {
        190: { "centre_torso": 0.6678571429,
            "left_torso": 0.15, "right_torso": 0.15 },
        800: { "centre_torso": 0.584375,
            "left_torso": 0.12, "right_torso": 0.12,
            "left_leg": 0.02, "right_leg": 0.02 },
    };
    GlobalGameInfo._ALRM15Spread = {
        190: { "centre_torso": 0.5936507937,
            "left_torso": 0.18, "right_torso": 0.18,
        },
        800: { "centre_torso": 0.4452380952,
            "left_torso": 0.18, "right_torso": 0.18,
            "left_leg": 0.02, "right_leg": 0.02,
            "left_arm": 0.02, "right_arm": 0.02, },
    };
    GlobalGameInfo._ALRM20Spread = {
        190: { "centre_torso": 0.584375,
            "left_torso": 0.20, "right_torso": 0.20, },
        800: { "centre_torso": 0.4452380952,
            "left_torso": 0.19, "right_torso": 0.19,
            "left_leg": 0.02, "right_leg": 0.02, },
    };
    ////////////////////////////////////////////////////////////////////////////////
    //CLAN LRMS
    GlobalGameInfo._cLRM5Spread = {
        190: { "centre_torso": 0.6233333333,
            "left_torso": 0.16, "right_torso": 0.16 },
        800: { "centre_torso": 0.4675,
            "left_torso": 0.15, "right_torso": 0.15,
            "left_leg": 0.05, "right_leg": 0.05 },
    };
    GlobalGameInfo._cLRM10Spread = {
        190: { "centre_torso": 0.5342857143,
            "left_torso": 0.19, "right_torso": 0.19 },
        800: { "centre_torso": 0.4348837209,
            "left_torso": 0.15, "right_torso": 0.15,
            "left_leg": 0.05, "right_leg": 0.05 },
    };
    GlobalGameInfo._cLRM15Spread = {
        190: { "centre_torso": 0.4617283951,
            "left_torso": 0.15, "right_torso": 0.15,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.05, "right_arm": 0.05, },
        800: { "centre_torso": 0.3196581197,
            "left_torso": 0.16, "right_torso": 0.16,
            "left_leg": 0.06, "right_leg": 0.06,
            "left_arm": 0.06, "right_arm": 0.06, },
    };
    GlobalGameInfo._cLRM20Spread = {
        190: { "centre_torso": 0.4675,
            "left_torso": 0.14, "right_torso": 0.14,
            "left_leg": 0.04, "right_leg": 0.04,
            "left_arm": 0.04, "right_arm": 0.04, },
        800: { "centre_torso": 0.3596153846,
            "left_torso": 0.16, "right_torso": 0.16,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.05, "right_arm": 0.05, },
    };
    GlobalGameInfo._cALRM5Spread = {
        190: { "centre_torso": 0.7056603774,
            "left_torso": 0.13, "right_torso": 0.13 },
        800: { "centre_torso": 0.584375,
            "left_torso": 0.12, "right_torso": 0.12,
            "left_leg": 0.02, "right_leg": 0.02 },
    };
    GlobalGameInfo._cALRM10Spread = {
        190: { "centre_torso": 0.6448275862,
            "left_torso": 0.14, "right_torso": 0.14 },
        800: { "centre_torso": 0.5054054054,
            "left_torso": 0.14, "right_torso": 0.14,
            "left_leg": 0.03, "right_leg": 0.03 },
    };
    GlobalGameInfo._cALRM15Spread = {
        190: { "centre_torso": 0.5936507937,
            "left_torso": 0.19, "right_torso": 0.19,
        },
        800: { "centre_torso": 0.4298850575,
            "left_torso": 0.18, "right_torso": 0.18,
            "left_leg": 0.03, "right_leg": 0.03,
            "left_arm": 0.02, "right_arm": 0.02, },
    };
    GlobalGameInfo._cALRM20Spread = {
        190: { "centre_torso": 0.55,
            "left_torso": 0.21, "right_torso": 0.21, },
        800: { "centre_torso": 0.4065217391,
            "left_torso": 0.20, "right_torso": 0.20,
            "left_leg": 0.02, "right_leg": 0.02, },
    };
    //Streaks
    //Streak damage seems to be evenly distributed across the mech, as each missile
    //targets a random component. This holds true even at point blank range.
    GlobalGameInfo._StreakSpread = {
        0: { "centre_torso": 0.15, "left_torso": 0.15, "right_torso": 0.15,
            "left_arm": 0.14, "right_arm": 0.14, "left_leg": 0.135, "right_leg": 0.135 },
        270: { "centre_torso": 0.15, "left_torso": 0.15, "right_torso": 0.15,
            "left_arm": 0.14, "right_arm": 0.14, "left_leg": 0.135, "right_leg": 0.135 },
    };
    ////////////////////////////////////////////////////////////////////////////////
    //Direct fire damage spread
    //Format for direct fire weapons is
    //{<range> : {target: <percentDamage>, adjacent: <percentDamage>, nextAdjacent: <percentDamage>}}
    //SRM spread data
    //Reference: https://mwomercs.com/forums/topic/254250-srm-spread-experiments/
    //Adjacent, nextAdjacent values are eyeballed from damage distribution pictures
    GlobalGameInfo._SRM2Spread = {
        0: { target: 1.0, adjacent: 0, nextAdjacent: 0 },
        130: { target: 0.8697674419, adjacent: .1, nextAdjacent: 0 },
        260: { target: 0.8697674419, adjacent: .1, nextAdjacent: 0 },
    };
    GlobalGameInfo._SRM4Spread = {
        0: { target: 0.9453993933, adjacent: 0.05, nextAdjacent: 0 },
        130: { target: 0.6589147287, adjacent: .32, nextAdjacent: 0 },
        260: { target: 0.6212624585, adjacent: .35, nextAdjacent: 0 },
    };
    GlobalGameInfo._SRM6Spread = {
        0: { target: 0.9060077519, adjacent: 0.05, nextAdjacent: 0 },
        130: { target: 0.557543232, adjacent: .40, nextAdjacent: 0.03 },
        260: { target: 0.557543232, adjacent: .40, nextAdjacent: 0.03 },
    };
    GlobalGameInfo._ASRM2Spread = {
        0: { target: 1.0, adjacent: 0.0, nextAdjacent: 0.0 },
        130: { target: 0.9252845126, adjacent: .05, nextAdjacent: 0.00 },
        260: { target: 0.9252845126, adjacent: .05, nextAdjacent: 0.00 },
    };
    GlobalGameInfo._ASRM4Spread = {
        0: { target: 0.988372093, adjacent: 0.01, nextAdjacent: 0.0 },
        130: { target: 0.7497995188, adjacent: .22, nextAdjacent: 0.0 },
        260: { target: 0.7248062016, adjacent: .23, nextAdjacent: 0.0 },
    };
    GlobalGameInfo._ASRM6Spread = {
        0: { target: 0.9664082687, adjacent: 0.03, nextAdjacent: 0.0 },
        130: { target: 0.6902916205, adjacent: .28, nextAdjacent: 0.0 },
        260: { target: 0.6589147287, adjacent: .32, nextAdjacent: 0.0 },
    };
    GlobalGameInfo._cSRM2Spread = {
        0: { target: 1.0, adjacent: 0, nextAdjacent: 0 },
        130: { target: 0.7663934426, adjacent: .20, nextAdjacent: 0 },
        260: { target: 0.7923728814, adjacent: .15, nextAdjacent: 0 },
    };
    GlobalGameInfo._cSRM4Spread = {
        0: { target: 0.9739583333, adjacent: 0.02, nextAdjacent: 0 },
        130: { target: 0.584375, adjacent: .40, nextAdjacent: 0 },
        260: { target: 0.5993589744, adjacent: .35, nextAdjacent: 0 },
    };
    GlobalGameInfo._cSRM6Spread = {
        0: { target: 0.9166666667, adjacent: 0.07, nextAdjacent: 0 },
        130: { target: 0.5194444444, adjacent: .40, nextAdjacent: 0.03 },
        260: { target: 0.556547619, adjacent: .35, nextAdjacent: 0.02 },
    };
    GlobalGameInfo._cASRM2Spread = {
        0: { target: 1.0, adjacent: 0, nextAdjacent: 0 },
        130: { target: 0.8990384615, adjacent: .05, nextAdjacent: 0.0 },
        260: { target: 0.8990384615, adjacent: .05, nextAdjacent: 0.0 },
    };
    GlobalGameInfo._cASRM4Spread = {
        0: { target: 0.8348214286, adjacent: 0.12, nextAdjacent: 0 },
        130: { target: 0.73046875, adjacent: .32, nextAdjacent: 0.0 },
        260: { target: 0.6875, adjacent: .35, nextAdjacent: 0.0 },
    };
    GlobalGameInfo._cASRM6Spread = {
        0: { target: 0.9166666667, adjacent: 0.05, nextAdjacent: 0 },
        130: { target: 0.6233333333, adjacent: .34, nextAdjacent: 0.0 },
        260: { target: 0.6233333333, adjacent: .34, nextAdjacent: 0.0 },
    };
    //MRM Spread
    //Reference: https://docs.google.com/spreadsheets/d/1pLRKCXA-DT8sHFm0_cMV9bMofXXGTl785yxn3KdCb58/edit?usp=sharing
    GlobalGameInfo._MRM10Spread = {
        0: { target: 0.9166666667, adjacent: 0.05, nextAdjacent: 0.0 },
        100: { target: 0.5054054054, adjacent: .45, nextAdjacent: 0.0 },
        200: { target: 0.4921052632, adjacent: .45, nextAdjacent: 0.0 },
        400: { target: 0.4921052632, adjacent: .45, nextAdjacent: 0.0 },
    };
    GlobalGameInfo._MRM20Spread = {
        0: { target: 0.7791666667, adjacent: 0.20, nextAdjacent: 0.0 },
        100: { target: 0.4675, adjacent: .45, nextAdjacent: 0.05 },
        200: { target: 0.5194444444, adjacent: .45, nextAdjacent: 0.01 },
        400: { target: 0.4921052632, adjacent: .45, nextAdjacent: 0.01 },
    };
    GlobalGameInfo._MRM30Spread = {
        0: { target: 0.7791666667, adjacent: 0.20, nextAdjacent: 0.0 },
        100: { target: 0.5194444444, adjacent: .45, nextAdjacent: 0.0 },
        200: { target: 0.4794871795, adjacent: .40, nextAdjacent: 0.05 },
        400: { target: 0.4452380952, adjacent: .40, nextAdjacent: 0.05 },
    };
    GlobalGameInfo._MRM40Spread = {
        0: { target: 0.7791666667, adjacent: 0.20, nextAdjacent: 0.0 },
        100: { target: 0.5194444444, adjacent: .40, nextAdjacent: 0.05 },
        200: { target: 0.4675, adjacent: .40, nextAdjacent: 0.02 },
        400: { target: 0.425, adjacent: .40, nextAdjacent: 0.05 },
    };
    //ATM spread
    //Reference https://docs.google.com/spreadsheets/d/1Y_-o6KrMZlfPl8losy_USk8XmfS-kJXNvrWdKzDdy5g/edit?usp=sharing
    GlobalGameInfo._cATM3Spread = {
        130: { "centre_torso": 0.4947089947,
            "left_torso": 0.24, "right_torso": 0.24,
            "left_leg": 0.00, "right_leg": 0.00,
            "left_arm": 0.00, "right_arm": 0.00, },
        270: { "centre_torso": 0.4516908213,
            "left_torso": 0.20, "right_torso": 0.20,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
        450: { "centre_torso": 0.4869791667,
            "left_torso": 0.18, "right_torso": 0.18,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
        800: { "centre_torso": 0.4452380952,
            "left_torso": 0.16, "right_torso": 0.16,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
    };
    GlobalGameInfo._cATM6Spread = {
        130: { "centre_torso": 0.4947089947,
            "left_torso": 0.24, "right_torso": 0.24,
            "left_leg": 0.00, "right_leg": 0.00,
            "left_arm": 0.00, "right_arm": 0.00, },
        270: { "centre_torso": 0.4328703704,
            "left_torso": 0.20, "right_torso": 0.20,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
        450: { "centre_torso": 0.4452380952,
            "left_torso": 0.18, "right_torso": 0.18,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
        800: { "centre_torso": 0.4047619048,
            "left_torso": 0.16, "right_torso": 0.16,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
    };
    GlobalGameInfo._cATM9Spread = {
        130: { "centre_torso": 0.5327635328,
            "left_torso": 0.22, "right_torso": 0.22,
            "left_leg": 0.00, "right_leg": 0.00,
            "left_arm": 0.00, "right_arm": 0.00, },
        270: { "centre_torso": 0.3847736626,
            "left_torso": 0.22, "right_torso": 0.22,
            "left_leg": 0.07, "right_leg": 0.07,
            "left_arm": 0.00, "right_arm": 0.00, },
        450: { "centre_torso": 0.371031746,
            "left_torso": 0.21, "right_torso": 0.21,
            "left_leg": 0.06, "right_leg": 0.06,
            "left_arm": 0.00, "right_arm": 0.00, },
        800: { "centre_torso": 0.392033543,
            "left_torso": 0.16, "right_torso": 0.16,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
    };
    GlobalGameInfo._cATM12Spread = {
        130: { "centre_torso": 0.4722222222,
            "left_torso": 0.25, "right_torso": 0.25,
            "left_leg": 0.00, "right_leg": 0.00,
            "left_arm": 0.00, "right_arm": 0.00, },
        270: { "centre_torso": 0.4328703704,
            "left_torso": 0.22, "right_torso": 0.22,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
        450: { "centre_torso": 0.4328703704,
            "left_torso": 0.21, "right_torso": 0.21,
            "left_leg": 0.04, "right_leg": 0.04,
            "left_arm": 0.00, "right_arm": 0.00, },
        800: { "centre_torso": 0.4328703704,
            "left_torso": 0.18, "right_torso": 0.18,
            "left_leg": 0.05, "right_leg": 0.05,
            "left_arm": 0.00, "right_arm": 0.00, },
    };
})(GlobalGameInfo || (GlobalGameInfo = {}));
//NOTE: Common ts files must be put before all other files in the build order in
//tsconfig.json
var MechModelCommon;
//NOTE: Common ts files must be put before all other files in the build order in
//tsconfig.json
(function (MechModelCommon) {
    //TODO: See if you can get a tighter type for enums. Try aliasing.
    //Also check when string enums get put into Typescript
    MechModelCommon.Team = {
        BLUE: "blue",
        RED: "red"
    };
    MechModelCommon.Component = {
        HEAD: "head",
        RIGHT_ARM: "right_arm",
        RIGHT_TORSO: "right_torso",
        CENTRE_TORSO: "centre_torso",
        LEFT_ARM: "left_arm",
        LEFT_TORSO: "left_torso",
        RIGHT_LEG: "right_leg",
        LEFT_LEG: "left_leg",
        LEFT_TORSO_REAR: "left_torso_rear",
        CENTRE_TORSO_REAR: "centre_torso_rear",
        RIGHT_TORSO_REAR: "right_torso_rear"
    };
    MechModelCommon.isRearComponent = function (component) {
        return component === MechModelCommon.Component.LEFT_TORSO_REAR ||
            component === MechModelCommon.Component.CENTRE_TORSO_REAR ||
            component === MechModelCommon.Component.RIGHT_TORSO_REAR;
    };
    MechModelCommon.WeaponCycle = {
        READY: "Ready",
        FIRING: "Firing",
        DISABLED: "Disabled",
        COOLDOWN: "Cooldown",
        COOLDOWN_FIRING: "CooldownFiring",
        SPOOLING: "Spooling",
        JAMMED: "Jammed",
    };
    MechModelCommon.Faction = {
        INNER_SPHERE: "InnerSphere",
        CLAN: "Clan"
    };
    MechModelCommon.UpdateType = {
        FULL: "full",
        HEALTH: "health",
        HEAT: "heat",
        COOLDOWN: "cooldown",
        WEAPONSTATE: "weaponstate",
        STATS: "stats"
    };
    MechModelCommon.EngineType = {
        STD: "std",
        XL: "xl",
        CLAN_XL: "clan_xl",
        LIGHT: "light",
    };
    //TODO: See if you can decentralize EventType so the definitions of events 
    //can be put at their source without causing too many dependencies
    MechModelCommon.EventType = {
        MECH_UPDATE: "MechUpdate",
        SIMTIME_UPDATE: "SimTimeUpdate",
        TEAMSTATS_UPDATE: "TeamStatsUpdate",
        TEAMVICTORY_UPDATE: "TeamVictoryUpdate",
        START: "Start",
        PAUSE: "Pause",
        APP_STATE_CHANGE: "AppStateChange",
        APP_STATE_SAVED: "AppStateSaved",
        APP_STATE_LOADED: "AppStateLoaded",
        APP_STATE_LOAD_ERROR: "AppStateLoadError",
    };
    MechModelCommon.BURST_DAMAGE_INTERVAL = 2000; //Interval considered for burst damage calculation
})(MechModelCommon || (MechModelCommon = {}));
var SimulatorSettings;
(function (SimulatorSettings) {
    var simulatorParameters;
    //interval between UI updates. Set smaller than step duration to run the
    // simulation faster, but not too small as to lock the browser
    const DEFAULT_UI_UPDATE_INTERVAL = 50;
    //Parameters of the simulation. Includes range
    class SimulatorParameters {
        constructor(range, speedFactor = 1, uacJamMethod = SimulatorSettings.UACJamMethod.RANDOM, useDoubleTap = true) {
            this.range = range;
            this.speedFactor = speedFactor;
            this.uacJAMMethod = uacJamMethod;
            this.useDoubleTap = useDoubleTap;
        }
        get uiUpdateInterval() {
            return Math.floor(DEFAULT_UI_UPDATE_INTERVAL / Number(this.speedFactor));
        }
        setSpeedFactor(speedFactor) {
            this.speedFactor = speedFactor;
        }
        clone() {
            return new SimulatorParameters(this.range, this.speedFactor, this.uacJAMMethod, this.useDoubleTap);
        }
        //returns setting values and descriptions for the UI
        static getUserSettings() {
            return [
                SimulatorSettings.UAC_DOUBLE_TAP_SETTING,
                SimulatorSettings.UAC_JAM_SETTING
            ];
        }
    }
    SimulatorSettings.SimulatorParameters = SimulatorParameters;
    //NOTE: This should only be called by MechSimulatorLogic.setSimulatorParameters,
    //but since I can't selectively export to particular namespaces, it's exposed to all
    SimulatorSettings.setSimulatorParameters = function (parameters) {
        simulatorParameters = parameters;
    };
    SimulatorSettings.getSimulatorParameters = function () {
        return simulatorParameters.clone();
    };
})(SimulatorSettings || (SimulatorSettings = {}));
var Events;
(function (Events) {
    class ListenerEntry {
        constructor(listener, types) {
            this.listener = listener;
            this.eventTypes = new Set(types);
        }
        isListening(type) {
            return this.eventTypes.has(type);
        }
        getListener() {
            return this.listener;
        }
        getEventTypes() {
            return this.eventTypes;
        }
        addEventTypes(types) {
            for (let type of types) {
                this.eventTypes.add(type);
            }
        }
    }
    class EventQueue {
        constructor() {
            this.queue = [];
            this.stepScheduled = false;
            this.executionDeferred = false;
            this.listeners = new Map();
            this.listenerMap = new Map();
        }
        getListeners(event) {
            let ret = this.listeners.get(event);
            if (!ret) {
                ret = new Set();
                this.listeners.set(event, ret);
            }
            return ret;
        }
        addListener(listener, ...eventTypes) {
            let listenerEntry = this.listenerMap.get(listener);
            if (!listenerEntry) {
                listenerEntry = new ListenerEntry(listener, eventTypes);
                this.listenerMap.set(listener, listenerEntry);
            }
            listenerEntry.addEventTypes(eventTypes);
            for (let type of listenerEntry.getEventTypes()) {
                let listenerSet = this.getListeners(type);
                listenerSet.add(listenerEntry.getListener());
            }
        }
        //if no event types given, will unregister listener to all events
        removeListener(listener, ...eventTypes) {
            let listenerEntry = this.listenerMap.get(listener);
            if (!listenerEntry) {
                throw Error("Listener not registered");
            }
            let eventTypesToRemove;
            if (!eventTypes || eventTypes.length === 0) {
                eventTypesToRemove = listenerEntry.getEventTypes();
            }
            else {
                eventTypesToRemove = eventTypes;
            }
            for (let eventType of eventTypesToRemove) {
                let listenerSet = this.listeners.get(eventType);
                listenerSet.delete(listener);
                //NOTE: delete semantics on javascript iterators allow 'concurrent' modification 
                //(it actually just puts an empty element in the deleted position)
                listenerEntry.getEventTypes().delete(eventType);
            }
            //all entries removed
            if (listenerEntry.getEventTypes().size === 0) {
                this.listenerMap.delete(listener);
            }
        }
        debugString() {
            let logger = new Util.StringLogger();
            logger.log("Listeners");
            for (let listener of this.listenerMap.keys()) {
                let logStr = listener.name;
                logStr += " [";
                let listenerEntry = this.listenerMap.get(listener);
                listenerEntry.getEventTypes().forEach((type) => {
                    logStr += type + " ";
                });
                logStr += "]";
                logger.log(logStr);
            }
            logger.log("Event->Listener map");
            for (let eventType of this.listeners.keys()) {
                let logStr = eventType;
                logStr += " [";
                for (let listener of this.listeners.get(eventType)) {
                    logStr += listener.name + " ";
                }
                logStr += "]";
                logger.log(logStr);
            }
            return logger.getLog();
        }
        queueEvent(event) {
            this.queue.push(event);
            if (this.executionDeferred) {
                return;
            }
            if (!this.stepScheduled) {
                this.stepScheduled = true;
                setTimeout(this.step.bind(this), 0);
            }
        }
        //When called, all events queued are not executed until executeAllQueued is called.
        //Used when you want to execute a set of events all at once (e.g. a large set of dom updates)
        deferExecution() {
            this.executionDeferred = true;
        }
        executeAllQueued() {
            while (this.queue.length > 0) {
                let currEvent = this.queue.shift();
                this.executeEvent(currEvent);
            }
            this.executionDeferred = false;
            this.stepScheduled = false;
        }
        step() {
            if (this.queue.length === 0) {
                Util.warn("Step executed on empty queue");
                return;
            }
            let currEvent = this.queue.shift();
            this.executeEvent(currEvent);
            this.stepScheduled = false;
            if (this.queue.length > 0 && !this.executionDeferred) {
                this.stepScheduled = true;
                setTimeout(this.step.bind(this), 0);
            }
        }
        executeEvent(event) {
            let listeners = this.listeners.get(event.type);
            if (!listeners) {
                Util.warn(`No listener for event ${event.type}`);
                return;
            }
            for (let listener of listeners) {
                listener(event);
            }
        }
    }
    Events.EventQueue = EventQueue;
})(Events || (Events = {}));
var Util;
(function (Util) {
    //returns index of matching entry, otherwise returns the closest lower entry in
    //the array
    //TODO: See if this method is still worth it
    function binarySearchClosest(array, key, keyCompare) {
        var low = 0;
        var high = array.length - 1;
        var mid = Math.floor(low + ((high - low) / 2));
        var midVal = array[mid];
        while (low <= high) {
            mid = Math.floor(low + ((high - low) / 2));
            midVal = array[mid];
            if (keyCompare(key, midVal) < 0) {
                high = mid - 1;
            }
            else if (keyCompare(key, midVal) > 0) {
                low = mid + 1;
            }
            else {
                return mid;
            }
        }
        if (keyCompare(key, midVal) < 0) {
            return Math.max(0, mid - 1);
        }
        else {
            return mid;
        }
    }
    Util.binarySearchClosest = binarySearchClosest;
    class StringLogger {
        constructor() {
            this.logStr = "";
        }
        log(msg) {
            this.logStr += `${msg}\n`;
        }
        warn(msg) {
            let err = Error(msg);
            this.logStr += `${msg}: ${err.stack}\n`;
        }
        error(msg) {
            let err = Error(msg);
            this.logStr += `${msg}: ${err.stack}\n`;
        }
        clear() {
            this.logStr = "";
        }
        getLog() {
            return this.logStr;
        }
    }
    Util.StringLogger = StringLogger;
    Util.getParamFromLocationHash = function (param) {
        let fragmentHash = location.hash;
        if (fragmentHash.startsWith("#")) {
            fragmentHash = fragmentHash.substring(1);
        }
        fragmentHash = "&" + fragmentHash;
        let regex = new RegExp(".*&" + param + "=([^&]*).*");
        let results = regex.exec(fragmentHash);
        if (results) {
            return results[1];
        }
        else {
            return null;
        }
    };
    let DEFAULT_DEBUG = true;
    var isDebug = function () {
        let debug = Util.getParamFromLocationHash("debug");
        if (debug) {
            return debug === 'true';
        }
        else {
            return DEFAULT_DEBUG;
        }
    };
    Util.log = function (msg, ...optionalParams) {
        if (isDebug()) {
            console.log(msg, ...optionalParams);
        }
    };
    Util.warn = function (msg, ...optionalParams) {
        if (isDebug()) {
            console.warn(msg, ...optionalParams);
        }
    };
    Util.error = function (msg, ...optionalParams) {
        if (isDebug()) {
            console.error(msg, ...optionalParams);
        }
    };
})(Util || (Util = {}));
//Widget design policy: No logic in HTML, no layout in Javascript.
//Javascript only provides behavior, it does NOT generate HTML unless it's from a template.
//On the converse side, HTML should not contain direct references to javascript entities
//(e.g. class constructors, methods). Makes it possible to do cosmetic and layout
//changes purely in HTML and CSS, and you keep out ugly unmaintainable HTML
//text strings out of javascript.
var Widgets;
//Widget design policy: No logic in HTML, no layout in Javascript.
//Javascript only provides behavior, it does NOT generate HTML unless it's from a template.
//On the converse side, HTML should not contain direct references to javascript entities
//(e.g. class constructors, methods). Makes it possible to do cosmetic and layout
//changes purely in HTML and CSS, and you keep out ugly unmaintainable HTML
//text strings out of javascript.
(function (Widgets) {
    //Widgets that are stored in the dom using StoreValue.storeToElement
    //Would be better as a mixin, but initializing mixin classes is still syntactically messy,
    //so keep it a superclass
    class DomStoredWidget {
        constructor(domElement) {
            this.domElement = domElement;
            //NOTE: forcing storage in the constructor means that the DomKey must be passed 
            //through the entire chain of constructors in descendant classes. I've changed
            //the contract so that the descendant classes explicitly call storeToElement if
            //they want to be stored in the DOM. DomStoredWidget then just becomes a marker
            //'interface' to classes that may have at least one of their parents stored to dom.
            //This will also allow multiple Symbol property assignments to the element, one for each
            //class that wants to be stored in the DOM
        }
        //This method should be called by child constructors after the super call if they want to store
        //a reference to themselves in the domElement.
        storeToDom(DomKey) {
            DomStorage.storeToElement(this.domElement, DomKey, this);
            //marker attribute to make it visible in the element tree that there's an
            //object stored in the Element
            //NOTE: browsers automatically lowercase attribute names (at least chrome does)
            //We explicitly lowercase DomKey here to make that obvious so we don't try to
            //unset the attribute with a non-lowercase name
            this.domElement.setAttribute("data-symbol-" + DomKey.toLowerCase(), this.toString());
        }
        static fromDom(domElement, DomKey) {
            let ret = DomStorage.getFromElement(domElement, DomKey);
            return ret; //NOTE: Would be better with an instanceof check, but since T isn't really a value can't do that here
        }
    }
    Widgets.DomStoredWidget = DomStoredWidget;
    class Button extends DomStoredWidget {
        constructor(domElement, clickHandler) {
            super(domElement);
            this.storeToDom(Button.ButtonDomKey);
            this.clickHandler = (function (context) {
                var clickContext = context;
                return function (event) {
                    if (clickContext.enabled) {
                        if (clickHandler) {
                            clickHandler.call(event.currentTarget);
                        }
                    }
                };
            })(this);
            this.enabled = true;
            $(this.domElement).click(this.clickHandler);
        }
        setHtml(html) {
            $(this.domElement).html(html);
        }
        addClass(className) {
            $(this.domElement).addClass(className);
        }
        removeClass(className) {
            $(this.domElement).removeClass(className);
        }
        disable() {
            if (this.enabled) {
                $(this.domElement).addClass("disabled");
                this.enabled = false;
            }
        }
        enable() {
            if (!this.enabled) {
                $(this.domElement).removeClass("disabled");
                this.enabled = true;
            }
        }
    }
    //NOTE: Can't use the same variable name for static objects in descendants because the child
    //fields will clobber the parent's field. 
    Button.ButtonDomKey = "mwosim.Button.uiObject";
    Widgets.Button = Button;
    //helper function for enabling/disabling sets of buttons
    Widgets.setButtonListEnabled = function (buttonDivs, enabled) {
        for (let buttonDiv of buttonDivs) {
            let button = Button.fromDom(buttonDiv, Button.ButtonDomKey);
            if (enabled) {
                button.enable();
            }
            else {
                button.disable();
            }
        }
    };
    class ExpandButton extends Button {
        constructor(domElement, clickHandler, ...elementsToExpand) {
            super(domElement, clickHandler);
            this.storeToDom(ExpandButton.ExpandButtonDomKey);
            if (elementsToExpand) {
                this.elementsToExpand = elementsToExpand;
            }
            else {
                this.elementsToExpand = [];
            }
            $(domElement).click(() => {
                if (!this.enabled) {
                    return;
                }
                if (!this.expanded) {
                    this.domElement.classList.add("expanded");
                    for (let elementToExpand of this.elementsToExpand) {
                        elementToExpand.classList.add("expanded");
                    }
                }
                else {
                    this.domElement.classList.remove("expanded");
                    for (let elementToExpand of this.elementsToExpand) {
                        elementToExpand.classList.remove("expanded");
                    }
                }
            });
        }
        get expanded() {
            return this.domElement.classList.contains("expanded");
        }
    }
    ExpandButton.ExpandButtonDomKey = "mwosim.ExpandButton.uiObject";
    Widgets.ExpandButton = ExpandButton;
    class Tooltip extends DomStoredWidget {
        constructor(templateId, tooltipId, targetElement) {
            let domElement = Widgets.cloneTemplate(templateId);
            super(domElement);
            this.storeToDom(Tooltip.TooltipDomKey);
            this.id = tooltipId;
            $(this.domElement)
                .addClass("tooltip")
                .addClass("hidden")
                .attr("id", tooltipId)
                .insertBefore(targetElement);
        }
        showTooltip() {
            $("#" + this.id).removeClass("hidden");
        }
        hideTooltip() {
            $("#" + this.id).addClass("hidden");
        }
    }
    Tooltip.TooltipDomKey = "mwosim.Tooltip.uiObject";
    Widgets.Tooltip = Tooltip;
    class TabPanel extends DomStoredWidget {
        //TODO: Try to see if it is possible to specify the layout of tab panels
        //completely in HTML without code generation
        constructor(tabList) {
            let domElement = Widgets.cloneTemplate("tabpanel-template");
            super(domElement);
            this.storeToDom(TabPanel.TabPanelDomKey);
            this.tabList = tabList;
            if (tabList.length > 0) {
                this.selectedTab = this.tabList[0];
            }
        }
        render() {
            for (let tab of this.tabList) {
                this.renderTab(tab);
            }
        }
        renderTab(tab) {
            let tabTitlesJQ = $(this.domElement).find(".tabTitleContainer");
            let tabContentsJQ = $(this.domElement).find(".tabContentContainer");
            tab.tabTitle.render();
            tab.tabTitle.domElement.classList.add("tabTitle");
            tabTitlesJQ.append(tab.tabTitle.domElement);
            tab.tabContent.render();
            tab.tabContent.domElement.classList.add("tabContent");
            if (this.selectedTab === tab) {
                this.setSelected(tab, false);
            }
            else {
                this.unsetSelected(tab);
            }
            $(tab.tabTitle.domElement).click(() => {
                this.setSelected(tab);
            });
            tabContentsJQ.append(tab.tabContent.domElement);
        }
        setSelected(tab, deselectOthers = true) {
            this.selectedTab = tab;
            tab.tabTitle.domElement.classList.add("selected");
            tab.tabContent.domElement.classList.remove("hidden");
            if (deselectOthers) {
                for (let currTab of this.tabList) {
                    if (currTab !== tab) {
                        this.unsetSelected(currTab);
                    }
                }
            }
        }
        unsetSelected(tab) {
            tab.tabTitle.domElement.classList.remove("selected");
            tab.tabContent.domElement.classList.add("hidden");
        }
    }
    TabPanel.TabPanelDomKey = "mwosim.TabPanel.uiObject";
    Widgets.TabPanel = TabPanel;
    class SimpleWidget extends DomStoredWidget {
        constructor(templateId) {
            let domElement = Widgets.cloneTemplate(templateId);
            super(domElement);
            this.storeToDom(SimpleWidget.SimpleWidgetDomKey);
        }
        render() {
            //do nothing
        }
    }
    SimpleWidget.SimpleWidgetDomKey = "mwosim.SimpleWidget.uiObject";
    Widgets.SimpleWidget = SimpleWidget;
    class LoadFromURLDialog extends Widgets.DomStoredWidget {
        constructor(loadDialogTemplate, dialogId) {
            let loadDialogDiv = Widgets.cloneTemplate(loadDialogTemplate);
            super(loadDialogDiv);
            this.storeToDom(LoadFromURLDialog.DomKey);
            this.dialogId = dialogId;
            let thisJQ = $(loadDialogDiv)
                .attr("id", dialogId);
            let resultPanelJQ = thisJQ.find(".resultPanel");
            resultPanelJQ
                .removeClass("error")
                .empty()
                .on("animationend", function (data) {
                resultPanelJQ.removeClass("error");
                resultPanelJQ.off("animationend");
            });
            let okButtonHandler = this.createOkButtonHandler(this);
            let cancelButtonHandler = this.createCancelButtonHandler(this);
            let loadButtonHandler = this.createLoadButtonHandler(this);
            let okButtonJQ = thisJQ.find(".okButton");
            this.okButton =
                new Widgets.Button(okButtonJQ.get(0), okButtonHandler);
            let cancelButtonJQ = thisJQ.find(".cancelButton");
            this.cancelButton =
                new Widgets.Button(cancelButtonJQ.get(0), cancelButtonHandler);
            let loadButtonJQ = thisJQ.find(".loadButton");
            this.loadButton =
                new Widgets.Button(loadButtonJQ.get(0), loadButtonHandler);
            this.okButton.disable();
        }
        getTextInput() {
            return $(this.domElement).find(".textInput").get(0);
        }
        getTextInputValue() {
            return $(this.domElement).find(".textInput").val();
        }
        getResultPanel() {
            return $(this.domElement).find(".resultPanel").get(0);
        }
        setLoading(loading) {
            if (loading) {
                this.loadButton.disable();
                this.loadButton.addClass("loading");
                this.loadButton.setHtml("Loading...");
            }
            else {
                this.loadButton.enable();
                this.loadButton.removeClass("loading");
                this.loadButton.setHtml("Load");
            }
        }
        setError(error) {
            $(this.getResultPanel())
                .addClass("error")
                .text(error);
            this.okButton.disable();
        }
        clearError() {
            $(this.getResultPanel())
                .removeClass("error");
        }
    }
    LoadFromURLDialog.DomKey = "mwosim.LoadFromURLDialog.uiObject";
    Widgets.LoadFromURLDialog = LoadFromURLDialog;
    //Clones a template and returns the first element of the template
    Widgets.cloneTemplate = function (templateName) {
        let template = document.querySelector("#" + templateName);
        let templateElement = document.importNode(template.content, true);
        return templateElement.firstElementChild;
    };
    const MODAL_SCREEN_ID = "modalScreen";
    const MODAL_DIALOG_ID = "modalDialog";
    //sets the content of the modal dialog to element, while optionally adding
    //a class to the dialog container
    Widgets.setModal = function (element, dialogClass = null) {
        let dialogJQ = $("#" + MODAL_DIALOG_ID);
        dialogJQ.empty();
        if (dialogClass) {
            dialogJQ.addClass(dialogClass);
        }
        dialogJQ.append(element);
    };
    Widgets.showModal = function () {
        $("#" + MODAL_SCREEN_ID).css("display", "block");
    };
    //hides the modal dialog, while optionally removing a class from the dialog
    //container
    Widgets.hideModal = function (dialogClass = null) {
        $("#" + MODAL_SCREEN_ID).css("display", "none");
        let dialogJQ = $("#" + MODAL_DIALOG_ID);
        dialogJQ.empty();
        if (dialogClass) {
            dialogJQ.removeClass(dialogClass);
        }
    };
})(Widgets || (Widgets = {}));
var MechSimulator;
(function (MechSimulator) {
    var SimulatorParameters = SimulatorSettings.SimulatorParameters;
    var EventType = MechModelCommon.EventType;
    const DEFAULT_RANGE = 200;
    const DEFAULT_SPEED = 1;
    function init() {
        MechView.init();
        MechView.showLoadingScreen();
        let simulatorParameters = new SimulatorParameters(DEFAULT_RANGE, DEFAULT_SPEED);
        MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
        MechModel.initModelData()
            .then(function () {
            Util.log("Successfully loaded model init data");
            //router should not be initialized before the smurfy data is
            //loaded since the hash change listener can start pulling in smurfy
            //loadout data
            MechViewRouter.initViewRouter();
            initMechs();
        })
            .catch(function () {
            Util.error("Failed to load model init data");
            MechView.hideLoadingScreen();
            MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_LOAD_ERROR });
        });
    }
    function initMechs() {
        MechViewRouter.loadStateFromLocationHash()
            .then(function (data) {
            initUI();
            return data;
        })
            .catch(function (err) {
            Util.error("Error loading mech data: " + err);
            MechModelView.refreshView();
            MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_LOAD_ERROR });
            location.hash = "";
        })
            .then(function (data) {
            MechView.hideLoadingScreen();
        });
    }
    function initUI() {
        MechModelView.refreshView();
    }
    function main() {
        init();
    }
    MechSimulator.main = main;
})(MechSimulator || (MechSimulator = {}));
var MechAccuracyPattern;
(function (MechAccuracyPattern) {
    var Component = MechModelCommon.Component;
    //Functions that determine how damage from a weapon is spread
    //type is function(MechModel.WeaponDamage, range) -> MechModel.WeaponDamage
    MechAccuracyPattern.fullAccuracyPattern = function (weaponDamage, range) {
        //Does not spread the damage
        return weaponDamage;
    };
    //Spreads the damage to adjacent components and those two components over,
    //with the given percentages percentOnTarget, percentOnAdjacent,
    //percentOnNextToAdjacent between 0 and 1,
    //and their total must be less than one
    //Any left over is considered a miss
    MechAccuracyPattern.accuracySpreadToAdjacent = function (percentOnTarget, percentOnAdjacent, percentOnNextToAdjacent) {
        if (percentOnTarget + percentOnAdjacent + percentOnNextToAdjacent > 1) {
            Util.warn("Total damage percentage exceeds 1");
        }
        return function (weaponDamage, range) {
            let transformedDamage = new MechModel.WeaponDamage({});
            for (let component in weaponDamage.damageMap) {
                if (!weaponDamage.damageMap.hasOwnProperty(component)) {
                    continue;
                }
                let newComponentDamage = Number(weaponDamage.damageMap[component]) *
                    Number(percentOnTarget);
                let totalAdjacentDamage = Number(weaponDamage.damageMap[component]) *
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
                    currentDamage = transformedDamage.damageMap[adjacentComponent];
                    transformedDamage.damageMap[adjacentComponent] = currentDamage ?
                        currentDamage + perAdjacentComponentDamage
                        : perAdjacentComponentDamage;
                }
                let totalNextToAdjacentDamage = Number(weaponDamage.damageMap[component]) *
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
                    currentDamage = transformedDamage.damageMap[nextComponent];
                    transformedDamage.damageMap[nextComponent] = currentDamage ?
                        currentDamage + perNextAdjacentComponentDamage
                        : perNextAdjacentComponentDamage;
                }
            }
            return transformedDamage;
        };
    };
    //Weapon specific accuracy patterns
    //MUST be applied as the first transform on the raw weapon damage (even before mech accuracy)
    var weaponAccuracyMap;
    MechAccuracyPattern.getWeaponAccuracyPattern = function (weaponInfo) {
        weaponAccuracyMap = weaponAccuracyMap ||
            { "ClanERPPC": MechAccuracyPattern.splashPPCPattern("ClanERPPC"),
                "HeavyPPC": MechAccuracyPattern.splashPPCPattern("HeavyPPC"),
                "LRM5": MechAccuracyPattern.seekerPattern(GlobalGameInfo._LRM5Spread),
                "LRM10": MechAccuracyPattern.seekerPattern(GlobalGameInfo._LRM10Spread),
                "LRM15": MechAccuracyPattern.seekerPattern(GlobalGameInfo._LRM15Spread),
                "LRM20": MechAccuracyPattern.seekerPattern(GlobalGameInfo._LRM20Spread),
                "LRM5_Artemis": MechAccuracyPattern.seekerPattern(GlobalGameInfo._ALRM5Spread),
                "LRM10_Artemis": MechAccuracyPattern.seekerPattern(GlobalGameInfo._ALRM10Spread),
                "LRM15_Artemis": MechAccuracyPattern.seekerPattern(GlobalGameInfo._ALRM15Spread),
                "LRM20_Artemis": MechAccuracyPattern.seekerPattern(GlobalGameInfo._ALRM20Spread),
                "ClanLRM5": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cLRM5Spread),
                "ClanLRM10": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cLRM10Spread),
                "ClanLRM15": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cLRM15Spread),
                "ClanLRM20": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cLRM20Spread),
                "ClanLRM5_Artemis": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cALRM5Spread),
                "ClanLRM10_Artemis": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cALRM10Spread),
                "ClanLRM15_Artemis": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cALRM15Spread),
                "ClanLRM20_Artemis": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cALRM20Spread),
                "SRM2": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._SRM2Spread),
                "SRM4": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._SRM4Spread),
                "SRM6": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._SRM6Spread),
                "SRM2_Artemis": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._ASRM2Spread),
                "SRM4_Artemis": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._ASRM4Spread),
                "SRM6_Artemis": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._ASRM6Spread),
                "ClanSRM2": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._cSRM2Spread),
                "ClanSRM4": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._cSRM4Spread),
                "ClanSRM6": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._cSRM6Spread),
                "ClanSRM2_Artemis": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._cASRM2Spread),
                "ClanSRM4_Artemis": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._cASRM4Spread),
                "ClanSRM6_Artemis": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._cASRM6Spread),
                "StreakSRM2": MechAccuracyPattern.seekerPattern(GlobalGameInfo._StreakSpread),
                "ClanStreakSRM2": MechAccuracyPattern.seekerPattern(GlobalGameInfo._StreakSpread),
                "ClanStreakSRM4": MechAccuracyPattern.seekerPattern(GlobalGameInfo._StreakSpread),
                "ClanStreakSRM6": MechAccuracyPattern.seekerPattern(GlobalGameInfo._StreakSpread),
                "MRM10": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._MRM10Spread),
                "MRM20": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._MRM20Spread),
                "MRM30": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._MRM30Spread),
                "MRM40": MechAccuracyPattern.directFireSpreadPattern(GlobalGameInfo._MRM40Spread),
                "ClanATM3": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cATM3Spread),
                "ClanATM6": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cATM6Spread),
                "ClanATM9": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cATM9Spread),
                "ClanATM12": MechAccuracyPattern.seekerPattern(GlobalGameInfo._cATM12Spread),
            };
        return weaponAccuracyMap[weaponInfo.name];
    };
    //cERPPC splash
    MechAccuracyPattern.splashPPCPattern = function (ppcName) {
        return function (weaponDamage, range) {
            //assumes weaponDamage only has one entry (the targeted component) and adds
            //the appropriate amount of splash damage
            let baseERPPCDamage = Number(MechModel.getSmurfyWeaponDataByName(ppcName).calc_stats.baseDmg);
            let totalBaseSplashDamage = Number(MechModel.getSmurfyWeaponDataByName(ppcName).calc_stats.dmg)
                - baseERPPCDamage;
            let baseRangeDamage;
            let targetLocation;
            for (targetLocation in weaponDamage.damageMap) {
                if (!weaponDamage.damageMap.hasOwnProperty(targetLocation)) {
                    continue;
                }
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
        };
    };
    //seeking missile spread
    class SeekerSpread {
        constructor(range, spread) {
            this.range = Number(range);
            this.spread = {};
            for (let component in Component) {
                if (!Component.hasOwnProperty(component)) {
                    continue;
                }
                let componentVal = Component[component];
                if (Component.hasOwnProperty(component)) {
                    let percentDamage = spread[componentVal] ? Number(spread[componentVal]) : 0;
                    if (percentDamage) {
                        this.spread[componentVal] = percentDamage;
                    }
                    else {
                        this.spread[componentVal] = 0;
                    }
                }
            }
        }
        toString() {
            let ret = "range : " + this.range;
            for (let component in this.spread) {
                if (!this.spread.hasOwnProperty(component)) {
                    continue;
                }
                ret += " " + component + ":" + this.spread[component];
            }
        }
    }
    var findSpreadBaseIdx = function (spreadList, range) {
        let baseIdx = 0;
        for (baseIdx = spreadList.length - 1; baseIdx > 0; baseIdx--) {
            if (Number(spreadList[baseIdx].range) < Number(range)) {
                break;
            }
        }
        if (baseIdx >= spreadList.length - 1) {
            baseIdx = spreadList.length - 2;
        }
        return baseIdx;
    };
    MechAccuracyPattern.seekerPattern = function (seekerSpreadData) {
        let seekerSpreadList = [];
        for (let range in seekerSpreadData) {
            if (!seekerSpreadData.hasOwnProperty(range)) {
                continue;
            }
            seekerSpreadList.push(new SeekerSpread(Number(range), seekerSpreadData[range]));
        }
        seekerSpreadList.sort((entry1, entry2) => {
            return Number(entry1.range) - Number(entry2.range);
        });
        return function (weaponDamage, range) {
            range = Number(range);
            let baseIdx = findSpreadBaseIdx(seekerSpreadList, range);
            let nextIdx = baseIdx + 1;
            let baseEntry = seekerSpreadList[baseIdx];
            let nextEntry = seekerSpreadList[nextIdx];
            let rangeDiff = range - baseEntry.range;
            let computedSpread = {};
            for (let component in Component) {
                if (!Component.hasOwnProperty(component)) {
                    continue;
                }
                let componentVal = Component[component];
                if (Component.hasOwnProperty(component)) {
                    let slope = (Number(nextEntry.spread[componentVal]) - Number(baseEntry.spread[componentVal])) /
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
                if (!computedSeekerSpread.spread.hasOwnProperty(component)) {
                    continue;
                }
                totalPercent += computedSeekerSpread.spread[component];
            }
            if (totalPercent > 1) {
                Util.warn("Seeker percentages over 100%:" + computedSeekerSpread.toString());
            }
            let totalDamage = weaponDamage.getTotalDamage();
            //transform totalDamage
            let transformedDamage = weaponDamage.clone();
            for (let component in computedSeekerSpread.spread) {
                if (!computedSeekerSpread.spread.hasOwnProperty(component)) {
                    continue;
                }
                transformedDamage.damageMap[component] =
                    totalDamage * computedSeekerSpread.spread[component];
            }
            return transformedDamage;
        };
    };
    class DirectFireSpread {
        constructor(range, spread) {
            this.range = Number(range);
            this.spread = spread;
        }
    }
    MechAccuracyPattern.directFireSpreadPattern = function (spreadData) {
        let spreadList = [];
        for (let spreadRange in spreadData) {
            if (!spreadData.hasOwnProperty(spreadRange)) {
                continue;
            }
            let directFireSpread = new DirectFireSpread(Number(spreadRange), spreadData[spreadRange]);
            spreadList.push(directFireSpread);
        }
        spreadList.sort((entry1, entry2) => {
            return entry1.range - entry2.range;
        });
        return function (weaponDamage, range) {
            range = Number(range);
            let baseIdx = findSpreadBaseIdx(spreadList, range);
            let nextIdx = baseIdx + 1;
            let baseRange = Number(spreadList[baseIdx].range);
            let nextRange = Number(spreadList[nextIdx].range);
            let computedSpread = {};
            for (let field in spreadList[baseIdx].spread) {
                if (!spreadList[baseIdx].spread.hasOwnProperty(field)) {
                    continue;
                }
                let basePercent = spreadList[baseIdx].spread[field];
                let nextPercent = spreadList[nextIdx].spread[field];
                let slope = (Number(nextPercent) - Number(basePercent)) / (nextRange - baseRange);
                let computedPercent = basePercent + slope * (range - baseRange);
                computedSpread[field] = computedPercent;
            }
            //sanity check on computed spread
            let totalPercent = 0;
            for (let field in computedSpread) {
                if (!computedSpread.hasOwnProperty(field)) {
                    continue;
                }
                totalPercent += Number(computedSpread[field]);
            }
            if (totalPercent > 1) {
                Util.warn("Direct fire percentages greater than 1: " + totalPercent);
            }
            return MechAccuracyPattern.accuracySpreadToAdjacent(computedSpread.target, computedSpread.adjacent, computedSpread.nextAdjacent)(weaponDamage, range);
        };
    };
    MechAccuracyPattern.getDefault = function () {
        for (let patternEntry of MechAccuracyPattern.getPatterns()) {
            if (patternEntry.default) {
                return patternEntry.pattern;
            }
        }
    };
    //Returns a list of accuracy patterns for the UI
    MechAccuracyPattern.getPatterns = function () {
        let patternList = [
            {
                id: "accuracyPerfect",
                name: "Perfect accuracy",
                pattern: MechAccuracyPattern.accuracySpreadToAdjacent(1.0, 0.0, 0.0),
                description: "100% damage to target component.",
                default: true,
            },
            {
                id: "accuracyTier1",
                name: "Tier 1",
                pattern: MechAccuracyPattern.accuracySpreadToAdjacent(0.80, 0.10, 0.05),
                description: "80% damage to target component, 10% to adjacent, 5% to other components, 5% miss.",
                default: false,
            },
            {
                id: "accuracyTier2",
                name: "Tier 2",
                pattern: MechAccuracyPattern.accuracySpreadToAdjacent(0.70, 0.15, 0.05),
                description: "70% damage to target component, 15% to adjacent, 5% to other components, 10% miss.",
                default: false,
            },
            {
                id: "accuracyTier3",
                name: "Tier 3",
                pattern: MechAccuracyPattern.accuracySpreadToAdjacent(0.6, 0.20, 0.05),
                description: "60% damage to target component, 20% to adjacent, 5% to other components, 15% miss.",
                default: false,
            },
            {
                id: "accuracyTier4",
                name: "Tier 4",
                pattern: MechAccuracyPattern.accuracySpreadToAdjacent(0.4, 0.3, 0.1),
                description: "40% damage to target component, 30% to adjacent, 10% to other components, 20% miss.",
                default: false,
            },
            {
                id: "accuracyTier5",
                name: "Tier 5",
                pattern: MechAccuracyPattern.accuracySpreadToAdjacent(0.3, 0.2, 0.1),
                description: "30% damage to target component, 20% to adjacent, 10% to other components, 40% miss.",
                default: false,
            },
            {
                id: "accuracyPotato",
                name: "Tier Potato",
                pattern: MechAccuracyPattern.accuracySpreadToAdjacent(0.1, 0.05, 0.05),
                description: "10% damage to target component, 5% to adjacent, 5% to other components, 80% miss.",
                default: false,
            },
        ];
        return patternList;
    };
    MechAccuracyPattern.reset = function () {
        //Used to reset any state used by accuracy pattern
    };
})(MechAccuracyPattern || (MechAccuracyPattern = {}));
var MechTargetComponent;
(function (MechTargetComponent) {
    var Component = MechModelCommon.Component;
    var EngineType = MechModelCommon.EngineType;
    //These functions return which component of a mech should be targeted
    //function(sourceMech, targetMech) -> MechModel.Component
    MechTargetComponent.aimForCenterTorso = function (sourceMech, targetMech) {
        return Component.CENTRE_TORSO;
    };
    MechTargetComponent.aimForXLSideTorso = function (sourceMech, targetMech) {
        let mechInfo = targetMech.getMechInfo();
        if (mechInfo.engineInfo.getEngineType() === EngineType.XL) {
            return Component.RIGHT_TORSO;
        }
        else {
            return Component.CENTRE_TORSO;
        }
    };
    MechTargetComponent.aimForLegs = function (sourceMech, targetMech) {
        let mechState = targetMech.getMechState();
        if (mechState.mechHealth.isIntact(Component.LEFT_LEG)) {
            return Component.LEFT_LEG;
        }
        else {
            return Component.RIGHT_LEG;
        }
    };
    MechTargetComponent.aimSideTorsoThenCenterTorso = function (sourceMech, targetMech) {
        let targetMechHealth = targetMech.getMechState().mechHealth;
        if (targetMechHealth.isIntact(Component.RIGHT_TORSO)) {
            return Component.RIGHT_TORSO;
        }
        else if (targetMechHealth.isIntact(Component.LEFT_TORSO)) {
            return Component.LEFT_TORSO;
        }
        else {
            return Component.CENTRE_TORSO;
        }
    };
    MechTargetComponent.randomAim = function (sourceMech, targetMech) {
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
    };
    //component weights is an object of the form {<component> : <percentWeight>}.
    //The percent weights of all the components in the object should be
    //equal to one
    var weightedRandom = function (componentWeights) {
        let cumulativePercentMap = new Map();
        let prevComponent;
        for (let component in componentWeights) {
            if (!componentWeights.hasOwnProperty(component)) {
                continue;
            }
            let weight = componentWeights[component];
            if (!prevComponent) {
                cumulativePercentMap.set(component, Number(weight));
            }
            else {
                cumulativePercentMap.set(component, Number(weight) + Number(cumulativePercentMap.get(prevComponent)));
            }
            prevComponent = component;
        }
        return function (sourceMech, targetMech) {
            let rand = Math.random();
            //relies on map insertion order to be the same order as the iterator
            for (let component of cumulativePercentMap.keys()) {
                if (Number(rand) < Number(cumulativePercentMap.get(component))) {
                    return component;
                }
            }
            return null;
        };
    };
    MechTargetComponent.getDefault = function () {
        for (let patternEntry of MechTargetComponent.getPatterns()) {
            if (patternEntry.default) {
                return patternEntry.pattern;
            }
        }
    };
    //returns a list of target patterns for the UI.
    //format of each entry is
    //{id : <patternid>, name : <readableName>, pattern : <function>, description : <desc text>, default: <boolean>}
    //Note: default must be the same as the pattern returned by getDefault()
    MechTargetComponent.getPatterns = function () {
        let patternList = [
            { id: "aimForCenterTorso",
                name: "Aim for CT",
                pattern: MechTargetComponent.aimForCenterTorso,
                description: "Aim for the center torso.",
                default: true,
            },
            { id: "aimForXLSideTorso",
                name: "Aim for XL Side Torso",
                pattern: MechTargetComponent.aimForXLSideTorso,
                description: "Aim for a side torso if the target has an IS XL Engine. Else aims for the center torso.",
                default: false,
            },
            { id: "aimForLegs",
                name: "Aim for Legs",
                pattern: MechTargetComponent.aimForLegs,
                description: "Aim for the legs.",
                default: false,
            },
            {
                id: "aimForSideTorso",
                name: "Aim for Side Torsos",
                pattern: MechTargetComponent.aimSideTorsoThenCenterTorso,
                description: "Aim for side torsos, then center torso.",
                default: false,
            },
            { id: "randomAim",
                name: "Random",
                pattern: MechTargetComponent.randomAim,
                description: "Aim for a random component. Does not include the head.",
                default: false,
            },
            { id: "weightedRandomCT",
                name: "Weighted Random (CT)",
                pattern: weightedRandom({ "centre_torso": 0.6,
                    "left_torso": 0.1,
                    "right_torso": 0.1,
                    "left_arm": 0.05,
                    "right_arm": 0.05,
                    "left_leg": 0.05,
                    "right_leg": 0.05 }),
                description: "60% chance to hit CT, 10% for side torsos, 5% for arms, 5% for legs",
                default: false,
            },
        ];
        return patternList;
    };
    MechTargetComponent.reset = function () {
        //Used to reset any state used by the pattern.
    };
})(MechTargetComponent || (MechTargetComponent = {}));
//Fire patterns are functions that take a mech and return a list of weaponstates
//which represent the weapons to fire
var MechFirePattern;
//Fire patterns are functions that take a mech and return a list of weaponstates
//which represent the weapons to fire
(function (MechFirePattern) {
    var WeaponCycle = MechModelCommon.WeaponCycle;
    MechFirePattern.alphaAtZeroHeat = function (mech, range) {
        let mechState = mech.getMechState();
        if (mechState.heatState.currHeat <= 0) {
            return getNonAMSWeapons(mechState.weaponStateList)
                .filter((weaponState) => willDoDamage(weaponState, range));
        }
        else {
            return null;
        }
    };
    MechFirePattern.maximizeWeapon = function (sortAtRangeFunction) {
        return function (mech, range) {
            let mechState = mech.getMechState();
            let sortedWeapons = Array.from(getNonAMSWeapons(mechState.weaponStateList));
            //sort weaponsToFire by damage/heat at the given range in decreasing order
            let sortFunction = sortAtRangeFunction(range);
            sortedWeapons.sort(sortFunction);
            let weaponsToFire = [];
            for (let weaponState of sortedWeapons) {
                let weaponInfo = weaponState.weaponInfo;
                if (!canFire(weaponState) //not ready to fire
                    || !willDoDamage(weaponState, range) //will not do damage
                    //No ammo
                    || (weaponInfo.requiresAmmo() && weaponState.getAvailableAmmo() <= 0)) {
                    continue; //skip weapon
                }
                //fit as many ready weapons as possible into the available heat
                //starting with those at the start of the sorted list
                weaponsToFire.push(weaponState);
                let overheat = willOverheat(mech, weaponsToFire);
                let ghostheat = willGhostHeat(mech, weaponsToFire);
                if (overheat || ghostheat) {
                    weaponsToFire.pop();
                    if (ghostheat) {
                        continue;
                    }
                    else if (overheat) {
                        break; //if near heatcap, wait for the better heat/dmg weapon
                    }
                }
            }
            return weaponsToFire;
        };
    };
    //Maximize damage per heat
    var damagePerHeatComparator = function (range) {
        return (weaponA, weaponB) => {
            let dmgPerHeatA = weaponA.computeHeat() > 0 ?
                weaponA.weaponInfo.damageAtRange(range)
                    / weaponA.computeHeat()
                : Number.MAX_VALUE;
            let dmgPerHeatB = weaponB.computeHeat() > 0 ?
                weaponB.weaponInfo.damageAtRange(range)
                    / weaponB.computeHeat()
                : Number.MAX_VALUE;
            return dmgPerHeatB - dmgPerHeatA;
        };
    };
    MechFirePattern.maximumDmgPerHeat = MechFirePattern.maximizeWeapon(damagePerHeatComparator);
    //Maximize raw dps
    var maxDPSComparator = function (range) {
        return (weaponA, weaponB) => {
            return weaponB.computeMaxDPS(range) - weaponA.computeMaxDPS(range);
        };
    };
    MechFirePattern.maxDPS = MechFirePattern.maximizeWeapon(maxDPSComparator);
    //Always alpha, as long as it does not cause an overheat
    MechFirePattern.alphaNoOverheat = function (mech, range) {
        let mechState = mech.getMechState();
        let weaponsToFire = [];
        //check if all weapons are ready
        for (let weaponState of getNonAMSWeapons(mechState.weaponStateList)) {
            if (!canFire(weaponState) && !weaponState.isJammed() && weaponState.active) {
                //if any non-jammed, non-disabled weapon is not ready, do not fire
                return [];
            }
        }
        //fire all weapons if heat allows
        weaponsToFire = Array.from(getNonAMSWeapons(mechState.weaponStateList))
            .filter((weaponState) => willDoDamage(weaponState, range));
        if (!willOverheat(mech, weaponsToFire)) {
            return weaponsToFire;
        }
        else {
            return [];
        }
    };
    MechFirePattern.maxFireNoGhostHeat = function (mech, range) {
        let mechState = mech.getMechState();
        let weaponsToFire = [];
        for (let weaponState of getNonAMSWeapons(mechState.weaponStateList)) {
            if (!canFire(weaponState) || !willDoDamage(weaponState, range)) {
                continue;
            }
            weaponsToFire.push(weaponState);
            if (willGhostHeat(mech, weaponsToFire) || willOverheat(mech, weaponsToFire)) {
                weaponsToFire.pop();
                continue;
            }
        }
        return weaponsToFire;
    };
    MechFirePattern.fireWhenReady = function (mech, range) {
        let mechState = mech.getMechState();
        let weaponsToFire = [];
        for (let weaponState of getNonAMSWeapons(mechState.weaponStateList)) {
            if (weaponState.weaponCycle === WeaponCycle.READY) {
                weaponsToFire.push(weaponState);
            }
        }
        return weaponsToFire;
    };
    //Util functions
    var willOverheat = function (mech, weaponsToFire) {
        let simTime = MechSimulatorLogic.getSimTime();
        let mechState = mech.getMechState();
        let predictedHeat = mechState.predictHeat(weaponsToFire, simTime);
        let heatState = mech.getMechState().heatState;
        return heatState.currHeat + predictedHeat > heatState.currMaxHeat;
    };
    var willGhostHeat = function (mech, weaponsToFire) {
        let simTime = MechSimulatorLogic.getSimTime();
        let mechState = mech.getMechState();
        let predictedHeat = mechState.predictHeat(weaponsToFire, simTime);
        let baseHeat = mechState.predictBaseHeat(weaponsToFire);
        return predictedHeat > baseHeat;
    };
    var willDoDamage = function (weaponState, range) {
        return weaponState.weaponInfo.damageAtRange(range) > 0;
    };
    //Helper method for determining whether the firepattern can fire a weapon
    //Uses the useDoubleTap field of SimulatorParameters
    var canFire = function (weaponState) {
        let simParams = SimulatorSettings.getSimulatorParameters();
        if (weaponState.canDoubleTap()) {
            //For double tap weapons, fire when possible if double tap is enabled, else wait for 
            //weapon to completely cool down (i.e. get to ready state) before firing again.
            if (simParams.useDoubleTap) {
                return weaponState.canFire();
            }
            else {
                return weaponState.isReady();
            }
        }
        else {
            return weaponState.canFire();
        }
    };
    var getNonAMSWeapons = function (weaponStateList) {
        return weaponStateList.filter((weaponState) => {
            return weaponState.weaponInfo.type !== "AMS";
        });
    };
    MechFirePattern.getDefault = function () {
        for (let patternEntry of MechFirePattern.getPatterns()) {
            if (patternEntry.default) {
                return patternEntry.pattern;
            }
        }
    };
    //Returns a list of fire patterns for the UI
    MechFirePattern.getPatterns = function () {
        let patternList = [
            { id: "maximumDmgPerHeat",
                name: "Max DMG per Heat",
                pattern: MechFirePattern.maximumDmgPerHeat,
                description: "Maximize damage per heat.",
                default: true,
            },
            { id: "maxDPS",
                name: "Max DPS",
                pattern: MechFirePattern.maxDPS,
                description: "Maximize raw DPS at the given range while still avoiding ghost heat.",
                default: false,
            },
            { id: "maxFireNoGhostHeat",
                name: "Maximum fire rate",
                pattern: MechFirePattern.maxFireNoGhostHeat,
                description: "Maximize weapons fired as long as it doesn't cause ghost heat.",
                default: false,
            },
            { id: "alphaNoOverheat",
                name: "Alpha, no Overheat",
                pattern: MechFirePattern.alphaNoOverheat,
                description: "Always alpha as long as it doesn't cause an overheat.",
                default: false,
            },
            { id: "alphaAtZeroHeat",
                name: "Alpha when at zero heat",
                pattern: MechFirePattern.alphaAtZeroHeat,
                description: "Fire all weapons when heat is zero.",
                default: false,
            },
        ];
        return patternList;
    };
    MechFirePattern.reset = function () {
        //Used to reset any state used by the pattern.
    };
})(MechFirePattern || (MechFirePattern = {}));
var MechSimulatorLogic;
(function (MechSimulatorLogic) {
    var UpdateType = MechModelCommon.UpdateType;
    var Team = MechModelCommon.Team;
    var EventType = MechModelCommon.EventType;
    var simulationInterval = null;
    var simRunning = false;
    var simTime = 0;
    var weaponFireQueue = [];
    var willUpdateTeamStats = {}; //Format: {<team> : boolean}
    const simStepDuration = 50; //simulation tick length in ms
    MechSimulatorLogic.getStepDuration = function () {
        return simStepDuration;
    };
    //NOTE: In almost all cases this method should be be called instead of
    //SimulatorSettings.setSimulatorParameters. This method resets the timer
    //interval object so any parameter changes to the simulation speed apply
    MechSimulatorLogic.setSimulatorParameters = function (parameters) {
        SimulatorSettings.setSimulatorParameters(parameters);
        //refresh simulationInterval if it is already present
        if (simulationInterval) {
            window.clearInterval(simulationInterval);
            createSimulationInterval();
        }
    };
    var createSimulationInterval = function () {
        var createIntervalHandler = function () {
            return () => {
                if (simRunning) {
                    MechSimulatorLogic.step();
                }
            };
        };
        let intervalHandler = createIntervalHandler();
        let simulatorParameters = SimulatorSettings.getSimulatorParameters();
        simulationInterval = window.setInterval(intervalHandler, simulatorParameters.uiUpdateInterval);
    };
    MechSimulatorLogic.runSimulation = function () {
        if (!simulationInterval) {
            createSimulationInterval();
        }
        simRunning = true;
        MechModelView.getEventQueue().queueEvent({ type: EventType.START });
    };
    MechSimulatorLogic.pauseSimulation = function () {
        simRunning = false;
        MechModelView.getEventQueue().queueEvent({ type: EventType.PAUSE });
    };
    MechSimulatorLogic.stepSimulation = function () {
        MechSimulatorLogic.pauseSimulation();
        MechSimulatorLogic.step();
    };
    MechSimulatorLogic.resetSimulation = function () {
        MechSimulatorLogic.pauseSimulation();
        if (simulationInterval) {
            window.clearInterval(simulationInterval);
            simulationInterval = null;
        }
        weaponFireQueue = [];
        simTime = 0;
        clearMechStats();
        willUpdateTeamStats = {};
        let update = {
            type: MechModelCommon.EventType.SIMTIME_UPDATE,
            simTime,
        };
        MechModelView.getEventQueue().queueEvent(update);
        MechAccuracyPattern.reset();
        MechTargetComponent.reset();
        MechFirePattern.reset();
        MechTargetMech.reset();
    };
    //Simulation step function. Called every tick
    MechSimulatorLogic.step = function () {
        let teams = [Team.BLUE, Team.RED];
        let eventQueue = MechModelView.getEventQueue();
        eventQueue.deferExecution();
        willUpdateTeamStats = {};
        processWeaponFires();
        for (let team of teams) {
            for (let mech of MechModel.getMechTeam(team)) {
                let mechState = mech.getMechState();
                if (mechState.isAlive()) {
                    dissipateHeat(mech);
                    processCooldowns(mech, mech.getTargetMech());
                    let simulatorParameters = SimulatorSettings.getSimulatorParameters();
                    let weaponsToFire = mech.firePattern(mech, simulatorParameters.range);
                    if (weaponsToFire) {
                        let targetMech = mech.mechTargetPattern(mech, MechModel.getMechTeam(enemyTeam(team)));
                        if (targetMech !== mech.getTargetMech()) {
                            mech.setTargetMech(targetMech);
                            mechState.setUpdate(UpdateType.STATS);
                        }
                        if (targetMech) {
                            fireWeapons(mech, weaponsToFire, targetMech);
                        }
                        else {
                            Util.log("No target mech for " + mech.getMechId());
                        }
                    }
                }
                else {
                    //dead mech, set time of death if it is not already set
                    let mechStats = mechState.mechStats;
                    if (mechStats.timeOfDeath === null) {
                        mechStats.timeOfDeath = simTime;
                        mechState.setUpdate(UpdateType.STATS);
                    }
                }
                let mechUpdate = {
                    type: MechModelCommon.EventType.MECH_UPDATE,
                    mech,
                };
                eventQueue.queueEvent(mechUpdate);
            }
            if (willUpdateTeamStats[team]) {
                let update = {
                    type: MechModelCommon.EventType.TEAMSTATS_UPDATE,
                    team,
                    simTime: MechSimulatorLogic.getSimTime(),
                };
                eventQueue.queueEvent(update);
            }
        }
        simTime += MechSimulatorLogic.getStepDuration();
        let simTimeUpdate = {
            type: MechModelCommon.EventType.SIMTIME_UPDATE,
            simTime: MechSimulatorLogic.getSimTime(),
        };
        eventQueue.queueEvent(simTimeUpdate);
        //if one team is dead, stop simulation, compute stats for the current step
        //and inform ModelView of victory
        if (!MechModel.isTeamAlive(Team.BLUE) ||
            !MechModel.isTeamAlive(Team.RED)) {
            MechSimulatorLogic.pauseSimulation();
            flushWeaponFireQueue();
            for (let team of teams) {
                let update = {
                    type: MechModelCommon.EventType.TEAMSTATS_UPDATE,
                    team,
                    simTime: MechSimulatorLogic.getSimTime(),
                };
                eventQueue.queueEvent(update);
            }
            let victoryUpdate = {
                type: MechModelCommon.EventType.TEAMVICTORY_UPDATE,
            };
            eventQueue.queueEvent(victoryUpdate);
        }
        eventQueue.executeAllQueued();
    };
    var enemyTeam = function (myTeam) {
        if (myTeam === Team.BLUE) {
            return Team.RED;
        }
        else if (myTeam === Team.RED) {
            return Team.BLUE;
        }
        throw Error("Unable to find enemy team");
    };
    //Give a mech and a list of weaponStates
    //(which must be contained in mech.mechState.weaponStateList)
    //fire the weapons (i.e. update mech heat and weapon states)
    var fireWeapons = function (mech, weaponStateList, targetMech) {
        let mechState = mech.getMechState();
        let weaponsFired = []; //list of weapons that were actually fired.
        for (let weaponState of weaponStateList) {
            let weaponInfo = weaponState.weaponInfo;
            let fireStatus = weaponState.fireWeapon();
            if (fireStatus.newState) {
                mechState.setUpdate(UpdateType.WEAPONSTATE);
            }
            if (fireStatus.weaponFired) {
                weaponsFired.push(weaponState);
                queueWeaponFire(mech, targetMech, weaponState, fireStatus.ammoConsumed);
                mechState.setUpdate(UpdateType.COOLDOWN);
            }
        }
        //update mech heat
        let totalHeat = mechState.computeHeat(weaponsFired, MechSimulatorLogic.getSimTime());
        if (totalHeat > 0) {
            mechState.heatState.currHeat += Number(totalHeat);
            mechState.setUpdate(UpdateType.HEAT);
            let mechStats = mechState.mechStats;
            mechStats.totalHeat += Number(totalHeat);
        }
    };
    var queueWeaponFire = function (sourceMech, targetMech, weaponState, ammoConsumed) {
        let simulatorParameters = SimulatorSettings.getSimulatorParameters();
        let range = simulatorParameters.range;
        let weaponFire = new MechModel.WeaponFire(sourceMech, targetMech, weaponState, range, simTime, ammoConsumed, MechSimulatorLogic.getStepDuration);
        weaponFireQueue.push(weaponFire);
        return weaponFire;
    };
    var dissipateHeat = function (mech) {
        let mechState = mech.getMechState();
        let heatState = mechState.heatState;
        //heat dissipated per step. Divide currHeatDissipation by 1000
        //because it is in heat per second
        let stepHeatDissipation = MechSimulatorLogic.getStepDuration() * heatState.currHeatDissipation / 1000;
        let prevHeat = heatState.currHeat;
        heatState.currHeat = Math.max(0, heatState.currHeat - Number(stepHeatDissipation));
        if (heatState.currHeat !== prevHeat) {
            mechState.setUpdate(UpdateType.HEAT);
        }
    };
    var processCooldowns = function (mech, targetMech) {
        let mechState = mech.getMechState();
        let weaponsFired = [];
        for (let weaponState of mechState.weaponStateList) {
            let stepResult = weaponState.step(MechSimulatorLogic.getStepDuration());
            if (stepResult.weaponFired) {
                weaponsFired.push(weaponState);
                queueWeaponFire(mech, targetMech, weaponState, stepResult.ammoConsumed);
            }
            if (stepResult.newState) {
                mechState.setUpdate(UpdateType.WEAPONSTATE);
            }
            if (stepResult.cooldownChanged) {
                mechState.setUpdate(UpdateType.COOLDOWN);
            }
        }
        let totalHeat = mechState.computeHeat(weaponsFired, MechSimulatorLogic.getSimTime());
        if (totalHeat > 0) {
            mechState.heatState.currHeat += Number(totalHeat);
            mechState.setUpdate(UpdateType.HEAT);
            let mechStats = mechState.mechStats;
            mechStats.totalHeat += Number(totalHeat);
        }
    };
    var processWeaponFires = function () {
        if (weaponFireQueue.length === 0) {
            return;
        }
        //Go through each entry in the current queue. Need to keep the start length
        //because the operations below dequeue the first element and requeue it
        //to the end of the queue if it still has duration/travelTime left
        let startQueueLength = weaponFireQueue.length;
        for (let count = 0; count < startQueueLength; count++) {
            let weaponFire = weaponFireQueue.shift();
            weaponFire.step(MechSimulatorLogic.getStepDuration());
            if (weaponFire.isComplete()) {
                logDamage(weaponFire);
            }
            else {
                weaponFireQueue.push(weaponFire);
            }
        }
    };
    //log damage from any remaining entries in the weapon fire queue. Done when
    //one team dies
    var flushWeaponFireQueue = function () {
        for (let weaponFire of weaponFireQueue) {
            logDamage(weaponFire);
        }
        weaponFireQueue = [];
    };
    //Update mechstats with the completed WeaponFire's damage, and log
    //results to console
    var logDamage = function (weaponFire) {
        let weaponInfo = weaponFire.weaponState.weaponInfo;
        let mechState = weaponFire.sourceMech.getMechState();
        let mechStats = mechState.mechStats;
        mechStats.totalDamage += weaponFire.damageDone.totalDamage();
        mechStats.weaponFires.push(weaponFire);
        mechState.setUpdate(UpdateType.STATS);
        willUpdateTeamStats[weaponFire.sourceMech.getMechTeam()] = true;
        willUpdateTeamStats[weaponFire.targetMech.getMechTeam()] = true;
        Util.log(weaponInfo.name + " completed. Total damage: "
            + weaponFire.damageDone.totalDamage() +
            "(" + weaponFire.damageDone.toString() + ")" +
            " src: " + weaponFire.sourceMech.getName() +
            " dest: " + weaponFire.targetMech.getName());
    };
    var clearMechStats = function () {
        let teams = [Team.BLUE, Team.RED];
        for (let team of teams) {
            for (let mech of MechModel.getMechTeam(team)) {
                mech.getMechState().clearMechStats();
            }
        }
    };
    MechSimulatorLogic.getSimTime = function () {
        return simTime;
    };
})(MechSimulatorLogic || (MechSimulatorLogic = {}));
var MechTargetMech;
(function (MechTargetMech) {
    //These functions return which enemy mech to target
    MechTargetMech.targetMechsInOrder = function (mech, enemyMechList) {
        for (let enemyMech of enemyMechList) {
            if (enemyMech.getMechState().isAlive()) {
                return enemyMech;
            }
        }
        return null;
    };
    var targetMap = new Map();
    MechTargetMech.targetRandomMech = function (mech, enemyMechList) {
        let targetMech = targetMap.get(mech);
        if (!targetMech || !targetMech.getMechState().isAlive()) {
            let liveEnemyMechs = [];
            for (let enemyMech of enemyMechList) {
                if (enemyMech.getMechState().isAlive()) {
                    liveEnemyMechs.push(enemyMech);
                }
            }
            targetMech = liveEnemyMechs[Math.floor(Math.random() * liveEnemyMechs.length)];
            targetMap.set(mech, targetMech);
        }
        return targetMech;
    };
    var targetHighestFirepower = function (mech, enemyMechList) {
        let maxFirepower;
        let maxFirepowerMech;
        let range = SimulatorSettings.getSimulatorParameters().range;
        for (let enemyMech of enemyMechList) {
            if (enemyMech.getMechState().isAlive()) {
                let firepower = enemyMech.getMechState().getTotalDamageAtRange(range);
                if (!maxFirepower || firepower > maxFirepower) {
                    maxFirepower = firepower;
                    maxFirepowerMech = enemyMech;
                }
            }
        }
        return maxFirepowerMech;
    };
    var targetHeaviest = function (mech, enemyMechList) {
        let maxWeight;
        let maxWeightMech;
        for (let enemyMech of enemyMechList) {
            if (enemyMech.getMechState().isAlive()) {
                let mechInfo = enemyMech.getMechState().mechInfo;
                let weight = mechInfo.tons;
                if (!maxWeight || Number(weight) > Number(maxWeight)) {
                    maxWeight = weight;
                    maxWeightMech = enemyMech;
                }
            }
        }
        return maxWeightMech;
    };
    MechTargetMech.getDefault = function () {
        for (let patternEntry of MechTargetMech.getPatterns()) {
            if (patternEntry.default) {
                return patternEntry.pattern;
            }
        }
    };
    MechTargetMech.reset = function () {
        targetMap = new Map();
    };
    //returns a list of mech target patterns for the UI
    MechTargetMech.getPatterns = function () {
        let patternList = [
            {
                id: "targetMechsInOrder",
                name: "Mechs in order",
                pattern: MechTargetMech.targetMechsInOrder,
                description: "Target mechs from the top to the bottom of the list.",
                default: true,
            },
            {
                id: "targetHighestFirepower",
                name: "Highest Firepower First",
                pattern: targetHighestFirepower,
                description: "Target the enemy mech with the highest firepower at the current range.",
                default: false,
            },
            {
                id: "targetHeaviest",
                name: "Heaviest First",
                pattern: targetHeaviest,
                description: "Target the heaviest mech first.",
                default: false,
            },
            {
                id: "targetRandomMech",
                name: "Random mech",
                pattern: MechTargetMech.targetRandomMech,
                description: "Target a random live mech.",
                default: false,
            },
        ];
        return patternList;
    };
})(MechTargetMech || (MechTargetMech = {}));
var MechModelQuirks;
(function (MechModelQuirks) {
    class MechQuirkInfo {
        constructor(smurfyQuirk) {
            this.smurfyQuirk = Object.assign({}, smurfyQuirk);
        }
        get name() {
            return this.smurfyQuirk.name;
        }
        get translated_name() {
            return this.smurfyQuirk.translated_name;
        }
        get value() {
            return this.smurfyQuirk.value;
        }
        set value(value) {
            this.smurfyQuirk.value = value;
        }
        get translated_value() {
            let quirkNameComponents = this.name.split("_");
            let endIdx = quirkNameComponents.length - 1;
            let lastNameComponent = quirkNameComponents[endIdx];
            let prefix = this.value >= 0 ? "+" : "";
            if (lastNameComponent === "multiplier") {
                return prefix + (100 * (this.value)).toFixed(1) + "%";
            }
            else if (lastNameComponent === "additive") {
                return prefix + String(this.value);
            }
            else {
                Util.warn(Error("Unexpected quirk type: " + this.name));
                return String(this.value);
            }
        }
        //returns true if the quirk is beneficial, false if not.
        isBonus() {
            let quirkNameComponents = this.name.split("_");
            let endIdx = quirkNameComponents.length - 1;
            let lastNameComponent = quirkNameComponents[endIdx];
            if (lastNameComponent === "additive") {
                return this.value > 0;
            }
            const negativeExceptions = [
                "spread",
                "cooldown",
                "heat",
                "duration",
                "falldamage",
                "jamchance",
                "jamduration",
                "jamrampdownduration",
                "rampdownduration",
                "startupduration",
                "screenshake",
                "coolshotcooldown",
                "strategicstrikespread",
                "stealtharmorcooldown",
                "receiving",
            ];
            let quirkTypeNameComponent = quirkNameComponents[endIdx - 1];
            if (negativeExceptions.includes(quirkTypeNameComponent)) {
                return this.value < 0;
            }
            else {
                return this.value > 0;
            }
        }
    }
    //collects the set of quirks for omnimechs
    const CompleteOmnipodSetCount = 8;
    MechModelQuirks.collectOmnipodQuirks = function (smurfyMechLoadout) {
        let ret = new MechQuirkList();
        if (!MechModel.isOmnimech(smurfyMechLoadout)) {
            return ret;
        }
        let omnipodSetCounts = new Map(); //omnipodId -> count
        var incrementOmnipodSet = function (setName) {
            let setCount = omnipodSetCounts.get(setName);
            if (!setCount) {
                setCount = 1;
            }
            else {
                setCount = setCount + 1;
            }
            omnipodSetCounts.set(setName, setCount);
        };
        for (let component of smurfyMechLoadout.configuration) {
            let omnipodId = component.omni_pod;
            if (omnipodId) {
                let omnipodData = MechModel.getSmurfyOmnipodData(omnipodId);
                let omnipodQuirks = omnipodData.configuration.quirks;
                for (let smurfyQuirk of omnipodQuirks) {
                    ret.addQuirk(new MechQuirkInfo(smurfyQuirk));
                }
                let setName = omnipodData.details.set;
                incrementOmnipodSet(setName);
            }
        }
        //add ct omnipod quirks (smurfy config does not put in omnipod ID for ct)
        let smurfyMechInfo = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
        let ctOmnipod = MechModel.getSmurfyCTOmnipod(smurfyMechInfo.name);
        if (ctOmnipod) {
            for (let smurfyQuirk of ctOmnipod.configuration.quirks) {
                ret.addQuirk(new MechQuirkInfo(smurfyQuirk));
            }
            let omnipodSetName = ctOmnipod.details.set;
            incrementOmnipodSet(omnipodSetName);
            //add set bonus
            let setCount = omnipodSetCounts.get(omnipodSetName);
            if (setCount >= CompleteOmnipodSetCount) {
                let fullSetQuirks = AddedData._AddedOmnipodData[omnipodSetName].setBonusQuirks;
                for (let smurfyQuirk of fullSetQuirks) {
                    ret.addQuirk(new MechQuirkInfo(smurfyQuirk));
                }
            }
        }
        else {
            Util.warn("Unable to find CT omnipod for " + smurfyMechInfo.name);
        }
        return ret;
    };
    //collects the set of quirks for a battlemech (non-omnimech)
    MechModelQuirks.collectMechQuirks = function (smurfyMechData) {
        let ret = [];
        for (let smurfyQuirk of smurfyMechData.details.quirks) {
            ret.push(new MechQuirkInfo(smurfyQuirk));
        }
        return ret;
    };
    ;
    MechModelQuirks.getGeneralBonus = function (quirkList) {
        let ret = {};
        for (let quirk of quirkList) {
            if (MechModelQuirksData._quirkGeneral[quirk.name]) {
                if (!ret[quirk.name]) {
                    ret[quirk.name] = Number(quirk.value);
                }
                else {
                    ret[quirk.name] += Number(quirk.value);
                }
            }
        }
        return ret;
    };
    MechModelQuirks.getHealthBonus = function (component, quirkList) {
        let ret = { armor: 0, structure: 0, armor_multiplier: 1.0, structure_multiplier: 1.0 };
        for (let quirk of quirkList) {
            if (quirk.name.startsWith(MechModelQuirksData.QuirkArmorAdditivePrefix)) {
                let quirkComponent = quirk.name.split("_")[1];
                if (MechModelQuirksData._quirkComponentMap[component] !== quirkComponent) {
                    continue;
                }
                ret.armor += Number(quirk.value);
            }
            else if (quirk.name.startsWith(MechModelQuirksData.QuirkStructureAdditivePrefix)) {
                let quirkComponent = quirk.name.split("_")[1];
                if (MechModelQuirksData._quirkComponentMap[component] !== quirkComponent) {
                    continue;
                }
                ret.structure += Number(quirk.value);
            }
            else if (quirk.name === MechModelQuirksData.QuirkArmorMultiplier) {
                ret.armor_multiplier += Number(quirk.value);
            }
            else if (quirk.name === MechModelQuirksData.QuirkStructureMultiplier) {
                ret.structure_multiplier += Number(quirk.value);
            }
        }
        return ret;
    };
    ;
    class ReverseWeaponQuirkMap {
        constructor() {
            this.reversedWeaponNameMap = null;
            //Do nothing, reverse map will be initialized the first time
            //getReversedWeaponNameMap is called
        }
        getApplicableQuirks(weaponName) {
            return this.getReversedWeaponNameMap()[weaponName];
        }
        getReversedWeaponNameMap() {
            if (!this.reversedWeaponNameMap) {
                this.reversedWeaponNameMap = this.initReversedWeaponNameMap();
            }
            return this.reversedWeaponNameMap;
        }
        initReversedWeaponNameMap() {
            let ret = {};
            for (let quirkName in MechModelQuirksData._weaponNameMap) {
                if (!MechModelQuirksData._weaponNameMap.hasOwnProperty(quirkName)) {
                    continue;
                }
                for (let weaponName of MechModelQuirksData._weaponNameMap[quirkName]) {
                    let reverseEntry = ret[weaponName];
                    if (!reverseEntry) {
                        reverseEntry = new Set();
                        ret[weaponName] = reverseEntry;
                    }
                    reverseEntry.add(quirkName);
                }
            }
            return ret;
        }
    }
    var reversedWeaponQuirkMap = new ReverseWeaponQuirkMap();
    ;
    //returns {cooldown_multiplier: <bonus>, duration_multiplier: <bonus>,
    //          heat_multiplier: <bonus>, range_multiplier: <bonus>, velocity_multiplier: <bonus>, 
    //          jamchance_multiplier: <bonus>, jamduration_multiplier:<bonus>}
    MechModelQuirks.getWeaponBonus = function (weaponInfo) {
        let quirkList = weaponInfo.mechInfo.quirks;
        if (weaponInfo.mechInfo.skillQuirks) {
            quirkList = quirkList.concat(weaponInfo.mechInfo.skillQuirks);
        }
        return getWeaponBonusForQuirklist(weaponInfo, quirkList);
    };
    var getWeaponBonusForQuirklist = function (weaponInfo, quirkList) {
        let ret = {
            cooldown_multiplier: 0, duration_multiplier: 0,
            heat_multiplier: 0, range_multiplier: 0, velocity_multiplier: 0,
            jamchance_multiplier: 0, jamduration_multiplier: 0
        };
        for (let quirk of quirkList) {
            let quirkNameComponents = quirk.name.split("_");
            let firstNameComponent = quirkNameComponents[0];
            let restOfNameComponents = quirkNameComponents.slice(1).join("_");
            //general weapon bonuses
            if (MechModelQuirksData._weaponClassMap[firstNameComponent]) {
                if (MechModelQuirksData._weaponClassMap[firstNameComponent].includes(weaponInfo.type)) {
                    ret[restOfNameComponents] += Number(quirk.value);
                }
            }
            //specific weapon bonuses
            let applicableQuirks = reversedWeaponQuirkMap.getApplicableQuirks(weaponInfo.name);
            if (applicableQuirks && applicableQuirks.has(firstNameComponent)) {
                ret[restOfNameComponents] += Number(quirk.value);
            }
        }
        return ret;
    };
    const factionNameMap = {
        "InnerSphere": "IS",
        "IS": "IS",
        "Clan": "Clan",
    };
    MechModelQuirks.convertSkillToMechQuirks = function (skillName, mechInfo) {
        let ret = new MechQuirkList();
        let skillNode = AddedData._SkillTreeData[skillName];
        for (let effect of skillNode.effects) {
            let name = effect.quirkName;
            let value = 0;
            let matched = false;
            for (let effectValue of effect.quirkValues) {
                if (effectValue.faction) {
                    if (factionNameMap[effectValue.faction] !== factionNameMap[mechInfo.faction]) {
                        continue;
                    }
                }
                if (effectValue.weightClass) {
                    if (effectValue.weightClass.toLowerCase !== mechInfo.mechType.toLowerCase) {
                        continue;
                    }
                }
                if (effectValue.tonnage) {
                    if (Number(effectValue.tonnage) !== Number(mechInfo.tons)) {
                        continue;
                    }
                }
                //matched
                matched = true;
                value += Number(effectValue.quirkValue);
                break;
            }
            if (matched) {
                let effectQuirk = {
                    name,
                    value,
                    translated_name: effect.quirkTranslatedName
                };
                let mechQuirk = new MechQuirkInfo(effectQuirk);
                ret.addQuirk(mechQuirk);
            }
        }
        if (ret.length === 0) {
            Util.warn(Error("Unable to match skill: " + skillName));
        }
        return ret;
    };
    //quirk list that accumulates quirks with the same name into a single entry (when added through addQuirk)
    class MechQuirkList extends Array {
        constructor() {
            super();
            this.quirkNameMap = new Map();
        }
        //adds a quirk, merging it with a quirk already nthe list if it has the same name
        addQuirk(quirk) {
            if (!(this.quirkNameMap.get(quirk.name))) {
                this.quirkNameMap.set(quirk.name, quirk);
                this.push(quirk);
            }
            else {
                let quirkInList = this.quirkNameMap.get(quirk.name);
                quirkInList.value = Number(quirkInList.value) + Number(quirk.value);
            }
        }
        addQuirkList(quirks) {
            for (let quirk of quirks) {
                this.addQuirk(quirk);
            }
        }
    }
    MechModelQuirks.MechQuirkList = MechQuirkList;
    //returns true if the quirk has any effect on the mech given its current loadout, false otherwise.
    MechModelQuirks.isQuirkApplicable = function (quirk, mechInfo) {
        //general quirks
        let generalBonus = MechModelQuirks.getGeneralBonus([quirk]);
        for (let idx in generalBonus) {
            if (generalBonus.hasOwnProperty(idx)) {
                return true;
            }
        }
        //armor quirks
        if (quirk.name.startsWith(MechModelQuirksData.QuirkArmorAdditivePrefix)
            || quirk.name.startsWith(MechModelQuirksData.QuirkStructureAdditivePrefix)
            || quirk.name === MechModelQuirksData.QuirkArmorMultiplier
            || quirk.name === MechModelQuirksData.QuirkStructureMultiplier) {
            return true;
        }
        //weapon bonuses
        for (let weaponInfo of mechInfo.weaponInfoList) {
            let weaponBonus = getWeaponBonusForQuirklist(weaponInfo, [quirk]);
            for (let idx in weaponBonus) {
                if (weaponBonus.hasOwnProperty(idx)) {
                    if (weaponBonus[idx] !== 0) {
                        return true;
                    }
                }
            }
        }
        //ammo bonuses
        for (let ammoBox of mechInfo.ammoBoxList) {
            let ammoType = MechModelQuirksData._ammoCapacityMap[quirk.name];
            if (ammoType === ammoBox.type) {
                return true;
            }
        }
        return false;
    };
})(MechModelQuirks || (MechModelQuirks = {}));
var MechModelSkills;
(function (MechModelSkills) {
    MechModelSkills.getSkillLoader = function (type) {
        if (type === KitlaanSkillLoader.type) {
            return new KitlaanSkillLoader();
        }
        throw Error("Unexpected skill type : " + type);
    };
    class KitlaanSkillLoader {
        constructor() {
            //nothing yet
        }
        parseURL(url) {
            let matcher = /^https:\/\/kitlaan\.gitlab\.io\/mwoskill\/\?p=([^&]+).*$/;
            let match = matcher.exec(url);
            if (!match) {
                return null;
            }
            let state = match[1];
            return this.parseState(state);
        }
        parseState(state) {
            let urlPrefix = null;
            const JsonBinMarkerPrefix = "jsonbin1.";
            let hash;
            if (state.startsWith(JsonBinMarkerPrefix)) {
                hash = state.substring(JsonBinMarkerPrefix.length);
                urlPrefix = KitlaanSkillLoader.JSON_BIN_PREFIX;
            }
            else {
                hash = state;
                urlPrefix = KitlaanSkillLoader.KITLAAN_PREFIX;
            }
            return {
                urlPrefix, hash, state
            };
        }
        loadSkillsFromState(state) {
            let urlComponents = this.parseState(state);
            if (!urlComponents) {
                return null;
            }
            this.state = urlComponents.state;
            return this.createLoadPromise(urlComponents);
        }
        loadSkillsFromURL(url) {
            let urlComponents = this.parseURL(url);
            if (!urlComponents) {
                return null;
            }
            this.state = urlComponents.state;
            return this.createLoadPromise(urlComponents);
        }
        getSkillState() {
            return {
                type: KitlaanSkillLoader.type,
                state: this.state,
            };
        }
        setSkillState(skillState) {
            this.state = skillState.state;
        }
        getSkillURL() {
            if (this.state) {
                const urlPrefix = "https://kitlaan.gitlab.io/mwoskill/?p=";
                return urlPrefix + this.state;
            }
            else {
                return null;
            }
        }
        createLoadPromise(urlComponents) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: urlComponents.urlPrefix + urlComponents.hash,
                    type: 'GET',
                    dataType: 'JSON'
                })
                    .done(function (ajaxResponse) {
                    let resolveData = ajaxResponse;
                    resolve(resolveData);
                })
                    .catch(function (err) {
                    reject(Error(err));
                });
            });
        }
        convertDataToMechQuirks(kitlaanData, mechId) {
            let skillQuirks = new MechModelQuirks.MechQuirkList();
            for (let category in kitlaanData.selected) {
                if (!kitlaanData.selected.hasOwnProperty(category)) {
                    continue;
                }
                let kitlaanCategorySkills = kitlaanData.selected[category];
                for (let kitlaanSkill of kitlaanCategorySkills) {
                    let kitlaanName = kitlaanSkill[0];
                    let skillName = ExternalSkillTrees._KitlaanSkillNameMap[kitlaanName];
                    let mech = MechModel.getMechFromId(mechId);
                    let mechQuirks = MechModelQuirks.convertSkillToMechQuirks(skillName, mech.getMechInfo());
                    if (mechQuirks) {
                        skillQuirks.addQuirkList(mechQuirks);
                    }
                    else {
                        Util.warn(Error("No quirks found for " + kitlaanName));
                    }
                }
            }
            skillQuirks.sort(function (quirkA, quirkB) {
                return quirkA.translated_name.localeCompare(quirkB.translated_name);
            });
            return skillQuirks;
        }
    }
    KitlaanSkillLoader.KITLAAN_PREFIX = "https://kitlaan.gitlab.io/mwoskill_json/json/";
    KitlaanSkillLoader.JSON_BIN_PREFIX = "http://api.jsonbin.io/b/";
    KitlaanSkillLoader.type = "kitlaan";
})(MechModelSkills || (MechModelSkills = {}));
//Weapon state classes
var MechModelWeapons;
//Weapon state classes
(function (MechModelWeapons) {
    var WeaponCycle = MechModelCommon.WeaponCycle;
    var UACJamMethod = SimulatorSettings.UACJamMethod;
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
            this.volleyDelay = Number(smurfyWeaponData.volleyDelay) * 1000;
            //Continuous fire weapon fields
            //time between shots on automatic fire for continuous fire weapons (flamers, MGs, RACs);
            this.timeBetweenAutoShots = smurfyWeaponData.rof ?
                1000 / Number(smurfyWeaponData.rof) : 0; //rof is in shots per second
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
        damageAtRange(range) {
            let totalDamage = Number(this.baseDmg) * Number(this.damageMultiplier);
            let ret = totalDamage;
            let rangeMultiplier = 1 + Number(this.weaponBonus.range_multiplier);
            if (Number(range) < Number(this.minRange)
                || Number(range) > Number(this.maxRange)) {
                return 0;
            }
            for (let rangeIdx in this.ranges) {
                if (!this.ranges.hasOwnProperty(rangeIdx)) {
                    continue;
                }
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
                    }
                    else if (rangeEntry.interpolationToNextRange === "exponential") {
                        //TODO: Implement exponential damage interpolation
                        return 0;
                    }
                }
            }
            //not in ranges
            return 0;
        }
    }
    MechModelWeapons.WeaponInfo = WeaponInfo;
    //abstract class for weapon state. concrete classes follow below
    //WeaponStateDurationFire, WeaponStateSingleFire, WeaponStateContinuousFire
    class WeaponState {
        constructor(weaponInfo, mechState) {
            this.mechState = mechState;
            this.weaponInfo = weaponInfo;
            this.active = true;
            this.weaponCycle = WeaponCycle.READY;
            this.cooldownLeft = 0;
            this.resetVolleyDelay();
        }
        resetVolleyDelay() {
            this.volleyDelayLeft = this.weaponInfo.volleyDelay;
        }
        stepPrechecks(stepDuration) {
            let newState = null;
            let weaponFired = false;
            let ammoConsumed = 0;
            let cooldownChanged = false;
            if (!this.active) {
                return { newState: newState,
                    weaponFired: weaponFired,
                    ammoConsumed: ammoConsumed,
                    cooldownChanged: cooldownChanged };
            }
            if (this.weaponCycle !== WeaponCycle.FIRING) {
                this.volleyDelayLeft = Math.max(0, this.volleyDelayLeft - stepDuration);
            }
            return null;
        }
        stepStandardFire(stepDuration) {
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
                this.cooldownLeft += newDurationLeft;
            }
            cooldownChanged = true;
            return { newState: newState, cooldownChanged: cooldownChanged };
        }
        stepCooldown(stepDuration) {
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
            return { newState: newState, cooldownChanged: cooldownChanged };
        }
        stepJammed(stepDuration) {
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
            return { newState: newState, cooldownChanged: cooldownChanged };
        }
        gotoState(weaponCycle, updateTimers = true) {
            let prevCooldownLeft = this.cooldownLeft;
            this.weaponCycle = weaponCycle;
            if (updateTimers) {
                this.cooldownLeft = 0;
                this.spoolupLeft = 0;
                this.durationLeft = 0;
                if (weaponCycle === WeaponCycle.READY) {
                    this.currShotsDuringCooldown = this.weaponInfo.shotsDuringCooldown;
                }
                else if (weaponCycle === WeaponCycle.FIRING) {
                    this.durationLeft = this.computeWeaponDuration();
                    this.resetVolleyDelay();
                }
                else if (weaponCycle === WeaponCycle.COOLDOWN) {
                    this.cooldownLeft = this.computeWeaponCooldown();
                }
                else if (weaponCycle === WeaponCycle.COOLDOWN_FIRING) {
                    this.cooldownLeft = prevCooldownLeft;
                }
                else if (weaponCycle === WeaponCycle.SPOOLING) {
                    this.spoolupLeft = Number(this.weaponInfo.spinup);
                }
                else if (weaponCycle === WeaponCycle.DISABLED) {
                    //set cooldown to max so it displays properly in the view
                    this.cooldownLeft = this.computeWeaponCooldown();
                    this.active = false;
                }
                else if (weaponCycle === WeaponCycle.JAMMED) {
                    this.cooldownLeft = this.computeWeaponCooldown();
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
            }
            else {
                return -1; //does not need ammo
            }
        }
        consumeAmmo() {
            let weaponInfo = this.weaponInfo;
            let ammoState = this.mechState.ammoState;
            let ammoConsumed = 0;
            if (this.weaponInfo.requiresAmmo()) {
                ammoConsumed = ammoState.consumeAmmo(weaponInfo.weaponId, weaponInfo.ammoPerShot);
            }
            return ammoConsumed;
        }
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
        getJamProgress() {
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
            //NOTE: Skills affect jam time
            let weaponBonus = this.weaponInfo.weaponBonus;
            let jamTimeMultiplier = 1.0 + weaponBonus.jamduration_multiplier;
            return Number(this.weaponInfo.jamTime * jamTimeMultiplier);
        }
        computeTimeBetweenAutoShots() {
            return Number(this.weaponInfo.timeBetweenAutoShots);
        }
    }
    MechModelWeapons.WeaponState = WeaponState;
    //state for duration fire weapons (e.g. lasers)
    class WeaponStateDurationFire extends WeaponState {
        constructor(weaponInfo, mechState) {
            super(weaponInfo, mechState);
            this.durationLeft = 0;
        }
        canDoubleTap() {
            return false;
        }
        fireWeapon() {
            let newState = null;
            //if not ready to fire, proceed to next weapon
            if (!this.active || !this.canFire()) {
                return { weaponFired: false, ammoConsumed: 0 };
            }
            newState = WeaponCycle.FIRING;
            this.gotoState(newState);
            //assumes duration weapons don't consume ammo
            return { newState: newState, weaponFired: true, ammoConsumed: 0 };
        }
        step(stepDuration) {
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
            }
            else if (this.weaponCycle === WeaponCycle.COOLDOWN) {
                let cooldownStatus = this.stepCooldown(stepDuration);
                newState = cooldownStatus.newState;
                cooldownChanged = cooldownStatus.cooldownChanged;
            }
            return { newState: newState,
                weaponFired: weaponFired,
                ammoConsumed: ammoConsumed,
                cooldownChanged: cooldownChanged };
        }
        canFire() {
            return this.weaponCycle === WeaponCycle.READY;
        }
        computeMaxDPS(range) {
            let weaponInfo = this.weaponInfo;
            let baseDamage = weaponInfo.damageAtRange(range);
            return baseDamage
                / (this.computeWeaponCooldown() + this.computeWeaponDuration());
        }
    }
    MechModelWeapons.WeaponStateDurationFire = WeaponStateDurationFire;
    //Single fire weapons (ACs, PPCs, UACs, Gauss)
    class WeaponStateSingleFire extends WeaponState {
        constructor(weaponInfo, mechState) {
            super(weaponInfo, mechState);
            this.spoolupLeft = 0;
            this.jamLeft = 0;
            this.currShotsDuringCooldown = weaponInfo.shotsDuringCooldown;
        }
        canDoubleTap() {
            return this.weaponInfo.shotsDuringCooldown > 0;
        }
        fireWeapon() {
            let newState = null;
            let weaponInfo = this.weaponInfo;
            let mechState = this.mechState;
            //if not ready to fire, proceed to next weapon
            if (!this.active || !this.canFire()) {
                return { newState: newState, weaponFired: false, ammoConsumed: 0 };
            }
            //if no ammo, return
            if (weaponInfo.requiresAmmo() &&
                this.getAvailableAmmo() <= 0) {
                return { newState: newState, weaponFired: false, ammoConsumed: 0 };
            }
            if (weaponInfo.spinup > 0) {
                //if weapon has spoolup, set state to SPOOLING and set value of spoolupLeft
                newState = WeaponCycle.SPOOLING;
                this.gotoState(newState);
                return { newState: newState, weaponFired: false, ammoConsumed: 0 };
            }
            else {
                let weaponFired = false;
                let ammoConsumed = 0;
                if (this.weaponCycle === WeaponCycle.READY) {
                    newState = WeaponCycle.FIRING;
                    this.gotoState(newState);
                    weaponFired = true;
                }
                else if (this.weaponCycle === WeaponCycle.COOLDOWN) {
                    //try double tap
                    let stateChange = this.tryDoubletap();
                    newState = stateChange.newState;
                    weaponFired = stateChange.weaponFired;
                }
                if (weaponFired) {
                    if (weaponInfo.requiresAmmo()) {
                        ammoConsumed = this.consumeAmmo();
                        ;
                    }
                }
                return { newState: newState, weaponFired: weaponFired, ammoConsumed: ammoConsumed };
            }
        }
        tryDoubletap() {
            let simSettings = SimulatorSettings.getSimulatorParameters();
            if (simSettings.uacJAMMethod === UACJamMethod.RANDOM) {
                let rand = Math.random();
                if (rand <= this.computeJamChance()) {
                    //JAM
                    return this.weaponJam();
                }
                else {
                    return this.doubleTap();
                }
            }
            else if (simSettings.uacJAMMethod === UACJamMethod.EXPECTED_VALUE) {
                //add expected jam time to cooldown
                this.cooldownLeft += this.computeJamTime() * this.computeJamChance();
                return this.doubleTap();
            }
            else {
                throw Error("Unexpected UACJamMethod : " + simSettings.uacJAMMethod);
            }
        }
        weaponJam() {
            Util.log("Jam: " + this.weaponInfo.name);
            let newState = WeaponCycle.JAMMED;
            this.gotoState(newState);
            let weaponFired = false;
            return { newState, weaponFired };
        }
        doubleTap() {
            Util.log("Double tap: " + this.weaponInfo.name);
            let newState = WeaponCycle.COOLDOWN_FIRING;
            this.gotoState(newState);
            this.currShotsDuringCooldown -= 1;
            let weaponFired = true;
            return { newState, weaponFired };
        }
        step(stepDuration) {
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
                        ammoConsumed = this.consumeAmmo();
                        ;
                    }
                    weaponFired = true;
                }
                cooldownChanged = true;
            }
            else if (this.weaponCycle === WeaponCycle.FIRING) {
                let fireStatus = this.stepStandardFire(stepDuration);
                newState = fireStatus.newState;
                cooldownChanged = fireStatus.cooldownChanged;
            }
            else if (this.weaponCycle === WeaponCycle.COOLDOWN ||
                this.weaponCycle === WeaponCycle.COOLDOWN_FIRING) {
                if (this.weaponCycle === WeaponCycle.COOLDOWN_FIRING) {
                    newState = WeaponCycle.COOLDOWN;
                    this.gotoState(newState, false);
                }
                let cooldownStatus = this.stepCooldown(stepDuration);
                newState = newState || cooldownStatus.newState;
                cooldownChanged = cooldownStatus.cooldownChanged;
            }
            else if (this.weaponCycle === WeaponCycle.JAMMED) {
                let jamStatus = this.stepJammed(stepDuration);
                newState = jamStatus.newState;
                cooldownChanged = jamStatus.cooldownChanged;
            }
            return { newState: newState,
                weaponFired: weaponFired,
                ammoConsumed: ammoConsumed,
                cooldownChanged: cooldownChanged };
        }
        canFire() {
            return this.weaponCycle === WeaponCycle.READY ||
                (this.weaponCycle === WeaponCycle.COOLDOWN &&
                    this.currShotsDuringCooldown > 0 &&
                    this.volleyDelayLeft <= 0);
        }
        computeMaxDPS(range) {
            let weaponInfo = this.weaponInfo;
            let baseDamage = weaponInfo.damageAtRange(range);
            //Double tap
            if (weaponInfo.shotsDuringCooldown) {
                baseDamage += weaponInfo.shotsDuringCooldown * baseDamage;
            }
            return baseDamage / (this.computeWeaponCooldown());
        }
    }
    MechModelWeapons.WeaponStateSingleFire = WeaponStateSingleFire;
    //Continuous fire weapons (MGs, Flamers, RACs)
    const MAXJAM = 100;
    class WeaponStateContinuousFire extends WeaponState {
        constructor(weaponInfo, mechState) {
            super(weaponInfo, mechState);
            this.timeToNextAutoShot = 0;
            this.isOnAutoFire = false;
            this.jamLeft = 0;
            this.jamBarProgress = 0; //0 to MAXJAM
            this.resetRampup();
        }
        canDoubleTap() {
            return false;
        }
        hasJamBar() {
            return this.weaponInfo.jamRampUpTime > 0;
        }
        //returns 0 to 1
        getJamProgress() {
            return this.jamBarProgress / MAXJAM;
        }
        incrementJamBar(stepDuration) {
            let stepProgress = MAXJAM * (stepDuration / this.weaponInfo.jamRampUpTime);
            this.jamBarProgress = Math.min(MAXJAM, this.jamBarProgress + stepProgress);
        }
        decrementJamBar(stepDuration) {
            let stepProgress = MAXJAM * (stepDuration / this.weaponInfo.jamRampDownTime);
            this.jamBarProgress = Math.max(0, this.jamBarProgress - stepProgress);
        }
        resetRampup() {
            this.rampUpLeft = this.weaponInfo.rampUpTime ?
                Number(this.weaponInfo.rampUpTime) : 0;
        }
        fireWeapon() {
            let newState = null;
            let weaponInfo = this.weaponInfo;
            let mechState = this.mechState;
            //if not ready to fire, proceed to next weapon
            if (!this.active || !this.canFire()) {
                return { newState: newState, weaponFired: false, ammoConsumed: 0 };
            }
            //if no ammo, proceed to next weapon
            if (weaponInfo.requiresAmmo() &&
                this.getAvailableAmmo() <= 0) {
                return { newState: newState, weaponFired: false, ammoConsumed: 0 };
            }
            //if weapon has no duration, set state to FIRING, will go to cooldown on the next step
            let weaponFired = false;
            let ammoConsumed = 0;
            if (this.weaponCycle === WeaponCycle.READY) {
                newState = WeaponCycle.FIRING;
                this.gotoState(newState);
                this.isOnAutoFire = true;
                //weapon not fired here, will be handled by step()
            }
            else if (this.weaponCycle === WeaponCycle.FIRING) {
                //auto fire, step() will handle the actual firing of the weapon
                this.isOnAutoFire = true;
            }
            if (weaponFired) {
                if (weaponInfo.requiresAmmo()) {
                    ammoConsumed = this.consumeAmmo();
                    ;
                }
            }
            return { newState: newState, weaponFired: weaponFired, ammoConsumed: ammoConsumed };
        }
        step(stepDuration) {
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
                            Util.log("Jam: " + this.weaponInfo.name);
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
            }
            else {
                this.decrementJamBar(stepDuration);
                this.resetRampup();
                if (this.weaponCycle === WeaponCycle.COOLDOWN) {
                    let cooldownStatus = this.stepCooldown(stepDuration);
                    newState = cooldownStatus.newState;
                    cooldownChanged = cooldownStatus.cooldownChanged;
                }
                else if (this.weaponCycle === WeaponCycle.JAMMED) {
                    let jamStatus = this.stepJammed(stepDuration);
                    newState = jamStatus.newState;
                    cooldownChanged = jamStatus.cooldownChanged;
                }
            }
            return { newState: newState,
                weaponFired: weaponFired,
                ammoConsumed: ammoConsumed,
                cooldownChanged: cooldownChanged };
        }
        stepAutoFire(stepDuration) {
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
                        ammoConsumed = this.consumeAmmo();
                        ;
                    }
                    //decrease time to next auto shot with newTimetoAutoShot if the shot
                    //occurs in the middle of the tick
                    this.timeToNextAutoShot =
                        this.computeTimeBetweenAutoShots() + newTimeToAutoShot;
                    weaponFired = true;
                    //set new state just so the view gets an update to the weapon status (which includes ammo)
                    newState = WeaponCycle.FIRING;
                }
            }
            else {
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
            return { newState: newState,
                weaponFired: weaponFired,
                ammoConsumed: ammoConsumed,
                cooldownChanged: cooldownChanged };
        }
        canFire() {
            return this.weaponCycle === WeaponCycle.READY ||
                (this.weaponCycle === WeaponCycle.FIRING &&
                    this.weaponInfo.isContinuousFire());
        }
        computeMaxDPS(range) {
            let weaponInfo = this.weaponInfo;
            let baseDamage = weaponInfo.damageAtRange(range);
            //number of autoshots per second
            let rof = 1000 / this.computeTimeBetweenAutoShots();
            return baseDamage * rof;
        }
    }
    MechModelWeapons.WeaponStateContinuousFire = WeaponStateContinuousFire;
    class WeaponStateOneShot extends WeaponStateSingleFire {
        constructor(weaponInfo, mechState) {
            super(weaponInfo, mechState);
            this.ammoRemaining = Number(this.weaponInfo.ammoPerShot);
        }
        getAvailableAmmo() {
            if (this.weaponInfo.requiresAmmo()) {
                return this.ammoRemaining;
            }
            else {
                throw Error("Unexpected: single shot weapon that does not require ammo");
            }
        }
        consumeAmmo() {
            let ret = this.ammoRemaining;
            this.ammoRemaining = 0;
            return ret;
        }
        computeMaxDPS(range) {
            let weaponInfo = this.weaponInfo;
            let baseDamage = weaponInfo.damageAtRange(range);
            return baseDamage;
        }
    }
    MechModelWeapons.WeaponStateOneShot = WeaponStateOneShot;
})(MechModelWeapons || (MechModelWeapons = {}));
;
//Classes that represent the states of the mechs in the simulation,
//and methos to populate them from smurfy data
var MechModel;
//Classes that represent the states of the mechs in the simulation,
//and methos to populate them from smurfy data
(function (MechModel) {
    var Team = MechModelCommon.Team;
    var Component = MechModelCommon.Component;
    var WeaponCycle = MechModelCommon.WeaponCycle;
    var UpdateType = MechModelCommon.UpdateType;
    var EngineType = MechModelCommon.EngineType;
    var SmurfyWeaponData = null;
    var SmurfyAmmoData = null;
    var SmurfyModuleData = null;
    var SmurfyMechData = null;
    var SmurfyOmnipodData = null;
    var SmurfyCTOmnipods = null;
    var mechTeams = {}; //Team -> Mech[]
    mechTeams[Team.BLUE] = [];
    mechTeams[Team.RED] = [];
    var teamStats = {}; //format is {<team> : <teamStats>}
    var mechIdMap = {}; //mechId -> boolean
    class MechInfo {
        constructor(mechId, smurfyMechLoadout) {
            this.mechId = mechId;
            this.smurfyMechId = smurfyMechLoadout.mech_id;
            this.smurfyLoadoutId = smurfyMechLoadout.id;
            var smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
            this.mechName = smurfyMechData.name;
            this.mechTranslatedName = smurfyMechData.translated_name;
            this.tons = Number(smurfyMechData.details.tons);
            this.mechType = smurfyMechData.mech_type;
            this.faction = smurfyMechData.faction;
            this.smurfyMechLoadout = smurfyMechLoadout;
            //NOTE: Quirks should be set before creating WeaponInfos
            if (MechModel.isOmnimech(smurfyMechLoadout)) {
                this.quirks = MechModelQuirks.collectOmnipodQuirks(smurfyMechLoadout);
            }
            else {
                this.quirks = MechModelQuirks.collectMechQuirks(smurfyMechData);
            }
            this.skillQuirks = []; //is set using applySkillQuirks
            this.initComputedValues();
        }
        initComputedValues() {
            //NOTE: General quirk bonus must be computed before collecting heatsinks
            //(bonus is used in computing heatdissipation)
            let combinedQuirks = this.quirks;
            if (this.skillQuirks) {
                combinedQuirks = combinedQuirks.concat(this.skillQuirks);
            }
            this.generalQuirkBonus = MechModelQuirks.getGeneralBonus(combinedQuirks);
            this.mechHealth = mechHealthFromSmurfyMechLoadout(this.smurfyMechLoadout, combinedQuirks);
            this.weaponInfoList = weaponInfoListFromSmurfyMechLoadout(this.smurfyMechLoadout, this);
            this.heatsinkInfoList = heatsinkListFromSmurfyMechLoadout(this.smurfyMechLoadout);
            this.ammoBoxList = ammoBoxListFromSmurfyMechLoadout(this.smurfyMechLoadout, combinedQuirks);
            this.engineInfo = engineInfoFromSmurfyMechLoadout(this.smurfyMechLoadout);
        }
        applySkillQuirks(skillQuirks) {
            this.skillQuirks = skillQuirks;
            this.initComputedValues();
        }
        setSkillState(skillState) {
            this.skillState = skillState;
        }
    }
    MechModel.MechInfo = MechInfo;
    class Heatsink {
        constructor(location, smurfyModuleData) {
            this.location = location;
            this.heatsinkId = smurfyModuleData.id;
            this.name = smurfyModuleData.name;
            this.active = true;
            this.cooling = smurfyModuleData.stats.cooling;
            this.engineCooling = smurfyModuleData.stats.engineCooling;
            this.internalHeatCapacity = smurfyModuleData.stats.internal_heat_capacity;
            this.externalHeatCapacity = smurfyModuleData.stats.external_heat_capacity;
            //keep smurfy module data for cloning
            this.smurfyModuleData = smurfyModuleData;
        }
        clone() {
            return new Heatsink(this.location, this.smurfyModuleData);
        }
    }
    MechModel.Heatsink = Heatsink;
    //Reference for damage mechanics:
    //http://mwomercs.com/forums/topic/176345-understanding-damage/
    //TODO: Find a non-random way to simulate critical hits
    class MechHealth {
        constructor(componentHealthList) {
            //TODO: try to get rid of this componentHealth list
            this.componentHealthList = componentHealthList; //[ComponentHealth...]
            this.componentHealthMap = {};
            for (let component of componentHealthList) {
                this.componentHealthMap[component.location] = component;
            }
        }
        getComponentHealth(location) {
            return this.componentHealthMap[location];
        }
        isIntact(location) {
            return this.getComponentHealth(location).isIntact();
        }
        takeDamage(location, numDamage) {
            return this.componentHealthMap[location].takeDamage(numDamage);
        }
        totalCurrHealth() {
            let ret = 0;
            for (let componentHealthEntry of this.componentHealthList) {
                ret = Number(ret) + componentHealthEntry.totalCurrHealth();
            }
            return ret;
        }
        totalMaxHealth() {
            let ret = 0;
            for (let componentHealthEntry of this.componentHealthList) {
                ret = Number(ret) + componentHealthEntry.totalMaxHealth();
            }
            return ret;
        }
        clone() {
            let newComponentHealth = [];
            for (let componentHealthEntry of this.componentHealthList) {
                newComponentHealth.push(componentHealthEntry.clone());
            }
            return new MechHealth(newComponentHealth);
        }
    }
    class ComponentHealth {
        constructor(location, armor, structure, maxArmor, maxStructure) {
            this.location = location;
            this.armor = armor; //current armor. used in state
            this.structure = structure;
            this.baseMaxArmor = maxArmor; //maximum armor from loadout
            this.baseMaxStructure = maxStructure; //maximum structure from loadout
        }
        //applies bonus from quirks.
        applyQuirkBonus(bonus) {
            this.quirkBonus = bonus;
            this.resetToFullHealth();
        }
        resetToFullHealth() {
            this.armor = this.maxArmor;
            this.structure = this.maxStructure;
        }
        get maxArmor() {
            let ret = this.baseMaxArmor;
            if (this.quirkBonus) {
                ret += Number(this.quirkBonus.armor);
                ret = ret * Number(this.quirkBonus.armor_multiplier);
            }
            return ret;
        }
        get maxStructure() {
            let ret = this.baseMaxStructure;
            if (this.quirkBonus) {
                ret += Number(this.quirkBonus.structure);
                ret = ret * Number(this.quirkBonus.structure_multiplier);
            }
            return ret;
        }
        isIntact() {
            return this.structure > 0;
        }
        //returns a ComponentDamage with actual damage dealt
        //NOTE: Does not take rear components into account
        takeDamage(numDamage) {
            let ret = new ComponentDamage(this.location, 0, 0);
            if (numDamage <= this.armor) {
                this.armor = Number(this.armor) - numDamage;
                ret.addArmorDamage(numDamage);
                numDamage = 0;
            }
            else if (numDamage > this.armor) {
                numDamage = Number(numDamage) - Number(this.armor);
                ret.addArmorDamage(this.armor);
                this.armor = 0;
            }
            if (!MechModelCommon.isRearComponent(this.location)) {
                if (numDamage <= this.structure) {
                    ret.addStructureDamage(numDamage);
                    this.structure = Number(this.structure) - numDamage;
                    numDamage = 0;
                }
                else {
                    ret.addStructureDamage(this.structure);
                    numDamage = Number(numDamage) - Number(this.structure);
                    this.structure = 0;
                }
            }
            else {
                //TODO: Deal with rear structure damage
            }
            return ret;
        }
        totalCurrHealth() {
            return Number(this.armor) +
                ((this.structure) ? Number(this.structure) : 0); //special case for undefined structure in rear components
        }
        totalMaxHealth() {
            return Number(this.maxArmor) +
                ((this.maxStructure) ? Number(this.maxStructure) : 0); //special case for undefined structure in rear components
        }
        clone() {
            let ret = new ComponentHealth(this.location, this.armor, this.structure, this.baseMaxArmor, this.baseMaxStructure);
            if (this.quirkBonus) {
                ret.applyQuirkBonus(this.quirkBonus);
            }
            return ret;
        }
    }
    MechModel.ComponentHealth = ComponentHealth;
    class GhostHeatEntry {
        constructor(timeFired, weaponState) {
            this.timeFired = timeFired;
            this.weaponState = weaponState;
        }
    }
    MechModel.GhostHeatEntry = GhostHeatEntry;
    ;
    class MechState {
        constructor(mechInfo) {
            //Calculates the ghost heat incurred by a weapon
            //Note that this method has a side effect: it removes stale GhostHeatEntries
            //and adds a new GhostHeatEntry for the weapon
            this.computeGhostHeat = function (weaponState, simTime) {
                const HEATMULTIPLIER = [0, 0, 0.08, 0.18, 0.30, 0.45, 0.60, 0.80, 1.10, 1.50, 2.00, 3.00, 5.00];
                let weaponInfo = weaponState.weaponInfo;
                let mechState = this;
                //Get the list of ghost heat weapons of the same heatPenaltyId fired from the mech
                if (!mechState.ghostHeatMap) {
                    mechState.ghostHeatMap = {};
                }
                let ghostHeatWeapons = mechState.ghostHeatMap[weaponInfo.heatPenaltyId];
                if (!ghostHeatWeapons) {
                    ghostHeatWeapons = [];
                    mechState.ghostHeatMap[weaponInfo.heatPenaltyId] = ghostHeatWeapons;
                }
                //Go through the list of ghost heat weapons and remove those that have been
                //fired outside the ghost heat interval
                while (ghostHeatWeapons.length > 0
                    && (simTime - ghostHeatWeapons[0].timeFired > GlobalGameInfo._MechGlobalGameInfo.ghost_heat_interval)) {
                    ghostHeatWeapons.shift();
                }
                //see if any of the remaining entries are from the same weapon. In that case
                //just update the time fired field instead of adding a new entry
                let addNewEntry = true;
                for (let ghostHeatIdx in ghostHeatWeapons) {
                    if (!ghostHeatWeapons.hasOwnProperty(ghostHeatIdx)) {
                        continue;
                    }
                    let ghostHeatEntry = ghostHeatWeapons[ghostHeatIdx];
                    if (ghostHeatEntry.weaponState === weaponState) {
                        //update time, remove from array and put at the end of the queue
                        ghostHeatEntry.timeFired = simTime;
                        ghostHeatWeapons.splice(Number(ghostHeatIdx), 1);
                        ghostHeatWeapons.push(ghostHeatEntry);
                        addNewEntry = false;
                        break;
                    }
                }
                if (addNewEntry) {
                    let ghostHeatEntry = new GhostHeatEntry(simTime, weaponState);
                    ghostHeatWeapons.push(ghostHeatEntry);
                }
                //calcluate ghost heat
                let ghostHeat = 0;
                if (ghostHeatWeapons.length >= weaponInfo.minHeatPenaltyLevel) {
                    ghostHeat = HEATMULTIPLIER[ghostHeatWeapons.length]
                        * Number(weaponInfo.heatPenalty)
                        * Number(weaponInfo.heat);
                }
                return ghostHeat;
            };
            this.mechInfo = mechInfo;
            this.mechHealth = mechInfo.mechHealth.clone();
            this.heatState = new HeatState(mechInfo);
            this.weaponStateList = initWeaponStateList(this);
            this.ammoState = new AmmoState(mechInfo);
            this.updateTypes = {}; //Update types triggered on the current simulation step
            this.ghostHeatMap = {}; //weaponId -> [GhostHeatEntry]. Used in ghost heat computations.
            this.mechStats = new MechStats(); //stats set in simulation logic
        }
        setUpdate(updateType) {
            this.updateTypes[updateType] = true;
        }
        isAlive() {
            let mechHealth = this.mechHealth;
            let engineInfo = this.mechInfo.engineInfo;
            return mechHealth.isIntact(Component.HEAD) &&
                mechHealth.isIntact(Component.CENTRE_TORSO) &&
                (mechHealth.isIntact(Component.LEFT_LEG)
                    || mechHealth.isIntact(Component.RIGHT_LEG)) &&
                //xl engine implies both torsos still intact
                (!(engineInfo.getEngineType() === EngineType.XL) ||
                    (mechHealth.isIntact(Component.LEFT_TORSO)
                        && mechHealth.isIntact(Component.RIGHT_TORSO))) &&
                //clan xl engine implies at least one side torso is intact
                (!(engineInfo.getEngineType() === EngineType.CLAN_XL ||
                    engineInfo.getEngineType() === EngineType.LIGHT) ||
                    (mechHealth.isIntact(Component.LEFT_TORSO)
                        || mechHealth.isIntact(Component.RIGHT_TORSO)));
        }
        //Takes damage to components specified in weaponDamage.
        //Returns a MechDamage object that describes how much damage the mech took
        //MechDamage includes damage from destroyed components
        //reference: http://mwomercs.com/forums/topic/176345-understanding-damage/
        takeDamage(weaponDamage) {
            let totalDamage = new MechDamage();
            for (let location in weaponDamage.damageMap) {
                if (!weaponDamage.damageMap.hasOwnProperty(location)) {
                    continue;
                }
                let numDamage = weaponDamage.getDamage(location);
                //apply damage to location
                let componentDamage = this.mechHealth.takeDamage(location, numDamage);
                totalDamage.addComponentDamage(componentDamage);
                //destroy components if necessary
                if (!this.mechHealth.isIntact(location) && componentDamage.totalDamage() > 0) {
                    if (numDamage > componentDamage.totalDamage()) {
                        let transferDamage = numDamage - componentDamage.totalDamage();
                        let transferLocation = getTransferDamageLocation(location);
                        if (transferLocation) {
                            let transferResult = this.mechHealth.takeDamage(transferLocation, transferDamage);
                            totalDamage.addComponentDamage(transferResult);
                        }
                    }
                    let destroyComponentDamage = this.destroyComponent(location, false);
                    totalDamage.add(destroyComponentDamage);
                    //destroy connected arms if torsos are destroyed
                    if (location === Component.LEFT_TORSO) {
                        destroyComponentDamage = this.destroyComponent(Component.LEFT_ARM, true);
                        totalDamage.add(destroyComponentDamage);
                    }
                    else if (location === Component.RIGHT_TORSO) {
                        destroyComponentDamage = this.destroyComponent(Component.RIGHT_ARM, true);
                        totalDamage.add(destroyComponentDamage);
                    }
                    //update heatStat changes due to component destruction
                    this.updateHeatStats(location);
                }
            }
            return totalDamage;
        }
        //Disables all weapons, heatsinks and ammoboxes in a component.
        //Also destroys adjacent arm components if the component is a torso
        //Returns a MechDamage that contains any extra damage caused by
        //the component destruction
        //includeArmor is true if the remaining armor shoud be added to the component
        //destruction damage (i.e. when destroying arms after a torso destruction)
        destroyComponent(location, includeArmor) {
            let destructionDamage = new MechDamage();
            let componentHealth = this.mechHealth.getComponentHealth(location);
            //add remaining structure to destruction damage.
            let structureDamage = componentHealth.structure;
            let armorDamage = includeArmor ? componentHealth.armor : 0;
            destructionDamage.addComponentDamage(new ComponentDamage(location, armorDamage, structureDamage));
            //reduce the component health values
            componentHealth.structure = 0;
            if (includeArmor) {
                componentHealth.armor = 0;
            }
            //disable weapons in the component
            this.disableWeapons(location);
            //disable heatsinks in the component
            this.disableHeatsinks(location);
            //disable ammoboxes in the component
            let disabledAmmo = this.ammoState.disableAmmoBoxes(location);
            if (disabledAmmo.length > 0) {
                this.setUpdate(UpdateType.WEAPONSTATE);
            }
            return destructionDamage;
        }
        disableWeapons(location) {
            for (let weaponState of this.weaponStateList) {
                let weaponInfo = weaponState.weaponInfo;
                if (weaponInfo.location === location) {
                    weaponState.gotoState(WeaponCycle.DISABLED);
                    this.setUpdate(UpdateType.WEAPONSTATE);
                }
            }
        }
        disableHeatsinks(location) {
            for (let heatsink of this.heatState.currHeatsinkList) {
                if (heatsink.location === location) {
                    heatsink.active = false;
                    this.setUpdate(UpdateType.HEAT);
                }
            }
        }
        //update heat stats on component destruction
        updateHeatStats(location) {
            //reduce engine heat efficiency if clan xl engine
            let engineInfo = this.heatState.engineInfo;
            let heatState = this.heatState;
            if (engineInfo.getEngineType() === EngineType.CLAN_XL ||
                engineInfo.getEngineType() === EngineType.LIGHT) {
                if (location === Component.LEFT_TORSO ||
                    location === Component.RIGHT_TORSO) {
                    heatState.engineHeatEfficiency =
                        Number(GlobalGameInfo._MechGlobalGameInfo.reduced_xl_heat_efficiency);
                }
            }
            //recompute heat stats
            let heatStats = calculateHeatStats(heatState.currHeatsinkList, heatState.engineInfo, heatState.engineHeatEfficiency, this.mechInfo.generalQuirkBonus);
            heatState.currHeatDissipation = heatStats.heatDissipation;
            heatState.currMaxHeat = heatStats.heatCapacity;
            this.setUpdate(UpdateType.HEAT);
        }
        clearMechStats() {
            this.mechStats = new MechStats();
        }
        getTotalDamageAtRange(range) {
            let totalDamage = 0;
            for (let weaponState of this.weaponStateList) {
                if (!weaponState.active) {
                    continue;
                }
                totalDamage += Number(weaponState.weaponInfo.damageAtRange(range));
            }
            return totalDamage;
        }
        //Compute the heat caused by firing a set of weapons
        //Ghost heat reference: http://mwomercs.com/forums/topic/127904-heat-scale-the-maths/
        computeHeat(weaponsFired, simTime) {
            let totalHeat = 0;
            //sort weaponInfoList in increasing order of heat for ghost heat processing
            var compareHeat = function (weapon1, weapon2) {
                return Number(weapon1.computeHeat()) - Number(weapon1.computeHeat());
            };
            weaponsFired.sort(compareHeat);
            for (let weaponState of weaponsFired) {
                let weaponInfo = weaponState.weaponInfo;
                totalHeat += Number(weaponState.computeHeat()); // base heat
                let ghostHeat = this.computeGhostHeat(weaponState, simTime);
                totalHeat += ghostHeat;
            }
            return totalHeat;
        }
        copyGhostHeatMap(ghostHeatMap) {
            if (!ghostHeatMap) {
                return ghostHeatMap;
            }
            let ret = {};
            for (let key in ghostHeatMap) {
                if (!ghostHeatMap.hasOwnProperty(key)) {
                    continue;
                }
                ret[key] = Array.from(ghostHeatMap[key]);
            }
            return ret;
        }
        //Computes total heat for the set of weapons fired, but restores the
        //ghost heat map to its previous state afterwards
        predictHeat(weaponsFired, simTime) {
            let mechState = this;
            let prevGhostHeatMap = mechState.ghostHeatMap;
            mechState.ghostHeatMap = this.copyGhostHeatMap(prevGhostHeatMap);
            let ret = this.computeHeat(weaponsFired, simTime);
            mechState.ghostHeatMap = prevGhostHeatMap;
            return ret;
        }
        predictBaseHeat(weaponsFired) {
            let ret = 0;
            for (let weaponState of weaponsFired) {
                ret = ret + Number(weaponState.computeHeat());
            }
            return ret;
        }
    }
    MechModel.MechState = MechState;
    class HeatState {
        constructor(mechInfo) {
            this.currHeat = 0;
            this.engineHeatEfficiency = 1;
            let heatStats = calculateHeatStats(mechInfo.heatsinkInfoList, mechInfo.engineInfo, this.engineHeatEfficiency, mechInfo.generalQuirkBonus);
            Util.log("Heatcalc: " + mechInfo.mechName
                + " dissipation: " + heatStats.heatDissipation
                + " capacity: " + heatStats.heatCapacity);
            this.currHeatDissipation = heatStats.heatDissipation;
            this.currMaxHeat = heatStats.heatCapacity;
            //Copy engine info from mech info
            this.engineInfo = mechInfo.engineInfo.clone();
            //Copy heatsink info from mech info
            this.currHeatsinkList = [];
            for (let heatsink of mechInfo.heatsinkInfoList) {
                this.currHeatsinkList.push(heatsink.clone());
            }
        }
    }
    MechModel.HeatState = HeatState;
    ;
    class AmmoState {
        constructor(mechInfo) {
            let sourceAmmoBoxList = mechInfo.ammoBoxList;
            this.ammoCounts = {}; //weaponId->AmmoCount
            this.ammoBoxList = [];
            for (let ammoBox of sourceAmmoBoxList) {
                this.ammoBoxList.push(ammoBox.clone());
            }
            //sort ammoBoxList in ammo consumption order so the lists in the ammoCounts
            //are also sorted in consumption order
            //reference:
            //https://mwomercs.com/forums/topic/
            //65553-guide-ammo-depleting-priorities-or-in-what-order-is-your-ammo-being-used/
            let ammoLocationOrderIndex = function (location) {
                const locationOrder = [Component.HEAD, Component.CENTRE_TORSO, Component.RIGHT_TORSO,
                    Component.LEFT_TORSO, Component.LEFT_ARM, Component.RIGHT_ARM,
                    Component.LEFT_LEG, Component.RIGHT_LEG];
                let idx = 0;
                for (idx = 0; idx < locationOrder.length; idx++) {
                    if (location === locationOrder[idx]) {
                        return idx;
                    }
                }
            };
            this.ammoBoxList.sort((x, y) => {
                return ammoLocationOrderIndex(x.location) -
                    ammoLocationOrderIndex(y.location);
            });
            for (let idx in this.ammoBoxList) {
                if (!this.ammoBoxList.hasOwnProperty(idx)) {
                    continue;
                }
                let ammoBox = this.ammoBoxList[idx];
                let firstWeaponId = ammoBox.weaponIds[0];
                //Create an ammocount for the weapon if it is not yet in the map
                if (!this.ammoCounts[firstWeaponId]) {
                    let newAmmoCount = new AmmoCount(ammoBox.type);
                    this.ammoCounts[firstWeaponId] = newAmmoCount;
                    //Map all the weapons that can use the ammo to the ammo count
                    for (let weaponId of ammoBox.weaponIds) {
                        this.ammoCounts[weaponId] = newAmmoCount;
                    }
                }
                //Add the ammoBox to the ammoCount for the weapon
                this.ammoCounts[firstWeaponId].addAmmoBox(ammoBox);
            }
        }
        //returns the amount of ammo available for a given weapon id.
        ammoCountForWeapon(weaponId) {
            let ammoCount = this.ammoCounts[weaponId];
            if (ammoCount) {
                return ammoCount.ammoCount;
            }
            else {
                return 0;
            }
        }
        //tries to consume a given amount of ammo for a weaponInfo
        //returns the amount of ammo actually consumed
        consumeAmmo(weaponId, amount) {
            let ammoCount = this.ammoCounts[weaponId];
            if (ammoCount) {
                return ammoCount.consumeAmmo(amount);
            }
            else {
                return 0;
            }
        }
        //Disables ammo boxes and reduces the corresponding AmmoCount
        //Returns the set of disabled ammo boxes
        disableAmmoBoxes(location) {
            let ret = [];
            for (let ammoBox of this.ammoBoxList) {
                if (ammoBox.location === location) {
                    ammoBox.intact = false;
                    let firstWeaponId = ammoBox.weaponIds[0];
                    let ammoCount = this.ammoCounts[firstWeaponId];
                    ammoCount.ammoCount = Number(ammoCount.ammoCount) - Number(ammoBox.ammoCount);
                    ammoBox.ammoCount = 0;
                    ret.push(ammoBox);
                }
            }
            return ret;
        }
    }
    MechModel.AmmoState = AmmoState;
    //The amount of ammo for a given set of weapons
    class AmmoCount {
        constructor(type) {
            this.type = type;
            this.weaponIds = [];
            this.ammoCount = 0; //Total ammo count of all the boxes in the ammoBoxList
            this.ammoBoxList = []; //[AmmoBox...]
            this.maxAmmoCount = 0;
            this.currAmmoBoxIdx = 0;
        }
        addAmmoBox(ammoBox) {
            this.weaponIds = ammoBox.weaponIds;
            this.ammoCount += Number(ammoBox.ammoCount);
            this.maxAmmoCount += Number(ammoBox.ammoCount);
            this.ammoBoxList.push(ammoBox);
        }
        //tries to consume a given amount of ammo. returns the actual amount of ammo
        //consumed
        consumeAmmo(amount) {
            let amountConsumed = 0;
            while (amount > 0 && this.currAmmoBoxIdx < this.ammoBoxList.length) {
                let currAmmoBox = this.ammoBoxList[this.currAmmoBoxIdx];
                if (currAmmoBox.intact) {
                    //If box contains enough ammo
                    if (currAmmoBox.ammoCount >= amount) {
                        amountConsumed += Number(amount);
                        currAmmoBox.ammoCount -= Number(amount);
                        amount = 0;
                        break;
                    }
                    else {
                        //if box does not contain enough ammo, consume what remains
                        //and proceed to the next box
                        amountConsumed += currAmmoBox.ammoCount;
                        amount -= currAmmoBox.ammoCount;
                        currAmmoBox.ammoCount = 0;
                    }
                }
                this.currAmmoBoxIdx++;
            }
            this.ammoCount -= amountConsumed; //update the total ammo count
            return amountConsumed;
        }
    }
    MechModel.AmmoCount = AmmoCount;
    //Represents an ammo box on the mech.
    class AmmoBox {
        constructor(type, location, weaponIds, ammoCount, intact) {
            this.type = type;
            this.location = location;
            this.weaponIds = weaponIds; //[weaponId...]
            this.ammoCount = ammoCount;
            this.intact = intact;
        }
        clone() {
            return new AmmoBox(this.type, this.location, this.weaponIds, this.ammoCount, this.intact);
        }
    }
    MechModel.AmmoBox = AmmoBox;
    class EngineInfo {
        constructor(engineId, name, heatsink, heatsinkCount) {
            this.engineId = engineId; //Same as module id in smurfy ModuleData
            this.name = name; //Readable name, from smurfy ModuleData
            this.heatsink = heatsink; //heatsink object that represents the type of heatsinks in the engine
            this.heatsinkCount = heatsinkCount;
        }
        clone() {
            return new EngineInfo(this.engineId, this.name, this.heatsink.clone(), this.heatsinkCount);
        }
        getEngineType() {
            let engineType;
            let engineMap = {
                "Engine_Std": EngineType.STD,
                "Engine_XL": EngineType.XL,
                "Engine_Clan_XL": EngineType.CLAN_XL,
                "Engine_Light": EngineType.LIGHT,
            };
            for (let enginePrefix in engineMap) {
                if (!engineMap.hasOwnProperty(enginePrefix)) {
                    continue;
                }
                if (this.name.startsWith(enginePrefix)) {
                    return engineMap[enginePrefix];
                }
            }
            throw Error("Unknown engine type. Name: " + name);
        }
    }
    MechModel.EngineInfo = EngineInfo;
    //Represents damage currently being done by a weapon. This gets put in the
    //  weaponFireQueue every time a weapon is fired and its values
    //  (durationLeft or travelLeft as the case may be) are updated every step
    //  by processWeaponFires().
    //When the damage is completed, it is taken off the queue and its total
    //  damage done is added to the sourceMech's stats
    class WeaponFire {
        //may be used later when changing duration length
        //for smoother animation
        constructor(sourceMech, targetMech, weaponState, range, createTime, ammoConsumed, stepDurationFunction) {
            this.sourceMech = sourceMech;
            this.targetMech = targetMech;
            this.weaponState = weaponState;
            this.weaponDamage = null; //full weapon damage
            this.tickWeaponDamage = null; //WeaponDamage done per tick for duration weapons
            this.range = range;
            this.createTime = createTime;
            this.damageDone = new MechDamage();
            this.ammoConsumed = ammoConsumed;
            this.stepDurationFunction = stepDurationFunction;
            let weaponInfo = weaponState.weaponInfo;
            this.totalDuration = weaponInfo.hasDuration() ?
                Number(weaponInfo.duration) : 0;
            this.totalTravel = weaponInfo.hasTravelTime() ?
                Number(range) / Number(weaponInfo.speed) * 1000 : 0; //travel time in milliseconds
            this.durationLeft = this.totalDuration;
            this.travelLeft = this.totalTravel;
            this.complete = false;
            this.initComputedValues(range, stepDurationFunction);
        }
        initComputedValues(range, stepDurationFunction) {
            let targetComponent = this.sourceMech.componentTargetPattern(this.sourceMech, this.targetMech);
            let weaponInfo = this.weaponState.weaponInfo;
            //baseWeaponDamage applies all damage to the target component
            let baseWeaponDamageMap = {};
            let baseDamage = weaponInfo.damageAtRange(range);
            if (weaponInfo.requiresAmmo()) {
                baseDamage = Number(baseDamage) * this.ammoConsumed / weaponInfo.ammoPerShot;
            }
            baseWeaponDamageMap[targetComponent] = baseDamage;
            let baseWeaponDamage = new WeaponDamage(baseWeaponDamageMap);
            let weaponAccuracyPattern = MechAccuracyPattern.getWeaponAccuracyPattern(weaponInfo);
            if (weaponAccuracyPattern) {
                let weaponAccuracyDamage = weaponAccuracyPattern(baseWeaponDamage, range);
                baseWeaponDamage = weaponAccuracyDamage;
            }
            //transform the baseWeaponDamage using the mech's accuracy pattern
            let transformedWeaponDamage = this.sourceMech.accuracyPattern(baseWeaponDamage, range);
            this.weaponDamage = transformedWeaponDamage;
            if (this.totalDuration > 0) {
                let tickDamageMap = {};
                for (let component in this.weaponDamage.damageMap) {
                    if (!this.weaponDamage.damageMap.hasOwnProperty(component)) {
                        continue;
                    }
                    tickDamageMap[component] =
                        Number(this.weaponDamage.getDamage(component))
                            / Number(this.totalDuration) * stepDurationFunction();
                }
                this.tickWeaponDamage = new WeaponDamage(tickDamageMap);
            }
            else {
                this.tickWeaponDamage = this.weaponDamage.clone();
            }
        }
        isComplete() {
            return this.complete;
        }
        step(stepDuration) {
            let weaponInfo = this.weaponState.weaponInfo;
            let sourceMechState = this.sourceMech.getMechState();
            let targetMechState = this.targetMech.getMechState();
            if (weaponInfo.hasDuration()) {
                this.durationLeft = Number(this.durationLeft) - stepDuration;
                if (this.weaponState.active && sourceMechState.isAlive()) {
                    let tickDamageDone;
                    if (this.durationLeft <= 0) {
                        let lastTickDamage = this.tickWeaponDamage.clone();
                        let damageFraction = (stepDuration + this.durationLeft) / stepDuration;
                        lastTickDamage.multiply(damageFraction);
                        tickDamageDone = targetMechState.takeDamage(lastTickDamage);
                        this.damageDone.add(tickDamageDone);
                        this.complete = true;
                    }
                    else {
                        tickDamageDone = targetMechState.takeDamage(this.tickWeaponDamage);
                        this.damageDone.add(tickDamageDone);
                    }
                    targetMechState.setUpdate(UpdateType.HEALTH);
                }
                else {
                    //Weapon disabled before end of burn
                    //add weaponFire.damageDone to mech stats
                    this.complete = true;
                }
            }
            else if (weaponInfo.hasTravelTime()) {
                this.travelLeft = Number(this.travelLeft) - stepDuration;
                if (this.travelLeft <= 0) {
                    let damageDone = targetMechState.takeDamage(this.weaponDamage);
                    this.damageDone.add(damageDone);
                    targetMechState.setUpdate(UpdateType.HEALTH);
                    //add weaponFire.damageDone to mechStats
                    this.complete = true;
                }
                else {
                    //still has travel time
                }
            }
            else {
                //should not happen
                throw Error("Unexpected WeaponFire type");
            }
        }
        toString() {
            let weaponInfo = this.weaponState.weaponInfo;
            return "WeaponFire" +
                " createTime: " + this.createTime +
                (weaponInfo.hasDuration() ? " durationLeft : " + this.durationLeft : "") +
                (weaponInfo.hasTravelTime() ? " travelLeft: " + this.travelLeft : "") +
                " source: " + this.sourceMech.getMechInfo().mechTranslatedName +
                " target: " + this.targetMech.getMechInfo().mechTranslatedName +
                " weapon: " + this.weaponState.weaponInfo.name +
                " weaponDamage: " + this.weaponDamage.toString() +
                " tickWeaponDamage: " + this.tickWeaponDamage.toString() +
                " damageDone: " + this.damageDone.toString();
        }
    }
    MechModel.WeaponFire = WeaponFire;
    //represents damage done to a mech
    //A map from Components -> ComponentDamage
    class MechDamage {
        constructor() {
            this.componentDamage = {}; //Component->ComponentDamage
        }
        add(mechDamage) {
            for (let location in mechDamage.componentDamage) {
                if (!mechDamage.componentDamage.hasOwnProperty(location)) {
                    continue;
                }
                if (!this.componentDamage[location]) {
                    this.componentDamage[location] = new ComponentDamage(location, 0, 0);
                }
                this.componentDamage[location].add(mechDamage.componentDamage[location]);
            }
        }
        addComponentDamage(componentDamage) {
            let location = componentDamage.location;
            if (!this.componentDamage[location]) {
                this.componentDamage[location] = new ComponentDamage(location, 0, 0);
            }
            this.componentDamage[location].add(componentDamage);
        }
        getComponentDamage(location) {
            return this.componentDamage[location];
        }
        totalDamage() {
            let ret = 0;
            for (let component in this.componentDamage) {
                if (!this.componentDamage.hasOwnProperty(component)) {
                    continue;
                }
                ret = Number(ret) + this.componentDamage[component].totalDamage();
            }
            return ret;
        }
        toString() {
            let ret = "";
            for (let location in this.componentDamage) {
                if (!this.componentDamage.hasOwnProperty(location)) {
                    continue;
                }
                ret = ret + " " + this.componentDamage[location].toString();
            }
            return ret;
        }
    }
    MechModel.MechDamage = MechDamage;
    class ComponentDamage {
        constructor(location, armor, structure) {
            this.location = location;
            if (armor) {
                this.armor = armor;
            }
            else {
                this.armor = 0;
            }
            if (structure) {
                this.structure = structure;
            }
            else {
                this.structure = 0;
            }
        }
        add(componentDamage) {
            this.armor += Number(componentDamage.armor);
            this.structure += Number(componentDamage.structure);
            return this;
        }
        addArmorDamage(damage) {
            this.armor += Number(damage);
        }
        addStructureDamage(damage) {
            this.structure += Number(damage);
        }
        totalDamage() {
            return Number(this.armor) + Number(this.structure);
        }
        toString() {
            return "location: " + this.location + " armordmg: " + this.armor + " structdmg: " + this.structure;
        }
    }
    MechModel.ComponentDamage = ComponentDamage;
    ;
    class WeaponDamage {
        constructor(damageMap) {
            this.damageMap = damageMap;
        }
        getDamage(component) {
            return this.damageMap[component];
        }
        multiply(multiplier) {
            for (var location in this.damageMap) {
                if (!this.damageMap.hasOwnProperty(location)) {
                    continue;
                }
                this.damageMap[location] =
                    Number(this.damageMap[location]) * Number(multiplier);
            }
        }
        getTotalDamage() {
            let totalDamage = 0;
            for (let component in this.damageMap) {
                if (!this.damageMap.hasOwnProperty(component)) {
                    continue;
                }
                totalDamage += this.damageMap[component];
            }
            return totalDamage;
        }
        toString() {
            let ret = "totalDamage: " + this.getTotalDamage();
            for (let component in this.damageMap) {
                if (!this.damageMap.hasOwnProperty(component)) {
                    continue;
                }
                ret = ret + " " + component + "=" + this.damageMap[component];
            }
            return ret;
        }
        clone() {
            var newDamageMap = {};
            for (let component in this.damageMap) {
                if (!this.damageMap.hasOwnProperty(component)) {
                    continue;
                }
                newDamageMap[component] = this.damageMap[component];
            }
            return new WeaponDamage(newDamageMap);
        }
    }
    MechModel.WeaponDamage = WeaponDamage;
    class MechStats {
        constructor() {
            this.totalDamage = 0;
            this.totalHeat = 0;
            //list of completed weaponFires. Assumed to be sorted in
            //ascending order of createTime
            this.weaponFires = [];
            this.timeOfDeath = null;
        }
        //assumes simTime >= createTime of last element in the weaponFire list
        getBurstDamage(simTime) {
            let burstDamage = 0;
            for (let idx = this.weaponFires.length - 1; idx > 0; idx--) {
                let weaponFire = this.weaponFires[idx];
                if (simTime - weaponFire.createTime < MechModelCommon.BURST_DAMAGE_INTERVAL) {
                    burstDamage += weaponFire.damageDone.totalDamage();
                }
                else {
                    break;
                }
            }
            return burstDamage;
        }
    }
    MechModel.MechStats = MechStats;
    class TeamStats {
        constructor() {
            this.maxBurstDamage = 0;
        }
    }
    MechModel.TeamStats = TeamStats;
    //Get weapon, ammo and mech data from smurfy
    const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
    const WEAPON_DATA_PATH = "data/weapons.json";
    const AMMO_DATA_PATH = 'data/ammo.json';
    const MODULE_DATA_PATH = 'data/modules.json';
    const MECH_DATA_PATH = 'data/mechs.json';
    const OMNIPOD_DATA_PATH = 'data/omnipods.json';
    var dataPaths = [WEAPON_DATA_PATH, AMMO_DATA_PATH, MODULE_DATA_PATH,
        MECH_DATA_PATH, OMNIPOD_DATA_PATH];
    //dataPath -> DataPathAssignFunction
    var dataPathAssigns = {};
    //TODO: See what the right generic type for the promise is here
    var initDataPromise = function (path) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: SMURFY_PROXY_URL + path,
                type: 'GET',
                dataType: 'JSON'
            })
                .done(function (data) {
                Util.log("Successfully loaded " + path);
                resolve(data);
            })
                .fail(function (data) {
                Util.log("Smurfy " + path + " request failed: " + Error(data));
                reject(Error(data));
            });
        });
    };
    ;
    ;
    var flattenOmnipodData = function (smurfyOmnipodData) {
        let flatOmnipodData = {};
        let ctOmnipodMap = {};
        for (let chassis in smurfyOmnipodData) {
            if (!smurfyOmnipodData.hasOwnProperty(chassis)) {
                continue;
            }
            for (let omnipodId in smurfyOmnipodData[chassis]) {
                if (!smurfyOmnipodData[chassis].hasOwnProperty(omnipodId)) {
                    continue;
                }
                let omnipodEntry = smurfyOmnipodData[chassis][omnipodId];
                flatOmnipodData[omnipodId] = omnipodEntry;
                if (omnipodEntry.details.component === "centre_torso") {
                    ctOmnipodMap[omnipodEntry.details.set] = omnipodEntry;
                }
            }
        }
        return { flatOmnipodData: flatOmnipodData, ctOmnipodMap: ctOmnipodMap };
    };
    MechModel.initModelData = function () {
        //assigns to the correct variable
        dataPathAssigns[WEAPON_DATA_PATH] = function (data) {
            SmurfyWeaponData = data;
        };
        dataPathAssigns[AMMO_DATA_PATH] = function (data) {
            SmurfyAmmoData = data;
        };
        dataPathAssigns[MODULE_DATA_PATH] = function (data) {
            SmurfyModuleData = data;
        };
        dataPathAssigns[MECH_DATA_PATH] = function (data) {
            SmurfyMechData = data;
        };
        dataPathAssigns[OMNIPOD_DATA_PATH] = function (data) {
            let flatData = flattenOmnipodData(data);
            SmurfyOmnipodData = flatData.flatOmnipodData;
            SmurfyCTOmnipods = flatData.ctOmnipodMap;
        };
        let initPromises = [];
        for (let path of dataPaths) {
            initPromises.push(initDataPromise(path));
        }
        let loadAllInitData = Promise.all(initPromises);
        return loadAllInitData.then(function (dataArray) {
            for (let idx in dataArray) {
                if (!dataArray.hasOwnProperty(idx)) {
                    continue;
                }
                let path = dataPaths[idx];
                dataPathAssigns[path](dataArray[idx]);
            }
            MechModel.initAddedData();
        });
    };
    MechModel.initAddedData = function () {
        initHeatsinkIds();
        initAddedHeatsinkData();
        initAddedWeaponData();
    };
    const ISHeatsinkName = "HeatSink_MkI";
    const ISDoubleHeatsinkName = "DoubleHeatSink_MkI";
    const ClanSingleHeatsinkName = "HeatSink_MkI"; //TODO: Workaround for Clan Single Heatsinks. Ask smurfy about missing single heat sink data in modules.
    const ClanDoubleHeatsinkName = "ClanDoubleHeatSink";
    var ISSingleHeatsinkId;
    var ISDoubleHeatsinkId;
    var ClanSingleHeatsinkId;
    var ClanDoubleHeatsinkId;
    const heatsinkType = "CHeatSinkStats";
    var initHeatsinkIds = function () {
        for (let moduleId in SmurfyModuleData) {
            if (!SmurfyModuleData.hasOwnProperty(moduleId)) {
                continue;
            }
            let moduleData = SmurfyModuleData[moduleId];
            if (moduleData.type === heatsinkType) {
                if (moduleData.name === ISHeatsinkName) {
                    ISSingleHeatsinkId = moduleId;
                }
                if (moduleData.name === ISDoubleHeatsinkName) {
                    ISDoubleHeatsinkId = moduleId;
                }
                if (moduleData.name === ClanSingleHeatsinkName) {
                    ClanSingleHeatsinkId = moduleId;
                }
                if (moduleData.name === ClanDoubleHeatsinkName) {
                    ClanDoubleHeatsinkId = moduleId;
                }
            }
        }
    };
    //add additional data to heatsink moduledata
    //Addditional data can be found in data/addedheatsinkdata.js
    var initAddedHeatsinkData = function () {
        for (let idx in SmurfyModuleData) {
            if (!SmurfyModuleData.hasOwnProperty(idx)) {
                continue;
            }
            let moduleData = SmurfyModuleData[idx];
            if (moduleData.type === "CHeatSinkStats") {
                let addedData = AddedData._AddedHeatsinkData[moduleData.name];
                $.extend(moduleData.stats, addedData);
            }
        }
    };
    //adds fields to smurfy weapon data
    //additional data can be found in data/addedweapondata.js
    var initAddedWeaponData = function () {
        for (let idx in SmurfyWeaponData) {
            if (!SmurfyWeaponData.hasOwnProperty(idx)) {
                continue;
            }
            let weaponData = SmurfyWeaponData[idx];
            let addedData = AddedData._AddedWeaponData[weaponData.name];
            $.extend(weaponData, addedData);
        }
    };
    //Used by test
    MechModel.setInitModelData = function (weaponData, ammoData, mechData, moduleData, omnipodData) {
        SmurfyWeaponData = weaponData;
        SmurfyAmmoData = ammoData;
        SmurfyMechData = mechData;
        SmurfyModuleData = moduleData;
        let flatData = flattenOmnipodData(omnipodData);
        SmurfyOmnipodData = flatData.flatOmnipodData;
        SmurfyCTOmnipods = flatData.ctOmnipodMap;
        MechModel.initAddedData();
    };
    MechModel.getSmurfyMechData = function (smurfyMechId) {
        return SmurfyMechData[smurfyMechId];
    };
    MechModel.getSmurfyWeaponData = function (smurfyItemId) {
        return SmurfyWeaponData[smurfyItemId];
    };
    //weaponName -> SmurfyWeaponData
    var smurfyWeaponNameMap = {};
    MechModel.getSmurfyWeaponDataByName = function (smurfyName) {
        if (smurfyWeaponNameMap[smurfyName]) {
            return smurfyWeaponNameMap[smurfyName];
        }
        for (let id in SmurfyWeaponData) {
            if (!SmurfyWeaponData.hasOwnProperty(id)) {
                continue;
            }
            let smurfyWeapon = SmurfyWeaponData[id];
            if (smurfyName === smurfyWeapon.name) {
                smurfyWeaponNameMap[smurfyName] = smurfyWeapon;
                return smurfyWeaponNameMap[smurfyName];
            }
        }
        return null;
    };
    MechModel.getSmurfyModuleData = function (smurfyModuleId) {
        return SmurfyModuleData[smurfyModuleId];
    };
    MechModel.getSmurfyAmmoData = function (smurfyItemId) {
        return SmurfyAmmoData[smurfyItemId];
    };
    MechModel.getSmurfyOmnipodData = function (smurfyOmnipodId) {
        return SmurfyOmnipodData[smurfyOmnipodId];
    };
    MechModel.getSmurfyCTOmnipod = function (mechName) {
        return SmurfyCTOmnipods[mechName];
    };
    var isHeatsinkModule = function (smurfyModuleId) {
        let smurfyModuleData = MechModel.getSmurfyModuleData(smurfyModuleId);
        return smurfyModuleData && smurfyModuleData.type === "CHeatSinkStats";
    };
    var isEngineModule = function (smurfyModuleId) {
        let smurfyModuleData = MechModel.getSmurfyModuleData(smurfyModuleId);
        return smurfyModuleData && smurfyModuleData.type === "CEngineStats";
    };
    //base structure value computation for a given tonnage.
    //Reference: http://mwo.gamepedia.com/Internal_Structure
    MechModel.baseMechStructure = function (location, tonnage) {
        return GlobalGameInfo._MechBaseStructure[tonnage][location];
    };
    MechModel.baseMechArmor = function (location, tonnage) {
        if (location === Component.HEAD) {
            return MechModel.baseMechStructure(location, tonnage);
        }
        else {
            return MechModel.baseMechStructure(location, tonnage) * 2;
        }
    };
    //Object creation methods.
    //TODO: see if it's better to put these in the object constructors instead
    var mechHealthFromSmurfyMechLoadout = function (smurfyMechLoadout, quirks) {
        var mechHealth;
        var smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
        var tonnage = smurfyMechData.details.tons;
        var componentHealthList = [];
        for (let smurfyMechComponent of smurfyMechLoadout.configuration) {
            let componentHealth = componentHealthFromSmurfyMechComponent(smurfyMechComponent, quirks, tonnage);
            componentHealthList.push(componentHealth);
        }
        mechHealth = new MechHealth(componentHealthList);
        return mechHealth;
    };
    var componentHealthFromSmurfyMechComponent = function (smurfyMechComponent, quirkList, tonnage) {
        var componentHealth; //return value
        var location = smurfyMechComponent.name;
        var armor = smurfyMechComponent.armor;
        var structure = MechModel.baseMechStructure(location, tonnage);
        let bonus = MechModelQuirks.getHealthBonus(location, quirkList);
        componentHealth = new ComponentHealth(location, Number(armor), Number(structure), Number(armor), Number(structure));
        componentHealth.applyQuirkBonus(bonus);
        return componentHealth;
    };
    var collectFromSmurfyConfiguration = function (smurfyMechConfiguration, collectFunction) {
        var outputList = [];
        for (let smurfyMechComponent of smurfyMechConfiguration) {
            let location = smurfyMechComponent.name;
            for (let smurfyMechComponentItem of smurfyMechComponent.items) {
                let entry = collectFunction(location, smurfyMechComponentItem);
                if (entry) {
                    outputList.push(entry);
                }
            }
        }
        return outputList;
    };
    var weaponInfoListFromSmurfyMechLoadout = function (smurfyMechLoadout, mechInfo) {
        var weaponInfoList = [];
        weaponInfoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration, function (location, smurfyMechComponentItem) {
            if (smurfyMechComponentItem.type === "weapon") {
                let weaponId = smurfyMechComponentItem.id;
                let smurfyWeaponData = MechModel.getSmurfyWeaponData(weaponId);
                let weaponInfo = new MechModelWeapons.WeaponInfo(weaponId, location, smurfyWeaponData, mechInfo);
                return weaponInfo;
            }
            else {
                return null;
            }
        });
        return weaponInfoList;
    };
    var heatsinkListFromSmurfyMechLoadout = function (smurfyMechLoadout) {
        var heatsinkList = [];
        heatsinkList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration, function (location, smurfyMechComponentItem) {
            let itemId = smurfyMechComponentItem.id;
            if (isHeatsinkModule(itemId)) {
                let heatsink = heatsinkFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
                return heatsink;
            }
            else {
                return null;
            }
        });
        return heatsinkList;
    };
    var heatsinkFromSmurfyMechComponentItem = function (location, smurfyMechComponentItem) {
        let heatsinkId = smurfyMechComponentItem.id;
        let smurfyModuleData = MechModel.getSmurfyModuleData(heatsinkId);
        let heatsink = new Heatsink(location, smurfyModuleData);
        return heatsink;
    };
    var ammoBoxListFromSmurfyMechLoadout = function (smurfyMechLoadout, quirks) {
        var ammoList = [];
        ammoList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration, function (location, smurfyMechComponentItem) {
            if (smurfyMechComponentItem.type === "ammo") {
                let ammoBox = ammoBoxFromSmurfyMechComponentItem(location, smurfyMechComponentItem, quirks);
                return ammoBox;
            }
            else {
                return null;
            }
        });
        return ammoList;
    };
    var ammoBoxFromSmurfyMechComponentItem = function (location, smurfyMechComponentItem, quirks) {
        var ammoBox;
        let ammoData = MechModel.getSmurfyAmmoData(smurfyMechComponentItem.id);
        let type = ammoData.type;
        let ammoCount = ammoData.num_shots;
        let weaponIds = ammoData.weapons;
        for (let quirk of quirks) {
            let ammoType = MechModelQuirksData._ammoCapacityMap[quirk.name];
            if (ammoType === type) {
                ammoCount += Math.floor(Number(ammoData.tons) * Number(quirk.value));
            }
        }
        ammoBox = new AmmoBox(type, location, weaponIds, ammoCount, true);
        return ammoBox;
    };
    //Gets the heatsink module id of the heatsinks in the engine.
    //Uses direct name matching because there doesn't seem to be an id reference
    //from the heatsink upgrade items to the associated heatsink
    var getEngineHeatsinkId = function (smurfyMechLoadout) {
        var upgradeToIdMap = {
            "STANDARD HEAT SINK": ISSingleHeatsinkId,
            "DOUBLE HEAT SINK": ISDoubleHeatsinkId,
            "CLAN STANDARD HEAT SINK": ClanSingleHeatsinkId,
            "CLAN DOUBLE HEAT SINK": ClanDoubleHeatsinkId
        };
        for (let mechUpgrade of smurfyMechLoadout.upgrades) {
            if (mechUpgrade.type === "HeatSink") {
                return upgradeToIdMap[mechUpgrade.name];
            }
        }
        return null; //should not happen
    };
    var getEngineSmurfyModuleData = function (smurfyMechLoadout) {
        for (let equipment of smurfyMechLoadout.stats.equipment) {
            let equipmentModuleData = MechModel.getSmurfyModuleData(equipment.id);
            if (equipmentModuleData.type === "CEngineStats") {
                return equipmentModuleData;
            }
        }
        return null; //should not happen
    };
    var isClanXLEngine = function (smurfyModuleData) {
        return smurfyModuleData.name.startsWith("Engine_Clan") &&
            smurfyModuleData.type === "CEngineStats";
    };
    var engineInfoFromSmurfyMechLoadout = function (smurfyMechLoadout) {
        let smurfyEngineData = getEngineSmurfyModuleData(smurfyMechLoadout);
        let engineId = smurfyEngineData.id;
        let name = smurfyEngineData.name;
        let engineHeatsinkId = getEngineHeatsinkId(smurfyMechLoadout);
        //NOTE: The true number of engine internal heatsinks is computed by subtracting
        //the number of external heatsinks from the smurfy stats heatsink count.
        //This is because fixed internal heatsinks (e.g. on omnimechs) dont appear as
        //items in the cetre_torso of smurfyLoadout.configuration.
        let externalHeatsinkCount = numExternalHeatsinks(smurfyMechLoadout);
        let smurfyHeatsinkCount = Number(smurfyMechLoadout.stats.heatsinks);
        let heatsinkCount = smurfyHeatsinkCount - externalHeatsinkCount;
        let heatsink = new Heatsink(Component.CENTRE_TORSO, MechModel.getSmurfyModuleData(engineHeatsinkId));
        let engineInfo = new EngineInfo(engineId, name, heatsink, heatsinkCount);
        return engineInfo;
    };
    MechModel.isOmnimech = function (smurfyMechLoadout) {
        for (let component of smurfyMechLoadout.configuration) {
            if (component.omni_pod) {
                return true;
            }
        }
        return false;
    };
    var numExternalHeatsinks = function (smurfyMechLoadout) {
        let heatsinkList = collectFromSmurfyConfiguration(smurfyMechLoadout.configuration, function (location, smurfyMechComponentItem) {
            let itemId = smurfyMechComponentItem.id;
            if (isHeatsinkModule(itemId) && location !== Component.CENTRE_TORSO) {
                let heatsink = heatsinkFromSmurfyMechComponentItem(location, smurfyMechComponentItem);
                return heatsink;
            }
            else {
                return null;
            }
        });
        return heatsinkList.length;
    };
    var calculateHeatStats = function (heatsinkInfoList, engineInfo, engineHeatEfficiency, generalQuirkBonus) {
        const BASE_HEAT_CAPACITY = 30;
        let heatCapacity = BASE_HEAT_CAPACITY;
        let heatDissipation = 0;
        //non-fixed heatsinks
        for (let heatsink of heatsinkInfoList) {
            if (!heatsink.active) {
                continue;
            }
            if (heatsink.location === Component.CENTRE_TORSO) {
                //NOTE: internal non-fixed heatsinks are included in the engine heatsink count
                // heatCapacity += Number(heatsink.internalHeatCapacity);
                // heatDissipation += Number(heatsink.engineCooling);
            }
            else {
                //external non-fixed
                heatCapacity += Number(heatsink.externalHeatCapacity);
                heatDissipation += Number(heatsink.cooling);
            }
        }
        //engine heatsinks
        let engineHeatsink = engineInfo.heatsink;
        heatCapacity += Number(engineInfo.heatsinkCount) *
            Number(engineHeatsink.internalHeatCapacity);
        //Only dissipation is affected by engine efficiency
        heatDissipation += Number(engineInfo.heatsinkCount) *
            Number(engineHeatsink.engineCooling) *
            Number(engineHeatEfficiency);
        let heatDissipationMultiplier = 1.0;
        let heatCapacityMultiplier = 1.0;
        //TODO: Find the difference between heatloss and heatdissipation
        if (generalQuirkBonus.heatloss_multiplier) {
            heatDissipationMultiplier += generalQuirkBonus.heatloss_multiplier;
        }
        if (generalQuirkBonus.heatdissipation_multiplier) {
            heatDissipationMultiplier += generalQuirkBonus.heatdissipation_multiplier;
        }
        if (generalQuirkBonus.maxheat_multiplier) {
            heatCapacityMultiplier += Number(generalQuirkBonus.maxheat_multiplier);
        }
        heatDissipation = heatDissipation * heatDissipationMultiplier;
        heatCapacity = heatCapacity * heatCapacityMultiplier;
        return {
            "heatCapacity": heatCapacity,
            "heatDissipation": heatDissipation
        };
    };
    var initWeaponStateList = function (mechState) {
        var weaponStateList = [];
        let mechInfo = mechState.mechInfo;
        for (let weaponInfo of mechInfo.weaponInfoList) {
            let weaponState = null;
            if (weaponInfo.hasDuration()) {
                weaponState =
                    new MechModelWeapons.WeaponStateDurationFire(weaponInfo, mechState);
            }
            else if (weaponInfo.isContinuousFire()) {
                weaponState =
                    new MechModelWeapons.WeaponStateContinuousFire(weaponInfo, mechState);
            }
            else {
                //single-fire
                if (weaponInfo.isOneShot) {
                    weaponState =
                        new MechModelWeapons.WeaponStateOneShot(weaponInfo, mechState);
                }
                else {
                    weaponState =
                        new MechModelWeapons.WeaponStateSingleFire(weaponInfo, mechState);
                }
            }
            weaponStateList.push(weaponState);
        }
        return weaponStateList;
    };
    //constructor
    class Mech {
        constructor(newMechId, team, smurfyMechLoadout) {
            this.smurfyMechId = smurfyMechLoadout.mech_id;
            this.smurfyMechData = MechModel.getSmurfyMechData(this.smurfyMechId);
            this.mechId = newMechId;
            this.mechInfo = new MechInfo(newMechId, smurfyMechLoadout);
            this.mechState = new MechState(this.mechInfo);
            this.mechTeam = team;
            this.targetMech = null; //set by simulation
        }
        getName() {
            return this.smurfyMechData.name;
        }
        getTranslatedName() {
            return this.smurfyMechData.translated_name;
        }
        getMechId() {
            return this.mechId;
        }
        getMechInfo() {
            return this.mechInfo;
        }
        getMechState() {
            return this.mechState;
        }
        resetMechState() {
            this.mechState = new MechState(this.mechInfo);
        }
        getMechTeam() {
            return this.mechTeam;
        }
        setMechTeam(team) {
            this.mechTeam = team;
        }
        setTargetMech(newTarget) {
            this.targetMech = newTarget;
        }
        getTargetMech() {
            return this.targetMech;
        }
        applySkillQuirks(skillQuirks) {
            this.mechInfo.applySkillQuirks(skillQuirks);
            this.resetMechState();
        }
        setSkillState(skillState) {
            this.mechInfo.setSkillState(skillState);
        }
    }
    MechModel.Mech = Mech;
    MechModel.getMechTeam = function (team) {
        return mechTeams[team];
    };
    MechModel.addMech = function (mechId, team, smurfyMechLoadout) {
        var newMech = new Mech(mechId, team, smurfyMechLoadout);
        mechTeams[team].push(newMech);
        Util.log("Added mech mech_id: " + mechId +
            " translated_mech_name: " + newMech.getTranslatedName());
        MechModel.initMechPatterns(newMech);
        return newMech;
    };
    MechModel.addMechAtIndex = function (mechId, team, smurfyMechLoadout, index) {
        var newMech = new Mech(mechId, team, smurfyMechLoadout);
        mechTeams[team][index] = newMech;
        Util.log("Added mech mech_id: " + mechId
            + " translated_mech_name: " + newMech.getTranslatedName()
            + " at index " + index);
        MechModel.initMechPatterns(newMech);
        return newMech;
    };
    var getMechPosFromId = function (mechId) {
        let teamList = [Team.BLUE, Team.RED];
        for (let team of teamList) {
            let mechList = mechTeams[team];
            for (let mechIdx in mechList) {
                if (!mechList.hasOwnProperty(mechIdx)) {
                    continue;
                }
                let mech = mechList[mechIdx];
                if (mech.getMechId() === mechId) {
                    return { team: team, index: Number(mechIdx) };
                }
            }
        }
        return null;
    };
    var getMechFromPos = function (mechPos) {
        return mechTeams[mechPos.team][mechPos.index];
    };
    MechModel.deleteMech = function (mechId) {
        let mechPos = getMechPosFromId(mechId);
        if (!mechPos) {
            return false;
        }
        let mechList = mechTeams[mechPos.team];
        mechList.splice(mechPos.index, 1);
        releaseMechId(mechId);
        return true;
    };
    //removes src mech from its current position and inserts it before dest mech
    MechModel.moveMech = function (srcMechId, destMechId) {
        let srcMechPos = getMechPosFromId(srcMechId);
        if (!srcMechPos) {
            return false;
        }
        let srcMech = getMechFromPos(srcMechPos);
        let status = MechModel.deleteMech(srcMechId);
        if (!status) {
            return false;
        }
        //get dest pos AFTER delete to keep indices straight when moving in the same list
        let destMechPos = getMechPosFromId(destMechId);
        let deletedMechList = mechTeams[srcMechPos.team];
        if (!destMechPos) {
            //reinsert deleted mech on error
            deletedMechList.splice(srcMechPos.index, 0, srcMech);
            return false;
        }
        srcMech.setMechTeam(destMechPos.team);
        let insertMechList = mechTeams[destMechPos.team];
        insertMechList.splice(destMechPos.index, 0, srcMech);
        return true;
    };
    MechModel.moveMechToEndOfList = function (srcMechId, team) {
        let srcMechPos = getMechPosFromId(srcMechId);
        if (!srcMechPos) {
            return false;
        }
        let srcMech = getMechFromPos(srcMechPos);
        let status = MechModel.deleteMech(srcMechId);
        if (!status) {
            return false;
        }
        let insertMechList = mechTeams[team];
        insertMechList.splice(insertMechList.length, 0, srcMech);
        return true;
    };
    //Debug, set default mech patterns
    MechModel.initMechTeamPatterns = function (mechTeam) {
        for (let mech of mechTeam) {
            MechModel.initMechPatterns(mech);
        }
    };
    MechModel.initMechPatterns = function (mech) {
        mech.firePattern = MechFirePattern.getDefault();
        mech.componentTargetPattern = MechTargetComponent.getDefault();
        mech.mechTargetPattern = MechTargetMech.getDefault();
        mech.accuracyPattern = MechAccuracyPattern.getDefault();
    };
    MechModel.generateMechId = function (smurfyMechLoadout) {
        let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
        let mechName = smurfyMechData.name;
        let rand = function () {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        let newMechId = mechName + "-" +
            rand() + "-" + rand() + "-" + rand() + "-" + rand();
        while (mechIdMap[newMechId]) {
            newMechId = newMechId = mechName +
                rand() + "-" + rand() + "-" + rand() + "-" + rand();
        }
        mechIdMap[newMechId] = true;
        return newMechId;
    };
    var releaseMechId = function (mechId) {
        mechIdMap[mechId] = false;
    };
    //Resets the MechStates of all mechs to their fresh value
    MechModel.resetState = function () {
        let teams = [Team.BLUE, Team.RED];
        for (let team of teams) {
            let mechTeam = mechTeams[team];
            for (let mech of mechTeam) {
                mech.resetMechState();
            }
        }
    };
    MechModel.isTeamAlive = function (team) {
        let mechTeam = mechTeams[team];
        for (let mech of mechTeam) {
            if (mech.getMechState().isAlive()) {
                return true;
            }
        }
        return false;
    };
    //called every time team-level statistics need to be updated (e.g. when a weapon hits)
    MechModel.updateModelTeamStats = function (team, simTime) {
        let totalTeamBurstDamage = 0;
        let teamStatEntry = teamStats[team];
        if (!teamStatEntry) {
            teamStatEntry = new TeamStats();
            teamStats[team] = teamStatEntry;
        }
        for (let mech of mechTeams[team]) {
            let burstDamage = mech.getMechState().mechStats.getBurstDamage(simTime);
            totalTeamBurstDamage += burstDamage;
        }
        if (totalTeamBurstDamage > teamStatEntry.maxBurstDamage) {
            teamStatEntry.maxBurstDamage = totalTeamBurstDamage;
        }
    };
    MechModel.getTeamStats = function (team) {
        return teamStats[team];
    };
    var parseSmurfyURL = function (url) {
        let urlMatcher = /https?:\/\/mwo\.smurfy-net\.de\/mechlab#i=([0-9]+)&l=([a-z0-9]+)/;
        let results = urlMatcher.exec(url);
        if (results) {
            let id = results[1];
            let loadout = results[2];
            if (id && loadout) {
                return { "id": id, "loadout": loadout };
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    MechModel.loadSmurfyMechLoadoutFromURL = function (url) {
        let params = parseSmurfyURL(url);
        if (!params) {
            return null;
        }
        return MechModel.loadSmurfyMechLoadoutFromID(params.id, params.loadout);
    };
    MechModel.loadSmurfyMechLoadoutFromID = function (smurfyId, smurfyLoadoutId) {
        let ret = new Promise(function (resolve, reject) {
            var smurfyLoadoutURL = SMURFY_PROXY_URL + "data/mechs/" + smurfyId
                + "/loadouts/" + smurfyLoadoutId + ".json";
            $.ajax({
                url: smurfyLoadoutURL,
                type: 'GET',
                dataType: 'JSON'
            })
                .done(function (data) {
                resolve(data);
            })
                .fail(function (data) {
                reject(Error(data));
            });
        });
        return ret;
    };
    //returns a list of adjacent components
    //Component -> [Component...]
    MechModel.getAdjacentComponents = function (component) {
        if (component === Component.HEAD) {
            return [];
        }
        else if (component === Component.CENTRE_TORSO) {
            return [Component.LEFT_TORSO, Component.RIGHT_TORSO];
        }
        else if (component === Component.LEFT_TORSO) {
            return [Component.CENTRE_TORSO, Component.LEFT_ARM];
        }
        else if (component === Component.RIGHT_TORSO) {
            return [Component.CENTRE_TORSO, Component.RIGHT_ARM];
        }
        else if (component === Component.RIGHT_ARM) {
            return [Component.RIGHT_TORSO];
        }
        else if (component === Component.LEFT_ARM) {
            return [Component.LEFT_TORSO];
        }
        else if (component === Component.LEFT_LEG) {
            return [Component.LEFT_TORSO];
        }
        else if (component === Component.RIGHT_LEG) {
            return [Component.RIGHT_TORSO];
        }
        return [];
    };
    var getTransferDamageLocation = function (component) {
        if (component === Component.HEAD) {
            return null;
        }
        else if (component === Component.CENTRE_TORSO) {
            return null;
        }
        else if (component === Component.LEFT_TORSO) {
            return Component.CENTRE_TORSO;
        }
        else if (component === Component.RIGHT_TORSO) {
            return Component.CENTRE_TORSO;
        }
        else if (component === Component.RIGHT_ARM) {
            return Component.RIGHT_TORSO;
        }
        else if (component === Component.LEFT_ARM) {
            return Component.LEFT_TORSO;
        }
        else if (component === Component.LEFT_LEG) {
            return Component.LEFT_TORSO;
        }
        else if (component === Component.RIGHT_LEG) {
            return Component.RIGHT_TORSO;
        }
    };
    //NOTE: This is currently O(n) on the number of mechs. Not too bad given we don't have that many mechs,
    //but try to avoid calling this inside the simulation loop. It's ok for user initiated UI actions.
    MechModel.getMechFromId = function (mechId) {
        let mechPos = getMechPosFromId(mechId);
        if (!mechPos) {
            return null;
        }
        return mechTeams[mechPos.team][mechPos.index];
    };
    MechModel.clearModel = function () {
        mechTeams[Team.BLUE] = [];
        mechTeams[Team.RED] = [];
        teamStats = {};
    };
})(MechModel || (MechModel = {}));
//Type definitions for smurfy types
var SmurfyTypes;
//Type definitions for smurfy types
(function (SmurfyTypes) {
    ;
    ;
    ;
    ;
})(SmurfyTypes || (SmurfyTypes = {}));
//Methods that update the MechView from the MechModel, and vice versa
var MechModelView;
//Methods that update the MechView from the MechModel, and vice versa
(function (MechModelView) {
    var Team = MechModelCommon.Team;
    var WeaponCycle = MechModelCommon.WeaponCycle;
    var UpdateType = MechModelCommon.UpdateType;
    var EventType = MechModelCommon.EventType;
    MechModelView.ViewUpdate = {
        TEAMSTATS: "teamstats",
        MECHLISTS: "mechlists",
    };
    let simEventQueue;
    MechModelView.getEventQueue = function () {
        if (!simEventQueue) {
            simEventQueue = new Events.EventQueue();
        }
        return simEventQueue;
    };
    MechModelView.init = function () {
        let eventQueue = MechModelView.getEventQueue();
        eventQueue.addListener(mechUpdateListener, EventType.MECH_UPDATE);
        eventQueue.addListener(teamStatsListener, EventType.TEAMSTATS_UPDATE);
        eventQueue.addListener(simTimeListener, EventType.SIMTIME_UPDATE);
        eventQueue.addListener(teamVictoryUpdate, EventType.TEAMVICTORY_UPDATE);
    };
    var mechUpdateListener = function (event) {
        //NOTE: When EventQueue uses setTimeout(0) to execute the next event, the browser
        //seems to defer UI updates so the animations become VERY CHOPPY when there are a lot of dom 
        //elements being updated. 
        //Solved using EventQueue.deferExecution(), executeAllQueued() to combine all mech dom updates
        //to a single stack frame.
        MechModelView.updateMech(event.mech);
    };
    var teamStatsListener = function (event) {
        MechModel.updateModelTeamStats(event.team, event.simTime);
        MechModelView.updateTeamStats(event.team);
    };
    var simTimeListener = function (event) {
        MechModelView.updateSimTime(event.simTime);
    };
    var teamVictoryUpdate = function (event) {
        MechModelView.updateVictory(MechModelView.getVictorTeam());
    };
    MechModelView.refreshView = function (updates = [MechModelView.ViewUpdate.TEAMSTATS, MechModelView.ViewUpdate.MECHLISTS]) {
        document.title = getPageTitle();
        let mechTeamList = [Team.BLUE, Team.RED];
        for (let team of mechTeamList) {
            if (updates.includes(MechModelView.ViewUpdate.MECHLISTS)) {
                MechView.clearMechList(team);
            }
            if (updates.includes(MechModelView.ViewUpdate.TEAMSTATS)) {
                MechView.clearMechStats(team);
            }
            let mechIdList = [];
            for (let mech of MechModel.getMechTeam(team)) {
                mechIdList.push(mech.getMechId());
            }
            if (updates.includes(MechModelView.ViewUpdate.TEAMSTATS)) {
                MechViewTeamStats.addTeamStatsPanel(team, mechIdList);
            }
            for (let mech of MechModel.getMechTeam(team)) {
                if (updates.includes(MechModelView.ViewUpdate.MECHLISTS)) {
                    MechView.addMechPanel(mech, team);
                }
                updateAll(mech);
            }
            MechModelView.updateTeamStats(team);
        }
        let simulatorParameters = SimulatorSettings.getSimulatorParameters();
        MechViewSimSettings.updateSimSettingsView(simulatorParameters);
    };
    const BASE_PAGE_TITLE = "MWO Loadout Simulator";
    const TITLE_MAX_MECHS = 2;
    var getPageTitle = function () {
        let mechTeamList = [Team.BLUE, Team.RED];
        let teamTitle = {};
        for (let team of mechTeamList) {
            teamTitle[team] = "";
            let mechTeam = MechModel.getMechTeam(team);
            let idx = "0";
            for (idx in mechTeam) {
                if (!mechTeam.hasOwnProperty(idx)) {
                    continue;
                }
                if (Number(idx) >= TITLE_MAX_MECHS) {
                    break;
                }
                let mech = mechTeam[idx];
                if (Number(idx) > 0) {
                    teamTitle[team] += ", ";
                }
                teamTitle[team] += mech.getTranslatedName();
            }
            if (Number(idx) >= TITLE_MAX_MECHS) {
                teamTitle[team] += ", " + (mechTeam.length - Number(idx)) + " more";
            }
        }
        return BASE_PAGE_TITLE + " : " +
            teamTitle[Team.BLUE] + " VS "
            + teamTitle[Team.RED];
    };
    MechModelView.updateHeat = function (mech) {
        let heatState = mech.getMechState().heatState;
        let heatbar = MechViewMechPanel.Heatbar.getHeatbar(mech.getMechId());
        heatbar.updateHeat(heatState.currHeat, heatState.currMaxHeat);
    };
    MechModelView.updateCooldown = function (mech) {
        let mechState = mech.getMechState();
        for (let weaponIndex in mechState.weaponStateList) {
            if (!mechState.weaponStateList.hasOwnProperty(weaponIndex)) {
                continue;
            }
            let type = "cooldown";
            let weaponState = mechState.weaponStateList[weaponIndex];
            let weaponInfo = weaponState.weaponInfo;
            let cooldownPercent = 0;
            if (weaponState.weaponCycle === WeaponCycle.READY) {
                cooldownPercent = 0;
            }
            else if (weaponState.weaponCycle === WeaponCycle.FIRING) {
                if (weaponState.hasJamBar()) {
                    cooldownPercent = weaponState.getJamProgress();
                    type = "jamBar";
                }
                else {
                    cooldownPercent = 1;
                }
            }
            else if (weaponState.weaponCycle === WeaponCycle.DISABLED) {
                cooldownPercent = 1;
            }
            else if (weaponState.weaponCycle === WeaponCycle.COOLDOWN) {
                cooldownPercent = Number(weaponState.cooldownLeft) / Number(weaponState.computeWeaponCooldown());
            }
            else if (weaponState.weaponCycle === WeaponCycle.SPOOLING) {
                cooldownPercent = 1 - (Number(weaponState.spoolupLeft) / Number(weaponInfo.spinup));
            }
            else if (weaponState.weaponCycle === WeaponCycle.JAMMED) {
                cooldownPercent = 1;
            }
            let weaponPanel = MechViewMechPanel.WeaponPanel.getWeaponPanel(mech.getMechId());
            weaponPanel.setWeaponCooldown(Number(weaponIndex), cooldownPercent, type);
        }
    };
    MechModelView.updateWeaponStatus = function (mech) {
        let mechState = mech.getMechState();
        for (let weaponIndex in mechState.weaponStateList) {
            if (!mechState.weaponStateList.hasOwnProperty(weaponIndex)) {
                continue;
            }
            let weaponState = mechState.weaponStateList[weaponIndex];
            let weaponPanel = MechViewMechPanel.WeaponPanel.getWeaponPanel(mech.getMechId());
            weaponPanel.setWeaponState(Number(weaponIndex), weaponState.weaponCycle);
            let ammoState = mech.getMechState().ammoState;
            let weaponAmmoCount = weaponState.getAvailableAmmo();
            weaponPanel.setWeaponAmmo(Number(weaponIndex), weaponAmmoCount);
        }
    };
    var updatePaperDoll = function (mech) {
        let mechId = mech.getMechId();
        let mechHealth = mech.getMechState().mechHealth;
        for (let mechComponentHealth of mechHealth.componentHealthList) {
            let location = mechComponentHealth.location;
            let armorPercent = Number(mechComponentHealth.armor) / Number(mechComponentHealth.maxArmor);
            let structurePercent = Number(mechComponentHealth.structure) / Number(mechComponentHealth.maxStructure);
            let paperDoll = MechViewMechPanel.PaperDoll.getPaperDoll(mechId);
            paperDoll.setPaperDollArmor(location, armorPercent);
            paperDoll.setPaperDollStructure(location, structurePercent);
        }
    };
    var updateMechHealthNumbers = function (mech) {
        let mechHealth = mech.getMechState().mechHealth;
        for (let mechComponentHealth of mechHealth.componentHealthList) {
            let mechHealthNumbers = MechViewMechPanel.MechHealthNumbers.getMechHealthNumbers(mech.getMechId());
            let update = {
                location: mechComponentHealth.location,
                armor: mechComponentHealth.armor,
                structure: mechComponentHealth.structure,
                maxArmor: mechComponentHealth.maxArmor,
                maxStructure: mechComponentHealth.maxStructure,
            };
            mechHealthNumbers.updateMechHealthNumbers(update);
        }
    };
    var updateMechStatus = function (mech) {
        let mechName = mech.getTranslatedName();
        let mechHealth = mech.getMechState().mechHealth;
        let currTotalHealth = mechHealth.totalCurrHealth();
        let currMaxHealth = mechHealth.totalMaxHealth();
        let isAlive = mech.getMechState().isAlive();
        let targetMechName = mech.getTargetMech() ?
            mech.getTargetMech().getTranslatedName() : "";
        let mechStats = mech.getMechState().mechStats;
        let simTime = MechSimulatorLogic.getSimTime();
        let totalDmg = Number(mechStats.totalDamage);
        let dps = simTime > 0 ? Number(mechStats.totalDamage) / simTime * 1000 : 0;
        let burst = mechStats.getBurstDamage(simTime);
        let update = {
            mechIsAlive: isAlive,
            mechCurrTotalHealth: currTotalHealth,
            mechCurrMaxHealth: currMaxHealth,
            targetMechName: targetMechName,
            dps: dps,
            burst: burst,
            totalDmg: totalDmg,
        };
        let mechPanel = MechView.getMechPanel(mech.getMechId());
        mechPanel.updateMechStatusPanel(mech.getMechId(), update);
    };
    var updateMechTitle = function (mech) {
        let mechName = mech.getTranslatedName();
        let mechInfo = mech.getMechState().mechInfo;
        let mechPanel = MechView.getMechPanel(mech.getMechId());
        mechPanel.updateMechTitlePanel(mech.getMechId(), mechName, mechInfo.smurfyMechId, mechInfo.smurfyLoadoutId);
    };
    MechModelView.updateHealth = function (mech) {
        //TODO: Unify these calls in MechPanel.updateHealth()
        updatePaperDoll(mech);
        updateMechHealthNumbers(mech);
        updateMechStatus(mech);
    };
    MechModelView.updateSimTime = function (simTime) {
        MechView.updateSimTime(simTime);
    };
    MechModelView.updateMech = function (mech) {
        let mechState = mech.getMechState();
        let updateFunctionMap = {};
        updateFunctionMap[UpdateType.FULL] = updateAll;
        updateFunctionMap[UpdateType.HEALTH] = MechModelView.updateHealth;
        updateFunctionMap[UpdateType.HEAT] = MechModelView.updateHeat;
        updateFunctionMap[UpdateType.COOLDOWN] = MechModelView.updateCooldown;
        updateFunctionMap[UpdateType.WEAPONSTATE] = MechModelView.updateWeaponStatus;
        updateFunctionMap[UpdateType.STATS] = updateStats;
        for (let updateType in mechState.updateTypes) {
            if (!mechState.updateTypes.hasOwnProperty(updateType)) {
                continue;
            }
            if (mechState.updateTypes[updateType]) {
                updateFunctionMap[updateType](mech);
            }
        }
        mechState.updateTypes = {};
    };
    var updateStats = function (mech) {
        updateMechStatus(mech);
    };
    var updateQuirksSkills = function (mech) {
        let mechPanel = MechView.getMechPanel(mech.getMechId());
        mechPanel.updateQuirkSkillFlags(mech.getMechId());
    };
    var updateAll = function (mech) {
        updateMechTitle(mech);
        MechModelView.updateHealth(mech);
        MechModelView.updateHeat(mech);
        MechModelView.updateCooldown(mech);
        MechModelView.updateWeaponStatus(mech);
        updateStats(mech);
        updateQuirksSkills(mech);
    };
    class MechHealthToView {
        constructor(mechId, currHealth, maxHealth, isAlive) {
            this.mechId = mechId;
            this.currHealth = currHealth;
            this.maxHealth = maxHealth;
            this.isAlive = isAlive;
        }
    }
    MechModelView.MechHealthToView = MechHealthToView;
    MechModelView.updateTeamStats = function (team) {
        let mechHealthList = [];
        let totalTeamDamage = 0;
        let totalTeamBurstDamage = 0;
        for (let mech of MechModel.getMechTeam(team)) {
            let mechStats = mech.getMechState().mechStats;
            totalTeamDamage += Number(mechStats.totalDamage);
            let burstDamage = mechStats.getBurstDamage(MechSimulatorLogic.getSimTime());
            totalTeamBurstDamage += Number(burstDamage);
            let mechHealth = mech.getMechState().mechHealth;
            let mechHealthToView = new MechHealthToView(mech.getMechId(), mechHealth.totalCurrHealth(), mechHealth.totalMaxHealth(), mech.getMechState().isAlive());
            mechHealthList.push(mechHealthToView);
        }
        let dps = MechSimulatorLogic.getSimTime() > 0 ?
            Number(totalTeamDamage) / MechSimulatorLogic.getSimTime() * 1000 : 0;
        let update = {
            team,
            mechHealthList,
            damage: Number(totalTeamDamage),
            dps,
            burstDamage: Number(totalTeamBurstDamage),
        };
        MechViewTeamStats.updateTeamStats(update);
    };
    MechModelView.updateDebugText = function (text) {
        MechView.setDebugText(text);
    };
    MechModelView.getSimulatorParameters = function () {
        return SimulatorSettings.getSimulatorParameters();
    };
    MechModelView.setSimulatorParameters = function (simulatorParameters) {
        MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
    };
    MechModelView.setTeamFirePattern = function (team, firePattern) {
        let mechList = MechModel.getMechTeam(team);
        for (let mech of mechList) {
            mech.firePattern = firePattern;
        }
    };
    MechModelView.setTeamComponentTargetPattern = function (team, componentTargetPattern) {
        let mechList = MechModel.getMechTeam(team);
        for (let mech of mechList) {
            mech.componentTargetPattern = componentTargetPattern;
        }
    };
    MechModelView.setTeamAccuracyPattern = function (team, accuracyPattern) {
        let mechList = MechModel.getMechTeam(team);
        for (let mech of mechList) {
            mech.accuracyPattern = accuracyPattern;
        }
    };
    MechModelView.setTeamMechTargetPattern = function (team, mechTargetPattern) {
        let mechList = MechModel.getMechTeam(team);
        for (let mech of mechList) {
            mech.mechTargetPattern = mechTargetPattern;
        }
    };
    class TeamReport {
        constructor(team) {
            this.team = team;
            this.weaponStats = new Map();
            this.mechReports = [];
            let mechTeam = MechModel.getMechTeam(team);
            for (let mech of mechTeam) {
                let mechStats = mech.getMechState().mechStats;
                let mechReport = new MechReport(mech.getMechId(), mech.getTranslatedName(), mechStats);
                this.mechReports.push(mechReport);
            }
            this.computeWeaponStats();
        }
        //consolidate all the weaponStats from the mechs
        computeWeaponStats() {
            for (let mechReport of this.mechReports) {
                let mechWeaponStats = mechReport.weaponReport.weaponStats;
                for (let weaponId of mechWeaponStats.keys()) {
                    let weaponStat = this.weaponStats.get(weaponId);
                    let mechWeaponStat = mechWeaponStats.get(weaponId);
                    if (!weaponStat) {
                        //create new entry to avoid changing the contents of mechWeaponStats
                        weaponStat = new WeaponStat(mechWeaponStat.name, mechWeaponStat.count, mechWeaponStat.damage, mechWeaponStat.dps);
                        this.weaponStats.set(weaponId, weaponStat);
                    }
                    else {
                        weaponStat.damage += mechWeaponStat.damage;
                        weaponStat.dps = (weaponStat.dps * weaponStat.count
                            + mechWeaponStat.dps * mechWeaponStat.count) /
                            (weaponStat.count + mechWeaponStat.count);
                        weaponStat.count += mechWeaponStat.count;
                    }
                }
            }
        }
        //returns [{name: <weaponName>, damage: <weaponDamage>, dps: <weaponDPS>}]
        getWeaponStats() {
            let ret = [];
            for (let stats of this.weaponStats.values()) {
                ret.push(stats);
            }
            return ret;
        }
        getTotalDamage() {
            let totalDamage = 0;
            for (let mechReport of this.mechReports) {
                totalDamage += mechReport.getTotalDamage();
            }
            return totalDamage;
        }
        getDPS() {
            let simTime = MechSimulatorLogic.getSimTime();
            return simTime > 0 ? this.getTotalDamage() / simTime * 1000 : 0;
        }
        getMaxBurst() {
            let teamStats = MechModel.getTeamStats(this.team);
            return teamStats ? teamStats.maxBurstDamage : 0;
        }
    }
    MechModelView.TeamReport = TeamReport;
    class MechReport {
        constructor(mechId, mechName, mechStats) {
            this.mechId = mechId;
            this.mechName = mechName;
            this.mechStats = mechStats; //DO NOT ACCESS DIRECTLY IN VIEW. Use the methods instead
            this.weaponReport = new WeaponReport(mechStats.weaponFires);
        }
        getMaxBurstDamage() {
            return this.weaponReport.getMaxBurstDamage();
        }
        getTotalDamage() {
            return this.mechStats.totalDamage;
        }
        getTimeOfDeath() {
            return this.mechStats.timeOfDeath;
        }
        getDPS() {
            let endTime = this.mechStats.timeOfDeath ?
                this.mechStats.timeOfDeath
                : MechSimulatorLogic.getSimTime();
            return endTime > 0 ?
                this.getTotalDamage() / endTime * 1000
                : 0;
        }
    }
    class WeaponReport {
        constructor(weaponFires) {
            this.weaponFires = weaponFires; //DO NOT ACCESS THIS DIRECTLY IN VIEW. Use the methods instead
            this.maxBurstDamage = null; //will be filled in by computeWeaponStats
            this.weaponStats = new Map(); //weaponId -> {translatedName, count, damage, dps}
            this.computeWeaponStats();
        }
        computeWeaponStats() {
            let burstDamageStartIdx = null;
            for (let idx in this.weaponFires) {
                if (!this.weaponFires.hasOwnProperty(idx)) {
                    continue;
                }
                let weaponFire = this.weaponFires[idx];
                let weaponInfo = weaponFire.weaponState.weaponInfo;
                let weaponStat = this.weaponStats.get(weaponInfo.weaponId);
                let mechState = weaponFire.sourceMech.getMechState();
                //Latest time the weapon's mech was alive. Used to calculate DPS
                let endTime = mechState.isAlive() ?
                    MechSimulatorLogic.getSimTime() :
                    mechState.mechStats.timeOfDeath;
                if (!weaponStat) {
                    weaponStat = new WeaponStat(weaponInfo.translatedName, 1, weaponFire.damageDone.totalDamage(), weaponFire.damageDone.totalDamage() / endTime * 1000);
                    this.weaponStats.set(weaponInfo.weaponId, weaponStat);
                }
                else {
                    //Add to weapon damage, count and recompute DPS
                    weaponStat.count++;
                    weaponStat.damage += weaponFire.damageDone.totalDamage();
                    let currDPS = weaponFire.damageDone.totalDamage() / endTime * 1000;
                    weaponStat.dps = ((weaponStat.dps * (weaponStat.count - 1)) + currDPS) / weaponStat.count;
                }
                //Compute burst damage
                if (!burstDamageStartIdx) {
                    this.maxBurstDamage = weaponFire.damageDone.totalDamage();
                    burstDamageStartIdx = Number(idx);
                }
                else {
                    let currTime = weaponFire.createTime;
                    let burstInterval = MechModelCommon.BURST_DAMAGE_INTERVAL;
                    while ((currTime - this.weaponFires[burstDamageStartIdx].createTime) > burstInterval) {
                        burstDamageStartIdx++;
                    }
                    let currBurstDamage = 0;
                    for (let burstIdx = burstDamageStartIdx; burstIdx <= Number(idx); burstIdx++) {
                        currBurstDamage += this.weaponFires[burstIdx].damageDone.totalDamage();
                    }
                    if (currBurstDamage > this.maxBurstDamage) {
                        this.maxBurstDamage = currBurstDamage;
                    }
                }
            }
        }
        getMaxBurstDamage() {
            return this.maxBurstDamage;
        }
        //returns [{name: <weaponName>, damage: <weaponDamage>, dps: <weaponDPS>}]
        getWeaponStats() {
            let ret = [];
            for (let stats of this.weaponStats.values()) {
                ret.push(stats);
            }
            return ret;
        }
    }
    class WeaponStat {
        constructor(name, count, damage, dps) {
            this.name = name;
            this.count = count;
            this.damage = damage;
            this.dps = dps;
        }
    }
    MechModelView.getTeamReport = function (team) {
        return new TeamReport(team);
    };
    MechModelView.updateVictory = function (team) {
        MechViewReport.showVictoryReport();
    };
    MechModelView.getVictorTeam = function () {
        if (!MechModel.isTeamAlive(Team.BLUE) &&
            MechModel.isTeamAlive(Team.RED)) {
            return Team.RED;
        }
        if (!MechModel.isTeamAlive(Team.RED) &&
            MechModel.isTeamAlive(Team.BLUE)) {
            return Team.BLUE;
        }
        return null;
    };
    MechModelView.getMechName = function (mechId) {
        let mech = MechModel.getMechFromId(mechId);
        if (mech) {
            return mech.getTranslatedName();
        }
        else {
            return null;
        }
    };
    MechModelView.getMechQuirks = function (mechId) {
        let mech = MechModel.getMechFromId(mechId);
        if (mech) {
            return mech.getMechInfo().quirks;
        }
        else {
            return null;
        }
    };
    MechModelView.getMechSkillQuirks = function (mechId) {
        let mech = MechModel.getMechFromId(mechId);
        if (mech) {
            return mech.getMechInfo().skillQuirks;
        }
        else {
            return null;
        }
    };
    MechModelView.applySkillQuirks = function (mechId, skillQuirks) {
        let mech = MechModel.getMechFromId(mechId);
        mech.applySkillQuirks(skillQuirks);
        mech.getMechState().setUpdate(UpdateType.FULL);
        MechModelView.updateMech(mech);
    };
    MechModelView.setSkillState = function (mechId, skillState) {
        let mech = MechModel.getMechFromId(mechId);
        mech.setSkillState(skillState);
    };
    MechModelView.getSkillState = function (mechId) {
        return MechModel.getMechFromId(mechId).getMechInfo().skillState;
    };
    MechModelView.resetModel = function () {
        MechModel.resetState();
    };
    MechModelView.addMech = function (team, smurfyMechLoadout) {
        let newMechId = MechModel.generateMechId(smurfyMechLoadout);
        return MechModel.addMech(newMechId, team, smurfyMechLoadout);
    };
    MechModelView.isQuirkApplicable = function (mechId, quirk) {
        let mech = MechModel.getMechFromId(mechId);
        return MechModelQuirks.isQuirkApplicable(quirk, mech.getMechInfo());
    };
})(MechModelView || (MechModelView = {}));
var MechViewAddMech;
(function (MechViewAddMech) {
    var EventType = MechModelCommon.EventType;
    var LoadFromURLDialog = Widgets.LoadFromURLDialog;
    MechViewAddMech.init = function () {
        MechModelView.getEventQueue().addListener(simStateListener, EventType.START, EventType.PAUSE);
    };
    var simStateListener = function (event) {
        if (event.type === EventType.START) {
            let addMechButtonsJQ = $(".addMechButton");
            Widgets.setButtonListEnabled(addMechButtonsJQ, false);
        }
        else if (event.type === EventType.PAUSE) {
            let addMechButtonsJQ = $(".addMechButton");
            Widgets.setButtonListEnabled(addMechButtonsJQ, true);
        }
    };
    class AddMechButton extends Widgets.Button {
        constructor(team, container) {
            let addMechButtonPanelId = AddMechButton.addMechButtonId(team);
            if (!AddMechButton.addMechButtonHandler) {
                AddMechButton.addMechButtonHandler = AddMechButton.createAddMechButtonHandler();
            }
            let addMechButtonJQ = $(container).find(" [class~=addMechButton]")
                .attr("id", addMechButtonPanelId)
                .attr("data-team", team);
            let addMechButtonElem = addMechButtonJQ.get(0);
            super(addMechButtonElem, AddMechButton.addMechButtonHandler);
            this.storeToDom(AddMechButton.AddMechButtonDomKey);
        }
        static addMechButtonId(team) {
            return team + "-addMechButton";
        }
        static createAddMechButtonHandler() {
            return function () {
                let team = $(this).attr('data-team');
                MechViewAddMech.showAddMechDialog(team);
            };
        }
    }
    AddMechButton.AddMechButtonDomKey = "mwosim.AddMechButton.uiObject";
    MechViewAddMech.AddMechButton = AddMechButton;
    class AddMechDialog extends LoadFromURLDialog {
        constructor(team) {
            super("loadFromURLDialog-addMech-template", AddMechDialog.AddMechDialogId);
            this.loadedSmurfyLoadout = null;
            this.storeToDom(AddMechDialog.AddMechDialogDomKey);
            let thisJQ = $(this.domElement).addClass(team);
            $(this.okButton.domElement).attr("data-team", team);
            $(this.cancelButton.domElement).attr("data-team", team);
            $(this.loadButton.domElement).attr("data-team", team);
        }
        createOkButtonHandler(dialog) {
            return function () {
                let thisJQ = $(this);
                let team = thisJQ.attr('data-team');
                let url = dialog.getTextInputValue();
                Util.log("Mech loaded. team: " + team + " URL: " + url);
                let smurfyMechLoadout = dialog.loadedSmurfyLoadout;
                let newMech = MechModelView.addMech(team, smurfyMechLoadout);
                //set patterns of added mech to selected team patterns
                MechViewTeamStats.setSelectedTeamPatterns(team);
                MechView.addMechPanel(newMech, team);
                MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
                MechViewAddMech.hideAddMechDialog(team);
                MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_CHANGE });
            };
        }
        ;
        createCancelButtonHandler(dialog) {
            return function () {
                let team = $(this).attr('data-team');
                MechViewAddMech.hideAddMechDialog(team);
            };
        }
        ;
        createLoadButtonHandler(dialog) {
            return function () {
                let thisJQ = $(this);
                let team = thisJQ.attr('data-team');
                let addMechDialogJQ = $(dialog.domElement);
                let url = dialog.getTextInputValue();
                Util.log("Load. team: " + team + " URL: " + url);
                let doneHandler = function (data) {
                    dialog.loadedSmurfyLoadout = data;
                    dialog.clearError();
                    $(dialog.getResultPanel()).empty();
                    let loadedMechPanel = new LoadedMechPanel(dialog.getResultPanel(), dialog.loadedSmurfyLoadout);
                    dialog.okButton.enable();
                };
                let failHandler = function () {
                    dialog.setError("Failed to load " + url);
                };
                let alwaysHandler = function () {
                    dialog.setLoading(false);
                };
                let loadMechPromise = MechModel.loadSmurfyMechLoadoutFromURL(url);
                if (loadMechPromise) {
                    dialog.clearError();
                    $(dialog.getResultPanel())
                        .text("Loading url : " + url);
                    dialog.setLoading(true);
                    loadMechPromise
                        .then(doneHandler)
                        .catch(failHandler)
                        .then(alwaysHandler);
                }
                else {
                    dialog
                        .setError("Invalid smurfy URL. Expected format is 'http://mwo.smurfy-net.de/mechlab#i=mechid&l=loadoutid'");
                    dialog.setLoading(false);
                    Util.error("Invalid smurfy url");
                }
            };
        }
    }
    AddMechDialog.AddMechDialogDomKey = "mwosim.AddMechDialog.uiObject";
    AddMechDialog.AddMechDialogId = "addMechDialogContainer";
    AddMechDialog.SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
    MechViewAddMech.AddMechDialog = AddMechDialog;
    class LoadedMechPanel {
        constructor(containerElem, smurfyMechLoadout) {
            let loadedMechDiv = Widgets.cloneTemplate("loadedMech-template");
            let loadedMechJQ = $(loadedMechDiv)
                .removeAttr("id")
                .appendTo(containerElem);
            let smurfyMechId = smurfyMechLoadout.mech_id;
            let smurfyLoadoutId = smurfyMechLoadout.id;
            //Mech name and link
            let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechId);
            let mechLinkJQ = $("<a></a>")
                .attr("href", `${LoadedMechPanel.SMURFY_BASE_URL}i=${smurfyMechId}&l=${smurfyLoadoutId}`)
                .attr("target", "_blank")
                .attr("rel", "noopener")
                .text(smurfyMechData.translated_name);
            loadedMechJQ.find("[class~=mechName]")
                .append(mechLinkJQ);
            let mechStats = smurfyMechLoadout.stats;
            //Mech equipment
            let mechSpeed = `${Number(mechStats.top_speed).toFixed(1)} km/h`;
            let mechEngine = `${mechStats.engine_type} ${mechStats.engine_rating}`;
            let heatsink = `${mechStats.heatsinks} HS`;
            loadedMechJQ
                .find("[class~=mechEquipment]")
                .append(this.loadedMechSpan(mechSpeed, "equipment"))
                .append(this.loadedMechSpan(mechEngine, "equipment"))
                .append(this.loadedMechSpan(heatsink, "equipment"));
            //Mech armament
            for (let weapon of smurfyMechLoadout.stats.armaments) {
                let smurfyWeaponData = MechModel.getSmurfyWeaponData(weapon.id);
                let weaponType = smurfyWeaponData.type;
                loadedMechJQ
                    .find("[class~=mechArmament]")
                    .append(this.loadedMechWeaponSpan(weapon.name, weapon.count, weaponType));
            }
        }
        loadedMechSpan(text, spanClass) {
            let span = Widgets.cloneTemplate("loadedMechInfo-template");
            return $(span)
                .addClass(spanClass)
                .text(text);
        }
        loadedMechWeaponSpan(name, count, type) {
            let numberClass = this.loadedMechWeaponClass(type);
            let weaponSpan = Widgets.cloneTemplate("loadedMechWeapon-template");
            let ret = $(weaponSpan);
            ret.find(".weaponName")
                .text(name);
            ret.find(".count")
                .addClass(numberClass)
                .text(count);
            return ret;
        }
        loadedMechWeaponClass(smurfyType) {
            if (smurfyType === "BALLISTIC") {
                return "ballistic";
            }
            else if (smurfyType === "BEAM") {
                return "beam";
            }
            else if (smurfyType === "MISSLE") {
                return "missile";
            }
            else if (smurfyType === "AMS") {
                return "ams";
            }
            else {
                Util.warn("Unexpected weapon type: " + smurfyType);
                return "";
            }
        }
    }
    LoadedMechPanel.SMURFY_BASE_URL = "http://mwo.smurfy-net.de/mechlab#";
    MechViewAddMech.showAddMechDialog = function (team) {
        let addMechDialog = new AddMechDialog(team);
        Widgets.setModal(addMechDialog.domElement, "addMech");
        Widgets.showModal();
        $(addMechDialog.getTextInput()).focus();
    };
    MechViewAddMech.hideAddMechDialog = function (team) {
        Widgets.hideModal("addMech");
    };
})(MechViewAddMech || (MechViewAddMech = {}));
var MechViewDamageColor;
(function (MechViewDamageColor) {
    MechViewDamageColor.PaperDollDamageGradient = [
        { value: 0.0, RGB: { r: 28, g: 22, b: 6 } },
        { value: 0.1, RGB: { r: 255, g: 46, b: 16 } },
        { value: 0.2, RGB: { r: 255, g: 73, b: 20 } },
        { value: 0.3, RGB: { r: 255, g: 97, b: 12 } },
        { value: 0.4, RGB: { r: 255, g: 164, b: 22 } },
        { value: 0.5, RGB: { r: 255, g: 176, b: 18 } },
        { value: 0.6, RGB: { r: 255, g: 198, b: 24 } },
        { value: 0.7, RGB: { r: 255, g: 211, b: 23 } },
        { value: 0.8, RGB: { r: 255, g: 224, b: 28 } },
        { value: 0.9, RGB: { r: 255, g: 235, b: 24 } },
        { value: 1, RGB: { r: 101, g: 79, b: 38 } },
    ];
    //Colors for health numbers
    MechViewDamageColor.HealthDamageGradient = [
        { value: 0.0, RGB: { r: 230, g: 20, b: 20 } },
        { value: 0.7, RGB: { r: 230, g: 230, b: 20 } },
        // {value : 0.9, RGB : {r:20, g:230, b:20}},
        { value: 0.9, RGB: { r: 255, g: 235, b: 24 } },
        { value: 1, RGB: { r: 170, g: 170, b: 170 } },
    ];
    //Colors for individual component health numbers
    MechViewDamageColor.ComponentHealthDamageGradient = [
        { value: 0.0, RGB: { r: 255, g: 0, b: 0 } },
        { value: 0.7, RGB: { r: 255, g: 255, b: 0 } },
        // {value : 0.9, RGB : {r:0, g:255, b:0}},
        { value: 0.9, RGB: { r: 255, g: 235, b: 24 } },
        { value: 1, RGB: { r: 170, g: 170, b: 170 } },
    ];
    //gets the damage color for a given percentage of damage
    MechViewDamageColor.damageColor = function (percent, damageGradient) {
        var damageIdx = Util.binarySearchClosest(damageGradient, percent, (key, colorValue) => {
            return key - colorValue.value;
        });
        if (damageIdx === -1) {
            damageIdx = 0;
        }
        let nextIdx = damageIdx + 1;
        nextIdx = (nextIdx < damageGradient.length) ? nextIdx : damageIdx;
        let rgb = damageGradient[damageIdx].RGB;
        let nextRgb = damageGradient[nextIdx].RGB;
        let percentDiff = (damageIdx !== nextIdx) ?
            (percent - damageGradient[damageIdx].value) /
                (damageGradient[nextIdx].value - damageGradient[damageIdx].value)
            : 1;
        let red = Math.round(Number(rgb.r) + (Number(nextRgb.r) - Number(rgb.r)) * percentDiff);
        let green = Math.round(Number(rgb.g) + (Number(nextRgb.g) - Number(rgb.g)) * percentDiff);
        let blue = Math.round(Number(rgb.b) + (Number(nextRgb.b) - Number(rgb.b)) * percentDiff);
        return "rgb(" + red + "," + green + "," + blue + ")";
    };
})(MechViewDamageColor || (MechViewDamageColor = {}));
/// <reference path="../framework/widgets.ts" />
var MechViewMechDetails;
/// <reference path="../framework/widgets.ts" />
(function (MechViewMechDetails) {
    var EventType = MechModelCommon.EventType;
    class MechDetails extends Widgets.DomStoredWidget {
        constructor(mechId) {
            let mechDetailsDiv = Widgets.cloneTemplate("mechDetails-template");
            super(mechDetailsDiv);
            this.storeToDom(MechDetails.MechDetailsDomKey);
            this.mechId = mechId;
        }
        render() {
            let mechDetailsJQ = $(this.domElement);
            let mechDetailsQuirks = new MechDetailsQuirks(this.mechId);
            mechDetailsQuirks.render();
            let MechDetailsQuirksTab = {
                tabTitle: new MechDetailsTabTitle("Quirks"),
                tabContent: new MechDetailsQuirks(this.mechId),
            };
            let MechDetailsSkillsTab = {
                tabTitle: new MechDetailsTabTitle("Skills"),
                tabContent: new MechDetailsSkills(this.mechId),
            };
            let mechDetailsTab = new Widgets.TabPanel([MechDetailsQuirksTab, MechDetailsSkillsTab]);
            mechDetailsJQ.find(".tabPanelContainer").append(mechDetailsTab.domElement);
            mechDetailsTab.render();
        }
    }
    MechDetails.MechDetailsDomKey = "mwosim.MechDetails.uiObject";
    MechViewMechDetails.MechDetails = MechDetails;
    class MechDetailsTabTitle extends Widgets.SimpleWidget {
        constructor(title) {
            super("mechDetailsTabTitle-template");
            this.title = title;
        }
        render() {
            $(this.domElement).text(this.title);
        }
    }
    class MechDetailsQuirks extends Widgets.DomStoredWidget {
        constructor(mechId) {
            let mechDetailsQuirksDiv = Widgets.cloneTemplate("mechDetailsQuirks-template");
            super(mechDetailsQuirksDiv);
            this.storeToDom(MechDetailsQuirks.MechDetailsQuirksDomKey);
            this.mechId = mechId;
        }
        render() {
            let mechDetailsJQ = $(this.domElement);
            let mechQuirksJQ = mechDetailsJQ.find(".mechQuirkList");
            let mechQuirkList = MechModelView.getMechQuirks(this.mechId);
            let mechQuirkListPanel = new MechQuirkListPanel(mechQuirksJQ.get(0), this.mechId);
            mechQuirkListPanel.setQuirks(mechQuirkList);
            mechQuirkListPanel.render();
        }
    }
    MechDetailsQuirks.MechDetailsQuirksDomKey = "mwosim.MechDetailsQuirks.uiObject";
    class MechDetailsSkills extends Widgets.DomStoredWidget {
        constructor(mechId) {
            let domElement = Widgets.cloneTemplate("mechDetailsSkills-template");
            super(domElement);
            this.storeToDom(MechDetailsSkills.MechDetailsSkillsDomKey);
            this.mechId = mechId;
            let loadButtonJQ = $(this.domElement).find(".loadButton");
            this.loadButton = new Widgets.Button(loadButtonJQ.get(0), this.createLoadButtonHandler(this));
            let skillListJQ = $(this.domElement).find(".skillList");
            this.quirkListPanel = new MechQuirkListPanel(skillListJQ.get(0), this.mechId);
        }
        createLoadButtonHandler(skillsPanel) {
            return function () {
                let loadSkillsDialog = new LoadMechSkillsDialog(skillsPanel);
                Widgets.setModal(loadSkillsDialog.domElement);
                MechSimulatorLogic.pauseSimulation();
                Widgets.showModal();
                $(loadSkillsDialog.getTextInput()).focus();
            };
        }
        render() {
            let thisJQ = $(this.domElement);
            let skillListJQ = thisJQ.find(".skillList");
            skillListJQ.empty();
            let skillState = MechModelView.getSkillState(this.mechId);
            let skillLinkJQ = thisJQ.find(".skillLink");
            if (skillState) {
                let skillLoader = MechModelSkills.getSkillLoader(skillState.type);
                skillLoader.setSkillState(skillState);
                skillLinkJQ.text("View skills").attr("href", skillLoader.getSkillURL());
                skillLinkJQ.append(Widgets.cloneTemplate("external-link-template"));
            }
            else {
                skillLinkJQ.text("").attr("href", "");
            }
            this.quirkListPanel.setQuirks(MechModelView.getMechSkillQuirks(this.mechId));
            this.quirkListPanel.render();
        }
    }
    MechDetailsSkills.MechDetailsSkillsDomKey = "mwosim.MechDetailsSkills.uiObject";
    class LoadMechSkillsDialog extends Widgets.LoadFromURLDialog {
        constructor(mechSkillsPanel) {
            super("loadFromURLDialog-loadSkills-template", LoadMechSkillsDialog.DialogId);
            this.mechId = mechSkillsPanel.mechId;
            this.mechSkillsPanel = mechSkillsPanel;
            let mechNameJQ = $(this.domElement).find(".mechName");
            let mechName = MechModelView.getMechName(mechSkillsPanel.mechId);
            mechNameJQ.text(mechName);
            this.skillListPanel = new MechQuirkListPanel(this.getResultPanel(), this.mechId);
        }
        createOkButtonHandler(dialog) {
            return function () {
                let loadDialog = dialog;
                if (loadDialog.loadedSkillQuirks) {
                    MechModelView.applySkillQuirks(loadDialog.mechId, loadDialog.loadedSkillQuirks);
                    MechModelView.setSkillState(loadDialog.mechId, loadDialog.loadedSkillState);
                    loadDialog.mechSkillsPanel.render();
                    MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_CHANGE });
                }
                else {
                    Util.warn("No loaded skill quirks");
                }
                Widgets.hideModal();
            };
        }
        createCancelButtonHandler(dialog) {
            return function () {
                Widgets.hideModal();
            };
        }
        createLoadButtonHandler(dialog) {
            return function () {
                let loadMechDialog = dialog;
                let skillLoader = MechModelSkills.getSkillLoader("kitlaan");
                let url = dialog.getTextInputValue();
                let loadPromise = skillLoader.loadSkillsFromURL(url);
                let resultJQ = $(dialog.getResultPanel());
                if (!loadPromise) {
                    resultJQ
                        .addClass("error")
                        .text("Invalid kitlaan URL. Expected format is https://kitlaan.gitlab.io/mwoskill/?p=<skills>...");
                    return;
                }
                resultJQ
                    .removeClass("error")
                    .text("Loading URL " + url);
                dialog.setLoading(true);
                loadPromise
                    .then(function (data) {
                    let kitlaanData = data;
                    let skillQuirks = skillLoader.convertDataToMechQuirks(kitlaanData, loadMechDialog.mechId);
                    loadMechDialog.loadedSkillQuirks = skillQuirks;
                    loadMechDialog.loadedSkillState = skillLoader.getSkillState();
                    loadMechDialog.skillListPanel.setQuirks(skillQuirks);
                    loadMechDialog.skillListPanel.render();
                    loadMechDialog.okButton.enable();
                    Util.log("Loaded data from kitlaan: " + data);
                })
                    .catch(function (err) {
                    Util.error("Error loading kitlaan data: " + Error(err));
                    dialog.setError("Error loading kitlaan data: " + Error(err));
                    dialog.okButton.disable();
                })
                    .then(function (data) {
                    dialog.setLoading(false);
                    Util.log("Kitlaan load done.");
                });
            };
        }
    }
    LoadMechSkillsDialog.DialogId = "loadMechSkillsDialog";
    class MechQuirkListPanel extends Widgets.DomStoredWidget {
        constructor(domElement, mechId) {
            super(domElement);
            this.quirkList = [];
            this.storeToDom(MechQuirkListPanel.MechQuirkListDomKey);
            this.mechId = mechId;
        }
        setQuirks(quirkList) {
            let thisPanel = this;
            this.quirkList = quirkList.slice();
            this.quirkList.sort(function (quirkA, quirkB) {
                let applicableQuirkA = MechModelView.isQuirkApplicable(thisPanel.mechId, quirkA) ? 0 : 1;
                let applicableQuirkB = MechModelView.isQuirkApplicable(thisPanel.mechId, quirkB) ? 0 : 1;
                if (applicableQuirkA !== applicableQuirkB) {
                    return applicableQuirkA - applicableQuirkB;
                }
                return (quirkA.translated_name.localeCompare(quirkB.translated_name));
            });
        }
        render() {
            let mechQuirksJQ = $(this.domElement);
            mechQuirksJQ.empty();
            if (this.quirkList.length === 0) {
                let mechQuirkDiv = Widgets.cloneTemplate("mechDetailsQuirkRow-template");
                let mechQuirkJQ = $(mechQuirkDiv);
                mechQuirkJQ.find(".name").text("None");
                mechQuirksJQ.append(mechQuirkJQ);
            }
            for (let mechQuirk of this.quirkList) {
                let mechQuirkDiv = Widgets.cloneTemplate("mechDetailsQuirkRow-template");
                let mechQuirkJQ = $(mechQuirkDiv);
                mechQuirkJQ.find(".name").text(mechQuirk.translated_name);
                mechQuirkJQ.find(".value").text(mechQuirk.translated_value);
                if (MechModelView.isQuirkApplicable(this.mechId, mechQuirk)) {
                    if (mechQuirk.isBonus()) {
                        mechQuirkJQ.addClass("bonus");
                    }
                    else {
                        mechQuirkJQ.addClass("malus");
                    }
                }
                else {
                    mechQuirkJQ.addClass("noeffect");
                }
                mechQuirksJQ.append(mechQuirkJQ);
            }
        }
    }
    MechQuirkListPanel.MechQuirkListDomKey = "mwosim.MechQuirkListPanel.uiObject";
})(MechViewMechDetails || (MechViewMechDetails = {}));
//TODO: Unify the update methods into mechpanel, so ModelView doesn't have to know about mechpanel's
//individual components
//TODO: Remove mechId from method parameters in MechPanel. Use stored mechId instead.
var MechViewMechPanel;
//TODO: Unify the update methods into mechpanel, so ModelView doesn't have to know about mechpanel's
//individual components
//TODO: Remove mechId from method parameters in MechPanel. Use stored mechId instead.
(function (MechViewMechPanel) {
    var EventType = MechModelCommon.EventType;
    var WeaponCycle = MechModelCommon.WeaponCycle;
    var Component = MechModelCommon.Component;
    var DomStoredWidget = Widgets.DomStoredWidget;
    var damageColor = MechViewDamageColor.damageColor;
    MechViewMechPanel.init = function () {
        let eventQueue = MechModelView.getEventQueue();
        eventQueue.addListener(simulationStateListener, EventType.START, EventType.PAUSE);
    };
    var simulationStateListener = function (event) {
        let setButtonEnabled = Widgets.setButtonListEnabled;
        if (event.type === EventType.START) {
            //disable move and delete buttons
            let deleteButtonsJQ = $(".deleteMechButton");
            setButtonEnabled(deleteButtonsJQ, false);
            let moveButtonsJQ = $(".moveMechButton");
            setButtonEnabled(moveButtonsJQ, false);
        }
        else {
            //enable move and delete buttons
            let deleteButtonsJQ = $(".deleteMechButton");
            setButtonEnabled(deleteButtonsJQ, true);
            let moveButtonsJQ = $(".moveMechButton");
            setButtonEnabled(moveButtonsJQ, true);
        }
    };
    class PaperDoll extends DomStoredWidget {
        constructor(mechId) {
            let paperDollDiv = Widgets.cloneTemplate("paperDoll-template");
            super(paperDollDiv);
            this.storeToDom(PaperDoll.PaperDollDomKey);
            this.mechId = mechId;
            let paperDollJQ = $(paperDollDiv)
                .attr("id", PaperDoll.paperDollId(mechId))
                .attr("data-mech-id", mechId);
            for (let componentField in Component) {
                if (!Component.hasOwnProperty(componentField)) {
                    continue;
                }
                let component = Component[componentField];
                let findStr = `> [data-location='${component}']`;
                paperDollJQ.find(findStr)
                    .attr("id", PaperDoll.paperDollComponentId(mechId, component));
            }
        }
        //Add a paper doll with the given mechId to the element with the id
        //paperDollContainer uses the template paperDoll-template from the main HTML file
        static paperDollId(mechId) {
            return mechId + "-paperDoll";
        }
        static paperDollComponentId(mechId, component) {
            return `${mechId}-paperDoll-${component}`;
        }
        static getPaperDoll(mechId) {
            let domElement = document.getElementById(PaperDoll.paperDollId(mechId));
            if (!domElement) {
                return null;
            }
            return DomStoredWidget.fromDom(domElement, PaperDoll.PaperDollDomKey);
        }
        //Percent values from 0 to 1
        setPaperDollArmor(location, percent) {
            var color = damageColor(percent, MechViewDamageColor.PaperDollDamageGradient);
            let paperDollComponent = document.getElementById(PaperDoll.paperDollComponentId(this.mechId, location));
            if (paperDollComponent) {
                paperDollComponent.style.borderColor = color;
            }
        }
        setPaperDollStructure(location, percent) {
            var color = damageColor(percent, MechViewDamageColor.PaperDollDamageGradient);
            let paperDollComponent = document.getElementById(PaperDoll.paperDollComponentId(this.mechId, location));
            if (paperDollComponent) {
                paperDollComponent.style.backgroundColor = color;
            }
        }
    }
    PaperDoll.PaperDollDomKey = "mwosim.PaperDoll.uiObject";
    MechViewMechPanel.PaperDoll = PaperDoll;
    class MechHealthNumbers extends DomStoredWidget {
        constructor(mech) {
            let mechHealthNumbersDiv = Widgets.cloneTemplate("mechHealthNumbers-template");
            super(mechHealthNumbersDiv);
            this.storeToDom(MechHealthNumbers.MechHealthNumbersDomKey);
            this.mechId = mech.getMechId();
            let mechHealthNumbersDivId = MechHealthNumbers.mechHealthNumbersId(this.mechId);
            let mechHealthNumbersJQ = $(mechHealthNumbersDiv)
                .attr("id", mechHealthNumbersDivId)
                .attr("data-mech-id", this.mechId);
            for (let locationIdx in Component) {
                if (Component.hasOwnProperty(locationIdx)) {
                    let location = Component[locationIdx];
                    mechHealthNumbersJQ.find(` [data-location='${location}']` +
                        " [data-healthtype=armor]")
                        .attr("id", MechHealthNumbers.mechHealthNumbersArmorId(this.mechId, location));
                    mechHealthNumbersJQ.find(` [data-location='${location}']` +
                        " [data-healthtype=structure]")
                        .attr("id", MechHealthNumbers.mechHealthNumbersStructureId(this.mechId, location));
                }
            }
        }
        static mechHealthNumbersId(mechId) {
            return mechId + "-mechHealthNumbers";
        }
        static mechHealthNumbersArmorId(mechId, location) {
            return mechId + "-mechHealthNumbers-" + location + "-armor";
        }
        static mechHealthNumbersStructureId(mechId, location) {
            return mechId + "-mechHealthNumbers-" + location + "-structure";
        }
        static getMechHealthNumbers(mechId) {
            let domElement = document.getElementById(MechHealthNumbers.mechHealthNumbersId(mechId));
            if (!domElement) {
                return null;
            }
            return DomStoredWidget.fromDom(domElement, MechHealthNumbers.MechHealthNumbersDomKey);
        }
        updateMechHealthNumbers(updateParams) {
            let location = updateParams.location;
            let armor = updateParams.armor;
            let structure = updateParams.structure;
            let maxArmor = updateParams.maxArmor;
            let maxStructure = updateParams.maxStructure;
            let mechHealthNumbersDivId = MechHealthNumbers.mechHealthNumbersId(this.mechId);
            let armorPercent = Number(armor) / Number(maxArmor);
            let structurePercent = Number(structure) / Number(maxStructure);
            let armorColor = damageColor(armorPercent, MechViewDamageColor.ComponentHealthDamageGradient);
            let structureColor = damageColor(structurePercent, MechViewDamageColor.ComponentHealthDamageGradient);
            let armorLocationDivId = MechHealthNumbers.mechHealthNumbersArmorId(this.mechId, location);
            let structureLocationDivId = MechHealthNumbers.mechHealthNumbersStructureId(this.mechId, location);
            let armorLocationDiv = document.getElementById(armorLocationDivId);
            if (armorLocationDiv) {
                armorLocationDiv.textContent = String(Math.round(armor));
                //NOTE: Title change too expensive
                // armorLocationDiv.setAttribute("title", (Number(armor)).toFixed(2));
                armorLocationDiv.style.color = armorColor;
            }
            let structureLocationDiv = document.getElementById(structureLocationDivId);
            if (structureLocationDiv) {
                structureLocationDiv.textContent = String(Math.round(structure));
                //NOTE: Title change too expensive
                // structureLocationDiv.setAttribute("title", (Number(structure)).toFixed(2));
                structureLocationDiv.style.color = structureColor;
            }
        }
    }
    MechHealthNumbers.MechHealthNumbersDomKey = "mwosim.MechHealthNumbers.uiObject";
    MechViewMechPanel.MechHealthNumbers = MechHealthNumbers;
    class Heatbar extends DomStoredWidget {
        constructor(mechId, heatbarContainer) {
            let heatbarDiv = Widgets.cloneTemplate("heatbar-template");
            super(heatbarDiv);
            this.storeToDom(Heatbar.HeatbarDomKey);
            this.mechId = mechId;
            $(heatbarDiv)
                .attr("id", Heatbar.heatbarId(mechId))
                .attr("data-mech-id", mechId)
                .appendTo("#" + heatbarContainer);
            $(heatbarDiv).find("[class~=heatbar]")
                .attr("id", Heatbar.heatbarValueId(mechId))
                .attr("data-mech-id", mechId);
        }
        static heatbarId(mechId) {
            return mechId + "-heatbar";
        }
        static heatbarValueId(mechId) {
            return mechId + "-heatbarValue";
        }
        static getHeatbar(mechId) {
            let domElement = document.getElementById(Heatbar.heatbarId(mechId));
            if (!domElement) {
                return null;
            }
            return DomStoredWidget.fromDom(domElement, Heatbar.HeatbarDomKey);
        }
        //Sets the heatbar value for a given mech id to a specified percentage. Value of
        //percent is 0 to 1
        setHeatbarValue(percent) {
            var invPercent = 1 - percent;
            let heatbarValueDiv = document.getElementById(Heatbar.heatbarValueId(this.mechId));
            heatbarValueDiv.style.height = (100 * invPercent) + "%";
        }
        updateHeat(currHeat, currMaxHeat) {
            let heatPercent = Number(currHeat) / Number(currMaxHeat);
            this.setHeatbarValue(heatPercent);
            var heatNumberId = MechPanel.heatNumberPanelId(this.mechId);
            let heatText = Number(heatPercent * 100).toFixed(0) + "%" +
                " (" + Number(currHeat).toFixed(1) + ")";
            let heatNumberDiv = document.getElementById(heatNumberId);
            heatNumberDiv.textContent = heatText;
        }
    }
    Heatbar.HeatbarDomKey = "mwosim.Heatbar.uiObject";
    MechViewMechPanel.Heatbar = Heatbar;
    class WeaponPanel extends DomStoredWidget {
        //TODO: Do not directly access WeaponState and AmmoState here
        constructor(mechId, weaponStateList, ammoState, weaponPanel) {
            super(weaponPanel);
            this.storeToDom(WeaponPanel.WeaponPanelDomKey);
            this.mechId = mechId;
            $(weaponPanel).attr("id", WeaponPanel.weaponPanelId(mechId));
            for (var idx in weaponStateList) {
                if (!weaponStateList.hasOwnProperty(idx)) {
                    continue;
                }
                var weaponState = weaponStateList[idx];
                let weaponRowDiv = Widgets.cloneTemplate("weaponRow-template");
                $(weaponRowDiv)
                    .attr("id", WeaponPanel.weaponRowId(mechId, Number(idx)))
                    .attr("data-mech-id", mechId)
                    .attr("data-weapon-idx", idx)
                    .appendTo(weaponPanel);
                $(weaponRowDiv).find(".weaponName")
                    .attr("id", WeaponPanel.weaponNameId(mechId, Number(idx)))
                    .html(weaponState.weaponInfo.translatedName);
                $(weaponRowDiv).find(".weaponLocation")
                    .attr("id", WeaponPanel.weaponLocationId(mechId, Number(idx)))
                    .html(WeaponPanel.weaponLocAbbr[weaponState.weaponInfo.location]);
                $(weaponRowDiv).find(".weaponCooldownBar")
                    .attr("id", WeaponPanel.weaponCooldownBarId(mechId, Number(idx)));
                $(weaponRowDiv).find(".weaponAmmo")
                    .attr("id", WeaponPanel.weaponAmmoId(mechId, Number(idx)));
                this.setWeaponAmmo(Number(idx), 0);
                this.setWeaponState(Number(idx), weaponState.weaponCycle);
                this.setWeaponCooldown(Number(idx), 0);
            }
        }
        static weaponPanelId(mechId) {
            return `${mechId}-weaponPanelContainer`;
        }
        static weaponRowId(mechId, idx) {
            return `${mechId}-${idx}-weaponrow`;
        }
        static weaponNameId(mechId, idx) {
            return WeaponPanel.weaponRowId(mechId, idx) + "-weaponName";
        }
        static weaponLocationId(mechId, idx) {
            return WeaponPanel.weaponRowId(mechId, idx) + "-weaponLocation";
        }
        static weaponCooldownBarId(mechId, idx) {
            return WeaponPanel.weaponRowId(mechId, idx) + "-weaponCooldownBar";
        }
        static weaponAmmoId(mechId, idx) {
            return WeaponPanel.weaponRowId(mechId, idx) + "-weaponAmmo";
        }
        static getWeaponPanel(mechId) {
            let domElement = document.getElementById(WeaponPanel.weaponPanelId(mechId));
            if (!domElement) {
                return null;
            }
            return DomStoredWidget.fromDom(domElement, WeaponPanel.WeaponPanelDomKey);
        }
        setWeaponCooldown(weaponIdx, percent, type = "cooldown") {
            let cooldownDiv = document.getElementById(WeaponPanel.weaponCooldownBarId(this.mechId, weaponIdx));
            if (percent > 1) {
                cooldownDiv.classList.add("over100");
            }
            else {
                cooldownDiv.classList.remove("over100");
            }
            percent = Math.min(1, percent);
            cooldownDiv.style.width = (100 * percent) + "%";
            if (type === "cooldown") {
                cooldownDiv.classList.remove("jamBar");
            }
            else if (type === "jamBar") {
                cooldownDiv.classList.add("jamBar");
            }
        }
        setWeaponAmmo(weaponIdx, ammo) {
            let weaponAmmoDiv = document.getElementById(WeaponPanel.weaponAmmoId(this.mechId, weaponIdx));
            weaponAmmoDiv.textContent = ammo !== -1 ? String(ammo) : "\u221e"; //infinity symbol
        }
        setWeaponState(weaponIdx, state) {
            //Note: the remove class string must include all the MechModel.WeaponCycle strings
            let weaponRowDiv = document.getElementById(WeaponPanel.weaponRowId(this.mechId, weaponIdx));
            for (let weaponCycle in WeaponCycle) {
                if (WeaponCycle.hasOwnProperty(weaponCycle)) {
                    weaponRowDiv.classList.remove(WeaponCycle[weaponCycle]);
                }
            }
            weaponRowDiv.classList.add(state);
        }
    }
    WeaponPanel.WeaponPanelDomKey = "mwosim.WeaponPanel.uiObject";
    WeaponPanel.weaponLocAbbr = {
        "head": "H",
        "left_arm": "LA",
        "left_torso": "LT",
        "centre_torso": "CT",
        "right_torso": "RT",
        "right_arm": "RA",
        "left_leg": "LL",
        "right_leg": "RL",
    };
    MechViewMechPanel.WeaponPanel = WeaponPanel;
    class MechPanel extends DomStoredWidget {
        constructor(mech, team) {
            let mechPanelDiv = Widgets.cloneTemplate("mechPanel-template");
            super(mechPanelDiv);
            this.storeToDom(MechPanel.MechPanelDomKey);
            this.mechId = mech.getMechId();
            let mechId = mech.getMechId();
            let mechState = mech.getMechState();
            let weaponStateList = mechState.weaponStateList;
            let ammoState = mechState.ammoState;
            let mechPanelContainer = "#" + team + "Team";
            let mechPanelJQ = $(mechPanelDiv);
            //TODO: Mechpanel inserts itself into the DOM in the constructor because weapon panel updates
            //use document.getElementById() for performance reasons. Find a way to use the standard idiom 
            //(where the caller to new MechPanel() is responsible for DOM insertion) without using querySelectors
            //in WeaponPanel updates. Possible solution: implement RenderedWidget and only call render upon dom insertion
            let endPanelJQ = $("#" + MechPanel.mechPanelId(EndMechPanel.getEndMechId(team)));
            mechPanelJQ
                .attr("id", MechPanel.mechPanelId(mechId))
                .attr("data-mech-id", mechId)
                .insertBefore(endPanelJQ);
            var mechHealthAndWeaponsDivId = MechPanel.mechHealthAndWeaponsId(mechId);
            mechPanelJQ.find("[class~=mechHealthAndWeapons]")
                .attr("id", mechHealthAndWeaponsDivId);
            var paperDollContainerId = mechId + "-paperDollContainer";
            let paperDollJQ = mechPanelJQ.find("[class~='paperDollContainer']")
                .attr("id", paperDollContainerId);
            let paperDoll = new PaperDoll(mechId);
            paperDollJQ.append(paperDoll.domElement);
            let mechHealthNumbersContainerJQ = mechPanelJQ.find("[class~='mechHealthNumbersContainer']");
            let mechHealthNumbers = new MechHealthNumbers(mech);
            mechHealthNumbersContainerJQ.append(mechHealthNumbers.domElement);
            var heatbarContainerId = mechId + "-heatbarContainer";
            let heatbarContainerJQ = mechPanelJQ.find("[class~='heatbarContainer']")
                .attr("id", heatbarContainerId);
            let heatbar = new Heatbar(mechId, heatbarContainerId);
            heatbarContainerJQ.append(heatbar.domElement);
            var heatNumberId = MechPanel.heatNumberPanelId(mechId);
            mechPanelJQ.find("[class~='heatNumber']")
                .attr("id", heatNumberId);
            var weaponPanelContainerId = WeaponPanel.weaponPanelId(mechId);
            let weaponPanelJQ = mechPanelJQ.find("[class~='weaponPanelContainer']");
            let weaponPanel = new WeaponPanel(mechId, weaponStateList, ammoState, weaponPanelJQ.get(0));
            let mechNameId = MechPanel.mechNamePanelId(mechId);
            mechPanelJQ.find("[class~='titlePanel'] [class~='mechName']")
                .attr("id", mechNameId)
                .html("");
            //delete button
            this.addDeleteMechButton(mechId, team, mechPanelDiv);
            //move button
            this.addMoveMechButton(mechId, team, mechPanelDiv);
            //drag and drop handlers
            DragAndDropHelper.addDragAndDropHandlers(mechPanelDiv);
            //touch handlers
            //TODO: Disabled for touchhandler slowdown workaround (touch handlers are added in toggleMoveMech)
            // TouchHelper.addTouchHandlers(mechPanelDiv);
            //Mech stats
            let mechSummaryHealthId = MechPanel.mechSummaryHealthPanelId(mechId);
            mechPanelJQ.find("[class~='statusPanel'] [class~='mechSummaryHealthText']")
                .attr("id", mechSummaryHealthId)
                .html("");
            let mechTargetId = MechPanel.mechTargetPanelId(mechId);
            mechPanelJQ.find("[class~='statusPanel'] [class~='mechTargetText']")
                .attr("id", mechTargetId)
                .html("");
            let mechDPSId = MechPanel.mechDPSPanelId(mechId);
            mechPanelJQ.find("[class~='statusPanel'] [class~='mechDPSText']")
                .attr("id", mechDPSId)
                .html("");
            let mechBurstId = MechPanel.mechBurstPanelId(mechId);
            mechPanelJQ.find("[class~='statusPanel'] [class~='mechBurstText']")
                .attr("id", mechBurstId)
                .html("");
            let mechTotalDamageId = MechPanel.mechTotalDamagePanelId(mechId);
            mechPanelJQ.find("[class~='statusPanel'] [class~='mechTotalDamageText']")
                .attr("id", mechTotalDamageId)
                .html("");
            this.addMechDetailsButton(mechId, mechPanelDiv);
        }
        //adds a mech panel (which contains a paperDoll, a heatbar and a weaponPanel)
        static mechPanelId(mechId) {
            return mechId + "-mechPanel";
        }
        static mechSummaryHealthPanelId(mechId) {
            return mechId + "-mechSummaryHealth";
        }
        static mechNamePanelId(mechId) {
            return mechId + "-mechName";
        }
        static heatNumberPanelId(mechId) {
            return mechId + "-heatbarNumber";
        }
        static mechTargetPanelId(mechId) {
            return mechId + "-mechTarget";
        }
        static mechHealthAndWeaponsId(mechId) {
            return mechId + "-mechHealthAndWeapons";
        }
        static mechDPSPanelId(mechId) {
            return mechId + "-mechDPSText";
        }
        static mechBurstPanelId(mechId) {
            return mechId + "-mechBurstText";
        }
        static mechTotalDamagePanelId(mechId) {
            return mechId + "-mechTotalDamageText";
        }
        static getMechPanel(mechId) {
            let domElement = document.getElementById(MechPanel.mechPanelId(mechId));
            if (!domElement) {
                return null;
            }
            return DomStoredWidget.fromDom(domElement, MechPanel.MechPanelDomKey);
        }
        updateMechTitlePanel(mechId, mechName, smurfyMechId, smurfyLayoutId) {
            const SMURFY_BASE_URL = "http://mwo.smurfy-net.de/mechlab#";
            let mechNameId = MechPanel.mechNamePanelId(mechId);
            //Create smurfy link then set the mech name
            let smurfyLink = SMURFY_BASE_URL + "i=" + smurfyMechId + "&l=" + smurfyLayoutId;
            let mechNameDiv = document.getElementById(mechNameId);
            let externalLinkSpan = Widgets.cloneTemplate("external-link-template");
            let mechLink = $("<a></a>").attr("href", smurfyLink)
                .attr("target", "_blank")
                .attr("rel", "noopener")
                .text(mechName)
                .append(externalLinkSpan);
            $(mechNameDiv)
                .empty()
                .append(mechLink);
        }
        updateMechStatusPanel(mechId, update) {
            let mechSummaryHealthId = MechPanel.mechSummaryHealthPanelId(mechId);
            let mechHealthAndWeaponsDivId = MechPanel.mechHealthAndWeaponsId(mechId);
            let mechHealthAndWeaponsDiv = document.getElementById(mechHealthAndWeaponsDivId);
            //set mech summary health
            let mechSummaryHealthText = "";
            let percentHealth = Number(update.mechCurrTotalHealth) / Number(update.mechCurrMaxHealth);
            if (update.mechCurrTotalHealth > 0 && update.mechIsAlive) {
                mechSummaryHealthText = ((percentHealth * 100).toFixed(0)) + "%";
                if (mechHealthAndWeaponsDiv.classList.contains("kia")) {
                    mechHealthAndWeaponsDiv.classList.remove("kia");
                }
            }
            else {
                mechSummaryHealthText =
                    "KIA" + "(" + ((percentHealth * 100).toFixed(0)) + "%" + ")";
                percentHealth = 0;
                if (!mechHealthAndWeaponsDiv.classList.contains("kia")) {
                    mechHealthAndWeaponsDiv.classList.add("kia");
                }
            }
            let mechSummaryHealthDiv = document.getElementById(mechSummaryHealthId);
            mechSummaryHealthDiv.style.color =
                damageColor(percentHealth, MechViewDamageColor.HealthDamageGradient);
            mechSummaryHealthDiv.textContent = mechSummaryHealthText;
            //update mech target
            let mechTargetId = MechPanel.mechTargetPanelId(mechId);
            let mechTargetDiv = document.getElementById(mechTargetId);
            mechTargetDiv.textContent = update.targetMechName;
            //set mech total damage
            let mechTotalDamageId = MechPanel.mechTotalDamagePanelId(mechId);
            let mechTotalDamageDiv = document.getElementById(mechTotalDamageId);
            mechTotalDamageDiv.textContent = Number(update.totalDmg).toFixed(1);
            //set mech dps
            let mechDPSId = MechPanel.mechDPSPanelId(mechId);
            let mechDPSDiv = document.getElementById(mechDPSId);
            mechDPSDiv.textContent = Number(update.dps).toFixed(1);
            //set mech burst
            let mechBurstId = MechPanel.mechBurstPanelId(mechId);
            let mechBurstDiv = document.getElementById(mechBurstId);
            mechBurstDiv.textContent = Number(update.burst).toFixed(1);
        }
        updateQuirkSkillFlags(mechId) {
            let mechJQ = $("#" + MechPanel.mechPanelId(mechId));
            let mechQuirks = MechModelView.getMechQuirks(mechId);
            let quirkFlagJQ = mechJQ.find(".quirkFlag");
            if (mechQuirks && mechQuirks.length > 0) {
                quirkFlagJQ.removeClass("hidden");
            }
            else {
                quirkFlagJQ.addClass("hidden");
            }
            let mechSkills = MechModelView.getMechSkillQuirks(mechId);
            let skillFlagJQ = mechJQ.find(".skillFlag");
            if (mechSkills && mechSkills.length > 0) {
                skillFlagJQ.removeClass("hidden");
            }
            else {
                skillFlagJQ.addClass("hidden");
            }
        }
        //Delete button
        static mechDeleteButtonId(mechId) {
            return mechId + "-deleteButton";
        }
        addDeleteMechButton(mechId, team, mechPanelDiv) {
            let mechPanelJQ = $(mechPanelDiv);
            if (!MechPanel.deleteMechButtonHandler) {
                MechPanel.deleteMechButtonHandler = this.createDeleteMechButtonHandler();
            }
            let deleteIconSVG = Widgets.cloneTemplate("delete-icon-template");
            let mechDeleteButtonDivId = MechPanel.mechDeleteButtonId(mechId);
            let deleteButtonJQ = mechPanelJQ.find("[class~='titlePanel'] [class~='deleteMechButton']")
                .attr("id", mechDeleteButtonDivId)
                .attr("data-mech-id", mechId)
                .append(deleteIconSVG);
            let deleteButton = new Widgets.Button(deleteButtonJQ.get(0), MechPanel.deleteMechButtonHandler);
        }
        createDeleteMechButtonHandler() {
            return function () {
                let mechId = $(this).attr("data-mech-id");
                Util.log("Deleting " + mechId);
                let result = MechModel.deleteMech(mechId);
                if (!result) {
                    throw Error("Error deleting " + mechId);
                }
                let mechPanelDivId = MechPanel.mechPanelId(mechId);
                $("#" + mechPanelDivId).remove();
                MechView.resetSimulation();
                MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
                MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_CHANGE });
            };
        }
        static moveMechButtonId(mechId) {
            return mechId + "-moveButton";
        }
        addMoveMechButton(mechId, team, mechPanelDiv) {
            let mechPanelJQ = $(mechPanelDiv);
            let moveIconSVG = Widgets.cloneTemplate("move-icon-template");
            let mechMoveButtonDivId = MechPanel.moveMechButtonId(mechId);
            let mechMoveButtonJQ = mechPanelJQ.find("[class~='titlePanel'] [class~='moveMechButton']")
                .attr("id", mechMoveButtonDivId)
                .attr("data-mech-id", mechId)
                .attr("data-dragenabled", "false")
                .append(moveIconSVG);
            let mechMoveButton = new Widgets.Button(mechMoveButtonJQ.get(0), this.createMoveMechButtonHandler());
        }
        isDragEnabled() {
            let moveMechButtonJQ = $(this.domElement).find(".moveMechButton");
            return moveMechButtonJQ.attr("data-dragenabled") === "true";
        }
        toggleMoveMech(mechId, updateTouchHandlers = true) {
            let moveMechButtonJQ = $(this.domElement).find(".moveMechButton");
            let dragEnabled = this.isDragEnabled();
            let mechPanelJQ = $(this.domElement);
            dragEnabled = !dragEnabled; //toggle
            moveMechButtonJQ.attr("data-dragenabled", String(dragEnabled));
            let thisMechPanel = this;
            if (dragEnabled) {
                mechPanelJQ
                    .attr("draggable", "true")
                    .addClass("dragging");
                $(".mechPanel").map(function (index, domElement) {
                    let otherMechId = $(this).attr("data-mech-id");
                    let otherMechPanel = MechPanel.getMechPanel(otherMechId);
                    if (otherMechPanel && otherMechPanel.isDragEnabled() && otherMechPanel !== thisMechPanel) {
                        otherMechPanel.toggleMoveMech(otherMechId, false);
                    }
                    //TODO: Workaround for slowdown caused by touchhandlers: Only put in touch handlers when
                    //a mechpanel is being dragged
                    if (updateTouchHandlers) {
                        TouchHelper.addTouchHandlers(this);
                    }
                    return this;
                });
            }
            else {
                mechPanelJQ
                    .attr("draggable", "false")
                    .removeClass("dragging");
                //TODO: Touchpanel slowdown workaround
                $(".mechPanel").map(function (index, domElement) {
                    if (updateTouchHandlers) {
                        TouchHelper.removeTouchHandlers(this);
                    }
                    return this;
                });
            }
        }
        createMoveMechButtonHandler() {
            let mechPanel = this;
            return function () {
                let mechId = $(this).attr("data-mech-id");
                mechPanel.toggleMoveMech(mechId);
            };
        }
        addMechDetailsButton(mechId, mechPanelDiv) {
            let mechPanelJQ = $(mechPanelDiv);
            let mechDetailsJQ = mechPanelJQ.find(".mechDetailsContainer");
            let mechDetailsButtonJQ = mechPanelJQ.find(".mechDetailsButton")
                .attr("data-mech-id", mechId);
            let mechDetailsButtonArrowJQ = mechPanelJQ.find(".mechDetailsButtonArrow");
            let mechDetailsTransitionEndHandler = function () {
                mechDetailsButtonArrowJQ.off("transitionend", mechDetailsTransitionEndHandler);
                if (!mechDetailsButton.expanded) {
                    mechDetailsJQ.empty();
                }
            };
            let mechPanel = this;
            let mechDetailsClickHandler = function () {
                mechDetailsButtonArrowJQ.on("transitionend", mechDetailsTransitionEndHandler);
                if (!mechDetailsButton.expanded) {
                    mechPanel.createMechDetails(mechId, mechDetailsJQ.get(0));
                }
            };
            let mechDetailsButton = new Widgets.ExpandButton(mechDetailsButtonJQ.get(0), mechDetailsClickHandler, mechDetailsJQ.get(0), mechDetailsButtonArrowJQ.get(0));
        }
        createMechDetails(mechId, mechDetailsContainer) {
            let mechDetails = new MechViewMechDetails.MechDetails(mechId);
            mechDetails.render();
            $(mechDetailsContainer).append(mechDetails.domElement);
        }
        //scrolls to and flashes the selected mech panel
        highlightMechPanel(mechId) {
            let mechPanelDivId = MechPanel.mechPanelId(mechId);
            let mechPanelJQ = $("#" + mechPanelDivId);
            mechPanelJQ.get(0).scrollIntoView(false);
            mechPanelJQ.addClass("flashSelected");
            mechPanelJQ.on("animationend", function (data) {
                mechPanelJQ.removeClass("flashSelected");
                mechPanelJQ.off("animationend");
            });
        }
        highlightOnDragOver(prevDropTargetId) {
            if (prevDropTargetId) {
                let prevMechPanel = MechPanel.getMechPanel(prevDropTargetId) || EndMechPanel.getEndMechPanel(prevDropTargetId);
                prevMechPanel.domElement.classList.remove("droptarget");
            }
            this.domElement.classList.add("droptarget");
        }
        moveToTargetMechId(targetMechId) {
            let targetMechPanel;
            targetMechPanel = MechPanel.getMechPanel(targetMechId)
                || EndMechPanel.getEndMechPanel(targetMechId);
            targetMechPanel.domElement.classList.remove("droptarget");
            if (this.mechId === targetMechId) {
                return;
            }
            MechView.resetSimulation();
            let status = false;
            if (!EndMechPanel.isEndMechId(targetMechId)) {
                status = MechModel.moveMech(this.mechId, targetMechId);
            }
            else {
                let team = EndMechPanel.getEndMechIdTeam(targetMechId);
                status = MechModel.moveMechToEndOfList(this.mechId, team);
                Util.log("Insert at end: team=" + team);
            }
            if (!status) {
                Util.error(`Error moving mech. src=${this.mechId} dest=${targetMechId}`);
            }
            else {
                Util.log(`Drop: src=${this.mechId} dest=${targetMechId}`);
                let srcMechJQ = $(this.domElement);
                srcMechJQ
                    .detach()
                    .insertBefore(targetMechPanel.domElement);
                this.toggleMoveMech(this.mechId);
                MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_CHANGE });
                MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
            }
        }
    }
    MechPanel.MechPanelDomKey = "mwosim.MechPanel.uiObject";
    MechViewMechPanel.MechPanel = MechPanel;
    class EndMechPanel extends DomStoredWidget {
        constructor(team) {
            let mechPanelDiv = Widgets.cloneTemplate("endMechPanel-template");
            super(mechPanelDiv);
            this.storeToDom(EndMechPanel.EndMechPanelDomKey);
            let mechPanelJQ = $(mechPanelDiv);
            let mechId = EndMechPanel.getEndMechId(team);
            mechPanelJQ
                .attr("id", MechPanel.mechPanelId(mechId))
                .attr("data-mech-id", mechId);
            DragAndDropHelper.addDragAndDropHandlers(mechPanelDiv);
        }
        static getEndMechId(team) {
            return EndMechPanel.EndMechIdPrefix + team;
        }
        static isEndMechId(mechId) {
            return mechId.startsWith(EndMechPanel.EndMechIdPrefix);
        }
        static getEndMechPanel(mechId) {
            let domElement = document.getElementById(MechPanel.mechPanelId(mechId));
            if (!domElement) {
                return null;
            }
            return DomStoredWidget.fromDom(domElement, EndMechPanel.EndMechPanelDomKey);
        }
        highlightOnDragOver(prevDropTargetId) {
            if (prevDropTargetId) {
                let prevMechPanel = MechPanel.getMechPanel(prevDropTargetId) || EndMechPanel.getEndMechPanel(prevDropTargetId);
                prevMechPanel.domElement.classList.remove("droptarget");
            }
            this.domElement.classList.add("droptarget");
        }
    }
    EndMechPanel.EndMechPanelDomKey = "mwosim.EndMechPanel.uiObject";
    EndMechPanel.EndMechIdPrefix = "end-mech-fake-id-";
    EndMechPanel.getEndMechIdTeam = function (mechId) {
        if (EndMechPanel.isEndMechId(mechId)) {
            return mechId.substring(EndMechPanel.EndMechIdPrefix.length);
        }
        else {
            return null;
        }
    };
    MechViewMechPanel.EndMechPanel = EndMechPanel;
    class DragAndDropHelper {
        //NOTE: The use of static prevDropTarget means you can only drag one item at a time. Could be an
        //issue on multi-touch devices
        static addDragAndDropHandlers(mechPanelDiv) {
            let mechPanelJQ = $(mechPanelDiv);
            if (!DragAndDropHelper.mechOnDragHandler) {
                DragAndDropHelper.mechOnDragHandler = this.createMechOnDragHandler();
            }
            mechPanelJQ.on("dragstart", DragAndDropHelper.mechOnDragHandler);
            if (!DragAndDropHelper.mechOnDragOverHandler) {
                DragAndDropHelper.mechOnDragOverHandler = this.createMechOnDragOverHandler();
            }
            mechPanelJQ.on("dragover", DragAndDropHelper.mechOnDragOverHandler);
            if (!DragAndDropHelper.mechOnDropHandler) {
                DragAndDropHelper.mechOnDropHandler = this.createMechOnDropHandler();
            }
            mechPanelJQ.on("drop", DragAndDropHelper.mechOnDropHandler);
        }
        static createMechOnDragHandler() {
            return function (jqEvent) {
                let mechId = $(this).attr("data-mech-id");
                let origEvent = jqEvent.originalEvent;
                origEvent.dataTransfer.setData("text/plain", mechId);
                origEvent.dataTransfer.effectAllowed = "move";
                Util.log("Drag start: " + mechId);
            };
        }
        static createMechOnDragOverHandler() {
            return function (jqEvent) {
                let thisJQ = $(this);
                let mechId = thisJQ.attr("data-mech-id");
                let origEvent = jqEvent.originalEvent;
                jqEvent.preventDefault();
                //allow move on drop
                origEvent.dataTransfer.dropEffect = "move";
                if (DragAndDropHelper.prevDropTarget !== mechId) {
                    let mechPanel = MechPanel.getMechPanel(mechId) || EndMechPanel.getEndMechPanel(mechId);
                    mechPanel.highlightOnDragOver(DragAndDropHelper.prevDropTarget);
                    DragAndDropHelper.prevDropTarget = mechId;
                }
            };
        }
        static createMechOnDropHandler() {
            return function (jqEvent) {
                let thisJQ = $(this);
                let dropTargetMechId = thisJQ.attr("data-mech-id");
                let origEvent = jqEvent.originalEvent;
                let srcMechId = origEvent.dataTransfer.getData("text/plain");
                jqEvent.preventDefault();
                let srcMechPanel = MechPanel.getMechPanel(srcMechId);
                srcMechPanel.moveToTargetMechId(dropTargetMechId);
                DragAndDropHelper.prevDropTarget = null;
            };
        }
    }
    DragAndDropHelper.mechOnDragHandler = null;
    DragAndDropHelper.mechOnDragOverHandler = null;
    DragAndDropHelper.mechOnDropHandler = null;
    class TouchHelper {
        static addTouchHandlers(mechPanelDiv) {
            $(mechPanelDiv)
                .on("touchstart", TouchHelper.touchStartHandler)
                .on("touchend", TouchHelper.touchEndHandler)
                .on("touchcancel", TouchHelper.touchCancelHandler)
                .on("touchmove", TouchHelper.touchMoveHandler);
            //NOTE: using these touch handlers that do nothing still causes the slowdown on chrome on android. 
            //Do a remote debug to see what's eating the cycles
            // mechPanelDiv.addEventListener("touchstart", TouchHelper.emptyHandler, false);
            // mechPanelDiv.addEventListener("touchend", TouchHelper.emptyHandler, false);
            // mechPanelDiv.addEventListener("touchcancel", TouchHelper.emptyHandler, false);
            // mechPanelDiv.addEventListener("touchmove", TouchHelper.emptyHandler, false);
        }
        static removeTouchHandlers(mechPanelDiv) {
            $(mechPanelDiv)
                .off("touchstart", TouchHelper.touchStartHandler)
                .off("touchend", TouchHelper.touchEndHandler)
                .off("touchcancel", TouchHelper.touchCancelHandler)
                .off("touchmove", TouchHelper.touchMoveHandler);
        }
        static emptyHandler(event) {
            return;
        }
        static touchStartHandler(event) {
            let thisJQ = $(this);
            if (thisJQ.attr("draggable") === "true") {
                let startMechId = TouchHelper.findMechId(this);
                Util.log(`Touch start mechId: ${startMechId}`);
                let mechName = MechModelView.getMechName(startMechId);
                TouchHelper.showTouchIcon(event.originalEvent, mechName);
                TouchHelper.isTouchDragging = true;
            }
            else {
                return;
            }
        }
        static touchEndHandler(event) {
            if (!TouchHelper.isTouchDragging) {
                return;
            }
            let touchEvent = event.originalEvent;
            let srcMechId = TouchHelper.findMechId(touchEvent.target);
            let dropMechId = TouchHelper.findMechId(TouchHelper.currDropTarget);
            Util.log(`Touch end srcMechId: ${srcMechId} dropMechId: ${dropMechId}`);
            if (srcMechId && dropMechId) {
                let mechPanel = MechPanel.getMechPanel(srcMechId);
                mechPanel.moveToTargetMechId(dropMechId);
            }
            else {
                Util.warn(Error(`Touch end null mechId: src: ${srcMechId} dest: ${dropMechId}`));
            }
            TouchHelper.hideTouchIcon(event.originalEvent);
            TouchHelper.isTouchDragging = false;
            TouchHelper.currDropTarget = null;
        }
        static touchCancelHandler(event) {
            if (!TouchHelper.isTouchDragging) {
                return;
            }
            TouchHelper.isTouchDragging = false;
            TouchHelper.currDropTarget = null;
        }
        static touchMoveHandler(event) {
            if (!TouchHelper.isTouchDragging) {
                return;
            }
            let touchEvent = event.originalEvent;
            touchEvent.preventDefault();
            TouchHelper.moveTouchIcon(touchEvent);
            let touch = touchEvent.touches[0];
            let touchTargetElem = document.elementFromPoint(touch.clientX, touch.clientY);
            let prevDropTargetMechId = TouchHelper.findMechId(TouchHelper.currDropTarget);
            let newDropTargetMechId = TouchHelper.findMechId(touchTargetElem);
            if (newDropTargetMechId !== prevDropTargetMechId) {
                let newDropTargetMechPanel = MechPanel.getMechPanel(newDropTargetMechId) ||
                    EndMechPanel.getEndMechPanel(newDropTargetMechId);
                if (newDropTargetMechPanel) {
                    newDropTargetMechPanel.highlightOnDragOver(prevDropTargetMechId);
                    TouchHelper.currDropTarget = touchTargetElem;
                }
            }
        }
        static findMechId(element) {
            let currElement = element;
            while (currElement
                && currElement.parentElement
                && (currElement.parentElement instanceof HTMLElement)) {
                let mechIdAttr = currElement.attributes.getNamedItem("data-mech-id");
                if (mechIdAttr) {
                    return mechIdAttr.value;
                }
                else {
                    currElement = currElement.parentElement;
                }
            }
            return null;
        }
        static showTouchIcon(event, mechName) {
            if (TouchHelper.touchIcon) {
                $(TouchHelper.touchIcon).remove();
            }
            //NOTE: attach touchIcon to body. 'fixed' position doesn't work well when hovering over the 
            //source mechpanel element (it acts as relative in that case)
            let bodyJQ = $("body");
            TouchHelper.touchIcon = Widgets.cloneTemplate("touchmove-icon-template");
            let touchIconJQ = $(TouchHelper.touchIcon)
                .appendTo(bodyJQ);
            touchIconJQ.find(".touchStartItem").text(mechName);
            TouchHelper.moveTouchIcon(event);
        }
        static moveTouchIcon(event) {
            let touch = event.touches[0];
            if (TouchHelper.touchIcon) {
                let left = Math.floor(touch.clientX).toString() + "px";
                let top = Math.floor(touch.clientY).toString() + "px";
                TouchHelper.touchIcon.style.left = left;
                TouchHelper.touchIcon.style.top = top;
            }
        }
        static hideTouchIcon(event) {
            TouchHelper.touchIcon.remove();
        }
    }
    TouchHelper.TouchIconId = "touchMoveIcon";
})(MechViewMechPanel || (MechViewMechPanel = {}));
var MechViewReport;
(function (MechViewReport) {
    var Team = MechModelCommon.Team;
    class VictoryReport {
        constructor() {
            let victoryReportDiv = Widgets.cloneTemplate("victoryReport-template");
            let reportJQ = $(victoryReportDiv).attr("id", "victoryReport");
            this.domElement = victoryReportDiv;
            reportJQ.find("[class~=closeReportButton]")
                .click(() => {
                MechViewReport.hideVictoryReport();
            });
            let victorTeam = MechModelView.getVictorTeam();
            if (victorTeam) {
                reportJQ.find("[class~=victorTitle]")
                    .addClass(victorTeam)
                    .text(`${TeamReport.prototype.translateTeamName(victorTeam)} Victory`);
            }
            else {
                reportJQ.find("[class~=victorTitle]").text("Draw");
            }
            let simParams = MechModelView.getSimulatorParameters();
            reportJQ.find("[class~=rangeValue]")
                .text(`${Number(simParams.range).toFixed(0)}m`);
            let teamList = [Team.BLUE, Team.RED];
            for (let team of teamList) {
                let teamReport = new TeamReport(team);
                reportJQ.find(`[class~=${this.teamReportPanelId(team)}]`)
                    .attr("id", this.teamReportPanelId(team))
                    .append(teamReport.domElement);
            }
        }
        teamReportPanelId(team) {
            return team + "ReportContainer";
        }
    }
    MechViewReport.VictoryReport = VictoryReport;
    class TeamReport {
        constructor(team) {
            let teamReport = MechModelView.getTeamReport(team);
            let teamReportDiv = Widgets.cloneTemplate("teamReport-template");
            let teamReportJQ = $(teamReportDiv)
                .attr("id", this.teamReportId(team))
                .addClass(team);
            this.domElement = teamReportDiv;
            let teamReportId = this.teamReportId(team);
            teamReportJQ.find("[class~=teamName]")
                .text(this.translateTeamName(team) + " team");
            let totalDamage = teamReport.getTotalDamage();
            let dps = teamReport.getDPS();
            let maxBurst = teamReport.getMaxBurst();
            teamReportJQ.find("[class~=damage]")
                .text(Number(totalDamage).toFixed(1));
            teamReportJQ.find("[class~=dps]")
                .text(Number(dps).toFixed(1));
            teamReportJQ.find("[class~=maxBurst]")
                .text(Number(maxBurst).toFixed(1));
            let mechBreakdown = new MechBreakdownTable(teamReport);
            let mechBreakdownDivId = this.mechBreakdownId(team);
            teamReportJQ.find("[class~=mechBreakdownContainer]")
                .attr("id", mechBreakdownDivId)
                .append(mechBreakdown.domElement);
            let weaponBreakdown = new WeaponBreakdownTable(teamReport);
            let weaponBreakdownDivId = this.weaponBreakdownId(team);
            let weaponBreakdownJQ = teamReportJQ.find("[class~=weaponBreakdownContainer]")
                .attr("id", weaponBreakdownDivId)
                .append(weaponBreakdown.domElement);
        }
        teamReportId(team) {
            return team + "-teamReport";
        }
        mechBreakdownId(team) {
            return team + "-mechBreakdown";
        }
        weaponBreakdownId(team) {
            return team + "-weaponBreakdown";
        }
        translateTeamName(team) {
            if (team === "blue") {
                return "Blue";
            }
            else if (team === "red") {
                return "Red";
            }
            else {
                throw Error("Unexpected team: " + team);
            }
        }
    }
    MechViewReport.TeamReport = TeamReport;
    class MechBreakdownTable {
        constructor(teamReport) {
            let tableDiv = Widgets.cloneTemplate("mechBreakdownTable-template");
            this.domElement = tableDiv;
            //header
            let mechBreakdownHeaderDiv = Widgets.cloneTemplate("mechBreakdownHeader-template");
            $(mechBreakdownHeaderDiv)
                .removeAttr("id")
                .appendTo(tableDiv);
            for (let mechReport of teamReport.mechReports) {
                let mechBreakdownRowDiv = Widgets.cloneTemplate("mechBreakdownRow-template");
                let rowJQ = $(mechBreakdownRowDiv)
                    .removeAttr("id")
                    .appendTo(tableDiv);
                rowJQ.find("[class~=name]")
                    .text(mechReport.mechName);
                rowJQ.find("[class~=damage]")
                    .text(Number(mechReport.getTotalDamage()).toFixed(1));
                rowJQ.find("[class~=dps]")
                    .text(Number(mechReport.getDPS()).toFixed(1));
                rowJQ.find("[class~=burst]")
                    .text(Number(mechReport.getMaxBurstDamage()).toFixed(1));
                let timeAlive = mechReport.getTimeOfDeath();
                timeAlive = timeAlive ? timeAlive : MechSimulatorLogic.getSimTime();
                rowJQ.find("[class~=timeAlive]")
                    .text(`${Number(timeAlive / 1000).toFixed(1)}s`);
            }
        }
    }
    class WeaponBreakdownTable {
        constructor(teamReport) {
            let tableDiv = Widgets.cloneTemplate("weaponBreakdownTable-template");
            this.domElement = tableDiv;
            let weaponBreakdownHeaderDiv = Widgets.cloneTemplate("weaponBreakdownHeader-template");
            $(weaponBreakdownHeaderDiv)
                .removeAttr("id")
                .appendTo(tableDiv);
            let teamWeaponStats = teamReport.getWeaponStats();
            for (let weaponStatEntry of teamWeaponStats) {
                let weaponBreakdownRowDiv = Widgets.cloneTemplate("weaponBreakdownRow-template");
                let rowJQ = $(weaponBreakdownRowDiv)
                    .removeAttr("id")
                    .appendTo(tableDiv);
                rowJQ.find("[class~=name]").text(weaponStatEntry.name);
                rowJQ.find("[class~=damage]").text(Number(weaponStatEntry.damage).toFixed(1));
                //TODO: Fix DPS per weapon calculation
                // rowJQ.find("[class~=dps]").text(Number(weaponStatEntry.dps).toFixed(1));
                rowJQ.find("[class~=count]").text(Number(weaponStatEntry.count).toFixed(0));
            }
        }
    }
    MechViewReport.showVictoryReport = function () {
        let teamReport = new MechViewReport.VictoryReport();
        Widgets.setModal(teamReport.domElement, "wide");
        Widgets.showModal();
    };
    MechViewReport.hideVictoryReport = function () {
        Widgets.hideModal("wide");
    };
})(MechViewReport || (MechViewReport = {}));
//Router. Deals with interactions of the application state and the url hash fragment
//Uses the ./php/simulator-persistence.php for storing application state to server
var MechViewRouter;
//Router. Deals with interactions of the application state and the url hash fragment
//Uses the ./php/simulator-persistence.php for storing application state to server
(function (MechViewRouter) {
    var Team = MechModelCommon.Team;
    var SimulatorParameters = SimulatorSettings.SimulatorParameters;
    var EventType = MechModelCommon.EventType;
    const PERSISTENCE_URL = "./php/simulator-persistence.php";
    const PERSISTENCE_STATE_FIELD = "state";
    const HASH_STATE_FIELD = "s";
    const HASH_RUN_FIELD = "autorun";
    const HASH_SPEED_FIELD = "speed";
    const HASH_FIELDS = [HASH_STATE_FIELD, HASH_RUN_FIELD, HASH_SPEED_FIELD];
    const HASH_MODIFIED_STATE = "MODIFIED";
    const HASH_DEFAULT_STATE = "default";
    var isAppStateModified = true;
    var prevStateHash = "";
    var isLoading = false;
    class AppState {
        //if no parameters, from current app state
        //else read the contents of loadedAppState into the object
        constructor(loadedAppState) {
            if (arguments.length === 1) {
                this.range = loadedAppState.state.range;
                this.teams = loadedAppState.state.teams;
            }
            else if (arguments.length === 0) {
                //current app state
                this.range = SimulatorSettings.getSimulatorParameters().range;
                this.teams = {};
                let teamList = [Team.BLUE, Team.RED];
                for (let team of teamList) {
                    this.teams[team] = [];
                    let mechTeam = MechModel.getMechTeam(team);
                    for (let mechIdx in mechTeam) {
                        if (!mechTeam.hasOwnProperty(mechIdx)) {
                            continue;
                        }
                        let mech = MechModel.getMechTeam(team)[mechIdx];
                        let mechInfo = mech.getMechState().mechInfo;
                        let smurfyId = mechInfo.smurfyMechId;
                        let smurfyLoadoutId = mechInfo.smurfyLoadoutId;
                        let teamEntry = {
                            "smurfyId": smurfyId,
                            "smurfyLoadoutId": smurfyLoadoutId,
                        };
                        if (mechInfo.skillState) {
                            teamEntry.skills = mechInfo.skillState;
                        }
                        this.teams[team].push(teamEntry);
                    }
                }
            }
        }
        //returns a serialized version of the object. Can't just pass the object itself
        //because we may need to add methods to it, and that will show up if we pass
        //the appstate directly to ajax
        //Format of the result is
        //{state:
        //  { range: <range>,
        //    teams: {"blue" :[{"smurfyId" :<blueid1>, "smurfyLoadoutId": <blue1id>}...]}
        //            , "red" : [<redteamentries>]}}}
        serialize() {
            let ret = { range: null, teams: {} };
            ret.range = this.range;
            ret.teams = {};
            let teamList = [Team.BLUE, Team.RED];
            for (let team of teamList) {
                ret.teams[team] = [];
                for (let teamEntry of this.teams[team]) {
                    let newTeamEntry = {
                        "smurfyId": teamEntry.smurfyId,
                        "smurfyLoadoutId": teamEntry.smurfyLoadoutId
                    };
                    if (teamEntry.skills) {
                        newTeamEntry.skills = teamEntry.skills;
                    }
                    ret.teams[team].push(newTeamEntry);
                }
            }
            return { "state": ret };
        }
    }
    //saves the current application state to the server for sharing
    MechViewRouter.saveAppState = function () {
        let ret = new Promise(function (resolve, reject) {
            let appState = new AppState();
            $.ajax({
                url: PERSISTENCE_URL,
                type: 'POST',
                dataType: 'JSON',
                data: appState.serialize(),
            })
                .done(function (data) {
                isAppStateModified = false;
                prevStateHash = data.statehash;
                setParamToLocationHash(HASH_STATE_FIELD, data.statehash, true);
                MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_SAVED });
                resolve(data);
            })
                .fail(function (data) {
                reject(Error(String(data)));
            });
        });
        return ret;
    };
    MechViewRouter.loadAppState = function (stateHash) {
        //load state from hash
        let loadStatePromise = new Promise(function (resolve, reject) {
            MechModel.clearModel();
            MechSimulatorLogic.resetSimulation();
            isLoading = true;
            //ajax get request to simulator-persistence
            $.ajax({
                url: PERSISTENCE_URL + "?" + HASH_STATE_FIELD + "=" + stateHash,
                type: 'GET',
                dataType: 'JSON'
            })
                .done(function (data) {
                resolve(data);
            })
                .fail(function (data) {
                reject(Error(String(data)));
            });
        });
        //load mechs from the state
        let loadStateThenMechsPromise = loadStatePromise
            .then(function (stateData) {
            let newAppState = new AppState(stateData);
            //set current app state
            let simulatorParameters = SimulatorSettings.getSimulatorParameters();
            if (!simulatorParameters) {
                simulatorParameters =
                    new SimulatorParameters(newAppState.range);
            }
            simulatorParameters.range = newAppState.range;
            MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
            let loadMechPromise = loadMechsFromSmurfy(newAppState);
            return loadMechPromise.then(function (mechLoadoutData) {
                isAppStateModified = false;
                MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_LOADED });
                return mechLoadoutData;
            });
        });
        return loadStateThenMechsPromise
            .then(function (data) {
            isLoading = false;
            prevStateHash = stateHash;
            return data;
        })
            .catch(function (err) {
            isLoading = false;
            prevStateHash = stateHash;
            throw err;
        });
    };
    //Loads the smurfy mechs from the appState into the model.
    var loadMechsFromSmurfy = function (newAppState) {
        let teamList = [Team.BLUE, Team.RED];
        let totalMechsToLoad; //total number of mechs to load
        let currMechsLoaded; //current number of mechs loaded
        if (!newAppState.teams) {
            //if no teams, immediately resolve
            isLoading = false;
            return Promise.resolve({});
        }
        for (let team of teamList) {
            if (!newAppState.teams[team]) {
                newAppState.teams[team] = [];
            }
        }
        let createCombinedListEntry = function (team, index, mechEntry) {
            return {
                "team": team,
                "index": index,
                "mechEntry": mechEntry,
            };
        };
        let combinedTeamList = [];
        for (let team of teamList) {
            let newStateTeams = newAppState.teams[team];
            for (let mechIdx in newStateTeams) {
                if (!newStateTeams.hasOwnProperty(mechIdx)) {
                    continue;
                }
                let mechEntry = newAppState.teams[team][mechIdx];
                combinedTeamList.push(createCombinedListEntry(team, Number(mechIdx), mechEntry));
            }
        }
        totalMechsToLoad = combinedTeamList.length;
        currMechsLoaded = 0;
        let promiseToEntryMap = new Map();
        let combinedTeamPromiseList = combinedTeamList.map(function (combinedTeamEntry) {
            let mechEntry = combinedTeamEntry.mechEntry;
            let mechAndSkillPromises = [];
            let loadMechPromise = MechModel.loadSmurfyMechLoadoutFromID(mechEntry.smurfyId, mechEntry.smurfyLoadoutId);
            mechAndSkillPromises.push(loadMechPromise);
            if (mechEntry.skills) {
                let skillLoader = MechModelSkills.getSkillLoader(mechEntry.skills.type);
                let loadSkillsPromise = skillLoader.loadSkillsFromState(mechEntry.skills.state);
                mechAndSkillPromises.push(loadSkillsPromise);
            }
            let combinedPromise = Promise.all(mechAndSkillPromises);
            promiseToEntryMap.set(combinedPromise, combinedTeamEntry);
            return combinedPromise;
        });
        let retPromise = combinedTeamPromiseList.reduce(function (prevPromise, currPromise) {
            return prevPromise.then(function () {
                return currPromise.then(function (data) {
                    //immediate action on loading a mech
                    let smurfyLoadout = data[0];
                    let combinedTeamEntry = promiseToEntryMap.get(currPromise);
                    let team = combinedTeamEntry.team;
                    let mechIdx = combinedTeamEntry.index;
                    let mechId = MechModel.generateMechId(smurfyLoadout);
                    let newMech = MechModel.addMechAtIndex(mechId, team, smurfyLoadout, mechIdx);
                    if (combinedTeamEntry.mechEntry.skills) {
                        let skillData = data[1];
                        let skillState = combinedTeamEntry.mechEntry.skills;
                        newMech.setSkillState(skillState);
                        let skillLoader = MechModelSkills.getSkillLoader(skillState.type);
                        let skillQuirks = skillLoader.convertDataToMechQuirks(skillData, mechId);
                        newMech.applySkillQuirks(skillQuirks);
                    }
                    currMechsLoaded++;
                    MechView.updateLoadingScreenProgress(currMechsLoaded / totalMechsToLoad);
                    return data;
                });
            });
        }, Promise.resolve([]));
        return retPromise;
    };
    //listener to APP_STATE_CHANGE event
    var modifyAppState = function (event) {
        isAppStateModified = true;
        prevStateHash = HASH_MODIFIED_STATE;
        setParamToLocationHash(HASH_STATE_FIELD, HASH_MODIFIED_STATE);
    };
    var setParamToLocationHash = function (param, value, replaceHistory = false) {
        let paramValues = new Map();
        for (let currParam of HASH_FIELDS) {
            let currValue = Util.getParamFromLocationHash(currParam);
            if (!currValue && param !== currParam) {
                continue;
            }
            if (param === currParam) {
                paramValues.set(currParam, value);
            }
            else {
                paramValues.set(currParam, currValue);
            }
        }
        let first = true;
        let newHashString = "";
        for (let currParam of paramValues.keys()) {
            if (!first) {
                newHashString += "&";
            }
            else {
                first = false;
            }
            newHashString += `${currParam}=${paramValues.get(currParam)}`;
        }
        if (!replaceHistory) {
            location.hash = newHashString;
        }
        else {
            window.history.replaceState(null, "", "#" + newHashString);
        }
    };
    MechViewRouter.getRunFromLocation = function () {
        return Util.getParamFromLocationHash(HASH_RUN_FIELD);
    };
    MechViewRouter.getSpeedFromLocation = function () {
        return Util.getParamFromLocationHash(HASH_SPEED_FIELD);
    };
    var getStateHashFromLocation = function () {
        return Util.getParamFromLocationHash(HASH_STATE_FIELD);
    };
    MechViewRouter.loadStateFromLocationHash = function () {
        let hashState = getStateHashFromLocation();
        if (!hashState) {
            hashState = HASH_DEFAULT_STATE;
            prevStateHash = hashState; //to avoid triggering the hash change handler
            setParamToLocationHash(HASH_STATE_FIELD, HASH_DEFAULT_STATE);
        }
        return MechViewRouter.loadAppState(hashState);
    };
    MechViewRouter.initViewRouter = function () {
        //Listen to hash changes
        window.addEventListener("hashchange", hashChangeListener, false);
        //Event queue listener
        MechModelView.getEventQueue().addListener(modifyAppState, EventType.APP_STATE_CHANGE);
    };
    var hashChangeListener = function () {
        Util.log("Hash change: " + location.hash);
        if (isLoading) {
            //ignore hash change, change back to previous hash
            let hash = `#${HASH_STATE_FIELD}=${prevStateHash}`;
            setParamToLocationHash(HASH_STATE_FIELD, prevStateHash, true);
            return;
        }
        let newHash = getStateHashFromLocation();
        if (newHash !== prevStateHash) {
            //if hash is different from previous hash, load new state
            MechView.showLoadingScreen();
            Util.log("Hash change loading new state from hash : " + newHash);
            MechViewRouter.loadAppState(newHash)
                .then(function () {
                //success
                MechModelView.refreshView();
                Util.log("Hash change state load success: " + newHash);
            })
                .catch(function () {
                //fail
                MechModelView.refreshView();
                MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_LOAD_ERROR });
                Util.log("Hash change state load failed: " + newHash);
            })
                .then(function () {
                //always
                MechView.hideLoadingScreen();
                Util.log("Hash state change load done: " + newHash);
            });
        }
        else {
            //do nothing if hash did not change
            //TODO: see if this should check if the app is in error and load in data
            //if it is.
        }
    };
})(MechViewRouter || (MechViewRouter = {}));
var MechViewSimSettings;
(function (MechViewSimSettings) {
    var SimulatorParameters = SimulatorSettings.SimulatorParameters;
    var EventType = MechModelCommon.EventType;
    MechViewSimSettings.initRangeInput = function () {
        let rangeJQ = $("#rangeInput");
        let rangeButtonElem = document.getElementById("setRangeButton");
        let rangeButton = new Widgets.Button(rangeButtonElem, function () {
            let buttonMode = $(this).attr("data-button-mode");
            if (buttonMode === "not-editing") {
                rangeJQ
                    .removeClass("disabled")
                    .removeAttr("disabled")
                    .focus();
                $(this)
                    .attr("data-button-mode", "editing")
                    .html("Set Range");
            }
            else if (buttonMode === "editing") {
                MechViewSimSettings.setRangeValue();
            }
            else {
                throw Error("Invalid button state");
            }
        });
        rangeJQ.on("keydown", (event) => {
            if (event.key.toLocaleUpperCase() === "ENTER") {
                MechViewSimSettings.setRangeValue();
            }
        });
    };
    MechViewSimSettings.setRangeValue = function () {
        let rangeJQ = $("#rangeInput");
        rangeJQ.addClass("disabled").attr("disabled", "true");
        let range = Number($("#rangeInput").val());
        //set the range using the converted number value so user is sure it was parsed properly
        rangeJQ.val(range);
        let simulatorParameters = MechModelView.getSimulatorParameters();
        simulatorParameters.range = range;
        //not strictly necessary, but it makes it explicit that we're changing
        //the simulator parameters. Handy when searching for code that changes
        //app state
        MechModelView.setSimulatorParameters(simulatorParameters);
        $("#setRangeButton")
            .attr("data-button-mode", "not-editing")
            .html("Change");
        MechModelView.getEventQueue().queueEvent({ type: EventType.APP_STATE_CHANGE });
    };
    MechViewSimSettings.updateSimSettingsView = function (simulatorParameters) {
        if (simulatorParameters) {
            let range = simulatorParameters.range;
            $("#rangeInput").val(range);
        }
    };
    class SettingsDialog {
        constructor(simSettings) {
            this.simSettings = simSettings;
            let settingsDiv = Widgets.cloneTemplate("simSettings-template");
            this.domElement = settingsDiv;
            this.propertyMap = new Map();
            this.populateSettings(simSettings);
            let settingsJQ = $(settingsDiv);
            settingsJQ.find(".applyButton").click(() => {
                //set simulation parameters from values selected in the dialog
                MechSimulatorLogic.setSimulatorParameters(simSettings);
                MechViewSimSettings.hideSettingsDialog();
            });
            settingsJQ.find(".cancelButton").click(() => {
                MechViewSimSettings.hideSettingsDialog();
            });
        }
        settingEntryId(settingProperty) {
            return settingProperty + "-value";
        }
        getSettingValue(property, valueId) {
            return this.propertyMap.get(property).get(valueId);
        }
        setSettingValue(property, valueId, value) {
            this.propertyMap.get(property).set(valueId, value);
        }
        populateSettings(simSettings) {
            let settingsList = SimulatorParameters.getUserSettings();
            let entryListJQ = $(this.domElement).find(".simSettingsList");
            for (let entry of settingsList) {
                let entryDiv = Widgets.cloneTemplate("simSettingsEntry-template");
                let entryJQ = $(entryDiv)
                    .attr("id", this.settingEntryId(entry.property))
                    .attr("data-property", entry.property);
                entryJQ.find(".label").text(entry.name);
                let entrySelectJQ = entryJQ.find(".value");
                entrySelectJQ.empty();
                this.propertyMap.set(entry.property, new Map());
                entryListJQ.append(entryJQ);
                for (let value of entry.values) {
                    let valueJQ = $("<option></option>")
                        .attr("value", value.id)
                        .attr("data-value", value.value)
                        .attr("data-description", value.description)
                        .text(value.name)
                        .appendTo(entrySelectJQ);
                    this.setSettingValue(entry.property, value.id, value);
                    //set selected value from simSettings
                    if (value.value === simSettings[entry.property]) {
                        entrySelectJQ.val(value.id);
                        entryJQ.find(".description").text(value.description);
                    }
                }
                entryJQ.on('change', (data) => {
                    let selectedValue = String(entrySelectJQ.val());
                    let settingValue = this.getSettingValue(entry.property, selectedValue);
                    let currSetting = this.simSettings;
                    currSetting[entry.property] = settingValue.value;
                    entryJQ.find(".description").text(settingValue.description);
                });
            }
        }
    }
    MechViewSimSettings.showSettingsDialog = function () {
        let simulatorParameters = SimulatorSettings.getSimulatorParameters();
        let dialog = new SettingsDialog(simulatorParameters);
        Widgets.setModal(dialog.domElement, "simSettingsDialog");
        Widgets.showModal();
    };
    MechViewSimSettings.hideSettingsDialog = function () {
        Widgets.hideModal("simSettingsDialog");
    };
})(MechViewSimSettings || (MechViewSimSettings = {}));
var MechViewTeamStats;
(function (MechViewTeamStats) {
    var damageColor = MechViewDamageColor.damageColor;
    var teamStatsContainerId = function (team) {
        return team + "-teamStatsContainer";
    };
    var teamStatsId = function (team) {
        return team + "-teamStatsPanel";
    };
    var teamDisplayName = function (team) {
        let displayNameMap = { "blue": "Blue team", "red": "Red team" };
        return displayNameMap[team];
    };
    var teamMechPipsContainerId = function (team) {
        return team + "-mechPipsContainer";
    };
    var teamMechPipId = function (mechId) {
        return mechId + "-mechPip";
    };
    var teamLiveMechsId = function (team) {
        return team + "-liveMechs";
    };
    var teamHealthValueId = function (team) {
        return team + "-teamHealthValue";
    };
    var teamDamageId = function (team) {
        return team + "-teamDamage";
    };
    var teamDPSValueId = function (team) {
        return team + "-teamDPSValue";
    };
    var teamBurstDamageId = function (team) {
        return team + "-teamBurstDamage";
    };
    var teamSettingsButtonId = function (team) {
        return team + "-teamSettingsButton";
    };
    var teamSettingsId = function (team) {
        return team + "-teamSettings";
    };
    MechViewTeamStats.addTeamStatsPanel = function (team, mechIds) {
        let teamStatsContainerPanelId = teamStatsContainerId(team);
        let teamStatsDiv = Widgets.cloneTemplate("teamStats-template");
        $(teamStatsDiv)
            .attr("id", teamStatsId(team))
            .attr("data-team", team)
            .addClass(team)
            .appendTo("#" + teamStatsContainerPanelId);
        //Change team name
        let teamStatsContainerJQ = $(`#${teamStatsContainerPanelId}`);
        teamStatsContainerJQ.find("[class~=teamName]")
            .text(teamDisplayName(team));
        //Add mech button
        let addMechButton = new MechViewAddMech.AddMechButton(team, teamStatsContainerJQ.get(0));
        //mech pips
        let teamMechPipsContainerDivId = teamMechPipsContainerId(team);
        let teamMechPipsJQ = teamStatsContainerJQ.find("[class~=mechPipsContainer]")
            .attr("id", teamMechPipsContainerDivId);
        for (let mechId of mechIds) {
            let mechName = MechModelView.getMechName(mechId);
            mechName = mechName ? mechName : "";
            let mechPipSpan = Widgets.cloneTemplate("mechPip-template");
            $(mechPipSpan)
                .attr("id", teamMechPipId(mechId))
                .attr("data-team", team)
                .attr("data-mech-id", mechId)
                .attr("title", mechName)
                .click(mechPipClickHandler)
                .appendTo(teamMechPipsJQ);
        }
        //Mech health (liveMechs and teamHealthValue)
        teamStatsContainerJQ.find("[class~=liveMechs]")
            .attr("id", teamLiveMechsId(team));
        teamStatsContainerJQ.find("[class~=teamHealthValue]")
            .attr("id", teamHealthValueId(team));
        //teamDMG
        teamStatsContainerJQ.find("[class~=teamDamageValue]")
            .attr("id", teamDamageId(team));
        //teamDPS
        teamStatsContainerJQ.find("[class~=teamDPSValue]")
            .attr("id", teamDPSValueId(team));
        //teamBurstDamage
        teamStatsContainerJQ.find("[class~=teamBurstDamageValue]")
            .attr("id", teamBurstDamageId(team));
        //team settings
        let teamSettingsButtonJQ = teamStatsContainerJQ.find("[class~=teamSettingsButton]")
            .attr("data-team", team)
            .attr("id", teamSettingsButtonId(team));
        let teamSettingsJQ = teamStatsContainerJQ.find("[class~=teamSettings]")
            .attr("data-team", team)
            .attr("id", teamSettingsId(team));
        let teamSettingsArrowJQ = teamStatsContainerJQ.find("[class~=teamSettingsButtonArrow]");
        let settingsExpandButton = new Widgets.ExpandButton(teamSettingsButtonJQ.get(0), undefined, //No click handler, we only use the expand/contract functionality of the button
        teamSettingsArrowJQ.get(0), teamSettingsJQ.get(0));
        //Populate the team settings panel
        for (let patternType of patternTypes) {
            populateTeamPattern(team, patternType);
        }
    };
    var mechPipClickHandler = function (data) {
        let thisJQ = $(this);
        let mechId = thisJQ.attr("data-mech-id");
        let mechPanel = MechView.getMechPanel(mechId);
        mechPanel.highlightMechPanel(mechId);
    };
    var patternTypes;
    //values used to initialize the contents of the team settings panel.
    MechViewTeamStats.initPatternTypes = function () {
        patternTypes = [
            {
                id: "teamTargetMechComponent",
                //function that returns the patternList for the type
                patternsFunction: MechTargetComponent.getPatterns,
                //prefix of the css class name for the UI divs for the patterntype
                classNamePrefix: "teamTargetMechComponent",
                //function used to assign the pattern to MechModel.Mech objects
                setTeamPatternFunction: MechModelView.setTeamComponentTargetPattern,
            },
            {
                id: "teamFirePattern",
                patternsFunction: MechFirePattern.getPatterns,
                classNamePrefix: "teamFirePattern",
                setTeamPatternFunction: MechModelView.setTeamFirePattern,
            },
            {
                id: "teamTargetMechPattern",
                patternsFunction: MechTargetMech.getPatterns,
                classNamePrefix: "teamTargetMechPattern",
                setTeamPatternFunction: MechModelView.setTeamMechTargetPattern,
            },
            {
                id: "teamAccuracy",
                patternsFunction: MechAccuracyPattern.getPatterns,
                classNamePrefix: "teamAccuracy",
                setTeamPatternFunction: MechModelView.setTeamAccuracyPattern,
            },
        ];
    };
    //format is {<team>: {<patternTypeId>: <patternId>, ...}}
    var selectedPatterns = {};
    //format is {<patternTypeId>: [patternList]}
    var patternLists = {};
    var findPatternWithId = function (patternId, patternList) {
        for (let entry of patternList) {
            if (entry.id === patternId) {
                return entry.pattern;
            }
        }
        return null;
    };
    var findPatternTypeWithId = function (patternTypeId) {
        for (let patternType of patternTypes) {
            if (patternType.id === patternTypeId) {
                return patternType;
            }
        }
        return null;
    };
    var populateTeamPattern = function (team, patternType) {
        if (!patternLists[patternType.id]) {
            patternLists[patternType.id] = patternType.patternsFunction();
        }
        let teamStatsContainerJQ = $(`#${teamStatsContainerId(team)}`);
        let teamPatternValueJQ = teamStatsContainerJQ.find(`[class~=${patternType.classNamePrefix}Value]`);
        let teamPatternDescJQ = teamStatsContainerJQ.find(`[class~=${patternType.classNamePrefix}Desc]`);
        teamPatternValueJQ.empty();
        selectedPatterns[team] = selectedPatterns[team] ? selectedPatterns[team] : {};
        let selectedPattern = selectedPatterns[team][patternType.id];
        for (let patternEntry of patternLists[patternType.id]) {
            $("<option></option>")
                .attr("value", patternEntry.id)
                .attr("data-description", patternEntry.description)
                .html(patternEntry.name)
                .appendTo(teamPatternValueJQ);
            //if it is the currently selected pattern
            if (selectedPatterns[team][patternType.id] === patternEntry.id) {
                teamPatternValueJQ.val(patternEntry.id);
                teamPatternDescJQ.html(patternEntry.description);
            }
            //if default and no selected pattern, set it as the selected pattern
            if (patternEntry.default && !selectedPattern) {
                teamPatternValueJQ.val(patternEntry.id);
                teamPatternDescJQ.html(patternEntry.description);
                selectedPatterns[team][patternType.id] = patternEntry.id;
            }
        }
        //change handler
        teamPatternValueJQ.on('change', (data) => {
            let selectedValue = String(teamPatternValueJQ.val());
            let selectedOption = teamPatternValueJQ.find(`[value='${selectedValue}']`);
            teamPatternDescJQ.html(selectedOption.attr("data-description"));
            selectedPatterns[team][patternType.id] = selectedValue;
            let pattern = findPatternWithId(selectedValue, patternLists[patternType.id]);
            patternType.setTeamPatternFunction(team, pattern);
        });
    };
    //assigns the selected patterns for the given team
    MechViewTeamStats.setSelectedTeamPatterns = function (team) {
        let currSelectedPatterns = selectedPatterns[team];
        for (let patternTypeId in currSelectedPatterns) {
            if (!currSelectedPatterns.hasOwnProperty(patternTypeId)) {
                continue;
            }
            let patternType = findPatternTypeWithId(patternTypeId);
            let patternId = currSelectedPatterns[patternTypeId];
            let pattern = findPatternWithId(patternId, patternLists[patternType.id]);
            patternType.setTeamPatternFunction(team, pattern);
        }
    };
    MechViewTeamStats.updateTeamStats = function (update) {
        let totalTeamCurrHealth = 0;
        let totalTeamMaxHealth = 0;
        let liveMechs = 0;
        let team = update.team;
        for (let mechHealth of update.mechHealthList) {
            let mechId = mechHealth.mechId;
            let currHealth = mechHealth.currHealth;
            let maxHealth = mechHealth.maxHealth;
            let isAlive = mechHealth.isAlive;
            let mechPipDiv = document.getElementById(teamMechPipId(mechId));
            let percentHealth = Number(currHealth) / Number(maxHealth);
            let pipColor = damageColor(percentHealth, MechViewDamageColor.HealthDamageGradient);
            mechPipDiv.style.color = pipColor;
            if (isAlive) {
                mechPipDiv.textContent = "\u25A0"; //solid box
            }
            else {
                mechPipDiv.textContent = "\u25A1"; //hollow box
            }
            liveMechs += isAlive ? 1 : 0;
            totalTeamCurrHealth += isAlive ? currHealth : 0;
            totalTeamMaxHealth += maxHealth;
        }
        //live mechs
        let liveMechsDiv = document.getElementById(teamLiveMechsId(team));
        let totalMechs = update.mechHealthList.length;
        let percentAlive = totalMechs > 0 ? liveMechs / totalMechs : 0;
        let color = damageColor(percentAlive, MechViewDamageColor.HealthDamageGradient);
        liveMechsDiv.style.color = color;
        liveMechsDiv.textContent = liveMechs + "/" + totalMechs;
        //team health
        let healthValueDiv = document.getElementById(teamHealthValueId(team));
        let teamHealthPercent = totalTeamMaxHealth > 0 ?
            totalTeamCurrHealth / totalTeamMaxHealth : 0;
        color = damageColor(teamHealthPercent, MechViewDamageColor.HealthDamageGradient);
        healthValueDiv.style.color = color;
        healthValueDiv.textContent =
            `(${Number(teamHealthPercent * 100).toFixed(1)}%)`;
        //damage
        let teamDamageDiv = document.getElementById(teamDamageId(team));
        teamDamageDiv.textContent = Number(update.damage).toFixed(1);
        //dps
        let teamDPSValueDiv = document.getElementById(teamDPSValueId(team));
        teamDPSValueDiv.textContent = Number(update.dps).toFixed(1);
        //burst
        let teamBurstDamageDiv = document.getElementById(teamBurstDamageId(team));
        teamBurstDamageDiv.textContent = Number(update.burstDamage).toFixed(1);
    };
    MechViewTeamStats.clearTeamStats = function (team) {
        let teamStatsContainerPanelId = teamStatsContainerId(team);
        $("#" + teamStatsContainerPanelId).empty();
    };
})(MechViewTeamStats || (MechViewTeamStats = {}));
//UI methods
var MechView;
//UI methods
(function (MechView) {
    var Component = MechModelCommon.Component;
    var MechPanel = MechViewMechPanel.MechPanel;
    var EventType = MechModelCommon.EventType;
    var teamListPanel = function (team) {
        return team + "Team";
    };
    MechView.addMechPanel = function (mech, team) {
        let mechPanel = new MechPanel(mech, team);
        //TODO: The appends happen inside mechpanel (due to WeaponPanel updates needing document.geElementbyId)
        //Try to find a way around this
    };
    MechView.getMechPanel = function (mechId) {
        return MechPanel.getMechPanel(mechId);
    };
    MechView.clearMechList = function (team) {
        let teamMechPanelId = teamListPanel(team);
        let mechTeamListJQ = $("#" + teamMechPanelId).empty();
        let endMechPanel = new MechViewMechPanel.EndMechPanel(team);
        mechTeamListJQ.append(endMechPanel.domElement);
    };
    MechView.clearMechStats = function (team) {
        MechViewTeamStats.clearTeamStats(team);
    };
    MechView.clear = function (team) {
        MechView.clearMechList(team);
        MechView.clearMechStats(team);
    };
    MechView.clearAll = function () {
        MechView.clear("blue");
        MechView.clear("red");
    };
    MechView.updateSimTime = function (simTime) {
        $("#simTime").html(simTime + "ms");
    };
    MechView.setDebugText = function (debugText) {
        $("#debugText").html(debugText);
    };
    MechView.init = function () {
        $("#nojavascript").remove();
        initControlPanel();
        MechViewTeamStats.initPatternTypes();
        MechViewSimSettings.initRangeInput();
        initSpeedControl();
        initStateControl();
        initMiscControl();
        MechViewMechPanel.init();
        MechViewAddMech.init();
        MechModelView.init();
        //Event listeners
        let eventQueue = MechModelView.getEventQueue();
        eventQueue.addListener(updateOnModifyAppState, EventType.APP_STATE_CHANGE);
        eventQueue.addListener(updateOnAppSaveState, EventType.APP_STATE_SAVED);
        eventQueue.addListener(updateOnLoadAppState, EventType.APP_STATE_LOADED);
        eventQueue.addListener(updateOnLoadAppError, EventType.APP_STATE_LOAD_ERROR);
    };
    var initControlPanel = function () {
        let controlPanelDiv = Widgets.cloneTemplate("controlPanel-template");
        $(controlPanelDiv)
            .appendTo("#controlPanelContainer");
    };
    var setSimulatorSpeedfactor = function (speedFactor) {
        let simulatorParams = SimulatorSettings.getSimulatorParameters();
        simulatorParams.setSpeedFactor(speedFactor);
        MechSimulatorLogic.setSimulatorParameters(simulatorParams);
        $("#simSpeed").html(speedFactor + "x");
    };
    var initSpeedControl = function () {
        $("#startSimulationDivButton").click(() => {
            if (MechModelView.getVictorTeam()) {
                //if a team already won, reset the sim
                MechView.resetSimulation();
            }
            MechSimulatorLogic.runSimulation();
        });
        $("#pauseSimulationDivButton").click(() => {
            MechSimulatorLogic.pauseSimulation();
        });
        $("#stepSimulationDivButton").click(() => {
            MechSimulatorLogic.stepSimulation();
        });
        $("#speed1xbutton").click(() => {
            setSimulatorSpeedfactor(1);
        });
        $("#speed2xbutton").click(() => {
            setSimulatorSpeedfactor(2);
        });
        $("#speed4xbutton").click(() => {
            setSimulatorSpeedfactor(4);
        });
        $("#speed8xbutton").click(() => {
            setSimulatorSpeedfactor(8);
        });
    };
    MechView.resetSimulation = function () {
        MechModelView.resetModel();
        MechSimulatorLogic.resetSimulation();
        MechModelView.refreshView([]);
    };
    var initStateControl = function () {
        $("#resetSimulationDivButton").click(() => {
            MechView.resetSimulation();
        });
        $("#showReportDivButton").click(() => {
            MechSimulatorLogic.pauseSimulation();
            MechViewReport.showVictoryReport();
        });
    };
    const ModifiedTooltipId = "modifiedTooltip";
    const PermalinkTooltipId = "permalinkGeneratedTooltip";
    const LoadErrorTooltipId = "loadErrorTooltip";
    const StatusTooltipIdList = [ModifiedTooltipId, PermalinkTooltipId, LoadErrorTooltipId];
    var initMiscControl = function () {
        let permalinkButtonJQ = $("#permalinkButton").click(() => {
            let saveAppStatePromise = MechViewRouter.saveAppState();
            saveAppStatePromise
                .then(function (data) {
                showPermalinkTooltip(location.href);
                Util.log("Success on save app state. Data: " + data);
                return data;
            })
                .catch(function (data) {
                Util.error("Fail on save app state." + Error(data));
                return Error(data);
            })
                .then(function (data) {
                Util.log("Done save app state. Data: " + data);
            });
        });
        //NOTE: We don't actually use the tooltip variable, it's just there to make tslint 
        //shut up about unused expressions. The tooltips themselves are stored in the DOM
        let tooltip;
        tooltip = new Widgets.Tooltip("modifiedTooltip-template", "modifiedTooltip", permalinkButtonJQ.get(0));
        tooltip = new Widgets.Tooltip("permalinkGeneratedTooltip-template", "permalinkGeneratedTooltip", permalinkButtonJQ.get(0));
        let miscControlJQ = $("#" + "miscControl");
        tooltip = new Widgets.Tooltip("loadErrorTooltip-template", "loadErrorTooltip", miscControlJQ.get(0));
        $("#settingsButton").click(() => {
            MechSimulatorLogic.pauseSimulation();
            MechViewSimSettings.showSettingsDialog();
        });
    };
    var getStatusTooltip = function (tooltipId) {
        let element = document.getElementById(tooltipId);
        return Widgets.Tooltip.fromDom(element, Widgets.Tooltip.TooltipDomKey);
    };
    var showStatusTooltip = function (tooltipId) {
        for (let currId of StatusTooltipIdList) {
            let tooltip = getStatusTooltip(currId);
            if (currId === tooltipId) {
                tooltip.showTooltip();
            }
            else {
                tooltip.hideTooltip();
            }
        }
    };
    var hideStatusTooltips = function () {
        showStatusTooltip(null);
    };
    var showModifiedToolip = function () {
        showStatusTooltip(ModifiedTooltipId);
    };
    var showPermalinkTooltip = function (link) {
        $(`#${PermalinkTooltipId} [class~=permaLink]`)
            .attr("href", link);
        showStatusTooltip(PermalinkTooltipId);
    };
    var showLoadErrorTooltip = function () {
        showStatusTooltip(LoadErrorTooltipId);
    };
    var updateOnModifyAppState = function (event) {
        showModifiedToolip();
    };
    var updateOnAppSaveState = function (event) {
        //make the view consistent with the current state
    };
    var updateOnLoadAppState = function (event) {
        hideStatusTooltips();
        doAutoRun();
    };
    var updateOnLoadAppError = function (event) {
        showStatusTooltip(LoadErrorTooltipId);
    };
    var doAutoRun = function () {
        //set sim speed and run sim if run and speed url params are set
        let runParam = MechViewRouter.getRunFromLocation() === "true";
        let speedParam = Number(MechViewRouter.getSpeedFromLocation());
        if (speedParam) {
            setSimulatorSpeedfactor(speedParam);
        }
        if (runParam) {
            MechModelView.resetModel();
            MechSimulatorLogic.resetSimulation();
            MechSimulatorLogic.runSimulation();
        }
    };
    const LOADING_SCREEN_MECH_ID = "fakeLoadingScreenMechId";
    var loadingScreenAnimateInterval;
    const LOADING_SCREEN_ANIMATE_INTERVAL = 200; //ms
    MechView.showLoadingScreen = function () {
        let loadingScreenDiv = Widgets.cloneTemplate("loadingScreen-template");
        $(loadingScreenDiv)
            .attr("id", "loadingScreenContainer");
        Widgets.setModal(loadingScreenDiv);
        let loadingScreenPaperDollJQ = $("#loadingScreenPaperDollContainer");
        let paperDoll = new MechViewMechPanel.PaperDoll(LOADING_SCREEN_MECH_ID);
        loadingScreenPaperDollJQ.append(paperDoll.domElement);
        for (let componentIdx in Component) {
            if (Component.hasOwnProperty(componentIdx)) {
                let component = Component[componentIdx];
                paperDoll.setPaperDollArmor(component, 1);
                paperDoll.setPaperDollStructure(component, 1);
            }
        }
        if (loadingScreenAnimateInterval) {
            window.clearInterval(loadingScreenAnimateInterval);
        }
        loadingScreenAnimateInterval = window.setInterval(function () {
            for (let componentIdx in Component) {
                if (Component.hasOwnProperty(componentIdx)) {
                    let component = Component[componentIdx];
                    paperDoll.setPaperDollArmor(component, Math.random());
                    paperDoll.setPaperDollStructure(component, Math.random());
                }
            }
        }, LOADING_SCREEN_ANIMATE_INTERVAL);
        MechView.updateLoadingScreenProgress(0);
        Widgets.showModal();
    };
    MechView.hideLoadingScreen = function () {
        Widgets.hideModal();
        window.clearInterval(loadingScreenAnimateInterval);
    };
    MechView.updateLoadingScreenProgress = function (percent) {
        let progressBar = document.getElementById("loadingScreenProgress");
        let textPercent = Math.floor(Number(percent) * 100) + "%";
        progressBar.style.width = textPercent;
    };
    MechView.updateTitle = function (title) {
        document.title = title;
    };
})(MechView || (MechView = {}));
//Test code.
var MechTest;
//Test code.
(function (MechTest) {
    var Team = MechModelCommon.Team;
    var WeaponCycle = MechModelCommon.WeaponCycle;
    var Component = MechModelCommon.Component;
    var SimulatorParameters = SimulatorSettings.SimulatorParameters;
    var uiTestInterval = null;
    var testIntervalLength = 100;
    var mechIdWeaponCount = []; //number of weapons set for a given mechid
    //Load dummy data from javascript files in data folder
    var initDummyModelData = function () {
        MechModel.setInitModelData(DummyWeaponData, DummyAmmoData, DummyMechData, DummyModuleData, _DummyOmnipods);
    };
    MechTest.testUIWidgets = function () {
        MechView.init();
        initDummyModelData();
        initTestModelState();
        MechModelView.refreshView();
        var createHandler = function () {
            return () => {
                if (uiTestInterval == null) {
                    uiTestInterval = window.setInterval(() => {
                        testUI(MechModel.getMechTeam(Team.BLUE));
                        testUI(MechModel.getMechTeam(Team.RED));
                    }, testIntervalLength);
                }
                else {
                    window.clearInterval(uiTestInterval);
                    uiTestInterval = null;
                }
            };
        };
        var handler = createHandler();
        $("#testUI").removeClass("debugButton").click(handler);
    };
    var testUI = function (mechTeam) {
        var weaponStates = [WeaponCycle.READY,
            WeaponCycle.FIRING,
            WeaponCycle.DISABLED];
        $.each(mechTeam, (index, mech) => {
            for (var property in Component) {
                if (Component.hasOwnProperty(property)) {
                    let paperDoll = MechViewMechPanel.PaperDoll.getPaperDoll(mech.getMechId());
                    paperDoll.setPaperDollArmor(Component[property], Math.random());
                    paperDoll.setPaperDollStructure(Component[property], Math.random());
                }
            }
            let heatbar = MechViewMechPanel.Heatbar.getHeatbar(mech.getMechId());
            heatbar.setHeatbarValue(Math.random());
            for (var i = 0; i < mech.getMechInfo().weaponInfoList.length; i++) {
                let weaponPanel = MechViewMechPanel.WeaponPanel.getWeaponPanel(mech.getMechId());
                weaponPanel.setWeaponCooldown(i, Math.random());
                weaponPanel.setWeaponAmmo(i, Math.random() > 0.2 ? Math.floor(Math.random() * 100) : -1);
                weaponPanel.setWeaponState(i, weaponStates[Math.floor(weaponStates.length * Math.random())]);
            }
        });
    };
    MechTest.testModelInit = function () {
        MechModel.initModelData()
            .then(function () {
            Util.log("Successfully loaded model init data");
        })
            .catch(function (err) {
            Util.log("Failed to load model init data");
        });
    };
    MechTest.testModelOps = function () {
        initDummyModelData();
        // MechModel.addMech("testCheetahId", Team.BLUE, DummyArcticCheetah);
        // MechModel.addMech("testExecutionerId", Team.BLUE, DummyExecutioner);
        MechModel.addMech("testMaulerId", Team.RED, DummyMauler);
        // MechModel.addMech("testFirestarterId", Team.RED, DummyFireStarter);
        MechModel.addMech("testBattlemasterId", Team.RED, DummyBattleMaster);
    };
    MechTest.testModelBaseHealth = function () {
        for (var tonnage = 20; tonnage <= 100; tonnage += 5) {
            for (var property in Component) {
                if (Component.hasOwnProperty(property)) {
                    var structure = MechModel.baseMechStructure(Component[property], tonnage);
                    var armor = MechModel.baseMechArmor(Component[property], tonnage);
                    Util.log("Tonnage: " + tonnage + " " + Component[property] +
                        " structure:" + structure + " armor:" + armor);
                }
            }
        }
    };
    MechTest.testModelView = function () {
        MechView.init();
        initDummyModelData();
        initTestModelState();
        MechModelView.refreshView();
        $("#resetState").removeClass("debugButton").click(() => {
            MechModel.resetState();
            MechModelView.refreshView();
        });
        $("#testModelView").removeClass("debugButton").click(() => {
            //set mech healths to random numbers
            let teams = [Team.BLUE, Team.RED];
            for (let team of teams) {
                for (let mech of MechModel.getMechTeam(team)) {
                    let mechState = mech.getMechState();
                    //random component health
                    for (let mechComponentHealth of mechState.mechHealth.componentHealthList) {
                        mechComponentHealth.armor = Math.random() * mechComponentHealth.maxArmor;
                        mechComponentHealth.structure = Math.random() * mechComponentHealth.maxStructure;
                    }
                    MechModelView.updateHealth(mech);
                    mechState.heatState.currHeat = Math.random() * mechState.heatState.currMaxHeat;
                    MechModelView.updateHeat(mech);
                    //random weapon state
                    for (let weaponIndex in mechState.weaponStateList) {
                        if (!mechState.weaponStateList.hasOwnProperty(weaponIndex)) {
                            continue;
                        }
                        let weaponState = mechState.weaponStateList[weaponIndex];
                        let WEAPON_CYCLES = [];
                        for (let weaponCycle in WeaponCycle) {
                            if (WeaponCycle.hasOwnProperty(weaponCycle)) {
                                WEAPON_CYCLES.push(WeaponCycle[weaponCycle]);
                            }
                        }
                        weaponState.weaponCycle = WEAPON_CYCLES[Math.floor(Math.random() * WEAPON_CYCLES.length)];
                        let weaponInfo = weaponState.weaponInfo;
                        weaponState.spoolupLeft = Math.random() * Number(weaponInfo.spinup);
                        weaponState.cooldownLeft = Math.random() * Number(weaponInfo.cooldown);
                    }
                    //random weapon ammoState
                    let ammoCounts = mechState.ammoState.ammoCounts;
                    for (let weaponId in ammoCounts) {
                        if (ammoCounts.hasOwnProperty(weaponId)) {
                            let ammoCount = ammoCounts[weaponId];
                            ammoCount.ammoCount = Math.floor(Math.random() * ammoCount.maxAmmoCount);
                        }
                    }
                    MechModelView.updateCooldown(mech);
                    MechModelView.updateWeaponStatus(mech);
                }
            }
        });
    };
    MechTest.testDamageAtRange = function () {
        initDummyModelData();
        let ppcID = 1009;
        let srm6ID = 1031;
        let atm12ID = 1252;
        let testIds = [ppcID, srm6ID, atm12ID];
        var mechInfo = new MechModel.MechInfo("testId", DummyStormcrow);
        for (let weaponId of testIds) {
            var weaponInfoTest = new MechModelWeapons.WeaponInfo(String(weaponId), "centre_torso", MechModel.getSmurfyWeaponData(String(weaponId)), mechInfo);
            Util.log("Weapon " + weaponInfoTest.translatedName +
                " minRange: " + weaponInfoTest.minRange +
                " optRange: " + weaponInfoTest.optRange +
                " maxRange: " + weaponInfoTest.maxRange +
                " baseDmg: " + weaponInfoTest.baseDmg);
            let testRanges = [0, 90, 180, 270, 300, 500, 540, 810, 1080, 2000];
            const stepDuration = 50;
            for (let range of testRanges) {
                let damage = weaponInfoTest.damageAtRange(range);
                Util.log("range: " + range + " damage: " + damage);
            }
        }
    };
    MechTest.testSpreadAdjacentDamage = function () {
        var printTestDamageTransform = function (damage, pattern) {
            let weaponDamage = new MechModel.WeaponDamage(damage);
            let transformedDamage = accuracyPattern(weaponDamage, 200);
            Util.log("original damage: " + weaponDamage.toString());
            Util.log("transformedDamage: " + transformedDamage.toString());
        };
        let accuracyPattern = MechAccuracyPattern.accuracySpreadToAdjacent(0.5, 0.5, 0);
        let accuracyPatternNext = MechAccuracyPattern.accuracySpreadToAdjacent(0.5, 0.3, 0.2);
        let testDamage = {
            "centre_torso": 10,
            "right_torso": 2.5,
            "left_torso": 2.5,
        };
        printTestDamageTransform(testDamage, accuracyPattern);
        printTestDamageTransform(testDamage, accuracyPatternNext);
        testDamage = { "head": 10 };
        printTestDamageTransform(testDamage, accuracyPattern);
        printTestDamageTransform(testDamage, accuracyPatternNext);
        testDamage = { "left_torso": 10, "centre_torso": 2.5, "left_arm": 2.5 };
        printTestDamageTransform(testDamage, accuracyPattern);
        printTestDamageTransform(testDamage, accuracyPatternNext);
        testDamage = { "left_arm": 10, "left_torso": 2.5 };
        printTestDamageTransform(testDamage, accuracyPattern);
        printTestDamageTransform(testDamage, accuracyPatternNext);
    };
    MechTest.testListQuirks = function () {
        let quirkMap = {};
        //mech quirks
        for (let mechIdx in DummyMechData) {
            if (!DummyMechData.hasOwnProperty(mechIdx)) {
                continue;
            }
            let smurfyMech = DummyMechData[mechIdx];
            let quirks = smurfyMech.details.quirks;
            if (quirks) {
                for (let quirkEntry of quirks) {
                    if (!quirkMap[quirkEntry.name]) {
                        quirkMap[quirkEntry.name] = quirkEntry;
                    }
                }
            }
        }
        //omnipod quirks
        for (let chassis in _DummyOmnipods) {
            if (!_DummyOmnipods.hasOwnProperty(chassis)) {
                continue;
            }
            let chassisOmnipods = _DummyOmnipods[chassis];
            for (let omnipodId in chassisOmnipods) {
                if (!chassisOmnipods.hasOwnProperty(omnipodId)) {
                    continue;
                }
                let omnipodData = _DummyOmnipods[chassis][omnipodId];
                let quirks = omnipodData.configuration.quirks;
                if (quirks) {
                    for (let quirkEntry of quirks) {
                        if (!quirkMap[quirkEntry.name]) {
                            quirkMap[quirkEntry.name] = quirkEntry;
                        }
                    }
                }
            }
        }
        //omnipod set quirks
        for (let omnipodSetName in AddedData._AddedOmnipodData) {
            if (!AddedData._AddedOmnipodData.hasOwnProperty(omnipodSetName)) {
                continue;
            }
            let omnipodSet = AddedData._AddedOmnipodData[omnipodSetName];
            for (let quirkEntry of omnipodSet.setBonusQuirks) {
                if (!quirkMap[quirkEntry.name]) {
                    quirkMap[quirkEntry.name] = quirkEntry;
                }
            }
        }
        //skill quirks
        for (let skillName in AddedData._SkillTreeData) {
            if (!AddedData._SkillTreeData.hasOwnProperty(skillName)) {
                continue;
            }
            let skillNode = AddedData._SkillTreeData[skillName];
            for (let skillEffect of skillNode.effects) {
                let quirkEntry = {
                    name: skillEffect.quirkName,
                    translated_name: skillEffect.quirkTranslatedName,
                    value: 0,
                };
                if (!quirkMap[quirkEntry.name]) {
                    quirkMap[quirkEntry.name] = quirkEntry;
                }
            }
        }
        //print out quirk list
        let numQuirks = 0;
        let sortedQuirkNames = [];
        for (let quirkName in quirkMap) {
            if (!quirkMap.hasOwnProperty(quirkName)) {
                continue;
            }
            sortedQuirkNames.push(quirkName);
        }
        sortedQuirkNames.sort();
        for (let quirkName of sortedQuirkNames) {
            let quirkEntry = quirkMap[quirkName];
            Util.log(`${quirkEntry.name}\t${quirkEntry.translated_name}`);
            numQuirks++;
        }
        Util.log("numQuirks : " + numQuirks);
    };
    MechTest.testSimulation = function () {
        //Use DummyData
        // initDummyModelData();
        // this.generateTestUI( );
        //Load data from smurfy
        MechView.init();
        MechView.showLoadingScreen();
        MechModel.initModelData()
            .then(function () {
            Util.log("Successfully loaded model init data");
            MechTest.generateTestUI();
        })
            .catch(function () {
            Util.log("Failed to load model init data");
        });
    };
    MechTest.generateTestUI = function () {
        MechView.hideLoadingScreen();
        initTestModelState();
        MechModelView.refreshView();
        $("#resetState").removeClass("debugButton").click(() => {
            MechModel.resetState();
            MechModelView.refreshView();
        });
        $("#runSimulationButton").removeClass("debugButton").click(() => {
            MechSimulatorLogic.runSimulation();
        });
        $("#pauseSimulationButton").removeClass("debugButton").click(() => {
            MechSimulatorLogic.pauseSimulation();
        });
        $("#resetSimulationButton").removeClass("debugButton").click(() => {
            MechSimulatorLogic.resetSimulation();
        });
        $("#stepSimulationButton").removeClass("debugButton").click(() => {
            MechSimulatorLogic.stepSimulation();
        });
        $("#refreshUIButton").removeClass("debugButton").click(() => {
            MechModelView.refreshView();
        });
        $("#saveStateButton").removeClass("debugButton").click(() => {
            Promise.resolve(MechViewRouter.saveAppState()
                .then(function (data) {
                Util.log("Success on save app state. Data: " + data);
                Util.log("statehash: " + data.statehash);
                return data;
            })
                .catch(function (data) {
                Util.log("Fail on save app state. Data: " + data);
            })).then(function (data) {
                Util.log("Done save app state. Data: " + data);
            });
        });
        $("#loadStateButton").removeClass("debugButton").click(() => {
            let hashState = location.hash;
            let regex = /#s=([^&]*)/;
            let results = regex.exec(hashState);
            if (!results) {
                Util.log("Invalid state in hash: " + hashState);
                return;
            }
            hashState = results[1];
            MechView.showLoadingScreen();
            Promise.resolve(MechViewRouter.loadAppState(hashState)
                .then(function (data) {
                Util.log("Success on load app state. Data: " + data);
                MechModelView.refreshView();
                return data;
            })
                .catch(function (data) {
                Util.log("Fail on load app state. Data: " + data);
            })).then(function (data) {
                Util.log("Done on load app state. Data: " + data);
                MechView.hideLoadingScreen();
            });
        });
    };
    MechTest.testPersistence = function () {
        var statehash;
        initDummyModelData();
        initTestModelState();
        MechView.init();
        MechView.showLoadingScreen();
        Promise.resolve(MechViewRouter.saveAppState()
            .then(function (data) {
            Util.log("Success on save app state. Data: " + data);
            Util.log("statehash: " + data.statehash);
            statehash = data.statehash;
            testGetAppState(statehash);
            return data;
        })
            .catch(function (data) {
            Util.log("Fail on save app state. Data: " + data);
        })).then(function (data) {
            Util.log("Done save app state. Data: " + data);
        });
        var testGetAppState = function (hash) {
            Promise.resolve(MechViewRouter.loadAppState(statehash)
                .then(function (data) {
                Util.log("Success on load app state. Data: " + data);
                MechModelView.refreshView();
                return data;
            })
                .catch(function (data) {
                Util.log("Fail on load app state. Data: " + data);
            })).then(function (data) {
                MechView.hideLoadingScreen();
                Util.log("Done on load app state. Data: " + data);
            });
        };
        $("#saveStateButton").removeClass("debugButton").click(() => {
            Promise.resolve(MechViewRouter.saveAppState()
                .then(function (data) {
                Util.log("Success on save app state. Data: " + data);
                Util.log("statehash: " + data.statehash);
                return data;
            })
                .catch(function (data) {
                Util.log("Fail on save app state. Data: " + data);
            })).then(function (data) {
                Util.log("Done save app state. Data: " + data);
            });
        });
        $("#loadStateButton").removeClass("debugButton").click(() => {
            let hashState = location.hash;
            let regex = /#s=([^&]*)/;
            let results = regex.exec(hashState);
            if (!results) {
                Util.log("Invalid state in hash: " + hashState);
                return;
            }
            hashState = results[1];
            MechView.showLoadingScreen();
            Promise.resolve(MechViewRouter.loadAppState(hashState)
                .then(function (data) {
                Util.log("Success on load app state. Data: " + data);
                MechModelView.refreshView();
                return data;
            })
                .catch(function (data) {
                Util.log("Fail on load app state. Data: " + data);
            })).then(function (data) {
                Util.log("Done on load app state. Data: " + data);
                MechView.hideLoadingScreen();
            });
        });
    };
    var initTestModelState = function () {
        const DEFAULT_RANGE = 200;
        MechModel.addMech("testKodiakId1", Team.BLUE, DummyKodiak);
        MechModel.addMech("testExecutionerId", Team.BLUE, DummyExecutioner);
        MechModel.addMech("testTimberwolfId", Team.BLUE, DummyTimberwolf);
        MechModel.addMech("testStormcrowId", Team.BLUE, DummyStormcrow);
        MechModel.addMech("testCheetahId", Team.BLUE, DummyArcticCheetah);
        MechModel.addMech("testMadDogId", Team.BLUE, DummyMadDog);
        MechModel.addMech("testMaulerId", Team.RED, DummyMauler);
        MechModel.addMech("testBattlemasterId", Team.RED, DummyBattleMaster);
        MechModel.addMech("testWarhammerId", Team.RED, DummyWarHammer);
        MechModel.addMech("testShadowhawkId", Team.RED, DummyShadowhawk);
        MechModel.addMech("testFirestarterId", Team.RED, DummyFireStarter);
        MechModel.addMech("testCatapultId", Team.RED, DummyCatapult);
        MechModel.addMech("testUrbanmechId1", Team.RED, DummyUrbanmech);
        let simulatorParameters = new SimulatorParameters(DEFAULT_RANGE, //range
        1);
        MechSimulatorLogic.setSimulatorParameters(simulatorParameters);
        MechModel.initMechTeamPatterns(MechModel.getMechTeam(Team.BLUE));
        MechModel.initMechTeamPatterns(MechModel.getMechTeam(Team.RED));
    };
    MechTest.testLRMSpread = function () {
        var newTestDamage = () => {
            return new MechModel.WeaponDamage({ "centre_torso": 10 });
        };
        let testDamage = newTestDamage();
        let lrmSpreadList = [
            { name: "LRM5", spread: GlobalGameInfo._LRM5Spread },
            { name: "LRM10", spread: GlobalGameInfo._LRM10Spread },
            { name: "LRM15", spread: GlobalGameInfo._LRM15Spread },
            { name: "LRM20", spread: GlobalGameInfo._LRM20Spread },
            { name: "ALRM5", spread: GlobalGameInfo._ALRM5Spread },
            { name: "ALRM10", spread: GlobalGameInfo._ALRM10Spread },
            { name: "ALRM15", spread: GlobalGameInfo._ALRM15Spread },
            { name: "ALRM20", spread: GlobalGameInfo._ALRM20Spread },
            { name: "cLRM5", spread: GlobalGameInfo._cLRM5Spread },
            { name: "cLRM10", spread: GlobalGameInfo._cLRM10Spread },
            { name: "cLRM15", spread: GlobalGameInfo._cLRM15Spread },
            { name: "cLRM20", spread: GlobalGameInfo._cLRM20Spread },
            { name: "cALRM5", spread: GlobalGameInfo._cALRM5Spread },
            { name: "cALRM10", spread: GlobalGameInfo._cALRM10Spread },
            { name: "cALRM15", spread: GlobalGameInfo._cALRM15Spread },
            { name: "cALRM20", spread: GlobalGameInfo._cALRM20Spread },
        ];
        for (let lrm of lrmSpreadList) {
            Util.log("----------------------------------------------");
            Util.log(lrm.name + " spread");
            let lrmPattern = MechAccuracyPattern.seekerPattern(lrm.spread);
            let range = 180;
            let transformedDamage = lrmPattern(newTestDamage(), range);
            Util.log("Range: " + range + " " + transformedDamage.toString());
            for (range = 200; range <= 1000; range += 100) {
                transformedDamage = lrmPattern(newTestDamage(), range);
                Util.log("Range: " + range + " " + transformedDamage.toString());
            }
        }
    };
    MechTest.testEventQueue = function () {
        let eventQueue = new Events.EventQueue();
        let listener1 = function (event) {
            Util.log(`listener1 ${event.type} ${event.data}`);
        };
        let listener2 = function (event) {
            Util.log(`listener2 ${event.type} ${event.data}`);
        };
        let listener3 = function (event) {
            Util.log(`listener3 ${event.type} ${event.data}`);
        };
        eventQueue.addListener(listener1, "foo", "bar");
        eventQueue.addListener(listener2, "foo", "baz");
        eventQueue.addListener(listener3, "baz");
        eventQueue.addListener(listener3, "foo");
        Util.log(eventQueue.debugString());
        eventQueue.queueEvent({ type: "foo", data: "foo1" });
        eventQueue.queueEvent({ type: "bar", data: "bar1" });
        eventQueue.queueEvent({ type: "baz", data: "baz1" });
        eventQueue.queueEvent({ type: "foo", data: "foo2" });
        eventQueue.queueEvent({ type: "bar", data: "bar2" });
        eventQueue.queueEvent({ type: "baz", data: "baz2" });
        setTimeout(() => {
            eventQueue.removeListener(listener1);
            eventQueue.removeListener(listener3, "foo");
            Util.log(eventQueue.debugString());
            eventQueue.queueEvent({ type: "foo", data: "foo1" });
            eventQueue.queueEvent({ type: "foo", data: "foo2" });
            eventQueue.queueEvent({ type: "bar", data: "bar1" });
            eventQueue.queueEvent({ type: "bar", data: "bar2" });
            eventQueue.queueEvent({ type: "baz", data: "baz1" });
            eventQueue.queueEvent({ type: "baz", data: "baz2" });
            setTimeout(() => {
                eventQueue.removeListener(listener2);
                eventQueue.removeListener(listener3);
                Util.log(eventQueue.debugString());
                eventQueue.queueEvent({ type: "foo", data: "foo1" });
                eventQueue.queueEvent({ type: "foo", data: "foo2" });
                eventQueue.queueEvent({ type: "bar", data: "bar1" });
                eventQueue.queueEvent({ type: "bar", data: "bar2" });
                eventQueue.queueEvent({ type: "baz", data: "baz1" });
                eventQueue.queueEvent({ type: "baz", data: "baz2" });
                Util.log("Done");
            }, 1000);
        }, 1000);
    };
    var testScratch = function () {
        //Scratch test
    };
})(MechTest || (MechTest = {}));
//Creates the test harness for test-index.html. To run tests, go to url
//    test-index.html#<testName>
//where testName is a test method in simulator-test.ts
var MechTest;
//Creates the test harness for test-index.html. To run tests, go to url
//    test-index.html#<testName>
//where testName is a test method in simulator-test.ts
(function (MechTest) {
    const INDEX_HTML_URL = "index.html";
    function loadAppHTMLPromise() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: INDEX_HTML_URL,
                type: 'GET',
                dataType: 'text'
            })
                .done(function (data) {
                Util.log("Successfully loaded " + INDEX_HTML_URL);
                resolve(data);
            })
                .fail(function (data) {
                Util.log("Request for  " + INDEX_HTML_URL + " request failed: " + Error(data));
                reject(Error(data));
            });
        });
    }
    //Loads the body of the main index.html into test-index.html.
    //NOTE: This relies on the body tags in the main index.html file to be in
    //lower case and have no spaces due to the string.search() calls
    function replaceBody() {
        return loadAppHTMLPromise().then(function (data) {
            let bodyStart = data.search("<body>");
            bodyStart += "<body>".length;
            let bodyEnd = data.search("</body>");
            let bodyStr = data.substr(bodyStart, bodyEnd - bodyStart);
            let appBody = $.parseHTML(bodyStr);
            $("body").append(appBody);
            Util.log("Loaded all HTML");
            return data;
        })
            .catch(function (data) {
            Util.error(Error("Error loading app HTML"));
        });
    }
    function runTest() {
        let hash = location.hash;
        hash = hash ? hash.substring(1) : null;
        if (hash) {
            if (MechTest.hasOwnProperty(hash)) {
                let testFunc = Reflect.get(MechTest, hash);
                testFunc();
            }
        }
        else {
            Util.error(Error("No test specified"));
        }
    }
    function testMain() {
        Util.log("testMain started");
        replaceBody().then(function (data) {
            runTest();
        })
            .catch(function (data) {
            Util.error(Error("Error running test: " + data));
        });
    }
    MechTest.testMain = testMain;
})(MechTest || (MechTest = {}));
//# sourceMappingURL=mwosim.js.map