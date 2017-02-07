'use strict';

var del = require('delete');
var path = require('path');
var gulp = require('gulp');
var clone = require('gh-clone');
var extname = require('gulp-extname');
var pipeline = require('./lib/pipeline');

var fixtures = path.resolve.bind(path, __dirname, 'test/fixtures');
var liquid = path.resolve.bind(path, __dirname, 'vendor/liquid');

gulp.task('markdown', function() {
  return gulp.src('**/*.md', {cwd: liquid()})
    .pipe(pipeline.converter())
    .pipe(gulp.dest(fixtures()));
});

gulp.task('html', function() {
  return gulp.src('**/*.html', {cwd: liquid()})
    .pipe(pipeline.converter())
    .pipe(extname('.hbs'))
    .pipe(gulp.dest(fixtures()));
});

gulp.task('liquid', function(cb) {
  clone({repo: 'Shopify/liquid', branch: 'gh-pages', dest: liquid()}, cb);
});

gulp.task('delete', function(cb) {
  del.sync(fixtures());
  cb();
});

gulp.task('default', ['delete', 'markdown', 'html']);

