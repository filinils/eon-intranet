var gulp = require('gulp'),
	path = require('path'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	svgstore = require('gulp-svgstore'),
	helpers = require('../helpers'),
	config = require('../config');

gulp.task('svg', function() {
	var pathIn = path.join(config.currentSite.root, config.currentSite.dirs.images.in, '**', '*.svg');
		pathOut = path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root, config.currentSite.dirs.images.out);

	return gulp.src(pathIn)
		.pipe(plumber(helpers.onError))
		.pipe(changed(pathOut))
		.pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon-', inlineSvg: true }))
		.pipe(gulp.dest(pathOut))
		// .pipe(gulp.dest(path.join(dirs.dist, currentSite.dirs.images)));
});