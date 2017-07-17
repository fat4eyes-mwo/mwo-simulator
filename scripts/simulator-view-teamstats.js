"use strict";


var MechViewTeamStats = MechViewTeamStats || (function() {
  var teamStatsContainerId = function(team) {
    return team + "TeamStatsContainer";
  }
  var teamStatsId = function(team) {
    return team + "-teamStatsPanel";
  }
  var teamDisplayName = function(team) {
    let displayNameMap = {"blue" : "Blue team", "red" : "Red team"};
    return displayNameMap[team];
  }
  var teamMechPipsContainerId = function(team) {
    return team + "-mechPipsContainer";
  }
  var teamMechPipId = function(mechId) {
    return mechId + "-mechPip";
  }
  var teamLiveMechsId = function(team) {
    return team + "-liveMechs";
  }
  var teamHealthValueId = function(team) {
    return team + "-teamHealthValue";
  }
  var teamDamageId = function(team) {
    return team + "-teamDamage";
  }
  var teamDPSValueId = function(team) {
    return team + "-teamDPSValue";
  }
  var teamBurstDamageId = function(team) {
    return team + "-teamBurstDamage";
  }
  var teamSettingsButtonId = function(team) {
    return team + "-teamSettingsButton"
  }
  var teamSettingsId = function(team) {
    return team + "-teamSettings";
  }
  var addTeamStatsPanel = function(team, mechIds) {
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    let teamStatsDiv = MechViewWidgets.cloneTemplate("teamStats-template");
    $(teamStatsDiv)
      .attr("id", teamStatsId(team))
      .attr("data-team", team)
      .addClass(team)
      .appendTo("#" + teamStatsContainerPanelId);
    //Change team name
    $("#" + teamStatsContainerPanelId + " [class~=teamName]")
            .html(teamDisplayName(team));

    //Add mech button
    MechViewAddMech.createAddMechButton(team, teamStatsContainerPanelId);

    //mech pips
    let teamMechPipsContainerDivId = teamMechPipsContainerId(team);
    $("#" + teamStatsContainerPanelId + " [class~=mechPipsContainer]")
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
        .appendTo("#" + teamMechPipsContainerDivId);
    }
    //Mech health (liveMechs and teamHealthValue)
    $("#" + teamStatsContainerPanelId + " [class~=liveMechs]")
      .attr("id", teamLiveMechsId(team));
    $("#" + teamStatsContainerPanelId + " [class~=teamHealthValue]")
      .attr("id", teamHealthValueId(team));
    //teamDMG
    $("#" + teamStatsContainerPanelId + " [class~=teamDamageValue]")
      .attr("id", teamDamageId(team));
    //teamDPS
    $("#" + teamStatsContainerPanelId + " [class~=teamDPSValue]")
      .attr("id", teamDPSValueId(team));
    //teamBurstDamage
    $("#" + teamStatsContainerPanelId + " [class~=teamBurstDamageValue]")
      .attr("id", teamBurstDamageId(team));
    //team settings
    $("#" + teamStatsContainerPanelId + " [class~=teamSettingsButton]")
      .attr("data-team", team)
      .attr("id", teamSettingsButtonId(team))
      .click(teamSettingsButtonHandler);
    $("#" + teamStatsContainerPanelId + " [class~=teamSettings]")
      .attr("data-team", team)
      .attr("id", teamSettingsId(team));
    //Populate the team settings panel
    for (let patternType of patternTypes) {
      populateTeamPattern(team, patternType);
    }
  }
  var mechPipClickHandler = function(data) {
    let thisJQ = $(this);
    let mechId = thisJQ.attr("data-mech-id");
    let mechPanelDivId = MechView.mechPanelId(mechId);
    let mechPanelJQ = $("#" + mechPanelDivId);
    mechPanelJQ[0].scrollIntoView(false);
    mechPanelJQ.addClass("flashSelected");
    mechPanelJQ.on("animationend", function(data) {
      mechPanelJQ.removeClass("flashSelected")
      mechPanelJQ.off("animationend");
    });
  }

  //store selected value (since we do a lot of refreshViews which recreates this panel)
  var patternTypes;
  //values used to initialize the contents of the team settings panel.
  var initPatternTypes = function() {
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

  var selectedPatterns = {}; //format is {<team>: {<patternTypeId>: <pattern>, ...}}
  var patternLists = {} //format is {<patternTypeId>: [patternList]}

  var findPatternWithId = function(patternId, patternList) {
    for (let entry of patternList) {
      if (entry.id === patternId) {
        return entry.pattern;
      }
    }
    return null;
  }
  var findPatternTypeWithId = function(patternTypeId) {
    for (let patternType of patternTypes) {
      if (patternType.id === patternTypeId) {
        return patternType;
      }
    }
    return null;
  }
  var populateTeamPattern = function(team, patternType) {
    if (!patternLists[patternType.id]) {
      patternLists[patternType.id] = patternType.patternsFunction();
    }

    let teamStatsContainerPanelId = teamStatsContainerId(team);
    let teamPatternValueJQ =
      $("#" + teamStatsContainerPanelId + " [class~=" + patternType.classNamePrefix + "Value]");

    let teamPatternDescJQ =
      $("#" + teamStatsContainerPanelId + " [class~=" + patternType.classNamePrefix + "Desc]")

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
      let selectedValue=teamPatternValueJQ.val();
      let selectedOption = teamPatternValueJQ.find("[value='" + selectedValue + "']");

      teamPatternDescJQ.html(selectedOption.attr("data-description"));
      selectedPatterns[team][patternType.id] = selectedValue;

      let pattern = findPatternWithId(selectedValue, patternLists[patternType.id]);
      patternType.setTeamPatternFunction(team, pattern);
    });
  }

  //assigns the selected patterns for the given team
  var setSelectedTeamPatterns = function(team) {
    let currSelectedPatterns = selectedPatterns[team];
    for (let patternTypeId in currSelectedPatterns) {
      let patternType = findPatternTypeWithId(patternTypeId);
      let patternId = currSelectedPatterns[patternTypeId];
      let pattern = findPatternWithId(patternId, patternLists[patternType.id]);
      patternType.setTeamPatternFunction(team, pattern);
    }
  }

  var teamSettingsButtonHandler = function() {
    let team = $(this).attr("data-team");
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    let teamSettingsJQ =
      $("#" + teamStatsContainerPanelId + " [class~=teamSettings]");
    let teamSettingsArrowJQ =
      $("#" + teamStatsContainerPanelId + " [class~=teamSettingsButtonArrow]");
    if (teamSettingsJQ.hasClass("expanded")) {
      teamSettingsJQ.removeClass("expanded");
      teamSettingsArrowJQ.removeClass("expanded");
    } else {
      teamSettingsJQ.addClass("expanded");
      teamSettingsArrowJQ.addClass("expanded");
    }
  }

  var updateTeamStats = function(team, mechHealthList, damage, dps, burstDamage) {
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

      let color = MechView.damageColor(percentHealth, MechView.healthDamageGradient);
      mechPipDiv.style.color = color;
      if (isAlive) {
        mechPipDiv.innerHTML = "&#9632;";
      } else {
        mechPipDiv.innerHTML = "&#9633;";
      }

      liveMechs += isAlive ? 1 : 0;
      totalTeamCurrHealth += isAlive ? currHealth : 0;
      totalTeamMaxHealth += maxHealth;
    }
    //live mechs
    let liveMechsDiv = document.getElementById(teamLiveMechsId(team));
    let totalMechs = mechHealthList.length;
    let percentAlive = totalMechs > 0 ? liveMechs / totalMechs : 0;
    let color = MechView.damageColor(percentAlive, MechView.healthDamageGradient);
    liveMechsDiv.style.color = color;
    liveMechsDiv.innerHTML = liveMechs + "/" + totalMechs;

    //team health
    let healthValueDiv = document.getElementById(teamHealthValueId(team));
    let teamHealthPercent = totalTeamMaxHealth > 0 ?
            totalTeamCurrHealth / totalTeamMaxHealth : 0;
    color = MechView.damageColor(teamHealthPercent, MechView.healthDamageGradient);
    healthValueDiv.style.color = color;
    healthValueDiv.innerHTML = "(" + Number(teamHealthPercent * 100).toFixed(1) + "%)";

    //damage
    let teamDamageDiv = document.getElementById(teamDamageId(team));
    teamDamageDiv.innerHTML = Number(damage).toFixed(1);
    //dps
    let teamDPSValueDiv = document.getElementById(teamDPSValueId(team));
    teamDPSValueDiv.innerHTML = Number(dps).toFixed(1);
    //burst
    let teamBurstDamageDiv = document.getElementById(teamBurstDamageId(team));
    teamBurstDamageDiv.innerHTML = Number(burstDamage).toFixed(1);
  }

  var clearTeamStats = function(team) {
    let teamStatsContainerPanelId = teamStatsContainerId(team);
    $("#" + teamStatsContainerPanelId).empty();
  }

  return {
    initPatternTypes: initPatternTypes,
    addTeamStatsPanel: addTeamStatsPanel,
    updateTeamStats : updateTeamStats,
    setSelectedTeamPatterns: setSelectedTeamPatterns,
    clearTeamStats: clearTeamStats,
  }
})();
