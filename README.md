# liquid-to-handlebars [![NPM version](https://img.shields.io/npm/v/liquid-to-handlebars.svg?style=flat)](https://www.npmjs.com/package/liquid-to-handlebars) [![NPM monthly downloads](https://img.shields.io/npm/dm/liquid-to-handlebars.svg?style=flat)](https://npmjs.org/package/liquid-to-handlebars)  [![NPM total downloads](https://img.shields.io/npm/dt/liquid-to-handlebars.svg?style=flat)](https://npmjs.org/package/liquid-to-handlebars) [![Build Status](https://img.shields.io/travis/jonschlinkert/liquid-to-handlebars.svg?style=flat)](https://travis-ci.org/jonschlinkert/liquid-to-handlebars)

> Convert liquid templates to handlebars templates.

If you've ever seen a jekyll boilerplate, or another project that uses [liquid](https://github.com/Shopify/liquid) templates and wished it was written in [handlebars](http://www.handlebarsjs.com/), this is your solution!

You can now use any liquid resource with very little time spent on converting templates. _100% of the tags mentioned in the [shopify liquid documentation](http://shopify.github.io/liquid/) convert to handlebars syntax._

**Please [create an issue](../../issues/new) if you find a tag that doesn't convert correctly, and I'll add support. Thanks!**

## Usage

```js
var convert = require('liquid-to-handlebars');
console.log('{{ product_price | default: 2.99 }}');
//=> '{{default product_price 2.99}}'
```

## Examples

There are many more examples in the [docs folder](./examples.md), as well as [test/fixtures](./test/fixtures) and [test/expected](test/expected).

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
{{nth site.users 0}}
{{nth site.users 1}}
{{nth site.users 3}}
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

## Pitfalls

Handlebars is not capable of doing some of the things that liquid docs. For example, since [capture](http://shopify.github.io/liquid/tags/variable/#capture) and [assign](http://shopify.github.io/liquid/tags/variable/#assign) both add a new variable to the context, this wouldn't work in handlebars without doing two passes over the templates, one to build up the variables and one to render.

Under the hood, this is likely what liquid is doing anyway, but with handlebars you would need to have a strategy for re-escaping _previously escaped_ templates with every pass.

Aside from that, you can find or create a handlebars helper that is functional equivalent for most of the liquids filters and tags.

**Helpers**

I considered adding handlebars helpers to this project, but I'm not sure it makes sense to do that - given that this library will likely only be used at the beginning of a new project, to scaffold it out.

However, I might create some of the helpers in another repo if I get a request for them.

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
Released under the [MIT license](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.2, on February 21, 2017._