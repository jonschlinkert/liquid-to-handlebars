---
title: modulo
description: Liquid filter that returns the remainder from a division operation.
---

Returns the remainder of a division operation.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{modulo {{3}} 2}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{modulo {{3}} 2}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{modulo {{24}} 7}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{modulo {{24}} 7}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{modulo {{183.357}} 12}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{modulo {{183.357}} 12}}
```
