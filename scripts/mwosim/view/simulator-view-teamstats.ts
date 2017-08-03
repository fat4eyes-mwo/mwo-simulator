"use strict";

namespace MechViewTeamStats {
  type Team = MechModelCommon.Team;
  type Pattern = ModelPatterns.Pattern;
  type PatternFunction = ModelPatterns.PatternFunction;
  type MechHealthToView = MechModelView.MechHealthToView;

  var teamStatsContainerId = function(team : Team) : string {
    return team + "-teamStatsContainer";
  }
  var teamStatsId = function(team : Team) : string {
    return team + "-teamStatsPanel";
  }
  var teamDisplayName = function(team : Team) : string {
    let displayNameMap : {[index:string] : string} = {"blue" : "Blue team", "red" : "Red team"};
    return displayNameMap[team];
  }
  var teamMechPipsContainerId = function(team : Team) : string {
    return team + "-mechPipsContainer";
  }
  var teamMechPipId = function(mechId : string) : string {
    return mechId + "-mechPip";
  }
  var teamLiveMechsId = function(team : Team) : string {
    return team + "-liveMechs";
  }
  var teamHealthValueId = function(team : Team) : string {
    return team + "-teamHealthValue";
  }
  var teamDamageId = function(team : Team) : string {
    return team + "-teamDamage";
  }
  var teamDPSValueId = function(team : Team) : string {
    return team + "-teamDPSValue";
  }
  var teamBurstDamageId = function(team : Team) : string {
    return team + "-teamBurstDamage";
  }
  var teamSettingsButtonId = function(team : Team) : string {
    return team + "-teamSettingsButton"
  }
  var teamSettingsId = function(team : Team) : string {
    return team + "-teamSettings";
  }
  export var addTeamStatsPanel = function(team : Team, mechIds : string[]) {
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    let teamStatsDiv = MechViewWidgets.cloneTemplate("teamStats-template");
    $(teamStatsDiv)
      .attr("id", teamStatsId(team))
      .attr("data-team", team)
      .addClass(team)
      .appendTo("#" + teamStatsContainerPanelId);
    //Change team name
    let teamStatsContainerJQ = $(`#${teamStatsContainerPanelId}`);
    teamStatsContainerJQ.find("[class~=teamName]")
      .text(teamDisplayName(team));

    //Add mech button
    MechViewAddMech.createAddMechButton(team, teamStatsContainerPanelId);

    //mech pips
    let teamMechPipsContainerDivId = teamMechPipsContainerId(team);
    let teamMechPipsJQ =
      teamStatsContainerJQ.find("[class~=mechPipsContainer]")
        .attr("id", teamMechPipsContainerDivId);
    for (let mechId of mechIds) {
      let mechName = MechModelView.getMechName(mechId, team);
      mechName = mechName ? mechName : "";
      let mechPipSpan = MechViewWidgets.cloneTemplate("mechPip-template");
      $(mechPipSpan)
        .attr("id", teamMechPipId(mechId))
        .attr("data-team", team)
        .attr("data-mech-id", mechId)
        .attr("title", mechName)
        .click(mechPipClickHandler)
        .appendTo(teamMechPipsJQ);
    }
    //Mech health (liveMechs and teamHealthValue)
    teamStatsContainerJQ.find("[class~=liveMechs]")
      .attr("id", teamLiveMechsId(team));
    teamStatsContainerJQ.find("[class~=teamHealthValue]")
      .attr("id", teamHealthValueId(team));
    //teamDMG
    teamStatsContainerJQ.find("[class~=teamDamageValue]")
      .attr("id", teamDamageId(team));
    //teamDPS
    teamStatsContainerJQ.find("[class~=teamDPSValue]")
      .attr("id", teamDPSValueId(team));
    //teamBurstDamage
    teamStatsContainerJQ.find("[class~=teamBurstDamageValue]")
      .attr("id", teamBurstDamageId(team));
    //team settings
    teamStatsContainerJQ.find("[class~=teamSettingsButton]")
      .attr("data-team", team)
      .attr("id", teamSettingsButtonId(team))
      .click(teamSettingsButtonHandler);
    teamStatsContainerJQ.find("[class~=teamSettings]")
      .attr("data-team", team)
      .attr("id", teamSettingsId(team));
    //Populate the team settings panel
    for (let patternType of patternTypes) {
      populateTeamPattern(team, patternType);
    }
  }
  var mechPipClickHandler = function(this : Element, data : any) {
    let thisJQ = $(this);
    let mechId = thisJQ.attr("data-mech-id");
    MechViewMechPanel.highlightMechPanel(mechId);
  }

  //store selected value (since we do a lot of refreshViews which recreates this panel)
  type GetPatternFunction = () => Pattern[];
  interface PatternType {
    id : string,
    patternsFunction : GetPatternFunction,
    classNamePrefix : string,
    setTeamPatternFunction : MechModelView.SetTeamPatternFunction;
  }
  var patternTypes : PatternType[];
  //values used to initialize the contents of the team settings panel.
  export var initPatternTypes = function() : void {
    patternTypes = [
      {
        id : "teamTargetMechComponent",
        //function that returns the patternList for the type
        patternsFunction : MechTargetComponent.getPatterns,
        //prefix of the css class name for the UI divs for the patterntype
        classNamePrefix: "teamTargetMechComponent",
        //function used to assign the pattern to MechModel.Mech objects
        setTeamPatternFunction : MechModelView.setTeamComponentTargetPattern,
      },
      {
        id : "teamFirePattern",
        patternsFunction : MechFirePattern.getPatterns,
        classNamePrefix: "teamFirePattern",
        setTeamPatternFunction : MechModelView.setTeamFirePattern,
      },
      {
        id : "teamTargetMechPattern",
        patternsFunction : MechTargetMech.getPatterns,
        classNamePrefix: "teamTargetMechPattern",
        setTeamPatternFunction : MechModelView.setTeamMechTargetPattern,
      },
      {
        id : "teamAccuracy",
        patternsFunction : MechAccuracyPattern.getPatterns,
        classNamePrefix: "teamAccuracy",
        setTeamPatternFunction : MechModelView.setTeamAccuracyPattern,
      },
    ];
  }

  //format is {<team>: {<patternTypeId>: <patternId>, ...}}
  var selectedPatterns : {[index:string] : {[index:string] : string}} = {};
  //format is {<patternTypeId>: [patternList]}
  var patternLists : {[index:string] : Pattern[]}= {}

  var findPatternWithId = function(patternId : string, patternList : Pattern[]) : PatternFunction {
    for (let entry of patternList) {
      if (entry.id === patternId) {
        return entry.pattern;
      }
    }
    return null;
  }
  var findPatternTypeWithId = function(patternTypeId : string) : PatternType {
    for (let patternType of patternTypes) {
      if (patternType.id === patternTypeId) {
        return patternType;
      }
    }
    return null;
  }
  var populateTeamPattern =
      function(team : Team, patternType : PatternType) : void {
    if (!patternLists[patternType.id]) {
      patternLists[patternType.id] = patternType.patternsFunction();
    }

    let teamStatsContainerJQ = $(`#${teamStatsContainerId(team)}`);
    let teamPatternValueJQ =
      teamStatsContainerJQ.find(`[class~=${patternType.classNamePrefix}Value]`);

    let teamPatternDescJQ =
      teamStatsContainerJQ.find(`[class~=${patternType.classNamePrefix}Desc]`)

    teamPatternValueJQ.empty();
    selectedPatterns[team] = selectedPatterns[team] ? selectedPatterns[team] : {};
    let selectedPattern = selectedPatterns[team][patternType.id];
    for (let patternEntry of patternLists[patternType.id]) {
      $("<option></option>")
        .attr("value", patternEntry.id)
        .attr("data-description", patternEntry.description)
        .html(patternEntry.name)
        .appendTo(teamPatternValueJQ);

        //if it is the currently selected pattern
        if (selectedPatterns[team][patternType.id] === patternEntry.id) {
          teamPatternValueJQ.val(patternEntry.id);
          teamPatternDescJQ.html(patternEntry.description);
        }
        //if default and no selected pattern, set it as the selected pattern
        if (patternEntry.default && !selectedPattern) {
          teamPatternValueJQ.val(patternEntry.id);
          teamPatternDescJQ.html(patternEntry.description);
          selectedPatterns[team][patternType.id]  = patternEntry.id;
        }
    }
    //change handler
    teamPatternValueJQ.on('change', (data) => {
      let selectedValue : string = String(teamPatternValueJQ.val());
      let selectedOption = teamPatternValueJQ.find(`[value='${selectedValue}']`);

      teamPatternDescJQ.html(selectedOption.attr("data-description"));
      selectedPatterns[team][patternType.id] = selectedValue;

      let pattern = findPatternWithId(selectedValue, patternLists[patternType.id]);
      patternType.setTeamPatternFunction(team, pattern);
    });
  }

  //assigns the selected patterns for the given team
  export var setSelectedTeamPatterns = function(team : Team) : void {
    let currSelectedPatterns = selectedPatterns[team];
    for (let patternTypeId in currSelectedPatterns) {
      if (!currSelectedPatterns.hasOwnProperty(patternTypeId)) {
        continue;
      }
      let patternType = findPatternTypeWithId(patternTypeId);
      let patternId = currSelectedPatterns[patternTypeId];
      let pattern = findPatternWithId(patternId, patternLists[patternType.id]);
      patternType.setTeamPatternFunction(team, pattern);
    }
  }

  var teamSettingsButtonHandler = function(this : Element) : void {
    let team = $(this).attr("data-team");
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    let teamStatsContainerJQ = $("#" + teamStatsContainerPanelId);
    let teamSettingsJQ =
      teamStatsContainerJQ.find("[class~=teamSettings]");
    let teamSettingsArrowJQ =
      teamStatsContainerJQ.find("[class~=teamSettingsButtonArrow]");
    if (teamSettingsJQ.hasClass("expanded")) {
      teamSettingsJQ.removeClass("expanded");
      teamSettingsArrowJQ.removeClass("expanded");
    } else {
      teamSettingsJQ.addClass("expanded");
      teamSettingsArrowJQ.addClass("expanded");
    }
  }

  //TODO Wrap params in an object
  export var updateTeamStats =
      function(team : Team,
              mechHealthList : MechHealthToView[],
              damage : number,
              dps : number,
              burstDamage : number)
              : void {
    let totalTeamCurrHealth = 0;
    let totalTeamMaxHealth = 0;
    let liveMechs = 0;
    for (let mechHealth of mechHealthList) {
      let mechId = mechHealth.mechId;
      let currHealth = mechHealth.currHealth;
      let maxHealth = mechHealth.maxHealth;
      let isAlive = mechHealth.isAlive;

      let mechPipDiv = document.getElementById(teamMechPipId(mechId));
      let percentHealth = Number(currHealth) / Number(maxHealth);

      let pipColor = MechViewWidgets.damageColor(percentHealth, MechViewWidgets.healthDamageGradient);
      mechPipDiv.style.color = pipColor;
      if (isAlive) {
        mechPipDiv.textContent = "\u25A0"; //solid box
      } else {
        mechPipDiv.textContent = "\u25A1"; //hollow box
      }

      liveMechs += isAlive ? 1 : 0;
      totalTeamCurrHealth += isAlive ? currHealth : 0;
      totalTeamMaxHealth += maxHealth;
    }
    //live mechs
    let liveMechsDiv = document.getElementById(teamLiveMechsId(team));
    let totalMechs = mechHealthList.length;
    let percentAlive = totalMechs > 0 ? liveMechs / totalMechs : 0;
    let color = MechViewWidgets.damageColor(percentAlive, MechViewWidgets.healthDamageGradient);
    liveMechsDiv.style.color = color;
    liveMechsDiv.textContent = liveMechs + "/" + totalMechs;

    //team health
    let healthValueDiv = document.getElementById(teamHealthValueId(team));
    let teamHealthPercent = totalTeamMaxHealth > 0 ?
            totalTeamCurrHealth / totalTeamMaxHealth : 0;
    color = MechViewWidgets.damageColor(teamHealthPercent, MechViewWidgets.healthDamageGradient);
    healthValueDiv.style.color = color;
    healthValueDiv.textContent =
        `(${Number(teamHealthPercent * 100).toFixed(1)}%)`;

    //damage
    let teamDamageDiv = document.getElementById(teamDamageId(team));
    teamDamageDiv.textContent = Number(damage).toFixed(1);
    //dps
    let teamDPSValueDiv = document.getElementById(teamDPSValueId(team));
    teamDPSValueDiv.textContent = Number(dps).toFixed(1);
    //burst
    let teamBurstDamageDiv = document.getElementById(teamBurstDamageId(team));
    teamBurstDamageDiv.textContent = Number(burstDamage).toFixed(1);
  }

  export var clearTeamStats = function(team : Team) {
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    $("#" + teamStatsContainerPanelId).empty();
  }
}
