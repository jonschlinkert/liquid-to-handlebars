var fs = require('fs');
var path = require('path');
var glob = require('glob');
var write = require('write');
var convert = require('../..');

module.exports = fixtures;

function fixtures(pattern, destBase, options) {
  var opts = Object.assign({cwd: process.cwd()}, options);
  var files = glob.sync(pattern, opts);
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var fp = path.resolve(opts.cwd, file);

    var dest = path.resolve(destBase, file);
    var str = fs.readFileSync(fp, 'utf8');
    dest = dest.replace(/\.liquid$/, '.hbs');
    write.sync(dest, convert(str));
  }
};

fixtures('shopify-*/**/*.{*liquid*,json}', 'test/expected', {cwd: path.join(__dirname, '../fixtures')});
