'use strict';

require('mocha');
const assert = require('assert');
const tests = require('./support/tests');
const convert = require('../lib/convert').conditional;

describe('operators', function() {
  describe('object notation', function() {
    it('should convert object notation', function() {
      assert.equal(convert('foo["bar"]'), "get foo 'bar'");
      assert.equal(convert("foo['bar']"), "get foo 'bar'");
      assert.equal(convert('foo[bar]'), 'get foo bar');
      assert.equal(convert('foo[bar_baz]'), 'get foo bar_baz');
      assert.equal(convert('foo[bar-baz]'), "get foo (get this 'bar-baz')");
    });

    it('should convert object notation with sub-property', function() {
      assert.equal(convert('foo[bar][baz].qux'), "get foo (toPath bar baz 'qux')");
      assert.equal(convert('foo[bar].baz'), "get foo (toPath bar 'baz')");
      assert.equal(convert('foo[bar][baz]'), 'get foo (toPath bar baz)');
    });

    it('should convert add quotes when key has non-word chars', function() {
      assert.equal(convert('foo[bar baz]'), "get foo 'bar baz'");
      assert.equal(convert('foo[bar*baz]'), "get foo 'bar*baz'");
    });

    it('should convert object notation with quotes', function() {
      assert.equal(convert("foo['bar']"), "get foo 'bar'");
      assert.equal(convert('foo["bar"]'), "get foo 'bar'");
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
      assert.equal(convert('foo[0].bar'), "get foo '0.bar'");
      assert.equal(convert('foo[20].bar'), "get foo '20.bar'");
    });

    it('should convert nested array notation', function() {
      assert.equal(convert('foo[20][1]'), "get foo '20.1'");
      assert.equal(convert('foo[20][1][2]'), "get foo '20.1.2'");
    });
  });

  describe('comparison operators', function() {
    var units = [
      {
        fixture: 'foo == bar',
        expected: '(is foo bar)'
      },
      {
        fixture: 'foo === bar',
        expected: '(is foo bar)'
      },
      {
        fixture: 'foo != bar',
        expected: '(isnt foo bar)'
      },
      {
        fixture: 'foo > bar',
        expected: '(gt foo bar)'
      },
      {
        fixture: 'foo >= bar',
        expected: '(gte foo bar)'
      },
      {
        fixture: 'foo < bar',
        expected: '(lt foo bar)'
      },
      {
        fixture: 'foo <= bar',
        expected: '(lte foo bar)'
      }
    ];

    tests(units, function(unit) {
      it('should convert ' + unit.fixture, function() {
        assert.equal(convert(unit.fixture), unit.expected, unit.fixture);
      });
    });
  });

  describe('boolean operators', function() {
    var units = [
      {
        it: 'should convert an "and" operator',
        fixture: 'foo == bar and baz != qux',
        expected: '(and (is foo bar) (isnt baz qux))'
      },
      {
        it: 'should convert multiple "and" operators',
        fixture: 'foo == bar and baz != qux and aaa == bbb',
        expected: '(and (is foo bar) (isnt baz qux) (is aaa bbb))'
      },
      {
        it: 'should convert an "or" operator',
        units: [
          {
            fixture: 'foo == bar or baz != qux',
            expected: '(or (is foo bar) (isnt baz qux))'
          },
          {
            fixture: 'user.name == \'tobi\' or user.name == \'bob\'',
            expected: '(or (is user.name \'tobi\') (is user.name \'bob\'))'
          }
        ]
      },
      {
        it: 'should convert multiple "or" operators',
        fixture: 'foo == bar or baz != qux or aaa === zzz',
        expected: '(or (is foo bar) (isnt baz qux) (is aaa zzz))'
      },
      {
        it: 'should convert both "and" and "or" operators',
        units: [
          {
            fixture: 'foo == bar or baz != qux and aaa === bbb or yyy === zzz',
            expected: '(and (or (is foo bar) (isnt baz qux)) (or (is aaa bbb) (is yyy zzz)))'
          },
          {
            fixture: 'foo == bar and baz != qux or aaa === bbb and yyy === zzz',
            expected: '(and (is foo bar) (or (isnt baz qux) (is aaa bbb)) (is yyy zzz))'
          }
        ]
      },
      {
        it: 'should convert multiple "and" and "or" operators',
        units: [
          {
            fixture: 'one and two and foo == bar or baz != qux and aaa === bbb or yyy === zzz',
            expected: '(and one two (or (is foo bar) (isnt baz qux)) (or (is aaa bbb) (is yyy zzz)))'
          },
          {
            fixture: 'one and two and foo == bar or baz != qux and aaa === bbb or yyy === zzz and other',
            expected: '(and one two (or (is foo bar) (isnt baz qux)) (or (is aaa bbb) (is yyy zzz)) other)'
          }
        ]
      }
    ];

    tests(units, function(unit, desc, num) {
      describe(desc || '', function() {
        it('should convert ' + unit.fixture, function() {
          assert.equal(convert(unit.fixture), unit.expected, unit.fixture);
        });
      });
    });
  });
});
