/*
* Written by NetRelations
*/
(function ($) {
	"use strict";
	var methods = {
		init: function (options) {
			var defaults = {
				layout: null
			};
			settings = $.extend(defaults, options);

			return this.each(function () {

				var self = $(this);

				// The content container
				var content = null;

				// Add WAI-ARIA roles
				self.attr({
					'aria-haspopup':'true',
					'aria-expanded':'false'
				});

				if (self.data('layout')) {
					settings.layout = self.data('layout');
				}

				// If a content container is defined use it, else create a new div
				if ($(document).find('.infobox-likes').length === 0) {
					content = $('<div>').attr({
						'class': 'infobox-likes'
					});
					$('body').append(content);
				} else {
					content = $(document).find('.infobox-likes');
				}

				self.bind('click', function (e) {

					// Stop the LINK event if JS is active
					e.preventDefault();

					// Has the type changed?
					if (self.data('layout')) {
						settings.layout = self.data('layout');
					} else {
						settings.layout = null;
					}


					// If there is a Ajax content URL defined load content
					//if (self.data("content-loaded") !== 'true') {
						if (self.data('content-url')) {
							$.ajax({
								type: 'GET',
								cache: false,
								async: false,
								url: self.data('content-url'),
								success: function (data) {
									if (data !== '') {
										content.html(data);
									}
								},
								error: function () {
									content.html("Kunde inte ladda \'" + self.data('content-url') + "\'!");
								}
							});
						}else{
							content.html("\'data-content-url\' attribut saknas");
						}
						self.data("content-loaded", "true");
					//}

					// Handle click on self
					if(self.hasClass("active-bottom") || self.hasClass("active-top")){
						if(self.hasClass("active-bottom")){
							self.removeClass("active-bottom").attr("aria-expanded", "false");
						}
						if(self.hasClass("active-top")){
							self.removeClass("active-top").attr("aria-expanded", "false");
						}	
						content.hide().attr("aria-hidden", "true");
						return;
					}else{
						content.show().attr("aria-hidden", "false");
					}

					// Content is needed.
					if (content !== null) {
						content.show().attr({
							"aria-hidden": "false",
							"role": "tooltip"
						});
						methods.place(content, self);
					}
				});

				// Adjust for screen resizing
				$(window).resize(function () {
					if (self.data('layout')) {
						settings.layout = self.data('layout');
					} else {
						settings.layout = null;
					}
					if(self.hasClass("active-bottom") || self.hasClass("active-top")){
						methods.place(content, self);
					}
				});

				// Make sure closing the likes box when scrolling the div.
				self.parent().parent().parent().parent().parent().parent().scroll(function () {
					if(self.hasClass("active-bottom")){
						self.removeClass("active-bottom").attr("aria-expanded", "false");
					}
					if(self.hasClass("active-top")){
						self.removeClass("active-top").attr("aria-expanded", "false");
					}
					content.hide().attr("aria-hidden", "true");
				});

				// Make sure closing the likes box only when clicking outside it.
				$(document).mouseup(function (e) {
					if (content.has(e.target).length === 0 && !self.is(e.target)) {
						if(self.hasClass("active-bottom")){
							self.removeClass("active-bottom").attr("aria-expanded", "false");
						}
						if(self.hasClass("active-top")){
							self.removeClass("active-top").attr("aria-expanded", "false");
						}
						content.hide().attr("aria-hidden", "true");
					}
				});

				// Handle tap on touch devices
				$(document).hammer().on("tap", function(e) {
					if (content.has(e.target).length === 0 && !self.is(e.target)) {
						if(self.hasClass("active-bottom")){
							self.removeClass("active-bottom").attr("aria-expanded", "false");
						}
						if(self.hasClass("active-top")){
							self.removeClass("active-top").attr("aria-expanded", "false");
						}
						content.hide().attr("aria-hidden", "true");
					}
				});

				// Close likes box on "esc"
				$(document).keyup(function (e) {
					if (e.keyCode === 27) {
						if(self.hasClass("active-bottom")){
							self.removeClass("active-bottom").attr("aria-expanded", "false");
						}
						if(self.hasClass("active-top")){
							self.removeClass("active-top").attr("aria-expanded", "false");
						}
						content.hide().attr("aria-hidden", "true");
					}
				});
			});
		},
		show: function(){

			var self = $(this);

			// The content container
			var content = null;

			// Has the type changed?
			if (self.data('layout')) {
				settings.layout = self.data('layout');
			} else {
				settings.layout = null;
			}

			// If a content container is defined use it, else create a new div
			if ($(document).find('.infobox-likes').length === 0) {
				content = $('<div>').attr({
					'class': 'infobox-likes'
				});

				$('body').append(content);
			} else {
				content = $(document).find('.infobox-likes');						
			}

			// If there is a Ajax content URL defined load content
			//if (self.data("content-loaded") !== 'true') {
				if (self.data('content-url')) {
					$.ajax({
						type: 'GET',
						cache: false,
						async: false,
						url: self.data('content-url'),
						success: function (data) {
							if (data !== '') {
								content.html(data);
							}
						},
						error: function () {
							content.html("Kunde inte ladda \'" + self.data('content-url') + "\'!");
						}
					});
				}else{
					content.html("\'data-content-url\' attribut saknas");
				}
				self.data("content-loaded", "true");
			//}

			// Content is needed.
			if (content !== null) {
				content.show().attr({
					"aria-hidden": "false",
					"role": "tooltip"
				});
				methods.place(content, self);
			}
		},
		hide: function(){

			var self = $(this);

			// The content container
			var content = $(document).find('.infobox-likes');

			if(self.hasClass("active-bottom")){
				self.removeClass("active-bottom").attr("aria-expanded", "false");
			}
			if(self.hasClass("active-top")){
				self.removeClass("active-top").attr("aria-expanded", "false");
			}

			content.hide().attr("aria-hidden", "true");

		},
		place: function (content, self) {
			var offsetTop = 5;

			if(self.hasClass("active-bottom")){
				self.removeClass("active-bottom").attr("aria-expanded", "false");
			}
			if(self.hasClass("active-top")){
				self.removeClass("active-top").attr("aria-expanded", "false");
			}

			if (settings.layout === 'inline') {
				content.css("position", "static");
				content.addClass("infobox-inline").attr("aria-expanded", "true");
			} else {
				content.css("position", "absolute");
				if(content.hasClass("infobox-inline")){
					content.removeClass("infobox-inline").attr("aria-expanded", "false");
				}
			}

			// Can this be solved better?
			if(self.parent().parent().parent().parent().parent().parent().hasClass('scrollable')){
				offsetTop = 7;			
			}

			// Verify so that the likes box is not outside the top of the document
			if($(window).scrollTop() > (self.offset().top - content.outerHeight() - offsetTop - 10)){
				settings.layout = 'bottom';
			}
			if (settings.layout === 'bottom') {
				self.addClass('active-bottom').attr("aria-expanded", "true");
				content.css("top", self.offset().top + self.outerHeight() + 7);
				content.css("left", self.offset().left);
			}else{
				self.addClass('active-top').attr("aria-expanded", "true");
				content.css("top", self.offset().top - content.outerHeight() - offsetTop);
				content.css("left", self.offset().left);
			}
			content.css("z-index", 1000);
		}
	};

	$.fn.likes = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.likes');
		}
	};	
	
	var settings = null;

})(jQuery);
