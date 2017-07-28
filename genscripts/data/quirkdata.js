//Constants used by simulator-model-quirks.js to compute quirk bonuses
//quirks that apply to the mech, not a component or weapon
var MechModelQuirks;
(function (MechModelQuirks) {
    MechModelQuirks._quirkGeneral = {
        "heatloss_multiplier": true,
        "heatdissipation_multiplier": true,
        "externalheat_multiplier": true,
        "sensorrange_additive": true,
    };
    //Defensive quirks
    MechModelQuirks._quirkComponentMap = {
        "centre_torso": "ct",
        "left_arm": "ra",
        "left_leg": "ll",
        "left_torso": "lt",
        "right_arm": "ra",
        "right_leg": "rl",
        "right_torso": "rt",
        "head": "hd",
    };
    MechModelQuirks._quirkArmorPrefix = "armorresist";
    MechModelQuirks._quirkStructurePrefix = "internalresist";
    //Weapon quirks
    //Map from quirk name weapon types to smurfy weapon types
    MechModelQuirks._weaponClassMap = {
        "all": ["BALLISTIC", "BEAM", "MISSLE"],
        "ballistic": ["BALLISTIC"],
        "energy": ["BEAM"],
        "missile": ["MISSLE"] //(sic) from smurfy data
    };
    //Map from quirk weapon names to smurfy weapon names
    MechModelQuirks._weaponNameMap = {
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
        "clanerppc": ["ClanERPPC"],
        "clangaussrifle": ["ClanGaussRifle"],
        "clanmachinegun": ["ClanMachineGun"],
        "erlaser": ["ERLargeLaser", "ERMediumLaser", "ERSmallLaser",
            "ClanERMicroLaser", "ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser"],
        "isantimissilesystem": ["AntiMissileSystem"],
        "lbxautocannon": ["LBXAutoCannon10", "LBXAutoCannon2", "LBXAutoCannon5", "LBXAutoCannon20",
            "ClanLBXAutoCannon2", "ClanLBXAutoCannon5", "ClanLBXAutoCannon10", "ClanLBXAutoCannon20",],
        "srm": ["SRM2", "SRM2_Artemis", "SRM4", "SRM4_Artemis", "SRM6", "SRM6_Artemis",
            "ClanSRM2", "ClanSRM2_Artemis", "ClanSRM4", "ClanSRM4_Artemis", "ClanSRM6", "ClanSRM6_Artemis"],
    };
})(MechModelQuirks || (MechModelQuirks = {}));
//# sourceMappingURL=quirkdata.js.map