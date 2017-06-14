'use strict';

var split = require('split-string');
var utils = require('../utils');
var convert = require('../convert');
var Converter = require('../..');

module.exports = function(options) {
  var opts = options || {};

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
        var opt = Object.assign({}, options, {stack: opts.stack, node: node});
        var converter = new Converter(opt);
        var val = converter.convertArgs(node.args);
        this.emit(val, node);
      })

      .set('expression', function(node) {
        var value = node.args;
        var rest = '';

        var segs = split(node.args, {sep: ' ', keepQuotes: true});
        if (segs.length > 1) {
          value = segs[0].trim();
          rest = segs.slice(1).join(' ');
        }

        var args = rest;
        if (args) {
          args = utils.namespaceArgs(rest, ['site', 'page', 'post'], opts);
        } else {
          value = utils.namespaceArgs(value, ['site', 'page', 'post'], opts);
        }

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
