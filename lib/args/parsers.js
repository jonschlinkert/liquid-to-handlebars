'use strict';

const convert = require('../convert');
const utils = require('../utils');

module.exports = function(options = {}, converter) {
  const optsNode = options.node || (options.node = {});
  const stash = converter.stash;
  const stack = converter.stack;

  return function(parser) {
    if (options.strictErrors === true) {
      parser.on('error', function(err) {
        console.error('ARGS PARSER ERROR');
        console.error(err);
        process.exit(1);
      });
    }

    function capture(name, regex) {
      return function() {
        const m = this.match(regex);
        if (!m) return;

        const args = m[1] ? utils.stripChar(m[1].trim(), '?') : '';
        const val = utils.stripChar(m[0], '?');
        const node = { type: name, name, args, val };

        if (optsNode.hasClose === true) {
          stack.push(name);
          stash.push(node);
        }
        return this.node(node);
      };
    }

    parser
      .set('body', capture('body', /^body/))
      .set('break', capture('break', /^break/))
      .set('capture', capture('capture', /^capture\s+(.*)/))
      .set('continue', capture('continue', /^continue/))
      .set('else', capture('else', /^else\s+(.*)/))
      .set('elsif', capture('elsif', /^elsif\s+(.*)/))
      .set('highlight', capture('highlight', /^highlight\s+(.*)/))
      .set('if', capture('if', /^if\s+(.*)/))
      .set('unless', capture('unless', /^unless\s+(.*)/))
      .set('when', capture('when', /^when\s+(.*)/))

      .set('assign', function() {
        const m = this.match(/^assign\s+(\S+)\s+=\s+(.*)/);
        if (!m) return;

        const name = utils.addQuotes(m[1].trim());
        const segs = utils.splitArgs(m[2].trim(), ' ');
        let val = segs[0];
        let rest = '';

        if (segs.length > 1) {
          rest = segs.slice(1).join(' ');
        }

        let value = convert.object(val);
        if (value !== val) {
          value = utils.wrap(value);
        }

        value = utils.namespaceArgs(value, options);
        val = convert.filters(value, rest.trim());
        return this.node({
          type: 'assign',
          args: m[0],
          name,
          val
        });
      })

      .set('cycle', function() {
        let m = this.match(/^cycle\s+(.*)/);
        if (!m) return;

        let args = m[1] ? utils.stripChar(m[1].trim(), '?') : '';
        let val = utils.stripChar(m[0], '?');

        let segs = utils.splitArgs(args, ':');
        let name = '';

        if (segs.length > 1) {
          name = 'name=' + segs.shift();
          segs = segs[0];
        } else {
          segs = args;
        }

        const rest = utils.splitArgs(segs, ',').map(ele => ele.trim());
        args = rest.join(' ');
        if (name) {
          args += ' ' + name;
        }

        return this.node({
          type: 'cycle',
          name: 'cycle',
          args,
          val
        });
      })

      .set('end', function() {
        const m = this.match(/^end(.+)/);
        if (!m) return;

        const open = stack.pop();
        stash.pop();

        if (!open || open !== m[1]) {
          this.emit('error', 'missing opening: ' + m[1]);
        }

        return this.node({
          type: 'end',
          tag: open,
          match: m[0],
          val: m[1]
        });
      })

      .set('for', function() {
        const m = this.match(/^(for|tablerow)\s+(.*)/);
        if (!m) return;

        let name = m[1] === 'for' ? 'each' : 'tablerow';
        let args = m[2] ? utils.stripChar(m[2].trim(), '?') : '';
        let val = utils.stripChar(m[0], '?');
        let node = { type: 'each', name, args, val };

        stack.push(name);
        stash.push(node);

        let segs = node.args.split(' in ');
        let key = segs.shift();
        val = segs.pop() || '';
        let obj = convert.object(val);
        args = '';

        if (obj !== val) {
          val = utils.wrap(obj);
          args = [val];
        } else {
          val = val.replace(/:\s+/g, ':');
          args = utils.splitArgs(val, ' ');
        }

        let exp = args.shift();
        let range = utils.toRange(exp);
        let wrap = [];

        if (exp !== range) {
          exp = range;
        } else if (args.length) {
          args.forEach(function(arg, i) {
            if (/:/.test(arg)) {
              let parts = utils.splitArgs(arg, ':');
              let prop = parts[0];
              let v = utils.namespaceArgs(exp, options);
              exp = `(${prop} ${v} ${parts[1]})`;
            } else {
              wrap.push(arg);
            }
          });
        }

        if (wrap.length) {
          for (const key of wrap.reverse()) {
            exp = `(${key} ${exp})`;
          }
        }

        node.tok = {
          prefix: node.prefix || '',
          exp: utils.namespaceArgs(exp, options),
          key,
          val
        };

        return this.node(node);
      })

      .set('include', function() {
        const m = this.match(/^include\s+(.*)/);
        if (!m) return;

        let args = m[1] ? utils.stripChar(m[1].trim(), '?') : '';
        let val = utils.stripChar(m[0], '?');
        let node = {
          type: 'include',
          name: 'include',
          args,
          val
        };

        let segs = utils.splitArgs(args, ' ');
        let name = segs.shift().replace(/\.html$/, '');
        name = utils.addQuotes(name);

        while (segs.length) {
          let arg = segs.shift();
          if (arg === 'with') {
            name += ' ' + segs.shift();
          } else {
            name += ' ' + arg;
          }
        }

        node.args = name;
        return this.node(node);
      })

      .set('unknown', function() {
        const match = this.match(/^([\w_.]+) (.*)/);
        if (match) {
          let node = this.node({
            match,
            name: match[1],
            type: 'unknown',
            args: match[2],
            val: match[0]
          });

          if (optsNode.hasClose === true) {
            node.hasClose = true;
            stack.push(node.name);
            stash.push(node);
          }

          node.args = utils.splitArgs(node.args, ',').join(' ');
          this.emit('unknown', node);
          return node;
        }
      })
      .set('rest', function() {
        let regex = utils.textRegex();
        let match = this.match(regex);
        if (match) {
          let hasClose = optsNode.hasClose === true;
          let val = match[0];
          let segs = utils.splitArgs(val, ' ');
          let name = segs.shift();
          let isBlock = false;

          if (hasClose) {
            stack.push(val);
            isBlock = true;
          }

          const node = this.node({ type: 'rest', match, isBlock, name, val });
          if (hasClose) {
            stash.push(node);
          }

          this.emit('unknown', node);
          return node;
        }
      });

  };
};
