var gulp = require('gulp'),
    path = require('path'),
    flatten = require('gulp-flatten'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'), 
    swig = require('gulp-swig'),
    //fileInclude = require('gulp-file-include'),
    config = require('../config'),
    helpers = require('../helpers');

//directories
var d = {
	main: 'eon-main',
	assets: 'assets',
	src: 'src',
	comp: 'components',
	blocks: 'blocks',
	elem: 'elements',
	styles: 'styles',
	images: 'images',
	styleguide: 'eon-styleguide'
};

gulp.task('styleguide', [/*'styleguide-blocks',*/ 'styleguide-elements','styleguide-swig', 'styleguide-css', 'styleguide-images']);

gulp.task('styleguide-swig', function () {
	return gulp.src(path.join(d.main, d.src, d.comp, d.blocks, '**', '*.html'))
		.pipe(plumber(helpers.onError))
		.pipe(changed(path.join(config.dirs.build.root, config.dirs.build.devFolder)))
		.pipe(swig({ 
			defaults: {
				cache: false
			}
		}))
		.pipe(flatten())
		.pipe(gulp.dest(path.join('.', d.styleguide, d.src, d.comp, 'imported')));
});

//Copy all blocks from main
gulp.task('styleguide-blocks',  function() {
	return gulp.src(path.join(d.main, d.src, d.comp, d.blocks, '**', '*.html'))
		.pipe(flatten())
	    .pipe(gulp.dest(path.join('.', d.styleguide, d.src, d.comp, 'imported')))
});

//Copy all elements from main
gulp.task('styleguide-elements',  function() {
	return gulp.src(path.join(d.main, d.src, d.elem, '**', '*.html'))
		.pipe(flatten())
	    .pipe(gulp.dest(path.join('.', d.styleguide, d.src, d.comp, 'imported')))
});

//Copy all css files from Eon main
gulp.task('styleguide-css',  function() {
	return gulp.src(path.join(config.dirs.build.root, config.dirs.build.devFolder, d.main, d.assets ,d.styles, '**', '*.css'))
	    .pipe(gulp.dest(path.join(config.dirs.build.root, config.dirs.build.devFolder, d.styleguide, d.styles)))
});

//Copy all images from Eon main
gulp.task('styleguide-images',  function() {
	return gulp.src(path.join(config.dirs.build.root, config.dirs.build.devFolder, d.main, d.src, d.assets, d.images, '**', '*'))
	    .pipe(gulp.dest(path.join(config.dirs.build.root, config.dirs.build.devFolder, d.styleguide, d.src, d.images)))
});



