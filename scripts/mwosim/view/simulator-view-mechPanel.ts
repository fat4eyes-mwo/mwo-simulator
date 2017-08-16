"use strict";

//TODO: Wrap mechPanel in a class
namespace MechViewMechPanel {
  import WeaponCycle = MechModelCommon.WeaponCycle;
  import Component = MechModelCommon.Component;
  import Team = MechModelCommon.Team;
  import DomStoredWidget = MechViewWidgets.DomStoredWidget;

  type Mech = MechModel.Mech;
  type WeaponState = MechModelWeapons.WeaponState;
  type AmmoState = MechModel.AmmoState;

  export class PaperDoll extends DomStoredWidget {
    private static readonly PaperDollDomKey = "mwosim.PaperDoll.uiObject";
    //Add a paper doll with the given mechId to the element with the id
    //paperDollContainer uses the template paperDoll-template from the main HTML file
    private static paperDollId(mechId: string): string {
      return mechId + "-paperDoll";
    }
    private static paperDollComponentId(mechId: string, component: Component): string {
      return `${mechId}-paperDoll-${component}`;
    }
    constructor(mechId: string) {
      let paperDollDiv = MechViewWidgets.cloneTemplate("paperDoll-template");
      super(paperDollDiv);
      this.storeToDom(PaperDoll.PaperDollDomKey);

      let paperDollJQ = $(paperDollDiv)
        .attr("id", PaperDoll.paperDollId(mechId))
        .attr("data-mech-id", mechId);
      for (let componentField in Component) {
        if (!Component.hasOwnProperty(componentField)) {
          continue;
        }
        let component = Component[componentField];
        let findStr = `> [data-location='${component}']`;
        paperDollJQ.find(findStr)
          .attr("id", PaperDoll.paperDollComponentId(mechId, component));
      }
    }

    static getPaperDoll(mechId : string) : PaperDoll {
      let domElement = document.getElementById(PaperDoll.paperDollId(mechId));
      if (domElement == null) {
        return null;
      }
      return DomStoredWidget.fromDom(domElement, PaperDoll.PaperDollDomKey);
    }

    //Percent values from 0 to 1
    setPaperDollArmor(mechId : string,
                  location : Component,
                  percent : number)
                  : void {
      var color = MechViewWidgets.damageColor(percent, MechViewWidgets.paperDollDamageGradient);
      let paperDollComponent = document.getElementById(PaperDoll.paperDollComponentId(mechId, location));
      if (paperDollComponent) {
        paperDollComponent.style.borderColor = color;
      }
    }
    setPaperDollStructure(mechId : string,
                  location : Component,
                  percent : number)
                  : void {
      var color = MechViewWidgets.damageColor(percent, MechViewWidgets.paperDollDamageGradient);
      let paperDollComponent = document.getElementById(PaperDoll.paperDollComponentId(mechId, location));
      if (paperDollComponent) {
        paperDollComponent.style.backgroundColor = color;
      }
    }
  }

  var mechHealthNumbersId = function (mechId : string) : string {
    return mechId + "-mechHealthNumbers";
  }
  var mechHealthNumbersArmorId =
      function(mechId : string, location : Component) : string {
    return mechId + "-mechHealthNumbers-" + location + "-armor";
  }
  var mechHealthNumbersStructureId =
      function(mechId : string, location : Component) : string {
    return mechId + "-mechHealthNumbers-" + location + "-structure";
  }
  var addMechHealthNumbers =
      function (mech : Mech, mechHealthNumbersContainer : Element) : void {
    let mechId = mech.getMechId();
    let mechHealthNumbersDivId = mechHealthNumbersId(mechId);
    let mechHealthNumbersDiv =
        MechViewWidgets.cloneTemplate("mechHealthNumbers-template");
    $(mechHealthNumbersDiv)
      .attr("id", mechHealthNumbersDivId)
      .attr("data-mech-id", mechId)
      .appendTo(mechHealthNumbersContainer);

    for (let locationIdx in Component) {
      if (Component.hasOwnProperty(locationIdx)) {
        let location = Component[locationIdx];
        $(`#${mechHealthNumbersDivId}` +
          ` [data-location='${location}']` +
          " [data-healthtype=armor]")
            .attr("id", mechHealthNumbersArmorId(mechId, location));
        $(`#${mechHealthNumbersDivId}` +
          ` [data-location='${location}']` +
          " [data-healthtype=structure]")
          .attr("id", mechHealthNumbersStructureId(mechId, location));
      }
    }
  }

  export interface HealthUpdate {
    location : Component;
    armor : number;
    structure : number;
    maxArmor : number;
    maxStructure : number;
  }
  export var updateMechHealthNumbers =
      function(mechId : string, updateParams : HealthUpdate) : void {
    let location = updateParams.location;
    let armor = updateParams.armor;
    let structure = updateParams.structure;
    let maxArmor = updateParams.maxArmor;
    let maxStructure = updateParams.maxStructure;

    let mechHealthNumbersDivId = mechHealthNumbersId(mechId);
    let armorPercent = Number(armor) / Number(maxArmor);
    let structurePercent = Number(structure) / Number(maxStructure);
    let armorColor = MechViewWidgets.damageColor(armorPercent, MechViewWidgets.componentHealthDamageGradient);
    let structureColor = MechViewWidgets.damageColor(structurePercent, MechViewWidgets.componentHealthDamageGradient);

    let armorLocationDivId = mechHealthNumbersArmorId(mechId, location);
    let structureLocationDivId = mechHealthNumbersStructureId(mechId, location);

    let armorLocationDiv = document.getElementById(armorLocationDivId);
    if (armorLocationDiv) {
      armorLocationDiv.textContent = String(Math.round(armor));
      //NOTE: Title change too expensive
      // armorLocationDiv.setAttribute("title", (Number(armor)).toFixed(2));
      armorLocationDiv.style.color = armorColor;
    }

    let structureLocationDiv = document.getElementById(structureLocationDivId);
    if (structureLocationDiv) {
      structureLocationDiv.textContent = String(Math.round(structure));
      //NOTE: Title change too expensive
      // structureLocationDiv.setAttribute("title", (Number(structure)).toFixed(2));
      structureLocationDiv.style.color = structureColor;
    }
  }

  //Heatbar UI functions
  var heatbarId = function (mechId : string) : string {
    return mechId + "-heatbar";
  }
  var heatbarValueId = function (mechId : string) : string {
    return mechId + "-heatbarValue";
  }
  var addHeatbar =
      function (mechId : string, heatbarContainer : string) : void {
    let heatbarDiv = MechViewWidgets.cloneTemplate("heatbar-template");
    $(heatbarDiv)
      .attr("id", heatbarId(mechId))
      .attr("data-mech-id", mechId)
      .appendTo("#" + heatbarContainer);
    $(heatbarDiv).find("[class~=heatbar]")
      .attr("id", heatbarValueId(mechId))
      .attr("data-mech-id", mechId);
  }
  //Sets the heatbar value for a given mech id to a specified percentage. Value of
  //percent is 0 to 1
  export var setHeatbarValue = function (mechId : string, percent : number) : void {
    var invPercent = 1 - percent;

    let heatbarValueDiv = document.getElementById(heatbarValueId(mechId));
    heatbarValueDiv.style.height = (100 * invPercent) + "%";
  }

  export var updateHeat =
      function(mechId : string,
              currHeat : number,
              currMaxHeat : number)
              : void {
    let heatPercent = Number(currHeat) / Number(currMaxHeat);
    setHeatbarValue(mechId, heatPercent);

    var heatNumberId = heatNumberPanelId(mechId);
    let heatText = Number(heatPercent * 100).toFixed(0) + "%" +
                    " (" + Number(currHeat).toFixed(1) + ")";
    let heatNumberDiv = document.getElementById(heatNumberId);
    heatNumberDiv.textContent = heatText;
  }

  var weaponRowId = function (mechId : string, idx : number) : string {
    return `${mechId}-${idx}-weaponrow`;
  }
  var weaponNameId = function (mechId : string, idx : number) : string {
    return weaponRowId(mechId, idx) + "-weaponName";
  }
  var weaponLocationId = function (mechId : string, idx : number) : string {
    return weaponRowId(mechId, idx) + "-weaponLocation";
  }
  var weaponCooldownBarId = function (mechId : string, idx : number) : string {
    return weaponRowId(mechId, idx) + "-weaponCooldownBar";
  }
  var weaponAmmoId = function(mechId : string, idx : number) : string {
    return weaponRowId(mechId, idx) + "-weaponAmmo";
  }
  const weaponLocAbbr : {[index:string] : string} = {
    "head" : "H",
    "left_arm" : "LA",
    "left_torso" : "LT",
    "centre_torso" : "CT",
    "right_torso" : "RT",
    "right_arm" : "RA",
    "left_leg" : "LL",
    "right_leg" : "RL"
  }
  //TODO: Do not directly access WeaponState and AmmoState here
  var addWeaponPanel =
      function (mechId : string,
                weaponStateList : WeaponState[],
                ammoState : AmmoState,
                weaponPanel : Element)
                : void {
    for (var idx in weaponStateList) {
      if (!weaponStateList.hasOwnProperty(idx)) {
        continue;
      }
      var weaponState = weaponStateList[idx];
      let weaponRowDiv = MechViewWidgets.cloneTemplate("weaponRow-template");
      $(weaponRowDiv)
        .attr("id", weaponRowId(mechId, Number(idx)))
        .attr("data-mech-id", mechId)
        .attr("data-weapon-idx", idx)
        .appendTo(weaponPanel);
      $(weaponRowDiv).find(".weaponName")
        .attr("id", weaponNameId(mechId, Number(idx)))
        .html(weaponState.weaponInfo.translatedName);
      $(weaponRowDiv).find(".weaponLocation")
        .attr("id", weaponLocationId(mechId, Number(idx)))
        .html(weaponLocAbbr[weaponState.weaponInfo.location]);
      $(weaponRowDiv).find(".weaponCooldownBar")
        .attr("id", weaponCooldownBarId(mechId, Number(idx)));
      $(weaponRowDiv).find(".weaponAmmo")
        .attr("id", weaponAmmoId(mechId, Number(idx)));

      setWeaponAmmo(mechId, Number(idx), 0);
      setWeaponState(mechId, Number(idx), weaponState.weaponCycle);
      setWeaponCooldown(mechId, Number(idx), 0);
    }
  }
  export type WeaponBarType = string;
  export var setWeaponCooldown =
      function (mechId : string,
                weaponIdx : number,
                percent : number,
                type : WeaponBarType ="cooldown")
                : void{
    let cooldownDiv = document.getElementById(weaponCooldownBarId(mechId, weaponIdx));
    if (percent > 1) {
      cooldownDiv.classList.add("over100");
    } else {
      cooldownDiv.classList.remove("over100");
    }
    percent = Math.min(1, percent);
    cooldownDiv.style.width = (100*percent) + "%";
    if (type === "cooldown") {
      cooldownDiv.classList.remove("jamBar");
    } else if (type === "jamBar") {
      cooldownDiv.classList.add("jamBar");
    }
  }
  export var setWeaponAmmo =
      function (mechId : string,
                weaponIdx : number,
                ammo : number)
                : void {
    let weaponAmmoDiv : Node = document.getElementById(weaponAmmoId(mechId, weaponIdx));
    weaponAmmoDiv.textContent = ammo !== -1 ? String(ammo) : "\u221e"; //infinity symbol
  }

  export var setWeaponState =
      function (mechId : string,
                weaponIdx : number,
                state : WeaponCycle)
                : void {
    //Note: the remove class string must include all the MechModel.WeaponCycle strings
    let removeClassString = "";
    for (let weaponCycle in WeaponCycle) {
      if (WeaponCycle.hasOwnProperty(weaponCycle)) {
        removeClassString += WeaponCycle[weaponCycle] + " ";
      }
    }
    let weaponRowDiv = document.getElementById(weaponRowId(mechId, weaponIdx));
    let weaponRowJQ = $(weaponRowDiv);
    weaponRowJQ.removeClass(removeClassString);
    weaponRowJQ.addClass(state);
  }

  //adds a mech panel (which contains a paperDoll, a heatbar and a weaponPanel)
  function mechPanelId(mechId : string) : string {
    return mechId + "-mechPanel";
  }
  var mechSummaryHealthPanelId = function(mechId : string) : string {
    return mechId + "-mechSummaryHealth";
  }
  var mechNamePanelId = function(mechId : string) : string {
    return mechId + "-mechName";
  }
  var heatNumberPanelId = function(mechId : string) : string {
    return mechId + "-heatbarNumber";
  }
  var mechTargetPanelId = function(mechId : string) : string {
    return mechId + "-mechTarget";
  }
  var mechHealthAndWeaponsId = function(mechId : string) : string {
    return mechId + "-mechHealthAndWeapons";
  }
  var mechDPSPanelId = function(mechId : string) : string {
    return mechId + "-mechDPSText";
  }
  var mechBurstPanelId = function(mechId : string) : string {
    return mechId + "-mechBurstText";
  }
  var mechTotalDamagePanelId = function(mechId : string) : string {
    return mechId + "-mechTotalDamageText";
  }
  export var addMechPanel = function (mech : Mech, team : Team) : void {
    let mechId = mech.getMechId();
    let mechState = mech.getMechState();
    let weaponStateList = mechState.weaponStateList;
    let ammoState = mechState.ammoState;
    let mechPanelContainer = "#" + team + "Team";
    let mechPanelDiv = MechViewWidgets.cloneTemplate("mechPanel-template");
    let endPanelJQ = $("#" + mechPanelId(getEndMechId(team)));
    let mechPanelJQ = $(mechPanelDiv);
    mechPanelJQ
      .attr("id", mechPanelId(mechId))
      .attr("data-mech-id", mechId)
      .insertBefore(endPanelJQ);

    var mechHealthAndWeaponsDivId = mechHealthAndWeaponsId(mechId);
    mechPanelJQ.find("[class~=mechHealthAndWeapons]")
      .attr("id", mechHealthAndWeaponsDivId);

    var paperDollContainerId = mechId + "-paperDollContainer";
    let paperDollJQ = mechPanelJQ.find("[class~='paperDollContainer']")
                                  .attr("id", paperDollContainerId);
    let paperDoll = new PaperDoll(mechId);
    paperDollJQ.append(paperDoll.domElement);

    let mechHealthNumbersContainerJQ =
            mechPanelJQ.find("[class~='mechHealthNumbersContainer']");
    addMechHealthNumbers(mech, mechHealthNumbersContainerJQ.get(0));

    var heatbarContainerId = mechId + "-heatbarContainer";
    mechPanelJQ.find("[class~='heatbarContainer']")
      .attr("id", heatbarContainerId);
    addHeatbar(mechId, heatbarContainerId);

    var heatNumberId = heatNumberPanelId(mechId);
    mechPanelJQ.find("[class~='heatNumber']")
      .attr("id", heatNumberId);

    var weaponPanelContainerId = mechId + "-weaponPanelContainer";
    let weaponPanelJQ = mechPanelJQ.find("[class~='weaponPanelContainer']")
      .attr("id", weaponPanelContainerId);
    addWeaponPanel(mechId, weaponStateList, ammoState, weaponPanelJQ.get(0));

    let mechNameId =  mechNamePanelId(mechId);
    mechPanelJQ.find("[class~='titlePanel'] [class~='mechName']")
      .attr("id", mechNameId)
      .html("");

    //delete button
    addDeleteMechButton(mechId, team, mechPanelDiv);

    //move button
    addMoveMechButton(mechId, team, mechPanelDiv);

    //drag and drop handlers
    addDragAndDropHandlers(mechId, mechPanelDiv);

    //Mech stats
    let mechSummaryHealthId = mechSummaryHealthPanelId(mechId);
    mechPanelJQ.find("[class~='statusPanel'] [class~='mechSummaryHealthText']")
      .attr("id", mechSummaryHealthId)
      .html("");

    let mechTargetId = mechTargetPanelId(mechId);
    mechPanelJQ.find("[class~='statusPanel'] [class~='mechTargetText']")
      .attr("id", mechTargetId)
      .html("");

    let mechDPSId = mechDPSPanelId(mechId);
    mechPanelJQ.find("[class~='statusPanel'] [class~='mechDPSText']")
      .attr("id", mechDPSId)
      .html("");

    let mechBurstId = mechBurstPanelId(mechId);
    mechPanelJQ.find("[class~='statusPanel'] [class~='mechBurstText']")
      .attr("id", mechBurstId)
      .html("");

    let mechTotalDamageId = mechTotalDamagePanelId(mechId);
    mechPanelJQ.find("[class~='statusPanel'] [class~='mechTotalDamageText']")
      .attr("id", mechTotalDamageId)
      .html("");

    addMechDetailsButton(mechId, mechPanelDiv);
  }

  const SMURFY_BASE_URL= "http://mwo.smurfy-net.de/mechlab#";
  export var updateMechTitlePanel =
      function(mechId : string,
              mechName : string,
              smurfyMechId : string,
              smurfyLayoutId : string)
              : void {
    let mechNameId = mechNamePanelId(mechId);
    //Create smurfy link then set the mech name
    let smurfyLink = SMURFY_BASE_URL + "i=" + smurfyMechId + "&l=" + smurfyLayoutId;
    let mechNameDiv = document.getElementById(mechNameId);

    let externalLinkSpan = MechViewWidgets.cloneTemplate("external-link-template");
    let mechLink = $("<a></a>").attr("href", smurfyLink)
                            .attr("target", "_blank")
                            .attr("rel", "noopener")
                            .text(mechName)
                            .append(externalLinkSpan);
    $(mechNameDiv)
      .empty()
      .append(mechLink);
  }

  export interface  MechPanelStatusUpdate {
    mechId : string,
    mechIsAlive : boolean,
    mechCurrTotalHealth : number,
    mechCurrMaxHealth : number,
    targetMechName : string,
    dps : number,
    burst : number,
    totalDmg : number
  }
  export var updateMechStatusPanel = function(update : MechPanelStatusUpdate) : void {
    let mechSummaryHealthId = mechSummaryHealthPanelId(update.mechId);
    let mechHealthAndWeaponsDivId = mechHealthAndWeaponsId(update.mechId);
    let mechHealthAndWeaponsDiv =
          document.getElementById(mechHealthAndWeaponsDivId);

    //set mech summary health
    let mechSummaryHealthText = "";
    let percentHealth = Number(update.mechCurrTotalHealth) / Number(update.mechCurrMaxHealth);
    if (update.mechCurrTotalHealth > 0 && update.mechIsAlive) {
      mechSummaryHealthText = ((percentHealth * 100).toFixed(0)) + "%";
      if (mechHealthAndWeaponsDiv.classList.contains("kia")) {
        mechHealthAndWeaponsDiv.classList.remove("kia");
      }
    } else {
      mechSummaryHealthText =
        "KIA" + "(" + ((percentHealth * 100).toFixed(0)) + "%" + ")";
      percentHealth = 0;
      if (!mechHealthAndWeaponsDiv.classList.contains("kia"))  {
        mechHealthAndWeaponsDiv.classList.add("kia");
      }
    }
    let mechSummaryHealthDiv = document.getElementById(mechSummaryHealthId);
    mechSummaryHealthDiv.style.color =
                  MechViewWidgets.damageColor(percentHealth, MechViewWidgets.healthDamageGradient);
    mechSummaryHealthDiv.textContent = mechSummaryHealthText;

    //update mech target
    let mechTargetId = mechTargetPanelId(update.mechId);
    let mechTargetDiv = document.getElementById(mechTargetId);
    mechTargetDiv.textContent = update.targetMechName;

    //set mech total damage
    let mechTotalDamageId = mechTotalDamagePanelId(update.mechId);
    let mechTotalDamageDiv = document.getElementById(mechTotalDamageId);
    mechTotalDamageDiv.textContent = Number(update.totalDmg).toFixed(1);

    //set mech dps
    let mechDPSId = mechDPSPanelId(update.mechId);
    let mechDPSDiv = document.getElementById(mechDPSId);
    mechDPSDiv.textContent = Number(update.dps).toFixed(1);

    //set mech burst
    let mechBurstId = mechBurstPanelId(update.mechId);
    let mechBurstDiv = document.getElementById(mechBurstId);
    mechBurstDiv.textContent = Number(update.burst).toFixed(1);
  }

  export var updateQuirkSkillFlags = function(mechId : string) {
    let mechJQ = $("#" + mechPanelId(mechId));

    let mechQuirks = MechModelView.getMechQuirks(mechId);
    let quirkFlagJQ = mechJQ.find(".quirkFlag");
    if (mechQuirks && mechQuirks.length > 0) {
      quirkFlagJQ.removeClass("hidden");
    } else {
      quirkFlagJQ.addClass("hidden");
    }

    let mechSkills = MechModelView.getMechSkillQuirks(mechId);
    let skillFlagJQ = mechJQ.find(".skillFlag");
    if (mechSkills && mechSkills.length > 0) {
      skillFlagJQ.removeClass("hidden");
    } else {
      skillFlagJQ.addClass("hidden");
    }
  }

  //Delete button
  var mechDeleteButtonId = function(mechId : string) : string {
    return mechId + "-deleteButton";
  }
  var addDeleteMechButton =
      function(mechId : string,
              team : Team,
              mechPanelDiv : Element)
              : void {
    let mechPanelJQ = $(mechPanelDiv);
    if (!deleteMechButtonHandler) {
      deleteMechButtonHandler = createDeleteMechButtonHandler();
    }
    let deleteIconSVG = MechViewWidgets.cloneTemplate("delete-icon-template");
    let mechDeleteButtonDivId = mechDeleteButtonId(mechId);
    mechPanelJQ.find("[class~='titlePanel'] [class~='deleteMechButton']")
      .attr("id", mechDeleteButtonDivId)
      .attr("data-mech-id", mechId)
      .append(deleteIconSVG)
      .click(deleteMechButtonHandler);
  }

  var createDeleteMechButtonHandler = function() {
    return function(this : Element) {
      let mechId = $(this).attr("data-mech-id");
      console.log("Deleting " + mechId);
      let result = MechModel.deleteMech(mechId);
      if (!result) {
        throw Error("Error deleting " + mechId);
      }
      MechViewRouter.modifyAppState();
      let mechPanelDivId = mechPanelId(mechId);
      $("#" + mechPanelDivId).remove();

      MechView.resetSimulation();
      MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
    };
  }
  var deleteMechButtonHandler : () => void; //singleton

  var moveMechButtonId = function(mechId : string) : string {
    return mechId + "-moveButton";
  }
  var addMoveMechButton =
      function(mechId : string,
              team : Team,
              mechPanelDiv : Element)
              : void {
    let mechPanelJQ = $(mechPanelDiv);
    let moveIconSVG = MechViewWidgets.cloneTemplate("move-icon-template");
    let mechMoveButtonDivId = moveMechButtonId(mechId);
    if (!moveMechButtonHandler) {
      moveMechButtonHandler = createMoveMechButtonHandler();
    }
    mechPanelJQ.find("[class~='titlePanel'] [class~='moveMechButton']")
      .attr("id", mechMoveButtonDivId)
      .attr("data-mech-id", mechId)
      .attr("data-dragenabled", "false")
      .append(moveIconSVG)
      .click(moveMechButtonHandler);
  }

  var toggleMoveMech = function(mechId : string) : void {
    let moveMechButtonJQ = $("#" + moveMechButtonId(mechId));
    let dragEnabled = moveMechButtonJQ.attr("data-dragenabled") === "true";
    let mechPanelDivId = mechPanelId(mechId);
    let mechPanelJQ = $("#" + mechPanelDivId);
    dragEnabled = !dragEnabled; //toggle
    moveMechButtonJQ.attr("data-dragenabled", String(dragEnabled));
    if (dragEnabled) {
      mechPanelJQ
        .attr("draggable", "true")
        .addClass("dragging");
    } else {
      mechPanelJQ
        .attr("draggable", "false")
        .removeClass("dragging");
    }
  }
  var createMoveMechButtonHandler = function() : () => void {

    return function(this: Element) {
      let mechId = $(this).attr("data-mech-id");
      toggleMoveMech(mechId);
    }
  }
  var moveMechButtonHandler : () => void; //initialized on first addMoveMechButton call

  const EndMechIdPrefix = "end-mech-fake-id-";
  var getEndMechId = function(team: Team) {
    return EndMechIdPrefix + team;
  }
  var isEndMechId = function(mechId : string) {
    return mechId.startsWith(EndMechIdPrefix);
  }
  var getEndMechIdTeam = function(mechId : string) : Team {
    if (isEndMechId(mechId)) {
      return mechId.substring(EndMechIdPrefix.length);
    } else {
      return null;
    }
  }
  export var addEndMechPanel = function(team: Team) {
    let mechPanelContainer = "#" + team + "Team";
    let mechPanelDiv = MechViewWidgets.cloneTemplate("endMechPanel-template");
    let mechPanelJQ = $(mechPanelDiv);
    let mechId = getEndMechId(team);
    mechPanelJQ
      .attr("id", mechPanelId(mechId))
      .attr("data-mech-id", mechId)
      .appendTo(mechPanelContainer);
    addDragAndDropHandlers(mechId, mechPanelDiv);
  }

  var addDragAndDropHandlers =
      function(mechId : string, mechPanelDiv : Element) : void {
    let mechPanelJQ = $(mechPanelDiv);
    if (!mechOnDragHandler) {
      mechOnDragHandler = createMechOnDragHandler();
    }
    mechPanelJQ.on("dragstart", mechOnDragHandler);

    if (!mechOnDragOverHandler) {
      mechOnDragOverHandler = createMechOnDragOverHandler();
    }
    mechPanelJQ.on("dragover", mechOnDragOverHandler);

    if (!mechOnDropHandler) {
      mechOnDropHandler = createMechOnDropHandler();
    }
    mechPanelJQ.on("drop", mechOnDropHandler);
  }
  type JQEventHandler = (ev : JQuery.Event) => void;
  var createMechOnDragHandler = function() : JQEventHandler {
    return function(this : Element,
                    jqEvent : JQuery.Event) {
      let mechId = $(this).attr("data-mech-id");
      let origEvent = jqEvent.originalEvent as DragEvent;
      origEvent.dataTransfer.setData("text/plain", mechId);
      origEvent.dataTransfer.effectAllowed = "move";
      console.log("Drag start: " + mechId);
    }
  }
  var mechOnDragHandler : JQEventHandler = null;

  let prevDropTarget : string = null;
  var createMechOnDragOverHandler = function() : JQEventHandler {
    return function(this : Element,
                    jqEvent : JQuery.Event) {
      let thisJQ = $(this);
      let mechId = thisJQ.attr("data-mech-id");
      let origEvent= jqEvent.originalEvent as DragEvent;

      jqEvent.preventDefault();
      //allow move on drop
      origEvent.dataTransfer.dropEffect= "move";
      if (prevDropTarget !== mechId) {
        if (prevDropTarget) {
          let prevDropTargetJQ = $("#" + mechPanelId(prevDropTarget));
          prevDropTargetJQ.removeClass("droptarget");
          thisJQ.addClass("droptarget");
        }
        prevDropTarget = mechId;
      }
    }
  }
  var mechOnDragOverHandler : JQEventHandler = null;

  var createMechOnDropHandler = function() : JQEventHandler {
    return function(this : Element,
                    jqEvent : JQuery.Event) : void {
      let thisJQ = $(this);
      let dropTargetMechId = thisJQ.attr("data-mech-id");
      let origEvent= jqEvent.originalEvent as DragEvent;
      let srcMechId = origEvent.dataTransfer.getData("text/plain");
      jqEvent.preventDefault();

      thisJQ.removeClass("droptarget");
      prevDropTarget = null;

      if (dropTargetMechId !== srcMechId) {
        MechView.resetSimulation();
        let status = false;
        if (!isEndMechId(dropTargetMechId)) {
          status = MechModel.moveMech(srcMechId, dropTargetMechId);
        } else {
          let team = getEndMechIdTeam(dropTargetMechId);
          status = MechModel.moveMechToEndOfList(srcMechId, team);
          console.log("Insert at end: team=" + team);
        }

        if (!status) {
          console.error(`Error moving mech. src=${srcMechId} dest=${dropTargetMechId}`);
        } else {
          console.log(`Drop: src=${srcMechId} dest=${dropTargetMechId}`);
          let srcMechJQ = $("#" + mechPanelId(srcMechId));
          srcMechJQ
            .detach()
            .insertBefore(thisJQ);

          toggleMoveMech(srcMechId);
          MechViewRouter.modifyAppState();
          MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
        }
      }
    }
  }
  var mechOnDropHandler : JQEventHandler = null;

  var addMechDetailsButton =
      function(mechId : string, mechPanelDiv : Element) : void {
      let mechPanelJQ = $(mechPanelDiv);
      let mechDetailsJQ = mechPanelJQ.find(".mechDetailsContainer");
      let mechDetailsButtonJQ = mechPanelJQ.find(".mechDetailsButton")
                                      .attr("data-mech-id", mechId);
      let mechDetailsButtonArrowJQ = mechPanelJQ.find(".mechDetailsButtonArrow");

      let mechDetailsTransitionEndHandler = function() {
        mechDetailsButtonArrowJQ.off("transitionend", mechDetailsTransitionEndHandler);
        if (!mechDetailsButton.expanded) {
            mechDetailsJQ.empty();
        }
      }

      let mechDetailsClickHandler = function() {
        mechDetailsButtonArrowJQ.on("transitionend", mechDetailsTransitionEndHandler);
        if (!mechDetailsButton.expanded) {
          createMechDetails(mechId, mechDetailsJQ.get(0));
        }
      }

      let mechDetailsButton =
          new MechViewWidgets.ExpandButton(mechDetailsButtonJQ.get(0),
                                            mechDetailsClickHandler,
                                            mechDetailsJQ.get(0),
                                            mechDetailsButtonArrowJQ.get(0));
  }

  var createMechDetails =
      function(mechId: string, mechDetailsContainer : Element) : void {
    let mechDetails = new MechViewMechDetails.MechDetails(mechId);
    mechDetails.render();
    $(mechDetailsContainer).append(mechDetails.domElement);
  }

  //scrolls to and flashes the selected mech panel
  export var highlightMechPanel = function(mechId : string) : void {
    let mechPanelDivId = mechPanelId(mechId);
    let mechPanelJQ = $("#" + mechPanelDivId);
    mechPanelJQ.get(0).scrollIntoView(false);
    mechPanelJQ.addClass("flashSelected");
    mechPanelJQ.on("animationend", function(data) {
      mechPanelJQ.removeClass("flashSelected")
      mechPanelJQ.off("animationend");
    });
  }
}
