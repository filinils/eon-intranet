/**
 * @author NetRelations
 * @copyright Copyright © NetRelations of Scandinavia AB, All rights reserved.
 */

(function() {
	tinymce.PluginManager.requireLangPack('netrimage');
	tinymce.create('tinymce.plugins.NetRImagePlugin', {
		init : function(ed, url) {
			// Register commands
			ed.addCommand('NetRImage', function() {
				// Internal image object like a flash placeholder
				if (ed.dom.getAttrib(ed.selection.getNode(), 'class').indexOf('mceItem') != -1)
					return;
				ed.windowManager.open({
					file : url + '/image.htm',
					width : 480 + parseInt(ed.getLang('netrimage.delta_width', 0), 10),
					height : 400 + parseInt(ed.getLang('netrimage.delta_height', 0), 10),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('image', {
				title : 'netrimage.image_desc',
				cmd : 'NetRImage'
			});
		},

		getInfo : function() {
			return {
				longname : 'NetR image',
				author : 'NetRelations of Scandinavia AB',
				authorurl : 'http://www.netrelations.se/',
				infourl : 'http://www.netrelations.se/',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('netrimage', tinymce.plugins.NetRImagePlugin);
})();