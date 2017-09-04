/// <reference path="../framework/widgets.ts" />

namespace MechViewMechDetails {
  type LoadFromURLDialog = Widgets.LoadFromURLDialog;
  type ClickHandler = Widgets.ClickHandler;
  type MechViewQuirk = MechModelView.MechViewQuirk;

  export class MechDetails extends Widgets.DomStoredWidget
                          implements Widgets.RenderedWidget {
    private static readonly MechDetailsDomKey = "mwosim.MechDetails.uiObject";
    mechId : string;
    constructor(mechId : string) {
      let mechDetailsDiv = Widgets.cloneTemplate("mechDetails-template");
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
      let mechDetailsTab = new Widgets.TabPanel(
                                [MechDetailsQuirksTab, MechDetailsSkillsTab]);
      mechDetailsJQ.find(".tabPanelContainer").append(mechDetailsTab.domElement);
      mechDetailsTab.render();
    }
  }

  class MechDetailsTabTitle extends Widgets.SimpleWidget {
    private title : string;
    constructor(title : string) {
      super("mechDetailsTabTitle-template");
      this.title = title;
    }

    render() {
      $(this.domElement).text(this.title);
    }
  }

  class MechDetailsQuirks extends Widgets.DomStoredWidget
                          implements Widgets.RenderedWidget {
    private static readonly MechDetailsQuirksDomKey = "mwosim.MechDetailsQuirks.uiObject";
    private mechId : string;

    constructor(mechId : string) {
      let mechDetailsQuirksDiv = Widgets.cloneTemplate("mechDetailsQuirks-template");
      super(mechDetailsQuirksDiv);
      this.storeToDom(MechDetailsQuirks.MechDetailsQuirksDomKey);
      this.mechId = mechId;
    }

    render() : void {
      let mechDetailsJQ = $(this.domElement);
      let mechQuirksJQ = mechDetailsJQ.find(".mechQuirkList");
      let mechQuirkList = MechModelView.getMechQuirks(this.mechId);

      
      let mechQuirkListPanel = new MechQuirkListPanel(mechQuirksJQ.get(0), this.mechId);
      mechQuirkListPanel.setQuirks(mechQuirkList);
      mechQuirkListPanel.render();
    }
  }

  class MechDetailsSkills extends Widgets.DomStoredWidget
                          implements Widgets.RenderedWidget {
    private static readonly MechDetailsSkillsDomKey = "mwosim.MechDetailsSkills.uiObject";
    mechId : string;
    loadButton : Widgets.Button;
    quirkListPanel : MechQuirkListPanel;
    constructor(mechId : string) {
      let domElement = Widgets.cloneTemplate("mechDetailsSkills-template");
      super(domElement);
      this.storeToDom(MechDetailsSkills.MechDetailsSkillsDomKey);
      this.mechId = mechId;

      let loadButtonJQ = $(this.domElement).find(".loadButton");
      this.loadButton = new Widgets.Button(loadButtonJQ.get(0), this.createLoadButtonHandler(this));

      let skillListJQ = $(this.domElement).find(".skillList");
      this.quirkListPanel = new MechQuirkListPanel(skillListJQ.get(0), this.mechId);
    }

    private createLoadButtonHandler(skillsPanel : MechDetailsSkills) : Widgets.ClickHandler {
      return function() : void {
        let loadSkillsDialog = new LoadMechSkillsDialog(skillsPanel);
        Widgets.setModal(loadSkillsDialog.domElement);

        MechSimulatorLogic.pauseSimulation();
        Widgets.showModal();
        $(loadSkillsDialog.getTextInput()).focus();
      }
    }

    render() {
      let thisJQ = $(this.domElement);
      let skillListJQ = thisJQ.find(".skillList");
      skillListJQ.empty();
      let skillState = MechModelView.getSkillState(this.mechId);
      let skillLinkJQ = thisJQ.find(".skillLink");
      if (skillState) {
        let skillLoader = MechModelSkills.getSkillLoader(skillState.type);
        skillLoader.setSkillState(skillState);
        skillLinkJQ.text("View skills").attr("href", skillLoader.getSkillURL());
        skillLinkJQ.append(Widgets.cloneTemplate("external-link-template"));
      } else {
        skillLinkJQ.text("").attr("href", "");
      }
      this.quirkListPanel.setQuirks(MechModelView.getMechSkillQuirks(this.mechId));
      this.quirkListPanel.render();
    }
  }

  class LoadMechSkillsDialog extends Widgets.LoadFromURLDialog {
    private static readonly DialogId = "loadMechSkillsDialog";
    mechId : string;
    mechSkillsPanel : MechDetailsSkills;
    skillListPanel : MechQuirkListPanel;
    loadedSkillQuirks : MechViewQuirk[];
    loadedSkillState : MechModelSkills.SkillState;
    constructor(mechSkillsPanel : MechDetailsSkills) {
      super("loadFromURLDialog-loadSkills-template", LoadMechSkillsDialog.DialogId);
      this.mechId = mechSkillsPanel.mechId;
      this.mechSkillsPanel = mechSkillsPanel;

      let mechNameJQ = $(this.domElement).find(".mechName");
      let mechName = MechModelView.getMechName(mechSkillsPanel.mechId);
      mechNameJQ.text(mechName);

      this.skillListPanel = new MechQuirkListPanel(this.getResultPanel(), this.mechId);
    }

    createOkButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function() {
        let loadDialog = dialog as LoadMechSkillsDialog;
        if (loadDialog.loadedSkillQuirks) {
          MechModelView.applySkillQuirks(loadDialog.mechId, loadDialog.loadedSkillQuirks);
          MechModelView.setSkillState(loadDialog.mechId, loadDialog.loadedSkillState);
          loadDialog.mechSkillsPanel.render();
          MechViewRouter.modifyAppState();
        } else {
          Util.warn("No loaded skill quirks");
        }
        Widgets.hideModal();
      };
    }
    createCancelButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function() {
        Widgets.hideModal();
      }
    }
    createLoadButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function() {
        let loadMechDialog = dialog as LoadMechSkillsDialog;
        let skillLoader = MechModelSkills.getSkillLoader("kitlaan");
        let url = dialog.getTextInputValue();
        let loadPromise = skillLoader.loadSkillsFromURL(url);
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
          let skillQuirks = skillLoader.convertDataToMechQuirks(kitlaanData, loadMechDialog.mechId);
          loadMechDialog.loadedSkillQuirks = skillQuirks;
          loadMechDialog.loadedSkillState = skillLoader.getSkillState();

          loadMechDialog.skillListPanel.setQuirks(skillQuirks);
          loadMechDialog.skillListPanel.render();
          loadMechDialog.okButton.enable();
          Util.log("Loaded data from kitlaan: " + data);
        })
        .catch(function(err: any) {
          Util.error("Error loading kitlaan data: " + Error(err));
          dialog.setError("Error loading kitlaan data: " + Error(err));
          dialog.okButton.disable();
        })
        .then(function(data : any) {
          dialog.setLoading(false);
          Util.log("Kitlaan load done.");
        });
      }
    }
  }

  class MechQuirkListPanel extends Widgets.DomStoredWidget 
                        implements Widgets.RenderedWidget {
    static readonly MechQuirkListDomKey = "mwosim.MechQuirkListPanel.uiObject";
    private quirkList : MechViewQuirk[] = [];
    mechId : string;
    constructor(domElement : Element, mechId : string) {
      super(domElement);
      this.storeToDom(MechQuirkListPanel.MechQuirkListDomKey);
      this.mechId = mechId;
    }

    setQuirks(quirkList : MechViewQuirk[]) {
      let thisPanel = this;
      this.quirkList = quirkList.slice();
      this.quirkList.sort(function(quirkA : MechViewQuirk, quirkB : MechViewQuirk) : number {
        let applicableQuirkA = MechModelView.isQuirkApplicable(thisPanel.mechId, quirkA) ? 0 : 1;
        let applicableQuirkB = MechModelView.isQuirkApplicable(thisPanel.mechId, quirkB) ? 0 : 1;
        if (applicableQuirkA !== applicableQuirkB) {
          return applicableQuirkA - applicableQuirkB;
        }
        return (quirkA.translated_name.localeCompare(quirkB.translated_name));
      });
    }

    render() {
      let mechQuirksJQ = $(this.domElement);
      mechQuirksJQ.empty();
      if (this.quirkList.length === 0) {
        let mechQuirkDiv = Widgets.cloneTemplate("mechDetailsQuirkRow-template");
        let mechQuirkJQ = $(mechQuirkDiv);
        mechQuirkJQ.find(".name").text("None");
        mechQuirksJQ.append(mechQuirkJQ);
      }

      for (let mechQuirk of this.quirkList) {
        let mechQuirkDiv = Widgets.cloneTemplate("mechDetailsQuirkRow-template");
        let mechQuirkJQ = $(mechQuirkDiv);
        mechQuirkJQ.find(".name").text(mechQuirk.translated_name);
        mechQuirkJQ.find(".value").text(mechQuirk.translated_value);
        if (MechModelView.isQuirkApplicable(this.mechId, mechQuirk)) {
          if (mechQuirk.isBonus()) {
            mechQuirkJQ.addClass("bonus");
          } else {
            mechQuirkJQ.addClass("malus");
          }
        } else {
          mechQuirkJQ.addClass("noeffect");
        }
        mechQuirksJQ.append(mechQuirkJQ);
      }
    }
  }
}
