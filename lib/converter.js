'use strict';

var convert = require('./convert');
var through = require('through2');

module.exports = function(opts) {
  return through.obj(function (file, enc, next) {
    var str = file.contents.toString();
    str = str.split('{{ content }}').join('{% body %}');
    file.contents = new Buffer(convert(str, opts));
    next(null, file);
  });
};
