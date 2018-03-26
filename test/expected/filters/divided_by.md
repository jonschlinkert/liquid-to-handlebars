---
title: divided_by
description: Liquid filter that divides a number by another number.
---
Divides a number by the specified number.
The result is rounded down to the nearest integer (that is, the [floor]({{{ site.baseurl }}}/filters/floor)) if the divisor is an integer.
<p class="code-label">Input</p>
{{{{raw}}}}
``` liquid
{{divided_by 16 4}}
```
{{{{/raw}}}}
<p class="code-label">Output</p>
``` text
{{divided_by 16 4}}
```
<p class="code-label">Input</p>
{{{{raw}}}}
``` liquid
{{divided_by 5 3}}
```
{{{{/raw}}}}
<p class="code-label">Output</p>
``` text
{{divided_by 5 3}}
```
### Controlling rounding
`divided_by` produces a result of the same type as the divisor — that is, if you divide by an integer, the result will be an integer. If you divide by a float (a number with a decimal in it), the result will be a float.
For example, here the divisor is an integer:
<p class="code-label">Input</p>
{{{{raw}}}}
``` liquid
{{divided_by 20 7}}
```
{{{{/raw}}}}
<p class="code-label">Output</p>
``` text
{{divided_by 20 7}}
```
Here it is a float:
<p class="code-label">Input</p>
{{{{raw}}}}
``` liquid
{{divided_by 20 7.0}}
```
{{{{/raw}}}}
<p class="code-label">Output</p>
``` text
{{divided_by 20 7.0}}
```
### Changing variable types
You might want to use a variable as a divisor, in which case you can't simply add `.0` to convert it to a float. In these cases, you can `assign` a version of your variable converted to a float using the `times` filter.
In this example, we're dividing by a variable that contains an integer, so we get an integer:
<p class="code-label">Input</p>
{{{{raw}}}}
``` liquid
{{assign 'my_integer' 7}}
{{divided_by 20 my_integer}}
```
{{{{/raw}}}}
<p class="code-label">Output</p>
``` text
{{assign 'my_integer' 7}}
{{divided_by 20 my_integer}}
```
Here, we [multiply]({{{ site.baseurl }}}/filters/times) the variable by `1.0` to get a float, then divide by the float instead:
<p class="code-label">Input</p>
{{{{raw}}}}
``` liquid
{{assign 'my_integer' 7}}
{{assign 'my_float' (times my_integer 1.0)}}
{{divided_by 20 my_float}}
```
{{{{/raw}}}}
<p class="code-label">Output</p>
``` text
{{assign 'my_integer' 7}}
{{assign 'my_float' (times my_integer 1.0)}}
{{divided_by 20 my_float}}
```