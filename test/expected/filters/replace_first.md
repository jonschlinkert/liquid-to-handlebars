---
title: replace_first
description: Liquid filter that replaces the first occurrence of a given substring in a string.
---
Replaces only the first occurrence of the first argument in a string with the second argument.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{assign 'my_string' 'Take my protein pills and put my helmet on'}}
{{replace_first my_string 'my' 'your'}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{assign 'my_string' 'Take my protein pills and put my helmet on'}}
{{replace_first my_string 'my' 'your'}}
```