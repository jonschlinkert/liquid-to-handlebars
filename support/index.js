'use strict';

var fs = require('fs');
var path = require('path');
var opts = {alias: {type: 't', helpers: 'h'}};
var argv = require('yargs-parser')(process.argv.slice(2), opts);
var utils = require('./utils');

function createExamples() {
  var type = argv.type || 'filters';
  var cwd = path.resolve.bind(path, __dirname, '../test');
  var files = fs.readdirSync(cwd(path.join('fixtures', type))).filter(utils.md);
  var examples = ['# ' + type];
  var helpers = [];

  files.forEach(function(name) {
    var stem = name.slice(0, name.length - 3);
    if (stem === 'index') return;

    helpers.push(utils.toHelper(stem), '');

    examples.push('\n**' + name + '**');

    var fixtures = utils.read(cwd, path.join('fixtures', type), name);
    var expected = utils.read(cwd, path.join('expected', type), name);

    var a = utils.filterExamples(fixtures, 'liquid');
    var b = utils.filterExamples(expected, 'handlebars');

    examples.push('\nFrom this liquid:\n');
    examples.push(a[0]);
    examples.push('\nTo this handlebars:\n');
    examples.push(b[0]);
  });

  // $ node support/index.js > helpers.js -h
  if (argv.h) {
    return helpers.join('\n');
  }

  // $ node support/index.js > examples.md
  return examples.join('\n');
}

console.log(createExamples());
