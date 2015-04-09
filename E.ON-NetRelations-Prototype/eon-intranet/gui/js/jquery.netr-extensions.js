/**
@fileOverview NetRelations common extensions to jQuery
*/

(function ($) {

	/**
	Get the element matching the fragment part of an URL via Ajax
	*/
	$.getFragment = function (options) {
		if (typeof options == 'string') {
			options = {
				url: options
			};
		}

		var url = new netr.URI(options.url);

		if (!url.fragment) {
			throw new Error('Url passed to $.getFragment is missing fragment.');
		}

		var fragment = '#' + url.fragment;
		var _success = options.success;


		options.success = function (data, textStatus, jqXHR) {
			data = $(data);
			var content;

			// Remove any text nodes.
			data = data.filter(function () {
				return this.nodeType != 3;
			})

			if (data.length) {
				if (data.length === 1) {
					if (data.is(fragment)) {
						content = data;
					}
					else {
						content = $(fragment, data);
					}
				}
				else {
					content = data.find('*').andSelf().filter(fragment);
				}
			}
			else {
				content = $();
			}

			_success(content, textStatus, jqXHR);
		};

		// IE seems to sometimes escape the hash part and send it along to the server.
		// This might cause an error, so we have to take the hash part away before requesting
		url.fragment = '';
		options.url = url.getAbsolute();

		return $.ajax(options);
	};

	/*
	Add selector for external links
	*/
	$.expr[":"].external = function(el, i, match, array) {
		return $(el).isExternal();
	};

	$.extend($.fn, {

		/**
		Returns whether the first link is external
		@memberOf $.fn
		*/
		isExternal: function () {
			var url;
			var doc;
			// Is it a link to begin with?
			if (this.is('a')) {
				url = new netr.URI(this.attr('href'));
				doc = new netr.URI(document.location.toString());
				// A mailto link is not external
				if (url.scheme != "mailto:") {
					if (url.getSecondLevelDomain() && doc.getSecondLevelDomain()) {
						// If the second-level domain matches the current one, it's not an external link
						if (url.getSecondLevelDomain() != doc.getSecondLevelDomain()) {
							return true;
						}
					} else {
						if (url.domain && (url.domain != doc.domain)) {
							return true;
						}
					}
				}
			}
			return false;
		},

		/**
		Convert obfuscated mailto elements into real links
		*/
		activateEmailLinks: function (options) {
			options = $.extend({}, {
				textSelector: '.email-text:first', // Optional element with text to be used as the visible link text
				addressSelector: '.email-address:first', // Element with obfuscated email adress (entity encoded, decimal or hexadecimal)
				salt: 'INGEN_SPAM_' // Optional prefix to further reduce the risk of spam bots picking up addresses
			}, options || {});

			return this.each(function () {
				var textElem = $(options.textSelector, this);
				var addressElem = $(options.addressSelector, this);
				if (addressElem.length) {
					var addressText = addressElem.text().replace(options.salt, "");
					var textText = (textElem.length ? textElem.text() : addressText).replace(options.salt, "");
					$(this).replaceWith('<a href="mailto:' + addressText + '">' + textText + '</a>');
				}
			});
		},

		/**
		Return or set the minimum height of an element
		@param {Number} [height] Set the minimum height to this value
		@memberOf $.fn
		*/
		minHeight: function(height) {
			var type = "min-height";
			if (height == undefined) {
				// Get min-height for the first element
				return this.css(type);
			} else {
				// Set the min-height on all elements (default to pixels if value is unitless)
				this.css(type, height.toString().match(/^\d+$/) ? height + "px" : height);
				return this;
			}
		},

		/**
		Return the height of the tallets matched element
		@memberOf $.fn
		*/
		getHighestHeight: function () {
			var maxHeight = 0;
			// Get the height of the highest element
			this.each(function() {
				var el = $(this), height;
				el.minHeight(0);
				height = el.outerHeight();
				if (height > maxHeight) {
					maxHeight = height;
				}
			});
			return maxHeight;
		},

		/**
		Justifies the heights of a bunch of elements to match the highest one
		@memberOf $.fn
		*/
		justify: function() {
			var maxHeight = this.getHighestHeight();
			// Set min-height for all elements
			this.each(function () {
				var el = $(this);
				if (el.css('box-sizing') == 'border-box') {
					el.minHeight(maxHeight);
				} else {
				el.minHeight(el.height() + maxHeight - el.outerHeight());
				}
			});
			return this;
		},

		/**
		Justifies the heights of a bunch of elements to match the highest passed in one
		@param {jQuery} [elements] A bunch of elements to make the matched elements taller than
		@param {Number} [pixels] Make the matched elements at least this much taller
		@memberOf $.fn
		*/
		makeTallerThan: function (elements, pixels) {
			pixels = isNaN(pixels) ? 0 : pixels;
			var maxHeight = elements.getHighestHeight();
			return this.each(function () {
				var el = $(this);
				var height = el.height();
				if (maxHeight + pixels > height) {
					el.minHeight(maxHeight + pixels);
				}
			});
		},

		alignBottoms: function (pixels) {
			pixels = isNaN(pixels) ? 0 : pixels;
			var bottom = Math.ceil(Math.max.apply(Math, this.map(function () {
				var el = $(this);
				return el.offset().top + el.height();
			}).get()) + pixels);
			this.each(function () {
				var el = $(this);
				el.minHeight(Math.ceil(bottom - el.offset().top));
			});
		},

		/**
		Center an element horizontally in the viewport
		@memberOf $.fn
		*/
		centerInViewport: function () {
			return this.each(function () {
				$(this).css({
					left: ($(window).width() / 2) - ($(this).width() / 2)
				});
			});
		},

		/**
		Get an elements corresponding input
		*/
		getLabel: function(context) {
			context = context || $('body');
			if (this.is('input, select, textarea') && this.attr('id')) {
				return $('label[for=' + this.attr('id') + ']', context);
			}
		},

		/**
		Generate a random id for the element(s)
		@param {Boolean} [overwrite] Whether to overwrite an exisiting id
		*/
		generateRandomId: function (overwrite) {
			overwrite = overwrite === false ? false : true;
			return this.each(function () {
				var el = $(this);
				var id;
				if (overwrite || !el.attr('id')) {
					// Loop just to be sure the id doesn't already exist in the DOM
					do {
						id = Math.random().toString().replace(/\D/, '');
					} while($('#' + id).length)
					el.attr('id', id);
				}
			});
		}

	});
})(jQuery);
