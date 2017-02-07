'use strict';

var del = require('delete');
var path = require('path');
var gulp = require('gulp');
var clone = require('gh-clone');
var through = require('through2');
var converter = require('./');

var expected = path.resolve.bind(path, __dirname, 'test/expected');
var fixtures = path.resolve.bind(path, __dirname, 'test/fixtures');
var liquid = path.resolve.bind(path, __dirname, 'vendor/liquid');

function convert(options) {
  return through.obj(function(file, enc, next) {
    file.contents = new Buffer(converter(file.contents.toString(), options));
    next(null, file);
  });
}

gulp.task('markdown', function() {
  return gulp.src('**/*.md', {cwd: liquid()})
    .pipe(convert())
    .pipe(gulp.dest(expected()));
});

gulp.task('html', function() {
  return gulp.src('**/*.html', {cwd: liquid()})
    .pipe(convert())
    .pipe(gulp.dest(expected()));
});

gulp.task('liquid', function(cb) {
  clone({repo: 'Shopify/liquid', branch: 'gh-pages', dest: liquid()}, cb);
});

gulp.task('copy', function(cb) {
  return gulp.src('**/*.{html,md}', {cwd: liquid()})
    .pipe(gulp.dest(fixtures()));
});

gulp.task('delete', function(cb) {
  del.sync(fixtures());
  del.sync(expected());
  cb();
});

gulp.task('default', ['delete', 'copy', 'markdown', 'html']);

