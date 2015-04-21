module.exports = {
	// Global directories
	dirs: {
		build : {
			root : '_build',
			devFolder : 'develop',
			prdFolder : 'production'
		},
		bower_components : 'bower_components',
		foundation : {
			sass : 'bower_components/foundation/scss'
		}
	},

	// Sites config
	sites: [
		{
			id : 'main',
			root : 'eon-main',
			port : 8000,
			dirs : {
				scripts: {
					in: 'src/assets/scripts',
					out: 'gui/js'
				},
				styles: {
					in: 'src/assets/styles',
					out: 'gui/css'
				},
				images: {
					in: 'src/assets/images',
					out: 'gui/i'
				},
				fonts: {
					in: 'src/assets/fonts',
					out: 'gui/fonts'
				}
			},
			/* Deploy config
			 * Run 'gulp deploy' to upload a fresh build to SFTP
			 * You must check out Git branch specified in buildFrom option
			 */
			deploy: {
				develop : {
					sftp : {
						host: 'eon.share.ottoboni.se',
						remotePath: '/home/eon/public_html/eon-se/develop',
						auth: 'keyMain'
					}
				},
				master : {
					sftp : {
						host: 'eon.share.ottoboni.se',
						remotePath: '/home/eon/public_html/eon-se/master',
						auth: 'keyMain'
					}
				}
			}
		},
		{
			id : 'styleguide',
			root : 'eon-styleguide',
			port : 8001,
			dirs : {
				scripts: {
					in: 'src/scripts',
					out: 'scripts'
				},
				styles: {
					in: 'src/styles',
					out: 'styles'
				},
				images: {
					in: 'src/images',
					out: 'images'
				},
				fonts: {
					in: 'src/fonts',
					out: 'fonts'
				}
			},
			/* Deploy config
			 * Run 'gulp deploy' to upload a fresh build to SFTP
			 * You must check out Git branch specified in buildFrom option
			 */
			deploy: {
				develop : {
					sftp : {
						host: 'eon.share.ottoboni.se',
						remotePath: '/home/eon/public_html/eon-se/styleguide',
						auth: 'keyMain'
					}
				},
				master : {
					sftp : {
						host: 'eon.share.ottoboni.se',
						remotePath: '/home/eon/public_html/eon-se/styleguide',
						auth: 'keyMain'
					}
				}
			}
		}
	],

	/* Current site is set in init task */
	currentSite: null

}

