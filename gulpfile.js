'use strict';

var highlight = require('./lib/highlight');
var converter = require('./lib/converter');
var extname = require('gulp-extname');
var gulp = require('gulp');

gulp.task('html', function () {
  return gulp.src('vendor/bootstrap-blog/**/*.html')
    .pipe(converter())
    .pipe(extname('.hbs'))
    .pipe(gulp.dest('src/'));
});

gulp.task('md', function () {
  return gulp.src('vendor/bootstrap-blog/**/*.md')
    .pipe(highlight())
    .pipe(gulp.dest('src/'));
});

gulp.task('copy', function () {
  return gulp.src(['vendor/bootstrap-blog/**', '!vendor/bootstrap-blog/**/*.html'])
    .pipe(gulp.dest('src/'))
});

gulp.task('default', ['html', 'md']);

