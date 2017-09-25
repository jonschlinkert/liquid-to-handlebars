'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');
var cwd = path.resolve.bind(path, __dirname);

function read(fp) {
  return fs.readFileSync(fp, 'utf8');
}
function fixture(name) {
  return read(cwd('fixtures/shopify-debut', name + '.liquid'));
}
function expected(name) {
  return read(cwd('expected/shopify-debut', name + '.hbs'));
}

describe('shopify "debut" theme', function() {
  it('should convert assets files', function() {
    assert.equal(convert(fixture('assets/gift-card.scss')), expected('assets/gift-card.scss'));
  });

  it.only('should convert sections templates', function() {
    assert.equal(convert(fixture('sections/custom-content')), expected('sections/custom-content'));
  });
});
