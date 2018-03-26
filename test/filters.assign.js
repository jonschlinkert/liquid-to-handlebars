'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const converter = require('..');

describe('assign', function() {
  const units = [
    {
      fixture: '{% assign my_string = "Take my protein pills and put my helmet on" %}',
      expected: '{{assign \'my_string\' \'Take my protein pills and put my helmet on\'}}'
    },
    {
      fixture: '{% assign src = article.excerpt_or_content | split: \'src="\' %}',
      expected: '{{assign \'src\' (split article.excerpt_or_content \'src="\')}}'
    },
    {
      fixture: '{% assign src = src[1] | split: \'"\' | first %}',
      expected: '{{assign \'src\' (first (split (get src 1) \'"\'))}}'
    },
    {
      fixture: '{% assign page_1 = pages[variable] %}',
      expected: '{{assign \'page_1\' (get pages variable)}}'
    },
    {
      fixture: '{% assign page_2 = pages["does-not-exist"] %}',
      expected: '{{assign \'page_2\' (get pages \'does-not-exist\')}}'
    },
    {
      fixture: '{% assign page_3 = pages.this-handle-does-not-exist %}',
      expected: '{{assign \'page_3\' pages.this-handle-does-not-exist}}'
    },
    {
      fixture: '{% assign add_to_cart = \'Add to cart\' %}',
      expected: '{{assign \'add_to_cart\' \'Add to cart\'}}'
    },
    {
      fixture: '{% assign sold_out = \'Sold Out\' %}',
      expected: '{{assign \'sold_out\' \'Sold Out\'}}'
    },
    {
      fixture: '{% assign unavailable = \'Unavailable\' %}',
      expected: '{{assign \'unavailable\' \'Unavailable\'}}'
    },
    {
      fixture: '{% assign sections = "basics, tags, filters" | split: ", " %}',
      expected: '{{assign \'sections\' (split \'basics, tags, filters\' \', \')}}'
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
