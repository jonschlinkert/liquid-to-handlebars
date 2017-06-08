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
          return this.node(val);
        }
      })
      .set('text', function() {
        let pos = this.position();
        let match = this.match(/^[^{]+/);
        if (match) {
          return this.node(match[0]);
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

          return this.node({
            type: 'literal',
            val: '{{#raw}}' + val + '{{/raw}}'
          });
        }

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
        } else if (args.trim() === 'content') {
          type = 'body';
        }

        // var re = /(^| )(site|page|post)(?=\.)/g;
        // args = args.trim().replace(re, function(m, $1, $2) {
        //   return $1 + ($2 === 'site' ? '@root.' : '@') + $2;
        // }).trim();

        // if (args === '@root.site.baseurl') {
        //   args = 'root';
        // }

        // if (args.indexOf('@post.content') === 0) {
        //   args = '@post.html';
        // } else if (args.indexOf('@post') === 0) {
        //   args = args.split('@post').join('@post.data');
        // }

        return this.node({
          type: type,
          delimiter: delimiter,
          hasClose: utils.hasClose(args, this.input),
          args: args.trim(),
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
          return this.node(match[0]);
        }
      });
  };
};
