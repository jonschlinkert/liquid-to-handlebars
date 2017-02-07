'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var convert = require('..');
var fixtures = path.join(__dirname, 'fixtures/filters');

describe('filters', function() {
  fs.readdirSync(fixtures).forEach(function(name) {
    // if (name !== 'replace.md') return;
    it(`should convert ${name} filters`, function() {
      var fixture = support.filter(name);
      var expected = support.expected(path.join('filters', name));
      var actual = convert(fixture);
      assert.equal(actual, expected);
    });
  });
});
