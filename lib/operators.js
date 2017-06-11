'use strict';

var util = require('util');

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
  var rest = args[3] ? (' "' + args[3].slice(1) + '"') : '';
  var keys = props.match(/\[[^\]]+?\]/g);
  var res = '';
  for (var i = 0; i < keys.length; i++) {
    var key = toGet(keys[i].slice(1, -1));
    if (i > 0) {
      res = res.split('this').join(key);
    } else {
      res = key;
    }
  }

  console.log(res)
  return '(get ' + context + res + rest + ')';
  // var prop = args.filter(Boolean).join('.');
  // return '(get ' + context + ' ' + escapeProp(prop) + ')';
}

function escapeProp(prop) {
  console.log(prop)
  if (!/^['"][^'"]+['"]$/.test(prop)) {
    return '(get this "' + prop + '")';
  }
  if (/^\d+$/.test(prop) || /^[a-z._'"]+$/i.test(prop)) {
    return prop;
  }
  if (/^[\w-]+$/.test(prop)) {
    return '(get this "' + prop + '")';
  }
  return '"' + prop + '"';
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
