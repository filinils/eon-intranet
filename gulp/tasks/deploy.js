var gulp = require('gulp'),
	path = require('path'),
	sftp = require('gulp-sftp'),
	git  = require('gulp-git'),
	util = require('gulp-util'),
	config = require('../config'),
	helpers = require('../helpers');


gulp.task('deploy', ['init', 'build'], function(){

	git.revParse({ args: '--abbrev-ref HEAD'}, function(err, currentBranch){
		if(err) {
			util.log(util.colors.bold.red( 'Error reading GIT HEAD'));
		}
		else {
			util.log(util.colors.bold.green( 'Deploying'));	
			if ( config.currentSite.deploy[currentBranch] ){
				gulp.src(path.join('.', config.dirs.build.root, config.dirs.build.devFolder, config.currentSite.root, '**', '*.*'))
					.pipe(sftp( config.currentSite.deploy[currentBranch].sftp ));
			}
			else {
				util.log(util.colors.bold.red( 'Can not deploy from this branch (' + currentBranch + ')'));
			}
		}
	});

});