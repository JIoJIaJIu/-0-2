var gulp = require('gulp');
var del = require('del');
var path = require('path');

var OUTPUT = 'build';

gulp.task('default', ['prototype1']);
gulp.task('default2', ['prototype2']);

gulp.task('clean', function () {
    del(OUTPUT);
});

gulp.task('prototype1', ['clean'], function () {
    gulp.src('prototype1/**/*', {base: 'prototype1'})
        .pipe(gulp.dest(path.join(OUTPUT)) );
});

gulp.task('prototype2', ['clean'], function () {
    gulp.src('prototype2/**/*', {base: 'prototype2'})
        .pipe(gulp.dest(path.join(OUTPUT)) );
});

gulp.task('build', function () {
});
