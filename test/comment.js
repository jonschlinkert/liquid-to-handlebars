'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var support = require('./support');
var assert = require('assert');
var convert = require('..');

describe('comments', function() {
  var units = [
    {
      fixture: '{{!matched pairs of curly brackets and percent signs}}',
      expected: '{{! matched pairs of curly brackets and percent signs }}'
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

