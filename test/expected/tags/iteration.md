---
title: Iteration
description: An overview of iteration or 'loop' tags in the Liquid template language.
---

Iteration tags run blocks of code repeatedly.

## for

Repeatedly executes a block of code. For a full list of attributes available within a `for` loop, see [forloop (object)](https://docs.shopify.com/themes/liquid/objects/for-loops).

<p class="code-label">Input</p>
```liquid
{{#raw}}
  {{#each collection.products as |product|}}
    {{ product.title }}
  {{/each}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
hat shirt pants
```

### break

Causes the loop to stop iterating when it encounters the `break` tag.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{#each (range 1 5) as |i|}}
  {{#if (is i 4)}}
    {{break}}
  {{else}}
    {{ i }}
  {{/if}}
{{/each}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
1 2 3
```

### continue

Causes the loop to skip the current iteration when it encounters the `continue` tag.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{#each (range 1 5) as |i|}}
  {{#if (is i 4)}}
    {{continue}}
  {{else}}
    {{ i }}
  {{/if}}
{{/each}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
1 2 3   5
```

## for (parameters)

### limit

Limits the loop to the specified number of iterations.

<p class="code-label">Input</p>
```liquid
{{#raw}}
<!-- if array = [1,2,3,4,5,6] -->
{{#each (limit array 2) as |item|}}
  {{ item }}
{{/each}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
1 2
```

### offset

Begins the loop at the specified index.

<p class="code-label">Input</p>
```liquid
{{#raw}}
<!-- if array = [1,2,3,4,5,6] -->
{{#each (offset array 2) as |item|}}
  {{ item }}
{{/each}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
3 4 5 6
```

### range

Defines a range of numbers to loop through. The range can be defined by both literal and variable numbers.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{#each (range 3 5) as |i|}}
  {{ i }}
{{/each}}

{{assign 'num' 4}}
{{#each (range 1 num) as |i|}}
  {{ i }}
{{/each}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
3 4 5
1 2 3 4
```

### reversed

Reverses the order of the loop.

<p class="code-label">Input</p>
```liquid
{{#raw}}
<!-- if array = [1,2,3,4,5,6] -->
{{#each array as |item|}}
  {{ item }}
{{/each}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
6 5 4 3 2 1
```

## cycle

Loops through a group of strings and outputs them in the order that they were passed as parameters. Each time `cycle` is called, the next string that was passed as a parameter is output.

`cycle` must be used within a [for](#for) loop block.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{cycle 'one', 'two', 'three'}}
{{cycle 'one', 'two', 'three'}}
{{cycle 'one', 'two', 'three'}}
{{cycle 'one', 'two', 'three'}}
{{/raw}}
```

<p class="code-label">Output</p>
```text
one
two
three
one
```

Uses for `cycle` include:

-   applying odd/even classes to rows in a table
-   applying a unique class to the last product thumbnail in a row

## cycle (parameters)

`cycle` accepts a parameter called `cycle group` in cases where you need multiple `cycle` blocks in one template. If no name is supplied for the cycle group, then it is assumed that multiple calls with the same parameters are one group.

## tablerow

Generates an HTML table. Must be wrapped in opening `<table>` and closing `</table>` HTML tags.

<p class="code-label">Input</p>
```liquid
{{#raw}}
<table>
{{#tablerow collection.products as |product|}}
  {{ product.title }}
{{/tablerow}}
</table>
{{/raw}}
```

<p class="code-label">Output</p>
```html
<table>
  <tr class="row1">
    <td class="col1">
      Cool Shirt
    </td>
    <td class="col2">
      Alien Poster
    </td>
    <td class="col3">
      Batman Poster
    </td>
    <td class="col4">
      Bullseye Shirt
    </td>
    <td class="col5">
      Another Classic Vinyl
    </td>
    <td class="col6">
      Awesome Jeans
    </td>
  </tr>
</table>
```

## tablerow (parameters)

### cols

Defines how many columns the tables should have.

<p class="code-label">Input</p>
```liquid
{{#raw}}
{{#tablerow (cols collection.products 2) as |product|}}
  {{ product.title }}
{{/tablerow}}
{{/raw}}
```

<p class="code-label">Output</p>
```html
<table>
  <tr class="row1">
    <td class="col1">
      Cool Shirt
    </td>
    <td class="col2">
      Alien Poster
    </td>
  </tr>
  <tr class="row2">
    <td class="col1">
      Batman Poster
    </td>
    <td class="col2">
      Bullseye Shirt
    </td>
  </tr>
  <tr class="row3">
    <td class="col1">
      Another Classic Vinyl
    </td>
    <td class="col2">
      Awesome Jeans
    </td>
  </tr>
</table>
```

#### limit

Exits the tablerow after a specific index.

```liquid
{{#raw}}
{{#tablerow (limit (cols collection.products 2) 3) as |product|}}
  {{ product.title }}
{{/tablerow}}
{{/raw}}
```

### offset

Starts the tablerow after a specific index.

```liquid
{{#raw}}
{{#tablerow (offset (cols collection.products 2) 3) as |product|}}
  {{ product.title }}
{{/tablerow}}
{{/raw}}
```

### range

Defines a range of numbers to loop through. The range can be defined by both literal and variable numbers.

```liquid
{{#raw}}
<!--variable number example-->

{{assign 'num' 4}}
<table>
{{#tablerow (range 1 num) as |i|}}
  {{ i }}
{{/tablerow}}
</table>

<!--literal number example-->

<table>
{{#tablerow (range 3 5) as |i|}}
  {{ i }}
{{/tablerow}}
</table>
{{/raw}}
```
