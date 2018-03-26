'use strict';

const convert = require('../convert');
const utils = require('../utils');

module.exports = function(options, converter) {
  const opts = Object.assign({}, options);

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
        const m = this.match(/^---/);
        if (!m) return;

        const val = this.advanceTo('\n---');
        if (val) {
          const node = this.node({type: 'yfm', val: val});
          converter.yfm = node;
          return node;
        }
      })

      .set('text', function() {
        const m = this.match(/^([^{]+)/);
        if (!m) return;
        let str = this.input;
        let val = m[0];

        while (str && str[0] === '{' && (!str[1] || (str[1] !== '{' && str[1] !== '%'))) {
          const idx = str.indexOf('{', 1);
          if (idx === -1) break;
          val += str.slice(0, idx);
          str = this.input = str.slice(idx);
        }

        return this.node(val);
      })
      .set('tag', function() {
        const m = this.match(/^\{%([\s\S]+?)%\}/);
        if (!m) return;

        m[0] = m[0].replace(/\s+/g, ' ');
        m[1] = m[1].replace(/\s+/g, ' ');

        let args = m[1].trim();
        const node = {
          type: 'tag',
          args,
          rest: ''
        };

        const ch = node.args.charAt(0);
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
        const segs = utils.splitArgs(args, ' ');
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
          const val = '\nlayout: ' + node.rest.trim();
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
          const key = node.rest;

          let inner = this.advanceTo('{% endcase %}') + '{% endcase %}';
          const lines = inner.split(/\r?\n/);
          let cases = 0;
          node.args = '';

          const last = lines[lines.length - 1];
          const matchWs = /^\s+/.exec(last);
          const prefix = matchWs ? matchWs[0] : '';

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (i === lines.length - 1) {
              lines[i] = prefix + '{{/is}}';
            }

            const match = /{% when\s+([\s\S]+?)%}/.exec(line);
            if (match) {
              const comp = utils.toString(match[1]);
              let replacement = '';

              if (cases === 0) {
                replacement = `{{#is ${key} ${convert.conditional(comp)}}}`;
              } else {
                replacement = `{{else is ${key} ${convert.conditional(comp)}}}`;
              }
              lines[i] = line.replace(/{% when\s+([\s\S]+?)%}/, replacement);
              cases++;
            }

            inner = lines.join('\n').trim();
          }

          this.input = inner + this.input;
        }

        return this.node(node);
      })

      .set('expression', function() {
        const m = this.match(/^(\{{2,4})([\s\S]+?)\}{2,4}/);
        if (!m) return;

        const args = m[2].trim();
        const node = {
          type: 'expression',
          delims: m[1],
          name: args,
          val: args,
          args,
          rest: ''
        };

        if (node.args.charAt(0) === '!') {
          node.type = 'comment';
          node.args = node.args.slice(1);
          return this.node(node);
        }

        const tagName = node.args.trim();
        if (tagName === 'content' || tagName === 'content_for_layout') {
          node.type = 'body';
          return this.node(node);
        }

        if (node.args.charAt(0) === '-' && node.args.charAt(1) === ' ') {
          node.args = node.args.slice(1).trim();
          node.name = node.args;
          node.stripLeft = true;
        }

        const len = node.args.length;
        if (node.args[len - 1] === '-' && node.args[len - 2] === ' ') {
          node.args = node.args.slice(0, -1).trim();
          node.name = node.args;
          node.stripRight = true;
        }
        return this.node(node);
      })
      .set('rest', function() {
        const regex = utils.textRegex();
        const match = this.match(regex);
        if (match) {
          return this.node(match[0]);
        }
      });
  };
};
