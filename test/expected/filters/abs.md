---
title: abs
description: Liquid filter that gets the absolute value of a number.
---

Returns the absolute value of a number.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{abs -17}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
17
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{abs 4}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
4
```

`abs` will also work on a string if the string only contains a number.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{abs '-19.86'}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
19.86
```
