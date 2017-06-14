---
title: newline_to_br
description: Liquid filter that converts newlines in an input string to HTML <br> tags.
---

Replaces every newline (`\n`) with an HTML line break (`<br>`).

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{#capture 'string_with_newlines'}}
Hello
there
{{/capture}}

{{newline_to_br string_with_newlines}}
{{/raw}}
```

<p class="code-label">Output</p>
```html
{{#capture 'string_with_newlines'}}
Hello
there
{{/capture}}

{{newline_to_br string_with_newlines}}
```
