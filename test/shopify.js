'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);

function fixture(name) {
  return fs.readFileSync(cwd('fixtures/shopify', name + '.liquid'), 'utf8');
}
function expected(name) {
  return fs.readFileSync(cwd('expected/shopify', name + '.hbs'), 'utf8');
}

describe('shopify templates', function() {
  it('should convert article*', function() {
    assert.equal(convert(fixture('article')), expected('article'));
    assert.equal(convert(fixture('article-grid-item')), expected('article-grid-item'));
  });

  it('should convert assign', function() {
    assert.equal(convert(fixture('assign')), expected('assign'));
  });

  it('should convert if', function() {
    assert.equal(convert(fixture('if-complex')), expected('if-complex'));
  });

  it('should convert blog.grid.liquid', function() {
    assert.equal(convert(fixture('blog.grid')), expected('blog.grid'));
  });

  it('should convert blog.liquid', function() {
    assert.equal(convert(fixture('blog')), expected('blog'));
  });

  it('should convert cart.liquid', function() {
    assert.equal(convert(fixture('cart')), expected('cart'));
  });

  it.skip('should convert collection templates', function() {
    // console.log(convert(fixture('collection-listing')))
    // assert.equal(convert(fixture('collection')), expected('collection'));
    assert.equal(convert(fixture('collection-listing')), expected('collection-listing'));
    // assert.equal(convert(fixture('list-collections')), expected('list-collections'));
  });

  it('should convert index.liquid', function() {
    assert.equal(convert(fixture('index')), expected('index'));
  });

  it('should convert page.liquid', function() {
    assert.equal(convert(fixture('page')), expected('page'));
  });

  it('should convert javascript.liquid', function() {
    assert.equal(convert(fixture('javascript')), expected('javascript'));
  });

  it('should convert product.liquid', function() {
    assert.equal(convert(fixture('product')), expected('product'));
  });

  it('should convert search.liquid', function() {
    assert.equal(convert(fixture('search')), expected('search'));
  });
});
