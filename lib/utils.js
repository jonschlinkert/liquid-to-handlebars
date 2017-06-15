'use strict';

var split = require('split-string');
var not = require('regex-not');
var utils = module.exports;
var memo = {};

utils.last = function(arr) {
  return Array.isArray(arr) ? arr[arr.length - 1] : null;
};

/**
 * String utils
 */

utils.toString = function(val) {
  return typeof val === 'string' ? val.trim() : '';
};

utils.isString = function(val) {
  return typeof val === 'string' && val.trim() !== '';
};

utils.stripChar = function(str, ch) {
  var re = new RegExp('\\' + ch + '( |$)');
  return str.replace(re, '$1');
};

/**
 * Tags / expressions
 */

utils.textRegex = function() {
  if (memo.textRegex) return memo.textRegex;
  var regex = not('(?:\\{\\{|\\}\\}|\\{%|%\\})+?', {strictClose: false});
  return (memo.textRegex = regex);
};

utils.hasEndTag = function(name, str) {
  if (name.slice(0, 3) === 'end') {
    return true;
  }
  if (/^[{%}]+$/.test(name)) {
    return false;
  }

  if (utils.isExpression(name)) {
    return false;
  }

  if (utils.isTag(name)) {
    return true;
  }

  var re = new RegExp('{%-?\\s*end' + name + '\\s*-?%}');
  return re.test(str);
};

utils.isTag = function(name) {
  return /^(capture|case|comment|for|if|paginate|raw|tablerow|unless)$/.test(name);
};

utils.isExpression = function(name) {
  return /^(assign|cycle|else|elsif|include)$/.test(name);
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

utils.isKeyword = function(val) {
  return /^(break|continue|else|elsif)$/.test(val.trim());
};

/**
 * Namespacing
 */

utils.isNamespaced = function(str, names) {
  var re = memo.namespaceRegex;
  if (!re) {
    re = new RegExp('(^| )@?(?:' + names.join('|') + ')\\.');
    memo.namespaceRegex = re;
  }
  return re.test(str);
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

utils.toHash = function(hash) {
  return Object.keys(hash || {}).reduce(function(acc, key) {
    return acc + ' ' + key + '=' + hash[key];
  }, '');
};

/**
 * Args
 */

utils.escapeValue = function(prop) {
  prop = prop.trim();
  if (!prop) return prop;
  if (utils.hasParens()) {
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

utils.namespaceArgs = function(args, options) {
  var opts = Object.assign({}, options);

  // special variables supported by shopify
  var shopifyVariables = [
    'article',
    'blog',
    'cart',
    'collection',
    'comment',
    'linklist',
    'page',
    'post',
    'product',
    'shop',
    'site'
  ];

  var names = opts.namespace || shopifyVariables;
  var isString = typeof args === 'string';
  var prefix = utils.getPrefix(options);
  if (!prefix) {
    return args;
  }

  if (isString) {
    args = utils.splitArgs(args, ' ');
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

utils.splitArgs = function(str, sep) {
  var args = split(str, {sep: sep || ',', keepQuotes: true, brackets: true});
  var len = args.length;
  var idx = -1;
  var acc = [];

  while (++idx < len) {
    var arg = args[idx].trim();
    if (arg === '') continue;
    if (/[\\\/]/.test(arg) && !utils.isQuoted(arg)) {
      arg = utils.addQuotes(arg);
    }
    acc.push(arg);
  }
  return acc;
};

utils.wrap = function(val) {
  if (Array.isArray(val)) {
    val = val.join(' ');
  }
  if (utils.isQuoted(val)) {
    return val;
  }
  if (utils.hasParens(val)) {
    return val;
  }
  return '(' + val + ')';
};

/**
 * Quotes
 */

utils.hasParens = function(val) {
  return typeof val === 'string'
    && val.charAt(0) === '('
    && val.slice(-1) === ')';
};

utils.isQuoted = function isQuoted(key) {
  return /^(['"])([^\1]*)\1$/.test(key);
};

utils.hasSingleQuotes = function(key) {
  return /^'(.*)'/.test(key);
};
utils.hasDoubleQuotes = function(key) {
  return /^"(.*)"/.test(key);
};

utils.addQuotes = function(str) {
  if (utils.hasParens(str)) {
    return str;
  }
  return '\'' + utils.stripQuotes(str).replace(/\\?'/g, '"') + '\'';
};

utils.stripQuotes = function(str) {
  return str.replace(/^['"]|['"]$/g, '');
};
