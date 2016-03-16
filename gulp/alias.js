/**
 * Created by liangwensen on 1/26/16.
 */
var gulp = require('gulp');

gulp.task('template', [
    'ztpl'
], function (done) {
    done();
});

gulp.task('build', [
    'pack'
], function (done) {
    done();
});

gulp.task('default', [
    'build',
    'watch',
    'dev'
], function (done) {
    done();
});

