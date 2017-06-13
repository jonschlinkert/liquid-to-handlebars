exports.hasOnly = function(units) {
  for (var i = 0; i < units.length; i++) {
    if (units[i].only === true) {
      return true;
    }
  }
};
