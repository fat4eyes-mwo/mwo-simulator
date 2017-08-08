//Maps quirk names to translated quirk names
//TODO: See if this can be mined directly from the game files

export interface QuirkNameEntry {
  name : string;
  translated_name : string;
}
export namespace MechDataQuirkData {
  export var QuirkTranslatedNameMap : {[index:string] : QuirkNameEntry}= {
  "ac_velocity_multiplier" : { name : "ac_velocity_multiplier", translated_name : "AC VELOCITY" },
  "accellerp_all_multiplier" : { name : "accellerp_all_multiplier", translated_name : "ACCELERATION RATE" },
  "all_cooldown_multiplier" : { name : "all_cooldown_multiplier", translated_name : "COOLDOWN" },
  "arm_pitchspeed_multiplier" : { name : "arm_pitchspeed_multiplier", translated_name : "Arm Pitch Speed" },
  "arm_yawspeed_multiplier" : { name : "arm_yawspeed_multiplier", translated_name : "Arm Yaw Speed" },
  "armorresist_ct_additive" : { name : "armorresist_ct_additive", translated_name : "BASE ARMOR (CT)" },
  "armorresist_hd_additive" : { name : "armorresist_hd_additive", translated_name : "BASE ARMOR (HD)" },
  "armorresist_la_additive" : { name : "armorresist_la_additive", translated_name : "BASE ARMOR (LA)" },
  "armorresist_ll_additive" : { name : "armorresist_ll_additive", translated_name : "BASE ARMOR (LL)" },
  "armorresist_lt_additive" : { name : "armorresist_lt_additive", translated_name : "BASE ARMOR (LT)" },
  "armorresist_ra_additive" : { name : "armorresist_ra_additive", translated_name : "BASE ARMOR (RA)" },
  "armorresist_rl_additive" : { name : "armorresist_rl_additive", translated_name : "BASE ARMOR (RL)" },
  "armorresist_rt_additive" : { name : "armorresist_rt_additive", translated_name : "BASE ARMOR (RT)" },
  "atm_spread_multiplier" : { name : "atm_spread_multiplier", translated_name : "ATM SPREAD" },
  "ballistic_cooldown_multiplier" : { name : "ballistic_cooldown_multiplier", translated_name : "BALLISTIC COOLDOWN" },
  "ballistic_heat_multiplier" : { name : "ballistic_heat_multiplier", translated_name : "Ballistics Heat" },
  "ballistic_range_multiplier" : { name : "ballistic_range_multiplier", translated_name : "BALLISTIC RANGE" },
  "ballistic_velocity_multiplier" : { name : "ballistic_velocity_multiplier", translated_name : "BALLISTIC VELOCITY" },
  "clanantimissilesystem_range_multiplier" : { name : "clanantimissilesystem_range_multiplier", translated_name : "AMS RANGE" },
  "clanantimissilesystem_rof_multiplier" : { name : "clanantimissilesystem_rof_multiplier", translated_name : "AMS RATE OF FIRE" },
  "clanerlaser_cooldown_multiplier" : { name : "clanerlaser_cooldown_multiplier", translated_name : "Clan ER Laser Cooldown" },
  "clanerlaser_duration_multiplier" : { name : "clanerlaser_duration_multiplier", translated_name : "Clan ER Laser Duration" },
  "clanerlaser_heat_multiplier" : { name : "clanerlaser_heat_multiplier", translated_name : "CLAN ER LASER HEAT GENERATION" },
  "clanerlaser_range_multiplier" : { name : "clanerlaser_range_multiplier", translated_name : "Clan ER Laser Range" },
  "clanermediumlaser_heat_multiplier" : { name : "clanermediumlaser_heat_multiplier", translated_name : "Clan ER Mediun Laser Heat" },
  "clanerppc_cooldown_multiplier" : { name : "clanerppc_cooldown_multiplier", translated_name : "ER PPC COOLDOWN" },
  "clanerppc_heat_multiplier" : { name : "clanerppc_heat_multiplier", translated_name : "ER PPC HEAT GENERATION" },
  "clanerppc_velocity_multiplier" : { name : "clanerppc_velocity_multiplier", translated_name : "CLAN ER PPC VELOCITY" },
  "clangaussrifle_cooldown_multiplier" : { name : "clangaussrifle_cooldown_multiplier", translated_name : "Clan Gauss Cooldown" },
  "clanlbxautocannon10_cooldown_multiplier" : { name : "clanlbxautocannon10_cooldown_multiplier", translated_name : "Clan LB-X10 Cooldown" },
  "clanlrm20_cooldown_multiplier" : { name : "clanlrm20_cooldown_multiplier", translated_name : "Clan LRM20 Cooldown" },
  "clanlrm20_spread_multiplier" : { name : "clanlrm20_spread_multiplier", translated_name : "Clan LRM20 Spread" },
  "clanlrm_cooldown_multiplier" : { name : "clanlrm_cooldown_multiplier", translated_name : "Clan LRM Cooldown" },
  "clanmachinegun_range_multiplier" : { name : "clanmachinegun_range_multiplier", translated_name : "MACHINE GUN RANGE" },
  "clanmachinegun_rof_multiplier" : { name : "clanmachinegun_rof_multiplier", translated_name : "MACHINE GUN ROF" },
  "clanmediumpulselaser_heat_multiplier" : { name : "clanmediumpulselaser_heat_multiplier", translated_name : "Clan Medium Pulse Laser Heat" },
  "clannarcbeacon_range_additive" : { name : "clannarcbeacon_range_additive", translated_name : "NARC BEACON RANGE" },
  "clansrm2_heat_multiplier" : { name : "clansrm2_heat_multiplier", translated_name : "Clan SRM2 Heat" },
  "clanstreaksrm_cooldown_multiplier" : { name : "clanstreaksrm_cooldown_multiplier", translated_name : "Clan Streak Cooldown" },
  "clanultraautocannon2_heat_multiplier" : { name : "clanultraautocannon2_heat_multiplier", translated_name : "Clan UAC2 Heat" },
  "critchance_receiving_multiplier" : { name : "critchance_receiving_multiplier", translated_name : "CRIT HIT CHANCE (RECEIVING)" },
  "decellerp_all_multiplier" : { name : "decellerp_all_multiplier", translated_name : "DECELERATION RATE" },
  "energy_cooldown_multiplier" : { name : "energy_cooldown_multiplier", translated_name : "ENERGY COOLDOWN" },
  "energy_heat_multiplier" : { name : "energy_heat_multiplier", translated_name : "Energy Heat" },
  "energy_range_multiplier" : { name : "energy_range_multiplier", translated_name : "ENERGY RANGE" },
  "erlaser_cooldown_multiplier" : { name : "erlaser_cooldown_multiplier", translated_name : "ER LASER COOLDOWN" },
  "erlaser_duration_multiplier" : { name : "erlaser_duration_multiplier", translated_name : "ER LASER DURATION" },
  "erlaser_heat_multiplier" : { name : "erlaser_heat_multiplier", translated_name : "ER LASER HEAT GENERATION" },
  "erlaser_range_multiplier" : { name : "erlaser_range_multiplier", translated_name : "ER LASER RANGE" },
  "externalheat_multiplier" : { name : "externalheat_multiplier", translated_name : "EXTERNAL HEAT TRANSFER" },
  "heatdissipation_multiplier" : { name : "heatdissipation_multiplier", translated_name : "Heat Dissipation" },
  "heatloss_multiplier" : { name : "heatloss_multiplier", translated_name : "RATE OF HEAT LOSS" },
  "internalresist_ct_additive" : { name : "internalresist_ct_additive", translated_name : "BASE STRUCTURE (CT)" },
  "internalresist_la_additive" : { name : "internalresist_la_additive", translated_name : "BASE STRUCTURE (LA)" },
  "internalresist_ll_additive" : { name : "internalresist_ll_additive", translated_name : "BASE STRUCTURE (LL)" },
  "internalresist_lt_additive" : { name : "internalresist_lt_additive", translated_name : "BASE STRUCTURE (LT)" },
  "internalresist_ra_additive" : { name : "internalresist_ra_additive", translated_name : "BASE STRUCTURE (RA)" },
  "internalresist_rl_additive" : { name : "internalresist_rl_additive", translated_name : "BASE STRUCTURE (RL)" },
  "internalresist_rt_additive" : { name : "internalresist_rt_additive", translated_name : "BASE STRUCTURE (RT)" },
  "isantimissilesystem_range_multiplier" : { name : "isantimissilesystem_range_multiplier", translated_name : "AMS RANGE" },
  "isantimissilesystem_rof_multiplier" : { name : "isantimissilesystem_rof_multiplier", translated_name : "AMS RATE OF FIRE" },
  "isautocannon10_cooldown_multiplier" : { name : "isautocannon10_cooldown_multiplier", translated_name : "AC/10 COOLDOWN" },
  "isautocannon10_range_multiplier" : { name : "isautocannon10_range_multiplier", translated_name : "AC/10 RANGE" },
  "isautocannon20_cooldown_multiplier" : { name : "isautocannon20_cooldown_multiplier", translated_name : "AC/20 COOLDOWN" },
  "isautocannon20_velocity_multiplier" : { name : "isautocannon20_velocity_multiplier", translated_name : "AC/20 VELOCITY" },
  "isautocannon2_cooldown_multiplier" : { name : "isautocannon2_cooldown_multiplier", translated_name : "AC/2 COOLDOWN" },
  "isautocannon5_cooldown_multiplier" : { name : "isautocannon5_cooldown_multiplier", translated_name : "AC/5 COOLDOWN" },
  "iserlargelaser_cooldown_multiplier" : { name : "iserlargelaser_cooldown_multiplier", translated_name : "ER LARGE LASER COOLDOWN" },
  "iserlargelaser_heat_multiplier" : { name : "iserlargelaser_heat_multiplier", translated_name : "ER LARGE LASER HEAT GENERATION" },
  "iserppc_cooldown_multiplier" : { name : "iserppc_cooldown_multiplier", translated_name : "ER PPC COOLDOWN" },
  "iserppc_heat_multiplier" : { name : "iserppc_heat_multiplier", translated_name : "ER PPC HEAT GENERATION" },
  "iserppc_velocity_multiplier" : { name : "iserppc_velocity_multiplier", translated_name : "IS ER PPC VELOCITY" },
  "isflamer_range_multiplier" : { name : "isflamer_range_multiplier", translated_name : "FLAMER RANGE" },
  "isgaussrifle_cooldown_multiplier" : { name : "isgaussrifle_cooldown_multiplier", translated_name : "GAUSS RIFLE COOLDOWN" },
  "islargelaser_cooldown_multiplier" : { name : "islargelaser_cooldown_multiplier", translated_name : "LARGE LASER COOLDOWN" },
  "islargelaser_range_multiplier" : { name : "islargelaser_range_multiplier", translated_name : "LARGE LASER RANGE" },
  "islargepulselaser_cooldown_multiplier" : { name : "islargepulselaser_cooldown_multiplier", translated_name : "LARGE PULSE LASER COOLDOWN" },
  "islargepulselaser_heat_multiplier" : { name : "islargepulselaser_heat_multiplier", translated_name : "LARGE PULSE LASER HEAT GEN." },
  "islargepulselaser_range_multiplier" : { name : "islargepulselaser_range_multiplier", translated_name : "LARGE PULSE LASER RANGE" },
  "islbxautocannon10_cooldown_multiplier" : { name : "islbxautocannon10_cooldown_multiplier", translated_name : "LB 10-X COOLDOWN" },
  "islbxautocannon_spread_multiplier" : { name : "islbxautocannon_spread_multiplier", translated_name : "LB-X SPREAD" },
  "islrm10_cooldown_multiplier" : { name : "islrm10_cooldown_multiplier", translated_name : "LRM 10 COOLDOWN" },
  "islrm15_cooldown_multiplier" : { name : "islrm15_cooldown_multiplier", translated_name : "LRM 15 COOLDOWN" },
  "islrm20_cooldown_multiplier" : { name : "islrm20_cooldown_multiplier", translated_name : "LRM 20 COOLDOWN" },
  "islrm20_heat_multiplier" : { name : "islrm20_heat_multiplier", translated_name : "LRM 20 HEAT GENERATION" },
  "islrm_cooldown_multiplier" : { name : "islrm_cooldown_multiplier", translated_name : "IS LRM Cooldown" },
  "islrm_spread_multiplier" : { name : "islrm_spread_multiplier", translated_name : "IS LRM Spread" },
  "islrm_velocity_multiplier" : { name : "islrm_velocity_multiplier", translated_name : "IS LRM Velocity" },
  "ismachinegun_rof_multiplier" : { name : "ismachinegun_rof_multiplier", translated_name : "MACHINE GUN ROF" },
  "ismediumlaser_cooldown_multiplier" : { name : "ismediumlaser_cooldown_multiplier", translated_name : "MEDIUM LASER COOLDOWN" },
  "ismediumlaser_duration_multiplier" : { name : "ismediumlaser_duration_multiplier", translated_name : "MEDIUM LASER DURATION" },
  "ismediumlaser_heat_multiplier" : { name : "ismediumlaser_heat_multiplier", translated_name : "MEDIUM LASER HEAT GENERATION" },
  "ismediumlaser_range_multiplier" : { name : "ismediumlaser_range_multiplier", translated_name : "MEDIUM LASER RANGE" },
  "ismediumpulselaser_range_multiplier" : { name : "ismediumpulselaser_range_multiplier", translated_name : "MEDIUM PULSE LASER RANGE" },
  "isnarcbeacon_range_additive" : { name : "isnarcbeacon_range_additive", translated_name : "NARC BEACON RANGE" },
  "isppc_cooldown_multiplier" : { name : "isppc_cooldown_multiplier", translated_name : "IS PPC Cooldown" },
  "isppc_heat_multiplier" : { name : "isppc_heat_multiplier", translated_name : "PPC HEAT GENERATION" },
  "isppc_velocity_multiplier" : { name : "isppc_velocity_multiplier", translated_name : "IS PPC VELOCITY" },
  "issrm4_cooldown_multiplier" : { name : "issrm4_cooldown_multiplier", translated_name : "SRM 4 COOLDOWN" },
  "issrm_spread_multiplier" : { name : "issrm_spread_multiplier", translated_name : "IS SRM Spread" },
  "isstdlaser_duration_multiplier" : { name : "isstdlaser_duration_multiplier", translated_name : "STD LASER DURATION" },
  "isstdlaser_heat_multiplier" : { name : "isstdlaser_heat_multiplier", translated_name : "STD LASER HEAT GENERATION" },
  "isstdlaser_range_multiplier" : { name : "isstdlaser_range_multiplier", translated_name : "STD LASER RANGE" },
  "isstreaksrm_cooldown_multiplier" : { name : "isstreaksrm_cooldown_multiplier", translated_name : "S-SRM 2 COOLDOWN" },
  "isultraautocannon5_cooldown_multiplier" : { name : "isultraautocannon5_cooldown_multiplier", translated_name : "UAC/5 COOLDOWN" },
  "isultraautocannon5_jamchance_multiplier" : { name : "isultraautocannon5_jamchance_multiplier", translated_name : "UAC/5 JAM CHANCE" },
  "jumpjetslots_additive" : { name : "jumpjetslots_additive", translated_name : "JUMP JET CAPACITY" },
  "laser_duration_multiplier" : { name : "laser_duration_multiplier", translated_name : "LASER DURATION" },
  "laser_heat_multiplier" : { name : "laser_heat_multiplier", translated_name : "LASER HEAT GENERATION" },
  "laser_range_multiplier" : { name : "laser_range_multiplier", translated_name : "LASER RANGE" },
  "lbxautocannon_cooldown_multiplier" : { name : "lbxautocannon_cooldown_multiplier", translated_name : "LB-X Autocannon Cooldown" },
  "lbxautocannon_spread_multiplier" : { name : "lbxautocannon_spread_multiplier", translated_name : "LB-X SPREAD" },
  "lbxautocannon_velocity_multiplier" : { name : "lbxautocannon_velocity_multiplier", translated_name : "LB-X VELOCITY" },
  "lrm_cooldown_multiplier" : { name : "lrm_cooldown_multiplier", translated_name : "LRM 5/10/15/20 COOLDOWN" },
  "lrm_heat_multiplier" : { name : "lrm_heat_multiplier", translated_name : "LRM 5/10/15/20 HEAT GENERATION" },
  "lrm_spread_multiplier" : { name : "lrm_spread_multiplier", translated_name : "LRM 5/10/15/20 SPREAD" },
  "lrm_velocity_multiplier" : { name : "lrm_velocity_multiplier", translated_name : "LRM 5/10/15/20 VELOCITY" },
  "mediumpulselaser_cooldown_multiplier" : { name : "mediumpulselaser_cooldown_multiplier", translated_name : "Medium Pulse Laser Cooldown" },
  "missile_cooldown_multiplier" : { name : "missile_cooldown_multiplier", translated_name : "MISSILE COOLDOWN" },
  "missile_heat_multiplier" : { name : "missile_heat_multiplier", translated_name : "MISSILE HEAT GENERATION" },
  "missile_range_multiplier" : { name : "missile_range_multiplier", translated_name : "MISSILE RANGE" },
  "missile_spread_multiplier" : { name : "missile_spread_multiplier", translated_name : "MISSILE SPREAD" },
  "missile_velocity_multiplier" : { name : "missile_velocity_multiplier", translated_name : "MISSILE VELOCITY" },
  "narcbeacon_narcduration_additive" : { name : "narcbeacon_narcduration_additive", translated_name : "Narc Beacon Tag Duration" },
  "nonpulselaser_duration_multiplier" : { name : "nonpulselaser_duration_multiplier", translated_name : "STD and ER Laser Duration" },
  "overheatdamage_multiplier" : { name : "overheatdamage_multiplier", translated_name : "OVERHEAT DAMAGE" },
  "ppc_heat_multiplier" : { name : "ppc_heat_multiplier", translated_name : "PPC HEAT GENERATION" },
  "ppc_velocity_multiplier" : { name : "ppc_velocity_multiplier", translated_name : "PPC VELOCITY" },
  "pulselaser_cooldown_multiplier" : { name : "pulselaser_cooldown_multiplier", translated_name : "PULSE LASER COOLDOWN" },
  "pulselaser_duration_multiplier" : { name : "pulselaser_duration_multiplier", translated_name : "PULSE LASER DURATION" },
  "pulselaser_heat_multiplier" : { name : "pulselaser_heat_multiplier", translated_name : "PULSE LASER HEAT GEN." },
  "pulselaser_range_multiplier" : { name : "pulselaser_range_multiplier", translated_name : "PULSE LASER RANGE" },
  "reversespeed_multiplier" : { name : "reversespeed_multiplier", translated_name : "REVERSE SPEED" },
  "sensorrange_additive" : { name : "sensorrange_additive", translated_name : "SENSOR RANGE" },
  "srm_spread_multiplier" : { name : "srm_spread_multiplier", translated_name : "SRM 2/4/6 SPREAD" },
  "streaksrm_cooldown_multiplier" : { name : "streaksrm_cooldown_multiplier", translated_name : "Streak 2/4/6 Cooldown" },
  "torso_pitchangle_additive" : { name : "torso_pitchangle_additive", translated_name : "Torso Pitch Angle" },
  "torso_pitchspeed_multiplier" : { name : "torso_pitchspeed_multiplier", translated_name : "Torso Pitch Speed" },
  "torso_yawangle_additive" : { name : "torso_yawangle_additive", translated_name : "Torso Yaw Angle" },
  "torso_yawspeed_multiplier" : { name : "torso_yawspeed_multiplier", translated_name : "Torso Yaw Speed" },
  "turnlerp_all_multiplier" : { name : "turnlerp_all_multiplier", translated_name : "TURN RATE" },
  "ultraautocannon20_cooldown_multiplier" : { name : "ultraautocannon20_cooldown_multiplier", translated_name : "UAC20 Cooldown" },
  "ultraautocannon_cooldown_multiplier" : { name : "ultraautocannon_cooldown_multiplier", translated_name : "UAC Cooldown" },
  "ultraautocannon_jamchance_multiplier" : { name : "ultraautocannon_jamchance_multiplier", translated_name : "UAC JAM CHANCE" },
  "ultraautocannon_range_multiplier" : { name : "ultraautocannon_range_multiplier", translated_name : "UAC RANGE" },
  "ultraautocannon_velocity_multiplier" : { name : "ultraautocannon_velocity_multiplier", translated_name : "UAC VELOCITY" },
  "xpbonus_multiplier" : { name : "xpbonus_multiplier", translated_name : "XP Bonus" },
  }
}