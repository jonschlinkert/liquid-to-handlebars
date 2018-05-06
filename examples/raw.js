const hbs = require('handlebars');

hbs.registerHelper('raw', options => options.fn());

const str = `{{{{raw}}}}{{ page.title }}{{{{/raw}}}}`;

console.log(hbs.compile(str)());
