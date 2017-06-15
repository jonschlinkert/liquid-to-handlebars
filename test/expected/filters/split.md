---
title: split
description: Liquid filter that splits a string into an array using separators.
---
Divides an input string into an array using the argument as a separator. `split` is commonly used to convert comma-separated items from a string to an array.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{assign 'beatles' (split 'John, Paul, George, Ringo' ', ')}}
{{#each beatles as |member|}}
  {{ member }}
{{/each}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{assign 'beatles' (split 'John, Paul, George, Ringo' ', ')}}
{{#each beatles as |member|}}
  {{ member }}
{{/each}}
```