//each spread should have at least 2 entries for extrapolation
//format is {<range> : {<component1>:<percentdmg1>, ...}, ...}

//Reference: https://mwomercs.com/forums/topic/254199-lrm-spread-experiments/
//Non-ct damage are eyeball estimates
////////////////////////////////////////////////////////////////////////////////
//IS LRMS
var _LRM5Spread = {
  190 : {"centre_torso" : 0.5343,
            "left_torso": 0.20, "right_torso" : 0.20},
  800 : {"centre_torso" : 0.4506,
            "left_torso": 0.15, "right_torso" : 0.15,
            "left_leg": 0.05, "right_leg": 0.05},
};

var _LRM10Spread = {
  190 : {"centre_torso" : 0.5666,
            "left_torso": 0.19, "right_torso" :0.19},
  800 : {"centre_torso" : 0.4452,
            "left_torso": 0.15, "right_torso" :0.15,
            "left_leg": 0.05, "right_leg": 0.05},
};

var _LRM15Spread = {
  190 : {"centre_torso" : 0.4021,
            "left_torso": 0.15, "right_torso" :0.15,
            "left_leg" : 0.05, "right_leg" : 0.05,
            "left_arm" : 0.05, "right_arm" : 0.05,},
  800 : {"centre_torso" : 0.3561,
            "left_torso": 0.16, "right_torso" :0.16,
            "left_leg" : 0.06, "right_leg" : 0.06,
            "left_arm" : 0.06, "right_arm" : 0.06,},
};

var _LRM20Spread = {
  190 : {"centre_torso" : 0.425,
            "left_torso": 0.14, "right_torso" :0.14,
            "left_leg" : 0.05, "right_leg" : 0.05,
            "left_arm" : 0.05, "right_arm" : 0.05,},
  800 : {"centre_torso" : 0.3339,
            "left_torso": 0.16, "right_torso" :0.16,
            "left_leg" : 0.06, "right_leg" : 0.06,
            "left_arm" : 0.06, "right_arm" : 0.06,},
};

var _ALRM5Spread = {
  190 : {"centre_torso" : 0.68,
            "left_torso": 0.15, "right_torso" : 0.15},
  800 : {"centre_torso" : 0.5753,
            "left_torso": 0.12, "right_torso" : 0.12,
            "left_leg": 0.02, "right_leg": 0.02},
};

var _ALRM10Spread = {
  190 : {"centre_torso" : 0.6678571429,
            "left_torso": 0.15, "right_torso" :0.15},
  800 : {"centre_torso" : 0.584375,
            "left_torso": 0.12, "right_torso" :0.12,
            "left_leg": 0.02, "right_leg": 0.02},
};

var _ALRM15Spread = {
  190 : {"centre_torso" : 0.5936507937,
            "left_torso": 0.18, "right_torso" :0.18,
        },
  800 : {"centre_torso" : 0.4452380952,
            "left_torso": 0.18, "right_torso" :0.18,
            "left_leg" : 0.02, "right_leg" : 0.02,
            "left_arm" : 0.02, "right_arm" : 0.02,},
};

var _ALRM20Spread = {
  190 : {"centre_torso" : 0.584375,
            "left_torso": 0.20, "right_torso" :0.20,},
  800 : {"centre_torso" : 0.4452380952,
            "left_torso": 0.19, "right_torso" :0.19,
            "left_leg" : 0.02, "right_leg" : 0.02,},
};

////////////////////////////////////////////////////////////////////////////////
//CLAN LRMS
var _cLRM5Spread = {
  190 : {"centre_torso" : 0.6233333333,
            "left_torso": 0.16, "right_torso" : 0.16},
  800 : {"centre_torso" : 0.4675,
            "left_torso": 0.15, "right_torso" : 0.15,
            "left_leg": 0.05, "right_leg": 0.05},
};

var _cLRM10Spread = {
  190 : {"centre_torso" : 0.5342857143,
            "left_torso": 0.19, "right_torso" :0.19},
  800 : {"centre_torso" : 0.4348837209,
            "left_torso": 0.15, "right_torso" :0.15,
            "left_leg": 0.05, "right_leg": 0.05},
};

var _cLRM15Spread = {
  190 : {"centre_torso" : 0.4617283951,
            "left_torso": 0.15, "right_torso" :0.15,
            "left_leg" : 0.05, "right_leg" : 0.05,
            "left_arm" : 0.05, "right_arm" : 0.05,},
  800 : {"centre_torso" : 0.3196581197,
            "left_torso": 0.16, "right_torso" :0.16,
            "left_leg" : 0.06, "right_leg" : 0.06,
            "left_arm" : 0.06, "right_arm" : 0.06,},
};

var _cLRM20Spread = {
  190 : {"centre_torso" : 0.4675,
            "left_torso": 0.14, "right_torso" :0.14,
            "left_leg" : 0.04, "right_leg" : 0.04,
            "left_arm" : 0.04, "right_arm" : 0.04,},
  800 : {"centre_torso" : 0.3596153846,
            "left_torso": 0.16, "right_torso" :0.16,
            "left_leg" : 0.05, "right_leg" : 0.05,
            "left_arm" : 0.05, "right_arm" : 0.05,},
};

var _cALRM5Spread = {
  190 : {"centre_torso" : 0.7056603774,
            "left_torso": 0.13, "right_torso" : 0.13},
  800 : {"centre_torso" : 0.584375,
            "left_torso": 0.12, "right_torso" : 0.12,
            "left_leg": 0.02, "right_leg": 0.02},
};

var _cALRM10Spread = {
  190 : {"centre_torso" : 0.6448275862,
            "left_torso": 0.14, "right_torso" :0.14},
  800 : {"centre_torso" : 0.5054054054,
            "left_torso": 0.14, "right_torso" :0.14,
            "left_leg": 0.03, "right_leg": 0.03},
};

var _cALRM15Spread = {
  190 : {"centre_torso" : 0.5936507937,
            "left_torso": 0.19, "right_torso" :0.19,
        },
  800 : {"centre_torso" : 0.4298850575,
            "left_torso": 0.18, "right_torso" :0.18,
            "left_leg" : 0.03, "right_leg" : 0.03,
            "left_arm" : 0.02, "right_arm" : 0.02,},
};

var _cALRM20Spread = {
  190 : {"centre_torso" : 0.55,
            "left_torso": 0.21, "right_torso" :0.21,},
  800 : {"centre_torso" : 0.4065217391,
            "left_torso": 0.20, "right_torso" :0.20,
            "left_leg" : 0.02, "right_leg" : 0.02,},
};

////////////////////////////////////////////////////////////////////////////////
//SRM spread data
//Reference: https://mwomercs.com/forums/topic/254250-srm-spread-experiments/
//Adjacent, nextAdjacent values are eyeballed from damage distribution pictures
//Format for direct fire weapons is
//{<range> : {target: <percentDamage>, adjacent: <percentDamage>, nextAdjacent: <percentDamage>}}
var _SRM2Spread = {
    0 : {target: 1.0, adjacent: 0, nextAdjacent: 0},
    130 : {target: 0.8697674419, adjacent: .1, nextAdjacent: 0},
    260 : {target: 0.8697674419, adjacent: .1, nextAdjacent: 0},
};
var _SRM4Spread = {
    0 : {target: 0.9453993933, adjacent: 0.05, nextAdjacent: 0},
    130 : {target: 0.6589147287, adjacent: .32, nextAdjacent: 0},
    260 : {target: 0.6212624585, adjacent: .35, nextAdjacent: 0},
};
var _SRM6Spread = {
    0 : {target: 0.9060077519, adjacent: 0.05, nextAdjacent: 0},
    130 : {target: 0.557543232, adjacent: .40, nextAdjacent: 0.03},
    260 : {target: 0.557543232, adjacent: .40, nextAdjacent: 0.03},
};
var _ASRM2Spread = {
    0 : {target: 1.0, adjacent: 0.0, nextAdjacent: 0.0},
    130 : {target: 0.9252845126, adjacent: .05, nextAdjacent: 0.00},
    260 : {target: 0.9252845126, adjacent: .05, nextAdjacent: 0.00},
};
var _ASRM4Spread = {
    0 : {target: 0.988372093, adjacent: 0.01, nextAdjacent: 0.0},
    130 : {target: 0.7497995188, adjacent: .30, nextAdjacent: 0.0},
    260 : {target: 0.7248062016, adjacent: .30, nextAdjacent: 0.0},
};
var _ASRM6Spread = {
    0 : {target: 0.9664082687, adjacent: 0.03, nextAdjacent: 0.0},
    130 : {target: 0.6902916205, adjacent: .28, nextAdjacent: 0.0},
    260 : {target: 0.6589147287, adjacent: .32, nextAdjacent: 0.0},
};
var _cSRM2Spread = {
    0 : {target: 1.0, adjacent: 0, nextAdjacent: 0},
    130 : {target: 0.7663934426, adjacent: .20, nextAdjacent: 0},
    260 : {target: 0.7923728814, adjacent: .15, nextAdjacent: 0},
};
var _cSRM4Spread = {
    0 : {target: 0.9739583333, adjacent: 0.02, nextAdjacent: 0},
    130 : {target: 0.584375, adjacent: .40, nextAdjacent: 0},
    260 : {target: 0.5993589744, adjacent: .35, nextAdjacent: 0},
};
var _cSRM6Spread = {
    0 : {target: 0.9166666667, adjacent: 0.07, nextAdjacent: 0},
    130 : {target: 0.5194444444, adjacent: .40, nextAdjacent: 0.03},
    260 : {target: 0.556547619, adjacent: .35, nextAdjacent: 0.02},
};
var _cASRM2Spread = {
    0 : {target: 1.0, adjacent: 0, nextAdjacent: 0},
    130 : {target: 0.8990384615, adjacent: .05, nextAdjacent: 0.0},
    260 : {target: 0.8990384615, adjacent: .05, nextAdjacent: 0.0},
};
var _cASRM4Spread = {
    0 : {target: 0.8348214286, adjacent: 0.12, nextAdjacent: 0},
    130 : {target: 0.73046875, adjacent: .32, nextAdjacent: 0.0},
    260 : {target: 0.6875, adjacent: .35, nextAdjacent: 0.0},
};
var _cASRM6Spread = {
    0 : {target: 0.9166666667, adjacent: 0.05, nextAdjacent: 0},
    130 : {target: 0.6233333333, adjacent: .34, nextAdjacent: 0.0},
    260 : {target: 0.6233333333, adjacent: .34, nextAdjacent: 0.0},
};
