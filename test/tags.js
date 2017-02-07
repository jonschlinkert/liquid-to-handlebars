'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);
var fixtures = cwd('fixtures/tags');

describe('tags', function() {
  fs.readdirSync(fixtures).forEach(function(name) {
    it(`should convert ${name} tags`, function() {
      var expected = fs.readFileSync(cwd('expected/tags', name), 'utf8');
      var fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
      var actual = convert(fixture);
      assert.equal(actual, expected);
    });
  });
});
