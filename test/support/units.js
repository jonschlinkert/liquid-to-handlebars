var fs = require('fs');
var path = require('path');
var glob = require('glob');
var write = require('write');
var convert = require('../..');

module.exports = fixtures;

function fixtures(pattern, dest, options) {
  var opts = Object.assign({cwd: process.cwd()}, options);
  var files = glob.sync(pattern, opts);
  var res = [];

  for (var i = 0; i < files.length; i++) {
    var file = files[i]
    res.push(create(file, file.replace(/\.liquid$/, '.hbs')));
  }

  write.sync(dest, res.join('\n'));
};

fixtures('shopify-*/**/*.{*liquid*,json}', path.join(process.cwd(), 'temp.js'), {cwd: path.join(__dirname, '../fixtures')});

function create(from, to) {
  return `assert.equal(convert(fixture('${from}')), expected('${to}'));`;
}
