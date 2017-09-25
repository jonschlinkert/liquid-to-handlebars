'use strict';

var union = require('arr-union');
var utils = require('../utils');
var convert = require('../convert');
var Converter = require('../..');

module.exports = function(options, converter) {
  var opts = options || {};
  var stack = converter.stack;

  return function(compiler) {
    if (opts.variables === true) {
      variables(compiler, opts, converter);
    }

    compiler
      .set('yfm', function(node) {
        if (options.yfm === false) return;
        this.emit('---' + node.val + '---', node);
      })

      .set('body', function(node) {
        this.emit('{% body %}', node);
      })

      .set('comment', function(node) {
        this.emit('{{! ' + node.args.trim() + ' }}', node);
      })

      .set('literal', function(node) {
        this.emit('{{{{' + (node.val || node.args) + '}}}}', node);
      })

      .set('tag', function(node) {
        var opt = Object.assign({}, options, {stack: stack, node: node});
        var converter = new Converter(opt);
        var val = converter.convertArgs(node.args);
        this.emit(val, node);
      })

      .set('expression', function(node) {
        var val = node.args.trim();
        var skip = false;

        // convert liquid hash variables `item[0]` and `item[1]`
        if (utils.last(stack) === 'each') {
          var last = utils.last(opts.stash);
          var name = last.tok.key;
          var m = /\[(\d+)\]$/.exec(val);
          if (val.indexOf(name) === 0 && m) {
            if (m[1] === '0') {
              return this.emit('{{{@key}}}', node);
            }

            if (m[1] === '1') {
              return this.emit('{{{' + name + '}}}', node);
            }
          }
        }

        if (!skip && /[\|\[\]]/.test(node.args)) {
          var value = node.args;
          var segs = utils.splitArgs(value, ' ');
          var rest = '';

          if (segs.length > 1) {
            value = segs[0].trim();
            rest = segs.slice(1).join(' ');
          }

          var args = rest;
          if (args) {
            args = utils.namespaceArgs(rest, opts);
          } else {
            value = utils.namespaceArgs(value, opts);
          }

          value = utils.escapeValue(convert.object(value));

          val = convert.filters(value, args, false).trim();
          if (utils.isQuoted(val)) {
            val = utils.stripQuotes(val);
          }

        } else {
          val = utils.namespaceArgs(val, opts);
        }

        var arr = utils.splitArgs(val, ' ');
        val = val.trim();

        var tight = /[#\/]/.test(val) || (!node.hasClose && arr.length > 1) || utils.isKeyword(val);
        var delimsLen = node.delims ? node.delims.length : 0;

        var tripleStache = delimsLen === 3 || /^@?(site|page|post)[^\s]+$/.test(val);
        if (node.captured) {
          tripleStache = false;
          tight = true;
        }

        if (tight) {
          val = '{{' + val + '}}';
        } else {
          val = '{{ ' + val + ' }}';
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

function variables(compiler, options, converter) {
  var emit = compiler.emit;
  var names = converter.variables;

  compiler.emit = function(val, node) {
    if (!node) {
      throw new Error('expected "node" to be emitted');
    }

    if (node.type === 'tag' || node.type === 'expression') {
      var exp = /{{(?![\/{])([^\s}]+)/.exec(val);
      if (!exp) return;
      var name = exp[1];

      if (names.indexOf(name) === -1) {
        names.push(name);
      }
    }

    return emit.apply(compiler, arguments);
  };

  names.sort();
  union(converter.variables, names);
}
