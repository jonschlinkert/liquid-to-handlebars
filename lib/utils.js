'use strict';

var not = require('regex-not');
var toDoubleQuotes = require('to-double-quotes');
var utils = module.exports;
var cached;

utils.textRegex = function() {
  if (cached) return cached;
  var regex = not('(?:\\{\\{|\\}\\}|\\{%|%\\})+?', {strictClose: false});
  return (cached = regex);
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
  if (!sep) sep = ',';
  var args = [''];
  var len = str.length;
  var idx = -1;
  var closeIdx;
  var prev;

  while (++idx < len) {
    var ch = str[idx];

    if (ch === '\\') {
      utils.updateArgs(args, ch + str[idx + 1]);
      idx++;
      continue;

    } else {
      if (ch === '"') {
        closeIdx = utils.getClose(str, '"', idx + 1);
        if (closeIdx === -1) {
          throw new Error('unclosed double quote: ' + str);
        }

        ch = str.slice(idx, closeIdx + 1);
        idx = closeIdx;
      }

      if (ch === sep) {
        args.push('');

      } else {
        args[args.length - 1] += ch;
      }
    }

    prev = ch;
  }

  args = args.reduce(function(acc, arg) {
    arg = arg.trim();
    if (!arg) return acc;
    if (/[\\\/]/.test(arg) && !/^['"]/.test(arg)) {
      arg = '"' + arg + '"';
    }
    acc.push(arg);
    return acc;
  }, []);

  return args;
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

/**
 * Safe json stringify
 */

utils.jsonStringify = function(obj) {
  var seen = [];
  return JSON.stringify(obj, function(key, val) {
    if (!val || typeof val !== 'object') {
      return val;
    }
    if (seen.indexOf(val) !== -1) {
      return '[Circular]';
    }
    seen.push(val);
    return val;
  }, 2);
};

utils.convertConditionals = function(str) {
  var segs = utils.splitArgs(str, ' ');
  var orig = segs.slice();
  var args = [];

  var regex = /(={2,3}|!={1,2}|<=?|>=?|contains)/g;
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
  // var last = segs[0];
  // if (last.charAt(0) === '(' && last.slice(-1) === ')') {
  //   return last.slice(1, last.length - 1);
  // }
  // return last;
}

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
