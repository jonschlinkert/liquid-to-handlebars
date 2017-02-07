---
title: strip
description: Liquid filter that removes whitespace from the left and right sides of a string.
---

Removes all whitespace (tabs, spaces, and newlines) from both the left and right side of a string. It does not affect spaces between words.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{strip "          So much room for activities!          "}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{strip "          So much room for activities!          "}}
```
