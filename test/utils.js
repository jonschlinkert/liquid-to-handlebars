'use strict';

require('mocha');
const assert = require('assert');
const utils = require('../lib/utils');

describe('utils', function() {
  describe('isDotProp', function() {
    it('should be true for alpha characters', function() {
      assert(utils.isDotProp('a'));
      assert(utils.isDotProp('abc'));
    });

    it('should be true for alpha-numeric characters', function() {
      assert(utils.isDotProp('a13'));
      assert(utils.isDotProp('abc123'));
      assert(utils.isDotProp('123abc123'));
      assert(utils.isDotProp('123abc'));
    });

    it('should be true for bracket-notation', function() {
      assert(utils.isDotProp('abc[0]'));
      assert(utils.isDotProp('a-b-c[0]'));
      assert(utils.isDotProp('abc[1]'));
      assert(utils.isDotProp('a[1]'));
      assert(utils.isDotProp('a[123]'));
    });

    it('should be true for dot notation', function() {
      assert(utils.isDotProp('a.13'));
      assert(utils.isDotProp('ab.cd'));
      assert(utils.isDotProp('a.b.c'));
      assert(utils.isDotProp('abc.def.ghi'));
      assert(utils.isDotProp('123.abc'));
      assert(utils.isDotProp('1-2-3.a-b-c'));
      assert(utils.isDotProp('abc.123'));
    });

    it('should be true for dot notation with bracket notation', function() {
      assert(utils.isDotProp('a.13[1]'));
      assert(utils.isDotProp('ab.cd[1]'));
      assert(utils.isDotProp('a.b.c[1]'));
      assert(utils.isDotProp('abc.def.ghi[0]'));
      assert(utils.isDotProp('123.abc[1]'));
      assert(utils.isDotProp('abc.123[1]'));
    });

    it('should be false if non-word characters exist', function() {
      assert(!utils.isDotProp('"a.13[1]"'));
      assert(!utils.isDotProp('|'));
      assert(!utils.isDotProp('`a.b.c[1]`'));
      assert(!utils.isDotProp('@abc.def.ghi[0]'));
      assert(!utils.isDotProp('&123.abc[1]'));
      assert(!utils.isDotProp('#abc.123[1]'));
      assert(!utils.isDotProp('abc=xyz'));
    });
  });
});

