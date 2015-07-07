/*
* Written by NetRelations
*/
(function ($) {
	"use strict";
	var methods = {
		init: function () {

			var self = $(this);

			// Add WAI-ARIA roles
			self.attr({
				'aria-haspopup':'true',
				'aria-expanded':'false'
			});
			self.next().attr({
				'aria-hidden':'true'
			});

			if (self.data('layout')) {
				layout = self.data('layout');
			}

			// The content container
			var content = $('.nav-user');

			self.bind('click', function (e) {
				
				// Handle click on self
				if(self.data('content-show') === 'true'){
					self.data("content-show", "");
					self.removeClass("active-bottom").attr("aria-expanded", "false");
					content.hide().attr("aria-hidden", "true");
					return;
				}

				// Stop the LINK event if JS is active
				e.preventDefault();

				// Has the type changed?
				if (self.data('layout')) {
					layout = self.data('layout');
				} else {
					layout = null;
				}

				if (!self.data('outerWidth')) {
					self.data('outerWidth', content.outerWidth());
				}

				if (!self.data('outerHeight')) {
					self.data('outerHeight', content.outerHeight());
				}

				if (layout === 'narrow') {
					content.css({
						'position': 'absolute',
						'width': $(window).width() - 20
					});
				} else {
					content.css({
						'position': 'absolute',
						'width': self.data('outerWidth')
					});
				}			

				methods.place(content, self);
				self.data("content-show", "true");
				content.show().attr("aria-hidden", "false");
			});
				

			// Adjust for screen resizing
			$(window).resize(function () {
				if (self.data('layout')) {
					layout = self.data('layout');
				} else {
					layout = null;
				}
				if(self.data("content-show")){
					methods.place(content, self);
				}
			});

			// Make sure closing the userDetails only when clicking outside it.
			$(document).click(function (e) {
				if (self.data('content-show') === 'true' && content.has(e.target).length === 0 && self.is(e.target) === false && self.has(e.target).length === 0)  {
					self.removeClass("active-bottom").attr("aria-expanded", "false");
					self.data("content-show", "");
					content.hide().attr("aria-hidden", "true");
				}
			});
			
			// Handle tap on touch devices
			$(document).hammer().on("tap", function(e) {
				if (self.data('content-show') === 'true' && content.has(e.target).length === 0 && self.is(e.target) === false && self.has(e.target).length === 0)  {
					self.removeClass("active-bottom").attr("aria-expanded", "false");
					self.data("content-show", "");
					content.hide().attr("aria-hidden", "true");
				}
			});

			// Close userDetails on "esc"
			$(document).keyup(function (e) {
				if (e.keyCode === 27) {
					self.removeClass("active-bottom").attr("aria-expanded", "false");
					self.data("content-show", "");
					content.hide().attr("aria-hidden", "true");
				}
			});
		},
		place: function (content, self) {

			self.removeClass("active-bottom").attr("aria-expanded", "false");

			var diff,
				originalWidth = self.data('outerWidth');

			if (layout === 'narrow') {

				content.css({
					'position': 'absolute',
					'width': $(window).width() - 10
				});

				// Adjust left placement
				if (self.offset().left + (content.outerWidth()/2) > $(window).width()) {
					diff = $(window).width() - (self.offset().left + (content.outerWidth()/2) - 30);
					content.css("left", - (content.outerWidth()/2) + diff);
				} else {
					content.css("left", - (content.outerWidth()/2));
				}

			} else if (layout === 'medium') {

				content.css({
					'position': 'absolute',
					'width': originalWidth
				});

				// Adjust left placement
				if (self.offset().left + content.outerWidth() > $(window).width()) {
					diff = $(window).width() - (self.offset().left + (content.outerWidth()/2) - 20);
					content.css("left", - (content.outerWidth()/2) + diff);
				} else {
					content.css("left", 0);
				}

			} else {

				content.css({
					'position': 'absolute',
					'width': originalWidth
				});

				// Adjust left placement
				if (self.offset().left + content.outerWidth() > $(window).width()) {
					diff = $(window).width() - (self.offset().left + (content.outerWidth()/2) - 10);
					content.css("left", - (content.outerWidth()/2) + diff);
				} else {
					content.css("left", 0);
				}

			}

			content.css("top", self.outerHeight() + 6);
			self.addClass('active-bottom').attr("aria-expanded", "true");

			content.css("z-index", 1000);
		},
		hide: function(){
			var self = $(this);

			// The content container
			var content = $(document).find('.nav-user');

			self.removeClass("active-bottom").attr("aria-expanded", "false");
			self.data("content-show", "");
			content.hide().attr("aria-hidden", "true");			
		}
	};

	$.fn.userDetails = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.userDetails');
		}
	};	

	var layout = null;

})(jQuery);
