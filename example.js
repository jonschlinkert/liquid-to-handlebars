'use strict';

var fs = require('fs');
var file = require('fs-utils');
var path = require('path');
var log = require('verbalize');
var process = require('./');


function convert(src, dest, options) {
  log.inform('reading', src);
  var count = 0;

  var opts = options || {cwd: process.cwd()};
  var cwd = path.resolve(opts.cwd);
  var files = file.glob.sync(src, opts);

  files.forEach(function(fp) {
    count++;

    fp = path.resolve(cwd, fp);
    var dir = path.dirname(getRoot(cwd, fp));
    var name = path.basename(fp, path.extname(fp));

    var str = file.readFileSync(fp);
    var d = path.join(dest, dir, name + '.hbs');

    log.inform('writing', d.replace(/\\/g, '/'));
    file.writeFileSync(d, process(str));
  });

  log.writeln();
  log.done('done', count, 'files written.', log.green('OK'));
}

convert('**/*.html', 'result', {
  cwd: '../bootstrap/docs'
});

function getRoot(a, b) {
  a = path.normalize(a);
  b = path.normalize(b);
  return b.replace(a, '');
}
