'use strict';

require('mocha');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const converter = require('..');
const cwd = path.join.bind(path, __dirname);

function fixture(name) {
  return fs.readFileSync(cwd('fixtures/liquid-wiki', name + '.md'), 'utf8');
}
function expected(name) {
  return fs.readFileSync(cwd('expected/liquid-wiki', name + '.md'), 'utf8');
}

describe('templates from liquid wiki', function() {
  it('should convert liquid-for-designers', function() {
    const actual = converter.convert(fixture('liquid-for-designers'));
    assert.equal(actual, expected('liquid-for-designers'));
  });
});
