{% case handle %}
{% when 'cake' %}
  This is a cake
{% when 'cookie' %}
  This is a cookie
{% else %}
  This is not a cookie/cake
{% endcase %}

                    <dt>{% case %}</dt>
                    <code>{% case handle %} <br />
                    {% when 'cake' %}<br />
                         This is a cake<br />
                    {% when 'cookie' %}<br />
                         This is a cookie<br />
                    {% when 'foo' %}<br />
                         This is a foo<br />
                    {% when 'bar' %}<br />
                         This is a bar<br />
                    {% else %}<br />
                         This is not a cookie/cake<br />
                    {% endcase %}</code>
