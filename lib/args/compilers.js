'use strict';

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
        var args = node.args ? ' \'' + node.args.trim() + '\'' : '';
        this.emit('{{#capture' + args + '}}');
      })

      .set('case', function(node) {
        var args = convert.conditional(node.args);
        this.emit('{{#case ' + args + '}}');
      })

      .set('cycle', function(node) {
        var val = node.args;
        var args = node.args.slice().split(' ');
        var prop = args.shift();
        if (/:\s*$/.test(prop)) {
          prop = prop.replace(/^\W+|\W+$/g, '');
          var rest = args.join(' ').replace(/\\?(['"])/g, '\\$1');
          val = 'name=\'' + prop + '\' args=\'' + rest + '\'';
        }
        this.emit('{{cycle ' + val + '}}');
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
        var val = segs.pop() || '';
        var obj = convert.object(val);
        var args = '';

        if (obj !== val) {
          val = utils.wrap(obj);
          args = [val];
        } else {
          args = utils.splitArgs(val, ' ');
        }

        var exp = args.shift();
        var range = utils.toRange(exp);
        if (exp !== range) {
          exp = range;

        } else if (args.length) {
          args.forEach(function(arg) {
            if (/:/.test(arg)) {
              var parts = arg.split(':');
              var prop = parts[0];

              var v = utils.namespaceArgs(exp, ['site', 'page', 'post'], opts);
              exp = `(${prop} ${v} ${parts[1]})`;
            }
          });
        }

        exp = utils.namespaceArgs(exp, ['site', 'page', 'post'], opts);
        var prefix = node.prefix || '';
        var res = prefix + exp + ' as |' + key + '|';
        var name = node.name || 'each';
        this.emit('{{#' + name + ' ' + res + '}}');
      })

      .set('elsif', function(node) {
        var args = convert.conditional(node.args);
        this.emit('{{else if ' + args + '}}');
      })

      .set('end', function(node) {
        if (node.val === 'highlight') {
          this.emit('```');
        } else {
          this.emit('{{/' + (node.tag || node.val) + '}}');
        }
      })

      .set('highlight', function(node) {
        this.emit('```' + node.val.split(/ +/)[0] || '');
      })

      .set('if', function(node) {
        var args = convert.conditional(node.args);
        args = utils.namespaceArgs(args, ['site', 'page', 'post'], opts);
        this.emit('{{#if ' + args + '}}');
      })

      .set('include', function(node) {
        var args = node.args.split(' ');
        var name = args.shift().replace(/\.html$/, '');
        name = '\'' + utils.stripQuotes(name) + '\'';

        while (args.length) {
          var arg = args.shift();
          if (arg === 'with') {
            name += ' ' + args.shift();
          } else {
            name += ' ' + arg;
          }
        }
        this.emit('{{include ' + name + '}}');
      })

      .set('increment', function(node) {
        this.emit('{{increment ' + node.args + '}}');
      })

      .set('break', function(node) {
        this.emit('{{' + node.val + '}}');
      })

      .set('continue', function(node) {
        this.emit('{{' + node.val + '}}');
      })

      .set('loop_statement', function(node) {
        this.emit('{{' + node.val + '}}');
      })

      .set('tablerow', function(node) {
        this.emit('{{#tablerow ' + node.val + '}}');
      })

      .set('when', function(node) {
        var args = convert.conditional(node.args);
        args = utils.namespaceArgs(args, ['site', 'page', 'post'], opts);
        this.emit('{{when ' + args + '}}');
      })

      .set('unless', function(node) {
        var args = convert.conditional(node.args);
        args = utils.namespaceArgs(args, ['site', 'page', 'post'], opts);
        this.emit('{{#unless ' + args + '}}');
      })

      .set('unknown', function(node) {
        if (typeof opts.unknown === 'function') {
          opts.unknown.call(this, node);
        }

        var prefix = opts.node.hasClose ? '#' : '';
        var name = prefix + node.name;

        node.args = utils.namespaceArgs(node.args, ['site', 'page', 'post'], opts);
        if (node.name === 'gist') {
          node.args = utils.splitArgs(node.args, ' ').map(function(ele) {
            return JSON.stringify(ele);
          }).join(' ');
        }
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
