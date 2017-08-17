"use strict";

//TODO: Unify the update methods into mechpanel, so ModelView doesn't have to know about mechpanel's
//individual components
//TODO: Remove mechId from method parameters in MechPanel. Use stored mechId instead.
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
    mechId : string;
    constructor(mechId: string) {
      let paperDollDiv = MechViewWidgets.cloneTemplate("paperDoll-template");
      super(paperDollDiv);
      this.storeToDom(PaperDoll.PaperDollDomKey);

      this.mechId = mechId;

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
      if (!domElement) {
        return null;
      }
      return DomStoredWidget.fromDom(domElement, PaperDoll.PaperDollDomKey);
    }

    //Percent values from 0 to 1
    setPaperDollArmor(location : Component, percent : number) : void {
      var color = MechViewWidgets.damageColor(percent, MechViewWidgets.paperDollDamageGradient);
      let paperDollComponent = document.getElementById(PaperDoll.paperDollComponentId(this.mechId, location));
      if (paperDollComponent) {
        paperDollComponent.style.borderColor = color;
      }
    }
    setPaperDollStructure(location : Component, percent : number) : void {
      var color = MechViewWidgets.damageColor(percent, MechViewWidgets.paperDollDamageGradient);
      let paperDollComponent = document.getElementById(PaperDoll.paperDollComponentId(this.mechId, location));
      if (paperDollComponent) {
        paperDollComponent.style.backgroundColor = color;
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
  export class MechHealthNumbers extends DomStoredWidget {
    private static readonly MechHealthNumbersDomKey = "mwosim.MechHealthNumbers.uiObject";
    private static mechHealthNumbersId(mechId : string) : string {
      return mechId + "-mechHealthNumbers";
    }
    private static mechHealthNumbersArmorId(mechId : string, location : Component) : string {
      return mechId + "-mechHealthNumbers-" + location + "-armor";
    }
    private static mechHealthNumbersStructureId(mechId : string, location : Component) : string {
      return mechId + "-mechHealthNumbers-" + location + "-structure";
    }
    private mechId : string;
    constructor(mech : Mech) {
      let mechHealthNumbersDiv = MechViewWidgets.cloneTemplate("mechHealthNumbers-template");
      super(mechHealthNumbersDiv);
      this.storeToDom(MechHealthNumbers.MechHealthNumbersDomKey);
      this.mechId = mech.getMechId();

      let mechHealthNumbersDivId = MechHealthNumbers.mechHealthNumbersId(this.mechId);
      let mechHealthNumbersJQ = $(mechHealthNumbersDiv)
                                    .attr("id", mechHealthNumbersDivId)
                                    .attr("data-mech-id", this.mechId);

      for (let locationIdx in Component) {
        if (Component.hasOwnProperty(locationIdx)) {
          let location = Component[locationIdx];
          mechHealthNumbersJQ.find(
            ` [data-location='${location}']` +
            " [data-healthtype=armor]")
              .attr("id", MechHealthNumbers.mechHealthNumbersArmorId(this.mechId, location));
          mechHealthNumbersJQ.find(
            ` [data-location='${location}']` +
            " [data-healthtype=structure]")
            .attr("id", MechHealthNumbers.mechHealthNumbersStructureId(this.mechId, location));
        }
      }
    }

    static getMechHealthNumbers(mechId : string) : MechHealthNumbers {
      let domElement = document.getElementById(MechHealthNumbers.mechHealthNumbersId(mechId));
      if (!domElement) {
        return null;
      }
      return DomStoredWidget.fromDom(domElement, MechHealthNumbers.MechHealthNumbersDomKey);
    }

    updateMechHealthNumbers(updateParams : HealthUpdate) : void {
      let location = updateParams.location;
      let armor = updateParams.armor;
      let structure = updateParams.structure;
      let maxArmor = updateParams.maxArmor;
      let maxStructure = updateParams.maxStructure;

      let mechHealthNumbersDivId = MechHealthNumbers.mechHealthNumbersId(this.mechId);
      let armorPercent = Number(armor) / Number(maxArmor);
      let structurePercent = Number(structure) / Number(maxStructure);
      let armorColor = MechViewWidgets.damageColor(armorPercent, MechViewWidgets.componentHealthDamageGradient);
      let structureColor = MechViewWidgets.damageColor(structurePercent, MechViewWidgets.componentHealthDamageGradient);

      let armorLocationDivId = MechHealthNumbers.mechHealthNumbersArmorId(this.mechId, location);
      let structureLocationDivId = MechHealthNumbers.mechHealthNumbersStructureId(this.mechId, location);

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
  }

  export class Heatbar extends DomStoredWidget {
    private static readonly HeatbarDomKey = "mwosim.Heatbar.uiObject";
    private static heatbarId(mechId : string) : string {
      return mechId + "-heatbar";
    }
    private static heatbarValueId(mechId : string) : string {
      return mechId + "-heatbarValue";
    }
    private mechId : string;
    constructor(mechId : string, heatbarContainer : string) {
      let heatbarDiv = MechViewWidgets.cloneTemplate("heatbar-template");
      super(heatbarDiv);
      this.storeToDom(Heatbar.HeatbarDomKey);
      this.mechId = mechId;

      $(heatbarDiv)
        .attr("id", Heatbar.heatbarId(mechId))
        .attr("data-mech-id", mechId)
        .appendTo("#" + heatbarContainer);
      $(heatbarDiv).find("[class~=heatbar]")
        .attr("id", Heatbar.heatbarValueId(mechId))
        .attr("data-mech-id", mechId);
    }
    static getHeatbar(mechId : string) : Heatbar {
      let domElement = document.getElementById(Heatbar.heatbarId(mechId));
      if (!domElement) {
        return null;
      }
      return DomStoredWidget.fromDom(domElement, Heatbar.HeatbarDomKey);
    }
    //Sets the heatbar value for a given mech id to a specified percentage. Value of
    //percent is 0 to 1
    setHeatbarValue(percent : number) : void {
      var invPercent = 1 - percent;

      let heatbarValueDiv = document.getElementById(Heatbar.heatbarValueId(this.mechId));
      heatbarValueDiv.style.height = (100 * invPercent) + "%";
    }

    updateHeat(currHeat : number, currMaxHeat : number) : void {
      let heatPercent = Number(currHeat) / Number(currMaxHeat);
      this.setHeatbarValue(heatPercent);

      var heatNumberId = MechPanel.heatNumberPanelId(this.mechId);
      let heatText = Number(heatPercent * 100).toFixed(0) + "%" +
                      " (" + Number(currHeat).toFixed(1) + ")";
      let heatNumberDiv = document.getElementById(heatNumberId);
      heatNumberDiv.textContent = heatText;
    }
  }

  export type WeaponBarType = string;
  export class WeaponPanel extends DomStoredWidget {
    private static readonly WeaponPanelDomKey = "mwosim.WeaponPanel.uiObject";
    static weaponPanelId(mechId : string) {
      return `${mechId}-weaponPanelContainer`;
    }
    private static weaponRowId(mechId : string, idx : number) : string {
      return `${mechId}-${idx}-weaponrow`;
    }
    private static weaponNameId(mechId : string, idx : number) : string {
      return WeaponPanel.weaponRowId(mechId, idx) + "-weaponName";
    }
    private static weaponLocationId(mechId : string, idx : number) : string {
      return WeaponPanel.weaponRowId(mechId, idx) + "-weaponLocation";
    }
    private static weaponCooldownBarId(mechId : string, idx : number) : string {
      return WeaponPanel.weaponRowId(mechId, idx) + "-weaponCooldownBar";
    }
    private static weaponAmmoId(mechId : string, idx : number) : string {
      return WeaponPanel.weaponRowId(mechId, idx) + "-weaponAmmo";
    }
    private static readonly weaponLocAbbr : {[index:string] : string} = {
      "head" : "H",
      "left_arm" : "LA",
      "left_torso" : "LT",
      "centre_torso" : "CT",
      "right_torso" : "RT",
      "right_arm" : "RA",
      "left_leg" : "LL",
      "right_leg" : "RL"
    }
    private mechId : string;
    //TODO: Do not directly access WeaponState and AmmoState here
    constructor(mechId : string,
                  weaponStateList : WeaponState[],
                  ammoState : AmmoState,
                  weaponPanel : Element) {
      super(weaponPanel);
      this.storeToDom(WeaponPanel.WeaponPanelDomKey);
      this.mechId = mechId;
      $(weaponPanel).attr("id", WeaponPanel.weaponPanelId(mechId));

      for (var idx in weaponStateList) {
        if (!weaponStateList.hasOwnProperty(idx)) {
          continue;
        }
        var weaponState = weaponStateList[idx];
        let weaponRowDiv = MechViewWidgets.cloneTemplate("weaponRow-template");
        $(weaponRowDiv)
          .attr("id", WeaponPanel.weaponRowId(mechId, Number(idx)))
          .attr("data-mech-id", mechId)
          .attr("data-weapon-idx", idx)
          .appendTo(weaponPanel);
        $(weaponRowDiv).find(".weaponName")
          .attr("id", WeaponPanel.weaponNameId(mechId, Number(idx)))
          .html(weaponState.weaponInfo.translatedName);
        $(weaponRowDiv).find(".weaponLocation")
          .attr("id", WeaponPanel.weaponLocationId(mechId, Number(idx)))
          .html(WeaponPanel.weaponLocAbbr[weaponState.weaponInfo.location]);
        $(weaponRowDiv).find(".weaponCooldownBar")
          .attr("id", WeaponPanel.weaponCooldownBarId(mechId, Number(idx)));
        $(weaponRowDiv).find(".weaponAmmo")
          .attr("id", WeaponPanel.weaponAmmoId(mechId, Number(idx)));

        this.setWeaponAmmo(Number(idx), 0);
        this.setWeaponState(Number(idx), weaponState.weaponCycle);
        this.setWeaponCooldown(Number(idx), 0);
      }
    }
    static getWeaponPanel(mechId : string) : WeaponPanel {
      let domElement = document.getElementById(WeaponPanel.weaponPanelId(mechId));
      if (!domElement) {
        return null;
      }
      return DomStoredWidget.fromDom(domElement, WeaponPanel.WeaponPanelDomKey);
    }
    setWeaponCooldown(weaponIdx : number,
                  percent : number,
                  type : WeaponBarType ="cooldown")
                  : void {
      let cooldownDiv = document.getElementById(WeaponPanel.weaponCooldownBarId(this.mechId, weaponIdx));
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
    setWeaponAmmo(weaponIdx : number,
                  ammo : number)
                  : void {
      let weaponAmmoDiv : Node = document.getElementById(WeaponPanel.weaponAmmoId(this.mechId, weaponIdx));
      weaponAmmoDiv.textContent = ammo !== -1 ? String(ammo) : "\u221e"; //infinity symbol
    }

    setWeaponState(weaponIdx : number,
                  state : WeaponCycle)
                  : void {
      //Note: the remove class string must include all the MechModel.WeaponCycle strings
      let weaponRowDiv = document.getElementById(WeaponPanel.weaponRowId(this.mechId, weaponIdx));
      for (let weaponCycle in WeaponCycle) {
        if (WeaponCycle.hasOwnProperty(weaponCycle)) {
          weaponRowDiv.classList.remove(WeaponCycle[weaponCycle]);
        }
      }
      weaponRowDiv.classList.add(state);
    }
  }

  type JQEventHandler = (this: Element, ev : JQuery.Event) => void;
  export interface  MechPanelStatusUpdate {
    mechIsAlive : boolean,
    mechCurrTotalHealth : number,
    mechCurrMaxHealth : number,
    targetMechName : string,
    dps : number,
    burst : number,
    totalDmg : number
  }

  export class MechPanel extends DomStoredWidget {
    private static MechPanelDomKey = "mwosim.MechPanel.uiObject";
    //adds a mech panel (which contains a paperDoll, a heatbar and a weaponPanel)
    public static mechPanelId(mechId : string) : string {
      return mechId + "-mechPanel";
    }
    private static mechSummaryHealthPanelId(mechId : string) : string {
      return mechId + "-mechSummaryHealth";
    }
    private static mechNamePanelId(mechId : string) : string {
      return mechId + "-mechName";
    }
    public static heatNumberPanelId(mechId : string) : string {
      return mechId + "-heatbarNumber";
    }
    private static mechTargetPanelId(mechId : string) : string {
      return mechId + "-mechTarget";
    }
    private static mechHealthAndWeaponsId(mechId : string) : string {
      return mechId + "-mechHealthAndWeapons";
    }
    private static mechDPSPanelId(mechId : string) : string {
      return mechId + "-mechDPSText";
    }
    private static mechBurstPanelId(mechId : string) : string {
      return mechId + "-mechBurstText";
    }
    private static mechTotalDamagePanelId(mechId : string) : string {
      return mechId + "-mechTotalDamageText";
    }
    private mechId : string;
    
    constructor (mech : Mech, team : Team) {
      let mechPanelDiv = MechViewWidgets.cloneTemplate("mechPanel-template");
      super(mechPanelDiv);
      this.storeToDom(MechPanel.MechPanelDomKey);
      this.mechId = mech.getMechId();

      let mechId = mech.getMechId();
      let mechState = mech.getMechState();
      let weaponStateList = mechState.weaponStateList;
      let ammoState = mechState.ammoState;
      let mechPanelContainer = "#" + team + "Team";
      let mechPanelJQ = $(mechPanelDiv);
      //TODO: Mechpanel inserts itself into the DOM in the constructor because weapon panel updates
      //use document.getElementById() for performance reasons. Find a way to use the standard idiom 
      //(where the caller to new MechPanel() is responsible for DOM insertion) without using querySelectors
      //in WeaponPanel updates. Possible solution: implement RenderedWidget and only call render upon dom insertion
      let endPanelJQ = $("#" + MechPanel.mechPanelId(EndMechPanel.getEndMechId(team)));
      mechPanelJQ
        .attr("id", MechPanel.mechPanelId(mechId))
        .attr("data-mech-id", mechId)
        .insertBefore(endPanelJQ);
        
      var mechHealthAndWeaponsDivId = MechPanel.mechHealthAndWeaponsId(mechId);
      mechPanelJQ.find("[class~=mechHealthAndWeapons]")
        .attr("id", mechHealthAndWeaponsDivId);

      var paperDollContainerId = mechId + "-paperDollContainer";
      let paperDollJQ = mechPanelJQ.find("[class~='paperDollContainer']")
                                    .attr("id", paperDollContainerId);
      let paperDoll = new PaperDoll(mechId);
      paperDollJQ.append(paperDoll.domElement);

      let mechHealthNumbersContainerJQ =
              mechPanelJQ.find("[class~='mechHealthNumbersContainer']");
      let mechHealthNumbers = new MechHealthNumbers(mech);
      mechHealthNumbersContainerJQ.append(mechHealthNumbers.domElement);

      var heatbarContainerId = mechId + "-heatbarContainer";
      let heatbarContainerJQ = mechPanelJQ.find("[class~='heatbarContainer']")
                                          .attr("id", heatbarContainerId);
      let heatbar = new Heatbar(mechId, heatbarContainerId);
      heatbarContainerJQ.append(heatbar.domElement);

      var heatNumberId = MechPanel.heatNumberPanelId(mechId);
      mechPanelJQ.find("[class~='heatNumber']")
        .attr("id", heatNumberId);

      var weaponPanelContainerId = WeaponPanel.weaponPanelId(mechId);
      let weaponPanelJQ = mechPanelJQ.find("[class~='weaponPanelContainer']");
      let weaponPanel = new WeaponPanel(mechId, weaponStateList, ammoState, weaponPanelJQ.get(0));

      let mechNameId = MechPanel.mechNamePanelId(mechId);
      mechPanelJQ.find("[class~='titlePanel'] [class~='mechName']")
        .attr("id", mechNameId)
        .html("");

      //delete button
      this.addDeleteMechButton(mechId, team, mechPanelDiv);

      //move button
      this.addMoveMechButton(mechId, team, mechPanelDiv);

      //drag and drop handlers
      DragAndDropHelper.addDragAndDropHandlers(mechPanelDiv);

      //touch handlers
      TouchHelper.addTouchHandlers(mechPanelDiv);

      //Mech stats
      let mechSummaryHealthId = MechPanel.mechSummaryHealthPanelId(mechId);
      mechPanelJQ.find("[class~='statusPanel'] [class~='mechSummaryHealthText']")
        .attr("id", mechSummaryHealthId)
        .html("");

      let mechTargetId = MechPanel.mechTargetPanelId(mechId);
      mechPanelJQ.find("[class~='statusPanel'] [class~='mechTargetText']")
        .attr("id", mechTargetId)
        .html("");

      let mechDPSId = MechPanel.mechDPSPanelId(mechId);
      mechPanelJQ.find("[class~='statusPanel'] [class~='mechDPSText']")
        .attr("id", mechDPSId)
        .html("");

      let mechBurstId = MechPanel.mechBurstPanelId(mechId);
      mechPanelJQ.find("[class~='statusPanel'] [class~='mechBurstText']")
        .attr("id", mechBurstId)
        .html("");

      let mechTotalDamageId = MechPanel.mechTotalDamagePanelId(mechId);
      mechPanelJQ.find("[class~='statusPanel'] [class~='mechTotalDamageText']")
        .attr("id", mechTotalDamageId)
        .html("");

      this.addMechDetailsButton(mechId, mechPanelDiv);
    }
    public static getMechPanel(mechId : string) : MechPanel {
      let domElement = document.getElementById(MechPanel.mechPanelId(mechId));
      if (!domElement) {
        return null;
      }
      return DomStoredWidget.fromDom(domElement, MechPanel.MechPanelDomKey);
    }
    
    public updateMechTitlePanel(mechId : string,
                mechName : string,
                smurfyMechId : string,
                smurfyLayoutId : string)
                : void {
      const SMURFY_BASE_URL= "http://mwo.smurfy-net.de/mechlab#";
      let mechNameId = MechPanel.mechNamePanelId(mechId);
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

    public updateMechStatusPanel(mechId : string, update : MechPanelStatusUpdate) : void {
      let mechSummaryHealthId = MechPanel.mechSummaryHealthPanelId(mechId);
      let mechHealthAndWeaponsDivId = MechPanel.mechHealthAndWeaponsId(mechId);
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
      let mechTargetId = MechPanel.mechTargetPanelId(mechId);
      let mechTargetDiv = document.getElementById(mechTargetId);
      mechTargetDiv.textContent = update.targetMechName;

      //set mech total damage
      let mechTotalDamageId = MechPanel.mechTotalDamagePanelId(mechId);
      let mechTotalDamageDiv = document.getElementById(mechTotalDamageId);
      mechTotalDamageDiv.textContent = Number(update.totalDmg).toFixed(1);

      //set mech dps
      let mechDPSId = MechPanel.mechDPSPanelId(mechId);
      let mechDPSDiv = document.getElementById(mechDPSId);
      mechDPSDiv.textContent = Number(update.dps).toFixed(1);

      //set mech burst
      let mechBurstId = MechPanel.mechBurstPanelId(mechId);
      let mechBurstDiv = document.getElementById(mechBurstId);
      mechBurstDiv.textContent = Number(update.burst).toFixed(1);
    }

    public updateQuirkSkillFlags(mechId : string) {
      let mechJQ = $("#" + MechPanel.mechPanelId(mechId));

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
    private static mechDeleteButtonId(mechId : string) : string {
      return mechId + "-deleteButton";
    }
    private addDeleteMechButton(mechId : string,
                team : Team,
                mechPanelDiv : Element)
                : void {
      let mechPanelJQ = $(mechPanelDiv);
      if (!MechPanel.deleteMechButtonHandler) {
        MechPanel.deleteMechButtonHandler = this.createDeleteMechButtonHandler();
      }
      let deleteIconSVG = MechViewWidgets.cloneTemplate("delete-icon-template");
      let mechDeleteButtonDivId = MechPanel.mechDeleteButtonId(mechId);
      mechPanelJQ.find("[class~='titlePanel'] [class~='deleteMechButton']")
        .attr("id", mechDeleteButtonDivId)
        .attr("data-mech-id", mechId)
        .append(deleteIconSVG)
        .click(MechPanel.deleteMechButtonHandler);
    }

    private createDeleteMechButtonHandler() {
      return function(this : Element) {
        let mechId = $(this).attr("data-mech-id");
        console.log("Deleting " + mechId);
        let result = MechModel.deleteMech(mechId);
        if (!result) {
          throw Error("Error deleting " + mechId);
        }
        MechViewRouter.modifyAppState();
        let mechPanelDivId = MechPanel.mechPanelId(mechId);
        $("#" + mechPanelDivId).remove();

        MechView.resetSimulation();
        MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
      };
    }
    private static deleteMechButtonHandler : () => void; //singleton

    private static moveMechButtonId(mechId : string) : string {
      return mechId + "-moveButton";
    }
    private addMoveMechButton(mechId : string,
                team : Team,
                mechPanelDiv : Element)
                : void {
      let mechPanelJQ = $(mechPanelDiv);
      let moveIconSVG = MechViewWidgets.cloneTemplate("move-icon-template");
      let mechMoveButtonDivId = MechPanel.moveMechButtonId(mechId);
      if (!MechPanel.moveMechButtonHandler) {
        MechPanel.moveMechButtonHandler = this.createMoveMechButtonHandler();
      }
      mechPanelJQ.find("[class~='titlePanel'] [class~='moveMechButton']")
        .attr("id", mechMoveButtonDivId)
        .attr("data-mech-id", mechId)
        .attr("data-dragenabled", "false")
        .append(moveIconSVG)
        .click(MechPanel.moveMechButtonHandler);
    }

    toggleMoveMech(mechId : string) : void {
      let moveMechButtonJQ = $("#" + MechPanel.moveMechButtonId(mechId));
      let dragEnabled = moveMechButtonJQ.attr("data-dragenabled") === "true";
      let mechPanelDivId = MechPanel.mechPanelId(mechId);
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

    private createMoveMechButtonHandler() : () => void {
      let mechPanel = this;
      return function(this: Element) {
        let mechId = $(this).attr("data-mech-id");
        mechPanel.toggleMoveMech(mechId);
      }
    }
    private static moveMechButtonHandler : () => void; //initialized on first addMoveMechButton call

    private addMechDetailsButton(mechId : string, mechPanelDiv : Element) : void {
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

        let mechPanel = this;
        let mechDetailsClickHandler = function() {
          mechDetailsButtonArrowJQ.on("transitionend", mechDetailsTransitionEndHandler);
          if (!mechDetailsButton.expanded) {
            mechPanel.createMechDetails(mechId, mechDetailsJQ.get(0));
          }
        }

        let mechDetailsButton =
            new MechViewWidgets.ExpandButton(mechDetailsButtonJQ.get(0),
                                              mechDetailsClickHandler,
                                              mechDetailsJQ.get(0),
                                              mechDetailsButtonArrowJQ.get(0));
    }

    private createMechDetails(mechId: string, mechDetailsContainer : Element) : void {
      let mechDetails = new MechViewMechDetails.MechDetails(mechId);
      mechDetails.render();
      $(mechDetailsContainer).append(mechDetails.domElement);
    }

    //scrolls to and flashes the selected mech panel
    public highlightMechPanel(mechId : string) : void {
      let mechPanelDivId = MechPanel.mechPanelId(mechId);
      let mechPanelJQ = $("#" + mechPanelDivId);
      mechPanelJQ.get(0).scrollIntoView(false);
      mechPanelJQ.addClass("flashSelected");
      mechPanelJQ.on("animationend", function(data) {
        mechPanelJQ.removeClass("flashSelected")
        mechPanelJQ.off("animationend");
      });
    }

    public highlightOnDragOver(prevDropTargetId : string) {
      if (prevDropTargetId) {
        let prevMechPanel : MechPanel | EndMechPanel = 
          MechPanel.getMechPanel(prevDropTargetId) || EndMechPanel.getEndMechPanel(prevDropTargetId);
        prevMechPanel.domElement.classList.remove("droptarget");
      }
      this.domElement.classList.add("droptarget");
    }

    public moveToTargetMechId(targetMechId : string) {
      let targetMechPanel : MechPanel | EndMechPanel;
      targetMechPanel = MechPanel.getMechPanel(targetMechId) 
                        || EndMechPanel.getEndMechPanel(targetMechId);
      targetMechPanel.domElement.classList.remove("droptarget");

      if (this.mechId === targetMechId) {
        return;
      }
      MechView.resetSimulation();
      let status = false;
      
      if (!EndMechPanel.isEndMechId(targetMechId)) {
        status = MechModel.moveMech(this.mechId, targetMechId);
      } else {
        let team = EndMechPanel.getEndMechIdTeam(targetMechId);
        status = MechModel.moveMechToEndOfList(this.mechId, team);
        console.log("Insert at end: team=" + team);
      }

      if (!status) {
        console.error(`Error moving mech. src=${this.mechId} dest=${targetMechId}`);
      } else {
        console.log(`Drop: src=${this.mechId} dest=${targetMechId}`);
        let srcMechJQ = $(this.domElement);
        srcMechJQ
          .detach()
          .insertBefore(targetMechPanel.domElement);

        this.toggleMoveMech(this.mechId);
        MechViewRouter.modifyAppState();
        MechModelView.refreshView([MechModelView.ViewUpdate.TEAMSTATS]);
      }
    }
  }

  export class EndMechPanel extends DomStoredWidget {
    private static readonly EndMechPanelDomKey = "mwosim.EndMechPanel.uiObject";
    private static readonly EndMechIdPrefix = "end-mech-fake-id-";
    public static getEndMechId(team: Team) {
      return EndMechPanel.EndMechIdPrefix + team;
    }
    public static isEndMechId(mechId : string) {
      return mechId.startsWith(EndMechPanel.EndMechIdPrefix);
    }
    public static getEndMechIdTeam = function(mechId : string) : Team {
      if (EndMechPanel.isEndMechId(mechId)) {
        return mechId.substring(EndMechPanel.EndMechIdPrefix.length);
      } else {
        return null;
      }
    }
    constructor(team: Team) {
      let mechPanelDiv = MechViewWidgets.cloneTemplate("endMechPanel-template");
      super(mechPanelDiv);
      this.storeToDom(EndMechPanel.EndMechPanelDomKey);

      let mechPanelJQ = $(mechPanelDiv);
      let mechId = EndMechPanel.getEndMechId(team);
      mechPanelJQ
        .attr("id", MechPanel.mechPanelId(mechId))
        .attr("data-mech-id", mechId)
      DragAndDropHelper.addDragAndDropHandlers(mechPanelDiv);
    }
    public static getEndMechPanel(mechId : string) : EndMechPanel {
      let domElement = document.getElementById(MechPanel.mechPanelId(mechId));
      if (!domElement) {
        return null;
      }
      return DomStoredWidget.fromDom(domElement, EndMechPanel.EndMechPanelDomKey);
    }
    public highlightOnDragOver(prevDropTargetId : string) {
      if (prevDropTargetId) {
        let prevMechPanel : MechPanel | EndMechPanel = 
          MechPanel.getMechPanel(prevDropTargetId) || EndMechPanel.getEndMechPanel(prevDropTargetId);
        prevMechPanel.domElement.classList.remove("droptarget");
      }
      this.domElement.classList.add("droptarget");
    }
  }

  class DragAndDropHelper {
    private static prevDropTarget : string;
    //NOTE: The use of static prevDropTarget means you can only drag one item at a time. Could be an
    //issue on multi-touch devices
    public static addDragAndDropHandlers(mechPanelDiv: Element): void {
      let mechPanelJQ = $(mechPanelDiv);
      if (!DragAndDropHelper.mechOnDragHandler) {
        DragAndDropHelper.mechOnDragHandler = this.createMechOnDragHandler();
      }
      mechPanelJQ.on("dragstart", DragAndDropHelper.mechOnDragHandler);

      if (!DragAndDropHelper.mechOnDragOverHandler) {
        DragAndDropHelper.mechOnDragOverHandler = this.createMechOnDragOverHandler();
      }
      mechPanelJQ.on("dragover", DragAndDropHelper.mechOnDragOverHandler);

      if (!DragAndDropHelper.mechOnDropHandler) {
        DragAndDropHelper.mechOnDropHandler = this.createMechOnDropHandler();
      }
      mechPanelJQ.on("drop", DragAndDropHelper.mechOnDropHandler);
    }

    private static createMechOnDragHandler(): JQEventHandler {
      return function (this: Element,
        jqEvent: JQuery.Event) {
        let mechId = $(this).attr("data-mech-id");
        let origEvent = jqEvent.originalEvent as DragEvent;
        origEvent.dataTransfer.setData("text/plain", mechId);
        origEvent.dataTransfer.effectAllowed = "move";
        console.log("Drag start: " + mechId);
      }
    }
    public static mechOnDragHandler: JQEventHandler = null;

    private static createMechOnDragOverHandler(): JQEventHandler {
      return function (this: Element,
        jqEvent: JQuery.Event) {
        let thisJQ = $(this);
        let mechId = thisJQ.attr("data-mech-id");
        let origEvent = jqEvent.originalEvent as DragEvent;

        jqEvent.preventDefault();
        //allow move on drop
        origEvent.dataTransfer.dropEffect = "move";
        if (DragAndDropHelper.prevDropTarget !== mechId) {
          let mechPanel : MechPanel | EndMechPanel = 
              MechPanel.getMechPanel(mechId) || EndMechPanel.getEndMechPanel(mechId);
          mechPanel.highlightOnDragOver(DragAndDropHelper.prevDropTarget);

          DragAndDropHelper.prevDropTarget = mechId;
        }
      }
    }
    public static mechOnDragOverHandler: JQEventHandler = null;

    private static createMechOnDropHandler(): JQEventHandler {
      return function (this: Element,
        jqEvent: JQuery.Event): void {
        let thisJQ = $(this);
        let dropTargetMechId = thisJQ.attr("data-mech-id");
        let origEvent = jqEvent.originalEvent as DragEvent;
        let srcMechId = origEvent.dataTransfer.getData("text/plain");
        jqEvent.preventDefault();
        let srcMechPanel = MechPanel.getMechPanel(srcMechId);

        srcMechPanel.moveToTargetMechId(dropTargetMechId);
        DragAndDropHelper.prevDropTarget = null;
      }
    }
    public static mechOnDropHandler: JQEventHandler = null;
  }

  class TouchHelper {
    public static addTouchHandlers(mechPanelDiv : Element) : void {
      $(mechPanelDiv)
          .on("touchstart", TouchHelper.touchStartHandler)
          .on("touchend", TouchHelper.touchEndHandler)
          .on("touchcancel", TouchHelper.touchCancelHandler)
          .on("touchmove", TouchHelper.touchMoveHandler);
    }

    private static readonly TouchIconId = "touchMoveIcon";
    private static touchIcon : HTMLElement;
    private static isTouchDragging : boolean;
    private static currDropTarget : Element;
    private static touchStartHandler(this: Element, event : JQuery.Event) : void {
      let thisJQ = $(this);
      if (thisJQ.attr("draggable") === "true") {
        let startMechId = TouchHelper.findMechId(this as HTMLElement);
        console.log(`Touch start mechId: ${startMechId}`);

        let mechName = MechModelView.getMechName(startMechId);

        TouchHelper.isTouchDragging = true;
      } else {
        return;
      }
    }

    private static touchEndHandler(this: Element, event : JQuery.Event) : void {
      if (!TouchHelper.isTouchDragging) {
        return;
      }
      let touchEvent = event.originalEvent as TouchEvent;
      let srcMechId = TouchHelper.findMechId(touchEvent.target as HTMLElement);
      let dropMechId = TouchHelper.findMechId(TouchHelper.currDropTarget as HTMLElement);
      console.log(`Touch end srcMechId: ${srcMechId} dropMechId: ${dropMechId}`);

      if (srcMechId && dropMechId) {
        let mechPanel = MechPanel.getMechPanel(srcMechId);
        mechPanel.moveToTargetMechId(dropMechId);
      } else {
        console.warn(Error(`Touch end null mechId: src: ${srcMechId} dest: ${dropMechId}`))
      }

      TouchHelper.isTouchDragging = false;
      TouchHelper.currDropTarget = null;
    }

    private static touchCancelHandler(this: Element, event : JQuery.Event) : void {
      if (!TouchHelper.isTouchDragging) {
        return;
      }

      TouchHelper.isTouchDragging = false;
      TouchHelper.currDropTarget = null;
    }

    private static touchMoveHandler(this: Element, event : JQuery.Event) : void {
      if (!TouchHelper.isTouchDragging) {
        return;
      }
      let touchEvent = event.originalEvent as TouchEvent;
      touchEvent.preventDefault();
      let touch = touchEvent.touches[0];
      let touchTargetElem = document.elementFromPoint(touch.clientX, touch.clientY);
      let prevDropTargetMechId = TouchHelper.findMechId(TouchHelper.currDropTarget as HTMLElement);
      let newDropTargetMechId = TouchHelper.findMechId(touchTargetElem as HTMLElement);

      if (newDropTargetMechId !== prevDropTargetMechId) {
        let newDropTargetMechPanel : MechPanel | EndMechPanel = 
            MechPanel.getMechPanel(newDropTargetMechId) ||
            EndMechPanel.getEndMechPanel(newDropTargetMechId);
        if (newDropTargetMechPanel) {
          newDropTargetMechPanel.highlightOnDragOver(prevDropTargetMechId);
          TouchHelper.currDropTarget = touchTargetElem;
        }
      }
    }

    private static findMechId(element : HTMLElement) : string {
      let currElement = element;
      while (currElement 
            && currElement.parentElement 
            && (currElement.parentElement instanceof HTMLElement)) {
        let mechIdAttr = currElement.attributes.getNamedItem("data-mech-id");
        if (mechIdAttr) {
          return mechIdAttr.value;
        } else {
          currElement = currElement.parentElement;
        }
      }
      return null;
    }

    //TODO: positioning of touchIcon is still erratic and interferes with the touchMove
    //handler. See what causes the problem.
    private static showTouchIcon(event : TouchEvent, element : Element, mechName: string) : void {
      if (TouchHelper.touchIcon) {
        $(TouchHelper.touchIcon).remove();
      }

      TouchHelper.touchIcon = MechViewWidgets.cloneTemplate("touchmove-icon-template") as HTMLElement;
      let touchIconJQ = $(TouchHelper.touchIcon)
                              .appendTo(element);
      touchIconJQ.find(".touchStartItem").text(mechName);

      TouchHelper.moveTouchIcon(event);
    }

    private static moveTouchIcon(event : TouchEvent) : void {
      let touch = event.touches[0];
      if (TouchHelper.touchIcon) {
        let left = Math.floor(touch.clientX).toString() + "px";
        let top = Math.floor(touch.clientY).toString() + "px";
        TouchHelper.touchIcon.style.left = left;
        TouchHelper.touchIcon.style.top = top;
      }
    }
    private static hideTouchIcon(event: TouchEvent) : void {
      TouchHelper.touchIcon.remove(); 
    }
  }

  
}
