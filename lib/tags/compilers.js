'use strict';

var split = require('split-string');
var Converter = require('../converter');
var convert = require('../convert');
var utils = require('../utils');

module.exports = function(options) {
  var opts = options || {};
  opts.node = opts.node || {};
  opts.stack = opts.stack || [];

  var stack = opts.stack;
  var stack = opts.stack;
  var optsNode = opts.node;

  return function(compiler) {
    compiler
      .set('yfm', function(node) {
        if (options.yfm === false) return;
        this.emit('---' + node.val + '---', node);
      })
      .set('body', function(node) {
        this.emit('{% body %}', node);
      })

      .set('literal', function(node) {
        this.emit(node.val, node);
      })

      .set('tag', function(node) {
        var converter = new Converter({stack: opts.stack, node: node});
        var val = converter.convertArgs(node.args);
        this.emit(val, node);
      })

      .set('expression', function(node) {
        var value = node.args;
        var rest = '';
        var args = '';

        var segs = split(node.args, {sep: ' ', keepQuotes: true});
        if (segs.length > 1) {
          value = segs[0].trim();
          rest = segs.slice(1).join(' ');
        }

        var args = utils.namespaceArgs(rest, ['site', 'page', 'post'], opts);
  //       if (rest) {
  //         if (args && args !== rest) {
  // console.log(args)

  //           args = utils.wrap(args);
  //         }
  //       }

        value = utils.escapeValue(convert.conditional(value));
        var val = convert.filters(value, args, false).trim();
        var tight = (!node.hasClose && val.split(' ').length > 1) || utils.isKeyword(val);

        if (utils.isQuoted(val)) {
          val = utils.stripQuotes(val);
        }

        var tripleStache = /^@?(site|page|post)[^\s]+$/.test(val.trim());
        if (tight) {
          val = '{{' + val.trim() + '}}';
        } else {
          val = '{{ ' + val.trim() + ' }}';
        }

        if (tripleStache) {
          val = '{' + val + '}';
        }

        this.emit(val, node);
      })
      .set('text', function(node) {
        this.emit(node.val, node);
      })
      .set('rest', function(node) {
        this.emit(node.val, node);
      });
  };
};
