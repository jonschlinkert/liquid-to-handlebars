---
title: date
description: Liquid filter that prints and formats dates.
---
Converts a timestamp into another date format. The format for this syntax is the same as [`strftime`](http://strftime.net).
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{date article.published_at '%a, %b %d, %y'}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
Fri, Jul 17, 15
```
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{date article.published_at '%Y'}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
2015
```
`date` works on strings if they contain well-formatted dates:
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
{{date 'March 14, 2016' '%b %d, %y'}}
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
{{date 'March 14, 2016' '%b %d, %y'}}
```
To get the current time, pass the special word `"now"` (or `"today"`) to `date`:
<p class="code-label">Input</p>
```liquid
{{{{raw}}}}
This page was last updated at {{date 'now' '%Y-%m-%d %H:%M'}}.
{{{{/raw}}}}
```
<p class="code-label">Output</p>
```text
This page was last updated at {{date 'now' '%Y-%m-%d %H:%M'}}.
```
Note that the value will be the current time of when the page was last generated from the template, not when the page is presented to a user if caching or static site generation is involved.