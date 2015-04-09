var gulp = require('gulp');

gulp.task('build', ['images', 'svg', 'browserify', 'browserify-styleguide', 'jshint', 'fonts', 'styles', 'swig'/*, 'html'*/]);