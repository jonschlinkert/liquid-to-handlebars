---
title: lstrip
description: Liquid filter that removes whitespace from the left side of a string.
---
Removes all whitespaces (tabs, spaces, and newlines) from the beginning of a string. The filter does not affect spaces between words.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{lstrip '          So much room for activities!          '}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{lstrip '          So much room for activities!          '}}
```