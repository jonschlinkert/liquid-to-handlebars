'use strict';

var convert = require('../convert');
var utils = require('../utils');

module.exports = function(options) {
  return function(parser) {
    if (options && options.strictErrors === true) {
      parser.on('error', function(err) {
        console.log('PARSER ERROR');
        console.log(err);
        process.exit(1);
      });
    }

    parser
      .set('yfm', function() {
        if (this.parsed) return;
        let pos = this.position();
        let match = this.match(/^---/);
        if (!match) return;

        let val = this.advanceTo('---');
        if (val) {
          return pos(this.node(val));
        }
      })
      .set('text', function() {
        let pos = this.position();
        let match = this.match(/^[^{]+/);
        if (match) {
          return pos(this.node(match[0]));
        }
      })
      .set('tag', function() {
        let pos = this.position();
        let tagRegex = /^(\{%)(.*?)%\}|(\{\{)(.*?)\}\}/;
        let match = this.match(tagRegex);
        if (!match) return;

        // if it's a raw tag, we need to handle it differently,
        // since anything goes inside this tag
        if (match[2] && match[2].trim() === 'raw') {
          let val = this.advanceTo('{% endraw %}');
          if (val.trim() === '{%') val = '{{';
          if (val.trim() === '%}') val = '}}';

          // if the raw block contains liquid, convert it to handlebars
          let inner = /(?:\{%[\s\S]+?%\}|\{\{[\s\S]+?\}\})/.test(val);
          if (inner) {
            val = convert(val, options);
          }

          return pos(this.node({
            type: 'literal',
            val: '{{#raw}}' + val + '{{/raw}}'
          }));
        }

        // console.log(match)
        let delimiter = (match[3] || match[1]);
        let type = delimiter !== '{{' ? 'tag' : 'expression';
        let args = (match[4] || match[2]);

        // whitespace denotation
        let leading = false;
        let trailing = false;

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
        } else if (args === 'content') {
          type = 'body';
        }

        args = args.trim();

        return pos({
          type: type,
          delimiter: delimiter,
          hasClose: utils.hasClose(args, this.input),
          args: args,
          leading: leading,
          trailing: trailing,
          val: match[0]
        });
      })
      .set('rest', function() {
        let pos = this.position();
        let regex = utils.textRegex();
        let match = this.match(regex);
        if (match) {
          return pos(this.node(match[0]));
        }
      });
  };
};
