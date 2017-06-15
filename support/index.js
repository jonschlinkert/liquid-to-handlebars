'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('matched');
var write = require('write');
var config = {alias: {type: 't', helpers: 'h', examples: 'e'}};
var argv = require('minimist')(process.argv.slice(2), config);
var utils = require('./utils');

function createExamples(patterns, options) {
  var type = argv.type || 'filters';
  var opts = Object.assign({}, options);
  var base = path.resolve.bind(path, __dirname, '../test/expected');
  opts.cwd = base(opts.cwd || '');

  var files = glob.sync(patterns, opts);
  var examples = ['# ' + type];
  var names = [];
  var vals = [];

  files.forEach(function(name) {
    var basename = path.basename(name);
    var stem = basename.slice(0, basename.length - 3);
    if (stem === 'index') return;

    if (argv.examples) {
      examples.push('\n**' + name + '**');

      var fixtures = utils.read(opts.cwd, path.join('fixtures', type), name);
      var expected = utils.read(opts.cwd, path.join('expected', type), name);

      var a = utils.filterExamples(fixtures, 'liquid');
      var b = utils.filterExamples(expected, 'handlebars');

      examples.push('\nFrom this liquid:\n');
      examples.push(a[0]);
      examples.push('\nTo this handlebars:\n');
      examples.push(b[0]);
      return;
    }

    if (/filters/.test(name)) {
      names.push(stem);
      vals.push({ name: stem });

    } else {
      var fp = path.resolve(opts.cwd, name);
      var str = fs.readFileSync(fp, 'utf8');
      var matches = str.match(/{{[^!\/](.*?)}}/g);
      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          var val = matches[i];
          var inner = val.replace(/^\W+|\W+$/g, '');
          var segs = inner.split(' ');
          if (segs.length > 1) {
            var name = segs.shift().trim();
            if (/^[-_.a-z]+$/.test(name) && names.indexOf(name) === -1) {
              var tok = {name: name, val: val};
              if (/\{\#/.test(val)) {
                tok.isBlock = true;
              }
              vals.push(tok);
              names.push(name);
            }
          }
        }
      }
    }
  });

  // $ node support/index.js > examples.md -e
  if (argv.examples) {
    return examples.join('\n');
  }

  names.sort();
  vals.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  var helpers = [utils.helperUtils()];
  var blocks = [];

  for (var i = 0; i < vals.length; i++) {
    var tok = vals[i];
    if (tok.isBlock) {
      blocks.push(utils.toBlockHelper(tok.name));
    } else {
      helpers.push(utils.toHelper(tok.name));
    }
  }

  // $ node support/index.js > helpers.js -h
  write.sync('support/helpers/helpers.json', JSON.stringify(vals, null, 2));
  write.sync('support/helpers/helpers.js', helpers.join('\n\n'));
  write.sync('support/helpers/blocks.js', blocks.join('\n\n'));
  return helpers.join('\n');
}

var res = createExamples('**/*.{md,html,hbs}');
// console.log(res);
