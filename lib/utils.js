'use strict';

var splitString = require('split-string');
var not = require('regex-not');
var utils = module.exports;
var cached;

utils.textRegex = function() {
  if (cached) return cached;
  var regex = not('(?:\\{\\{|\\}\\}|\\{%|%\\})+?', {strictClose: false});
  return (cached = regex);
};

utils.hasClose = function(val, input) {
  if (!val || /^end/.test(val) || !/\w+( |$)/.test(val)) return false;
  var params = val.split(' ');
  var key = params[0].trim();
  return input.indexOf('{% end' + key) !== -1;
};

utils.toRange = function(str) {
  var match = /(.*?)\(([^.]+)\.\.([^)]+?)\)(.*?)/.exec(str);
  if (match) {
    return match[1]
      + '(range ' + match[2] + ' ' + match[3] + ')'
      + (match[4] ? ' ' + match[4] : '');
  }
  return str;
};

utils.splitArgs = function(str, sep) {
  var opts = {sep: sep || ',', keepDoubleQuotes: true, keepSingleQuotes: true};
  var args = splitString(str, opts);
  return args.reduce(function(acc, arg) {
    arg = arg.trim();
    if (!arg) return acc;
    if (/[\\\/]/.test(arg) && !/^['"]/.test(arg)) {
      arg = '"' + arg + '"';
    }
    acc.push(arg);
    return acc;
  }, []);
};

utils.updateArgs = function(args, val) {
  if (args[args.length - 1] === '') {
    args[args.length - 1] = val;
  } else {
    args.push(val);
  }
};

utils.getClose = function(input, ch, index) {
  var idx = input.indexOf(ch, index);
  if (input.charAt(idx - 1) === '\\') {
    return utils.getClose(input, ch, idx + 1);
  }
  return idx;
};

utils.convertOperator = function(operator) {
  switch (operator) {
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
    case '||':
    case 'or':
      return 'or';
    case '&&':
    case 'and':
      return 'and';
    case 'contains':
    case 'typeof':
      return operator;
    default: {
      throw new Error('unrecognized operator: ' + operator);
    }
  }
};

utils.endsWith = function(str, ch) {
  return str.slice(-1) === ch;
};

utils.startsWith = function(str, ch) {
  return str.charAt(0) === ch;
};

utils.convertConditionals = function(str) {
  var regex = /(={2,3}|!={1,2}|<=?|>=?|contains)/g;

  var segs = utils.splitArgs(str, ' ');
  var idx = indexOf(segs, regex);
  while (idx !== -1) {
    segs = stringifyArgs(segs, idx);
    idx = indexOf(segs, regex);
  }

  idx = indexOf(segs, 'and');
  while (idx !== -1) {
    segs = stringifyArgs(segs, idx);
    idx = indexOf(segs, 'and');
  }

  idx = indexOf(segs, 'or');
  while (idx !== -1) {
    segs = stringifyArgs(segs, idx);
    idx = indexOf(segs, 'or');
  }

  if (segs.length > 1) {
    throw new Error('invalid conditional arguments: ' + JSON.stringify(segs));
  }

  return segs[0];
};

function stringifyArgs(args, idx) {
  var arr = args.slice();
  var op = utils.convertOperator(arr[idx]);
  var arg = utils.wrap([op, arr[idx - 1], arr[idx + 1]]);
  return arr.slice(0, idx - 1).concat(arg).concat(arr.slice(idx + 2));
}

function indexOf(arr, val) {
  var idx = -1;
  if (val instanceof RegExp) {
    for (var i = 0; i < arr.length; i++) {
      if (val.test(arr[i])) {
        idx = i;
        break;
      }
    }
  } else {
    idx = arr.indexOf(val);
  }

  if (idx === -1) {
    return idx;
  }
  if (!arr[idx - 1] || !arr[idx + 1]) {
    return -1;
  }

  return idx;
}

function wrap(val) {
  if (Array.isArray(val)) {
    val = val.join(' ');
  }
  return '(' + val + ')';
}

utils.wrap = wrap;

/**
 * Cast `val` to an array
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};