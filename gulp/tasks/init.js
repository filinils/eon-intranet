var gulp = require('gulp');
var util = require('gulp-util');
var helpers = require('../helpers');

gulp.task('init', function(){
	helpers.setCurrentSite( util.env.site );
});