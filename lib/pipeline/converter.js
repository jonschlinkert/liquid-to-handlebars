'use strict';

var through = require('through2');
var convert = require('../convert');

module.exports = function(opts) {
  return through.obj(function(file, enc, next) {
    file.contents = new Buffer(convert(file.contents.toString(), opts));
    next(null, file);
  });
};
