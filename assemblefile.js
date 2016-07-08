'use strict';

var matter = require('parser-front-matter');
var extname = require('gulp-extname');
var assemble = require('assemble');
var app = assemble();

app.create('include');
app.helpers('lib/*.js');
app.helper('date', function(date, format) {
  return '';
});

app.data({
  site: {
    title: 'My Blog!'
  }
});

app.onLoad(/\.(hbs|md)$/, function (view, next) {
  matter.parse(view, next);
});
app.preLayout(/\.(hbs|md)$/, function (view, next) {
  view.layout = view.layout || view.locals.layout || view.data.layout;
  next();
});
app.preLayout(/\/_posts\/*.md$/, function (view, next) {
  view.layout = 'md';
  next();
});

app.task('load', function (cb) {
  app.partials('src/_includes/**/*.{css,hbs}');
  app.layouts('src/_layouts/*.hbs');
  app.layout('md', {content: '{{#markdown}}{% body %}{{/markdown}}'});
  cb();
});

app.task('pages', ['load'], function () {
  return app.src('src/*.hbs')
    .pipe(app.renderFile())
    .pipe(extname('.html'))
    .pipe(app.dest('blog/'))
})

app.task('posts', ['load'], function () {
  return app.src('src/_posts/*.md')
    .pipe(app.renderFile())
    .pipe(extname('.html'))
    .pipe(app.dest('blog/posts'))
})

app.task('copy', function (cb) {
  app.copy(['src/**', '!src/**/*.hbs'], 'blog/', cb);
});

app.task('default', ['pages', 'posts']);

module.exports = app;
