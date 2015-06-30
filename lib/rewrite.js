'use strict';

/**
 * Module dependencies
 */

var path = require('path');
var cheerio = require('cheerio');

/**
 * Expose `rewrite`
 */

var rewrite = module.exports;

rewrite.cssPaths = function (str) {
  var $ = cheerio.load(str);
  $('link[rel=stylesheet]').each(function (i, ele) {
    var href = $(ele).attr('href');
    if (href && href.indexOf('../') !== -1 && href.indexOf(':') !== -1) {
      str = str.replace(href, ('{{assets}}/css/' + path.basename(href)));
    }
  });
  return str;
};

rewrite.iconPaths = function (str) {
  var $ = cheerio.load(str);
  $('link').each(function (i, ele) {
    var href = $(ele).attr('href');
    var rel = $(ele).attr('rel');
    if (href && (/\.ico$/.test(href) || /icon/.test(rel)) && href.indexOf(':') !== -1) {
      str = str.replace(href, '{{assets}}/ico/' + path.basename(href));
    }
  });
  return str;
};

rewrite.imagePaths = function (str) {
  var $ = cheerio.load(str);
  $('img').each(function (i, ele) {
    var src = $(ele).attr('src');
    if (src && src.indexOf(':') !== -1) {
      str = str.replace(src, '{{assets}}/img/' + path.basename(src));
    }
  });
  return str;
};

rewrite.scriptPaths = function (str) {
  var $ = cheerio.load(str);
  $('script').each(function (i, ele) {
    var src = $(ele).attr('src');
    if (src && /\.js$/.test(src) && src.indexOf(':') !== -1) {
      str = str.replace(src, '{{assets}}/js/' + path.basename(src));
    }
  });
  return str;
};

rewrite.metaContent = function (str) {
  var $ = cheerio.load(str);
  $('meta').each(function (i, ele) {
    var content = $(ele).attr('content');
    var name = $(ele).attr('name');
    if (name && /desc|keywords|author/.test(name)) {
      str = str.replace(content, '{{ site.' + name + ' }}');
    }
  });
  return str;
};
