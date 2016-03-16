/**
 * Created by liangwensen on 1/20/16.
 */
var gulp = require('gulp');
var compileTemplate = require('gulp-ztpl-compiler');
var path = require('path');

gulp.task('ztpl', function () {
    return gulp.src([
            path.resolve(__dirname, '../src/**/*.html'),
            path.resolve(__dirname, '../src/**/*.ztpl')
        ])
        .pipe(compileTemplate({
            template: 'esnext'
        }))
        .pipe(gulp.dest(path.resolve(__dirname, '../src/')));
});
