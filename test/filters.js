'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var convert = require('..');
var cwd = path.join.bind(path, __dirname);
var fixtures = cwd('fixtures/filters');

describe('filters', function() {
  var units = [
    {
      fixture: '{{ item | img_url: \'small\' | img_tag: item.featured_image.alt }}',
      expected: '{{img_tag (img_url item \'small\') item.featured_image.alt}}'
    },
    {
      fixture: '{{ product.title | remove: "Awesome" }}',
      expected: '{{remove product.title \'Awesome\'}}'
    },
    {
      fixture: '{{ product.title | upcase }}',
      expected: '{{upcase product.title}}'
    },
    {
      fixture: '{{ product.title | upcase | remove: "AWESOME"  }}',
      expected: '{{remove (upcase product.title) \'AWESOME\'}}'
    },
    {
      fixture: '{{ paginator.next_page_path | prepend: site.baseurl | replace: \'//\', \'/\' }}',
      expected: '{{replace (prepend paginator.next_page_path site.baseurl) \'//\' \'/\'}}'
    },
    {
      fixture: '{{ -17 | abs }}',
      expected: '{{abs -17}}'
    },
    {
      fixture: '{{ 4 | abs }}',
      expected: '{{abs 4}}'
    },
    {
      fixture: '{{ "-19.86" | abs }}',
      expected: '{{abs \'-19.86\'}}'
    },
    {
      fixture: '{{ "/my/fancy/url" | append: ".html" }}',
      expected: '{{append \'/my/fancy/url\' \'.html\'}}'
    },
    {
      fixture: '{{ "website.com" | append: filename }}',
      expected: '{{append \'website.com\' filename}}'
    },
    {
      fixture: '{{ "title" | capitalize }}',
      expected: '{{capitalize \'title\'}}'
    },
    {
      fixture: '{{ "my great title" | capitalize }}',
      expected: '{{capitalize \'my great title\'}}'
    },
    {
      fixture: '{{ 1.2 | ceil }}',
      expected: '{{ceil 1.2}}'
    },
    {
      fixture: '{{ 2.0 | ceil }}',
      expected: '{{ceil 2.0}}'
    },
    {
      fixture: '{{ 183.357 | ceil }}',
      expected: '{{ceil 183.357}}'
    },
    {
      fixture: '{{ "3.5" | ceil }}',
      expected: '{{ceil \'3.5\'}}'
    },
    {
      fixture: '{{ category }}',
      expected: '{{ category }}'
    },
    {
      fixture: '{{ article.published_at | date: "%a, %b %d, %y" }}',
      expected: '{{date article.published_at \'%a, %b %d, %y\'}}'
    },
    {
      fixture: '{{ article.published_at | date: "%Y" }}',
      expected: '{{date article.published_at \'%Y\'}}'
    },
    {
      fixture: '{{ "March 14, 2016" | date: "%b %d, %y" }}',
      expected: '{{date \'March 14, 2016\' \'%b %d, %y\'}}'
    },
    {
      fixture: '{{ "now" | date: "%Y-%m-%d %H:%M" }}',
      expected: '{{date \'now\' \'%Y-%m-%d %H:%M\'}}'
    },
    {
      fixture: '{{ image | img_url: \'1024x1024\' }}',
      expected: '{{img_url image \'1024x1024\'}}'
    },
    {
      fixture: '{{ featured_image | img_url: \'1024x1024\' }}',
      expected: '{{img_url featured_image \'1024x1024\'}}'
    },
    {
      fixture: '{{ product_price | default: 2.99 }}',
      expected: '{{default product_price 2.99}}'
    },
    {
      fixture: '{{ site.baseurl }}',
      expected: '{{{ site.baseurl }}}'
    },
    {
      fixture: '{{ 16 | divided_by: 4 }}',
      expected: '{{divided_by 16 4}}'
    },
    {
      fixture: '{{ 5 | divided_by: 3 }}',
      expected: '{{divided_by 5 3}}'
    },
    {
      fixture: '{{ 20 | divided_by: 7 }}',
      expected: '{{divided_by 20 7}}'
    },
    {
      fixture: '{{ 20 | divided_by: 7.0 }}',
      expected: '{{divided_by 20 7.0}}'
    },
    {
      fixture: '{{ 20 | divided_by: my_integer }}',
      expected: '{{divided_by 20 my_integer}}'
    },
    {
      fixture: '{{ 20 | divided_by: my_float }}',
      expected: '{{divided_by 20 my_float}}'
    },
    {
      fixture: '{{ "Parker Moore" | downcase }}',
      expected: '{{downcase \'Parker Moore\'}}'
    },
    {
      fixture: '{{ "apple" | downcase }}',
      expected: '{{downcase \'apple\'}}'
    },
    {
      fixture: '{{ "Have you read \'James & the Giant Peach\'?" | escape }}',
      expected: '{{escape \'Have you read "James & the Giant Peach"?\'}}'
    },
    {
      fixture: '{{ "Tetsuro Takara" | escape }}',
      expected: '{{escape \'Tetsuro Takara\'}}'
    },
    {
      only: true,
      fixture: '{{ "1 < 2 & 3" | escape_once }}',
      expected: '{{escape_once \'1 < 2 & 3\'}}'
    },
    {
      fixture: '{{ "1 &lt; 2 &amp; 3" | escape_once }}',
      expected: '{{escape_once \'1 &lt; 2 &amp; 3\'}}'
    },
    {
      fixture: '{{ my_array.first }}',
      expected: '{{ my_array.first }}'
    },
    {
      fixture: '{{ 1.2 | floor }}',
      expected: '{{floor 1.2}}'
    },
    {
      fixture: '{{ 2.0 | floor }}',
      expected: '{{floor 2.0}}'
    },
    {
      fixture: '{{ 183.357 | floor }}',
      expected: '{{floor 183.357}}'
    },
    {
      fixture: '{{ "3.5" | floor }}',
      expected: '{{floor \'3.5\'}}'
    },
    {
      fixture: '{{ beatles | join: " and " }}',
      expected: '{{join beatles \' and \'}}'
    },
    {
      fixture: '{{ my_array.last }}',
      expected: '{{ my_array.last }}'
    },
    {
      fixture: '{{ "          So much room for activities!          " | lstrip }}',
      expected: '{{lstrip \'          So much room for activities!          \'}}'
    },
    {
      fixture: '{{ item }}',
      expected: '{{ item }}'
    },
    {
      fixture: '{{ 4 | minus: 2 }}',
      expected: '{{minus 4 2}}'
    },
    {
      fixture: '{{ 16 | minus: 4 }}',
      expected: '{{minus 16 4}}'
    },
    {
      fixture: '{{ 183.357 | minus: 12 }}',
      expected: '{{minus 183.357 12}}'
    },
    {
      fixture: '{{ 3 | modulo: 2 }}',
      expected: '{{modulo 3 2}}'
    },
    {
      fixture: '{{ 24 | modulo: 7 }}',
      expected: '{{modulo 24 7}}'
    },
    {
      fixture: '{{ 183.357 | modulo: 12 }}',
      expected: '{{modulo 183.357 12}}'
    },
    {
      fixture: '{{ string_with_newlines | newline_to_br }}',
      expected: '{{newline_to_br string_with_newlines}}'
    },
    {
      fixture: '{{ 4 | plus: 2 }}',
      expected: '{{plus 4 2}}'
    },
    {
      fixture: '{{ 16 | plus: 4 }}',
      expected: '{{plus 16 4}}'
    },
    {
      fixture: '{{ 183.357 | plus: 12 }}',
      expected: '{{plus 183.357 12}}'
    },
    {
      fixture: '{{ "apples, oranges, and bananas" | prepend: "Some fruit: " }}',
      expected: '{{prepend \'apples, oranges, and bananas\' \'Some fruit: \'}}'
    },
    {
      fixture: '{{ "/index.html" | prepend: url }}',
      expected: '{{prepend \'/index.html\' url}}'
    },
    {
      fixture: '{{ "I strained to see the train through the rain" | remove: "rain" }}',
      expected: '{{remove \'I strained to see the train through the rain\' \'rain\'}}'
    },
    {
      fixture: '{{ "I strained to see the train through the rain" | remove_first: "rain" }}',
      expected: '{{remove_first \'I strained to see the train through the rain\' \'rain\'}}'
    },
    {
      fixture: '{{ "Take my protein pills and put my helmet on" | replace: "my", "your" }}',
      expected: '{{replace \'Take my protein pills and put my helmet on\' \'my\' \'your\'}}'
    },
    {
      fixture: '{{ my_string | replace_first: "my", "your" }}',
      expected: '{{replace_first my_string \'my\' \'your\'}}'
    },
    {
      fixture: '{{ my_array | reverse | join: ", " }}',
      expected: '{{join (reverse my_array) \', \'}}'
    },
    {
      fixture: '{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}',
      expected: '{{join (reverse (split \'Ground control to Major Tom.\' \'\')) \'\'}}'
    },
    {
      fixture: '{{ 1.2 | round }}',
      expected: '{{round 1.2}}'
    },
    {
      fixture: '{{ 2.7 | round }}',
      expected: '{{round 2.7}}'
    },
    {
      fixture: '{{ 183.357 | round: 2 }}',
      expected: '{{round 183.357 2}}'
    },
    {
      fixture: '{{ "          So much room for activities!          " | rstrip }}',
      expected: '{{rstrip \'          So much room for activities!          \'}}'
    },
    {
      fixture: '{{ my_string.size }}',
      expected: '{{ my_string.size }}'
    },
    {
      fixture: '{{ "Ground control to Major Tom." | size }}',
      expected: '{{size \'Ground control to Major Tom.\'}}'
    },
    {
      fixture: '{{ my_array | size }}',
      expected: '{{size my_array}}'
    },
    {
      fixture: '{{ "Liquid" | slice: 0 }}',
      expected: '{{slice \'Liquid\' 0}}'
    },
    {
      fixture: '{{ "Liquid" | slice: 2 }}',
      expected: '{{slice \'Liquid\' 2}}'
    },
    {
      fixture: '{{ "Liquid" | slice: 2, 5 }}',
      expected: '{{slice \'Liquid\' 2 5}}'
    },
    {
      fixture: '{{ "Liquid" | slice: -3, 2 }}',
      expected: '{{slice \'Liquid\' -3 2}}'
    },
    {
      fixture: '{{ my_array | sort | join: ", " }}',
      expected: '{{join (sort my_array) \', \'}}'
    },
    {
      fixture: '{{ my_array | sort_natural | join: ", " }}',
      expected: '{{join (sort_natural my_array) \', \'}}'
    },
    {
      fixture: '{{ member }}',
      expected: '{{ member }}'
    },
    {
      fixture: '{{ "          So much room for activities!          " | strip }}',
      expected: '{{strip \'          So much room for activities!          \'}}'
    },
    {
      fixture: '{{ "Have <em>you</em> read <strong>Ulysses</strong>?" | strip_html }}',
      expected: '{{strip_html \'Have <em>you</em> read <strong>Ulysses</strong>?\'}}'
    },
    {
      fixture: '{{ string_with_newlines | strip_newlines }}',
      expected: '{{strip_newlines string_with_newlines}}'
    },
    {
      fixture: '{{ 3 | times: 2 }}',
      expected: '{{times 3 2}}'
    },
    {
      fixture: '{{ 24 | times: 7 }}',
      expected: '{{times 24 7}}'
    },
    {
      fixture: '{{ 183.357 | times: 12 }}',
      expected: '{{times 183.357 12}}'
    },
    {
      fixture: '{{ "Ground control to Major Tom." | truncate: 20 }}',
      expected: '{{truncate \'Ground control to Major Tom.\' 20}}'
    },
    {
      fixture: '{{ "Ground control to Major Tom." | truncate: 25, ", and so on" }}',
      expected: '{{truncate \'Ground control to Major Tom.\' 25 \', and so on\'}}'
    },
    {
      fixture: '{{ "Ground control to Major Tom." | truncate: 20, "" }}',
      expected: '{{truncate \'Ground control to Major Tom.\' 20 \'\'}}'
    },
    {
      fixture: '{{ "Ground control to Major Tom." | truncatewords: 3 }}',
      expected: '{{truncatewords \'Ground control to Major Tom.\' 3}}'
    },
    {
      fixture: '{{ "Ground control to Major Tom." | truncatewords: 3, "--" }}',
      expected: '{{truncatewords \'Ground control to Major Tom.\' 3 \'--\'}}'
    },
    {
      fixture: '{{ "Ground control to Major Tom." | truncatewords: 3, "" }}',
      expected: '{{truncatewords \'Ground control to Major Tom.\' 3 \'\'}}'
    },
    {
      fixture: '{{ my_array | uniq | join: ", " }}',
      expected: '{{join (uniq my_array) \', \'}}'
    },
    {
      fixture: '{{ "Parker Moore" | upcase }}',
      expected: '{{upcase \'Parker Moore\'}}'
    },
    {
      fixture: '{{ "APPLE" | upcase }}',
      expected: '{{upcase \'APPLE\'}}'
    },
    {
      fixture: '{{ \'/filters/url_encode\' | prepend: site.baseurl }}',
      expected: '{{prepend \'/filters/url_encode\' site.baseurl}}'
    },
    {
      fixture: '{{ "%27Stop%21%27+said+Fred" | url_decode }}',
      expected: '{{url_decode \'%27Stop%21%27+said+Fred\'}}'
    },
    {
      fixture: '{{ "john@liquid.com" | url_encode }}',
      expected: '{{url_encode \'john@liquid.com\'}}'
    },
    {
      fixture: '{{ "Tetsuro Takara" | url_encode }}',
      expected: '{{url_encode \'Tetsuro Takara\'}}'
    }
  ];

  var hasOnly = support.hasOnly(units);
  units.forEach(function(unit) {
    if (hasOnly && !unit.only) return;
    it('should convert ' + unit.fixture, function() {
      assert.equal(convert(unit.fixture), unit.expected, unit.fixture);
    });
  });

  fs.readdirSync(fixtures).forEach(function(name) {
    // if (!/truncate/.test(name)) return;
    it(`should convert ${name} filters`, function() {
      var expected = fs.readFileSync(cwd('expected/filters', name), 'utf8');
      var fixture = fs.readFileSync(path.join(fixtures, name), 'utf8');
      var actual = convert(fixture);
      assert.equal(actual, expected, name);
    });
  });
});
