'use strict';

const split = require('split-string');
const not = require('regex-not');
const utils = module.exports;
const memo = {};

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
  const re = new RegExp('\\' + ch + '( |$)');
  return str.replace(re, '$1');
};

/**
 * Tags / expressions
 */

utils.textRegex = function() {
  if (memo.textRegex) return memo.textRegex;
  const regex = not('(?:\\{\\{|\\}\\}|\\{%|%\\})+?', {strictClose: false});
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

  const re = new RegExp('{%-?\\s*end' + name + '\\s*-?%}');
  return re.test(str);
};

utils.isTag = function(name) {
  return /^(capture|case|comment|for|if|paginate|raw|tablerow|unless)$/.test(name);
};

utils.isExpression = function(name) {
  return /^(assign|cycle|else|elsif|include)$/.test(name);
};

utils.toRange = function(str) {
  const match = /(.*?)\(([^.]+)\.\.([^)]+?)\)(.*?)/.exec(str);
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

utils.isDotProp = function(str) {
  return /^([-$\w]+(?:[. ][-$\w]+)*)+(?:\[[^\]]+\])?$/.test(str);
};

/**
 * Namespacing
 */

utils.isNamespace = function(str, names) {
  let re = memo.namespaceRegex;
  if (!re) {
    re = new RegExp('(^| )(?:' + names.join('|') + ')\\.');
    memo.namespaceRegex = re;
  }
  return utils.isDotProp(str) && re.test(str);
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
  const opts = Object.assign({}, options);

  // special variables supported by shopify
  const shopifyVariables = opts.shopifyVariables || [
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

  const names = opts.namespace || shopifyVariables;
  const isString = typeof args === 'string';
  const prefix = utils.getPrefix(options);
  if (!prefix) {
    return args;
  }

  if (isString) {
    args = utils.splitArgs(args, ' ');
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (utils.isNamespace(arg, names)) {
      args[i] = prefix + arg.replace(/^@/, '');
    }
  }

  if (isString) {
    return args.join(' ');
  }
  return args;
};

utils.splitArgs = function(str, sep) {
  const args = split(str, {sep: sep || ',', keepQuotes: true, brackets: true});
  const len = args.length;
  const acc = [];
  let idx = -1;

  while (++idx < len) {
    let arg = args[idx].trim();
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
  return typeof val === 'string' && val.charAt(0) === '(' && val.slice(-1) === ')';
};

utils.stripQuotes = str => str.replace(/^['"]|['"]$/g, '');
utils.hasSingleQuotes = str => /^'(.*)'/.test(str);
utils.hasDoubleQuotes = str => /^"(.*)"/.test(str);
utils.isQuoted = str => /^(['"])([^\1]*)\1$/.test(str);

utils.addQuotes = function(str) {
  if (utils.hasParens(str)) {
    return str;
  }
  return '\'' + utils.stripQuotes(str).replace(/\\?'/g, '"') + '\'';
};

