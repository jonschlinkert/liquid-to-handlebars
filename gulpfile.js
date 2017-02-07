'use strict';

var del = require('delete');
var path = require('path');
var gulp = require('gulp');
var clone = require('gh-clone');
var extname = require('gulp-extname');
var vfs = require('vinyl-fs');
var pipeline = require('./lib/pipeline');

var fixtures = path.resolve.bind(path, __dirname, 'test/fixtures');
var liquid = path.resolve.bind(path, __dirname, 'vendor/liquid');

gulp.task('markdown', function() {
  return vfs.src('**/*.md', {cwd: liquid()})
    .pipe(pipeline.converter())
    .pipe(vfs.dest(fixtures()));
});

gulp.task('html', function() {
  return vfs.src('**/*.html', {cwd: liquid()})
    .pipe(pipeline.converter())
    .pipe(extname('.hbs'))
    .pipe(vfs.dest(fixtures()));
});

gulp.task('liquid', function(cb) {
  clone({repo: 'Shopify/liquid', branch: 'gh-pages', dest: liquid()}, cb);
});

gulp.task('delete', function(cb) {
  del.sync(fixtures());
  cb();
});

gulp.task('default', ['delete', 'markdown', 'html']);

