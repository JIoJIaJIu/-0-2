var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var path = require('path');

var OUTPUT = 'build';

gulp.task('default', ['desktop', 'third-parties', 'build1']);
gulp.task('default2', ['mobile']);

gulp.task('clean', function () {
    del(OUTPUT);
});

gulp.task('desktop', ['clean'], function () {
    gulp.src('desktop/**/*', {base: 'desktop'})
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('mobile', ['clean'], function () {
    gulp.src('mobile/**/*', {base: 'mobile'})
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
