var	gulp = require('gulp'),
	path = require('path'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	swig = require('gulp-swig'),
	helpers = require('../helpers'),
	config = require('../config');


gulp.task('swig', function () {
	return gulp.src(path.join(config.currentSite.root, '*.html'))
		.pipe(plumber(helpers.onError))
		.pipe(changed(path.join(config.dirs.build.root, config.dirs.build.devFolder)))
		.pipe(swig({ 
			defaults: {
				cache: false
			}
		}))
		.pipe(gulp.dest(path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root)));
});