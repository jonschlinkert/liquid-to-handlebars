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
  it('should convert the shopify cheatsheet', function() {
    assert.equal(convert(fixture('cheatsheet')), expected('cheatsheet'));
  });

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

  it('should convert blog templates', function() {
    assert.equal(convert(fixture('blog.grid')), expected('blog.grid'));
    assert.equal(convert(fixture('blog')), expected('blog'));
  });

  it('should convert cart templates', function() {
    assert.equal(convert(fixture('cart')), expected('cart'));
  });

  it('should convert collection templates', function() {
    assert.equal(convert(fixture('collection')), expected('collection'));
    assert.equal(convert(fixture('collection-grid-item')), expected('collection-grid-item'));
    assert.equal(convert(fixture('collection-listing')), expected('collection-listing'));
    assert.equal(convert(fixture('list-collections')), expected('list-collections'));
  });

  it('should convert index template', function() {
    assert.equal(convert(fixture('index')), expected('index'));
  });

  it('should convert javascript templates', function() {
    assert.equal(convert(fixture('javascript')), expected('javascript'));
  });

  it('should convert open-graph-tags templates', function() {
    assert.equal(convert(fixture('open-graph-tags')), expected('open-graph-tags'));
  });

  it('should convert page templates', function() {
    assert.equal(convert(fixture('page')), expected('page'));
  });

  it('should convert product templates', function() {
    assert.equal(convert(fixture('product-grid-item')), expected('product-grid-item'));
    assert.equal(convert(fixture('product')), expected('product'));
  });

  it('should convert search templates', function() {
    assert.equal(convert(fixture('search')), expected('search'));
  });

  it('should convert shop.js templates', function() {
    assert.equal(convert(fixture('shop.js')), expected('shop.js'));
  });

  it('should convert site-nav templates', function() {
    assert.equal(convert(fixture('site-nav')), expected('site-nav'));
  });

  it('should convert social-links templates', function() {
    assert.equal(convert(fixture('social-links')), expected('social-links'));
  });

  it('should convert style.scss templates', function() {
    assert.equal(convert(fixture('style.scss')), expected('style.scss'));
  });

  it('should convert theme templates', function() {
    assert.equal(convert(fixture('theme')), expected('theme'));
  });

  it('should convert twitter-card templates', function() {
    assert.equal(convert(fixture('twitter-card')), expected('twitter-card'));
  });
});
