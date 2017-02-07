# tags

**control-flow.md**

From this liquid:

```liquid
{% if product.title == 'Awesome Shoes' %}
  These shoes are awesome!
{% endif %}
```

To this handlebars:

```handlebars
{{#if (is product.title "Awesome Shoes")}}
  These shoes are awesome!
{{/if}}
```

**iteration.md**

From this liquid:

```liquid
  {% for product in collection.products %}
    {{ product.title }}
  {% endfor %}
```

To this handlebars:

```handlebars
  {{#each collection.products as |product|}}
    {{ product.title }}
  {{/each}}
```

**variable.md**

From this liquid:

```liquid
{% assign my_variable = false %}
{% if my_variable != true %}
  This statement is valid.
{% endif %}
```

To this handlebars:

```handlebars
{{assign "my_variable" false}}
{{#if (isnt my_variable true)}}
  This statement is valid.
{{/if}}
```
