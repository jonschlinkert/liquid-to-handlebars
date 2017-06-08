'use strict';

var moment = require('moment-strftime');
var querystring = require('querystring');
var isNumber = require('is-number');
var get = require('get-value');
var helpers = module.exports;

/**
 * Comparison
 */

helpers.default = function(a, b) {
  return a || b;
};

/**
 * Math
 */

helpers.abs = function(num) {
  return isNumber(num) ? Math.abs(num) : '';
};

helpers.ceil = function(num) {
  return isNumber(num) ? Math.ceil(num) : '';
};

helpers.divided_by = function(a, b) {
  if (isNumber(a) && isNumber(b)) {
    return +a / +b;
  }
  return '';
};

helpers.times = function(a, b) {
  if (isNumber(a) && isNumber(b)) {
    return +a * +b;
  }
  return '';
};

helpers.floor = function(num) {
  return isNumber(num) ? Math.floor(num) : '';
};

helpers.minus = function(a, b) {
  if (isNumber(a) && isNumber(b)) {
    return +a - +b;
  }
  return '';
};

helpers.modulo = function(a, b) {
  if (isNumber(a) && isNumber(b)) {
    return +a % +b;
  }
  return '';
};

helpers.plus = function(a, b) {
  return a + b;
};

helpers.round = function(num) {
  return isNumber(num) ? Math.round(num) : '';
};

/**
 * String
 */

helpers.append = function(str, suffix) {
  return typeof str === 'string' && typeof suffix === 'string'
    ? (str + suffix)
    : str;
};

helpers.prepend = function(str, prefix) {
  return typeof str === 'string' && typeof prefix === 'string'
    ? (prefix + str)
    : str;
};

helpers.capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

helpers.downcase = function(str) {
  return typeof str === 'string' ? str.toLowerCase() : '';
};

helpers.upcase = function(str) {
  return typeof str === 'string' ? str.toUpperCase() : '';
};

helpers.url_decode = function(str) {
  return typeof str === 'string' ? decodeURIComponent(str) : '';
};

helpers.url_encode = function(str) {
  return typeof str === 'string' ? encodeURIComponent(str) : '';
};

helpers.escape = function(str) {
  return typeof str === 'string' ? querystring.escape(str) : '';
};

helpers.escape_once = function(str) {
  return typeof str === 'string' ? querystring.escape(str) : '';
};

helpers.lstrip = function(str) {
  return typeof str === 'string' ? str.replace(/^\s+/, '') : '';
};

helpers.rstrip = function(str) {
  return typeof str === 'string' ? str.replace(/\s+$/, '') : '';
};

helpers.remove = function(str, ch) {
  return typeof str === 'string' ? str.split(ch).join('') : '';
};

helpers.remove_first = function(str, ch) {
  return typeof str === 'string' ? str.replace(ch, '') : '';
};

helpers.replace = function(str, a, b) {
  return typeof str === 'string' ? str.split(a).join(b) : '';
};

helpers.replace_first = function(str, a, b) {
  return typeof str === 'string' ? str.replace(a, b) : '';
};

helpers.newline_to_br = function(str) {
  return typeof str === 'string' ? str.replace(/\n/g, '<br>') : '';
};

helpers.split = function(str, sep) {
  return typeof str === 'string' && typeof sep === 'string'
    ? str.split(sep)
    : str;
};

helpers.strip = function(str) {
  return typeof str === 'string' ? str.trim() : '';
};

helpers.strip_html = function(str) {
  return typeof str === 'string' ? str.replace(/<[^>]>/g, '') : '';
};

helpers.strip_newlines = function(str) {
  return typeof str === 'string' ? str.replace(/\n+/g, '') : '';
};

helpers.truncate = function(str, count, suffix) {
  var res = str.slice(0, +count);
  if (typeof suffix === 'string') {
    return res + suffix;
  }
  return res + '…';
};

helpers.truncateWords = function(str, count, suffix) {
  var res = str.split(/[ \t]/).slice(0, +count);
  var val = res.join(' ');
  if (typeof suffix === 'string') {
    return val + suffix;
  }
  return val + '…';
};

/**
 * Array
 */

helpers.compact = function(arr) {
  if (typeof arr === 'string') {
    arr = arr.split(',');
  }
  if (Array.isArray(arr)) {
    return arr.filter(Boolean);
  }
  return '';
};

helpers.first = function(arr) {
  if (typeof arr === 'string') {
    arr = arr.split(',');
  }
  if (Array.isArray(arr)) {
    return arr[0];
  }
  return '';
};

helpers.join = function(arr, sep) {
  if (typeof arr === 'string') {
    arr = arr.split(',');
  }
  if (Array.isArray(arr)) {
    return arr.join(sep || ',');
  }
  return '';
};

helpers.last = function(arr) {
  if (typeof arr === 'string') {
    arr = arr.split(',');
  }
  if (Array.isArray(arr)) {
    return arr[arr.length - 1];
  }
  return '';
};

helpers.map = function(obj, prop) {
  var arr = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = get(obj[key], prop);
      if (val) {
        arr.push(val);
      }
    }
  }
  return arr;
};

helpers.reverse = function(arr) {
  arr.reverse();
  return arr;
};

helpers.sort = function(arr) {
  return arr.sort();
};

helpers.sort_natural = function(arr) {
  return arr.sort(function(a, b) {
    return a.localeCompare(b);
  });
};

helpers.size = function(val) {
  if (typeof val === 'string' || Array.isArray(val)) {
    return val.length;
  }
  return 0;
};

helpers.slice = function(val, a, b) {
  if (typeof val === 'string' || Array.isArray(val)) {
    return val.slice(a, b);
  }
  return '';
};

helpers.uniq = function(arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) === -1) {
      res.push(arr[i]);
    }
  }
  return res;
};

/**
 * Date
 */

helpers.date = function(date, format) {
  if (date === 'now') {
    date = Date.now();
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return moment(date).strftime(format);
};

helpers.date_to_xmlschema = function(date) {
  return moment(date).toISOString();
};
