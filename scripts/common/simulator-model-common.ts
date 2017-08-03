//NOTE: Common ts files must be put before all other files in the build order in
//tsconfig.json
namespace MechModelCommon {
  //TODO: See if you can get a tighter type for enums. Try aliasing.
  //Also check when string enums get put into Typescript

  export type Team = string;
  export const Team  : {[index:string] : Team} = {
    BLUE : "blue",
    RED : "red"
  };

  export type Component = string;
  export const Component : {[index:string] : string} = {
    HEAD : "head",
    RIGHT_ARM :"right_arm",
    RIGHT_TORSO : "right_torso",
    CENTRE_TORSO : "centre_torso",
    LEFT_ARM : "left_arm",
    LEFT_TORSO : "left_torso",
    RIGHT_LEG : "right_leg",
    LEFT_LEG : "left_leg",
    LEFT_TORSO_REAR : "left_torso_rear",
    CENTRE_TORSO_REAR : "centre_torso_rear",
    RIGHT_TORSO_REAR : "right_torso_rear"
  };

  export var isRearComponent = function(component : string) : boolean {
    return component === Component.LEFT_TORSO_REAR ||
        component === Component.CENTRE_TORSO_REAR ||
        component === Component.RIGHT_TORSO_REAR;
  };

  export type WeaponCycle = string;
  export const WeaponCycle : {[index:string] : WeaponCycle}  = {
    READY : "Ready",
    FIRING : "Firing",
    DISABLED : "Disabled",
    COOLDOWN : "Cooldown",
    COOLDOWN_FIRING : "CooldownFiring", //Double tap while on cooldown
    SPOOLING : "Spooling",
    JAMMED : "Jammed",
  };

  export type Faction = string;
  export const Faction : {[index:string] : Faction}  = {
    INNER_SPHERE : "InnerSphere",
    CLAN : "Clan"
  };

  export type UpdateType = string;
  export const UpdateType : {[index:string] : UpdateType}  = {
    FULL : "full",
    HEALTH : "health",
    HEAT : "heat",
    COOLDOWN : "cooldown",
    WEAPONSTATE : "weaponstate",
    STATS : "stats"
  };

  export type EngineType = string;
  export const EngineType : {[index:string] : EngineType}  = {
    STD : "std",
    XL : "xl",
    CLAN_XL : "clan_xl",
    LIGHT : "light",
  };

  export const BURST_DAMAGE_INTERVAL = 2000; //Interval considered for burst damage calculation
}
