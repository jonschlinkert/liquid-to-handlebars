'use strict';

const del = require('delete');
const path = require('path');
const gulp = require('gulp');
const clone = require('gh-clone');
const through = require('through2');
const isBinary = require('file-is-binary');
const converter = require('./');

const expected = path.resolve.bind(path, __dirname, 'test/expected');
const fixtures = path.resolve.bind(path, __dirname, 'test/fixtures');
const liquid = path.resolve.bind(path, __dirname, 'vendor/liquid');

function convert(options) {
  return through.obj(function(file, enc, next) {
    if (!file.isNull() && !isBinary(file)) {
      file.contents = new Buffer(converter(file.contents.toString(), options));
    }
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

gulp.task('liquid', function() {
  return clone({repo: 'Shopify/liquid', branch: 'gh-pages', dest: liquid()});
});

gulp.task('copy', function(cb) {
  return gulp.src('**/*.{html,md}', {cwd: liquid()})
    .pipe(gulp.dest(fixtures()));
});

gulp.task('delete', async () => {
  await del(fixtures());
  await del(expected());
});

gulp.task('default', ['delete', 'copy', 'markdown', 'html']);

