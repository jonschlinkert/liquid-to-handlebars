'use strict';

var toDoubleQuotes = require('to-double-quotes');
var utils = require('../utils');

module.exports = function(ast, options) {
  return function(compiler) {

    compiler
      .set('assign', function(node) {
        var args = node.args.split(/\s*=\s*/);
        args[0] = '"' + args[0] + '"';

        var val = 'assign ' + args.join(' ');
        if (this.options.nested) {
          this.emit('(' + val + ')');
        } else {
          this.emit('{{' + val + '}}');
        }
      })

      .set('body', function(node) {
        this.emit('{% body %}');
      })

      .set('capture', function(node) {
        this.emit('{{#capture "' + node.args + '"}}');
      })

      .set('case', function(node) {
        var args = utils.convertConditionals(node.args);
        this.emit('{{#case ' + args + '}}');
      })

      .set('cycle', function(node) {
        this.emit('{{cycle ' + node.args + '}}');
      })

      .set('decrement', function(node) {
        this.emit('{{decrement ' + node.args + '}}');
      })

      .set('else', function(node) {
        this.emit('{{else}}');
      })

      .set('each', function(node) {
        var segs = node.args.split(' in ');
        var key = segs.shift();
        var val = segs.pop();
        var args = utils.splitArgs(val, ' ');
        var exp = args.shift();
        var range = utils.toRange(exp);
        if (exp !== range) {
          exp = range;

        } else if (args.length) {
          args.forEach(function(arg) {
            if (/:/.test(arg)) {
              var parts = arg.split(':');
              exp = `(${parts[0]} ${exp} ${parts[1]})`;
            }
          });
        }
        var prefix = node.prefix || '';
        var res = prefix + exp + ' as |' + key + '|';
        var name = node.name || 'each';
        this.emit('{{#' + name + ' ' + res + '}}');
      })

      .set('elsif', function(node) {
        var args = utils.convertConditionals(node.args);
        this.emit('{{else if ' + args + '}}');
      })

      .set('end', function(node) {
        this.emit('{{/' + (node.tag || node.val) + '}}');
      })

      .set('highlight', function(node) {
        this.emit('{{#highlight ' + node.val + '}}');
      })

      .set('if', function(node) {
        var args = utils.convertConditionals(node.args);
        this.emit('{{#if ' + args + '}}');
      })

      .set('include', function(node) {
        var args = node.args.split(' ');
        var name = args[0].replace(/\.html$/, '');
        this.emit('{{include "' + name + '"}}');
      })

      .set('increment', function(node) {
        this.emit('{{increment ' + node.args + '}}');
      })

      .set('loop_statement', function(node) {
        this.emit('{{' + node.val + '}}');
      })

      .set('tablerow', function(node) {
        this.emit('{{#tablerow ' + node.val + '}}');
      })

      .set('when', function(node) {
        var args = utils.convertConditionals(node.args);
        this.emit('{{when ' + args + '}}');
      })

      .set('unless', function(node) {
        var args = utils.convertConditionals(node.args);
        this.emit('{{#unless ' + args + '}}');
      })

      .set('rest', function(node) {
        this.emit('{{' + node.val + '}}');
      })
  };
};
