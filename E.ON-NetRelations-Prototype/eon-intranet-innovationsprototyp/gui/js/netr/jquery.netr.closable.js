/* 
* Written by NetRelations
*/
(function ($) {
	"use strict";
	$.fn.closable = function () {

		return this.each(function () {
			var self = $(this);

			// Click event for the button
			self.find('.close-button').click(function (e) {

				// Stop the POST event
				e.preventDefault();

				self.fadeOut(500, function () {

					// If a content url is defined do a postback before closing.
					if (self.data('content-url')) {
						$.ajax({
							type: 'POST',
							cache: false,
							async: false,
							url: self.data('content-url'),
							success: function () {
							}
						});
					}
					
					self.remove();
				});
			});
		});
	};
})(jQuery);