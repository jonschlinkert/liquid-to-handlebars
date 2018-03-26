
## Options

### options.shimHelpers

**Type**: `string` (the name of the file to generate)

**Default**: `undefined`

**Description**:

Generate placeholder (_noop_) handlebars helpers to the specified `filename` to shim any liquid filters found during the conversion.

If you enable `options.shimHelpers`, liquid-to-handlebars will attempt to generate a `helpers.js` file with all of the necessary helpers (and block helpers) to

In other words, since liquid filters are converted to handlebars helper syntax, and liquid ships with a number of built-in [filters](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) that are not included in handlebars, you'll need to either create the helpers yourself, or use a library like [liquid-filters][], or [template-helpers][].

**Example**

The following liquid templates:

```liquid
{%% for i in (1..item.quantity) %}
  {{ i }}
{%% endfor %}
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
