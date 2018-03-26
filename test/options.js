'use strict';

require('mocha');
const assert = require('assert');
const Converter = require('..');
let converter;

describe('options', function() {
  beforeEach(() => (converter = new Converter()));

  describe('options.variables', function() {
    it('should return a list of all variables', function() {
      converter.convert('{% upcase "name" %}', {variables: true});
      assert(Array.isArray(converter.variables));
      assert.equal(converter.variables.length, 1);
    });

    it('should include block helpers', function() {
      converter.convert('{% raw %}{% endraw %}', {variables: true});
      assert(Array.isArray(converter.variables));
      assert.equal(converter.variables.length, 1);
      assert.equal(converter.variables[0], 'raw');
    });

    it('should reset variables when convert is called', function() {
      converter.convert('{% upcase "name" %}', {variables: true});
      assert.equal(converter.variables.length, 1);

      converter.convert('', {variables: true});
      assert.equal(converter.variables.length, 0);
    });
  });
});

