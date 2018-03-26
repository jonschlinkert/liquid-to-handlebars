---
title: join
description: Liquid filter that joins an array of strings into a single string.
---
Combines the items in an array into a single string using the argument as a separator.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{assign 'beatles' (split 'John, Paul, George, Ringo' ', ')}}
{{join beatles ' and '}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{assign 'beatles' (split 'John, Paul, George, Ringo' ', ')}}
{{join beatles ' and '}}
```