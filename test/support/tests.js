'use strict';

var support = require('./');

module.exports = function(units, fn) {
  var hasOnly = support.hasOnly(units);
  var text;

  function iterate(units, fn) {
    var num = 0;
    for (var i = 0; i < units.length; i++) {
      var unit = units[i];
      if (unit.it) {
        text = unit.it;
      }

      if (Array.isArray(unit.units)) {
        iterate(unit.units, fn);
      } else {
        if (hasOnly && !unit.only) {
          continue;
        }
        fn(unit, text, ++num);
      }
    }
  }

  iterate(units, fn);
};
