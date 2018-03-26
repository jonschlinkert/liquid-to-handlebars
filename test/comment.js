'use strict';

require('mocha');
const support = require('./support');
const assert = require('assert');
const converter = require('..');

describe('comments', function() {
  const units = [
    {
      fixture: '{{!matched pairs of curly brackets and percent signs}}',
      expected: '{{! matched pairs of curly brackets and percent signs }}'
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

