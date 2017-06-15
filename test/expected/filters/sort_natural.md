---
title: sort_natural
description: Liquid filter that sorts an array in case-insensitive order.
---
Sorts items in an array by a property of an item in the array.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{assign 'my_array' (split 'zebra, octopus, giraffe, Sally Snake' ', ')}}
{{join (sort_natural my_array) ', '}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
giraffe, octopus, Sally Snake, zebra
```