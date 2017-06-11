'use strict';

var extend = require('extend-shallow');
var utils = require('../utils');
var stack = [];

module.exports = function(options) {
  var opts = extend({}, options);

  return function(parser) {
    if (options && options.strictErrors === true) {
      parser.on('error', function(err) {
        console.log('ARGS PARSER ERROR');
        console.log(err);
        process.exit(1);
      });
    }

    parser
      .set('assign', function() {
        var m = this.match(/^assign(.*)/);
        if (!m) return;
        return this.node({
          type: 'assign',
          args: m[1].trim(),
          val: m[0]
        });
      })
      .set('loop_statement', function() {
        var m = this.match(/^(break|continue)/);
        if (!m) return;
        return this.node({
          type: 'loop_statement',
          args: m[0],
          val: m[0]
        });
      })
      .set('for', function() {
        var m = this.match(/^for(.*)/);
        if (!m) return;
        stack.push('each');
        return this.node({
          type: 'each',
          args: m[1].trim(),
          val: m[0]
        });
      })
      .set('highlight', function() {
        var m = this.match(/^highlight(.*)/);
        if (!m) return;
        stack.push('highlight');
        return this.node({
          type: 'highlight',
          args: m[0],
          val: m[1].trim()
        });
      })
      .set('unless', function() {
        var m = this.match(/^unless(.*)/);
        if (!m) return;
        stack.push('unless');
        return this.node({
          type: 'unless',
          args: m[1].trim(),
          val: m[0]
        });
      })
      .set('case', function() {
        var m = this.match(/^case\s*(.*)/);
        if (!m) return;
        stack.push('case');
        return this.node({
          type: 'case',
          args: m[1],
          val: m[0]
        });
      })
      .set('when', function() {
        var m = this.match(/^when\s*(.*)/);
        if (!m) return;
        return this.node({
          type: 'when',
          args: m[1],
          val: m[0]
        });
      })
      .set('if', function() {
        var m = this.match(/^if\s*(.*)/);
        if (!m) return;
        stack.push('if');
        return this.node({
          type: 'if',
          args: m[1],
          val: m[0]
        });
      })
      .set('elsif', function() {
        var m = this.match(/^elsif(.*)/);
        if (!m) return;
        return this.node({
          type: 'elsif',
          args: m[1].trim(),
          val: m[0]
        });
      })
      .set('else', function() {
        var m = this.match(/^else/);
        if (!m) return;
        return this.node({
          type: 'else',
          val: m[0]
        });
      })
      .set('end', function() {
        var m = this.match(/^end(.+)/);
        if (!m) return;

        var open = stack.pop();
        if (typeof open === 'undefined') {
          this.emit('error', 'missing opening: ' + m[1]);
        }

        return this.node({
          type: 'end',
          tag: open,
          match: m[0],
          val: m[1]
        });
      })
      .set('body', function() {
        var m = this.match(/^body/);
        if (!m) return;
        return this.node({
          type: 'body',
          val: m[0]
        });
      })
      .set('capture', function() {
        var m = this.match(/^capture(.*)/);
        if (!m) return;

        return this.node({
          type: 'capture',
          args: m[1].trim(),
          val: m[0]
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
      .set('include', function() {
        var m = this.match(/^include(.*)/);
        if (!m) return;
        return this.node({
          type: 'include',
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

          this.emit('unknown', node);
          return node;
        }
      })
      .set('rest', function() {
        var regex = utils.textRegex();
        var match = this.match(regex);
        if (match) {
          var hasClose = !!(opts.node && opts.node.hasClose);
          var val = match[0];
          var isBlock = false;

          if (hasClose) {
            stack.push(val);
            isBlock = true;
          }

          var node = this.node({
            type: 'rest',
            isBlock: isBlock,
            val: val
          });

          this.emit('unknown', node);
          return node;
        }
      });

  };
};
