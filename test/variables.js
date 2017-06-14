'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var support = require('./support');
var assert = require('assert');
var convert = require('..');

describe('variables', function() {
  var units = [
    {
      fixture: '{{ product_price | default: 2.99 }}',
      expected: '{{default product_price 2.99}}'
    },
    {
      fixture: '{{ article-grid-item }}',
      expected: '{{ article-grid-item }}'
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

