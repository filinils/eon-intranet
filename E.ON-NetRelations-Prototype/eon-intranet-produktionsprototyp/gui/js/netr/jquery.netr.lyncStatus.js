/* 
* Written by NetRelations
*/
(function ($) {
	"use strict";
	$.extend({
		lyncStatus: function  (opt) {
			var defaults = {
				hideSipIfMissingLync: true,
				hideLyncHoverWindow: false,
				dataFieldName: "lync-email"
			};
			lyncOptions = $.extend(defaults, opt);

			if (lyncOptions.dataFieldName.toLowerCase().indexOf('data-') === 0) {
				lyncOptions.dataFieldName = lyncOptions.dataFieldName.substring(5);
			}

			try {
				if (window.ActiveXObject) {
					lyncControl = new ActiveXObject("Name.NameCtrl");

				} else {
					lyncControl = methods.createNPApiOnWindowsPlugin("application/x-sharepoint-uc");
				}
				lyncControl.OnStatusChange = methods.onLyncPresenceStatusChange;
			}
			catch (ex) { lyncControl = null; }

			if(lyncControl !== null){
				$('[data-' + lyncOptions.dataFieldName + ']').each(function () {
					methods.initLyncUser($(this));
				});
			}else{
				if(lyncOptions.hideSipIfMissingLync){
					// hide all hrefs containing "sip"
					$('a[href^="sip:"]').hide();
				}
			}
		}
	});

	var methods = {		
		isSupportedNPApiBrowserOnWin: function() {
			return true;
		},
		isNPAPIOnWinPluginInstalled: function(a) {
			return Boolean(navigator.mimeTypes) && navigator.mimeTypes[a] && navigator.mimeTypes[a].enabledPlugin;
		},
		createNPApiOnWindowsPlugin: function(b) {
			var c = null;
			if (methods.isSupportedNPApiBrowserOnWin())
				try {
					c = document.getElementById(b);
					if (!Boolean(c) && methods.isNPAPIOnWinPluginInstalled(b)) {
						var a = document.createElement("object");
						a.id = b;
						a.type = b;
						a.width = "0";
						a.height = "0";
						a.style.setProperty("visibility", "hidden", "");
						document.body.appendChild(a);
						c = document.getElementById(b);
					}
				} catch (d) {
					c = null;
				}
			return c;
		},		
		initLyncUser: function(user) {
			var email = user.data(lyncOptions.dataFieldName);
			
			user.on('mouseover', function () {
				methods.showLyncPresencePopup(user);
			});
			user.on('mouseout', function () {
				lyncControl.HideOOUI();
			});
			
			if (lyncControl) {
				lyncControl.GetStatus(email, 'users');
			}
		},		
		getLyncPresenceString: function(status) {
			switch (status) {
				case 0:
					return 'lync-status-available';
				case 1:
					return 'lync-status-offline';
				case 2:
				case 4:
				case 16:
					return 'lync-status-away';
				case 3:
				case 5:
					return 'lync-status-inacall';
				case 6:
				case 7:
				case 8:
				case 10:
					return 'lync-status-busy';
				case 9:
				case 15:
					return 'lync-status-donotdisturb';
				default:
					return '';
			}
		},
		onLyncPresenceStatusChange: function(email, status) {
			$('[data-' + lyncOptions.dataFieldName + '="' + email + '"]').removeClass("lync-status-available lync-status-offline lync-status-busy lync-status-away lync-status-donotdisturb lync-status-inacall").addClass(methods.getLyncPresenceString(status));
		},
		showLyncPresencePopup: function(user) {
			if(!lyncOptions.hideLyncHoverWindow){
				var x = user.position().left - $(window).scrollLeft();
				var y = user.position().top - $(window).scrollTop();
				
				lyncControl.ShowOOUI(user.data(lyncOptions.dataFieldName), 0, x, y);
			}
		}
	};

	var lyncControl = null;
	var lyncOptions = null;
})(jQuery);