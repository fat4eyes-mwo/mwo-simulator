/// <reference path="simulator-view-widgets.ts" />
"use strict";

namespace MechViewAddMech {
  import Team = MechModelCommon.Team;
  import EventType = MechModelCommon.EventType;
  import LoadFromURLDialog = MechViewWidgets.LoadFromURLDialog;

  type SmurfyMechLoadout = SmurfyTypes.SmurfyMechLoadout;
  type ClickHandler = MechViewWidgets.ClickHandler;

  export var init = function() {
    MWOSimEvents.getEventQueue().addListener(simStateListener, 
                                          EventType.START, EventType.PAUSE);
  }

  var simStateListener = function(event : MechSimulatorLogic.SimulatorStateUpdate) {
    if (event.type === EventType.START) {
      let addMechButtonsJQ = $(".addMechButton");
      MechViewWidgets.setButtonListEnabled(addMechButtonsJQ, false);
    } else if (event.type === EventType.PAUSE) {
      let addMechButtonsJQ = $(".addMechButton");
      MechViewWidgets.setButtonListEnabled(addMechButtonsJQ, true);
    }
  }

  export class AddMechButton extends MechViewWidgets.Button {
    static readonly AddMechButtonDomKey = "mwosim.AddMechButton.uiObject";
    private static addMechButtonHandler : ClickHandler;
    constructor(team: Team, container: Element) {
      let addMechButtonPanelId = AddMechButton.addMechButtonId(team);
      if (!AddMechButton.addMechButtonHandler) {
        AddMechButton.addMechButtonHandler = AddMechButton.createAddMechButtonHandler();
      }

      let addMechButtonJQ = $(container).find(" [class~=addMechButton]")
        .attr("id", addMechButtonPanelId)
        .attr("data-team", team);
      let addMechButtonElem = addMechButtonJQ.get(0);
      super(addMechButtonElem, AddMechButton.addMechButtonHandler);
      this.storeToDom(AddMechButton.AddMechButtonDomKey);
    }

    private static addMechButtonId(team: Team): string {
      return team + "-addMechButton";
    }

    private static createAddMechButtonHandler(): ClickHandler {
      return function (this: Element) {
        let team = $(this).attr('data-team');
        MechViewAddMech.showAddMechDialog(team);
      }
    }
  }

  export class AddMechDialog extends LoadFromURLDialog {
    static readonly AddMechDialogDomKey = "mwosim.AddMechDialog.uiObject";
    private static readonly AddMechDialogId = "addMechDialogContainer";

    constructor(team : Team) {
      super("loadFromURLDialog-addMech-template", AddMechDialog.AddMechDialogId);
      this.storeToDom(AddMechDialog.AddMechDialogDomKey);
      let thisJQ = $(this.domElement).addClass(team);
      $(this.okButton.domElement).attr("data-team", team);
      $(this.cancelButton.domElement).attr("data-team", team);
      $(this.loadButton.domElement).attr("data-team", team);
    }

    loadedSmurfyLoadout: SmurfyMechLoadout = null;
    createOkButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function (this: Element) {
        let thisJQ = $(this);
        let team = thisJQ.attr('data-team');
        let url = dialog.getTextInputValue();
        console.log("Mech loaded. team: " + team + " URL: " + url);
        let smurfyMechLoadout = (dialog as AddMechDialog).loadedSmurfyLoadout;
        let newMech = MechModelView.addMech(team, smurfyMechLoadout);
        //set patterns of added mech to selected team patterns
        MechViewTeamStats.setSelectedTeamPatterns(team);
        MechViewRouter.modifyAppState();
        MechView.addMechPanel(newMech, team);
        MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
        MechViewAddMech.hideAddMechDialog(team);
      }
    };

    createCancelButtonHandler(dialog: LoadFromURLDialog): ClickHandler {
      return function (this: Element) {
        let team = $(this).attr('data-team');
        MechViewAddMech.hideAddMechDialog(team);
      }
    };

    private static readonly SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
    createLoadButtonHandler(dialog: LoadFromURLDialog): ClickHandler {

      return function (this: Element) {
        let thisJQ = $(this);
        let team = thisJQ.attr('data-team');
        let addMechDialogJQ = $(dialog.domElement);
        let url: string = dialog.getTextInputValue();
        console.log("Load. team: " + team + " URL: " + url);

        let doneHandler = function (data: any) {
          (dialog as AddMechDialog).loadedSmurfyLoadout = data;
          dialog.clearError();
          $(dialog.getResultPanel()).empty();
          let loadedMechPanel = new LoadedMechPanel(
                                        dialog.getResultPanel(), 
                                        (dialog as AddMechDialog).loadedSmurfyLoadout);
          dialog.okButton.enable();
        };
        let failHandler = function () {
          dialog.setError("Failed to load " + url);
        };
        let alwaysHandler = function () {
          dialog.setLoading(false);
        };
        let loadMechPromise = MechModel.loadSmurfyMechLoadoutFromURL(url);
        if (loadMechPromise) {
          dialog.clearError();
          $(dialog.getResultPanel())
            .text("Loading url : " + url);
          dialog.setLoading(true);
          loadMechPromise
            .then(doneHandler)
            .catch(failHandler)
            .then(alwaysHandler);
        } else {
          dialog
            .setError("Invalid smurfy URL. Expected format is 'http://mwo.smurfy-net.de/mechlab#i=mechid&l=loadoutid'");
          dialog.setLoading(false);
          console.error("Invalid smurfy url");
        }
      }
    }
  }

  class LoadedMechPanel {
    private static readonly SMURFY_BASE_URL = "http://mwo.smurfy-net.de/mechlab#";
    constructor(containerElem: Element,
              smurfyMechLoadout: SmurfyMechLoadout) {
      let loadedMechDiv = MechViewWidgets.cloneTemplate("loadedMech-template");
      let loadedMechJQ = $(loadedMechDiv)
        .removeAttr("id")
        .appendTo(containerElem);
      let smurfyMechId = smurfyMechLoadout.mech_id;
      let smurfyLoadoutId = smurfyMechLoadout.id;

      //Mech name and link
      let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechId);
      let mechLinkJQ = $("<a></a>")
        .attr("href", `${LoadedMechPanel.SMURFY_BASE_URL}i=${smurfyMechId}&l=${smurfyLoadoutId}`)
        .attr("target", "_blank")
        .attr("rel", "noopener")
        .text(smurfyMechData.translated_name);
      loadedMechJQ.find("[class~=mechName]")
        .append(mechLinkJQ);

      let mechStats = smurfyMechLoadout.stats;
      //Mech equipment
      let mechSpeed: string = `${Number(mechStats.top_speed).toFixed(1)} km/h`;
      let mechEngine: string = `${mechStats.engine_type} ${mechStats.engine_rating}`;
      let heatsink: string = `${mechStats.heatsinks} HS`;
      loadedMechJQ
        .find("[class~=mechEquipment]")
        .append(this.loadedMechSpan(mechSpeed, "equipment"))
        .append(this.loadedMechSpan(mechEngine, "equipment"))
        .append(this.loadedMechSpan(heatsink, "equipment"));

      //Mech armament
      for (let weapon of smurfyMechLoadout.stats.armaments) {
        let smurfyWeaponData = MechModel.getSmurfyWeaponData(weapon.id);
        let weaponType = smurfyWeaponData.type;
        loadedMechJQ
          .find("[class~=mechArmament]")
          .append(this.loadedMechWeaponSpan(weapon.name, weapon.count, weaponType));
      }
    }

    private loadedMechSpan(text: string, spanClass: string): JQuery {
      let span = MechViewWidgets.cloneTemplate("loadedMechInfo-template");
      return $(span)
        .addClass(spanClass)
        .text(text);
    }

    private loadedMechWeaponSpan(name: string, count: number, type: string): JQuery {
      let numberClass = this.loadedMechWeaponClass(type);
      let weaponSpan = MechViewWidgets.cloneTemplate("loadedMechWeapon-template");
      let ret = $(weaponSpan);
      ret.find(".weaponName")
        .text(name);
      ret.find(".count")
        .addClass(numberClass)
        .text(count);
      return ret;
    }

    private loadedMechWeaponClass(smurfyType: string): string {
      if (smurfyType === "BALLISTIC") {
        return "ballistic";
      } else if (smurfyType === "BEAM") {
        return "beam";
      } else if (smurfyType === "MISSLE") {//sic
        return "missile";
      } else if (smurfyType === "AMS") {
        return "ams";
      } else {
        console.warn("Unexpected weapon type: " + smurfyType);
        return "";
      }
    }
  }

  export var showAddMechDialog = function (team: Team): void {
    let addMechDialog = new AddMechDialog(team);
    MechViewWidgets.setModal(addMechDialog.domElement, "addMech");

    MechViewWidgets.showModal();

    $(addMechDialog.getTextInput()).focus();
  }

  export var hideAddMechDialog = function (team: Team): void {
    MechViewWidgets.hideModal("addMech");
  }

}
