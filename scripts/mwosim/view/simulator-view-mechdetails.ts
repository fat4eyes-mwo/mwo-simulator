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

      if (mechQuirkList.length === 0) {
        let mechQuirkDiv = MechViewWidgets.cloneTemplate("mechDetailsQuirkRow-template");
        let mechQuirkJQ = $(mechQuirkDiv);
        mechQuirkJQ.find(".name").text("None");
        mechQuirksJQ.append(mechQuirkJQ);
      }

      for (let mechQuirk of mechQuirkList) {
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

  class MechDetailsSkills extends MechViewWidgets.DomStoredWidget
                          implements MechViewWidgets.RenderedWidget {
    private static readonly MechDetailsSkillsDomKey = "mwosim.MechDetailsSkills.uiObject";
    mechId : string;
    loadButton : MechViewWidgets.Button;
    constructor(mechId : string) {
      let domElement = MechViewWidgets.cloneTemplate("mechDetailsSkills-template");
      super(domElement);
      this.storeToDom(MechDetailsSkills.MechDetailsSkillsDomKey);
      this.mechId = mechId;

      let loadButtonJQ = $(this.domElement).find(".loadButton");
      this.loadButton = new MechViewWidgets.Button(loadButtonJQ.get(0), this.createLoadButtonHandler(this));
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
      //TODO: Fill list of mech skills
      skillListJQ.text("Skills go here");
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
      }
    }
  }
}
