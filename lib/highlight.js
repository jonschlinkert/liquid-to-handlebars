'use strict';

var through = require('through2');

module.exports = function() {
  return through.obj(function(file, enc, next) {
    var str = file.contents.toString();
    str = str.replace(/\{% highlight([^%]+)%\}/, function(m, lang) {
      var res = '{{#highlight';
      if (lang) {
        res += ` lang="${lang.trim()}"}}`;
      } else {
        res += '}}';
      }
      return res;
    });
    str = str.split('{% endhighlight %}').join('{{/highlight}}');
    file.contents = new Buffer(str);
    next(null, file);
  });
};
