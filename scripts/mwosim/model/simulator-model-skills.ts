namespace MechModelSkills {
  type MechQuirk = MechModelQuirks.MechQuirk;
  export interface SkillState {
    type: string,
    state: string,
  }
  export interface SkillLoader {
    loadSkillsFromState(state: string): Promise<any>;
    loadSkillsFromURL(url: string): Promise<any>;
    getSkillState(): SkillState;
    setSkillState(skillState : SkillState) : void;
    getSkillURL() : string;
    convertDataToMechQuirks(data: any, mechId: string) : MechQuirk[];
  }

  export var getSkillLoader = function (type: string): SkillLoader {
    if (type === KitlaanSkillLoader.type) {
      return new KitlaanSkillLoader();
    }
    throw Error("Unexpected skill type : " + type);
  }

  interface KitlaanURLComponents {
    urlPrefix: string,
    hash: string,
    state: string,
  }
  class KitlaanSkillLoader implements SkillLoader {
    private static readonly KITLAAN_PREFIX = "https://kitlaan.gitlab.io/mwoskill/archive/json/";
    private static readonly JSON_BIN_PREFIX = "https://jsonbin.io/b/";
    public static readonly type = "kitlaan";
    private state: string;

    constructor() {
      //nothing yet
    }

    private parseURL(url: string): KitlaanURLComponents {
      let matcher = /^https:\/\/kitlaan\.gitlab\.io\/mwoskill\/\?p=([^&]+).*$/
      let match = matcher.exec(url);
      if (!match) {
        return null;
      }
      let state = match[1];
      return this.parseState(state);
    }

    private parseState(state: string): KitlaanURLComponents {
      let urlPrefix = null;
      const JsonBinMarkerPrefix = "jsonbin1.";
      let hash;
      if (state.startsWith(JsonBinMarkerPrefix)) {
        hash = state.substring(JsonBinMarkerPrefix.length);
        urlPrefix = KitlaanSkillLoader.JSON_BIN_PREFIX;
      } else {
        hash = state;
        urlPrefix = KitlaanSkillLoader.KITLAAN_PREFIX;
      }
      return {
        urlPrefix, hash, state
      };
    }

    loadSkillsFromState(state: string): Promise<any> {
      let urlComponents = this.parseState(state);
      if (!urlComponents) {
        return null;
      }
      this.state = urlComponents.state;
      return this.createLoadPromise(urlComponents);
    }

    loadSkillsFromURL(url: string): Promise<any> {
      let urlComponents = this.parseURL(url);
      if (!urlComponents) {
        return null;
      }
      this.state = urlComponents.state;
      return this.createLoadPromise(urlComponents);
    }

    getSkillState(): SkillState {
      return {
        type: KitlaanSkillLoader.type,
        state: this.state,
      }
    }

    setSkillState(skillState : SkillState) {
      this.state = skillState.state;
    }

    getSkillURL() : string {
      if (this.state) {
        const urlPrefix = "https://kitlaan.gitlab.io/mwoskill/?p=";
        return urlPrefix + this.state;
      } else {
        return null;
      }
    }

    private createLoadPromise(urlComponents: KitlaanURLComponents) {
      return new Promise(function (resolve: (data: any) => any, reject: (data: any) => any) {
        $.ajax({
          url: urlComponents.urlPrefix + urlComponents.hash,
          type: 'GET',
          dataType: 'JSON'
        })
          .done(function (ajaxData: any) {
            resolve(ajaxData);
          })
          .catch(function (err: any) {
            reject(Error(err));
          })
      });
    }

    convertDataToMechQuirks(
      kitlaanData: ExternalSkillTrees.KitlaanSkillTree,
      mechId: string)
      : MechQuirk[] {
      let skillQuirks: MechModelQuirks.MechQuirkList = new MechModelQuirks.MechQuirkList();
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
          } else {
            Util.warn(Error("No quirks found for " + kitlaanName));
          }
        }
      }
      skillQuirks.sort(function (quirkA: MechQuirk, quirkB: MechQuirk): number {
        return quirkA.translated_name.localeCompare(quirkB.translated_name);
      });
      return skillQuirks;
    }
  }
}
