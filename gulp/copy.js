/**
 * Created by liangwensen on 1/26/16.
 */
var gulp = require('gulp');
var path = require('path');

gulp.task('copy', function () {
    gulp.src([
            path.resolve(__dirname, '../node_modules/marked-plus-renderer/dist/libs.css'),
            path.resolve(__dirname, '../node_modules/marked-plus-renderer/dist/libs.js'),
            path.resolve(__dirname, '../node_modules/marked-plus-renderer/dist/renderer.js'),
            path.resolve(__dirname, '../node_modules/marked-plus-renderer/doc/features.md')
        ])
        .pipe(gulp.dest(path.resolve(__dirname, '../lib/marked-plus-renderer/')));
    gulp.src([
            path.resolve(__dirname, '../node_modules/marked-plus-renderer/dist/fonts/*')
        ])
        .pipe(gulp.dest(path.resolve(__dirname, '../lib/marked-plus-renderer/fonts/')));
    gulp.src([
            path.resolve(__dirname, '../node_modules/marked-plus-renderer/demo/features/*')
        ])
        .pipe(gulp.dest(path.resolve(__dirname, '../demo/features/')));
});
