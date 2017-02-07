---
title: first
description: Liquid filter that returns the first item of an array.
---

Returns the first item of an array.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{ my_array.first }}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{ my_array.first }}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{split (assign "my_array" "zebra, octopus, giraffe, tiger") ", "}}

{{ my_array.first }}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{split (assign "my_array" "zebra, octopus, giraffe, tiger") ", "}}

{{ my_array.first }}
```
