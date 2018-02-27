# mwo-simulator
[Mech Loadout Simulator](http://www.4eye-labs.net/mwo-simulator/) for Mechwarrior Online

* [Quick Start](#quick-start-guide)
* [Slightly Less Quick start](#slightly-less-quick-start-guide)
* [Reporting Bugs](#guide-for-reporting-bugs)
* [Current Features](#current-features)
* [Unsimulated Mechanics](#currently-unsimulated-mechanics)
* [Code Guide](#code-guide)
* [Update Info](#update-info)

# Quick Start Guide

1. Click 'Add Mech'.
2. Paste [Smurfy](http://mwo.smurfy-net.de/) URL.
3. Click 'Load'.
4. Click OK once mech is loaded from smurfy.
5. Add more mechs if you want. Click the 'Range' Button if you want to change the engagement range.
6. Click 'Run'.
7. Click 'Save' to save changes and share your simulation.
8. Click 'Reset Simulation' to bring dead mechs back to life and start again.

# Slightly Less Quick Start Guide

1-5. Same as above.

6. Click 'Settings' to view and set various Team Settings.
7. Click Speed setting (1x to 8x) to set simulation speed.
8. Click 'Details' to see the mech's quirks and skills.
9. Click 'Skills'->'Load Skills' to load skills from [kitlaan](https://kitlaan.gitlab.io/mwoskill/).
10. Click 'Run'.
11. Click 'Save' to save changes and share your simulation.
12. Click 'Reset Simulation' to bring dead mechs back to life and start again.

# Guide for Reporting Bugs

1. Press Ctrl-Shift-i (on Chrome or Firefox) to bring up the Developer Tools.
2. Click the Console Tab.
3. Right-click on the console window and click Save As...
4. Go to the project [issue tracker](https://github.com/fat4eyes-mwo/mwo-simulator/issues) to report the issue. Make sure to include the console log and the URL where the simulator failed.
5. If you are using Edge or Internet Explorer, contact your local exorcist and have these hellspawn banished back to the pit from which they came. (Edge and IE are not supported).

# Current Features

* Uses current mech, weapon and heatsink data from smurfy's.
* Most of the heat and damage mechanics (see exceptions below).
* Simulates duration (for burn weapons), travel time (for velocity weapons) and jam bar mechanics (for RACs).
* Simulates the following new tech weapons: All lasers, all PPCs, all Gauss rifles, ATMs, MRMs, RACs. Also rocket launchers.
* Simulates effects of heatsink and ammo box destruction, as well as side torso loss for Clan XL/Light engines.
* Simulates weapon spread for the following weapons: All LRMs, all SRMs, all ATMs, all MRMs. Also splash damage for cERPPCs.
* Supports heat, cooldown, duration, velocity and range multipliers for IS and clan mechs.
* Simulates effects of mech quirks (see exceptions below).

# Currently Unsimulated Mechanics

* Damage spread for LBX (high priority)
* Exponential dropoff for cLRMs below min range (right now they do 0 damage below min range)
* Environmental heat effects
* Targeting computer effects
* Crits and weapon/heatsink/ammo destruction. Right now weapons/heatsinks/ammo are only destroyed if the component they are on are destroyed. The crux here is to find a way to simulate this randomness deterministically.
* Special weapon crit/damage effects (this includes LBX,SRM crits, MG crits and flamer heat).
* Ammo explosions

# Code Guide

The project uses Typescript, and the project build configuration `tsconfig.json` is in the root project directory. The transpiled `.js` file is outputted in `build/`.

For those interested in looking at the code, the most interesting stuff can be found in `scripts/model/simulator-logic.ts`. It contains the simulation loop and most of the mechanics of the simulation. The main loop function is `step()`.

The definition of the data structures used by the simulation are in `scripts/model/simulator-model*.ts`. The important bits are in `class` declarations, most of the other code there is just data conversion from smurfy format to the one used by the simulation.

The weapon fire patterns (which determine how mechs choose what weapons to fire) are in `scripts/model/simulator-firepattern.ts`. Target component patterns (which determine what components a mech targets) are in `scripts/model/simulator-componenttarget.ts`. Target mech patterns (which enemy mech to target) are in `scripts/model/simulator-mechtarget.ts`. And weapon accuracy patterns (which determine how a weapon or mech spreads damage) are in `scripts/simulator-accuracypattern.ts`. Read the comments in those files if you want to try adding your own patterns and have them appear in the UI.

The UI code can be found in the files `scripts/view/simulator-view*.ts`. At the moment I woudn't suggest looking at these as they're a bit of a mess, and a big refactoring is coming soon.

The main entry point of the program is in `scripts/main/simulator.ts`.

# Update Info

* 2017-02-28: Fix to https mixed mode error on loading skills. Added useful setup links.
* 2017-02-22: Update app with data from 2018 Feb 21 patch.
* 2017-01-31: Update for quirk name changes (ppc->ppcfamily) and added MRM quirk data. Internal testing changes (testListQuirks).
* 2017-01-24: Fixes for kitlaan jsonbin api changes, update app with data from 2018 Jan 23 patch.
* 2017-12-28: Fixes for some breaking reported bugs (finally). Thanks for all the bug reports.
* 2017-12-14: Update app with data from 2017 Dec 13 patch.
* 2017-11-15: Update app with data from 2017 Nov 14 patch.
* 2017-10-20: Update app with data from 2017 Oct 18 patch.
* 2017-09-20: Updated app with data from 2017 Sep 19 patch. Various internal refactorings (event queue).
* 2017-08-22: Updated app with data from 2017 Aug 17 patch (various omnipod set quirk data).
* 2017-08-17: Added support for drag and drop on touch devices.
* 2017-08-13: Mech skills (using kitlaan's skill planner).
* 2017-08-08: Omnipod full set bonuses.
* 2017-08-05: Added mech details popup. Currently contains list of mech's quirks.
* 2017-08-02: Added 'Expected Value' setting for simulating UAC jams.
* 2017-08-01: Added Maximize DPS firing pattern. Various internal implementation changes (changed over to Typescript, various refactorings).
* 2017-07-27: Added drag and drop mech reordering.
* 2017-07-24: Completed rocket launcher implementation.
* 2017-07-23: Implemented RAC mechanics.
* 2017-07-19: MRM spread. Priority changes to support most of new tech.
* 2017-07-17: Implemented UAC double tap.
* 2017-07-12: Implemented IS weapon quirks (heat, duration, range, cooldown, velocity).
