/*
* Written by NetRelations
*/
(function ($) {
	"use strict";
	var methods = {
		init: function () {

			if ($('.content-1 .nav-sub').data('content-url')) {
				contentURL = $('.content-1 .nav-sub').data('content-url');
			}

			if(contentURL !== null) {
				return this.each(function () {
					var self = $(this);
					if (self.data("page-id") !== undefined) {
						if (self.children('button').length === 0) {
							methods.createButton(self);
						} else {
							self.find('button').show();
						}
					}
				});
			}
		},
		update: function (self) {
			self.find('[data-page-id]').each(function () {
				if ($(this).data("page-id") !== undefined) {
					if ($(this).find('button').length === 0) {
						methods.createButton($(this));
					} else {
						self.find('button').show();
					}
				}
			});
		},
		createButton: function (self) {

			// Add expand button
			var button = $('<button>').attr({
				'class': 'collapsable-nav-button'
			}).html($('.content-1 .nav-sub').data('text-show'));

			if(self.data('expanded') === true){
				self.data("content-loaded", "true");
				self.addClass("collapsable-menu");
				self.addClass("animated");
				button.addClass("expanded");
				button.html($('.content-1 .nav-sub').data('text-hide'));
				self.find('ul').first().before(button);
			}else{
				self.append(button);
			}

			// Click event for the button
			button.bind('click', function () {
				/*if(self.data('expanded') === true){
					self.data("content-loaded", "true");
					button.addClass("expanded");
				}*/
				if (button.hasClass("expanded")) {
					button.removeClass("expanded");
					button.html($('.content-1 .nav-sub').data('text-show'));
					button.next().hide();
				} else {
					if (self.data("content-loaded") !== 'true') {
						if (contentURL !== '' && self.data("page-id") !== null) {
							button.html('');
							button.spin();
							$.ajax({
								type: 'GET',
								cache: true,
								url: contentURL + "?pageid=" + self.data("page-id"),
								success: function (data) {
									self.append(data);
									self.data("content-loaded", "true");
									button.addClass("expanded");
									button.spin(false);

									methods.update(self);
									button.html($('.content-1 .nav-sub').data('text-hide'));
									button.next().show();
								}
							});
						}
					} else {
						button.addClass("expanded");
						button.html($('.content-1 .nav-sub').data('text-hide'));
						button.next().show();
					}
				}
			});
		},
		hide: function () {
			return this.each(function () {
				var self = $(this);
				if (self.data("page-id") !== undefined) {
					if (self.find('button').length > 0) {
						self.find('button').hide();
					}
				}
			});
		},
		compact: function(mode){
			return this.each(function () {
				var self = $(this);
				var collaps, button;

				// Retrieve orginal text from heading
				if(!self.data('org-text')){
					var orgHeading = self.find('h2').html();
					if(self.find('h2').find('span').length !== 0){
						orgHeading = orgHeading.substring(orgHeading.indexOf('</span>')+7);
					}
					self.data('org-text',orgHeading);
				}

				if(mode === "640"){
					if($('.content-2').find('.compact-subnav').length === 1){
						$('.content-2').find('.compact-subnav').hide();
					}
					if(self.find('.compact-subnav').length === 1){
						self.find('.compact-subnav').show();
					}

					// Hide current H2 element
					self.find('h2').hide();

					if(self.find('.compact-subnav').length === 0){

						// Add button
						button = $('<button>').attr({
							'class': 'compact-subnav button',
							'role': 'button',
							'aria-expanded': 'false'
						}).html(self.data('text-show') + ' för '+ self.data('org-text'));

						collaps = self.find('ul').first();

						collaps.before(button);
						collaps.hide();

						button.bind('click', function(){
							if (collaps.is(':visible')) {
								$('.compact-subnav').removeClass('expanded');
								collaps.hide();
								button.html(self.data('text-show') + ' för '+ self.data('org-text'));
								collaps.attr('aria-expanded', 'false');
							}else{
								collaps.slideDown({
									duration: 150,
									easing: "easeInCirc"
								});
								$('.compact-subnav').addClass('expanded');
								button.html(self.data('text-hide') + ' för '+ self.data('org-text'));
								collaps.attr('aria-expanded', 'true');
							}
						});

					} else{
						self.find('.compact-subnav').show();
					}
				}else if(mode === "800"){
					if($('.content-2').find('.compact-subnav').length === 1){
						$('.content-2').find('.compact-subnav').show();
					}
					if(self.find('.compact-subnav').length === 1){
						self.find('.compact-subnav').hide();
					}

					// make sure current H2 element is visible
					self.find('h2').show();

					if($('.content-2').find('.compact-subnav').length === 0){

						// Add button
						button = $('<button>').attr({
							'class': 'button compact-subnav',
							'role': 'button',
							'aria-expanded': 'false'
						}).html(self.data('text-show') + ' för '+ self.data('org-text'));

						collaps = self.find('ul').first();

						$('.content-2').prepend(button);
						collaps.show();

						button.bind('click', function(){
							if(!$('html').hasClass('off-canvas')){
								button.html(self.data('text-hide') + ' för '+ self.data('org-text'));
								$('html').addClass('off-canvas');
							}else{
								button.html(self.data('text-show') + ' för '+ self.data('org-text'));
								$('html').removeClass('off-canvas');
							}
						});
					} else{
						$('.content-2').find('.compact-subnav').show();
					}
				}
			});
		},
		decompact: function(mode) {
			return this.each(function () {
				// Reset
				var self = $(this);
				self.find('h2').show();
				var collaps = self.find('ul').first();
				collaps.attr('aria-expanded', 'true');
				if(mode === "640"){
					collaps.show();
					if($('.content-2').find('.compact-subnav').length === 1){
						$('.content-2').find('.compact-subnav').show();
					}
					if(self.find('.compact-subnav').length === 1){
						self.find('.compact-subnav').hide();
					}
				}else if(mode === "800"){
					if($('.content-2').find('.compact-subnav').length === 1){
						$('.content-2').find('.compact-subnav').hide();
					}
					if(self.find('.compact-subnav').length === 1){
						self.find('.compact-subnav').hide();
					}
				}
			});
		}
	};

	$.fn.collapsableMenu = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist in jquery.netr.collapsableMenu');
		}
	};

	var contentURL = null;

})(jQuery);