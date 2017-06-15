'use strict';

var convert = require('../convert');
var utils = require('../utils');

module.exports = function(options, converter) {
  var opts = options || {};
  var optsNode = opts.node || (opts.node = {});
  var stash = converter.stash;
  var stack = converter.stack;

  return function(parser) {
    if (opts.strictErrors === true) {
      parser.on('error', function(err) {
        console.log('ARGS PARSER ERROR');
        console.log(err);
        process.exit(1);
      });
    }

    function capture(name, regex) {
      return function() {
        var m = this.match(regex);
        if (!m) return;

        var args = m[1] ? utils.stripChar(m[1].trim(), '?') : '';
        var val = utils.stripChar(m[0], '?');
        var node = {
          type: name,
          name: name,
          args: args,
          val: val
        };

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
        var m = this.match(/^assign\s+(\S+)\s+=\s+(.*)/);
        if (!m) return;

        var name = utils.addQuotes(m[1].trim());
        var segs = utils.splitArgs(m[2].trim(), ' ');
        var val = segs[0];
        var rest = '';

        if (segs.length > 1) {
          rest = segs.slice(1).join(' ');
        }

        var value = convert.object(val);
        if (value !== val) {
          value = utils.wrap(value);
        }

        value = utils.namespaceArgs(value, opts);
        val = convert.filters(value, rest.trim());
        return this.node({
          type: 'assign',
          args: m[0],
          name: name,
          val: val
        });
      })

      .set('cycle', function() {
        var m = this.match(/^cycle\s+(.*)/);
        if (!m) return;

        var args = m[1] ? utils.stripChar(m[1].trim(), '?') : '';
        var val = utils.stripChar(m[0], '?');

        var segs = utils.splitArgs(args, ':');
        var name = '';

        if (segs.length > 1) {
          name = 'name=' + segs.shift();
          segs = segs[0];
        } else {
          segs = args;
        }

        var rest = utils.splitArgs(segs, ',').map(function(ele) {
          return ele.trim();
        });

        args = rest.join(' ');
        if (name) {
          args += ' ' + name;
        }

        return this.node({
          type: 'cycle',
          name: 'cycle',
          args: args,
          val: val
        });
      })

      .set('end', function() {
        var m = this.match(/^end(.+)/);
        if (!m) return;

        var open = stack.pop();
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
        var m = this.match(/^(for|tablerow)\s+(.*)/);
        if (!m) return;

        var name = m[1] === 'for' ? 'each' : 'tablerow';
        var args = m[2] ? utils.stripChar(m[2].trim(), '?') : '';
        var val = utils.stripChar(m[0], '?');
        var node = {
          type: 'each',
          name: name,
          args: args,
          val: val
        };

        stack.push(name);
        stash.push(node);

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
              var parts = utils.splitArgs(arg, ':');
              var prop = parts[0];

              var v = utils.namespaceArgs(exp, opts);
              exp = `(${prop} ${v} ${parts[1]})`;
            }
          });
        }

        exp = utils.namespaceArgs(exp, opts);
        var prefix = node.prefix || '';
        var tok = node.tok = {
          prefix: node.prefix || '',
          key: key,
          val: val,
          exp: exp
        };

        return this.node(node);
      })

      .set('include', function() {
        var m = this.match(/^include\s+(.*)/);
        if (!m) return;

        var args = m[1] ? utils.stripChar(m[1].trim(), '?') : '';
        var val = utils.stripChar(m[0], '?');
        var node = {
          type: 'include',
          name: 'include',
          args: args,
          val: val
        };

        var segs = utils.splitArgs(args, ' ');
        var name = segs.shift().replace(/\.html$/, '');
        name = utils.addQuotes(name);

        while (segs.length) {
          var arg = segs.shift();
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
        var match = this.match(/^([\w_.]+) (.*)/);
        if (match) {
          var node = this.node({
            match: match,
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
        var regex = utils.textRegex();
        var match = this.match(regex);
        if (match) {
          var hasClose = optsNode.hasClose === true;
          var val = match[0];
          var segs = utils.splitArgs(val, ' ');
          var name = segs.shift();
          var isBlock = false;

          if (hasClose) {
            stack.push(val);
            isBlock = true;
          }

          var node = this.node({
            type: 'rest',
            match: match,
            isBlock: isBlock,
            name: name,
            val: val
          });

          if (hasClose) {
            stash.push(node);
          }

          this.emit('unknown', node);
          return node;
        }
      });

  };
};
