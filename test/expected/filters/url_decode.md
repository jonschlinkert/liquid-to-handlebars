---
title: url_decode
description: Liquid filter that decodes percent-encoded characters in a string.
---
Decodes a string that has been encoded as a URL or by [`url_encode`]({{prepend '/filters/url_encode' site.baseurl}}).
<p class="code-label">Input</p>
```liquid
{{#raw}}
{{url_decode '%27Stop%21%27+said+Fred'}}
{{/raw}}
```
<p class="code-label">Output</p>
```text
'Stop!' said Fred
```