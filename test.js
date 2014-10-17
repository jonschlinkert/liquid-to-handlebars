/**
 * liquid-to-handlebars <https://github.com/jonschlinkert/liquid-to-handlebars>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var convert = require('./');


describe('conver tags', function () {
  it('should replace `highlight` tags with `markdown` tags', function () {
    var res = convert('{% highlight html %}\n foo bar baz \n{% endhighlight %}');
    res.should.equal('{{#markdown}}\n```html\n foo bar baz \n```\n{{/markdown}}');
  });

  it('should add `{{assets}}` variable to hrefs on link tags', function () {
    var res = convert('<link href="../assets/css/docs.min.css" rel="stylesheet">');
    res.should.equal('<link href="{{assets}}/css/docs.min.css" rel="stylesheet">');
  });

  it('should add `{{assets}}` variable to src on script tags', function () {
    var res = convert('<script src="../assets/js/ie-emulation-modes-warning.js"></script>');
    res.should.equal('<script src="{{assets}}/js/ie-emulation-modes-warning.js"></script>');
  });

  it('should convert includes to partials', function () {
    convert('{% include getting-started/download.html %}').should.equal('{{> download }}');
    convert('{% include footer.html %}').should.equal('{{> footer }}');
  });

  it('should convert if statements', function () {
    convert('{% if site.github %} foo {% else %} bar {% endif %}').should.equal('{{#is github }} foo {{^}} bar {{/is}}');

    var res = convert('{% if site.github == "baz" %} foo {% else %} bar {% endif %}');
    res.should.equal('{{#is github "baz"}} foo {{^}} bar {{/is}}');
  });
});