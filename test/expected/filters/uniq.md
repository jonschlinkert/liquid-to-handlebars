---
title: uniq
description: Liquid filter that removes duplicate items from an array.
---
Removes any duplicate elements in an array.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{assign 'my_array' (split 'ants, bugs, bees, bugs, ants' ', ')}}
{{join (uniq my_array) ', '}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{assign 'my_array' (split 'ants, bugs, bees, bugs, ants' ', ')}}
{{join (uniq my_array) ', '}}
```