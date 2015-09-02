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

			// Set up filter text box
			$('#filter-network').keypress(function () {
				// A slight delay for niceness
				setTimeout(function () {
					methods.filter($('#filter-network').val());
				}, 10);
			});

			$('#filter-network').keyup(function () {
				// A slight delay for niceness
				setTimeout(function () {
					methods.filter($('#filter-network').val());
				}, 10);
			});

			container = this.next();

			return container.find('.scrollable ul li').each(function () {

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
				}else{
					self.data('layout', settings.layout);
				}

				// If a content container is defined use it, else create a new div
				if ($(document).find('.infobox-contact').length === 0) {
					content = $('<div>').attr({
						'class': 'infobox-contact'
					});
					$('body').append(content);
				} else {
					content = $('.infobox-contact');
				}

				// Re-structure LI content
				var link = self.find('a').clone();
				self.data('content-url', link.data('content-url'));
				var linktext = link.text();
				link.html('');
				self.find('a').remove();

				var img = self.find('img').clone();
				self.find('img').remove();

				var div = self.find('div').clone();
				self.find('div').remove();
				self.append(img);
				self.append('<strong>' + linktext + '</strong>');
				self.append(div);
				self.data('name', linktext);
				self.data('role', div.find('.expertise').html());

				self.bind('click', function (e) {
					// Handle click on self
					if(self.hasClass("active-bottom") || self.hasClass("active-top") || self.hasClass("active-left")){
						self.removeClass("active-bottom").attr("aria-expanded", "false");
						self.removeClass("active-top").attr("aria-expanded", "false");
						self.removeClass("active-left").attr("aria-expanded", "false");
						self.data("content-show", "");
						content.hide().attr("aria-hidden", "true");
						return;
					}else{
						// Make sure all open dialoges are reset
						container.find('.scrollable ul li').each(function() {
							$(this).removeClass("active-bottom").attr("aria-expanded", "false");
							$(this).removeClass("active-top").attr("aria-expanded", "false");	
							$(this).removeClass("active-left").attr("aria-expanded", "false");
							$(this).data("content-show", "");
						});
					}

					// Stop the LINK event if JS is active
					e.preventDefault();

					// Has the type changed?
					if (self.data('layout')) {
						settings.layout = self.data('layout');
					} else {
						settings.layout = null;
					}

					// If there is a Ajax content URL defined load content
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

					// Content is needed.
					if (content !== null) {
						content.show().attr({
							"aria-hidden": "false",
							"role": "tooltip"
						});
						methods.place(content, self);
						self.data("content-show", "true");
					}
				});

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

				// Make sure closing the likes box when scrolling the div.
				self.parent().parent().scroll(function () {
					self.removeClass("active-bottom").attr("aria-expanded", "false");
					self.removeClass("active-top").attr("aria-expanded", "false");	
					self.removeClass("active-left").attr("aria-expanded", "false");
					self.data("content-show", "");
					content.hide().attr("aria-hidden", "true");
				});

				// Make sure closing the likes box only when clicking outside it.
				$(document).click(function (e) {
					if (self.data('content-show') === 'true' && content.has(e.target).length === 0 && self.is(e.target) === false && self.has(e.target).length === 0)  {
						self.removeClass("active-bottom").attr("aria-expanded", "false");
						self.removeClass("active-top").attr("aria-expanded", "false");	
						self.removeClass("active-left").attr("aria-expanded", "false");
						self.data("content-show", "");
						content.hide().attr("aria-hidden", "true");
					}
				});

				// Handle tap on touch devices
				$(document).hammer().on("tap", function(e) {
					if (self.data('content-show') === 'true' && content.has(e.target).length === 0 && self.is(e.target) === false && self.has(e.target).length === 0)  {
						self.removeClass("active-bottom").attr("aria-expanded", "false");
						self.removeClass("active-top").attr("aria-expanded", "false");	
						self.removeClass("active-left").attr("aria-expanded", "false");
						self.data("content-show", "");
						content.hide().attr("aria-hidden", "true");
					}
				});

				// Close likes box on "esc"
				$(document).keyup(function (e) {
					if (e.keyCode === 27) {
						self.removeClass("active-bottom").attr("aria-expanded", "false");
						self.removeClass("active-top").attr("aria-expanded", "false");	
						self.removeClass("active-left").attr("aria-expanded", "false");
						self.data("content-show", "");
						content.hide().attr("aria-hidden", "true");
					}
				});
			});
		},
		filter: function(str){
			str = str.toLowerCase();
			var hitCount = 0;
			$('#no-filter-results').remove();
			container.find('.scrollable ul li').each(function () {
				var row = $(this);
				if(str.length >= 3){
					var hitData = row.data('name').toLowerCase() + row.data('role').toLowerCase();
					if(hitData.indexOf(str) > -1){
						row.show();
						hitCount++;
					}else{
						row.hide();
					}
				}else{
					row.show();
				}
			});
			
			if(hitCount === 0 && str.length >= 3){
				container.find('.scrollable ul').append('<li class=\"my-network-no-results\" id=\"no-filter-results\">Inga kontakter motsvarar din filtrering</li>');
				$('#no-filter-results').show();
			}else{
				$('#no-filter-results').remove();
			}
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
			if ($(document).find('.infobox-contact').length === 0) {
				content = $('<div>').attr({
					'class': 'infobox-contact'
				});
				$('body').append(content);
			} else {
				content = $('.infobox-contact');
			}

			// If there is a Ajax content URL defined load content
			if (self.data("content-loaded") !== 'true') {
				if (self.find('a').data('content-url')) {
					$.ajax({
						type: 'GET',
						cache: true,
						async: false,
						url: self.find('a').data('content-url'),
						success: function (data) {
							if (data !== '') {
								content.html(data);
							}
						},
						error: function () {
							content.html("Kunde inte ladda \'" + self.find('a').data('content-url') + "\'!");
						}
					});
				}else{
					content.html("\'data-content-url\' attribut saknas");
				}
				self.data("content-loaded", "true");
			}

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
			var content = $('.infobox-contact');

			self.removeClass("active-bottom").attr("aria-expanded", "false");
			self.removeClass("active-top").attr("aria-expanded", "false");	
			self.removeClass("active-left").attr("aria-expanded", "false");
			content.hide().attr("aria-hidden", "true");
		},
		place: function (content, self) {
			var offsetTop = 0;

			self.removeClass("active-bottom").attr("aria-expanded", "false");
			self.removeClass("active-top").attr("aria-expanded", "false");
			self.removeClass("active-left").attr("aria-expanded", "false");

			if (settings.layout === 'inline') {
				content.css("position", "static");
				content.addClass("infobox-inline").attr("aria-expanded", "true");
			} else {
				content.css("position", "absolute");
				if(content.hasClass("infobox-inline")){
					content.removeClass("infobox-inline").attr("aria-expanded", "false");
				}
			}

			// Verify so that the contact box is not outside the top of the document
			if($(window).scrollTop() > (self.offset().top - ((content.outerHeight()/2) - (self.outerHeight()/2)))){
				offsetTop = $(window).scrollTop() - (self.offset().top - ((content.outerHeight()/2) - (self.outerHeight()/2))) + 10;
				if (settings.layout === 'top') {
					settings.layout = 'bottom';
				}
			}

			// Verify so that the contact box is not outside the bottom of the document
			if(($(window).scrollTop() + $(window).height()) < (self.offset().top + self.outerHeight()) + ((content.outerHeight()/2) - (self.outerHeight()/2))){
				offsetTop = (self.offset().top + self.outerHeight()) + ((content.outerHeight()/2) - (self.outerHeight()/2)) - ($(window).scrollTop() + $(window).height());
				offsetTop = -(offsetTop + 10);
				if (settings.layout === 'bottom') {
					settings.layout = 'top';
				}				
			}

			if (settings.layout === 'bottom') {
				self.addClass('active-bottom').attr("aria-expanded", "true");
				content.css("top", self.offset().top + self.outerHeight());
				content.css("left", self.offset().left - 10);
			}else if (settings.layout === 'top') {
				self.addClass('active-top').attr("aria-expanded", "true");
				content.css("top", self.offset().top - content.outerHeight());
				content.css("left", self.offset().left - 10);
			}else{
				self.addClass('active-left').attr("aria-expanded", "true");
				content.css("top", self.offset().top + (self.outerHeight() / 2) - (content.outerHeight() / 2) + offsetTop);
				content.css("left", self.offset().left - content.outerWidth() - 10);
			}

			content.css("z-index", 1000);
		}
	};

	$.fn.contactInfo = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.contactInfo');
		}
	};	
	
	var settings = null;
	var container = null;
})(jQuery);
