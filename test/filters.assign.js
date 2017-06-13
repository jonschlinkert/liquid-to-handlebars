'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');

describe('assign', function() {
  it.only('should convert assign filters', function() {
    var actual = convert('{% assign src = article.excerpt_or_content | split: \'src="\' %}');
    assert.equal(actual, '{{assign "src" (split article.excerpt_or_content \'src="\')}}');

    var actual = convert('  {% assign src = src[1] | split: \'"\' | first %}');
    assert.equal(actual, '{{assign "src" (first (split (get src 1), \'"\'))}}');
  });
});
