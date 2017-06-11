'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);
var fixtures = cwd('fixtures/tags');

describe('tags', function() {
  it('should convert the readme example', function() {
    assert.equal(convert('{{ product_price | default: 2.99 }}'), '{{default product_price 2.99}}');
  });

  it('should convert random unknown tags', function() {
    assert.equal(convert('{%foo%}'), '{{ foo }}');
    assert.equal(convert('{% foo %}'), '{{ foo }}');
    assert.equal(convert('{{foo}}'), '{{ foo }}');
    assert.equal(convert('{{ foo }}'), '{{ foo }}');
  });

  it('should convert random unknown blocks', function() {
    assert.equal(convert('{% foo %} bar {% endfoo %}'), '{{#foo}} bar {{/foo}}');
  });

  it('should convert complex filters', function() {
    assert.equal(convert('{{ paginator.next_page_path | prepend: site.baseurl | replace: \'//\', \'/\' }}'), '{{replace (prepend paginator.next_page_path site.baseurl) \'//\' \'/\'}}');
  });
});
