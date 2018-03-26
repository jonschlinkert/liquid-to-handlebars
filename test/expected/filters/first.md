---
title: first
description: Liquid filter that returns the first item of an array.
---
Returns the first item of an array.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{assign 'my_array' (split 'apples, oranges, peaches, plums' ', ')}}
{{ my_array.first }}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{assign 'my_array' (split 'apples, oranges, peaches, plums' ', ')}}
{{ my_array.first }}
```
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{assign 'my_array' (split 'zebra, octopus, giraffe, tiger' ', ')}}
{{ my_array.first }}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{assign 'my_array' (split 'zebra, octopus, giraffe, tiger' ', ')}}
{{ my_array.first }}
```