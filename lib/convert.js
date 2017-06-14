'use strict';

var util = require('util');
var split = require('split-string');
var utils = require('./utils');

var convert = module.exports;

convert.filters = function(val, rest, wrap) {
  var segs = split(rest, {keepQuotes: true, sep: '|'});
  if (segs.length === 1) {
    return val;
  }
  var filters = segs.filter(Boolean);
  var len = filters.length;
  for (var i = 0; i < len; i++) {
    val = convert.filter(val, filters[i], shouldWrap(len, i, wrap));
  }
  return val;
};

convert.filter = function(val, str, wrap) {
  var args = utils.splitArgs(str, ':');
  for (let i = 0; i < args.length; i++) {
    args[i] = args[i].trim();
  }
  var name = args.shift();
  if (name) {
    name = name.trim();
  }

  var rest = [];
  for (let i = 0; i < args.length; i++) {
    rest = rest.concat(split(args[i], {sep: ',', keepQuotes: true}));
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

convert.conditional = function(str, val) {
  var cond = val || 'and';
  var re = new RegExp(' ' + cond + ' ');
  var args;

  if (re.test(str)) {
    args = splitString(str, function(ele) {
      return ele.split(' ' + cond + ' ');
    });
  } else {
    args = str.split(' ' + cond + ' ');
  }

  if (args.length === 1) {
    if (cond !== 'or') {
      return convert.conditional(str, 'or');
    }
    return comparison(str);
  }

  for (var i = 0; i < args.length; i++) {
    args[i] = comparison(convert.conditional(args[i], 'or'));
  }
  return toHelper(cond, args);
};

function comparison(str) {
  if (utils.isQuoted(str)) {
    return utils.addQuotes(str);
  }

  var args = str.split(/ (={2,3}|!={1,2}|<=?|>=?|contains) /);
  var len = args.length;
  if (len > 3) {
    throw new Error('expected comparison to have three or fewer arguments');
  }
  if (len !== 3) {
    return convert.object(str);
  }
  for (var i = 0; i < len; i++) {
    var ele = args[i];
    args[i] = convert.object(ele);
    if (ele !== args[i] && len > 1) {
      args[i] = utils.wrap(args[i]);
    }
  }
  return toComparison(args);
}

convert.object = function(str) {
  var args = /([^\s\[]+)((?:\[[^\]]+?\])+)(\.\S+)?/.exec(str);
  if (!args) {
    if (/^get /.test(str)) {
      return utils.wrap(str);
    }
    return str;
  }

  var context = args[1] + ' ';
  var props = args[2];
  var rest = args[3];
  var keys = props.match(/\[[^\]]+?\]/g).map(function(key) {
    return utils.escapeValue(key.slice(1, -1));
  });

  var isNumber = /^\d+$/.test(keys[0]);
  var isString = rest && utils.isString(rest);

  if (isNumber) {
    var params = keys.concat(isString ? rest.slice(1) : []);
    var out = params.join('.');
    if (params.length > 1) {
      out = utils.addQuotes(out);
    }
    return 'get ' + context + out;
  }

  var isQuoted = keys.length === 1 && utils.isQuoted(keys[0]);
  if (isString) {
    keys.push(utils.addQuotes(rest.slice(1)));
  }

  var res = keys.length > 1
    ? '(toPath ' + keys.join(' ') + ')'
    : keys[0];

  if (res === keys[0] && /-/.test(res) && !isQuoted) {
    res = '(get this ' + utils.addQuotes(res) + ')';
  }

  return 'get ' + context + res;
};

function toComparison(args) {
  return utils.wrap([toOperator(args[1]), args[0], args[2]].join(' '));
}

function splitString(str, fn) {
  var len = str.length;
  var idx = -1;
  var prev = '';
  var ch = '';
  var quotes = [];
  var params = [''];
  var stack = [];

  function update(ch) {
    var arr = stack.length ? stack : params;
    arr[arr.length - 1] += ch;
    return ch;
  }

  function advance() {
    prev = str[idx];
    return (ch = str.charAt(++idx));
  }

  while (idx < len) {
    advance();

    if (ch === '"' || ch === '\'') {
      if (ch === '\'' && prev !== '' && prev !== ' ') {
        update(ch);
        continue;
      }

      if (ch === '\\') {
        update(ch);
        continue;
      }

      if (stack.length && quotes[quotes.length - 1] === ch) {
        quotes.pop();
        update(ch);
        params.push(stack.pop(), '');
      } else {
        quotes.push(ch);
        stack.push(ch);
      }

    } else {
      update(ch);
    }
  }

  var arr = params.concat(stack).slice();
  var res = [];

  for (var i = 0; i < arr.length; i++) {
    var arg = arr[i];
    if (arg && utils.isQuoted(arg)) {
      res.push(arg);
    } else if (arg) {
      var a = fn(arg);
      if (a) res = res.concat(a);
    }
  }
  return res.filter(Boolean);
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
