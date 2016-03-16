/**
 * Created by liangwensen on 1/26/16.
 */

var gulp = require('gulp');
var watch = require('gulp-watch');
var path = require('path');

gulp.task('watch', function (done) {
    watch([
        path.resolve(__dirname, '../src/**/*.html'),
        path.resolve(__dirname, '../src/**/*.ztpl'),
    ], function () {
        gulp.start('template');
    });
});

