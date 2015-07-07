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

				// Add WAI-ARIA roles
				self.attr({
					'role':'button',
					'aria-haspopup':'true',
					'aria-expanded':'false'
				});
				self.next().attr({
					'aria-hidden':'true'
				});

				if (self.data('layout')) {
					settings.layout = self.data('layout');
				}

				self.bind('click', function (e) {

					// The content container
					var content = null;

					// Stop the LINK event if JS is active
					e.preventDefault();

					// Has the type changed?
					if (self.data('layout')) {
						settings.layout = self.data('layout');
					} else {
						settings.layout = null;
					}

					// Get the content container
					content = $('#header .m-notifications');

					// Load the content
					methods.loadContent(content,self);

					// Adjust the layout
					if (settings.layout === 'narrow') {
						content.css({
							'position': 'absolute',
							'width': $(window).width() - 20
						});
						content.find('.m-c').css('max-height', ($(window).height() * 0.9) - 80);
					} else {
						content.css({
							'position': 'absolute',
							'width': self.data('outerHeight')
						});
						content.find('.m-c').css('max-height', self.data('outerHeight'));
					}

					// Handle click on self
					if(self.data("content-show")){
						self.data("content-show", "");
						if(self.hasClass("active-bottom")){
							self.removeClass("active-bottom").attr("aria-expanded", "false");
						}
						content.hide().attr("aria-hidden", "true");
						return;
					}else{
						self.data("content-show", "true");
						content.show().attr("aria-hidden", "false");
					}

					// Content is needed.
					if (content !== null) {
						methods.place(content, self);
						content.show().attr("aria-hidden", "false");

						var markAll = content.find('.mark-as-read');

						if(markAll !== null){
							markAll.bind('click', function (e) {
								e.preventDefault();

								// Call the service with info to mark all as read,
								// reset counter and remove classes on already loaded items
								$.ajax({
									type: 'GET',
									cache: false,
									async: true,
									url: markAll.data('content-url'),
									success: function (data) {
										if(data !== ''){
											var struct = self.find('span').first();
											self.html('0').append(struct);
											self.parent().removeClass("new-notifications");
										}
									}
								});
							});
						}
					}

					// Adjust for screen resizing
					$(window).resize(function () {
						if (self.data('layout')) {
							settings.layout = self.data('layout');
						} else {
							settings.layout = null;
						}
						if(self.data("content-show")){
							methods.place(content, self);
						}
					});

					// Make sure closing the Notification only when clicking outside it.
					$(document).mouseup(function (e) {
						if (content.has(e.target).length === 0 && !self.is(e.target)) {
							if(self.hasClass("active-bottom")){
								self.removeClass("active-bottom").attr("aria-expanded", "false");
							}
							self.data("content-show", "");
							content.hide().attr("aria-hidden", "true");
						}
					});

					// Handle tap on touch devices
					$(document).hammer().on("tap", function(e) {
						if (content.has(e.target).length === 0 && !self.is(e.target)) {
							if(self.hasClass("active-bottom")){
								self.removeClass("active-bottom").attr("aria-expanded", "false");
							}
							self.data("content-show", "");
							content.hide().attr("aria-hidden", "true");
						}
					});

					// Close Notification on "esc"
					$(document).keyup(function (e) {
						if (e.keyCode === 27) {
							if(self.hasClass("active-bottom")){
								self.removeClass("active-bottom").attr("aria-expanded", "false");
							}
							self.data("content-show", "");
							content.hide().attr("aria-hidden", "true");
						}
					});
				});
			});
		},
		place: function (content, self) {

			if(self.hasClass("active-bottom")){
				self.removeClass("active-bottom").attr("aria-expanded", "false");
			}

			var diff,
				originalWidth = self.data('outerWidth'),
				originalHeight = self.data('outerHeight');

			if (settings.layout === 'narrow') {

				content.css({
					'position': 'absolute',
					'width': $(window).width() - 10
				});
				content.find('.m-c').css('max-height', ($(window).height() * 0.8) - 80);
				content.find('.m-c').addClass("overthrow");
				overthrow.set();

				// Adjust left placement
				if (self.offset().left + (content.outerWidth()/2) > $(window).width()) {
					diff = $(window).width() - (self.offset().left + (content.outerWidth()/2) + 5);
					content.css("left", - (content.outerWidth()/2) + diff);
				} else {
					content.css("left", - (content.outerWidth()/2));
				}
			} else {

				content.css({
					'position': 'absolute',
					'width': originalWidth
				});
				content.find('.m-c').css('max-height', originalHeight);
				overthrow.forget();

				// Adjust left placement
				if (self.offset().left + (content.outerWidth()/2) > $(window).width()) {
					diff = $(window).width() - (self.offset().left + (content.outerWidth()/2) + 10);
					content.css("left", - (content.outerWidth()/2) + diff);
				} else {
					content.css("left", - (content.outerWidth()/2));
				}
			}

			content.css("top", self.outerHeight() + 8);
			self.addClass('active-bottom').attr("aria-expanded", "true");

			content.css("z-index", 1000);
		},
		hide: function(){

			var self = $(this);

			// The content container
			var content = $('#header .m-notifications');

			self.removeClass("active-bottom").attr("aria-expanded", "false");

			self.data("content-show", "");
			content.hide().attr("aria-hidden", "true");
		},
		loadContent: function(content, self){
			if (self.data('content-url')) {
				content.find('.m-c').spin();
				$.ajax({
					type: 'GET',
					cache: false,
					async: true,
					url: self.data('content-url'),
					success: function (data) {
						if (data !== '') {
							content.find('.m-c').html(data);
							content.find('.m-c').spin(false);

							content.find('.m-c ul li').each(function (e) {
								var item = $(this);

								// Re-structure LI content
								var link = item.find('a').clone();
								var linktext = link.text();
								link.html('');
								link.css('display','none');
								item.find('a').replaceWith('<strong>' + linktext + '</strong>');
								item.append(link)
								item.bind('click', function (e) {

									// Stop the LINK event if JS is active
									e.preventDefault();

									if($(this).find('a').first().attr('href') !== undefined){
										location.href = $(this).find('a').first().attr('href');
									}
								});
							});



							if (!self.data('outerWidth')) {
								self.data('outerWidth', content.outerWidth());
							}

							if (!self.data('outerHeight')) {
								self.data('outerHeight', content.outerHeight());
							}

						}
					},
					error: function () {
						content.html("Kunde inte ladda \'" + self.data('content-url') + "\'!");
					}
				});
			}else{
				content.html("\'data-content-url\' attribut saknas");
			}
		}
	};

	$.fn.notifications = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.notifications');
		}
	};

	var settings = null;

})(jQuery);
