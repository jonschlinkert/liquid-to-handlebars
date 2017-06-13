---
title: escape
description: Liquid filter that escapes URL-unsafe characters in a string.
---

Escapes a string by replacing characters with escape sequences (so that the string can be used in a URL, for example). It doesn't change strings that don't have anything to escape.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{escape 'Have you read "James & the Giant Peach"?'}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{escape 'Have you read "James & the Giant Peach"?'}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{escape 'Tetsuro Takara'}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{escape 'Tetsuro Takara'}}
```
