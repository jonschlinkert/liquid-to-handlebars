'use strict';

var Converter = require('../converter');
var filters = require('../filters');
var utils = require('../utils');

module.exports = function(options) {
  var opts = Object.assign({}, options);

  return function(compiler) {
    compiler
      .set('yfm', function(node) {
        if (options.yfm === false) return;
        this.emit('---' + node.val + '---', node);
      })
      .set('body', function(node) {
        this.emit('{% body %}', node);
      })
      .set('filter', function(node) {
        var val = filters.toSubexpressions(node.args);
        if (typeof val === 'undefined' && node.args) {
          throw new Error(`syntax error: ${node.args}`);
        }
        val = utils.namespaceArgs(val, ['site', 'page', 'post'], opts);
        this.emit('{{' + val + '}}', node);
      })
      .set('tag', function(node) {
        var converter = new Converter(options);
        var tag = converter.convertArgs(node.args, {node: node});
        this.emit(tag, node);
      })
      .set('literal', function(node) {
        this.emit(node.val, node);
      })
      .set('expression', function(node) {
        var args = node.args;
        if (utils.isNamespaced(args, ['site', 'page', 'post'], opts)) {
          node.safeString = false;
        }

        var val = utils.namespaceArgs(args, ['site', 'page', 'post'], opts);
        if (opts.wrap === false) {
          this.emit(val, node);
          return;
        }

        if (args.split(' ').length > 1) {
          val = '{{' + args + '}}';
        } else {
          val = '{{ ' + args.trim() + ' }}';
        }

        if (node.safeString === false || node.escape === true) {
          val = '{' + val + '}';
        }
        if (node.escape === true) {
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
