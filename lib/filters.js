'use strict';

var converter = require('./convert');
var utils = require('./utils');

exports.toSubexpressions = function(str) {
  var filters = utils.splitArgs(str.trim(), '|');
  var rest = [];

  if (filters.length === 2) {
    var val = filters[0];
    var key = filters[1];

    var valArgs = utils.splitArgs(val, ':');
    var keyArgs = utils.splitArgs(key, ':');
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
    var rest = '';

    if (val) {
      rest = utils.splitArgs(val, ',').join(' ');
      val = ' ' + rest;
    }

    output = key + ' ' + output + val;
    if (i !== len - 1) {
      output = '(' + output + ')';
    }
  }
  return output;
};
