'use strict';

var extend = require('extend-shallow');
var operators = require('../operators');
var utils = require('../utils');

module.exports = function(options) {
  var opts = extend({node: {}}, options);
  var stack = opts.stack;
  var optsNode = opts.node;

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
        var m = this.match(/^assign(.*)/);
        if (!m) return;
        var args = m[1].trim();
        var val = m[0];

        var segs = args.split(/\s*=\s*/);
        var name = utils.addQuotes(segs[0]);
        var rest = segs[1];
        if (/\w\[/.test(rest)) {
          rest = '(' + operators(rest) + ')';
        }

        return this.node({
          type: 'assign',
          args: name + ' ' + rest,
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
