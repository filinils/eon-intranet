/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('wikilinks');

	tinymce.create('tinymce.plugins.WikilinksPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init: function(ed, url) {
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceWikilinks');
			ed.addCommand('mceWikilinks', function() {

				var se = ed.selection;

				// No selection and not in link
				if (se.isCollapsed() && !ed.dom.getParent(se.getNode(), 'A'))
					return;

				// Added by NetRelations for Wikilink plugin compatibility
				if(ed.dom.getParent(se.getNode(), 'A') && !$(se.getNode()).hasClass('wikilink'))
					return;

				ed.windowManager.open({
					file: url + '/dialog.htm',
					width: 320 + ed.getLang('wikilinks.delta_width', 0),
					height: 300 + ed.getLang('wikilinks.delta_height', 0),
					inline: 1
				},
				{
					plugin_url: url
				});
			});

			// Register wikilinks button
			ed.addButton('wikilinks', {
				title: 'wikilinks.desc',
				cmd: 'mceWikilinks',
				image: url + '/img/wikilinks.gif'
			});

			// Add a node change handler, selects the button in the UI when an image is selected
			ed.onNodeChange.add(function(ed, cm, n, co) {
				cm.setDisabled('wikilinks', co && n.nodeName != 'A' && !$(n).hasClass('wikilink'));
				cm.setActive('wikilinks', n.nodeName == 'A' && $(n).hasClass('wikilink'));
			});

		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use in order to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl: function(n, cm) {
			return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo: function() {
			return {
				longname: 'Wikilinks plugin',
				author: 'NetRelations',
				authorurl: 'http://www.netrelations.se/',
				infourl: '',
				version: "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('wikilinks', tinymce.plugins.WikilinksPlugin);
})();
