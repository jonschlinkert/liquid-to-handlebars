---
title: ceil
description: Liquid filter that gets the ceiling of a number by rounding up to the nearest integer.
---

Rounds the input up to the nearest whole number. Liquid tries to convert the input to a number before the filter is applied.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{ceil 1.2}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{ceil 1.2}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{ceil 2.0}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{ceil 2.0}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{ceil 183.357}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{ceil 183.357}}
```

Here the input value is a string:

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{ceil '3.5'}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{ceil '3.5'}}
```
