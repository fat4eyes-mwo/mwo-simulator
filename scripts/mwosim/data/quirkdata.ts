//Constants used by simulator-model-quirks.js to compute quirk bonuses

namespace MechModelQuirks {
  //quirks that apply to the mech, not a component or weapon
  //NOTE: Many other skill quirks fit in here, add them whenever they become relevant to the simulation
  export const _quirkGeneral : {[index:string] : boolean} = {
    "heatloss_multiplier" : true,
    "heatdissipation_multiplier" : true,
    "maxheat_multiplier" : true,
    "externalheat_multiplier" : true,
    "sensorrange_additive" : true,
  };

  //Defensive quirks
  export const _quirkComponentMap : {[index:string] : string} = {
    "centre_torso" : "ct",
    "left_arm" : "ra",
    "left_leg" : "ll",
    "left_torso" : "lt",
    "right_arm" : "ra",
    "right_leg" : "rl",
    "right_torso" : "rt",
    "head" : "hd",
  };
  export const QuirkArmorAdditivePrefix : string = "armorresist";
  export const QuirkStructureAdditivePrefix : string = "internalresist";
  export const QuirkArmorMultiplier : string = "increasedarmor_multiplier";
  export const QuirkStructureMultiplier : string = "increasedstructure_multiplier";


  //Weapon quirks
  //Map from quirk name weapon types to smurfy weapon types
  export const _weaponClassMap : {[index:string] : string[]} = {
    "all" : ["BALLISTIC", "BEAM", "MISSLE"],
    "ballistic" : ["BALLISTIC"],
    "energy" : ["BEAM"],
    "missile" : ["MISSLE"] //(sic) from smurfy data
  };

  //Map from quirk weapon names to smurfy weapon names
  export const _weaponNameMap : {[index:string] : string[]} = {
    "atm" : ["ClanATM3", "ClanATM6", "ClanATM9", "ClanATM12"],
    "atm3" : ["ClanATM3"],
    "atm6" : ["ClanATM6"],
    "atm9" : ["ClanATM9"],
    "atm12" : ["ClanATM12"],
    "isautocannon10" : ["AutoCannon10"],
    "isautocannon20" : ["AutoCannon20"],
    "isautocannon2" : ["AutoCannon2"],
    "isautocannon5" : ["AutoCannon5"],
    "iserlargelaser" : ["ERLargeLaser"],
    "iserppc" : ["ERPPC"],
    "isflamer": ["Flamer"],
    "isgaussrifle" : ["GaussRifle"],
    "islargelaser" : ["LargeLaser"],
    "islargepulselaser" : ["LargePulseLaser"],
    "islbxautocannon10" : ["LBXAutoCannon10"],
    "islrm5" : ["LRM5", "LRM5_Artemis"],
    "islrm10" : ["LRM10", "LRM10_Artemis"],
    "islrm15" : ["LRM15", "LRM15_Artemis"],
    "islrm20" : ["LRM20", "LRM20_Artemis"],
    "islrm" : ["LRM5", "LRM10", "LRM15", "LRM20",
              "LRM5_Artemis", "LRM10_Artemis", "LRM15_Artemis", "LRM20_Artemis"],
    "ismachinegun" : ["MachineGun"],
    "ismediumlaser" : ["MediumLaser"],
    "ismediumpulselaser" : ["MediumPulseLaser"],
    "isnarcbeacon" : ["NarcBeacon"],
    "isppc" : ["PPC"],
    "issrm2" : ["SRM2", "SRM2_Artemis"],
    "issrm4" : ["SRM4", "SRM4_Artemis"],
    "issrm6" : ["SRM6", "SRM6_Artemis"],
    "issrm" : ["SRM2", "SRM2_Artemis", "SRM4", "SRM4_Artemis", "SRM6", "SRM6_Artemis"],
    "isstdlaser" : ["SmallLaser", "MediumLaser", "LargeLaser"],
    "isstreaksrm" : ["StreakSRM2", "StreakSRM4", "StreakSRM6"],
    "isultraautocannon5" : ["UltraAutoCannon5"],
    "laser" : ["SmallLaser", "MediumLaser", "ERLargeLaser", "LargeLaser",
              "LargePulseLaser", "MediumPulseLaser", "SmallPulseLaser",
              "ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser",
              "ClanSmallPulseLaser", "ClanMediumPulseLaser", "ClanLargePulseLaser"],
    "lrm" : ["LRM5", "LRM10", "LRM15", "LRM20",
              "LRM5_Artemis", "LRM10_Artemis", "LRM15_Artemis", "LRM20_Artemis",
              "ClanLRM5", "ClanLRM10", "ClanLRM15", "ClanLRM20",
                        "ClanLRM5_Artemis", "ClanLRM10_Artemis", "ClanLRM15_Artemis", "ClanLRM20_Artemis"],
    "mediumpulselaser" : ["MediumPulseLaser", "ClanMediumPulseLaser"],
    "nonpulselaser" : ["SmallLaser", "MediumLaser", "ERLargeLaser", "LargeLaser",
              "ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser"],
    "ppc" : ["ERPPC", "PPC", "ClanERPPC", "LightPPC", "HeavyPPC", "SnubNosePPC"],
    "pulselaser" : ["LargePulseLaser", "MediumPulseLaser", "SmallPulseLaser",
                        "ClanSmallPulseLaser", "ClanMediumPulseLaser", "ClanLargePulseLaser"],
    "ultraautocannon" : ["UltraAutoCannon5", "UltraAutoCannon2", "UltraAutoCannon10", "UltraAutoCannon20",
                        "ClanUltraAutoCannon2", "ClanUltraAutoCannon5", "ClanUltraAutoCannon10", "ClanUltraAutoCannon20"],
    "ultraautocannon20" : ["UltraAutoCannon20", "ClanUltraAutoCannon20"],
    "ac" :["AutoCannon20", "AutoCannon2", "AutoCannon5", "AutoCannon10", "LBXAutoCannon10",
          "UltraAutoCannon5", "UltraAutoCannon2", "UltraAutoCannon10", "UltraAutoCannon20",
          "ClanLBXAutoCannon2", "ClanLBXAutoCannon5", "ClanLBXAutoCannon10", "ClanLBXAutoCannon20",
          "ClanUltraAutoCannon2", "ClanUltraAutoCannon5", "ClanUltraAutoCannon10", "ClanUltraAutoCannon20",
          "ClanAutoCannon2", "ClanAutoCannon5", "ClanAutoCannon10", "ClanAutoCannon20"],
    "clanantimissilesystem" : ["ClanAntiMissileSystem"],
    "clanerlaser" : ["ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser"],
    "clanermediumlaser" : ["ClanERMediumLaser"],
    "clanlbxautocannon10" : ["ClanLBXAutoCannon10"],
    "clanerppc" : ["ClanERPPC"],
    "clangaussrifle" : ["ClanGaussRifle"],
    "clanlrm" : ["ClanLRM5", "ClanLRM10", "ClanLRM15", "ClanLRM20",
              "ClanLRM5_Artemis", "ClanLRM10_Artemis", "ClanLRM15_Artemis", "ClanLRM20_Artemis"],
    "clanlrm5" : ["ClanLRM5", "ClanLRM5_Artemis"],
    "clanlrm10" : ["ClanLRM10", "ClanLRM10_Artemis"],
    "clanlrm15" : ["ClanLRM15", "ClanLRM15_Artemis"],
    "clanlrm20" : ["ClanLRM20", "ClanLRM20_Artemis"],
    "clanmachinegun" : ["ClanMachineGun"],
    "clanmediumpulselaser" : ["ClanMediumPulseLaser"],
    "clansrm2" : ["ClanSRM2", "ClanSRM2_Artemis"],
    "clansrm4" : ["ClanSRM4", "ClanSRM4_Artemis"],
    "clansrm6" : ["ClanSRM6", "ClanSRM6_Artemis"],
    "clansrm" : ["ClanSRM2", "ClanSRM2_Artemis", "ClanSRM4", "ClanSRM4_Artemis", "ClanSRM6", "ClanSRM6_Artemis"],
    "clanstreaksrm2" : ["ClanStreakSRM2"],
    "clanstreaksrm4" : ["ClanStreakSRM4"],
    "clanstreaksrm6" : ["ClanStreakSRM6"],
    "clanstreaksrm" : ["ClanStreakSRM2", "ClanStreakSRM4", "ClanStreakSRM6"],
    "clanultraautocannon2" : ["ClanUltraAutoCannon2"],
    "clanultraautocannon5" : ["ClanUltraAutoCannon5"],
    "clanultraautocannon10" : ["ClanUltraAutoCannon10"],
    "clanultraautocannon20" : ["ClanUltraAutoCannon20"],
    "erlaser" : ["ERLargeLaser", "ERMediumLaser", "ERSmallLaser",
                "ClanERMicroLaser", "ClanERSmallLaser", "ClanERMediumLaser", "ClanERLargeLaser"],
    "isantimissilesystem" : ["AntiMissileSystem"],
    "lbxautocannon" : ["LBXAutoCannon10", "LBXAutoCannon2", "LBXAutoCannon5", "LBXAutoCannon20",
                      "ClanLBXAutoCannon2", "ClanLBXAutoCannon5", "ClanLBXAutoCannon10", "ClanLBXAutoCannon20",],
    "rotaryautocannon" : ["RotaryAutoCannon2", "RotaryAutoCannon5"],
    "srm" : ["SRM2", "SRM2_Artemis", "SRM4", "SRM4_Artemis", "SRM6", "SRM6_Artemis",
              "ClanSRM2", "ClanSRM2_Artemis", "ClanSRM4", "ClanSRM4_Artemis", "ClanSRM6", "ClanSRM6_Artemis"],
    "streaksrm" : ["StreakSRM2", "StreakSRM4", "StreakSRM6", "ClanStreakSRM2", "ClanStreakSRM4", "ClanStreakSRM6"]
  };
}
