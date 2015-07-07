/*
* Written by NetRelations
*/
(function ($) {
	"use strict";
	var methods = {
		init: function () {

			return this.each(function () {
				var self = $(this);
				var collaps = self.next();

				if (!collaps.attr('aria-hidden')) {
					collaps.attr('aria-hidden', 'false');
				}
				// Add close button
				var button = $('<button>').attr({
					'class': 'collapsable-button open',
					'aria-expanded': 'true'
				}).html(self.data('collapsable-text'));

				self.append(button);

				// Check if it is closed or opened when initated
				if (self.data('collapsed') === 'collapsed') {
					collaps.hide();
					button.removeClass('open').attr('aria-expanded', 'false');

					var hash = window.location.hash;

					if (hash === '#' + self.attr('id')) {
						collaps.addClass('animated');
						button.addClass('open').attr('aria-expanded', 'true');

						// Load content with ajax?
						if (self.data('content-url')) {
							methods.ajaxLoad(self, collaps);
						}

						collaps.show();
					}
				}

				// Click event for the button
				button.bind('click', function (e) {
					$(this).toggleClass('open');

					if ($(this).hasClass('open')) {
						$(this).attr('aria-expanded', 'true');
					} else {
						$(this).attr('aria-expanded', 'false');
					}

					// Stop the POST event (just in case)
					e.preventDefault();

					var closeEffect = null;
					var postBackURL = null;
					var maxHeight = null;

					// data-attribute override of the close effect?
					if (self.data('close-effect')) {
						closeEffect = self.data('close-effect');
					}

					// data-attribute override of the postback URL?
					if (self.data('postback-url')) {
						postBackURL = self.data('postback-url');
					}

					// data-attribute override max-height?
					if (self.data('max-height')) {
						maxHeight = self.data('max-height');
						collaps.css("max-height", maxHeight + 'px');
						collaps.css("overflow", 'auto');
					}

					// Load content with ajax?
					if (self.data('content-url')) {
						if (collaps.hasClass('animated')) {
							button.spin();
							methods.ajaxLoad(self, collaps);
							button.spin(false);
						}
					}

					if (collaps.is(':visible')) {
						collaps.attr('aria-hidden', 'false');
						collaps.slideUp({
									duration: 450,
									easing: "easeInCubic"
								});
					} else {
						collaps.attr('aria-hidden', 'true');
						collaps.slideDown({
									duration: 450,
									easing: "easeOutCubic"
								});
					}

					// Using "data-postback-url"
					if (postBackURL !== null) {
						$.ajax({
							type: 'POST',
							cache: false,
							async: false,
							url: postBackURL,
							success: function (data) {
							}
						});
					}
				});
			});
		},
		ajaxLoad: function (self, collaps) {
			if (collaps.data("content-loaded" !== "true")) {
				$.ajax({
					type: 'GET',
					cache: true,
					url: self.data('content-url'),
					success: function (data) {
						if (data !== '') {
							collaps.html(data);
							collaps.data("content-loaded", "true");
						}
					},
					error: function () {
						collaps.html("Kunde inte ladda \'" + self.data('content-url') + "\'!");
					}
				});
			}
		},
		collaps: function(){
			return this.each(function () {
				var self = $(this);
				var collaps = self.next();
				collaps.hide();
				self.find('.collapsable-button').first().removeClass('open').attr('aria-expanded', 'false');				
			});
		}
	};

	$.fn.collapsable = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.collapsable');
		}
	};	
})(jQuery);