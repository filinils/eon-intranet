var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var config = require('../config');

gulp.task('watch', function() {
	gulp.watch(path.join(config.currentSite.root, '**', '*.scss'), ['styles']);
	gulp.watch(path.join(config.currentSite.root, '**', '*.js'), ['browserify', 'browserify-styleguide', 'jshint', browserSync.reload]);
	gulp.watch(path.join(config.currentSite.root, '**', '*.{png,jpg,jpeg,gif,svg}'), ['images', browserSync.reload]);
	gulp.watch(path.join(config.currentSite.root, '**', '*.svg'), ['svg', browserSync.reload]);
	gulp.watch(path.join(config.currentSite.root, '**', '*.html'), ['swig', browserSync.reload]);
});
