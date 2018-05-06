'use strict';

require('mocha');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const support = require('./support');
const converter = require('..');
const cwd = path.join.bind(path, __dirname);
const fixtures = cwd('fixtures/tags');

describe('tags', function() {
  describe('unknown tags', function() {
    const units = [
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

    const hasOnly = support.hasOnly(units);
    units.forEach(function(unit) {
      if (hasOnly && !unit.only) return;
      it('should convert ' + unit.fixture, function() {
        assert.equal(converter.convert(unit.fixture), unit.expected, unit.fixture);
      });
    });
  });

  describe('block tags', function() {
    const units = [
      {
        fixture: '{% unless settings.homepage_collection == blank or collections[settings.homepage_collection].empty? %}fooo{% endunless %}',
        expected: '{{#unless (or (is settings.homepage_collection blank) (get collections (toPath settings.homepage_collection \'empty\')))}}fooo{{/unless}}'
      },
      {
        fixture: '{% raw %}{% capture %}{% endcapture %}{% endraw %}{% capture %}foo{% endcapture %}',
        expected: '{{{{raw}}}}{{#capture}}{{/capture}}{{{{/raw}}}}{{#capture}}foo{{/capture}}'
      },
      {
        fixture: '{% if collections[product_vendor_handle].handle == product_vendor_handle %}{% endif %}',
        expected: '{{#if (is (get collections (toPath product_vendor_handle \'handle\')) product_vendor_handle)}}{{/if}}'
      },
      {
        fixture: '<input type="checkbox" class="sidebar-checkbox" id="sidebar-checkbox" {% if page.title =="Home" %}checked{% endif %}>',
        expected: '<input type="checkbox" class="sidebar-checkbox" id="sidebar-checkbox" {{#if (is page.title \'Home\')}}checked{{/if}}>'
      },
      {
        fixture: '**Objects** tell Liquid where to show content on a page. Objects and variable names are denoted by double curly braces: `{% raw %}{{{% endraw %}` and `{% raw %}}}{% endraw %}`.',
        expected: '**Objects** tell Liquid where to show content on a page. Objects and variable names are denoted by double curly braces: `{{{{raw}}}}{{{% endraw %}` and `{% raw %}}}{{{{/raw}}}}`.'
      },
      {
        fixture: '{% for item in array reversed %} {{ item }} {% endfor %}',
        expected: '{{#each (reversed array) as |item|}} {{ item }} {{/each}}'
      }
    ];

    const hasOnly = support.hasOnly(units);
    units.forEach(function(unit) {
      if (hasOnly && !unit.only) return;
      it('should convert ' + unit.fixture, function() {
        assert.equal(converter.convert(unit.fixture), unit.expected, unit.fixture);
      });
    });
  });

  describe('liquid tags', function() {
    fs.readdirSync(fixtures).forEach(name => {
      // if (!/layout/.test(name)) return;
      it(`should convert ${name} tags`, function() {
        const expected = fs.readFileSync(cwd('expected/tags', name), 'utf8');
        const fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
        const actual = converter.convert(fixture);
        assert.equal(actual, expected, name);
      });
    });
  });
});
