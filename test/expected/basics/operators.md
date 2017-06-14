---
title: Operators
description: Using operators to perform calculations in the Liquid template language.
---

Liquid includes many logical and comparison operators.

## Basic operators

<table>
  <tbody>
    <tr>
      <td><code>==</code></td>
      <td>equals</td>
    </tr>
    <tr>
      <td><code>!=</code></td>
      <td>does not equal</td>
    </tr>
    <tr>
      <td><code>&gt;</code></td>
      <td>greater than</td>
    </tr>
    <tr>
      <td><code>&lt;</code></td>
      <td>less than</td>
    </tr>
    <tr>
      <td><code>&gt;=</code></td>
      <td>greater than or equal to</td>
    </tr>
    <tr>
      <td><code>&lt;=</code></td>
      <td>less than or equal to</td>
    </tr>
    <tr>
      <td><code>or</code></td>
      <td>logical or</td>
    </tr>
    <tr>
      <td><code>and</code></td>
      <td>logical and</td>
    </tr>
  </tbody>
</table>

For example:

```liquid
{{#raw}}
{{#if (is product.title "Awesome Shoes")}}
  These shoes are awesome!
{{/if}}
{{/raw}}
```

You can use multiple operators in a tag:

```liquid
{{#raw}}
{{#if (or (is product.type ) 'Shirt' (is product.type ) 'Shoes')}}
  This is a shirt or a pair of shoes.
{{/if}}
{{/raw}}
```

## contains

`contains` checks for the presence of a substring inside a string.

```liquid
{{#raw}}
{{#if (contains product.title 'Pack')}}
  This product's title contains the word Pack.
{{/if}}
{{/raw}}
```

`contains` can also check for the presence of a string in an array of strings.

```liquid
{{#raw}}
{{#if (contains product.tags 'Hello')}}
  This product has been tagged with 'Hello'.
{{/if}}
{{/raw}}
```

`contains` can only search strings. You cannot use it to check for an object in an array of objects.
