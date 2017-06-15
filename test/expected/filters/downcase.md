---
title: downcase
description: Liquid filter that coverts a string to lowercase.
---
Makes each character in a string lowercase. It has no effect on strings which are already all lowercase.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{downcase 'Parker Moore'}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{downcase 'Parker Moore'}}
```
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{downcase 'apple'}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
{{downcase 'apple'}}
```