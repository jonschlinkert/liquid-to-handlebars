const path = require('path');
const delims = require('delims');
const file = require('fs-utils');
const cheerio = require('cheerio');
const frep = require('frep');
const _ = require('lodash');

const rewrite = require('./lib/rewrite');
const re = require('./lib/replacements');


var patterns = [];
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