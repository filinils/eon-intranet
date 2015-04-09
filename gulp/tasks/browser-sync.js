var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var util = require('gulp-util');
var config = require('../config');

gulp.task('browser-sync', ['build'], function() {
	browserSync({
		server: {
			baseDir: [ path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root),
						 /*config.currentSite.root, config.dirs.foundation.sass */
						 config.dirs.bower_components
					 ]
		},
		port: config.currentSite.port
	});
});
