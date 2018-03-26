---
title: strip_newlines
description: Liquid filter that removes newline characters from a string.
---
Removes any newline characters (line breaks) from a string.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{#capture 'string_with_newlines'}}
Hello
there
{{/capture}}
{{strip_newlines string_with_newlines}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```html
{{#capture 'string_with_newlines'}}
Hello
there
{{/capture}}
{{strip_newlines string_with_newlines}}
```