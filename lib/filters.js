'use strict';

var converter = require('./convert');
var utils = require('./utils');

exports.toSubexpressions = function(str) {
  var filters = utils.splitArgs(str.trim(), '|');

  if (filters.length === 2) {
    let val = filters[0];
    let key = filters[1];

    let valArgs = utils.splitArgs(val, ':');
    let keyArgs = utils.splitArgs(key, ':');
    if (valArgs.length === 1 && keyArgs.length === 1) {
      return key + ' ' + val;
    }
  }

  var origLen = filters.length;
  var param = filters.shift().trim();
  var len = filters.length;

  var output = converter.convertArgs(param, {nested: origLen > 1});
  for (var i = 0; i < len; i++) {
    var filter = filters[i];
    var args = utils.splitArgs(filter, ':');
    var key = args[0].trim();

    var val = (args[1] || '').trim();
    if (val) {
      val = ' ' + utils.splitArgs(val, ',').join(' ');
    }

    output = key + ' ' + output + val;
    if (i !== len - 1) {
      output = '(' + output + ')';
    }
  }
  return output;
};
