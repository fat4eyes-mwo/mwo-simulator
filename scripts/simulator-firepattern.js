
//Fire patterns are functions that take a mech and return a list of weaponstates which represent the weapons to fire
var MechFirePattern = MechFirePattern || (function () {
  var alphaAtZeroHeat = function (mech) {
    let mechState = mech.getMechState();
    if (mechState.heatState.currHeat <= 0) {
      return mechState.weaponStateList;
    } else {
      return null;
    }
  }

  return {
    alphaAtZeroHeat : alphaAtZeroHeat,
  };
})();
