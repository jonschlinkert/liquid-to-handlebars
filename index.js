'use strict';

/**
 * Module dependencies
 */

var frep = require('frep');
var patterns = [];

var re = require('./lib/replacements');
var rewrite = require('./lib/rewrite');

patterns = patterns.concat(re.blocks);
patterns = patterns.concat(re.variables);
patterns = patterns.concat(re.tags);

module.exports = function(str) {
  str = rewrite.metaContent(str);
  str = rewrite.scriptPaths(str);
  str = rewrite.imagePaths(str);
  str = rewrite.iconPaths(str);
  str = rewrite.cssPaths(str);
  return frep.strWithArr(str, patterns);
};