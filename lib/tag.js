'use strict';

/**
 * Module dependencies
 */

var delims = require('delims');
var _ = require('lodash');

exports.makeBlock = function makeBlock(name, options) {
  options = options || {};
  var params = options.params || '([\\s\\S]+?)';
  var re = [
    '\\{%\\s*'+name+'\\s*' + params + '\\s*%\\}',
    '\\{%\\s*end'+name+'+\\s*%\\}'
  ];
  return makeDelims(re, options);
};
// console.log(exports.makeBlock('foo'))

exports.makeTag = function makeTag(name, options) {
  options = options || {};
  var params = options.params || '';
  var re = ['\\{%\\s*'+name+'\\s*' + params, '%\\}'];
  return makeDelims(re, options);
};
// console.log(exports.makeTag('foo'))

exports.makeVariable = function makeVariable(name, options) {
  options = options || {};
  var re = ['\\{\\{\\s*'+name, '\\s*\\}\\}'];
  return makeDelims(re, options);
};
// console.log(exports.makeVariable('foo'))


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
