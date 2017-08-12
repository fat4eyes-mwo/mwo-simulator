/// <reference path="simulator-view-widgets.ts" />

namespace MechViewMechDetails {
  type LoadFromURLDialog = MechViewWidgets.LoadFromURLDialog;
  type ClickHandler = MechViewWidgets.ClickHandler;
  type MechQuirk = MechModelQuirks.MechQuirk;

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

    render() {
      let skillListJQ = $(this.domElement).find(".skillList");
      skillListJQ.empty();
      this.quirkListPanel.setQuirks(MechModelView.getMechSkillQuirks(this.mechId));
      this.quirkListPanel.render();
    }
  }

  class LoadMechSkillsDialog extends MechViewWidgets.LoadFromURLDialog {
    private static readonly DialogId = "loadMechSkillsDialog";
    mechId : string;
    mechSkillsPanel : MechDetailsSkills;
    skillListPanel : MechQuirkListPanel;
    loadedSkillQuirks : MechQuirk[];
    constructor(mechSkillsPanel : MechDetailsSkills) {
      super("loadFromURLDialog-loadSkills-template", LoadMechSkillsDialog.DialogId);
      this.mechId = mechSkillsPanel.mechId;
      this.mechSkillsPanel = mechSkillsPanel;

      let mechNameJQ = $(this.domElement).find(".mechName");
      let mechName = MechModelView.getMechName(mechSkillsPanel.mechId);
      mechNameJQ.text(mechName);

      this.skillListPanel = new MechQuirkListPanel(this.getResultPanel());
    }

    createOkButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function() {
        //TODO: Implement setting and updating UI for mech skills
        let loadDialog = dialog as LoadMechSkillsDialog;
        if (loadDialog.loadedSkillQuirks) {
          MechModelView.applySkillQuirks(loadDialog.mechId, loadDialog.loadedSkillQuirks);
          loadDialog.mechSkillsPanel.render();
          MechViewRouter.modifyAppState();
        } else {
          console.warn("No loaded skill quirks");
        }
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
        let loadMechDialog = dialog as LoadMechSkillsDialog;
        let kitlaanLoader = new MechModelSkills.KitlaanSkillLoader();
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
          let kitlaanData = data as ExternalSkillTrees.KitlaanSkillTree;
          let skillQuirks = loadMechDialog.convertKitlaanDataToMechQuirks(kitlaanData);
          loadMechDialog.loadedSkillQuirks = skillQuirks;

          loadMechDialog.skillListPanel.setQuirks(skillQuirks);
          loadMechDialog.skillListPanel.render();
          loadMechDialog.okButton.enable();
          console.log("Loaded data from kitlaan: " + data);
        })
        .catch(function(err: any) {
          console.error("Error loading kitlaan data: " + Error(err));
          dialog.setError("Error loading kitlaan data: " + Error(err));
          dialog.okButton.disable();
        })
        .then(function(data : any) {
          dialog.setLoading(false);
          console.log("Kitlaan load done.");
        });
      }
    }

    private convertKitlaanDataToMechQuirks(
          kitlaanData: ExternalSkillTrees.KitlaanSkillTree)
          : MechModelQuirks.MechQuirkList {
      let skillQuirks: MechModelQuirks.MechQuirkList = new MechModelQuirks.MechQuirkList();
      for (let category in kitlaanData.selected) {
        if (!kitlaanData.selected.hasOwnProperty(category)) {
          continue;
        }
        let kitlaanCategorySkills = kitlaanData.selected[category];

        for (let kitlaanSkill of kitlaanCategorySkills) {
          let kitlaanName = kitlaanSkill[0];
          let skillName = ExternalSkillTrees._KitlaanSkillNameMap[kitlaanName];
          let mechQuirks = MechModelView.convertSkillToMechQuirks(skillName,
            this.mechId);
          if (mechQuirks) {
            skillQuirks.addQuirkList(mechQuirks);
          } else {
            console.warn(Error("No quirks found for " + kitlaanName));
          }
        }
      }
      skillQuirks.sort(function (quirkA: MechQuirk, quirkB: MechQuirk): number {
        return quirkA.translated_name.localeCompare(quirkB.translated_name);
      });
      return skillQuirks;
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
      mechQuirksJQ.empty();
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
}
