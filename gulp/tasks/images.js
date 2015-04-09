var gulp = require('gulp'),
	path = require('path'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	imagemin = require('gulp-imagemin'),
	helpers = require('../helpers'),
	config = require('../config');

gulp.task('images', function() {
	var pathIn = path.join(config.currentSite.root, config.currentSite.dirs.images.in, '**', '*.{png,jpg,jpeg,gif,svg}'),
		pathOut = path.join(config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root, config.currentSite.dirs.images.out);

	return gulp.src(pathIn)
		.pipe(plumber(helpers.onError))
		.pipe(changed(pathOut))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [ //some plugins break some images
				// {cleanupAttrs: false},
				// {removeDoctype: false},
				// {removeXMLProcInst: false},
				// {removeComments: false},
				// {removeMetadata: false},
				// {removeTitle: false},
				// {removeEditorsNSData: false},
				// {removeEmptyAttrs: false},
				// {removeHiddenElems: false},
				// {removeEmptyText: false},
				// {removeEmptyContainers: false},
				// {removeViewBox: false},
				// {cleanupEnableBackground: false},
				// {convertStyleToAttrs: false},
				// {convertColors: false},
				// {convertPathData: false},
				// {convertTransform: false},
				// {removeUnknownsAndDefaults: false},
				// {removeNonInheritableGroupAttrs: false},
				// {removeUselessStrokeAndFill: false},
				// {removeUnusedNS: false},
				// {cleanupIDs: false},
				// {cleanupNumericValues: false},
				// {moveElemsAttrsToGroup: false},
				// {moveGroupAttrsToElems: false},
				// {collapseGroups: false},
				// {removeRasterImages: false},
				// {mergePaths: false},
				// {convertShapeToPath: false},
				// {sortAttrs: false},
				// {transformsWithOnePath: false}
			]
		}))
		.pipe(gulp.dest(pathOut))
		// .pipe(gulp.dest(path.join(dirs.dist, currentSite.dirs.images)));
});