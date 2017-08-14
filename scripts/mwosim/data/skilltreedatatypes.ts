namespace AddedData {
  //types for skill tree data in skilltreedata.ts
  export interface SkillTreeNode {
    baseName: string;
    effects: SkillTreeEffect[];
  }

  export interface SkillTreeEffect {
    quirkName: string;
    quirkTranslatedName: string;
    quirkValues: SkillTreeQuirkValue[];
  }

  export interface SkillTreeQuirkValue {
    faction?: string;
    tonnage?: number;
    weightClass?: string;
    quirkValue: number;
  }
}