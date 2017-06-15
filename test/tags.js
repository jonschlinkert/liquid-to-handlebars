'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);
var fixtures = cwd('fixtures/tags');

describe('tags', function() {
  describe('unknown tags', function() {
    var units = [
      {
        fixture: '{%foo%}',
        expected: '{{ foo }}'
      },
      {
        fixture: '{% foo %}',
        expected: '{{ foo }}'
      },
      {
        fixture: '{{foo}}',
        expected: '{{ foo }}'
      },
      {
        fixture: '{{ foo }}',
        expected: '{{ foo }}'
      },
      {
        fixture: '{%foo%}{%endfoo%}',
        expected: '{{#foo}}{{/foo}}'
      },
      {
        fixture: '{% foo %} bar {% endfoo %}',
        expected: '{{#foo}} bar {{/foo}}'
      },
      {
        fixture: '{% foo %} bar {% endfoo %}',
        expected: '{{#foo}} bar {{/foo}}'
      }
    ];

    var hasOnly = support.hasOnly(units);
    units.forEach(function(unit) {
      if (hasOnly && !unit.only) return;
      it('should convert ' + unit.fixture, function() {
        assert.equal(convert(unit.fixture), unit.expected, unit.fixture);
      });
    });
  });

  describe('block tags', function() {
    var units = [
      {
        fixture: '{% unless settings.homepage_collection == blank or collections[settings.homepage_collection].empty? %}fooo{% endunless %}',
        expected: '{{#unless (or (is settings.homepage_collection blank) (get collections (toPath settings.homepage_collection \'empty\')))}}fooo{{/unless}}'
      },
      {
        fixture: '{% raw %}{% capture %}{% endraw %}{% capture %}foo{% endcapture %}',
        expected: '{{#raw}}{{#capture}}{{/capture}}{{#capture}}foo{{/capture}}'
      },
      {
        fixture: '{% if collections[product_vendor_handle].handle == product_vendor_handle %}{% endif %}',
        expected: '{{#if (is (get collections (toPath product_vendor_handle \'handle\')) product_vendor_handle)}}{{/if}}'
      },
    ];

    var hasOnly = support.hasOnly(units);
    units.forEach(function(unit) {
      if (hasOnly && !unit.only) return;
      it('should convert ' + unit.fixture, function() {
        assert.equal(convert(unit.fixture), unit.expected, unit.fixture);
      });
    });
  });

  describe('liquid tags', function() {
    fs.readdirSync(fixtures).forEach(function(name) {
      // if (!/layout/.test(name)) return;
      it(`should convert ${name} tags`, function() {
        var expected = fs.readFileSync(cwd('expected/tags', name), 'utf8');
        var fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        var actual = convert(fixture);
        assert.equal(actual, expected);
      });
    });
  });
});
