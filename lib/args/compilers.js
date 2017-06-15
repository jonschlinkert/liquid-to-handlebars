'use strict';

var split = require('split-string');
var convert = require('../convert');
var utils = require('../utils');

module.exports = function(options) {
  var opts = options || {};

  return function(compiler) {
    compiler
      .set('assign', function(node) {
        var val = node.val;
        if (utils.hasDoubleQuotes(val)) {
          val = utils.addQuotes(val);
        }
        this.emit('{{assign ' + node.name + ' ' + val + '}}');
      })

      .set('body', function(node) {
        this.emit('{% body %}');
      })

      .set('capture', function(node) {
        var args = utils.addQuotes(utils.toString(node.args));
        this.emit('{{#capture ' + args + '}}');
      })

      .set('cycle', function(node) {
        this.emit('{{cycle ' + node.args + '}}');
      })

      .set('decrement', function(node) {
        this.emit('{{decrement ' + node.args + '}}');
      })

      .set('each', function(node) {
        var tok = node.tok;
        var name = node.name || 'each';
        var rest = tok.prefix + tok.exp + ' as |' + tok.key + '|';
        this.emit('{{#' + name + ' ' + rest + '}}');
      })

      .set('elsif', function(node) {
        var args = convert.conditional(node.args);
        this.emit('{{else if ' + args + '}}');
      })

      .set('end', function(node) {
        if (node.val === 'highlight') {
          this.emit('```');
        } else {
          var val = node.tag || node.val;
          this.emit('{{/' + val + '}}');
        }
      })

      .set('highlight', function(node) {
        this.emit('```' + node.val.split(/ +/)[0] || '');
      })

      .set('if', function(node) {
        var args = convert.conditional(node.args);
        this.emit('{{#if ' + args + '}}');
      })

      .set('include', function(node) {
        this.emit('{{include ' + node.args + '}}');
      })

      .set('increment', function(node) {
        this.emit('{{increment ' + node.args + '}}');
      })

      .set('tablerow', function(node) {
        this.emit('{{#tablerow ' + node.val + '}}');
      })

      .set('unless', function(node) {
        this.emit('{{#unless ' + convert.conditional(node.args) + '}}');
      })

      .set('unknown', function(node) {
        if (typeof opts.unknown === 'function') {
          opts.unknown.call(this, node);
        }

        var prefix = opts.node.hasClose ? '#' : '';
        var name = prefix + node.name;

        this.emit(`{{${name} ${node.args}}}`);
      })

      .set('rest', function(node) {
        var val = node.val;
        if (node.isBlock === true) {
          val = '{{#' + val.trim() + '}}';
        } else if (options.node && options.node.delimiter) {
          val = '{{ ' + val.trim() + ' }}';
        }
        this.emit(val);
      });
  };
};
