var hbs = require('handlebars');
var get = require('get-value');
hbs.registerHelper('divided_by', function(a, b) {
  return a / b;
});

hbs.registerHelper('is', function(a, b) {
  return a == b;
});

hbs.registerHelper('or', function(a, b) {
  return a || b;
});

hbs.registerHelper('get', function(prop) {
  return get(this, prop);
});

hbs.registerHelper('toPath', function() {
  return [].slice.call(arguments).join('.');
});

var fn = hbs.compile('{{pages.foo}}');
console.log(fn({pages: {foo: 'foo'}, blank: null}))
