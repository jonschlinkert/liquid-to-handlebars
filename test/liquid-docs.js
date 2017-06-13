'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);

describe('all tags in the liquid docs', function() {
  describe('home', function() {
    it(`should convert index.html`, function() {
      var expected = fs.readFileSync(cwd('expected/index.md'), 'utf8');
      var fixture = fs.readFileSync(cwd('fixtures/index.md'), 'utf8');
      var actual = convert(fixture);
      assert.equal(actual, expected);
    });
  });

  describe('basics', function() {
    var fixtures = cwd('fixtures/basics');
    fs.readdirSync(fixtures).forEach(function(name) {
      it(`should convert ${name} basics`, function() {
        var expected = fs.readFileSync(cwd('expected/basics', name), 'utf8');
        var fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        var actual = convert(fixture);
        assert.equal(actual, expected);
      });
    });
  });

  describe('basics with prefix', function() {
    it(`should prefix variables with options.prefix`, function() {
      var name = 'types-prefixed.md';
      var fixtures = cwd('fixtures/basics');
      var fixture = path.join(fixtures, name);
      var expected = fs.readFileSync(cwd('expected/basics', name), 'utf8');
      var fixture = fs.readFileSync(fixture, 'utf8');
      var actual = convert(fixture, {prefix: '@'});
      assert.equal(actual, expected);
    });
  });

  describe('layouts', function() {
    var fixtures = cwd('fixtures/_layouts');
    fs.readdirSync(fixtures).forEach(function(name) {
      it(`should convert ${name} _layouts`, function() {
        var expected = fs.readFileSync(cwd('expected/_layouts', name), 'utf8');
        var fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        var actual = convert(fixture);
        assert.equal(actual, expected);
      });
    });
  });

  describe('includes', function() {
    var fixtures = cwd('fixtures/_includes');
    fs.readdirSync(fixtures).forEach(function(name) {
      it(`should convert ${name} _includes`, function() {
        var expected = fs.readFileSync(cwd('expected/_includes', name), 'utf8');
        var fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        var actual = convert(fixture);
        if (expected !== actual) {
          console.log(actual)
        }
        assert.equal(actual, expected);
      });
    });
  });
});
