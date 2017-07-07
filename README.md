# mwo-simulator
Mech Loadout Simulator for Mechwarrior Online

* [Quick Start](#quick-start-guide)
* [Slightly Less Quick start](#slightly-less-quick-start-guide)
* [Reporting Bugs](#guide-for-reporting-bugs)
* [Current Features](#current-features)
* [Unsimulated Mechanics](#currently-unsimulated-mechanics)

# Quick Start Guide

1. Click 'Add Mech'.
2. Paste [Smurfy](http://mwo.smurfy-net.de/) URL.
3. Click 'Load'
4. Click OK once mech is loaded from smurfy.
5. Add more mechs if you want. Click the 'Range' Button if you want to change the engagement range.
6. Click 'Run'.
7. Click 'Permalink' to save changes and share your simulation.

# Slightly Less Quick Start Guide

1-5. Same as above

6. Click 'Settings' to view and set various Team Settings.
7. Click Speed setting (1x to 8x) to set simulation speed.
8. Click 'Run'.
9. Click 'Permalink' to save changes and share your simulation.

# Guide for Reporting Bugs

1. Press Ctrl-Shift-i (on Chrome or Firefox) to bring up the Developer Tools.
2. Click the Console Tab.
3. Right-click on the console window and click Save As...
4. Go to the project [issue tracker](https://github.com/fat4eyes-mwo/mwo-simulator/issues) to report the issue. Make sure to include the console log and the URL where the simulator failed.
5. If you are using Edge or Internet Explorer, contact your local exorcist and have these hellspawn banished back to the pit from which they came. (Edge and IE are not supported).

# Current features

1. Uses current mech, weapon and heatsink data from smurfy's.
2. Simulates duration (for burn weapons) and travel time (for velocity weapons).
3. Simulates effects of heatsink and ammo box destruction, as well as side torso loss for Clan XL engines.
5. Simulates weapon spread for the following weapons: All LRMs, all SRMs. Also splash damage for cERPPCs.
4. Supports armor and structure quirks for IS mechs.

# Currently Unsimulated mechanics

* Damage spread for LBX, Streaks (high priority)
* Weapon cooldown/heat quirks (high priority)
* Omnipod specific/set quirks
* UAC double tap
* Exponential dropoff for cLRMs below min range (right now they do 0 damage below min range)
* Environmental heat effects
* Mech skills
* Crits and weapon/heatsink/ammo destruction. Right now weapons/heatsinks/ammo are only destroyed if the component they are on are destroyed. The crux here is to find a way to simulate this randomness deterministically.
* Special weapon crit/damage effects (this includes LBX,SRM crits, MG crits and flamer heat).
* Ammo explosions
