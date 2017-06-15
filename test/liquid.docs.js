'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);

describe('all liquid docs', function() {
  describe('home', function() {
    it(`should convert index.html`, function() {
      var expected = fs.readFileSync(cwd('expected/index.md'), 'utf8');
      var fixture = fs.readFileSync(cwd('fixtures/index.md'), 'utf8');
      var actual = convert(fixture);
      assert.equal(actual, expected);
    });
  });

  describe('liquid-docs', function() {
    var fixtures = cwd('fixtures/liquid-docs');
    fs.readdirSync(fixtures).forEach(function(name) {
      if (/prefixed/.test(name)) return;
      it(`should convert ${name} liquid-docs`, function() {
        var expected = fs.readFileSync(cwd('expected/liquid-docs', name), 'utf8');
        var fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        var actual = convert(fixture);
        if (expected !== actual) {
          // console.log(actual)
        }
        assert.equal(actual, expected);
      });
    });
  });

  describe('liquid-docs with prefix', function() {
    it('should prefix the `site` variable in filter args', function() {
      var actual = convert('{{ "/tags/variable/#assign" | prepend: site.baseurl }}', {prefix: '@'});
      var expected = '{{prepend \'/tags/variable/#assign\' @site.baseurl}}';
      assert.equal(actual, expected);
    });

    it('should prefix the `site` variable in expressions', function() {
      assert.equal(convert('{{site.foo}}', {prefix: '@'}), '{{{ @site.foo }}}');
      assert.equal(convert('{{ site.foo }}', {prefix: '@'}), '{{{ @site.foo }}}');
      assert.equal(convert('{{page.foo}}', {prefix: '@'}), '{{{ @page.foo }}}');
      assert.equal(convert('{{ page.foo }}', {prefix: '@'}), '{{{ @page.foo }}}');
    });

    it(`should prefix variables with options.prefix`, function() {
      var name = 'types-prefixed.md';
      var fixtures = cwd('fixtures/liquid-docs');
      var fixture = path.join(fixtures, name);
      var expected = fs.readFileSync(cwd('expected/liquid-docs', name), 'utf8');
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
        if (expected !== actual) {
          console.log(actual);
        }
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
