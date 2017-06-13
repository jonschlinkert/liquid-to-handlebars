'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var convert = require('../lib/operators');

describe('operators', function() {
  describe('comparison operators', function() {
    it('should convert equals', function() {
      assert.equal(convert('foo == bar'), '(is foo bar)');
    });

    it('should convert strict equals', function() {
      assert.equal(convert('foo === bar'), '(is foo bar)');
    });

    it('should convert isnt', function() {
      assert.equal(convert('foo != bar'), '(isnt foo bar)');
    });

    it('should convert greater-than', function() {
      assert.equal(convert('foo > bar'), '(gt foo bar)');
    });

    it('should convert greater-than-or-equal', function() {
      assert.equal(convert('foo >= bar'), '(gte foo bar)');
    });

    it('should convert less-than', function() {
      assert.equal(convert('foo < bar'), '(lt foo bar)');
    });

    it('should convert less-than-or-equal', function() {
      assert.equal(convert('foo <= bar'), '(lte foo bar)');
    });
  });

  describe('boolean operators', function() {
    it('should convert an "and" operator', function() {
      var actual = convert('foo == bar and baz != qux');
      var expected = '(and (is foo bar) (isnt baz qux))';
      assert.equal(actual, expected);
    });

    it('should convert multiple "and" operators', function() {
      var actual = convert('foo == bar and baz != qux and aaa == bbb');
      var expected = '(and (is foo bar) (isnt baz qux) (is aaa bbb))';
      assert.equal(actual, expected);
    });

    it('should convert an "or" operator', function() {
      var actual = convert('foo == bar or baz != qux');
      var expected = '(or (is foo bar) (isnt baz qux))';
      assert.equal(actual, expected);
    });

    it('should convert multiple "or" operators', function() {
      var actual = convert('foo == bar or baz != qux or aaa === zzz');
      var expected = '(or (is foo bar) (isnt baz qux) (is aaa zzz))';
      assert.equal(actual, expected);
    });

    it('should convert both "and" and "or" operators', function() {
      assert.equal(convert('foo == bar or baz != qux and aaa === bbb or yyy === zzz'), '(and (or (is foo bar) (isnt baz qux)) (or (is aaa bbb) (is yyy zzz)))');
      assert.equal(convert('foo == bar and baz != qux or aaa === bbb and yyy === zzz'), '(and (is foo bar) (or (isnt baz qux) (is aaa bbb)) (is yyy zzz))');
    });

    it('should convert multiple "and" and "or" operators', function() {
      assert.equal(convert('one and two and foo == bar or baz != qux and aaa === bbb or yyy === zzz'), '(and one two (or (is foo bar) (isnt baz qux)) (or (is aaa bbb) (is yyy zzz)))');

      assert.equal(convert('one and two and foo == bar or baz != qux and aaa === bbb or yyy === zzz and other'), '(and one two (or (is foo bar) (isnt baz qux)) (or (is aaa bbb) (is yyy zzz)) other)');
    });
  });

  describe('object notation', function() {
    it('should convert object notation', function() {
      assert.equal(convert('foo["bar"]'), 'get foo "bar"');
      assert.equal(convert('foo[\'bar\']'), 'get foo \'bar\'');
      assert.equal(convert('foo[bar]'), 'get foo bar');
      assert.equal(convert('foo[bar_baz]'), 'get foo bar_baz');
      assert.equal(convert('foo[bar-baz]'), 'get foo (get this "bar-baz")');
    });

    it('should convert object notation with sub-property', function() {
      assert.equal(convert('foo[bar][baz].qux'), 'get foo (toPath bar baz "qux")');
      assert.equal(convert('foo[bar].baz'), 'get foo (toPath bar "baz")');
      assert.equal(convert('foo[bar][baz]'), 'get foo (toPath bar baz)');
    });

    it('should convert add quotes when key has non-word chars', function() {
      assert.equal(convert('foo[bar baz]'), 'get foo "bar baz"');
      assert.equal(convert('foo[bar*baz]'), 'get foo "bar*baz"');
    });

    it('should convert object notation with quotes', function() {
      assert.equal(convert('foo[\'bar\']'), 'get foo \'bar\'');
      assert.equal(convert('foo["bar"]'), 'get foo "bar"');
    });
  });

  describe('array notation', function() {
    it('should convert array notation', function() {
      assert.equal(convert('foo[0]'), 'get foo 0');
      assert.equal(convert('foo[1]'), 'get foo 1');
      assert.equal(convert('foo[10]'), 'get foo 10');
    });

    it('should convert array notation with dot-notation', function() {
      assert.equal(convert('site.users[0]'), 'get site.users 0');
      assert.equal(convert('foo[0].bar'), 'get foo "0.bar"');
      assert.equal(convert('foo[20].bar'), 'get foo "20.bar"');
    });

    it('should convert nested array notation', function() {
      assert.equal(convert('foo[20][1]'), 'get foo "20.1"');
      assert.equal(convert('foo[20][1][2]'), 'get foo "20.1.2"');
    });
  });
});
