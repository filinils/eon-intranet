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
					'aria-haspopup':'true',
					'aria-expanded':'false'
				});
				self.next().attr({
					'aria-hidden':'true'
				});

				if (self.data('layout')) {
					settings.layout = self.data('layout');
				}

				// The content container
				var content = null;

				$('#share-contacts').autocomplete({
					source: $('#share-contacts').data('content-url'),
					html: true,
					select: function( event, ui ) {
						if($('#share-contacts-emails').val().indexOf(ui.item.id) === -1){

							if($('#share-contacts-emails').val().length === 0){
								$('#share-contacts-emails').val(ui.item.id);
							}else{
								$('#share-contacts-emails').val($('#share-contacts-emails').val() + ',' + ui.item.id );
							}
							var shareContact = $('<li>',{
								'data-id'  : ui.item.id
							}).addClass('ui-menu-item').append(
								$('<span>').html( (ui.item.image === undefined ? "" : "<img src=\"" + ui.item.image + "\">" ) + ui.item.value ),
								$('<a>', {
									'href'  : '#',
									'aria-label' : 'Ta bort',
									'html'  : '<span>Ta bort</span>',
									'role' : 'button'
								}).click(function (e) {
									e.preventDefault();
									var listItems = $('#share-contacts-emails').val().split(',');
									listItems.splice(listItems.indexOf($(this).parent().data('id')),1);
									$('#share-contacts-emails').val(listItems.join(','));
									$(this).parent().remove();
									methods.place(content, self);
									$('#share-contacts').focus();
								})
							);
							$('#share-contacts').val('');
							$('#share-contacts-list').append(shareContact);

							methods.place(content, self);
						}else{
							$('#share-contacts-list').find('li[data-id=\''+ui.item.id+'\']').effect( "highlight", {color:"#eb1503"}, 500 );
						}
						return false;
					}
				}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
				return $( "<li class=\"ui-menu-item\" role=\"presentation\">" )
					.append( "<a class=\"ui-corner-all\" tabindex=\"-1\">" + (item.image === undefined ? "" : "<img src=\"" + item.image + "\" alt=\"" + item.label + "\">" )+ item.label + "</a>" )
					.appendTo( ul );
				};

				self.bind('click', function (e) {

					// Stop the LINK event if JS is active
					e.preventDefault();

					// Has the type changed?
					if (self.data('layout')) {
						settings.layout = self.data('layout');
					} else {
						settings.layout = null;
					}

					// Get the content container
					content = $('.share-box');

					if (!self.data('outerWidth')) {
						self.data('outerWidth', content.outerWidth());
					}

					if (!self.data('outerHeight')) {
						self.data('outerHeight', content.outerHeight());
					}

					if (settings.layout === 'narrow') {
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

					// Handle click on self
					if(self.hasClass("active-top")){
						self.data("content-show", "");
						if(self.hasClass("active-top")){
							self.removeClass("active-top").attr("aria-expanded", "false");
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

					// Make sure closing the share only when clicking outside it.
					$(document).mouseup(function (e) {
						if (content.has(e.target).length === 0 && !self.is(e.target) && $('.ui-autocomplete').has(e.target).length === 0) {
							if(self.hasClass("active-top")){
								self.removeClass("active-top").attr("aria-expanded", "false");
							}							
							self.data("content-show", "");
							content.hide().attr("aria-hidden", "true");
						}
					});
					
					// Handle tap on touch devices
					$(document).hammer().on("tap", function(e) {
						if (content.has(e.target).length === 0 && !self.is(e.target) && $('.ui-autocomplete').has(e.target).length === 0) {
							if(self.hasClass("active-top")){
								self.removeClass("active-top").attr("aria-expanded", "false");
							}							
							self.data("content-show", "");
							content.hide().attr("aria-hidden", "true");
						}
					});

					// Close share on "esc"
					$(document).keyup(function (e) {
						if (e.keyCode === 27) {
							if(self.hasClass("active-top")){
								self.removeClass("active-top").attr("aria-expanded", "false");
							}
							self.data("content-show", "");
							content.hide().attr("aria-hidden", "true");
						}
					});

				});
			});
		},
		place: function (content, self) {

			if(self.hasClass("active-top")){
				self.removeClass("active-top").attr("aria-expanded", "false");
			}

			var diff,
				originalWidth = self.data('outerWidth'),
				originalHeight = self.data('outerHeight');

			if (settings.layout === 'narrow') {

				content.css({
					'position': 'absolute',
					'width': $(window).width() - 10
				});

				// Adjust left placement
				if (self.offset().left + (content.outerWidth()/2) > $(window).width()) {
					diff = $(window).width() - (self.offset().left + (content.outerWidth()/2) - 30);
					content.css("left", - (content.outerWidth()/2) + diff);
				} else {
					content.css("left", ($(window).width() - content.outerWidth())/2);
				}

			} else if (settings.layout === 'medium') {

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
					content.css("left", self.offset().left - (content.outerWidth()/2) + (self.outerWidth()/2) - 10);
				}

			}
 
			content.css("top", self.offset().top - content.outerHeight() - 9);
			self.addClass('active-top').attr("aria-expanded", "true");

			content.css("z-index", 22);
		},
		hide: function(){
			var self = $(this);

			// The content container
			var content = $('.share-box');

			self.removeClass("active-bottom").attr("aria-expanded", "false");
			self.data("content-show", "");
			content.hide().attr("aria-hidden", "true");			
		}
	};

	$.fn.share = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.share');
		}
	};	

	var settings = null;

})(jQuery);
