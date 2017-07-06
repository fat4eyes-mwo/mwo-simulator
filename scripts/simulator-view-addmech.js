
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
    $("#" + MechView.MODAL_DIALOG_ID).empty();
    $("#addMechDialog-template")
      .clone(true)
      .attr("id", "addMechDialogContainer")
      .removeClass("template")
      .addClass(team)
      .appendTo("#" + MechView.MODAL_DIALOG_ID);

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
    $("#" + MechView.MODAL_DIALOG_ID).empty();
  }

  var AddMechDialog_OK = function(context) {
    var clickContext = context;
    return function() {
      let team = $(this).data('team');
      let url = $("#addMechDialog-text").val()
      console.log("Mech loaded. team: " + team + " URL: " + url);
      //TODO: Avoid accessing MechModel directly here. Create a method in ModelView to do this
      let smurfyMechLoadout = MechView.loadedSmurfyLoadout;
      let smurfyMechData = MechModel.getSmurfyMechData(smurfyMechLoadout.mech_id);
      let mechTranslatedName = smurfyMechData.translated_name;
      let mechName = smurfyMechData.name;
      let newMechId = MechModel.generateMechId(team, MechView.loadedSmurfyLoadout);
      MechModel.addMech(newMechId, team, smurfyMechLoadout);
      //set patterns of added mech to selected team patterns
      MechView.setSelectedTeamPatterns(team);
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

      let doneCallback = function(data) {
        MechView.loadedSmurfyLoadout = data;
        let smurfyMechData = MechModel.getSmurfyMechData(MechView.loadedSmurfyLoadout.mech_id);
        let mechTranslatedName = smurfyMechData.translated_name;
        let mechName = smurfyMechData.name;
        //TODO: put fancy summary of loaded mech in result pane
        $("#addMechDialog-result")
            .removeClass("error")
            .html("Loaded " + mechTranslatedName);
        addMechOKButton.enable();
      };
      let failCallback = function(data) {
        $("#addMechDialog-result")
            .addClass("error")
            .html("Failed to load " + url);
      };
      let alwaysCallback = function(data) {
        addMechLoadButton.enable();
        addMechLoadButton.removeClass("loading");
        addMechLoadButton.setHtml("Load");
      };
      let status = MechModel.loadSmurfyMechLoadoutFromURL(url, doneCallback, failCallback, alwaysCallback);
      if (status) {
        $("#addMechDialog-result")
              .removeClass("error")
              .html("Loading url : " + url);
        addMechLoadButton.disable();
        addMechLoadButton.addClass("loading");
        addMechLoadButton.setHtml("Loading...");
      } else {
        $("#addMechDialog-result")
            .addClass("error")
            .html("Invalid smurfy URL. Expected format is 'http://mwo.smurfy-net.de/mechlab#i=mechid&l=loadoutid'");
        addMechLoadButton.enable();
        addMechLoadButton.removeClass("loading");
        addMechLoadButton.setHtml("Load");
        console.log("Invalid smurfy url");
      }
    }
  }
  var addMechDialog_Load_Handler; //set on dialog creation, singleton

  return {
    createAddMechButton: createAddMechButton,
    showAddMechDialog: showAddMechDialog,
    hideAddMechDialog: hideAddMechDialog,
  }

})();
