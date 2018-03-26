---
title: size
description: Liquid filter that returns the number of characters in a string or the number of items in an array.
---
Returns the number of characters in a string or the number of items in an array. `size` can also be used with dot notation (for example, `{{{{raw}}}}{{ my_string.size }}{{{{/raw}}}}`). This allows you to use `size` inside  tags such as conditionals.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{size 'Ground control to Major Tom.'}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{size 'Ground control to Major Tom.'}}
```
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{assign 'my_array' (split 'apples, oranges, peaches, plums' ', ')}}
{{size my_array}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{assign 'my_array' (split 'apples, oranges, peaches, plums' ', ')}}
{{size my_array}}
```
Using dot notation:
```liquid
{{{{raw}}}}
{{#if (gt site.pages.size 10)}}
  This is a big website!
{{/if}}
{{{{/raw}}}}
```