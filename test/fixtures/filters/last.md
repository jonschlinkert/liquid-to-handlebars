---
title: last
description: Liquid filter that gets the last value in an array.
---

Returns the last item of an array.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{ my_array.last }}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{split (assign "my_array" "apples, oranges, peaches, plums") ", "}}

{{ my_array.last }}
```

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{split (assign "my_array" "zebra, octopus, giraffe, tiger") ", "}}

{{ my_array.last }}
{{/raw}}
```

<p class="code-label">Output</p>
```text
{{split (assign "my_array" "zebra, octopus, giraffe, tiger") ", "}}

{{ my_array.last }}
```
