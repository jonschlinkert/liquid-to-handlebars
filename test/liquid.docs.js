'use strict';

require('mocha');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const converter = require('..');
const cwd = path.join.bind(path, __dirname);

describe('all liquid docs', function() {
  describe('home', function() {
    it('should convert index.html', function() {
      const expected = fs.readFileSync(cwd('expected/index.md'), 'utf8');
      const fixture = fs.readFileSync(cwd('fixtures/index.md'), 'utf8');
      const actual = converter.convert(fixture);
      assert.equal(actual, expected);
    });
  });

  describe('liquid-docs', function() {
    const fixtures = cwd('fixtures/liquid-docs');
    fs.readdirSync(fixtures).forEach(function(name) {
      if (/prefixed/.test(name)) return;
      it(`should convert ${name} liquid-docs`, function() {
        const expected = fs.readFileSync(cwd('expected/liquid-docs', name), 'utf8');
        const fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        const actual = converter.convert(fixture);
        // if (expected !== actual) {
        //   // console.log(actual)
        // }
        assert.equal(actual, expected);
      });
    });
  });

  describe('liquid-docs with prefix', function() {
    it('should prefix the `site` variable in filter args', function() {
      const actual = converter.convert('{{ "/tags/variable/#assign" | prepend: site.baseurl }}', {prefix: '@'});
      const expected = '{{prepend \'/tags/variable/#assign\' @site.baseurl}}';
      assert.equal(actual, expected);
    });

    it('should prefix the `site` variable in expressions', function() {
      assert.equal(converter.convert('{{site.foo}}', {prefix: '@'}), '{{{ @site.foo }}}');
      assert.equal(converter.convert('{{ site.foo }}', {prefix: '@'}), '{{{ @site.foo }}}');
      assert.equal(converter.convert('{{page.foo}}', {prefix: '@'}), '{{{ @page.foo }}}');
      assert.equal(converter.convert('{{ page.foo }}', {prefix: '@'}), '{{{ @page.foo }}}');
    });

    it('should prefix variables with options.prefix', function() {
      const name = 'types-prefixed.md';
      const fixtures = cwd('fixtures/liquid-docs');
      const fp = path.join(fixtures, name);
      const expected = fs.readFileSync(cwd('expected/liquid-docs', name), 'utf8');
      const fixture = fs.readFileSync(fp, 'utf8');
      const actual = converter.convert(fixture, {prefix: '@'});
      assert.equal(actual, expected);
    });
  });

  describe('layouts', function() {
    const fixtures = cwd('fixtures/_layouts');
    fs.readdirSync(fixtures).forEach(function(name) {
      it(`should convert ${name} _layouts`, function() {
        const expected = fs.readFileSync(cwd('expected/_layouts', name), 'utf8');
        const fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        const actual = converter.convert(fixture);
        if (expected !== actual) {
          console.log(actual);
        }
        assert.equal(actual, expected);
      });
    });
  });

  describe('includes', function() {
    const fixtures = cwd('fixtures/_includes');
    fs.readdirSync(fixtures).forEach(function(name) {
      it(`should convert ${name} _includes`, function() {
        const expected = fs.readFileSync(cwd('expected/_includes', name), 'utf8');
        const fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        const actual = converter.convert(fixture);
        if (expected !== actual) {
          console.log(actual);
        }
        assert.equal(actual, expected);
      });
    });
  });
});
