/*
 * STARTUP SCRIPTS
 */

// Initialize on document ready.
$(function () {
	"use strict";
	// window.addEventListener('load', function() {
	// 	new FastClick(document.body);
	// }, false);

	$.fn.spin = function (opts) {
		this.each(function () {
			var $this = $(this),
				data = $this.data();

			if (data.spinner) {
				data.spinner.stop();
				delete data.spinner;
			}
			if (opts !== false) {
				data.spinner = new Spinner($.extend({ color: $this.css('color'),length:3,width:2,lines:11,radius:4,corners:1.0,trail:100,speed:1.8 }, opts)).spin(this);
			}
		});
		return this;
	};

	$.fn.onAvailable = function(fn){
		var sel = this.selector;
		var timer;
		var self = this;
		if (this.length > 0) {
			fn.call(this);
		}
		else {
			timer = setInterval(function(){
				if ($(sel).length > 0) {
					fn.call($(sel));
					clearInterval(timer);
				}
			},50);
		}
	};

	// Check if images loaded correctly
	var image = new Image();
	image.onload = function() {
		if (image.width > 0) {
			document.documentElement.className = document.documentElement.className.replace(/(\s|^)no-img(\s|$)/, '$1img$2');
		}
	};
	image.src = 'gui/i/logo.png';


	// Placeholder polyfill
	//Modernizr.load({
	//	test: Modernizr.input.placeholder,
	//	nope: '/js/vendor/jquery.html5-placeholder-shim.min.js'
	//});

	// Mega menu
	$('.mega-top-level').megaMenu();

	// Collapsable
	$('.collapsable').collapsable();

	// Closable
	$('.closable').closable();

	// Handle iframe-links
	$('a[data-render]').iframe();

	// User navigation
	$('#user-details').userDetails();

	// User notifications
	$('.notifications .counter').notifications();

	// Contact information
	$('#my-network').contactInfo();

	// Likes
	$('.likes.info-box').likes();

	// Share
	$('#share button').share();

	// Lync status
	$.lyncStatus({hideSipIfMissingLync:true});

	// Limit length of input fields
	$('#status-update').limitLength({ limit: 140, warningMethod: 'counter', warningLimit:120, countElementID: 'status-update-counter' });
	$('#user-contact-about').limitLength({ limit: 500, warningMethod: 'counter', warningLimit:480, countElementID: 'user-contact-about-counter' });
	$('#user-about').limitLength({ limit: 500, warningMethod: 'counter', warningLimit:480, countElementID: 'user-about-counter' });
	$('#headline').limitLength({ limit: 55, warningMethod: 'counter', warningLimit:35, countElementID: 'headline-update-counter' });
	$('#intro').limitLength({ limit: 260, warningMethod: 'counter', warningLimit:240, countElementID: 'intro-update-counter' });

	// fuzzyTimes
	$.fuzzyTimes({ refreshInterval: 2000, dataField: 'timestamp', className: 'fuzzytime' });

	$('.open-in-dialog').netrdialog({
		hijackForms: false
	});

	//Justify teasers
	$('.row .m-9').justify();
	$('.row .m-9 .m-f').addClass('justified');

	// Bind buttons that should do ajax postbacks
	$('button.call-back[data-content-url]').bind('click', function(e){
		var self = $(this);
		if (self.data('content-url')) {
			$.ajax({
				type: 'GET',
				cache: false,
				url: self.data('content-url'),
				success: function (data) {
					if (data !== '') {
						self.find('span').html(data);
						self.toggleClass('selected');
						if(self.data("after-postback-action")){
							var functions = self.data("after-postback-action").split(",");
							for (var i = 0; i < functions.length; i++) {
								eval(functions[i]);
							};
						}
					}
				}
			});
		}
	});

	// Bind checkboxes that should do ajax postbacks
	$('input[type="checkbox"][data-content-url]').bind('click', function(e){
		var self = $(this);
		if (self.data('content-url')) {
			$.ajax({
				type: 'GET',
				cache: false,
				url: self.data('content-url') + (self.data('content-url').indexOf("?") > 0 ? "&" : "?") + "ischecked=" + self.is(':checked'),
				success: function (data) {
					if (data === '') {
						// No logic needed at this point
					}
				}
			});
		}
	});
	$(".button-network").each(function () {
		var networkBtn = $(this);
		var addUrl = networkBtn.attr('data-add-url');
		var removeUrl = networkBtn.attr('data-remove-url');
		if (networkBtn.attr('data-state') == 'added') {
			networkBtn.text('Ta bort från mitt nätverk');
		}
		networkBtn.on('click', function(e) {
			e.preventDefault();
			if (networkBtn.attr('data-state') == 'added') {
				$.ajax({
					type: 'Post',
					cache: false,
					url: removeUrl,
					data:networkBtn.serialize(),
					success: function (data) {
						networkBtn.attr('data-state', '')
						networkBtn.text('Lägg till i mitt nätverk');
					}

				});

			}
			else {
				$.ajax({
					type: 'Post',
					cache: false,
					url: addUrl,
					data:networkBtn.serialize(),
					success: function (data) {
						networkBtn.attr('data-state', 'added')
						networkBtn.text('Ta bort från mitt nätverk');
					}
				});

			}
			return false;
		});
	});

	// Bind show / hide feature on "m-accordion h3" for the archive
	$('.m-accordion h3').each(function(index){
		var self = $(this);

		var button = $('<button>').attr({
					'class': '',
					'aria-expanded': 'false',
					'data-opened': self.data('opened'),
					'aria-controls': 'panel'+(index+1)
				}).html(self.html());
		self.replaceWith(button);
		button.next().attr({
			'aria-hidden': 'true',
			'aria-labelledby': 'tab'+(index+1)
		});
		button.bind('click', function(e){
			if(!button.hasClass('open')){
				button.addClass('open').attr('aria-expanded', 'true');
				button.next().show().attr('aria-hidden', 'false');
			}else{
				button.removeClass('open').attr('aria-expanded', 'false');
				button.next().hide().attr('aria-hidden', 'true');
			}
		});

		if(button.data('opened')){
			button.click();
			if(!button.next().find('li').hasClass('selected')){
				button.next().find('li').first().addClass('selected');
			}
		}
	});

	// Bind show / hide feature on "sitemap li a" for the sitemap
	$('.sitemap li a').each(function(index){
		var self = $(this);
		if(self.next().is('ul')){
			var button = $('<button>').attr({
						'class': 'collapsable-button',
						'aria-expanded': 'false',
						'aria-controls': 'panel'+(index+1)
					}).html(self.text());
			self.after(button);
			button.prev().attr({
				'aria-hidden': 'true',
				'aria-labelledby': 'tab'+(index+1)
			});
			button.bind('click', function(e){
				e.preventDefault();

				if(!button.hasClass('expanded')){
					button.addClass('expanded').attr('aria-expanded', 'true');
					button.next().show().attr('aria-hidden', 'false');
				}else{
					button.removeClass('expanded').attr('aria-expanded', 'false');
					button.next().hide().attr('aria-hidden', 'true');
				}
			});

		}
	});

	// Form validation
	var myConf = {
		borderColorOnError : '#d30d01',
		errorMessagePosition : 'over'
	};
	$('.form-general').submit(function() {
		if ($(this).validate(myConf)){
			return true;
		}
		return false;
	}).validateOnBlur(false, myConf);


	// Left menu buttons
	$('li[data-page-id]').collapsableMenu();

	// Automatically truncate long option text
	$('.nav-user select option').each(function() {
		var text = $(this).text();
		if (text.length > 40) {
			$(this).text(text.substr(0, 39) + '…');
		}
	});

	// Navigate to page on select
	var reg_exp = new RegExp('/' + window.location.host + '/');
	$('.nav-user select').prop('selectedIndex',-1);
	$('.nav-user select').on('change', function() {
		var link = document.createElement('a');

		link.href = this.value;

		if (!reg_exp.test(link.href)) {
			window.open(link.href, '_blank');
			link = null;
		} else {
			window.open(link.href, '_self');
			link = null;
		}
	});

	// Add WAI-ARIA roles to toggle button in contact card
	$('.list-item button.expand').each(function() {
		$(this).attr('aria-expanded', 'false').next().attr('aria-hidden', 'true');
	});

	// User profile edit tags
	$('#autocomplete-interest, #autocomplete-language').each(function() {
		var tagInput = $(this);
		tagInput.tagsInput({
			width: '100%',
			height: 'auto',
			preventEnter: tagInput.data('enter'),
			autocomplete_url: tagInput.data('content-url'),
			defaultText: tagInput.data('default-text'),
			interactive: true,
			onAddTag: function(value, tags){
				if(tagInput.data('enter') === 'false'){
					$.ajax({
						type: 'POST',
						cache: true,
						async: true,
						url: tagInput.data('content-url') + "?newTag=" + value
					});
				}
			}
		});
	});

	// Toggle extended information in contact card
	$('.list-item button.expand').on('click', function() {
		var self = $(this),
			content = $(this).next();
		if (self.hasClass('expanded')) {
			content.slideUp(150).attr('aria-hidden', 'true');
			self.removeClass('expanded').attr('aria-expanded', 'false').find('span').text('Expandera kontaktkort');
		} else {
			content.slideDown(150).attr('aria-hidden', 'false');
			self.addClass('expanded').attr('aria-expanded', 'true').find('span').text('Minimera kontaktkort');
		}
	});

	// Activate the overflow plugin on required elements
	$('.infobox-likes li a, .user-details button').textOverflow();

	// Add scroll in scroll if needed
	$('.scrollable, .infobox-contact, .infobox-likes, .share-popup .share-list, div.tagsinput, .m-news-list').addClass('overthrow');

	// Enable overthrow
	var o = overthrow;
	if( o.support === "native" || o.support === "polyfilled" ){
		o.set();
	}
	// Validate file upload
	$('input[type=file]').fileValidator({
		onValidation: function(files) {
			$(this).attr('class','');
			$(this).closest('div').removeClass('file-validation-error-area');
			$(this).closest('form').find('.file-validation-error').remove();
			$('input[type=submit]').prop('disabled', false);
		},
		onInvalid: function(type, file){
			$(this).addClass('invalid '+type);
			$(this).closest('div').addClass('file-validation-error-area');
			$(this).before('<p class="file-validation-error">Bilden du försöker ladda upp är för tung, den tar för mycket minne. Bildfiler får inte vara större än 2 MB.</p>');
			$('input[type=submit]').prop('disabled', true);
		},
		maxSize: '2mb'
	});

	// Validate Month vs Day
	$('#user-month').on('change', function(){
		var monthLength = 30;
		if($('#user-month').val() === 'feb'){
			monthLength = 29;
		}
		if(["jan","mar","maj","jul","aug","okt","dec"].indexOf($('#user-month').val()) > -1){
			monthLength = 31;
		}
		$('#user-day option').each(function(){
			if($(this).val() > monthLength){
				$(this).attr("disabled", "disabled");
			}else{
				$(this).removeAttr("disabled");
			}
		});
	});

	// Notifications page
	$('.m-notifications').find('.m-c ul li').each(function (e) {
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

	// Mark notifications as read
	$('.mark-as-read').click(function(){
		$('.m-notifications ul li').removeClass('unread');
	});

	// Autocomplete results
	var autocompleteResults = 5;

	// Init autocompletion for search forms
	$('form[data-content-url]').each(function () {
		var form = $(this);
		var input = form.find('input[type=search]:first');

		// Initialize siteseeker suggestions
		input.autocomplete({
			source: function (request, response) {
				$.ajax({
					url: form.attr('data-content-url'),
					data: {
						q: request.term,
						ilang: $('html').attr('lang')
					},
					dataType: 'json',
					success: function (data) {
						var ret = $.map(data.slice(0, autocompleteResults), function (row, index) {
							return {
								label: row.suggestionHighlighted,
								value: row.suggestion
							};
						});
						var widget = input.autocomplete('widget');
						response(ret);
						// Set a 'last' class on the last item of the autocomplete list
						widget.find('a:last').addClass('last');
					}
				});
			},
			html: true,
			delay: 100,
			minLength: 2,
			appendTo: form,
			open: function () {
				input.autocomplete('widget').css({
					width: input.outerWidth() - 2,
					top: input.outerHeight() + input.position().top
				});
				input.addClass('autocomplete-active');
			},
			close: function () {
				input.removeClass('autocomplete-active');
			},
			select: function (e, ui) {
				if (!e.keyCode) {
					input.val(ui.item.value);
				}
				form.submit();
			},
			focus: function (e, ui) {
				if (e.keyCode) {
					e.preventDefault();
					input.val(ui.item.value);
				}
			}
		});
	});


	// Add a responsive breakpoint.
	if (typeof $.breakpoint === 'function') {
		$.breakpoint((function () {
			// Return the breakpoint object
			return {
				condition: function () {
					// This breakpoint will fire its
					// "enter" method when this function
					// returns true.
					return window.matchMedia('only screen and (min-width:640px) and (max-width:800px)').matches;
				},
				first_enter: function () {
					// This method will fire the first time condition() becomes true.
				},
				enter: function () {

					// Add overflow class
					$('html').addClass('off-canvas-overflow');

					// Revert the iframe
					$('a[data-render]').iframe('revert');

					// Hide all likes
					$('.likes.info-box').likes('hide');

					// Make sure all Likes infoBoxes are shown below
					$('.likes.info-box').each(function () {
						$(this).data("layout", "bottom");
					});

					// Hide user navigation
					$('.user-details h2').userDetails('hide');

					// Hide notification
					$('.notifications .counter').notifications('hide');

					// Resize notifications and user details dropdown
					$('.user-details h2').data('layout', 'medium');

					// Resize share popup
					$('#share button').data('layout', 'medium');

					// Hide submenu and create menu button if needed
					$('.content-1 .nav-sub').collapsableMenu('compact','800');

					// Create button for showing off canvas information
					if($('.content-1 .nav-sub').length === 0 && ($('body').hasClass('layout-2'))) {

						if($('.content-1-2').find('.compact-subnav').length === 0){

							// Add button
							var button = $('<button>').attr({
								'class': 'button compact-subnav',
								'role': 'button',
								'aria-expanded': 'false'
							}).html('Visa '+ $('#body').data('off-canvas-text'));

							$('.content-1-2').prepend(button);

							button.bind('click', function(){
								if(!$('html').hasClass('off-canvas')){
									button.html('Dölj '+ $('#body').data('off-canvas-text'));
									$('html').addClass('off-canvas');
								}else{
									button.html('Visa '+ $('#body').data('off-canvas-text'));
									$('html').removeClass('off-canvas');
								}
							});
						} else{
							$('.content-1-2').find('.compact-subnav').show();
						}
					}

					// Create button for showing off canvas information on Search page
					if($('body').hasClass('layout-6')) {

						if($('.content-1-1').find('.compact-subnav').length === 0){

							// Add button
							var button = $('<button>').attr({
								'class': 'button compact-subnav',
								'role': 'button',
								'aria-expanded': 'false'
							}).html('Visa '+ $('#body').data('off-canvas-text'));

							$('.content-1-1').prepend(button);

							button.bind('click', function(){
								if(!$('html').hasClass('off-canvas')){
									button.html('Dölj '+ $('#body').data('off-canvas-text'));
									$('html').addClass('off-canvas');
								}else{
									button.html('Visa '+ $('#body').data('off-canvas-text'));
									$('html').removeClass('off-canvas');
								}
							});
						} else{
							$('.content-1-1').find('.compact-subnav').show();
						}
					}
				},
				exit: function () {

					// Remove overflow class after a slight delay
					setTimeout(function() {$('html').removeClass('off-canvas-overflow');}, 500);

					// Re-make the iframe
					$('a[data-render]').iframe('reload');

					// Make sure all Likes infoBoxes are reset
					$('.likes.info-box').each(function () {
						$(this).data("layout", null);
					});

					// Hide sub menu buttons
					$('li[data-page-id]').megaMenu('reset');

					// Reset notifications and user details dropdown
					$('.user-details h2').data('layout', null);

					// Reset share popup
					$('#share button').data('layout', null);

					// show submenu and hide menu button
					$('.content-1 .nav-sub').collapsableMenu('decompact','800');

					// Create button for showing off canvas information
					if($('.content-1 .nav-sub').length === 0 && ($('body').hasClass('layout-2'))) {
						if($('.content-1-2').find('.compact-subnav').length === 1){
							$('.content-1-2').find('.compact-subnav').hide();
						}
					}

					// Create button for showing off canvas information on Search page
					if($('body').hasClass('layout-6')) {
						if($('.content-1-1').find('.compact-subnav').length === 1){
							$('.content-1-1').find('.compact-subnav').hide();
						}
					}
				}
			};
		}()));
		$.breakpoint((function () {
			// Return the breakpoint object
			return {
				condition: function () {
					return window.matchMedia('only screen and (max-width:640px)').matches;
				},
				first_enter: function () {
					// This method will fire the first time condition() becomes true.
				},
				enter: function () {

					$('html').removeClass('off-canvas');

					// Change to less autocomplete results
					autocompleteResults = 3;

					// Fall back to showimg link instead of the iframe
					$('a[data-render]').iframe('revert');

					// Make sure all Contact infoboxes are shown above
					$('#my-network').next().find('.scrollable ul li').each(function () {
						$(this).data("layout", "top");
					});

					// Hide all likes
					$('.likes.info-box').likes('hide');

					// Make sure all Likes infoBoxes are shown inline
					$('.likes.info-box').each(function () {
						$(this).data("layout", "bottom");
					});

					// Hide user navigation
					$('.user-details h2').userDetails('hide');

					// Hide notification
					$('.notifications .counter').notifications('hide');

					// Resize notifications and user details dropdown
					$('.notifications .counter, .user-details h2').data('layout', 'narrow');

					// Resize share popup
					$('#share button').data('layout', 'narrow');

					// Mega menu will be displayed inline
					$('.mega-top-level').megaMenu('inline');

					// Hide top-menu and create menu button if needed
					$('.mega-top-level').megaMenu('compact');

					// Hide submenu and create menu button if needed
					$('.content-1 .nav-sub').collapsableMenu('compact','640');

					// Close collapsable
					$('.collapsable').collapsable('collaps');

					// Unbind netr dialog
					$('.open-in-dialog').unbind('click');

				},
				exit: function () {
					$('a[data-render]').iframe('reload');

					// Make sure all Contact infoBoxes are reset
					$('#my-network').next().find('.scrollable ul li').each(function () {
						$(this).data("layout", null);
					});

					// Make sure all Likes infoBoxes are reset
					$('.likes.info-box').each(function () {
						$(this).data("layout", null);
					});

					// Reset notifications and user details dropdown
					$('.notifications .counter, .user-details h2').data('layout', null);

					// Reset share popup
					$('#share button').data('layout', null);

					// Mega menu will be displayed as default
					$('.mega-top-level').megaMenu('reset');

					// Show top-menu and hide menu button
					$('.mega-top-level').megaMenu('decompact');

					// show submenu and hide menu button
					$('.content-1 .nav-sub').collapsableMenu('decompact','640');

					// rebind netr dialog
					$('.open-in-dialog').netrdialog({
						hijackForms: true
					});
				}
			};
		}()));
	}

	// Setup string translations.
	if (typeof netrTranslatedStrings != 'undefined') {
		netr.string.addTranslations(netrTranslatedStrings);
	}

	// Enable html5 placeholder attributes for older browsers.
	$('input[placeholder]').placeholder();
	$('#status-update').placeholder();

	// Add rel attribute to external links.
	$('a:external').attr('rel', 'external');

	// Zebra script, give every second row a different color.
	$('.zebra tbody tr:nth-child(even)').addClass('even');

	// Load any Flash movies that are specified in data-flash attributes.
	// The properties must use valid JSON syntax.
	$('[data-flash]').each(function () {
		var f = $(this);
		var fData = f.data().flash;
		if (fData) {
			f.flash(fData);
		}
	});

	// Initialise Slideshows
	$('.flexslider').each(function () {
		var slideShow = $(this);
		slideShow.flexslider({
			pauseOnHover: true,
			prevText: 'Föregående',
			nextText: 'Nästa',
			touch: true,
			slideshowSpeed: 3000,
			slideshow: slideShow.data("slideshow"),
			// Do things when the first slide is loaded (on init)
			start: function(slider) {
				var namespace = this.namespace;
				slider.prepend('<h2 class="visually-hidden">Slideshow</h2>');
				// Make slideshow navigation keyboard usable
				$(slider.controlNav).each(function() {
					$(this).attr({
						href: '#', // Makes the a elements keyboard focusable
						role: 'button' // Tell screen readers the links are really buttons
					}).prepend('<span class="visually-hidden">Slide </span>'); // Explanatory text before the slide number
					if ($(this).hasClass(namespace + 'active')) {
						// Indicate which slide is currently displayed
						$(this).append('<span class="current-text visually-hidden"> (current slide)</span>');
					}
				});
				$(slider.directionNav).each(function() {
					$(this).attr({
						role: 'button' // Tell screen readers the links are really buttons
					});
				});
				// Remove focusable elements in slides that are not shown from the tabbing order
				$(slider.container).find('li:not(.flex-active-slide)').each(function() {
					$(this).find('a, input, textarea, button, select').attr('tabindex', '-1');
				});
			},
			// Do things after each slide animation is complete, i.e. when a new slide is displayed
			after: function(slider) {
				var namespace = this.namespace;
				// Remove focusable elements in slides that are not shown from the tabbing order
				// Make focusable elements in the shown slide focusable
				$(slider.container).find('li').each(function() {
					var slide = $(this);
					slide.find('a, input, textarea, button, select').attr('tabindex', '-1');
					if (slide.hasClass('flex-active-slide')) {
						slide.find('a, input, textarea, button, select').removeAttr('tabindex');
					}
				});
				// Make slideshow navigation keyboard usable
				$(slider.controlNav).each(function() {
					// Indicate which slide is currently displayed
					if ($(this).hasClass(namespace + 'active')) {
						$(this).append('<span class="current-text visually-hidden"> (current slide)</span>');
					} else {
						$(this).find('.current-text').remove();
					}
				});
			}
		});
	});

	// Adds a confirm message to buttons
	$('.confirm-button').each(function(){
		var input = $(this);
		input.click(function(){
			return confirm(input.attr("title"));
		});
	});

	// Print button.
	if (window.print) {
		var printButton = $('.article-actions ul li').first();
		printButton.after($('<li>',{id:'print'}).append($('<button>', {
			html: 'Skriv ut',
			click: function (e) {
				window.print();
			}
		})));
	}

	// Re-model EPiServer menu
	$("#epi-quickNavigator").onAvailable(function(){
		var rootElement = $('.user-details .user-settings');
		$('#epi-quickNavigator').find('#epi-quickNavigator-menu li').each(function() {
			rootElement.before($(this));
		});
		$("#epi-quickNavigator").remove();
	});

    // Top search
	$('#search-trigger').on('click', function () {
	    $('#search').toggleClass('open');
	});

	//Toggle edit profile information
	$('.m-user-details .toggle-edit').on('click', function () {
		var parent = $(this).parent();
		$('.m-user-details .user-details-inner').removeClass('edit-mode');
		$(parent).addClass('edit-mode');
	});
	$('.m-user-details .cancel').on('click', function () {
		var grandparent = $(this).parent().parent();
		$(grandparent).removeClass('edit-mode');
	});

});

$(window).bind('load resize orientationchange', function() {

	// Check if any tables are wider than their parent.
	// If they are, wrap them in containers to allow for horizontal scrolling.
	// Requires CSS rules in global.css (.scroll-table, .scroll-table:after .scroll-table > .scroll-table-inner).
	// TODO: Don't forget Flash solution
	$('table:not(.mceLayout, .mceLayout table, .stats, .stats table, .xform table)').each(function() {
		var table = $(this);
		if (table.outerWidth() > table.parent().outerWidth()) {
			if (!table.hasClass('scrollable')) {
				table.wrap('<div class="scroll-table active"><div class="scroll-table-inner"></div></div>').addClass('scrollable');
				var scroll_table = table.parent().parent().parent().find('.scroll-table').first();
				var scroll_table_inner = table.parent().parent().find('.scroll-table-inner').first();
				scroll_table_inner.on('touchmove scroll', function (e) {
					if (scroll_table_inner.scrollLeft() > 20) {
						scroll_table_inner.addClass("active");
					}
					else {
						scroll_table_inner.removeClass("active");
					}
					if (scroll_table_inner.scrollLeft() + scroll_table_inner.outerWidth() > table.outerWidth() - 20) {
						scroll_table.removeClass("active");
					}
					else {
						scroll_table.addClass("active");
					}
				});
			}
		} else if (table.hasClass('scrollable')) {
			table.removeClass('scrollable').unwrap().unwrap();
		}
	});

	$('[data-flash] object').each(function() {
		var flash = $(this);
		if (flash.outerWidth() > flash.parent().outerWidth()) {
			if (!flash.hasClass('scrollable')) {
				flash.wrap('<div class="scroll-table active"><div class="scroll-table-inner"></div></div>').addClass('scrollable');
				var scroll_table = flash.parent().parent().parent().find('.scroll-table').first();
				var scroll_table_inner = flash.parent().parent().find('.scroll-table-inner').first();
				scroll_table_inner.on('touchmove scroll', function (e) {
					if (scroll_table_inner.scrollLeft() > 20) {
						scroll_table_inner.addClass("active");
					}
					else {
						scroll_table_inner.removeClass("active");
					}
					if (scroll_table_inner.scrollLeft() + scroll_table_inner.outerWidth() > flash.outerWidth() - 20) {
						scroll_table.removeClass("active");
					}
					else {
						scroll_table.addClass("active");
					}
				});
			}
		} else if (flash.hasClass('scrollable')) {
			flash.removeClass('scrollable').unwrap().unwrap();
		}
	});
});

$(window).load(function() {
	// Set width for image captions based on image width.
	$('span.caption').each(function () {
		var caption = $(this);
		var img = caption.children('img');
		if(img.length === 0){
			img = caption.children('a').children('img');
		}
		if (img.length && caption.is(':not(.fullwidth)') && caption.is(':not(.fullwidth-dec)')) {
			caption.css('max-width', img.outerWidth() || '');
		}
	});
    
    //Profile-page social linking
    $(".social-list li").on('click', function(e){ 
        e.preventDefault(); 
        $("#" + $(this).data("field"))
            .parents("li")
            .toggle(300, function(){
                $(".user-social input:not(:visible)").each(function(){
                    $(this).val(null);
                });            
            })
            .toggleClass("expanded"); 
        $(this).toggleClass("expanded");

    });
    $(".user-social input").each(function(){
        if($(this).val().length) {
            $(this).parents("li").addClass("expanded");
            $(".social-list li").filter("[data-field='" + $(this).attr("id") + "']").addClass("expanded");
        }
    });    
});