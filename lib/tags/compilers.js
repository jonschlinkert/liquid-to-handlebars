'use strict';

const union = require('arr-union');
const utils = require('../utils');
const convert = require('../convert');
const Converter = require('../..');

module.exports = function(options = {}, converter) {
  const stack = converter.stack;

  return function(compiler) {
    if (options.variables === true) {
      variables(compiler, options, converter);
    }

    compiler
      .set('yfm', function(node) {
        if (options.yfm === false) return;
        this.output = this.output.replace(/[ \t]+$/, '');
        this.emit('---\n' + node.val.trim() + '\n---', node);
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
        const opt = Object.assign({}, options, {stack: stack, node: node});
        const converter = new Converter(opt);
        let val = converter.convertArgs(node.args);
        if (val === '{{/raw}}') val = '{{{{/raw}}}}';
        this.emit(val, node);
      })

      .set('expression', function(node) {
        let val = node.args.trim();
        let skip = false;

        // convert liquid hash variables `item[0]` and `item[1]`
        if (utils.last(stack) === 'each') {
          let last = utils.last(options.stash);
          let name = last.tok.key;
          let m = /\[(\d+)\]$/.exec(val);
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
          let value = node.args;
          let segs = utils.splitArgs(value, ' ');
          let rest = '';

          if (segs.length > 1) {
            value = segs[0].trim();
            rest = segs.slice(1).join(' ');
          }

          let args = rest;
          if (args) {
            args = utils.namespaceArgs(rest, options);
          } else {
            value = utils.namespaceArgs(value, options);
          }

          value = utils.escapeValue(convert.object(value));

          val = convert.filters(value, args, false).trim();
          if (utils.isQuoted(val)) {
            val = utils.stripQuotes(val);
          }

        } else {
          val = utils.namespaceArgs(val, options);
        }

        let arr = utils.splitArgs(val, ' ');
        val = val.trim();

        let tagName = arr[0].replace(/^#/, '');
        if (arr.length > 1 && this.tagNames.indexOf(tagName) === -1) {
          this.tagNames.push(tagName);
        }

        let tight = /[#\/]/.test(val)
          || (!node.hasClose && arr.length > 1)
          || utils.isKeyword(val);

        let delimsLen = node.delims ? node.delims.length : 0;
        let tripleStache = delimsLen === 3 || /^@?(site|page|post)[^\s]+$/.test(val);

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
  const names = converter.variables;
  const emit = compiler.emit;

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
