---
title: slice
description: Liquid filter that returns a substring from a given position in a string.
---
Returns a substring of 1 character beginning at the index specified by the argument passed in. An optional second argument specifies the length of the substring to be returned.
String indices are numbered starting from 0.
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{slice 'Liquid' 0}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{slice 'Liquid' 0}}
```
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{slice 'Liquid' 2}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{slice 'Liquid' 2}}
```
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{slice 'Liquid' 2 5}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{slice 'Liquid' 2 5}}
```
If the first parameter is a negative number, the indices are counted from the end of the string:
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{slice 'Liquid' -3 2}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{slice 'Liquid' -3 2}}
```