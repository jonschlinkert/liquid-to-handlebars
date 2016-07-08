'use strict';

var snapdragon = require('snapdragon');
var stack = [];

module.exports = function(str, options) {
  var parser = new snapdragon.Parser(options)
    .use(function() {
      var pos = this.position();
      var m = this.match(/^[^{]+/);
      if (!m) return;
      return pos({
        type: 'text',
        val: m[0]
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^(?=\{[%{])/);
      if (!m) return;
      var val = this.match(/^[^}]+\}+/);
      if (!val) return;
      var delim = val[0].slice(0, 2);
      var inner = val[0].replace(/^[{% ]+|[%} ]+$/g, '');

      var type = delim !== '{{' ? 'tag' : 'expression';
      if (/\|/.test(inner)) {
        type = 'filter';
      }
      return pos({
        type: type,
        inner: inner,
        val: val[0]
      });
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^.+/);
      if (!m) return;
      return pos({
        type: 'rest',
        val: m[0]
      })
    })

  var renderer = new snapdragon.Renderer(options)
    .set('text', function(node) {
      return node.val;
    })
    .set('rest', function(node) {
      return node.val;
    })
    .set('filter', function(node) {
      var segs = node.inner.split(/:?[|\s]+/);
      var inner = '';

      if (segs.length === 2) {
        inner = segs.reverse().join(' ');
        return `{{${inner}}}`;
      }
      if (segs.length === 3 && segs[1] === 'date') {
        return `{{date ${segs[0]} ${segs[2]}}}`;
      }
      return node.val;
    })
    .set('tag', function(node) {
      node.val = inner(node.inner);
      return node.val;
    })
    .set('expression', function(node) {
      return node.val
        .replace(/^\{\{\s*/, '{{ ')
        .replace(/\s*\}\}$/, ' }}');
    })

  var ast = parser.parse(str);
  var result = renderer.render(ast);
  return result.rendered;
};

function opening(str) {
  return /\{%\s*(?!end)(\S+)/.exec(str);
}
function closing(str) {
  return /\{%\s*end(\S+)/.exec(str);
}

function inner(str, options) {
  var parser = new snapdragon.Parser(options)
    .use(function() {
      var pos = this.position();
      var m = this.match(/^assign(.*)/);
      if (!m) return;
      return pos({
        type: 'assign',
        inner: m[0],
        val: m[1].trim()
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^for(.*)/);
      if (!m) return;
      stack.push('each');
      return pos({
        type: 'for',
        inner: m[0],
        val: m[1].trim()
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^highlight(.*)/);
      if (!m) return;
      stack.push('highlight');
      return pos({
        type: 'highlight',
        inner: m[0],
        val: m[1].trim()
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^unless(.*)/);
      if (!m) return;
      stack.push('unless');
      return pos({
        type: 'unless',
        inner: m[0],
        val: m[1].trim()
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^if\s*(.*)/);
      if (!m) return;
      var val = m[1].trim();
      var type = 'if';

      if (/ or /.test(val)) {
        type = 'or';
      } else if (/!=/.test(val)) {
        type = 'isnt';
      } else if (/=/.test(val)) {
        type = 'is';
      }

      stack.push(type);
      return pos({
        type: type,
        inner: m[0],
        val: val
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^elsif(.*)/);
      if (!m) return;
      return pos({
        type: 'elsif',
        val: m[0]
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^else/);
      if (!m) return;
      return pos({
        type: 'else',
        val: m[0]
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^end(\w+)/);
      if (!m) return;

      return pos({
        type: 'end',
        inner: m[0],
        val: stack.pop()
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^body/);
      if (!m) return;

      return pos({
        type: 'body',
        val: m[0]
      })
    })
    .use(function() {
      var pos = this.position();
      var m = this.match(/^include(.*)/);
      if (!m) return;

      return pos({
        type: 'include',
        val: m[0]
      })
    })

  var renderer = new snapdragon.Renderer(options)
    .set('is', function(node) {
      var segs = node.val.replace(/[\= ]+/g, ' ');
      return '{{#is ' + segs + '}}';
    })
    .set('isnt', function(node) {
      var segs = node.val.replace(/[\!= ]+/g, ' ');
      return '{{#isnt ' + segs + '}}';
    })
    .set('highlight', function(node) {
      return '{{#highlight ' + node.val + '}}';
    })
    .set('for', function(node) {
      var segs = node.val.split(' in ');
      var key = segs.shift();
      var val = segs.pop();
      var args = val.split(' ');
      var exp = args.shift();
      if (args.length) {
        args.forEach(function(arg) {
          if (/:/.test(arg)) {
            var parts = arg.split(':');
            exp = `(${parts[0]} ${exp} ${parts[1]})`;
          }
        });
      }
      exp = exp + ' as |' + key;
      return `{{#each ` + exp + ` ${key}Id}}`;
    })
    .set('or', function(node) {
      var args = node.val.split(' or ').map(function(arg) {
        return comparison(arg);
      });
      return '{{#or ' + args.join(' ') + '}}';
    })
    .set('unless', function(node) {
      var val = comparison(node.val);
      return '{{#unless ' + val + '}}';
    })
    .set('if', function(node) {
      var val = node.val;
      return '{{#if ' + node.val + '}}';
    })
    .set('else', function(node) {
      return '{{else}}';
    })
    .set('elsif', function(node) {
      var val = node.val.replace(/^elsif\s*/, '');
      val = comparison(val);
      return '{{else if ' + val + '}}';
    })
    .set('end', function(node) {
      return '{{/' + node.val + '}}';
    })
    .set('assign', function(node) {
      return node.val;
    })
    .set('include', function(node) {
      var segs = node.val.split(' ');
      var val = '"' + segs.pop() + '"';

      return '{{include ' + val + '}}';
    })
    .set('body', function(node) {
      return '{% body %}';
    })

  var ast = parser.parse(str);
  var result = renderer.render(ast);
  return result.rendered;
};

function comparison(val) {
  var re = /\s[!=<>]+\s/;
  var op = re.exec(val);
  if (op) {
    var segs = val.split(re);
    var ch = op[0].trim();
    if (ch === '==' || ch === '===') {
      val = `(is ${segs[0]} ${segs[1]})`;
    } else {
      val = `(compare ${segs[0]} "${ch}" ${segs[1]})`;
    }
  }
  return val;
}
