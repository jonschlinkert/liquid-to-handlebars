const hbs = require('handlebars');

hbs.registerHelper('raw', function(options) {
  return options.fn();
});

const str = `{{{{raw}}}}{{ page.title }}{{{{/raw}}}}`;

console.log(hbs.compile(str)());
