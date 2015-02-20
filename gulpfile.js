var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var path = require('path');

var OUTPUT = 'build';

gulp.task('desktop', ['desktop prototype', 'build desktop']);
gulp.task('mobile', ['mobile prototype']);

gulp.task('clean', function () {
    del(OUTPUT);
});

gulp.task('desktop prototype', ['clean'], function () {
    gulp.src('desktop/**/*', {base: 'desktop'})
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('mobile prototype', ['clean'], function () {
    gulp.src('mobile/**/*', {base: 'mobile'})
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('build desktop', function () {
    gulp.src(['src/config.js', 'src/services/**/*', 'src/controllersForDesktop/**/*'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('watch1', ['default'], function () {
    gulp.watch(['src/config.js', 'src/services/**/*', 'src/controllersForDesktop/**/*'], ['build1']);
});
