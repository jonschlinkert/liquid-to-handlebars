'use strict';

var util = require('util');
var utils = require('./utils');

function conditional(str, val) {
  var cond = val || 'and';
  var args = str.split(' ' + cond + ' ');

  if (args.length === 1) {
    if (cond !== 'or') {
      return conditional(str, 'or');
    }
    return comparison(str);
  }

  for (var i = 0; i < args.length; i++) {
    args[i] = comparison(conditional(args[i], 'or'));
  }
  return toHelper(cond, args);
}

function comparison(str) {
  var args = str.split(/ (={2,3}|!={1,2}|<=?|>=?|contains) /);
  if (args.length > 3) {
    throw new Error('expected comparison to have three or fewer arguments');
  }

  if (args.length !== 3) {
    return convertObject(str);
  }

  for (var i = 0; i < args.length; i++) {
    args[i] = convertObject(args[i]);
  }

  return toComparison(args);
}

function toComparison(args) {
  return '(' + [toOperator(args[1]), args[0], args[2]].join(' ') + ')';
}

function toOperator(str) {
  switch (str) {
    case '==':
    case '===':
      return 'is';
    case '!=':
    case '!==':
      return 'isnt';
    case '<':
      return 'lt';
    case '<=':
      return 'lte';
    case '>':
      return 'gt';
    case '>=':
      return 'gte';
    case 'or':
    case 'and':
    case 'contains':
    case 'typeof':
      return str;
    default: {
      throw new Error('unrecognized operator: ' + util.inspect(str));
    }
  }
}

function convertObject(str) {
  var args = /([^\s\[]+)((?:\[[^\]]+?\])+)(\.\S+)?/.exec(str);
  if (!args) {
    return str;
  }

  var context = args[1] + ' ';
  var props = args[2];
  var rest = args[3];
  var keys = props.match(/\[[^\]]+?\]/g).map(function(key) {
    return escapeProp(key.slice(1, -1));
  });

  var isNumber = /^\d+$/.test(keys[0]);
  var isString = rest && utils.isString(rest);

  if (isNumber) {
    var params = keys.concat(isString ? rest.slice(1) : []);
    var res = params.join('.');
    if (params.length > 1) {
      res = '"' + res + '"'
    }

    return 'get ' + context + res;
  }

  if (isString) {
    keys.push('"' + rest.slice(1) + '"');
  }

  var res = keys.length > 1
    ? '(toPath ' + keys.join(' ') + ')'
    : keys.join(' ');

  return 'get ' + context + res;
}

function escapeProp(prop) {
  if (/^\d+$/.test(prop) || /^[a-z._'"]+$/i.test(prop)) {
    return prop;
  }
  if (/^[\w-]+$/.test(prop)) {
    return '(get this "' + prop + '")';
  }
  return '"' + prop + '"';
}

function isQuoted(key) {
  return /^(['"])([^\1]+)\1$/.test(key);
}

function toGet(key) {
  return toHelper('get', ['this', '"' + key + '"']);
}

function toHelper(name, args, hash) {
  return '(' + name + ' ' + args.join(' ') + toHash(hash) + ')';
}

function toHash(hash) {
  return Object.keys(hash || {}).reduce(function(acc, key) {
    return acc + ' ' + key + '=' + hash[key];
  }, '');
}

/**
 * Expose `conditional`
 */

module.exports = conditional;
