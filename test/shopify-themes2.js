'use strict';

require('mocha');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var assert = require('assert');
var write = require('write');
var cwd = path.resolve.bind(path, __dirname);
var convert = require('..');

function read(fp) {
  return fs.readFileSync(fp, 'utf8');
}
function fixture(name) {
  return read(cwd('fixtures', name));
}
function expected(name) {
  return read(cwd('expected', name));
}

describe.only('shopify themes', function() {
  var files = glob.sync('shopify-*/**/*.{*liquid*,json}', {cwd: cwd('fixtures')});
  var res = [];

  for (var i = 0; i < files.length; i++) {
    var file = files[i]
    var to = file.replace(/\.liquid$/, '.hbs');
    it('should convert ' + file, create(file, to));
  }

  function create(from, to) {
    return function() {
      assert.equal(convert(fixture(from)), expected(to));
    };
  }
});
