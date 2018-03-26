'use strict';

const util = require('util');
const split = require('split-string');
const utils = require('./utils');

exports.filters = function(val, rest, wrap) {
  const segs = split(rest, {keepQuotes: true, sep: '|'});
  if (segs.length === 1) {
    return val;
  }
  const filters = segs.filter(Boolean);
  for (var i = 0; i < filters.length; i++) {
    val = exports.filter(val, filters[i], shouldWrap(filters.length, i, wrap));
  }
  return val;
};

exports.filter = function(val, str, wrap) {
  const args = utils.splitArgs(str, ':').map(arg => arg.trim());
  let rest = [];

  let name = args.shift();
  if (name) {
    name = name.trim();
  }

  for (let i = 0; i < args.length; i++) {
    rest = rest.concat(utils.splitArgs(args[i], ','));
  }
  for (let i = 0; i < rest.length; i++) {
    rest[i] = utils.escapeValue(rest[i]);
  }

  rest = [val].concat(rest.join(' '));
  if (wrap === false) {
    return name.trim() + ' ' + rest.join(' ');
  }

  return toHelper(name, rest);
};

exports.conditional = function(str, val, options) {
  if (utils.isQuoted(str)) {
    return utils.addQuotes(str);
  }

  const cond = val || 'and';
  const args = str.split(' ' + cond + ' ');

  if (args.length === 1) {
    if (cond !== 'or') {
      return exports.conditional(str, 'or', options);
    }
    return comparison(str, options);
  }

  for (let i = 0; i < args.length; i++) {
    args[i] = comparison(exports.conditional(args[i], 'or', options), options);
  }
  return toHelper(cond, args);
};

function comparison(str, options) {
  str = utils.namespaceArgs(str, options);
  if (utils.isQuoted(str)) {
    return utils.addQuotes(str);
  }

  const regex = /([$\w '"]+)(={2,3}|!={1,2}|<=?|>=?|contains)([\w '"]+)/g;
  str = str.replace(regex, function(m, $1, $2, $3) {
    return $1 + $2 + ' ' + $3.trim();
  });

  const args = str.split(/ (={2,3}|!={1,2}|<=?|>=?|contains) /);
  const len = args.length;
  if (len > 3) {
    throw new Error('expected comparison to have three or fewer arguments');
  }
  if (len !== 3) {
    return exports.object(str);
  }
  for (let i = 0; i < len; i++) {
    const ele = args[i];
    args[i] = exports.object(ele);
    if (ele !== args[i] && len > 1) {
      args[i] = utils.wrap(args[i]);
    }
  }
  return toComparison(args);
}

exports.object = function(str) {
  if (utils.isQuoted(str)) {
    return utils.addQuotes(str);
  }

  const args = /([^\s\[]+)((?:\[[^\]]+?\])+)(\.\S+)?/.exec(str);
  if (!args) {
    if (/^get /.test(str)) {
      return utils.wrap(str);
    }
    return str;
  }

  const context = args[1] + ' ';
  const props = args[2];
  const rest = args[3];
  const keys = props.match(/\[[^\]]+?\]/g).map(function(key) {
    return utils.escapeValue(key.slice(1, -1));
  });

  const isNumber = /^\d+$/.test(keys[0]);
  const isString = rest && utils.isString(rest);

  if (isNumber) {
    const params = keys.concat(isString ? rest.slice(1) : []);
    let out = params.join('.');
    if (params.length > 1) {
      out = utils.addQuotes(out);
    }
    return 'get ' + context + out;
  }

  const isQuoted = keys.length === 1 && utils.isQuoted(keys[0]);
  if (isString) {
    keys.push(utils.addQuotes(rest.slice(1)));
  }

  let res = keys.length > 1 ? '(toPath ' + keys.join(' ') + ')' : keys[0];

  if (res === keys[0] && /-/.test(res) && !isQuoted) {
    res = '(get this ' + utils.addQuotes(res) + ')';
  }

  return 'get ' + context + res;
};

function toComparison(args) {
  return utils.wrap([toOperator(args[1]), args[0], args[2]].join(' '));
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

function shouldWrap(len, i, wrap) {
  if (len > 1 && i !== len - 1) {
    return true;
  }
  return wrap;
}

function toHelper(name, args, hash) {
  if (!name) return '';
  return '(' + name.trim() + ' '
    + args.join(' ').trim()
    + utils.toHash(hash) + ')';
}
