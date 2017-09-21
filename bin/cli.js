#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var ok = require('log-ok');
var File = require('vinyl');
var writeFile = require('write');
var minimist = require('minimist');
var pkg = require('../package');
var convert = require('..');

var opts = {
  alias: {
    overwrite: 'o',
    help: 'h',
    version: 'V'
  }
};

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

var argv = minimist(process.argv.slice(2), opts);
if (argv.version) {
  console.log(pkg.name, pkg.version);
  process.exit();
}

if (argv.help) {
  help();
  process.exit();
}

var filepath, destpath;
if (argv._[0]) {
  filepath = argv._[0];
  destpath = argv._[1];
} else {
  filepath = argv.file;
  destpath = argv.dest;
}

if (!destpath && argv.overwrite) {
  destpath = filepath;
}

if (!filepath || !destpath) {
  help();
  process.exit(1);
}

fs.readFile(path.resolve(filepath), function(err, buf) {
  handleError(err);

  var idx = 0;
  var str = buf.toString();
  str = convert(str, argv);

  writeFile(destpath, str, function(err) {
    handleError(err);
    ok('Success:', filepath);
  });
});

function handleError(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
}
