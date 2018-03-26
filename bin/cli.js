#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ok = require('log-ok');
const del = require('delete');
const vfs = require('vinyl-fs');
const isBinary = require('file-is-binary');
const minimist = require('minimist');
const through = require('through2');
const pkg = require('../package');
const converter = require('..');
const argv = minimist(process.argv.slice(2), {
  alias: {
    cwd: 'c',
    glob: 'g',
    help: 'h',
    overwrite: 'o',
    replace: 'r',
    version: 'V'
  }
});

console.time('done in');
if (argv.version) {
  console.log(pkg.name, pkg.version);
  process.exit();
}

if (argv.help) {
  help();
  process.exit();
}

const defaults = {
  cwd: process.cwd(),
  glob: '**/*.{html,md,markdown,liquid}',
  ignore: ['**/node_modules/**']
};

const options = Object.assign({}, defaults, argv);
options.cwd = path.resolve(options.cwd);
const total = [];
const files = [];

vfs.src(options.glob, options)
  .pipe(convert(options))
  .on('error', err => handleError(err))
  .pipe(replace(options))
  .on('error', err => handleError(err))
  .pipe(vfs.dest(file => {
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
  .on('error', err => handleError(err))
  .on('end', () => {
    console.timeEnd('done in');
    console.log('converted', total.length, 'files');
    del.sync(files);
    process.exit();
  });

function handleError(err) {
  console.error(err);
  process.exit(1);
}

function convert(options) {
  return through.obj(function(file, enc, next) {
    if (!file.isNull() && !isBinary(file)) {
      file.contents = new Buffer(converter(file.contents.toString(), options));
    }
    next(null, file);
  });
}

function replace(options) {
  return through.obj(function(file, enc, next) {
    const input = file.contents.toString();
    input = input.replace(/```liquid/gim, '```handlebars');

    if (!options.replace) {
      file.contents = new Buffer(input);
      next(null, file);
      return;
    }

    const segs = options.replace.split(',');
    const re = new RegExp(segs[0], 'gim');
    const to = segs[1];

    const str = input.replace(re, function(m) {
      if (m[0] === m[0].toUpperCase()) {
        return to[0].toUpperCase() + to.slice(1);
      }
      return to;
    });

    file.contents = new Buffer(str);
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
