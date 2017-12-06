#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var ok = require('log-ok');
var minimist = require('minimist');
var through = require('through2');
var vfs = require('vinyl-fs');
var del = require('delete');
var pkg = require('../package');
var converter = require('..');
console.time('done in');

var opts = {
  alias: {
    cwd: 'c',
    glob: 'g',
    help: 'h',
    overwrite: 'o',
    replace: 'r',
    version: 'V'
  }
};

var argv = minimist(process.argv.slice(2), opts);
if (argv.version) {
  console.log(pkg.name, pkg.version);
  process.exit();
}

if (argv.help) {
  help();
  process.exit();
}

var defaults = {cwd: process.cwd(), ignore: ['**/node_modules/**']};
var options = Object.assign({}, defaults, argv);
options.cwd = path.join(options.cwd, argv._[0]);
var total = [];
var files = [];

var pattern = options.glob || '**/*.{html,md,markdown,liquid}';
try {
  var stat = fs.statSync(options.cwd);
  if (stat.isFile()) {
    pattern = options.cwd;
    options.cwd = process.cwd();
  }
} catch (err) {}

vfs.src(pattern, options)
  .pipe(convert(options))
  .on('error', (err) => {
    console.error(err);
    process.exit(1);
  })
  .pipe(through.obj(function(file, enc, next) {
    var input = file.contents.toString();
    input = input.replace(/```liquid/gmi, '```handlebars');

    if (!options.replace) {
      file.contents = new Buffer(input);
      next(null, file);
      return;
    }

    var segs = options.replace.split(',');
    var re = new RegExp(segs[0], 'gim');
    var to = segs[1];

    var str = input.replace(re, function(m) {
      if (m.charAt(0) === m.charAt(0).toUpperCase()) {
        return to.charAt(0).toUpperCase() + to.slice(1);
      }
      return to;
    });

    file.contents = new Buffer(str);
    next(null, file);
  }))
  .pipe(vfs.dest((file) => {
    total.push(file);
    switch (file.extname) {
      case '.liquid':
      case '.html':
        files.push(file.history[0]);
        file.extname = '.hbs';
        break;
      case '.markdown':
      case '.mkdown':
      case '.mdown':
        files.push(file.history[0]);
        file.extname = '.md';
        break;
    }
    return file.base;
  }))
  .on('error', (err) => {
    console.error(err);
    process.exit(1);
  })
  .on('end', () => {
    console.timeEnd('done in');
    console.log('converted', total.length, 'files');
    del.sync(files);
    process.exit();
  });

function convert(options) {
  return through.obj(function(file, enc, next) {
    file.contents = new Buffer(converter(file.contents.toString(), options));
    next(null, file);
  });
}

function help() {
  console.error('Usage: $ lth [options] <file> <dest>');
  console.error();
  console.error('  file:  The file to convert');
  console.error('  dest:  Required if --overwrite is not defined');
  console.error();
  console.error('Options:');
  console.error();
  console.error('-o, --overwrite', 'Overwrite the source file');
  console.error();
}
