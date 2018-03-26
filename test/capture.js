'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const converter = require('..');

describe('capture', function() {
  const units = [
    {
      fixture: '{% capture "foo" %}{{ bar }}{% endcapture %}{{foo}}',
      expected: '{{#capture \'foo\'}}{{ bar }}{{/capture}}{{ foo }}'
    },
    {
      fixture: '{% capture "foo" %}{{ bar }}{% endcapture %}{{upper foo}}',
      expected: '{{#capture \'foo\'}}{{ bar }}{{/capture}}{{upper foo}}'
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
