---
title: Control flow
description: An overview of control flow and conditional tags in the Liquid template language.
---
Control flow tags can change the information Liquid shows using programming logic.
## if
Executes a block of code only if a certain condition is `true`.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{#if (is product.title 'Awesome Shoes')}}
  These shoes are awesome!
{{/if}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
These shoes are awesome!
```
## unless
The opposite of `if` – executes a block of code only if a certain condition is **not** met.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{#unless (is product.title 'Awesome Shoes')}}
  These shoes are not awesome.
{{/unless}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
These shoes are not awesome.
```
This would be the equivalent of doing the following:
```liquid
{{#raw}}
{{#if (isnt product.title 'Awesome Shoes')}}
  These shoes are not awesome.
{{/if}}
{{/raw}}
```
## elsif / else
Adds more conditions within an `if` or `unless` block.
<p class="code-label">Input</p>
```liquid
{{#raw}}
<!-- If customer.name = 'anonymous' -->
{{#if (is customer.name 'kevin')}}
  Hey Kevin!
{{else if (is customer.name 'anonymous')}}
  Hey Anonymous!
{{else}}
  Hi Stranger!
{{/if}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
Hey Anonymous!
```
## case/when
Creates a switch statement to compare a variable with different values. `case` initializes the switch statement, and `when` compares its values.
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{assign 'handle' 'cake'}}
{{#is handle 'cake'}}
     This is a cake
  {{else is handle 'cookie'}}
     This is a cookie
  {{else}}
     This is not a cake nor a cookie
{{/is}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
This is a cake
```