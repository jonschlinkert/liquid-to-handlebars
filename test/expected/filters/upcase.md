---
title: upcase
description: Liquid filter that capitalizes every character in a string.
---

Makes each character in a string uppercase. It has no effect on strings which are already all uppercase.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{upcase "Parker Moore"}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{upcase "Parker Moore"}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{upcase "APPLE"}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{upcase "APPLE"}}
```
