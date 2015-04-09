var gulp = require('gulp'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
    helpers = require('../helpers'),
    config = require('../config');

gulp.task('scripts', function () {
	return gulp.src(path.join(config.currentSite.root, '**', '*.js'))
		.pipe(plumber(helpers.onError))
		.pipe(changed(path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.dirs.scripts)))
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.on('error', function() {
        	beep();
      	});
		//.pipe(gulp.dest(path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.dirs.scripts)))
		//uglify and concat goes here if needed
		// .pipe(gulp.dest(path.join(dirs.dist, currentSite.dirs.scripts)));
});

