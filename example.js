'use strict';

var fs = require('fs');
var path = require('path');
var App = require('template');
var app = new App({loaderType: 'stream'});
var write = require('write');
var refactor = require('./');

var opts = {loaderType: 'sync'};

app.loader('aaa', opts, function (views, opts) {
  return function (start) {
    function lookup(dir, res) {
      res = res || [];

      var files = fs.readdirSync(dir);
      var len = files.length;
      while (len--) {
        var name = files[len];
        var fp = path.join(dir, name);

        if (fs.statSync(fp).isDirectory()) {
          lookup(fp, res);
        } else if (fp.slice(-5) === '.html') {
          res.push(fp);
          views.set(fp, {
            path: fp,
            content: fs.readFileSync(fp, 'utf8')
          });
        }
      }
      return res;
    }
    lookup(start);
    return views;
  }
});


app.create('post', { viewType: 'renderable', loaderType: 'sync' }, ['aaa']);
app.posts.option('renameKey', function (fp) {
  return fp;
});

app.posts('vendor/bootstrap/docs')
  .forOwn(function (view, key) {
    console.log('refactoring', key);
    view.content = refactor(view.content);
    var base = view.path.split('vendor/bootstrap/docs').join('');
    var name = path.basename(base, path.extname(base));
    var dir = path.dirname(base);

    console.log('writing...');
    var dest = path.join('actual', dir, name + '.hbs');
    write.sync(dest, view.content);
    console.log('done.');
    console.log();
  });


