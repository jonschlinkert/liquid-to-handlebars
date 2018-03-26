---
title: prepend
description: Liquid filter that prepends a string to the beginning of another string.
---
Adds the specified string to the beginning of another string.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{prepend 'apples, oranges, and bananas' 'Some fruit: '}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{prepend 'apples, oranges, and bananas' 'Some fruit: '}}
```
You can also `prepend` variables:
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{assign 'url' 'liquidmarkup.com'}}
{{prepend '/index.html' url}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{assign 'url' 'liquidmarkup.com'}}
{{prepend '/index.html' url}}
```