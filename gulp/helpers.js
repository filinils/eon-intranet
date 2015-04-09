var config = require('./config');
var util = require('gulp-util');

module.exports = {
	setCurrentSite: function( site ){
		// Set currentSite to the first one in settings
		config.currentSite = config.sites[0];

		// If "gulp --site some-site-id" set as current
		if (site) {
			config.sites.some(function(el, index, array) {
				if (el.id == site || el.root == site){
					config.currentSite = el;
					return true;
				}
				return false;
			});
		}
	},

	onError: function(error) {
		util.beep();
		util.log(util.colors.bold.red(error));
		this.emit('end');
	}

}