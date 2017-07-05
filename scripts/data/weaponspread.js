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
