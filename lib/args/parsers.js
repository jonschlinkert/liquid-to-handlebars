'use strict';

var split = require('split-string');
var convert = require('../convert');
var utils = require('../utils');

module.exports = function(options) {
  var opts = options || {};
  var optsNode = opts.node || (opts.node = {});
  var stack = opts.stack || (opts.stack = []);

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
        if (optsNode.hasClose === true) {
          stack.push(name);
        }

        var args = utils.stripChar(m[1] ? m[1].trim() : '', '?');
        var val = utils.stripChar(m[0], '?');

        return this.node({
          type: name,
          name: name,
          args: args,
          val: val
        });
      };
    }

    parser
      .set('body', capture('body', /^body/))
      .set('break', capture('break', /^break/))
      .set('capture', capture('capture', /^capture\s*(.*)/))
      .set('case', capture('case', /^case\s*(.*)/))
      .set('continue', capture('continue', /^continue/))
      .set('cycle', capture('cycle', /^cycle(.*)/))
      .set('else', capture('else', /^else\s*(.*)/))
      .set('elsif', capture('elsif', /^elsif\s*(.*)/))
      .set('for', capture('each', /^for\s*(.*)/))
      .set('highlight', capture('highlight', /^highlight\s*(.*)/))
      .set('if', capture('if', /^if\s*(.*)/))
      .set('include', capture('include', /^include\s*(.*)/))
      .set('unless', capture('unless', /^unless\s*(.*)/))
      .set('when', capture('when', /^when\s*(.*)/))
      .set('end', function() {
        var m = this.match(/^end(.+)/);
        if (!m) return;

        var open = stack.pop();
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

      .set('assign', function() {
        var m = this.match(/^assign\s+(\S+)\s+=\s+(.*)/);
        if (!m) return;

        var name = utils.addQuotes(m[1].trim());
        var segs = split(m[2].trim(), {sep: ' ', keepQuotes: true});
        var val = segs[0];
        var rest = '';

        if (segs.length > 1) {
          rest = segs.slice(1).join(' ');
        }

        var value = convert.conditional(val);
        if (value !== val) {
          value = utils.wrap(value);
        }

        value = utils.namespaceArgs(value, ['site', 'page', 'post'], opts);
        val = convert.filters(value, rest.trim());
        return this.node({
          type: 'assign',
          args: m[0],
          name: name,
          val: val
        });
      })
      .set('tablerow', function() {
        var m = this.match(/^tablerow(.*)/);
        if (!m) return;
        stack.push('tablerow');
        return this.node({
          type: 'each',
          name: 'tablerow',
          args: m[1].trim(),
          val: m[0]
        });
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
          }

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
          var name = val.split(' ').shift();
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

          this.emit('unknown', node);
          return node;
        }
      });

  };
};
