---
title: append
description: Liquid filter that appends a string to another string.
---
Concatenates two strings and returns the concatenated value.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{append '/my/fancy/url' '.html'}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{append '/my/fancy/url' '.html'}}
```
`append` can also be used with variables:
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{assign 'filename' '/index.html'}}
{{append 'website.com' filename}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{assign 'filename' '/index.html'}}
{{append 'website.com' filename}}
```