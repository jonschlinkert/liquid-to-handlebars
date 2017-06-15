'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);

function fixture(name) {
  return fs.readFileSync(cwd('fixtures/liquid-wiki', name + '.md'), 'utf8');
}
function expected(name) {
  return fs.readFileSync(cwd('expected/liquid-wiki', name + '.md'), 'utf8');
}

describe('templates from liquid wiki', function() {
  it('should convert liquid-for-designers', function() {
    var actual = convert(fixture('liquid-for-designers'));
    assert.equal(actual, expected('liquid-for-designers'));
  });
});
