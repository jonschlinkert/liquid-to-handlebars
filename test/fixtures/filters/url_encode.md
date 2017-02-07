---
title: url_encode
description: Liquid filter that encodes URL-unsafe characters in a string.
---

Converts any URL-unsafe characters in a string into percent-encoded characters.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{url_encode "john@liquid.com"}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{url_encode "john@liquid.com"}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{url_encode "Tetsuro Takara"}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{url_encode "Tetsuro Takara"}}
```
