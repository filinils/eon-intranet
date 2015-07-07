/*
* Written by NetRelations
*/

(function ($) {
	"use strict";
	var methods = {
		init: function () {
			return this.each(function () {
				var self = $(this);

				// The content container
				var megaContent = null;

				// Add open button
				var button = $('<button>').attr({
					'class': 'mega-button',
					'role': 'button',
					'aria-expanded': 'false',
					'aria-haspopup': 'true',
					'style': 'display:none'
				}).html(self.data('text-show'));

				button.insertAfter(self.children().first());

				button.next().attr('aria-hidden', 'true');
				megaContent = button.next();

				self.bind('click',function(e){
					if($('html').hasClass('touch')){
						e.preventDefault();
					}
				});

				button.bind('click', function (e) {

					if(megaContent.hasClass("infobox-inline")) {

						// Stop the LINK event if JS is active
						e.preventDefault();

						// Change button text
						if(button.html() === self.data('text-hide')){
							button.html(self.data('text-show'));
						}else{
							button.html(self.data('text-hide'));
						}

						// If same button is clicked, close submenu
						if (button.is(e.target)) {
							if (button.next().css('display') === 'block') {
								button.attr('aria-expanded', 'false').next().slideUp({
									duration: 200,
									easing: "easeInOutCirc"
								}).attr('aria-hidden', 'true');
								self.removeClass('active');
								$(document).focus();
								return;
							}
						}

						// This item does not have a submenu
						if (!button.next().is('.sub-menu')) {
							return;
						}

						self.addClass('active');

						button.attr('aria-expanded', 'true');
						megaContent.css("top", button.outerHeight() + 15).attr('aria-hidden', 'false');
						megaContent.slideDown({
							duration: 200,
							easing: "easeInOutCirc"
						});

						// If in compact mode scroll top top
						// if(self.parent().parent().hasClass('compact')){
						// 	$(document).scrollTop(self.offset().top-10);
						// }

					}
				});

				// Adjust for screen resizing
				$(window).resize(function () {
					// Adjust left placement
					if (button.offset().left + megaContent.outerWidth() > $(window).width()) {
						var diff = $(window).width() - (button.offset().left + megaContent.outerWidth() + 10);
						megaContent.css("left", button.position().left + diff);
					} else {
						megaContent.css("left", button.parent().position().left);
					}
				});

				// Click outside closes the submenu
				$(document).mouseup(function (e) {
					if (megaContent.has(e.target).length === 0 && !button.is(e.target)) {
						self.removeClass('active');
						megaContent.hide().attr('aria-hidden', 'true');
						button.attr('aria-expanded', 'false');
					}
				});

				// Handle tap on touch devices
				// $(document).hammer().on("tap", function(e) {
				// 	if (megaContent.has(e.target).length === 0 && !button.is(e.target)) {
				// 		self.removeClass('active');
				// 		megaContent.hide().attr('aria-hidden', 'true');
				// 		button.attr('aria-expanded', 'false');
				// 	}
				// });

				// Close submenu on "esc"
				$(document).keyup(function (e) {
					if (e.keyCode === 27) {
						self.removeClass('active');
						megaContent.hide().attr('aria-hidden', 'true');
						button.attr('aria-expanded', 'false');
					}
				});

				if(!megaContent.hasClass("infobox-inline")){
					button.parent().hoverIntent(hoverConfig);
				}else{
					button.show();
				}
			});
		},
		showMega: function(){
			var self = $(this);
			var button = $(this).find('.mega-button');

			if(!button.is(':visible')){

				// The content container
				var megaContent = self.find('.sub-menu');

				// Close all open submenus
				self.parent().find('.sub-menu').each(function () {
					$(this).attr('aria-hidden', 'true').parent().removeClass('active');
					$(this).hide();
				});

				self.addClass('active');

				megaContent.css("top", self.outerHeight() + 6).attr('aria-hidden', 'false');

				// Adjust left placement
				if (self.position().left + megaContent.outerWidth() > $(window).width()) {
					var diff = $(window).width() - (self.position().left + megaContent.outerWidth() + 10);
					megaContent.css("left", diff);
				} else {
					megaContent.css("left", 0);
				}

				megaContent.slideDown({
					duration: 200,
					easing: "easeInOutCirc"
				});
			}
		},
		hideMega: function(){
			var self = $(this);
			var button = $(this).find('.mega-button');

			if(!button.is(':visible')){

				self.removeClass('active');
				self.find('.sub-menu').hide().attr('aria-hidden', 'true');
			}
		},
		inline: function () {
			var self = $(this);
			self.each(function () {
				self.find('.sub-menu').each(function () {
					$(this).css("position", "static").addClass("infobox-inline");
					$(this).hide().attr('aria-hidden', 'true');
				});

				var button = $(this).find('.mega-button');
				if(button !== undefined){
					button.attr('aria-expanded', 'true');
					button.show();
				}
				self.removeClass('active');
			});

			self.unbind("mouseenter").unbind("mouseleave");
			self.removeProp('hoverIntent_t');
			self.removeProp('hoverIntent_s');
		},
		reset: function () {
			var self = $(this);
			self.each(function () {
				self.find('.sub-menu').each(function () {
					$(this).css("position", "absolute").removeClass("infobox-inline");
					$(this).hide().attr('aria-hidden', 'true');
				});

				var button = $(this).find('.mega-button');
				if(button !== undefined){
					button.attr('aria-expanded', 'false');
					button.hide();
				}
				self.removeClass('active');
			});
			self.hoverIntent(hoverConfig);
		},
		compact: function () {
			var self = $(this).parent().parent();
			if($('.compact-menu').length === 0){

				// Add button
				var button = $('<button>').attr({
					'class': 'compact-menu button',
					'role': 'button',
					'aria-expanded': 'false'
				}).html(self.data('text-show'));

				self.before(button);

				button.bind('click', function() {
					if($(this).html() === self.data('text-hide')){
					$('.compact-menu').removeClass('expanded');
						self.hide();
						$(this).html(self.data('text-show'));

						//Close all open submenus
						button.parent().parent().find('.sub-menu').each(function () {
							$(this).attr('aria-hidden', 'true').parent().removeClass('active');
							$(this).hide();
						});
					}else{
						self.slideDown({
							duration: 150,
							easing: "easeInCirc"
						});
						$(this).html(self.data('text-hide'));
						$('.compact-menu').addClass('expanded');
					}
				});
				self.css('width', $(window).width() - 20 + 'px');

			} else{
				$('.compact-menu').show();
			}

			self.removeClass('cf');
			self.addClass('compact');
			self.addClass('cf');
			self.hide();

			// Click outside closes the submenu
			$(document).mouseup(function (e) {
				if (self.has(e.target).length === 0 && !$('.compact-menu').is(e.target)) {
					self.hide();
					$('.compact-menu').html(self.data('text-show'));
				}
			});

			// Handle tap on touch devices
			// $(document).hammer().on("tap", function(e) {
			// 	if (self.has(e.target).length === 0 && !$('.compact-menu').is(e.target)) {
			// 		self.hide();
			// 		$('.compact-menu').html(self.data('text-show'));
			// 	}
			// });

			$(window).resize(function () {
				if($('.compact-menu').is(':visible')){
					self.css('width', $(window).width() - 20 + 'px');
				}
			});
		},
		decompact: function () {
			var self = $(this).parent().parent();
			$('.compact-menu').removeClass('expanded');
			$('.compact-menu').hide();
			$(document).unbind('mouseup');
			$(document).hammer().unbind('tap');
			self.removeClass('cf');
			self.removeClass('compact');
			self.addClass('cf');
			self.removeAttr('style');
			self.show();
		}
	};

	$.fn.megaMenu = function (method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.megaMenu');
		}

	};

	// HoverIntent Configuration
	var hoverConfig = {
		sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
		interval: 100, // number = milliseconds for onMouseOver polling interval
		over: methods.showMega, // function = onMouseOver callback (REQUIRED)
		timeout: 400, // number = milliseconds delay before onMouseOut
		out: methods.hideMega // function = onMouseOut callback (REQUIRED)
	};
})(jQuery);