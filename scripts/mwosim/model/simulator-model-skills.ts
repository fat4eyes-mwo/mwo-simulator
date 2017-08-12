namespace MechModelSkills {
  export interface KitlaanURLComponents {
    urlPrefix: string,
    hash: string
  }
  export class KitlaanSkillLoader {
    private static readonly KITLAAN_PREFIX = "https://kitlaan.gitlab.io/mwoskill/archive/json/";
    private static readonly JSON_BIN_PREFIX = "https://jsonbin.io/b/";
    constructor() {
      //nothing yet
    }

    parseURL(url: string): KitlaanURLComponents {
      let matcher = /^https:\/\/kitlaan\.gitlab\.io\/mwoskill\/\?p=([^&]+).*$/
      let match = matcher.exec(url);
      if (!match) {
        return null;
      }
      let urlPrefix = null;
      let hash = match[1];
      const JsonBinMarkerPrefix = "jsonbin1.";
      if (hash.startsWith(JsonBinMarkerPrefix)) {
        hash = hash.substring(JsonBinMarkerPrefix.length);
        urlPrefix = KitlaanSkillLoader.JSON_BIN_PREFIX;
      } else {
        urlPrefix = KitlaanSkillLoader.KITLAAN_PREFIX;
      }
      return {
        urlPrefix, hash
      };
    }

    loadSkillsFromURL(url: string): Promise<any> {
      let urlComponents = this.parseURL(url);
      if (!urlComponents) {
        return null;
      }

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
  }
}
