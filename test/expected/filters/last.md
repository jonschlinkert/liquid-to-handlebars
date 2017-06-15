---
title: last
description: Liquid filter that gets the last value in an array.
---
Returns the last item of an array.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{assign 'my_array' (split 'apples, oranges, peaches, plums' ', ')}}
{{ my_array.last }}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{assign 'my_array' (split 'apples, oranges, peaches, plums' ', ')}}
{{ my_array.last }}
```
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{assign 'my_array' (split 'zebra, octopus, giraffe, tiger' ', ')}}
{{ my_array.last }}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{assign 'my_array' (split 'zebra, octopus, giraffe, tiger' ', ')}}
{{ my_array.last }}
```