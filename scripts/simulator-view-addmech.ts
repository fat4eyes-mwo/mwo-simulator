/// <reference path="common/simulator-model-common.ts" />
/// <reference path="simulator-view-widgets.ts" />
/// <reference path="simulator-view-mechPanel.ts" />
/// <reference path="simulator-smurfytypes.ts" />

"use strict";

namespace MechViewAddMech {
  import Team = MechModelCommon.Team;

  type MechButton = MechViewWidgets.MechButton;
  type SmurfyMechLoadout = SmurfyTypes.SmurfyMechLoadout;

  var addMechButtonId = function(team : Team) : string {
    return team + "-addMechButton";
  }

  var addMechButtonMap : {[index:string] : MechButton} = {};
  export var createAddMechButton = function(team : Team, containerId : string) : void {
    let addMechButtonPanelId = addMechButtonId(team);
    if (!addMechButtonHandler) {
      addMechButtonHandler = createAddMechButtonHandler();
    }
    let addMechButtonJQ = $(`#${containerId} [class~=addMechButton]`)
                                  .attr("id", addMechButtonPanelId)
                                  .attr("data-team", team);
    addMechButtonMap[team] =
        new MechViewWidgets.MechButton(addMechButtonJQ[0],
                                        addMechButtonHandler);
  }

  type ClickHandler = () => void;
  var createAddMechButtonHandler = function() : ClickHandler {
    return function(this : Element) {
      let team = $(this).data('team');
      MechViewAddMech.showAddMechDialog(team);
    }
  }
  var addMechButtonHandler : ClickHandler;//set on click handler assignment

  var addMechOKButton : MechButton;
  var addMechCancelButton : MechButton;
  var addMechLoadButton : MechButton;
  var addMechDialogJQ : JQuery;
  export var showAddMechDialog = function(team : Team) : void {
    let addMechDialogDiv =
        MechViewWidgets.cloneTemplate("addMechDialog-template");
    addMechDialogJQ = $(addMechDialogDiv)
                              .attr("id", "addMechDialogContainer")
                              .addClass(team);
    MechViewWidgets.setModal(addMechDialogDiv, "addMech");

    let resultPanelJQ = addMechDialogJQ.find(".addMechDialog-result");
    resultPanelJQ
          .removeClass("error")
          .empty()
          .on("animationend", function(data) {
            resultPanelJQ.removeClass("error");
          });

    if (!addMechDialogOKHandler) {
      addMechDialogOKHandler = createAddMechDialogOKHandler();
    }
    if (!addMechDialogCancelHandler) {
      addMechDialogCancelHandler = createAddMechDialogCancelHandler();
    }
    if (!addMechDialogLoadHandler) {
      addMechDialogLoadHandler = createAddMechDialogLoadHandler();
    }
    let okButtonJQ = addMechDialogJQ.find(".addMechDialog-ok").attr("data-team", team);
    addMechOKButton =
        new MechViewWidgets.MechButton(okButtonJQ[0], addMechDialogOKHandler);

    let cancelButtonJQ = addMechDialogJQ.find(".addMechDialog-cancel").attr("data-team", team);
    addMechCancelButton =
        new MechViewWidgets.MechButton(cancelButtonJQ[0], addMechDialogCancelHandler);

    let loadButtonJQ = addMechDialogJQ.find(".addMechDialog-load").attr("data-team", team);
    addMechLoadButton =
        new MechViewWidgets.MechButton(loadButtonJQ[0], addMechDialogLoadHandler);

    addMechOKButton.disable();

    MechViewWidgets.showModal();

    addMechDialogJQ.find(".addMechDialog-text").focus();
  }

  export var hideAddMechDialog = function(team : Team) : void {
    MechViewWidgets.hideModal("addMech");
    addMechDialogJQ = undefined;
  }

  var loadedSmurfyLoadout : SmurfyMechLoadout = null;
  var createAddMechDialogOKHandler = function() : ClickHandler {
    return function(this : Element) {
      let team = $(this).data('team');
      let url = addMechDialogJQ.find(".addMechDialog-text").val()
      console.log("Mech loaded. team: " + team + " URL: " + url);
      //TODO: Avoid accessing MechModel directly here. Create a method in ModelView to do this
      let smurfyMechLoadout = loadedSmurfyLoadout;
      let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
      let mechTranslatedName = smurfyMechData.translated_name;
      let mechName = smurfyMechData.name;
      let newMech = MechModelView.addMech(team, smurfyMechLoadout);
      //set patterns of added mech to selected team patterns
      MechViewTeamStats.setSelectedTeamPatterns(team);
      MechViewRouter.modifyAppState();
      MechViewMechPanel.addMechPanel(newMech, team);
      MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
      MechViewAddMech.hideAddMechDialog(team);
    }
  };
  var addMechDialogOKHandler : ClickHandler; //set on dialog creation, singleton

  var createAddMechDialogCancelHandler = function() : ClickHandler {
    return function(this : Element) {
      let team = $(this).data('team');
      MechViewAddMech.hideAddMechDialog(team);
    }
  };
  var addMechDialogCancelHandler : ClickHandler; //set on dialog creation, singleton

  const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
  var createAddMechDialogLoadHandler = function() : ClickHandler {

    return function(this : Element) {
      let team = $(this).data('team');
      let url : string = String(addMechDialogJQ.find(".addMechDialog-text").val());
      console.log("Load. team: " + team + " URL: " + url);

      let doneHandler = function(data : any) {
        loadedSmurfyLoadout = data;
        let smurfyMechData = MechModel.getSmurfyMechData(loadedSmurfyLoadout.mech_id);
        let mechTranslatedName = smurfyMechData.translated_name;
        let mechName = smurfyMechData.name;
        let resultJQ = addMechDialogJQ.find(".addMechDialog-result")
                                      .removeClass("error")
                                      .empty();
        createLoadedMechPanel(resultJQ[0], loadedSmurfyLoadout);
        addMechOKButton.enable();
      };
      let failHandler = function() {
        addMechDialogJQ.find(".addMechDialog-result")
              .addClass("error")
              .html("Failed to load " + url);
      };
      let alwaysHandler = function() {
        addMechLoadButton.enable();
        addMechLoadButton.removeClass("loading");
        addMechLoadButton.setHtml("Load");
      };
      let loadMechPromise = MechModel.loadSmurfyMechLoadoutFromURL(url);
      if (loadMechPromise) {
        addMechDialogJQ.find(".addMechDialog-result")
              .removeClass("error")
              .html("Loading url : " + url);
        addMechLoadButton.disable();
        addMechLoadButton.addClass("loading");
        addMechLoadButton.setHtml("Loading...");
          loadMechPromise
            .then(doneHandler)
            .catch(failHandler)
            .then(alwaysHandler);
      } else {
        addMechDialogJQ.find(".addMechDialog-result")
            .addClass("error")
            .html("Invalid smurfy URL. Expected format is 'http://mwo.smurfy-net.de/mechlab#i=mechid&l=loadoutid'");
        addMechLoadButton.enable();
        addMechLoadButton.removeClass("loading");
        addMechLoadButton.setHtml("Load");
        console.error("Invalid smurfy url");
      }
    }
  }
  var addMechDialogLoadHandler : ClickHandler; //set on dialog creation, singleton

  let SMURFY_BASE_URL = "http://mwo.smurfy-net.de/mechlab#";
  var createLoadedMechPanel =
      function(containerElem : Element,
              smurfyMechLoadout : SmurfyMechLoadout)
              : void {
    let loadedMechDiv = MechViewWidgets.cloneTemplate("loadedMech-template");
    let loadedMechJQ =$(loadedMechDiv)
                            .removeAttr("id")
                            .appendTo(containerElem);
    let smurfyMechId = smurfyMechLoadout.mech_id;
    let smurfyLoadoutId = smurfyMechLoadout.id;

    //Mech name and link
    let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechId);
    let mechLinkJQ = $("<a></a>")
                          .attr("href", `${SMURFY_BASE_URL}i=${smurfyMechId}&l=${smurfyLoadoutId}`)
                          .attr("target", "_blank")
                          .attr("rel", "noopener")
                          .text(smurfyMechData.translated_name);
    loadedMechJQ.find("[class~=mechName]")
                .append(mechLinkJQ);

    let mechStats = smurfyMechLoadout.stats;
    //Mech equipment
    let mechSpeed : string = `${Number(mechStats.top_speed).toFixed(1)} km/h`;
    let mechEngine : string = `${mechStats.engine_type} ${mechStats.engine_rating}`;
    let heatsink : string = `${mechStats.heatsinks} HS`;
    loadedMechJQ
        .find("[class~=mechEquipment]")
        .append(loadedMechSpan(mechSpeed, "equipment"))
        .append(loadedMechSpan(mechEngine, "equipment"))
        .append(loadedMechSpan(heatsink, "equipment"));

    //Mech armament
    for (let weapon of smurfyMechLoadout.stats.armaments) {
      let smurfyWeaponData = MechModel.getSmurfyWeaponData(weapon.id);
      let weaponType = smurfyWeaponData.type;
      loadedMechJQ
        .find("[class~=mechArmament]")
        .append(loadedMechWeaponSpan(weapon.name, weapon.count, weaponType));
    }
  }

  var loadedMechSpan = function(text : string, spanClass : string) : JQuery {
    let span = MechViewWidgets.cloneTemplate("loadedMechInfo-template");
    return $(span)
      .addClass(spanClass)
      .text(text);
  }

  var loadedMechWeaponSpan =
      function(name : string, count : number, type : string) : JQuery {
    let numberClass = loadedMechWeaponClass(type);
    let weaponSpan = MechViewWidgets.cloneTemplate("loadedMechWeapon-template");
    let ret = $(weaponSpan);
    ret.find(".weaponName")
      .text(name);
    ret.find(".count")
      .addClass(numberClass)
      .text(count);
    return ret;
  }

  var loadedMechWeaponClass = function(smurfyType : string) : string {
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
