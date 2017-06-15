exports.hasOnly = function(units) {
  for (var i = 0; i < units.length; i++) {
    var unit = units[i];
    if (unit.only === true) {
      return true;
    }

    if (Array.isArray(unit.units)) {
      exports.hasOnly(unit.units);
    }
  }
};
