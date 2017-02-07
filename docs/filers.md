# filters

**abs.md**

From this liquid:

```liquid
{{ -17 | abs }}
```

To this handlebars:

```handlebars
{{abs -17}}
```

**append.md**

From this liquid:

```liquid
{{ "/my/fancy/url" | append: ".html" }}
```

To this handlebars:

```handlebars
{{append "/my/fancy/url" ".html"}}
```

**capitalize.md**

From this liquid:

```liquid
{{ "title" | capitalize }}
```

To this handlebars:

```handlebars
{{capitalize "title"}}
```

**ceil.md**

From this liquid:

```liquid
{{ 1.2 | ceil }}
```

To this handlebars:

```handlebars
{{ceil 1.2}}
```

**compact.md**

From this liquid:

```liquid
{% assign site_categories = site.pages | map: 'category' %}

{% for category in site_categories %}
  {{ category }}
{% endfor %}
```

To this handlebars:

```handlebars
{{map (assign "site_categories" site.pages) 'category'}}

{{#each site_categories as |category|}}
  {{ category }}
{{/each}}
```

**date.md**

From this liquid:

```liquid
{{ article.published_at | date: "%a, %b %d, %y" }}
```

To this handlebars:

```handlebars
{{date article.published_at "%a, %b %d, %y"}}
```

**default.md**

From this liquid:

```liquid
{{ product_price | default: 2.99 }}
```

To this handlebars:

```handlebars
{{default product_price 2.99}}
```

**divided_by.md**

From this liquid:

```liquid
liquid
{{ 16 | divided_by: 4 }}
```

To this handlebars:

```handlebars
liquid
{{divided_by 16 4}}
```

**downcase.md**

From this liquid:

```liquid
{{ "Parker Moore" | downcase }}
```

To this handlebars:

```handlebars
{{downcase "Parker Moore"}}
```

**escape.md**

From this liquid:

```liquid
{{ "Have you read 'James & the Giant Peach'?" | escape }}
```

To this handlebars:

```handlebars
{{escape "Have you read 'James & the Giant Peach'?"}}
```

**escape_once.md**

From this liquid:

```liquid
{{ "1 < 2 & 3" | escape_once }}
```

To this handlebars:

```handlebars
{{escape_once "1 < 2 & 3"}}
```

**first.md**

From this liquid:

```liquid
{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}

{{ my_array.first }}
```

To this handlebars:

```handlebars
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{ my_array.first }}
```

**floor.md**

From this liquid:

```liquid
{{ 1.2 | floor }}
```

To this handlebars:

```handlebars
{{floor 1.2}}
```

**join.md**

From this liquid:

```liquid
{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}

{{ beatles | join: " and " }}
```

To this handlebars:

```handlebars
{{split (assign "beatles" "John, Paul, George, Ringo") ", "}}

{{join beatles " and "}}
```

**last.md**

From this liquid:

```liquid
{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}

{{ my_array.last }}
```

To this handlebars:

```handlebars
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{ my_array.last }}
```

**lstrip.md**

From this liquid:

```liquid
{{ "          So much room for activities!          " | lstrip }}
```

To this handlebars:

```handlebars
{{lstrip "          So much room for activities!          "}}
```

**map.md**

From this liquid:

```liquid
{% assign all_categories = site.pages | map: "category" %}

{% for item in all_categories %}
{{ item }}
{% endfor %}
```

To this handlebars:

```handlebars
{{map (assign "all_categories" site.pages) "category"}}

{{#each all_categories as |item|}}
{{ item }}
{{/each}}
```

**minus.md**

From this liquid:

```liquid
{{ 4 | minus: 2 }}
```

To this handlebars:

```handlebars
{{minus 4 2}}
```

**modulo.md**

From this liquid:

```liquid
{{ 3 | modulo: 2 }}
```

To this handlebars:

```handlebars
{{modulo 3 2}}
```

**newline_to_br.md**

From this liquid:

```liquid
{% capture string_with_newlines %}
Hello
there
{% endcapture %}

{{ string_with_newlines | newline_to_br }}
```

To this handlebars:

```handlebars
{{#capture "string_with_newlines"}}
Hello
there
{{/capture}}

{{newline_to_br string_with_newlines}}
```

**plus.md**

From this liquid:

```liquid
{{ 4 | plus: 2 }}
```

To this handlebars:

```handlebars
{{plus 4 2}}
```

**prepend.md**

From this liquid:

```liquid
{{ "apples, oranges, and bananas" | prepend: "Some fruit: " }}
```

To this handlebars:

```handlebars
{{prepend "apples, oranges, and bananas" "Some fruit: "}}
```

**remove.md**

From this liquid:

```liquid
{{ "I strained to see the train through the rain" | remove: "rain" }}
```

To this handlebars:

```handlebars
{{remove "I strained to see the train through the rain" "rain"}}
```

**remove_first.md**

From this liquid:

```liquid
{{ "I strained to see the train through the rain" | remove_first: "rain" }}
```

To this handlebars:

```handlebars
{{remove_first "I strained to see the train through the rain" "rain"}}
```

**replace.md**

From this liquid:

```liquid
{{ "Take my protein pills and put my helmet on" | replace: "my", "your" }}
```

To this handlebars:

```handlebars
{{replace "Take my protein pills and put my helmet on" "my" "your"}}
```

**replace_first.md**

From this liquid:

```liquid
{% assign my_string = "Take my protein pills and put my helmet on" %}
{{ my_string | replace_first: "my", "your" }}
```

To this handlebars:

```handlebars
{{assign "my_string" "Take my protein pills and put my helmet on"}}
{{replace_first my_string "my" "your"}}
```

**reverse.md**

From this liquid:

```liquid
{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}

{{ my_array | reverse | join: ", " }}
```

To this handlebars:

```handlebars
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{join (reverse my_array) ", "}}
```

**round.md**

From this liquid:

```liquid
{{ 1.2 | round }}
```

To this handlebars:

```handlebars
{{round 1.2}}
```

**rstrip.md**

From this liquid:

```liquid
{{ "          So much room for activities!          " | rstrip }}
```

To this handlebars:

```handlebars
{{rstrip "          So much room for activities!          "}}
```

**size.md**

From this liquid:

```liquid
{{ "Ground control to Major Tom." | size }}
```

To this handlebars:

```handlebars
{{size "Ground control to Major Tom."}}
```

**slice.md**

From this liquid:

```liquid
{{ "Liquid" | slice: 0 }}
```

To this handlebars:

```handlebars
{{slice "Liquid" 0}}
```

**sort.md**

From this liquid:

```liquid
{% assign my_array = "zebra, octopus, giraffe, Sally Snake" | split: ", " %}

{{ my_array | sort | join: ", " }}
```

To this handlebars:

```handlebars
{{split (assign "my_array" "zebra, octopus, giraffe, Sally Snake") ", "}}

{{join (sort my_array) ", "}}
```

**sort_natural.md**

From this liquid:

```liquid
{% assign my_array = "zebra, octopus, giraffe, Sally Snake" | split: ", " %}

{{ my_array | sort_natural | join: ", " }}
```

To this handlebars:

```handlebars
{{split (assign "my_array" "zebra, octopus, giraffe, Sally Snake") ", "}}

{{join (sort_natural my_array) ", "}}
```

**split.md**

From this liquid:

```liquid
{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}

{% for member in beatles %}
  {{ member }}
{% endfor %}
```

To this handlebars:

```handlebars
{{split (assign "beatles" "John, Paul, George, Ringo") ", "}}

{{#each beatles as |member|}}
  {{ member }}
{{/each}}
```

**strip.md**

From this liquid:

```liquid
{{ "          So much room for activities!          " | strip }}
```

To this handlebars:

```handlebars
{{strip "          So much room for activities!          "}}
```

**strip_html.md**

From this liquid:

```liquid
{{ "Have <em>you</em> read <strong>Ulysses</strong>?" | strip_html }}
```

To this handlebars:

```handlebars
{{strip_html "Have <em>you</em> read <strong>Ulysses</strong>?"}}
```

**strip_newlines.md**

From this liquid:

```liquid
{% capture string_with_newlines %}
Hello
there
{% endcapture %}

{{ string_with_newlines | strip_newlines }}
```

To this handlebars:

```handlebars
{{#capture "string_with_newlines"}}
Hello
there
{{/capture}}

{{strip_newlines string_with_newlines}}
```

**times.md**

From this liquid:

```liquid
{{ 3 | times: 2 }}
```

To this handlebars:

```handlebars
{{times 3 2}}
```

**truncate.md**

From this liquid:

```liquid
{{ "Ground control to Major Tom." | truncate: 20 }}
```

To this handlebars:

```handlebars
{{truncate "Ground control to Major Tom." 20}}
```

**truncatewords.md**

From this liquid:

```liquid
{{ "Ground control to Major Tom." | truncatewords: 3 }}
```

To this handlebars:

```handlebars
{{truncatewords "Ground control to Major Tom." 3}}
```

**uniq.md**

From this liquid:

```liquid
{% assign my_array = "ants, bugs, bees, bugs, ants" | split: ", " %}

{{ my_array | uniq | join: ", " }}
```

To this handlebars:

```handlebars
{{split (assign "my_array" "ants, bugs, bees, bugs, ants") ", "}}

{{join (uniq my_array) ", "}}
```

**upcase.md**

From this liquid:

```liquid
{{ "Parker Moore" | upcase }}
```

To this handlebars:

```handlebars
{{upcase "Parker Moore"}}
```

**url_decode.md**

From this liquid:

```liquid
{{ "%27Stop%21%27+said+Fred" | url_decode }}
```

To this handlebars:

```handlebars
{{url_decode "%27Stop%21%27+said+Fred"}}
```

**url_encode.md**

From this liquid:

```liquid
{{ "john@liquid.com" | url_encode }}
```

To this handlebars:

```handlebars
{{url_encode "john@liquid.com"}}
```
