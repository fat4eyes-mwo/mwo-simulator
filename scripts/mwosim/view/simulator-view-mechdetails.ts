/// <reference path="simulator-view-widgets.ts" />

namespace MechViewMechDetails {
  type LoadFromURLDialog = MechViewWidgets.LoadFromURLDialog;
  type ClickHandler = MechViewWidgets.ClickHandler;

  export class MechDetails extends MechViewWidgets.DomStoredWidget
                          implements MechViewWidgets.RenderedWidget {
    private static readonly MechDetailsDomKey = "mwosim.MechDetails.uiObject";
    mechId : string;
    constructor(mechId : string) {
      let mechDetailsDiv = MechViewWidgets.cloneTemplate("mechDetails-template");
      super(mechDetailsDiv);
      this.storeToDom(MechDetails.MechDetailsDomKey);
      this.mechId = mechId;
    }

    render() : void {
      let mechDetailsJQ = $(this.domElement);
      let mechDetailsQuirks = new MechDetailsQuirks(this.mechId);
      mechDetailsQuirks.render();
      let MechDetailsQuirksTab = {
        tabTitle : new MechDetailsTabTitle("Quirks"),
        tabContent : new MechDetailsQuirks(this.mechId),
      };
      let MechDetailsSkillsTab = {
        tabTitle : new MechDetailsTabTitle("Skills"),
        tabContent : new MechDetailsSkills(this.mechId),
      };
      let mechDetailsTab = new MechViewWidgets.TabPanel(
                                [MechDetailsQuirksTab, MechDetailsSkillsTab]);
      mechDetailsJQ.find(".tabPanelContainer").append(mechDetailsTab.domElement);
      mechDetailsTab.render();
    }
  }

  class MechDetailsTabTitle extends MechViewWidgets.SimpleWidget {
    private title : string;
    constructor(title : string) {
      super("mechDetailsTabTitle-template");
      this.title = title;
    }

    render() {
      $(this.domElement).text(this.title);
    }
  }

  class MechDetailsQuirks extends MechViewWidgets.DomStoredWidget
                          implements MechViewWidgets.RenderedWidget {
    private static readonly MechDetailsQuirksDomKey = "mwosim.MechDetailsQuirks.uiObject";
    private mechId : string;

    constructor(mechId : string) {
      let mechDetailsQuirksDiv = MechViewWidgets.cloneTemplate("mechDetailsQuirks-template");
      super(mechDetailsQuirksDiv);
      this.storeToDom(MechDetailsQuirks.MechDetailsQuirksDomKey);
      this.mechId = mechId;
    }

    render() : void {
      let mechDetailsJQ = $(this.domElement);
      let mechQuirksJQ = mechDetailsJQ.find(".mechQuirkList");
      let mechQuirkList = MechModelView.getMechQuirks(this.mechId);

      
      let mechQuirkListPanel = new MechQuirkListPanel(mechQuirksJQ.get(0));
      mechQuirkListPanel.setQuirks(mechQuirkList);
      mechQuirkListPanel.render();
    }
  }

  class MechDetailsSkills extends MechViewWidgets.DomStoredWidget
                          implements MechViewWidgets.RenderedWidget {
    private static readonly MechDetailsSkillsDomKey = "mwosim.MechDetailsSkills.uiObject";
    mechId : string;
    loadButton : MechViewWidgets.Button;
    quirkListPanel : MechQuirkListPanel;
    constructor(mechId : string) {
      let domElement = MechViewWidgets.cloneTemplate("mechDetailsSkills-template");
      super(domElement);
      this.storeToDom(MechDetailsSkills.MechDetailsSkillsDomKey);
      this.mechId = mechId;

      let loadButtonJQ = $(this.domElement).find(".loadButton");
      this.loadButton = new MechViewWidgets.Button(loadButtonJQ.get(0), this.createLoadButtonHandler(this));

      let skillListJQ = $(this.domElement).find(".skillList");
      this.quirkListPanel = new MechQuirkListPanel(skillListJQ.get(0));
    }

    private createLoadButtonHandler(skillsPanel : MechDetailsSkills) : MechViewWidgets.ClickHandler {
      return function() : void {
        let loadSkillsDialog = new LoadMechSkillsDialog(skillsPanel);
        MechViewWidgets.setModal(loadSkillsDialog.domElement);

        MechSimulatorLogic.pauseSimulation();
        MechViewWidgets.showModal();
        $(loadSkillsDialog.getTextInput()).focus();
      }
    }

    setSkillQuirks(quirks : MechModelQuirks.MechQuirk[]) {
      this.quirkListPanel.setQuirks(quirks);
    }

    render() {
      let skillListJQ = $(this.domElement).find(".skillList");
      skillListJQ.empty();
      this.quirkListPanel.render();
    }
  }

  class LoadMechSkillsDialog extends MechViewWidgets.LoadFromURLDialog {
    private static readonly DialogId = "loadMechSkillsDialog";
    mechSkillsPanel : MechDetailsSkills;
    constructor(mechSkillsPanel : MechDetailsSkills) {
      super("loadFromURLDialog-loadSkills-template", LoadMechSkillsDialog.DialogId);
      this.mechSkillsPanel = mechSkillsPanel;

      let mechNameJQ = $(this.domElement).find(".mechName");
      let mechName = MechModelView.getMechName(mechSkillsPanel.mechId);
      mechNameJQ.text(mechName);
    }

    createOkButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function() {
        //TODO: Implement setting and updating UI for mech skills
        MechViewWidgets.hideModal();
      };
    }
    createCancelButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function() {
        MechViewWidgets.hideModal();
      }
    }
    createLoadButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function() {
        //TODO: Implement async request for skills
        let kitlaanLoader = new KitlaanSkillLoader();
        let url = dialog.getTextInputValue();
        let loadPromise = kitlaanLoader.loadSkillsFromURL(url);
        let resultJQ = $(dialog.getResultPanel());
        if (!loadPromise) {
          resultJQ
            .addClass("error")
            .text("Invalid kitlaan URL. Expected format is https://kitlaan.gitlab.io/mwoskill/?p=<skills>...");
          return;
        }
        resultJQ
          .removeClass("error")
          .text("Loading URL " + url);
        dialog.setLoading(true);
        loadPromise
        .then(function(data : any) {
          //
          let kitlaanData = data as SkillTreeData.KitlaanSkillTree;
          for (let category in kitlaanData.selected) {
            if (!kitlaanData.selected.hasOwnProperty(category)) {
              continue;
            }
            let kitlaanCategorySkills = kitlaanData.selected[category];
            for (let kitlaanSkill of kitlaanCategorySkills) {
              let kitlaanName = kitlaanSkill[0];
              let skillName = SkillTreeData._KitlaanSkillNameMap[kitlaanName];
              console.log(skillName);
            }
          }
          console.log("Loaded data from kitlaan: " + data);
        })
        .catch(function(err: any) {
          //
          console.error("Error loading kitlaan data: " + Error(err));
        })
        .then(function(data : any) {
          //
          dialog.setLoading(false);
          console.log("Kitlaan load done.");
        });
      }
    }
  }

  class MechQuirkListPanel extends MechViewWidgets.DomStoredWidget 
                        implements MechViewWidgets.RenderedWidget {
    static readonly MechQuirkListDomKey = "mwosim.MechQuirkListPanel.uiObject";
    private quirkList : MechModelQuirks.MechQuirk[] = [];
    constructor(domElement : Element) {
      super(domElement);
      this.storeToDom(MechQuirkListPanel.MechQuirkListDomKey);
    }

    setQuirks(skillQuirks : MechModelQuirks.MechQuirk[]) {
      this.quirkList = skillQuirks;
    }

    render() {
      let mechQuirksJQ = $(this.domElement);
      if (this.quirkList.length === 0) {
        let mechQuirkDiv = MechViewWidgets.cloneTemplate("mechDetailsQuirkRow-template");
        let mechQuirkJQ = $(mechQuirkDiv);
        mechQuirkJQ.find(".name").text("None");
        mechQuirksJQ.append(mechQuirkJQ);
      }

      for (let mechQuirk of this.quirkList) {
        let mechQuirkDiv = MechViewWidgets.cloneTemplate("mechDetailsQuirkRow-template");
        let mechQuirkJQ = $(mechQuirkDiv);
        mechQuirkJQ.find(".name").text(mechQuirk.translated_name);
        mechQuirkJQ.find(".value").text(mechQuirk.translated_value);
        if (mechQuirk.isBonus()) {
          mechQuirkJQ.addClass("bonus");
        } else {
          mechQuirkJQ.addClass("malus");
        }
        mechQuirksJQ.append(mechQuirkJQ);
      }
    }
  }

  interface KitlaanURLComponents {
    urlPrefix: string,
    hash: string
  }
  class KitlaanSkillLoader {
    private static readonly KITLAAN_PREFIX = "https://kitlaan.gitlab.io/mwoskill/archive/json/";
    private static readonly JSON_BIN_PREFIX = "https://jsonbin.io/b/";
    constructor() {
      //nothing yet
    }

    parseURL(url : string) : KitlaanURLComponents {
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

    loadSkillsFromURL(url : string) : Promise<any> {
      let urlComponents = this.parseURL(url);
      if (!urlComponents) {
        return null;
      }

      return new Promise(function(resolve : (data: any) => any, reject : (data: any) => any) {
        $.ajax({
        url : urlComponents.urlPrefix + urlComponents.hash,
        type : 'GET',
        dataType : 'JSON'
        })
        .done(function(ajaxData : any) {
          resolve(ajaxData);
        })
        .catch(function(err : any) {
          reject(Error(err));
        })
      });
    }
  }
}
