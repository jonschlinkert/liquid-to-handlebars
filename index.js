'use strict';

/**
 * Module dependencies
 */

var rewrite = require('./lib/rewrite');
var re = require('./lib/replacements');

module.exports = function(str) {
  str = rewrite.metaContent(str);
  str = rewrite.scriptPaths(str);
  str = rewrite.imagePaths(str);
  str = rewrite.iconPaths(str);
  str = rewrite.cssPaths(str);

  var len = re.length, i = -1;
  while (++i < len) {
    str = str.replace(re[i].pattern, re[i].replacement);
  }
  return str;
};