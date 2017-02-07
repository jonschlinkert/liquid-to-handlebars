---
title: plus
description: Liquid filter that adds a number to another number.
---

Adds a number to another number.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{plus {{4}} 2}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{plus {{4}} 2}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{plus {{16}} 4}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{plus {{16}} 4}}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{plus {{183.357}} 12}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{plus {{183.357}} 12}}
```
