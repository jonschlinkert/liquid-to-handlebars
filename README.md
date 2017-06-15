# liquid-to-handlebars [![NPM version](https://img.shields.io/npm/v/liquid-to-handlebars.svg?style=flat)](https://www.npmjs.com/package/liquid-to-handlebars) [![NPM monthly downloads](https://img.shields.io/npm/dm/liquid-to-handlebars.svg?style=flat)](https://npmjs.org/package/liquid-to-handlebars) [![NPM total downloads](https://img.shields.io/npm/dt/liquid-to-handlebars.svg?style=flat)](https://npmjs.org/package/liquid-to-handlebars) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/liquid-to-handlebars.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/liquid-to-handlebars)

> Convert liquid templates to handlebars templates.

## Why use this?

If you've ever seen a jekyll boilerplate, or another project that uses [liquid](https://github.com/Shopify/liquid) templates and wished it was written in [handlebars](http://www.handlebarsjs.com/), this is your solution!

* 100% of the tags mentioned in the [shopify liquid documentation](http://shopify.github.io/liquid/) convert to handlebars syntax
* easily migrate any liquid theme or boilerplate
* use more powerful and flexible handlebars helpers instead of liquid filters

**Please [create an issue](../../issues/new) if you find a tag that doesn't convert correctly, and I'll add support. Thanks!**

## Usage

```js
var convert = require('liquid-to-handlebars');
// Converts this liquid
console.log(convert('Price: ${{ product_price | default: 2.99 }}'));
// To this handlebars
//=> 'Price: ${{default product_price 2.99}}'
```

You will also need to [include handlebars helpers](#optionsshimHelpers) that are functionally equivalent to the liquid filters that are being replaced. For example:

```js
var hbs = require('handlebars');
hbs.registerHelper('default', function(a, b) {
  return a || b || '';
});
var fn = hbs.compile('Price: ${{default product_price 2.99}}');
console.log(fn());
//=> 'Price: $2.99'

console.log(fn({default_price: '4.99'}));
//=> 'Price: $4.99'
```

## Migration debugging

_Once your liquid templates are converted to handlebars, if you attempt to render all of the templates with handlebars without any additional work, it's a good bet that you'll receive a bunch of errors from missing helpers._

Save yourself a bunch of time and frustration by following these steps:

### Step 1: Add starter helpers

Add the following to your app:

```js
var hbs = require('handlebars');

// override handlebars' built-in `helperMissing` helper, 
// so that we can easily see which helpers are missing
// and get them fixed
hbs.registerHelper('helperMissing', function() {
  var opts = [].slice.call(arguments).pop();
  console.log(`missing helper {{${opts.name}}}`);
});
```

### Step 2: Run handlebars

Now, when you run handlebars, if you see a message like this:

```js
missing helper {{foo}}
```

You can either create the helper from scratch, or use a helper library that already includes the helpers you need.

Any of the following libraries may be used, but the [liquid-filters][] library might be most useful (during migration, at least).

* [liquid-filters][] - includes a bunch of utility javascript functions that can be registered as handlebars helpers to provide parity with the built-in liquid filters
* [template-helpers](https://github.com/jonschlinkert/template-helpers) - generic helpers that can be used with any template engine.
* [handlebars-helpers](https://github.com/helpers/handlebars-helpers) - more than 150 handlebars helpers

**Examples**

```js
var hbs = require('handlebars');
var filters = require('liquid-filters');
var helpers = require('template-helpers');

hbs.register(filters());
hbs.register(helpers());
```

## Options

### options.shimHelpers

**Type**: `string` (the name of the file to generate)

**Default**: `undefined`

**Description**:

Generate placeholder (_noop_) handlebars helpers to the specified `filename` to shim any liquid filters found during the conversion.

If you enable `options.shimHelpers`, liquid-to-handlebars will attempt to generate a `helpers.js` file with all of the necessary helpers (and block helpers) to

In other words, since liquid filters are converted to handlebars helper syntax, and liquid ships with a number of built-in [filters](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) that are not included in handlebars, you'll need to either create the helpers yourself, or use a library like [liquid-filters][], or [template-helpers](https://github.com/jonschlinkert/template-helpers).

**Example**

The following liquid templates:

```liquid
{% for i in (1..item.quantity) %}
  {{ i }}
{% endfor %}
```

Converts to a handlebars `each` loop, and since handlebars does not have an equivalent syntax for liquid ranges (`i..item.quantity`), the range syntax is converted to use a `range` helper.

```handlebars
{{#each (range 1 item.quantity) as |i|}}
  {{ i }}
{{/each}}
```

Thus, given the following config:

```js
convert('example.liquid', {shimHelpers: 'foo.js'});
```

A `foo.js` file will also be generated with a **noop** `range` helper (and a `toString` utility function that is used with all generated helpers).

```js
var helpers = module.exports;

function toString(val) {
  return typeof val === 'string' ? val : '';
}

helpers.range = function(val) {
  return toString(val);
};
```

## Examples

There are **many more examples** in the [docs folder](./examples.md), as well as [test/fixtures](./test/fixtures) and [test/expected](test/expected).

### Conditionals

**basic operators**

From this liquid:

```liquid
{% if product.type == "Shirt" or product.type == "Shoes" %}
  This is a shirt or a pair of shoes.
{% endif %}
```

To this handlebars:

```handlebars
{{#if (or (is product.type "Shirt") (is product.type "Shoes"))}}
  This is a shirt or a pair of shoes.
{{/if}}
```

**boolean**

From this liquid:

```liquid
{% if settings.fp_heading %}
  <h1>{{ settings.fp_heading }}</h1>
{% endif %}
```

To this handlebars:

```handlebars
{{#if settings.fp_heading}}
  <h1>{{ settings.fp_heading }}</h1>
{{/if}}
```

**else**

From this liquid:

```liquid
{% if username and username.size > 10 %}
  Wow, {{ username }}, you have a long name!
{% else %}
  Hello there!
{% endif %}
```

To this handlebars:

```handlebars
{{#if (and username (gt username.size 10))}}
  Wow, {{ username }}, you have a long name!
{{else}}
  Hello there!
{{/if}}
```

**contains**

From this liquid:

```liquid
{% if product.title contains 'Pack' %}
  This product's title contains the word Pack.
{% endif %}
```

To this handlebars:

```handlebars
{{#if (contains product.title "Pack")}}
  This product's title contains the word Pack.
{{/if}}
```

### Arrays

**Basic loops**

From this liquid:

```liquid
<!-- if site.users = "Tobi", "Laura", "Tetsuro", "Adam" -->
{% for user in site.users %}
  {{ user }}
{% endfor %}
```

To this handlebars:

```handlebars
<!-- if site.users = "Tobi", "Laura", "Tetsuro", "Adam" -->
{{#each site.users as |user|}}
  {{ user }}
{{/each}}
```

**Accessing specific items in arrays**

From this liquid:

```liquid
<!-- if site.users = "Tobi", "Laura", "Tetsuro", "Adam" -->
{{ site.users[0] }}
{{ site.users[1] }}
{{ site.users[3] }}
```

To this handlebars:

```handlebars
<!-- if site.users = "Tobi", "Laura", "Tetsuro", "Adam" -->
{{get site.users 0}}
{{get site.users 1}}
{{get site.users 3}}
```

### Filters

From this liquid:

```liquid
{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}
```

To this handlebars:

```liquid
{{join (reverse (split "Ground control to Major Tom." "")) ""}}
```

**Many more examples** in the [docs folder](docs) and [unit tests](test).

## What is this?

This is a tool for converting projects that use [liquid](https://github.com/Shopify/liquid) templates to use [handlebars](http://www.handlebarsjs.com/) templates.

**Why convert to handlebars?**

A few reasons:

1. Liquid is a solid template engine, but it's more idiomatic for ruby users and IMHO is less than ideal for users in the javascript community.
2. Since liquid is the template engine of choice for [Jekyll](jekyllrb.com), GitHub's blog engine, there are numerous scaffolds, themes and boilerplates available for building blogs and `gh-pages` or other static sites using liquid. It would be nice if these were available in a templating language more friendly to javascript devs.
3. Handlebars is more powerful, is easier to use, and easier to extend and develop around.
4. Why re-create each boilerplate 100% hand when you can automate the vast majority of it, on demand?

The tipping point was when I recently spent a few hours converting a liquid project over to handlebars by hand, and I realized I would need to repeat that process every time I found a liquid resource I wanted to use.

This converter took me a day to create, _but I can now use any liquid resource with very little if any time spent on converting templates at all._

## About

### Related projects

* [assemble](https://www.npmjs.com/package/assemble): Get the rocks out of your socks! Assemble makes you fast at creating web projects… [more](https://github.com/assemble/assemble) | [homepage](https://github.com/assemble/assemble "Get the rocks out of your socks! Assemble makes you fast at creating web projects. Assemble is used by thousands of projects for rapid prototyping, creating themes, scaffolds, boilerplates, e-books, UI components, API documentation, blogs, building websit")
* [handlebars](https://www.npmjs.com/package/handlebars): Handlebars provides the power necessary to let you build semantic templates effectively with no frustration | [homepage](http://www.handlebarsjs.com/ "Handlebars provides the power necessary to let you build semantic templates effectively with no frustration")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on June 15, 2017._