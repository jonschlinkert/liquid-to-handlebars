'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var Converter = require('..');

function convert() {
  var converter = new Converter();
  return converter.convert.apply(converter, arguments);
}

describe('capture', function() {
  var units = [
    {
      fixture: '{% capture "foo" %}{{ bar }}{% endcapture %}{{foo}}',
      expected: '{{#capture \'foo\'}}{{ bar }}{{/capture}}{{ foo }}'
    },
    {
      fixture: '{% capture "foo" %}{{ bar }}{% endcapture %}{{upper foo}}',
      expected: '{{#capture \'foo\'}}{{ bar }}{{/capture}}{{upper foo}}'
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
