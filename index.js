const url = require('url');
const path = require('path');
const delims = require('delims');
const file = require('fs-utils');
const cheerio = require('cheerio');
const frep = require('frep');
const _ = require('lodash');
const log = require('verbalize');


var rewriteCssPaths = function (str) {
  var $ = cheerio.load(str);

  $('link[rel=stylesheet]').each(function (i, ele) {
    var href = $(ele).attr('href');
    if (href && /\.\.\//.test(href) && !/:/.test(href)) {
      str = str.replace(href, ('{{assets}}/css/' + path.basename(href)));
    }
  });
  return str;
};


var rewriteIconPaths = function (str) {
  var $ = cheerio.load(str);

  $('link').each(function (i, ele) {
    var href = $(ele).attr('href');
    var rel = $(ele).attr('rel');
    if (href && (/\.ico$/.test(href) || /icon/.test(rel)) && !/:/.test(href)) {
      str = str.replace(href, '{{assets}}/ico/' + path.basename(href));
    }
  });
  return str;
};


var rewriteImagePaths = function (str) {
  var $ = cheerio.load(str);

  $('img').each(function (i, ele) {
    var src = $(ele).attr('src');
    if (src && !/:/.test(src)) {
      str = str.replace(src, '{{assets}}/img/' + path.basename(src));
    }
  });
  return str;
};


var rewriteScriptPaths = function (str) {
  var $ = cheerio.load(str);

  $('script').each(function (i, ele) {
    var src = $(ele).attr('src');
    if (src && /\.js$/.test(src) && !/:/.test(src)) {
      str = str.replace(src, '{{assets}}/js/' + path.basename(src));
    }
  });
  return str;
};


var replaceMetaContent = function (str) {
  var $ = cheerio.load(str);

  $('meta').each(function (i, ele) {
    var content = $(ele).attr('content');
    var name = $(ele).attr('name');
    if (name && /desc|keywords|author/.test(name)) {
      str = str.replace(content, '{{ site.' + name + ' }}');
    }
  });
  return str;
};


function makeDelims(delimiters, options) {
  var defaults = _.extend({
    body: '',
    beginning: '',
    end: '',
    flags: 'g',
    noncapture: false
  }, options || {});
  return delims(delimiters, defaults).evaluate;
}

function makeBlock(name, options) {
  options = options || {};
  var params = options.params || '([\\s\\S]+?)';
  var re = [
    '\\{%\\s*'+name+'\\s*' + params + '\\s*%\\}',
    '\\{%\\s*end'+name+'+\\s*%}'
  ];
  return makeDelims(re, options);
}

function makeTag(name, options) {
  options = options || {};
  var params = options.params || '';
  var re = ['\\{%\\s*'+name+'\\s*' + params, '%\\}'];
  return makeDelims(re, options);
}

function makeVariable(name, options) {
  options = options || {};
  var re = ['\\{\\{\\s*'+name, '\\s*\\}\\}'];
  return makeDelims(re, options);
}

var replacements = [];

var blocks = [
  {
    // {% highlight html %} ... {% endhighlight %}
    pattern: makeBlock('highlight'),
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
    pattern: makeBlock('for'),
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
  }
];
replacements = replacements.concat(blocks);

var variables = [
  {
    // {{ content }}
    pattern: makeVariable('content', {matter: ''}),
    replacement: function (match, str) {
      return '{{> body }}';
    }
  },
  {
    // {{ page.title }} => {{ title }}
    pattern: makeVariable('page', {matter: '\\.([\\S]+)'}),
    replacement: function (match, prop) {
      return '{{ ' + prop + ' }}';
    }
  },
  {
    // {{ site.title }} => {{ title }}
    pattern: makeVariable('site', {matter: '\\.([\\S]+)([^\\}]+)'}),
    replacement: function (match, prop, filter) {
      if (/\|/.test(match)) {
        filter = _.compact(filter.split('|').join('').trim().split(':'));
        return '{{! ' + filter.shift() + ' }}';
      } else {
        return match;
      }
    }
  }
];
replacements = replacements.concat(variables);


var tags = [
  {
    // {% include foo/bar.html %}
    pattern: makeTag('include', {params: '([\\S]+)'}),
    replacement: function (match, str) {
      return '{{> ' + file.name(str) + ' }}';
    }
  },
  {
    // {% if page.slug == "foo" %}
    pattern: makeTag('if', {params: '([\\S]+)'}),
    replacement: function (match, context, cond) {
      context = context.split('.').pop();
      cond = cond.trim().split(' ').pop();
      return '{{#is ' + context + ' ' + cond + '}}';
    }
  },
  {
    // {% elsif %}
    pattern: makeTag('elsif', {params: '([\\S]+)'}),
    replacement: function (match, context, cond) {
      context = context.split('.').pop();
      cond = cond.trim().split(' ').pop();
      return '{{/is}} {{#is ' + context + ' ' + cond + '}}';
    }
  },
  {
    // {% comment %}
    pattern: makeTag('comment', {matter: ''}),
    replacement: function (match) {
      return '{{#comment}}';
    }
  },
  {
    // {% endcomment %}
    pattern: makeTag('endcomment', {matter: ''}),
    replacement: function (match) {
      return '{{/comment}}';
    }
  },
  {
    // {% else %}
    pattern: makeTag('else', {matter: ''}),
    replacement: function (match) {
      return '{{^}}';
    }
  },
  {
    // {% endif %}
    pattern: makeTag('endif', {matter: ''}),
    replacement: function (match) {
      return '{{/is}}';
    }
  }
];

replacements = replacements.concat(tags);


function process(str) {
  str = rewriteScriptPaths(str);
  str = replaceMetaContent(str);
  str = rewriteImagePaths(str);
  str = rewriteIconPaths(str);
  str = rewriteCssPaths(str);
  return frep.strWithArr(str, replacements);
}


function convert(src, dest, options) {
  log.inform('reading', src);

  var count = 0;
  file.expandMapping(src, options).map(function(fp) {
    count++;
    var str = file.readFileSync(fp.src);
    var dir = path.dirname(fp.dest);
    var name = file.name(fp.dest);
    var destination = path.join(dest, dir, name + '.hbs');
    log.inform('writing', destination);


    file.writeFileSync(destination, process(str));
  });

  log.writeln();
  log.done('done', count, 'files written.', log.green('OK'));
}


convert('**/*.html', 'templates', {cwd: 'vendor/bootstrap/docs'});
