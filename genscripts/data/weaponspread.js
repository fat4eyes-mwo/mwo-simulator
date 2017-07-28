//Reference: https://mwomercs.com/forums/topic/254199-lrm-spread-experiments/
//Non-ct damage are eyeball estimates
////////////////////////////////////////////////////////////////////////////////
var GlobalGameInfo;
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
//# sourceMappingURL=weaponspread.js.map