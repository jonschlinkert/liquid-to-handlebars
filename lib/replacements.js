'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');
var path = require('path');
var tag = require('./tag');

/**
 * Regex patterns
 */

module.exports = [
  /**
   * Blocks
   */

  {
    // {% highlight html %} ... {% endhighlight %}
    pattern: tag.makeBlock('highlight'),
    replacement: function (match, lang, code) {
      return [
        '{{#markdown}}',
        '```' + lang,
        code,
        '```',
        '{{/markdown}}'
      ].join('\n').replace(/\n+/gm, '\n');
    }
  },
  {
    // {% for foo in site.data.bar %} ... {% endfor %}
    pattern: tag.makeBlock('for'),
    replacement: function (match, params, inner) {
      params = params.split(' ');
      var variable = params[0];
      var prop = params[2].split('.').pop();
      return [
        '{{#' + prop + '}}',
        inner.replace(new RegExp(variable, 'g'), 'this'),
        '{{/' + prop + '}}'
      ].join('\n');
    }
  },

  /**
   * Variables
   */

  {
    // {{ content }}
    pattern: tag.makeVariable('content', {matter: ''}),
    replacement: function (match) {
      return '{% body %}';
    }
  },
  {
    // {{ page.title }} => {{ title }}
    pattern: tag.makeVariable('page', {matter: '\\.([\\S]+)'}),
    replacement: function (match, prop) {
      return '{{ ' + prop + ' }}';
    }
  },
  {
    // {{ site.title }} => {{ title }}
    pattern: tag.makeVariable('site', {matter: '\\.([\\S]+)([^\\}]+)'}),
    replacement: function (match, prop, filter) {
      if (/\|/.test(match)) {
        filter = filter.split('|').join('').trim().split(':').filter(Boolean);
        return '{{! ' + filter.shift() + ' }}';
      } else {
        return match;
      }
    }
  },

  /**
   * tags
   */

  {
    // {% include foo/bar.html %}
    pattern: /\{{(.*\|.*)}}/g,
    replacement: function (match, args) {
      var arr  = args.trim().split(/[\s|]+/);
      var ctx = arr.shift();
      return '{{' + arr[0] + ' ' + ctx + '}}';
    }
  },
  {
    // {% include foo/bar.html %}
    pattern: tag.makeTag('include', {params: '([\\S]+)'}),
    replacement: function (match, str) {
      var name = path.basename(str, path.extname(str));
      return '{{> ' + name + ' }}';
    }
  },
  {
    // {% if page.slug == "foo" %}
    pattern: tag.makeTag('if', {params: '([\\S]+)'}),
    replacement: function (match, context, cond) {
      context = context.split('.').pop();
      cond = cond.trim().split(' ').pop();
      return '{{#is ' + context + ' ' + cond + '}}';
    }
  },
  {
    // {% elsif %}
    pattern: tag.makeTag('elsif', {params: '([\\S]+)'}),
    replacement: function (match, context, cond) {
      context = context.split('.').pop();
      cond = cond.trim().split(' ').pop();
      return '{{/is}} {{#is ' + context + ' ' + cond + '}}';
    }
  },
  {
    // {% comment %}
    pattern: tag.makeTag('comment', {matter: ''}),
    replacement: function (match) {
      return '{{#comment}}';
    }
  },
  {
    // {% endcomment %}
    pattern: tag.makeTag('endcomment', {matter: ''}),
    replacement: function (match) {
      return '{{/comment}}';
    }
  },
  {
    // {% else %}
    pattern: tag.makeTag('else', {matter: ''}),
    replacement: function (match) {
      return '{{^}}';
    }
  },
  {
    // {% endif %}
    pattern: tag.makeTag('endif', {matter: ''}),
    replacement: function (match) {
      return '{{/is}}';
    }
  }
];
