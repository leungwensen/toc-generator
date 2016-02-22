/**
 * Created by liangwensen on 1/26/16.
 */
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');

var pkg = require('../package.json');

gulp.task('less', function () {
    gulp.src(path.resolve(__dirname, '../src/index.less'))
        .pipe(less({
            compress: true
        }))
        .pipe(rename({
            basename: pkg.name
        }))
        .pipe(gulp.dest(path.resolve(__dirname, '../dist/')));
});
