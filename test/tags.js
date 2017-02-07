'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var convert = require('..');
var fixtures = path.join(__dirname, 'fixtures/liquid/tags');

describe('tags', function() {
  fs.readdirSync(fixtures).forEach(function(name) {
    // if (name !== 'iteration.md') return;
    it(`should convert ${name} tags`, function() {
      var fixture = support.tag(name);
      var expected = support.expected(path.join('tags', name));
      var actual = convert(fixture);
      assert.equal(actual, expected);
    });
  });
});
