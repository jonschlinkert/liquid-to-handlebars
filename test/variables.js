'use strict';

require('mocha');
const support = require('./support');
const assert = require('assert');
const converter = require('..');

describe('variables', function() {
  const units = [
    {
      fixture: '{{ product_price | default: 2.99 }}',
      expected: '{{default product_price 2.99}}'
    },
    {
      fixture: '{{ article-grid-item }}',
      expected: '{{ article-grid-item }}'
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

