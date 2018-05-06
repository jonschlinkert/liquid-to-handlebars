const converter = require('..');
const str = `
{% if foo %}
  {% if bar %}
    {% for block in section.blocks limit: section.blocks.size reversed %}
      {{ block }}
    {% endfor %}
  {% endif %}
{% endif %}
`;

console.log(converter.convert(str));
console.log(converter.convert(str, { prefix: '' }));
console.log(converter.convert(str, { prefix: '@', addScopes: true }));
