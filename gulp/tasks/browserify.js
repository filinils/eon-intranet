var gulp = require('gulp');
var path = require('path');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var config = require('../config');


gulp.task('browserify', function(callback) {
	return browserify({
		entries: './eon-main/src/assets/scripts/app.js',
		paths: ['./node_modules','./eon-main/src/components', './eon-main/src/core/js'],
		//entries: path.join(config.currentSite.root, config.currentSite.dirs.scripts.in, 'app.js'),
		debug: true // Source map
	})
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest(path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root, config.currentSite.dirs.scripts.out)))
});

gulp.task('browserify-styleguide', function(callback) {
	return browserify({
		entries: './eon-styleguide/src/scripts/main.js',
		paths: ['./node_modules','./eon-styleguide/src/components', './eon-styleguide/src/core/js'],
		//entries: path.join(config.currentSite.root, config.currentSite.dirs.scripts.in, 'app.js'),
		debug: true // Source map
	})
		.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest(path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root, config.currentSite.dirs.scripts.out)))
});