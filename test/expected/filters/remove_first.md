---
title: remove_first
description: Liquid filter that removes the first occurence of a given substring from a string.
---
Removes only the first occurrence of the specified substring from a string.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{remove_first 'I strained to see the train through the rain' 'rain'}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{remove_first 'I strained to see the train through the rain' 'rain'}}
```