'use strict';

var union = require('arr-union');
var convert = require('../convert');
var utils = require('../utils');

module.exports = function(options, converter) {
  var opts = options || {};

  return function(compiler) {
    if (opts.variables === true) {
      variables(compiler, opts, converter);
    }

    compiler
      .set('assign', function(node) {
        var val = node.val;
        if (utils.hasDoubleQuotes(val)) {
          val = utils.addQuotes(val);
        }
        this.emit('{{assign ' + node.name + ' ' + val + '}}', node);
      })

      .set('body', function(node) {
        this.emit('{% body %}', node);
      })

      .set('capture', function(node) {
        var args = utils.addQuotes(utils.toString(node.args));
        this.emit('{{#capture ' + args + '}}', node);
      })

      .set('cycle', function(node) {
        this.emit('{{cycle ' + node.args + '}}', node);
      })

      .set('decrement', function(node) {
        this.emit('{{decrement ' + node.args + '}}', node);
      })

      .set('each', function(node) {
        var tok = node.tok;
        var name = node.name || 'each';
        var rest = tok.prefix + tok.exp + ' as |' + tok.key + '|';
        this.emit('{{#' + name + ' ' + rest + '}}', node);
      })

      .set('elsif', function(node) {
        var args = convert.conditional(node.args);
        this.emit('{{else if ' + args + '}}', node);
      })

      .set('end', function(node) {
        if (node.val === 'highlight') {
          this.emit('```', node);
        } else {
          var val = node.tag || node.val;
          this.emit('{{/' + val + '}}', node);
        }
      })

      .set('highlight', function(node) {
        var lang = node.args.split(' ')[0] || '';
        this.emit('```' + lang, node);
      })

      .set('if', function(node) {
        var args = convert.conditional(node.args);
        this.emit('{{#if ' + args + '}}', node);
      })

      .set('include', function(node) {
        this.emit('{{include ' + node.args + '}}', node);
      })

      .set('increment', function(node) {
        this.emit('{{increment ' + node.args + '}}', node);
      })

      .set('tablerow', function(node) {
        this.emit('{{#tablerow ' + node.val + '}}', node);
      })

      .set('unless', function(node) {
        this.emit('{{#unless ' + convert.conditional(node.args) + '}}', node);
      })

      .set('unknown', function(node) {
        if (typeof opts.unknown === 'function') {
          opts.unknown.call(this, node);
        }

        var prefix = opts.node.hasClose ? '#' : '';
        var name = prefix + node.name;

        this.emit(`{{${name} ${node.args}}}`, node);
      })

      .set('rest', function(node) {
        var val = node.val;
        if (node.isBlock === true) {
          val = '{{#' + val.trim() + '}}';
        } else if (options.node && options.node.delimiter) {
          val = '{{ ' + val.trim() + ' }}';
        }
        this.emit(val, node);
      });
  };
};

function variables(compiler, options, converter) {
  var emit = compiler.emit;
  var names = converter.variables;

  compiler.emit = function(val, node) {
    if (!node) {
      throw new Error('expected "node" to be emitted');
    }

    if (!/^([be]os|end|if|elsif)$/.test(node.type) && !/^(raw|['"].*)$/.test(node.name)) {
      if (names.indexOf(node.name) === -1) {
        names.push(node.name);
      }
    }
    return emit.apply(compiler, arguments);
  };

  names.sort();
  union(converter.variables, names);
}
