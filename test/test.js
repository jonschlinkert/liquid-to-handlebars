'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);
var fixtures = cwd('fixtures/tags');

describe('tags', function() {
  it(`should convert random unknown tags`, function() {
    assert.equal(convert('{%foo%}'), '{{ foo }}');
    assert.equal(convert('{% foo %}'), '{{ foo }}');
    assert.equal(convert('{{foo}}'), '{{ foo }}');
    assert.equal(convert('{{ foo }}'), '{{ foo }}');
  });

  it(`should convert random unknown blocks`, function() {
    convert('{% foo %} bar {% endfoo %}')
    assert.equal(convert('{% foo %} bar {% endfoo %}'), '{{#foo}} bar {{/foo}}');
  });
});
