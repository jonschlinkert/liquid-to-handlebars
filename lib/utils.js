'use strict';

var splitString = require('split-string');
var not = require('regex-not');
var utils = module.exports;
var cached;

utils.hasEndTag = function(name, str) {
  if (name.slice(0, 3) === 'end') {
    return true;
  }
  if (/^[{%}]+$/.test(name)) {
    return false;
  }
  var re = new RegExp('{%-?\\s*end' + name + '\\s*-?%}');
  return re.test(str);
};

utils.isKeyword = function(val) {
  return /^(break|continue|else|elsif)$/.test(val.trim());
};

utils.isString = function(val) {
  return typeof val === 'string' && val.trim() !== '';
};

utils.addQuotes = function(str) {
  if (str.charAt(0) === '(' && str.slice(-1) === ')') {
    return str;
  }
  return '\'' + utils.stripQuotes(str).replace(/\\?'/g, '"') + '\'';
};

utils.stripQuotes = function(str) {
  return str.replace(/^['"]|['"]$/g, '');
};

utils.stripChar = function(str, ch) {
  var re = new RegExp('\\' + ch + '( |$)');
  return str.replace(re, '$1');
};

utils.textRegex = function() {
  if (cached) return cached;
  var regex = not('(?:\\{\\{|\\}\\}|\\{%|%\\})+?', {strictClose: false});
  return (cached = regex);
};

utils.isNamespaced = function(str, names) {
  var re = new RegExp('^@?(?:' + names.join('|') + ')\\.');
  return re.test(str);
};

utils.escapeValue = function(prop) {
  prop = prop.trim();
  if (!prop) return prop;
  if (prop.charAt(0) === '(' && prop.slice(-1) === ')') {
    return prop;
  }
  if (prop.length > 1 && utils.isQuoted(prop)) {
    return utils.addQuotes(prop);
  }
  if (/^[-\d.]+$/.test(prop) || /^[a-z@._'"]+$/i.test(prop)) {
    return prop;
  }
  if (/^[-a-z@._]+$/i.test(prop)) {
    return prop;
  }
  return utils.addQuotes(prop);
};

utils.isQuoted = function isQuoted(key) {
  return /^(['"])([^\1]*)\1$/.test(key);
};

utils.hasSingleQuotes = function(key) {
  return /^'(.*)'/.test(key);
}
utils.hasDoubleQuotes = function(key) {
  return /^"(.*)"/.test(key);
};

utils.namespaceArgs = function(args, names, options) {
  var isString = typeof args === 'string';
  var prefix = utils.getPrefix(options);
  if (!prefix) {
    return args;
  }

  if (isString) {
    args = args.split(' ');
  }

  for (var i = 0; i < args.length; i++) {
    var ele = args[i];
    if (utils.isNamespaced(ele, names)) {
      args[i] = prefix + ele.replace(/^@/, '');
    }
  }
  if (isString) {
    args = args.join(' ');
  }
  return args;
};

utils.getPrefix = function(options) {
  options = options || {};
  if (!options.prefix) {
    return '';
  }
  if (options.prefix === true) {
    return '@';
  }
  if (options.prefix) {
    return options.prefix;
  }
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
  var opts = {sep: sep || ',', keepQuotes: true};
  var args = splitString(str, opts);
  var len = args.length;
  var idx = -1;
  var acc = [];

  while (++idx < len) {
    var arg = args[idx].trim();
    if (arg === '') continue;
    if (/[\\\/]/.test(arg) && !/^[@'"]/.test(arg)) {
      arg = '\'' + arg + '\'';
    }
    acc.push(arg);
  }
  return acc;
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
  return str.slice(0, ch.length) === ch;
};

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
  return idx;
}

utils.wrap = function(val) {
  if (Array.isArray(val)) {
    val = val.join(' ');
  }
  if (utils.isQuoted(val)) {
    return val;
  }
  if (val.charAt(0) === '(' && val.slice(-1) === ')') {
    return val;
  }
  return '(' + val + ')';
};

/**
 * Cast `val` to an array
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};
