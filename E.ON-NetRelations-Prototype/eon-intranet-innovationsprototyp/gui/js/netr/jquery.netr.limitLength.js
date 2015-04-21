/* 
 * Written by NetRelations
 */
(function ($) {
	"use strict";
	$.fn.limitLength = function (options) {
		var defaults = {
			limit: 100,
			countElementID: null,
			hideCounter: false,
			warningLimit: 80,
			warningMethod: "counter" // none | counter | input | both
		};
		var settings = $.extend(defaults, options);

		return this.each(function () {
			var self = $(this);

			// Create a char count holder with current limit
			if (settings.warningMethod !== 'none' && !settings.hideCounter) {
				if (settings.countElementID === null) {
					self.after("<span class=\"char-counter\">" + settings.limit + "</span>");
				} else {
					$("#" + settings.countElementID).parent().html('<strong id=\"' +settings.countElementID + '\"></strong> tecken kvar');
					$("#" + settings.countElementID).text(settings.limit);

				}
			}

			// Add warning style to input box if warningMethod = input or both
			if (settings.warningMethod === 'input' || settings.warningMethod === 'both') {
				self.addClass("limit-length-input");
			}

			//  Initiate if there already is text present
			limitString();

			// Format the text
			function limitString() {

				if (settings.warningMethod !== 'none') {
					var limitCounter;

					if (settings.countElementID === null) {
						limitCounter = self.prev();
					} else {
						limitCounter = $("#" + settings.countElementID);
					}

					if (settings.warningMethod === 'counter' || settings.warningMethod === 'both') {
						if (self.val().length >= settings.warningLimit) {
							limitCounter.parent().addClass("warning");
						} else {
							limitCounter.parent().removeClass("warning");
						}

						if (self.val().length >= settings.limit) {
							limitCounter.parent().removeClass("warning");
							limitCounter.parent().addClass("max");
						} else {
							limitCounter.parent().removeClass("max");
						}
					}

					if (settings.warningMethod === 'input' || settings.warningMethod === 'both') {
						if (self.val().length >= settings.warningLimit) {
							self.addClass("warning");
						} else {
							self.removeClass("warning");
						}

						if (self.val().length >= settings.limit) {
							self.removeClass("warning");
							self.addClass("max");
						} else {
							self.removeClass("max");
						}
					}

					// Update the limit counter
					if (!settings.hideCounter) {
						limitCounter.text(settings.limit - self.val().length);
					}
				}

				// Cut the current content
				if (self.val().length > settings.limit) {
					self.val(self.val().substring(0, settings.limit));
				}
			}

			// Create a hidden div for use when calculating the height
			var hiddenDiv = $('<div>').attr({
							'class': 'hidden-overflow',
							'style': 'width:' + self.width() + 'px;min-height:' + self.outerHeight() + 'px;'
						});

			$('body').append(hiddenDiv);

			// Check length each time a key is pressed
			self.keypress(function () {
				// A slight delay for niceness
				setTimeout(function () {
					limitString();
				}, 10);
			});

			// Check length each time a key is released
			self.keyup(function () {
				// A slight delay for niceness
				setTimeout(function () {
					self.css('height', hiddenDiv.html(self.val().replace(/\n/g, '<br>')).height());
					limitString();
				}, 10);
			});

			// Handle paste event.
			self.bind('paste', function () {
				// A slight delay for niceness
				setTimeout(function () {
					limitString();
				}, 10);
			});
		});
	};
})(jQuery);