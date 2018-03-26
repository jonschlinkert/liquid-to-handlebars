---
title: floor
description: Liquid filter that gets the floor of a number by rounding down to the nearest integer.
---
Rounds a number down to the nearest whole number. Liquid tries to convert the input to a number before the filter is applied.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{floor 1.2}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{floor 1.2}}
```
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{floor 2.0}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{floor 2.0}}
```
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{floor 183.357}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{floor 183.357}}
```
Here the input value is a string:
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{floor '3.5'}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{floor '3.5'}}
```