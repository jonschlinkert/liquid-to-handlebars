var fs = require('fs');
var path = require('path');
var glob = require('matched');
var write = require('write');
var cwd = path.join(__dirname, '../expected');
var files = glob.sync('**/*.*', {cwd: cwd});

for (var i = 0; i < files.length; i++) {
  var file = path.join(cwd, files[i]);
  var str = fs.readFileSync(file, 'utf8');
  // str = str.replace(/\s+$/gm, '');
  write.sync(file, str);
}
