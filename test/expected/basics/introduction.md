---
title: Introduction
description: An overview of objects, tags, and filters in the Liquid template language.
---

Liquid code can be categorized into [**objects**](#objects), [**tags**](#tags), and [**filters**](#filters).

## Objects

**Objects** tell Liquid where to show content on a page. Objects and variable names are denoted by double curly braces: `{{#raw}}{{{{/raw}}` and `{{#raw}}}}{{/raw}}`.


<p class="code-label">Input</p>
```liquid
{{#raw}}
{{ page.title }}
{{/raw}}
```

<p class="code-label">Output</p>
```text
Introduction
```

In this case, Liquid is rendering the content of an object called `page.title`, and that object contains the text `Introduction`.

## Tags

**Tags** create the logic and control flow for templates. They are denoted by curly braces and percent signs: `{{#raw}}{{{{/raw}}` and `{{#raw}}}}{{/raw}}`.

The markup used in tags does not produce any visible text. This means that you can assign variables and create conditions and loops without showing any of the Liquid logic on the page.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{#if user}}
  Hello {{ user.name }}!
{{/if}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
Hello Adam!
```

Tags can be categorized into three types:

- [Control flow]({{prepend "/tags/control-flow" site.baseurl}})
- [Iteration]({{prepend "/tags/iteration" site.baseurl}})
- [Variable assignments]({{prepend "/tags/variable" site.baseurl}})

You can read more about each type of tag in their respective sections.


## Filters

**Filters** change the output of a Liquid object. They are used within an output and are separated by a `|`.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{append "/my/fancy/url" ".html"}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{append "/my/fancy/url" ".html"}}
```
