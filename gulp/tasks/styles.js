var gulp = require('gulp'),
	path = require('path'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	autoprefixer = require('gulp-autoprefixer'),
	base64 = require('gulp-base64'),
	helpers = require('../helpers'),
	config = require('../config');

gulp.task('styles', ['fonts', 'images', 'svg'], function() {
	return gulp.src(path.join(config.currentSite.root, config.currentSite.dirs.styles.in, '*.scss'))
		.pipe(plumber(helpers.onError))
		//.pipe(plugins.sourcemaps.init())
		.pipe(sass({ sourceComments: 'map', includePaths : [ config.dirs.bower_components, path.join(config.currentSite.root) ] }))
		//.pipe(plugins.sourcemaps.write('.'))
		.pipe(autoprefixer())
		.pipe(base64({
			debug: true
		}))
		.pipe(gulp.dest(path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root, config.currentSite.dirs.styles.out)))
		//minify here
		// .pipe(gulp.dest(path.join(dirs.dist, currentSite.dirs.styles)))
		.pipe(browserSync.reload({stream: true}));
});