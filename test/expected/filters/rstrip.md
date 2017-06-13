---
title: rstrip
description: Liquid filter that removes all whitespace from the right side of a string.
---

Removes all whitespace (tabs, spaces, and newlines) from the right side of a string.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{rstrip '          So much room for activities!          '}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{rstrip '          So much room for activities!          '}}
```
