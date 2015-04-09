var gulp = require('gulp'),
	path = require('path'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	helpers = require('../helpers'),
	config = require('../config');

gulp.task('fonts', function() {
	var pathIn = path.join(config.currentSite.root, config.currentSite.dirs.fonts.in, '**', '*.*');
		pathOut = path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root, config.currentSite.dirs.fonts.out);

	return gulp.src(pathIn)
		.pipe(plumber(helpers.onError))
		.pipe(changed(pathOut))
		.pipe(gulp.dest(pathOut));
});