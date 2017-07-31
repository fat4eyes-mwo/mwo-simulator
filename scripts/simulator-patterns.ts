
namespace ModelPatterns {
  type FirePattern = MechFirePattern.FirePattern;
  type AccuracyPattern = MechAccuracyPattern.AccuracyPattern;
  type TargetComponentPattern = MechTargetComponent.TargetComponentPattern;
  type TargetMechPattern = MechTargetMech.TargetMechPattern;

  export type PatternFunction =
      FirePattern | TargetComponentPattern
      | AccuracyPattern | TargetMechPattern;

  export interface Pattern {
    id : string;
    name : string;
    pattern : PatternFunction; 
    description:  string;
    default : boolean;
  }
}
