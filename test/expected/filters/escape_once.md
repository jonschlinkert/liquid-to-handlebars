---
title: escape_once
description: Liquid filter that escapes URL-unsafe characters in a string once.
---
Escapes a string without changing existing escaped entities. It doesn't change strings that don't have anything to escape.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{escape_once '1 < 2 & 3'}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{escape_once '1 < 2 & 3'}}
```
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{escape_once '1 &lt; 2 &amp; 3'}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{escape_once '1 &lt; 2 &amp; 3'}}
```