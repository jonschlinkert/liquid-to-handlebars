---
title: reverse
description: Liquid filter that reverses an array, or a string converted to an array.
---

Reverses the order of the items in an array. `reverse` cannot reverse a string.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{join (reverse my_array) ", "}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{join (reverse my_array) ", "}}
```

`reverse` cannot be used directly on a string, but you can split a string into an array, reverse the array, and rejoin it by chaining together filters:

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{join (reverse (split "Ground control to Major Tom." "")) ""}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{join (reverse (split "Ground control to Major Tom." "")) ""}}
```
