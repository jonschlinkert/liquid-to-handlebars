---
title: round
description: Liquid filter that rounds a number to the nearest integer.
---

Rounds an input number to the nearest integer or, if a number is specified as an argument, to that number of decimal places.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{round 1.2}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{round 1.2}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{round 2.7}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{round 2.7}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{round 183.357 2}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{round 183.357 2}}
```
