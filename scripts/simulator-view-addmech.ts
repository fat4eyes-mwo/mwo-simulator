/// <reference path="simulator-model.ts" />
/// <reference path="simulator-view-widgets.ts" />
/// <reference path="simulator-view-mechPanel.ts" />
/// <reference path="simulator-smurfytypes.ts" />

"use strict";

namespace MechViewAddMech {
  type Team = MechModel.Team;
  type MechButton = MechViewWidgets.MechButton;
  type SmurfyMechLoadout = SmurfyTypes.SmurfyMechLoadout;

  var addMechButtonId = function(team : Team) : string {
    return team + "-addMechButton";
  }

  var addMechButtonMap : {[index:string] : MechButton} = {};
  export var createAddMechButton = function(team : Team, containerId : string) : void {
    let addMechButtonPanelId = addMechButtonId(team);
    if (!addMechButtonHandler) {
      addMechButtonHandler = createAddMechButtonHandler(this);
    }
    $("#" + containerId + " [class~=addMechButton]")
        .attr("id", addMechButtonPanelId)
        .attr("data-team", team);
    addMechButtonMap[team] =
        new MechViewWidgets.MechButton(addMechButtonPanelId,
                                        addMechButtonHandler);
  }

  type ClickHandler = () => void;
  var createAddMechButtonHandler = function(clickContext : any) : ClickHandler {
    var context = clickContext;
    return function() {
      let team = $(this).data('team');
      context.showAddMechDialog(team);
    }
  }
  var addMechButtonHandler : ClickHandler;//set on click handler assignment

  var addMechOKButton : MechButton;
  var addMechCancelButton : MechButton;
  var addMechLoadButton : MechButton;
  export var showAddMechDialog = function(team : Team) : void {
    //TODO: this code possibly accumulates handlers on the dialog buttons
    //due to the use of ids in the template. See what can be done.
    let addMechDialogDiv =
        MechViewWidgets.cloneTemplate("addMechDialog-template");
    $(addMechDialogDiv)
      .attr("id", "addMechDialogContainer")
      .addClass(team);
    MechViewWidgets.setModal(addMechDialogDiv, "addMech");

    let resultPanelJQ = $("#addMechDialog-result");
    resultPanelJQ
          .removeClass("error")
          .empty()
          .on("animationend", function(data) {
            resultPanelJQ.removeClass("error");
          });

    if (!addMechDialog_OK_Handler) {
      addMechDialog_OK_Handler = createAddMechDialog_OK(this);
    }
    if (!addMechDialog_Cancel_Handler) {
      addMechDialog_Cancel_Handler = createAddMechDialog_Cancel(this);
    }
    if (!addMechDialog_Load_Handler) {
      addMechDialog_Load_Handler = createAddMechDialog_Load(this);
    }
    $("#addMechDialog-ok").attr("data-team", team);
    addMechOKButton =
        new MechViewWidgets.MechButton("addMechDialog-ok", addMechDialog_OK_Handler);
    $("#addMechDialog-cancel").attr("data-team", team);
    addMechCancelButton =
        new MechViewWidgets.MechButton("addMechDialog-cancel", addMechDialog_Cancel_Handler);
    $("#addMechDialog-load").attr("data-team", team);
    addMechLoadButton =
        new MechViewWidgets.MechButton("addMechDialog-load", addMechDialog_Load_Handler);

    addMechOKButton.disable();

    MechViewWidgets.showModal();

    $("#addMechDialog-text").focus();
  }

  export var hideAddMechDialog = function(team : Team) : void {
    MechViewWidgets.hideModal("addMech");
  }

  var loadedSmurfyLoadout : SmurfyMechLoadout = null;
  var createAddMechDialog_OK = function(context : any) : ClickHandler {
    var clickContext = context;
    return function() {
      let team = $(this).data('team');
      let url = $("#addMechDialog-text").val()
      console.log("Mech loaded. team: " + team + " URL: " + url);
      //TODO: Avoid accessing MechModel directly here. Create a method in ModelView to do this
      let smurfyMechLoadout = loadedSmurfyLoadout;
      let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
      let mechTranslatedName = smurfyMechData.translated_name;
      let mechName = smurfyMechData.name;
      let newMechId = MechModel.generateMechId(loadedSmurfyLoadout);
      let newMech = MechModel.addMech(newMechId, team, smurfyMechLoadout);
      //set patterns of added mech to selected team patterns
      MechViewTeamStats.setSelectedTeamPatterns(team);
      MechViewRouter.modifyAppState();
      MechViewMechPanel.addMechPanel(newMech, team);
      MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
      clickContext.hideAddMechDialog(team);
    }
  };
  var addMechDialog_OK_Handler : ClickHandler; //set on dialog creation, singleton

  var createAddMechDialog_Cancel = function(context : any) : ClickHandler {
    var clickContext = context;
    return function() {
      let team = $(this).data('team');
      clickContext.hideAddMechDialog(team);
    }
  };
  var addMechDialog_Cancel_Handler : ClickHandler; //set on dialog creation, singleton

  const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
  var createAddMechDialog_Load = function(context : any) : ClickHandler {
    var clickContext = context;

    return function() {
      let team = $(this).data('team');
      let url : string = String($("#addMechDialog-text").val());
      console.log("Load. team: " + team + " URL: " + url);

      let doneHandler = function(data : any) {
        loadedSmurfyLoadout = data;
        let smurfyMechData = MechModel.getSmurfyMechData(loadedSmurfyLoadout.mech_id);
        let mechTranslatedName = smurfyMechData.translated_name;
        let mechName = smurfyMechData.name;
        $("#addMechDialog-result")
              .removeClass("error")
              .empty();
        createLoadedMechPanel("addMechDialog-result", loadedSmurfyLoadout);
        addMechOKButton.enable();
      };
      let failHandler = function() {
        $("#addMechDialog-result")
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
        $("#addMechDialog-result")
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
        $("#addMechDialog-result")
            .addClass("error")
            .html("Invalid smurfy URL. Expected format is 'http://mwo.smurfy-net.de/mechlab#i=mechid&l=loadoutid'");
        addMechLoadButton.enable();
        addMechLoadButton.removeClass("loading");
        addMechLoadButton.setHtml("Load");
        console.error("Invalid smurfy url");
      }
    }
  }
  var addMechDialog_Load_Handler : ClickHandler; //set on dialog creation, singleton

  let SMURFY_BASE_URL = "http://mwo.smurfy-net.de/mechlab#";
  var createLoadedMechPanel =
      function(containerId : string,
              smurfyMechLoadout : SmurfyMechLoadout)
              : void {
    let loadedMechDiv = MechViewWidgets.cloneTemplate("loadedMech-template");
    let loadedMechJQ =$(loadedMechDiv)
                            .removeAttr("id")
                            .appendTo("#" + containerId);
    let smurfyMechId = smurfyMechLoadout.mech_id;
    let smurfyLoadoutId = smurfyMechLoadout.id;

    //Mech name and link
    let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechId);
    let mechLinkJQ = $("<a></a>")
                          .attr("href", SMURFY_BASE_URL + "i=" + smurfyMechId + "&l=" + smurfyLoadoutId)
                          .attr("target", "_blank")
                          .attr("rel", "noopener")
                          .text(smurfyMechData.translated_name);
    loadedMechJQ.find("[class~=mechName]")
                .append(mechLinkJQ);

    let mechStats = smurfyMechLoadout.stats;
    //Mech equipment
    let mechSpeed : string = Number(mechStats.top_speed).toFixed(1) + "km/h";
    let mechEngine : string = mechStats.engine_type + " " + mechStats.engine_rating;
    let heatsink : string = mechStats.heatsinks + " HS";
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
      function(name : string, number : number, type : string) : JQuery {
    let numberClass = loadedMechWeaponClass(type);
    let weaponSpan = MechViewWidgets.cloneTemplate("loadedMechWeapon-template");
    let ret = $(weaponSpan);
    ret.find(".weaponName")
      .text(name);
    ret.find(".count")
      .addClass(numberClass)
      .text(number);
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