'use strict';

var convert = require('../converter');
var utils = require('../utils');

module.exports = function(options) {
  var opts = Object.assign({}, options);

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
        var match = this.match(/^---/);
        if (!match) return;

        var val = this.advanceTo('---');
        if (val) {
          return this.node(val);
        }
      })
      .set('text', function() {
        var match = this.match(/^([^{]+)/);
        if (match) {
          var str = this.input;
          var val = match[0];

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
        var tagRegex = /^(\{%)(.*?)%\}|(\{\{)(.*?)\}\}/;
        var match = this.match(tagRegex);
        if (!match) return;

        // if it's a raw tag, we need to handle it differently,
        // since anything goes inside this tag
        if (match[2] && match[2].trim() === 'raw') {
          var val = this.advanceTo('{% endraw %}');
          if (val.trim() === '{%') val = '{{';
          if (val.trim() === '%}') val = '}}';

          // if the {% raw %} block contains liquid, convert it to handlebars
          var inner = /(?:\{%[\s\S]+?%\}|\{\{[\s\S]+?\}\})/.test(val);
          if (inner) {
            val = convert(val, opts);
          }

          return this.node({
            type: 'literal',
            val: '{{#raw}}' + val + '{{/raw}}'
          });
        }

        var delimiter = (match[3] || match[1]);
        var type = delimiter !== '{{' ? 'tag' : 'expression';
        var args = (match[4] || match[2]);

        // whitespace denotation
        var leading = false;
        var trailing = false;

        if (utils.startsWith(args, '-')) {
          leading = true;
          args = args.slice(1).trim();
        }

        if (utils.endsWith(args, '-')) {
          trailing = true;
          args = args.slice(0, args.length - 1).trim();
        }

        // check for filter characters
        if (/\|/.test(args)) {
          type = 'filter';
        } else if (args.trim() === 'content') {
          type = 'body';
        }

        args = args.trim();
        var name = args.split(' ').shift();

        var node = {
          type: type,
          name: name,
          delimiter: delimiter,
          hasClose: utils.hasClose(args, this.input),
          args: args,
          leading: leading,
          trailing: trailing,
          safeString: true,
          escape: false,
          val: match[0]
        };

        var m = /^( *)((?:site|page|post)\..*)/.exec(node.args);
        if (m) {
          var prefix = utils.getPrefix(opts);
          if (prefix) {
            node.args = m[1] + prefix + m[2];
          }

          var segs = m[2].split('.');
          var prop = segs[1] || '';

          if (segs[0].trim() === 'post' && prop.trim() === 'content') {
            node.safeString = false;
          }
        }

        node.args = node.args.split(' by ').join(' by=');
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
