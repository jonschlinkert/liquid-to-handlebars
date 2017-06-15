'use strict';

var split = require('split-string');
var convert = require('../convert');
var utils = require('../utils');

module.exports = function(options, converter) {
  var opts = Object.assign({}, options);
  var captured = [];

  return function(parser) {
    if (typeof opts.transform === 'function') {
      parser.on('token', function(node) {
        opts.transform.call(parser, node);
      });
    }

    if (opts.strictErrors === true) {
      parser.on('error', function(err) {
        console.log('PARSER ERROR');
        console.log(err);
        process.exit(1);
      });
    }

    parser
      .set('yfm', function() {
        if (this.parsed) return;
        var m = this.match(/^---/);
        if (!m) return;

        var val = this.advanceTo('---');
        if (val && val.split('---').join('').trim() === '') {
          val = '';
        }

        if (val) {
          var node = this.node({type: 'yfm', val: val});
          converter.yfm = node;
          return node;
        }
      })
      .set('text', function() {
        var m = this.match(/^([^{]+)/);
        if (m) {
          var str = this.input;
          var val = m[0];

          while (str[0] === '{' && str[1] !== '{' && str[1] !== '%') {
            var idx = str.indexOf('{', 1);
            if (idx === -1) break;
            val += str.slice(0, idx);
            str = this.input = str.slice(idx);
          }
          return this.node(val);
        }
      })
      .set('tag', function() {
        var parsed = this.parsed;
        var m = this.match(/^\{%(.*?)%\}/);
        if (!m) return;

        var args = m[1].trim();
        var node = {
          type: 'tag',
          args: args,
          rest: ''
        };

        var ch = node.args.charAt(0);
        if (ch === '%') {
          node.type = 'literal';
          node.val = m[1].slice(1);
          return this.node(node);
        }

        if (ch === '!') {
          node.type = 'comment';
          node.args = node.args.slice(1);
          return this.node(node);
        }

        if (ch === '-') {
          args = args.slice(1).trim();
          node.stripLeft = true;
        }

        if (args.slice(-1) === '-') {
          args = args.slice(0, -1).trim();
          node.stripRight = true;
        }

        node.args = utils.namespaceArgs(args, opts);
        node.name = args.trim();
        var segs = utils.splitArgs(args, ' ');
        if (segs.length > 1) {
          node.name = segs[0].trim();
          node.rest = segs.slice(1).join(' ');
        }

        if (utils.hasEndTag(node.name, this.input)) {
          node.hasClose = true;
        } else if (segs.length === 1) {
          node.type = 'expression';
        }

        if (node.name === 'layout') {
          var val = '\nlayout: ' + node.rest.trim();
          if (converter.yfm) {
            converter.yfm.val = val + converter.yfm.val;
            return;
          }
          return this.node({type: 'yfm', val: val});
        }

        if (segs.indexOf('by') !== -1) {
          node.args = node.args.split(' by ').join(' by=');
        }

        if (node.name === 'case' && utils.isString(node.rest)) {
          var key = node.rest;

          var inner = this.advanceTo('{% endcase %}') + '{% endcase %}';
          var lines = inner.split(/\r?\n/);
          var cases = 0;
          node.args = '';

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (i === lines.length - 1) {
              lines[i] = '{{/is}}';
            }

            var match = /{% when\s+(.*)%}/.exec(line);
            if (match) {
              var comp = utils.toString(match[1]);
              var replacement = '';

              if (cases === 0) {
                replacement = `{{#is ${key} ${convert.conditional(comp)}}}`;
              } else {
                replacement = `{{else is ${key} ${convert.conditional(comp)}}}`;
              }
              lines[i] = line.replace(/{% when\s+(.*)%}/, replacement);
              cases++;
            }

            inner = lines.join('\n').trim();
          }

          this.input = inner + this.input;
        }

        return this.node(node);
      })

      .set('expression', function() {
        var m = this.match(/^(\{{2,3})(.+?)\}{2,3}/);
        if (!m) return;

        var args = m[2].trim();
        var node = {
          type: 'expression',
          delims: m[1],
          args: args,
          name: args,
          val: args,
          rest: ''
        };

        if (node.args.charAt(0) === '!') {
          node.type = 'comment';
          node.args = node.args.slice(1);
          return this.node(node);
        }

        if (node.args.trim() === 'content') {
          node.type = 'body';
          return this.node(node);
        }

        if (node.args.charAt(0) === '-' && node.args.charAt(1) === ' ') {
          node.args = node.args.slice(1).trim();
          node.name = node.args;
          node.stripLeft = true;
        }

        var len = node.args.length;
        if (node.args[len - 1] === '-' && node.args[len - 2] === ' ') {
          node.args = node.args.slice(0, -1).trim();
          node.name = node.args;
          node.stripRight = true;
        }
        return this.node(node);
      })
      .set('rest', function() {
        var regex = utils.textRegex();
        var match = this.match(regex);
        if (match) {
          return this.node(match[0]);
        }
      });
  };
};
