'use strict';

var Converter = require('../converter');
var filters = require('../filters');

module.exports = function(options) {
  var opts = Object.assign({}, options);

  return function(compiler) {
    compiler
      .set('yfm', function(node) {
        if (options.yfm === false) return;
        this.emit('---' + node.val + '---');
      })
      .set('body', function(node) {
        this.emit('{% body %}');
      })
      .set('filter', function(node) {
        var str = filters.toSubexpressions(node.args);
        if (typeof str === 'undefined' && node.args) {
          throw new Error(`syntax error: ${node.args}`);
        }
        this.emit('{{' + str + '}}');
      })
      .set('tag', function(node) {
        var converter = new Converter(options);
        var args = converter.convertArgs(node.args, {node: node});
        this.emit(args, node);
      })
      .set('literal', function(node) {
        this.emit(node.val);
      })
      .set('expression', function(node) {
        var args = node.args;
        var match = /([^[]+)\[(\d+)\]/.exec(args);
        if (match) {
          args = 'nth ' + match[1] + ' ' + match[2] + '';
        }

        if (opts.wrap === false) {
          this.emit(args);
          return;
        }

        if (match || args.split(' ').length > 1) {
          this.emit('{{' + args + '}}');
        } else {
          this.emit('{{ ' + args + ' }}');
        }
      })
      .set('text', function(node) {
        this.emit(node.val);
      })
      .set('rest', function(node) {
        this.emit(node.val);
      });
  };
};
