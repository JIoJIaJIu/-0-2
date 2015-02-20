var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var path = require('path');

var OUTPUT = 'build';

gulp.task('default', ['prototype1', 'third-parties', 'build1']);
gulp.task('default2', ['prototype2']);

gulp.task('clean', function () {
    del(OUTPUT);
});

gulp.task('prototype1', ['clean'], function () {
    gulp.src('prototype1/**/*', {base: 'prototype1'})
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('prototype2', ['clean'], function () {
    gulp.src('prototype2/**/*', {base: 'prototype2'})
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('third-parties', function () {
    gulp.src('src/third-parties/*')
        .pipe(gulp.dest(path.join(OUTPUT, 'js')) );
});

gulp.task('build1', function () {
    gulp.src(['src/config.js', 'src/services/**/*', 'src/controllersForPrototype1/**/*'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('watch1', ['default'], function () {
    gulp.watch(['src/config.js', 'src/services/**/*', 'src/controllersForPrototype1/**/*'], ['build1']);
});
