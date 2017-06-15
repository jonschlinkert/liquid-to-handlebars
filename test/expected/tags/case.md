{{#is handle 'cake'}}
  This is a cake
{{else is handle 'cookie'}}
  This is a cookie
{{else}}
  This is not a cookie/cake
{{/is}}

                    <dt>{{#case}}</dt>
                    <code><br />
                    {{#is handle 'cake'}}<br />
                         This is a cake<br />
                    {{else is handle 'cookie'}}<br />
                         This is a cookie<br />
                    {{else is handle 'foo'}}<br />
                         This is a foo<br />
                    {{else is handle 'bar'}}<br />
                         This is a bar<br />
                    {{else}}<br />
                         This is not a cookie/cake<br />
{{/is}}</code>
