'use strict';

/**
 * Module dependencies
 */

var delims = require('delims');
var _ = require('lodash');

function makeDelims(delimiters, options) {
  var defaults = _.extend({
    body: '',
    beginning: '',
    end: '',
    flags: 'g',
    noncapture: false
  }, options || {});
  return delims(delimiters, defaults).evaluate;
}

exports.makeBlock = function(name, options) {
  options = options || {};
  var params = options.params || '([\\s\\S]+?)';
  var re = [
    '\\{%\\s*'+name+'\\s*' + params + '\\s*%\\}',
    '\\{%\\s*end'+name+'+\\s*%}'
  ];
  return makeDelims(re, options);
};

exports.makeTag = function(name, options) {
  options = options || {};
  var params = options.params || '';
  var re = ['\\{%\\s*'+name+'\\s*' + params, '%\\}'];
  return makeDelims(re, options);
};

exports.makeVariable = function(name, options) {
  options = options || {};
  var re = ['\\{\\{\\s*'+name, '\\s*\\}\\}'];
  return makeDelims(re, options);
};