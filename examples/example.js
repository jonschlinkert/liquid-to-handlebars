const path = require('path');
const file = require('fs-utils');
const log = require('verbalize');
const process = require('../');


function convert(src, dest, options) {
  log.inform('reading', src);

  var count = 0;
  file.expandMapping(src, options).map(function(fp) {
    count++;
    var str = file.readFileSync(fp.src);
    var dir = path.dirname(fp.dest);
    var name = file.name(fp.dest);
    var destination = path.join(dest, dir, name + '.hbs');
    log.inform('writing', destination);


    file.writeFileSync(destination, process(str));
  });

  log.writeln();
  log.done('done', count, 'files written.', log.green('OK'));
}
convert('**/*.html', 'templates', {cwd: 'vendor/bootstrap/docs'});
