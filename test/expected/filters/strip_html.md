---
title: strip_html
description: Liquid filter that removes HTML tags from a string.
---

Removes any HTML tags from a string.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{strip_html 'Have <em>you</em> read <strong>Ulysses</strong>?'}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{strip_html 'Have <em>you</em> read <strong>Ulysses</strong>?'}}
```
