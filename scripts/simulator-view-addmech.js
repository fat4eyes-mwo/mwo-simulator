
"use strict";

var MechViewAddMech = MechViewAddMech || (function() {

  var addMechButtonId = function(team) {
    return team + "-addMechButton";
  }

  var addMechButtonMap = {};
  var createAddMechButton = function(team, containerId) {
    let addMechButtonPanelId = addMechButtonId(team);
    if (!addMechButtonHandler) {
      addMechButtonHandler = new AddMechButtonHandler(this);
    }
    $("#" + containerId + " [class~=addMechButton]")
        .attr("id", addMechButtonPanelId)
        .attr("data-team", team);
    addMechButtonMap[team] = new MechViewWidgets.MechButton(addMechButtonPanelId, addMechButtonHandler);
  }

  var AddMechButtonHandler = function(clickContext) {
    var context = clickContext;
    return function() {
      let team = $(this).data('team');
      context.showAddMechDialog(team);
    }
  }
  var addMechButtonHandler;//set on click handler assignment

  var addMechOKButton;
  var addMechCancelButton;
  var addMechLoadButton;
  var showAddMechDialog = function(team) {
    //TODO: this code possibly accumulates handlers on the dialog buttons
    //due to the use of ids in the template. See what can be done.
    $("#" + MechView.MODAL_DIALOG_ID)
      .empty()
      .addClass("addmech");
    let addMechDialogDiv =
        MechViewWidgets.cloneTemplate("addMechDialog-template");
    $(addMechDialogDiv)
      .attr("id", "addMechDialogContainer")
      .addClass(team)
      .appendTo("#" + MechView.MODAL_DIALOG_ID);

    $("#addMechDialog-result")
          .removeClass("error")
          .empty();

    if (!addMechDialog_OK_Handler) {
      addMechDialog_OK_Handler = new AddMechDialog_OK(this);
    }
    if (!addMechDialog_Cancel_Handler) {
      addMechDialog_Cancel_Handler = new AddMechDialog_Cancel(this);
    }
    if (!addMechDialog_Load_Handler) {
      addMechDialog_Load_Handler =new AddMechDialog_Load(this);
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

    $("#" + MechView.MODAL_SCREEN_ID).css("display", "block");

    $("#addMechDialog-text").focus();
  }

  var hideAddMechDialog = function(team) {
    $("#" + MechView.MODAL_SCREEN_ID).css("display", "none");
    $("#" + MechView.MODAL_DIALOG_ID).empty().removeClass("addmech");
  }

  var loadedSmurfyLoadout = null;
  var AddMechDialog_OK = function(context) {
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
      let newMechId = MechModel.generateMechId(team, loadedSmurfyLoadout);
      MechModel.addMech(newMechId, team, smurfyMechLoadout);
      //set patterns of added mech to selected team patterns
      MechViewTeamStats.setSelectedTeamPatterns(team);
      MechViewRouter.modifyAppState();
      //TODO: should not require a full view refresh. See what can be done.
      MechModelView.refreshView(true);
      clickContext.hideAddMechDialog(team);
    }
  };
  var addMechDialog_OK_Handler; //set on dialog creation, singleton

  var AddMechDialog_Cancel = function(context) {
    var clickContext = context;
    return function() {
      let team = $(this).data('team');
      clickContext.hideAddMechDialog(team);
    }
  };
  var addMechDialog_Cancel_Handler; //set on dialog creation, singleton

  const SMURFY_PROXY_URL = "./php/smurfyproxy.php?path=";
  var AddMechDialog_Load = function(context) {
    var clickContext = context;

    return function() {
      let team = $(this).data('team');
      let url = $("#addMechDialog-text").val();
      console.log("Load. team: " + team + " URL: " + url);

      let doneHandler = function(data) {
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
  var addMechDialog_Load_Handler; //set on dialog creation, singleton

  let SMURFY_BASE_URL = "http://mwo.smurfy-net.de/mechlab#";
  var createLoadedMechPanel = function(containerId, smurfyMechLoadout) {
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
                          .html(smurfyMechData.translated_name);
    loadedMechJQ.find("[class~=mechName]")
                .append(mechLinkJQ);

    let mechStats = smurfyMechLoadout.stats;
    //Mech equipment
    let mechSpeed = Number(mechStats.top_speed).toFixed(1) + "km/h";
    let mechEngine = mechStats.engine_type + " " + mechStats.engine_rating;
    let heatsink = mechStats.heatsinks + " HS";
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

  var loadedMechSpan = function(text, spanClass) {
    let span = MechViewWidgets.cloneTemplate("loadedMechInfo-template");
    return $(span)
      .addClass(spanClass)
      .text(text);
  }

  var loadedMechWeaponSpan = function(name, number, type) {
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

  var loadedMechWeaponClass = function(smurfyType) {
    if (smurfyType === "BALLISTIC") {
      return "ballistic";
    } else if (smurfyType === "BEAM") {
      return "beam";
    } else if (smurfyType === "MISSLE") {
      return "missile";
    } else {
      console.warn("Unexpected weapon type: " + smurfyType);
      return "";
    }
  }

  return {
    createAddMechButton: createAddMechButton,
    showAddMechDialog: showAddMechDialog,
    hideAddMechDialog: hideAddMechDialog,
  }

})();
