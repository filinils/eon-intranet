/*
* Written by NetRelations
*/
(function ($) {
	"use strict";
	var methods = {
		init: function () {
			return this.each(function () {
				var self = $(this);
				self.each(function () {
					if ($(this).data("render") === "iframe" && !$(this).parent().data("iframed")) {
						var w = $(this).data("width") ? $(this).data("width") : "100%";
						var link = $(this).parent().clone();
						link.children().first().removeAttr('data-render');
						link.children().first().removeAttr('data-width');
						link.children().first().removeAttr('data-height');
						var iframe = $("<iframe src=\"" + $(this).attr("href") + "\" frameborder=\"0\" width=\"" + w + "\" height=\"" + $(this).data("height") + "\" title=\"" + $(this).data("title") + "\">" + link.html() + "</iframe>");

						$(this).parent().prepend(iframe);
						$(this).parent().data("iframed", "true");
						$(this).hide();
					}
				});
			});
		},
		revert: function () {
			var self = $(this);
			self.each(function () {
				if ($(this).data("render") === "iframe" && $(this).parent().data("iframed")) {
					if ($(this).parent().data("iframed") === "true") {
						$(this).parent().find('iframe').hide();
						$(this).show();
					}
				}
			});
		},
		reload: function () {
			var self = $(this);
			self.each(function () {
				if ($(this).data("render") === "iframe" && $(this).parent().data("iframed")) {
					if ($(this).parent().data("iframed") === "true") {
						$(this).parent().find('iframe').show();
						$(this).hide();
					}
				}
			});
		}
	};

	$.fn.iframe = function (method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.iframe');
		}

	};

})(jQuery);