(function ($) {

	// All added dialogs
	var dialogs = [];

	// z-index of topmost dialog
	var z = 1;

	// Dialog container
	var container;

	/**
	Dialog
	*/
	var Dialog = function (options) {
		var self = this;
		this.options = $.extend({
			// Extra dialog class
			extraClass: ''
		}, options || {});

		// No previous dialog has been created
		if (!container) {
			// Create container
			container = $('<div>', {
				id: 'dialogs'
			}).appendTo('body');

			// Observe esc press
			$('body').keydown(function (e) {
				if (e.keyCode == 27) { // ESC
					// Close all dialogs
					$.each(dialogs, function () {
						this.close();
					});
				}
			});
		}

		// Create dialog
		this.dialogElement = $('<div>', {
			'class': 'dialog',
			'id': 'dialog-' + z,
			'role': 'dialog'
		});

		this.dialogElement.addClass(this.options.extraClass);

		// Create and append content container
		this.contentElement = $('<div>', {
			'class': 'dialog-content cf',
			'aria-live': 'assertive'
		}).appendTo(this.dialogElement);

		// Create and append close button
		this.closeElement = $('<button>', {
			'type': 'button',
			'class': 'dialog-close',
			'html': 'Stäng',
			'click': function (e) {
				e.preventDefault();
				self.close();
			}
		}).prependTo(this.dialogElement);

		dialogs.push(this);
	};

	Dialog.prototype = {
		dispose: function () {
			var self = this;
			// Remove elements
			this.dialogElement.remove();

			// Remove from array
			$.each(dialogs, function (index, dialog) {
				if (dialog === self) {
					dialogs.splice(index, 1);
					// Exit each loop
					return false;
				}
			});
		},
		setContent: function (content) {
			this.contentElement.empty().append(content);
			this.position();
			this.dialogElement.trigger('load.netrdialog', this);
		},
		open: function () {
			var self = this;

			container.appendTo('body')
			this.dialogElement.appendTo(container).addClass('prepare-for-show');

			container.fadeIn(200, function() {
				self.dialogElement.addClass('show');
				setTimeout(function() {
					self.dialogElement.removeClass('prepare-for-show')
					self.closeElement.focus();
				}, 500);
			});

			this.position();

			// Add tabindex attribute so the dialog can gain focus
			this.dialogElement;

			this.dialogElement.trigger('open.netrdialog', this);
		},
		close: function () {
			var close_event = $.Event('close.netrdialog');
			this.dialogElement.trigger(close_event);

			if (!close_event.isDefaultPrevented()) {
				this.dialogElement.removeClass('prepare-for-show show').detach();
				container.hide().detach();
			}
		},
		position: function () {
			// Set container size
			container.css('height', ($(document).height()));
			// Increment maximum z value
			z++;
			this.dialogElement.css({
				top: Math.max($(document).scrollTop(), $(document).scrollTop() + ($(window).height() / 2) - (this.dialogElement.height() / 2)),
				//left: ($(window).width() / 2) - (this.dialogElement.outerWidth() / 2),
				top: $(document).scrollTop(),
				zIndex: z
			});
		}
	};


	/**
	Preload an image
	*/
	function preloadImage (imageUrl, callback) {
		var img = $('<img>', {
			css: {
				position: 'absolute',
				top: '-9999px',
				left: '-9999px'
			},
			load: function () {
				callback(img);
				img.remove();
			}
		}).appendTo('body');
		// Set src attribute after creation to trigger load event
		img.attr('src', imageUrl);
	}


	/**
	Create an independent dialog
	*/
	$.netrdialog = function (options) {
		return new Dialog(options);
	};


	/**
	Open the source of a link element in a dialog
	@param {Object}  options  Options
	@memberOf $.fn
	*/
	$.fn.netrdialog = function (method, options) {
		if (typeof method == 'string') {
			switch (method) {
				case 'getdialog':
					return this.data('netrdialog');
					break;
				case 'setcontent':
					var content = options;
					return this.data('netrdialog').setContent(content);
					break;
				case 'open':
					this.data('netrdialog').open();
					break;
				case 'close':
					this.data('netrdialog').close();
					break;
				default:
					break;
			}
		} else {
			// Set options
			options = $.extend({
				// Should data be loaded every time?
				persistent: false,
				// Hijack any form submissions
				hijackForms : false,
				// Extra dialog class
				extraClass: '',
				// A generic error message
				errorMessage: '<p>Ett fel har tyvÃ¤rr uppstÃ¥tt. Var vÃ¤nlig fÃ¶rsÃ¶k igen.</p>'
			}, $.isPlainObject(method) ? method : ($.isPlainObject(options) ? options : {}));

			this.click(function (e) {
				e.preventDefault();
				e.stopPropagation();

				var element = $(this);
				var dialog = element.data('netrdialog');

				if (!dialog) {
					// Create a new dialog
					element.data('netrdialog', dialog = new Dialog({
						extraClass: options.extraClass
					}));

					dialog.dialogElement.bind({
						'close.netrdialog': function (e) {
							// Let the same event bubble away
							// to the connected element.
							element.trigger(e, dialog);

							if (!e.isDefaultPrevented()) {
								element.focus();

								if (!options.persistent) {
									dialog.dispose();
									// Remove references to dialog
									element.data('netrdialog', dialog = null);
								}
							}
						},
						'open.netrdialog': function (e) {
							// Let the same event bubble away
							// to the connected element.
							element.trigger(e, dialog);
						},
						'load.netrdialog': function (e) {
							if (options.hijackForms) {
								var form = dialog.contentElement.find('form');
								var button;

								if (form.attr('enctype') != 'multipart/form-data') {
									// Observe button clicks
									form.on('click', '[type=submit]', function (e) {
										button = $(this);
									});

									// Observe submit event
									form.submit(function (e) {
										e.preventDefault();

										// Remove any placeholder texts before serializing.
										form.find('.placeholder').val(function (index, current_value) {
											if (current_value == $(this).attr('placeholder')) {
												return "";
											}
											else {
												return current_value;
											}
										});
										var data = form.serialize();

										if (button && button.length) {
											data += ('&' + button.attr('name') + '=' + encodeURIComponent(button.val()));
										}

										$.getFragment({
											url: form.attr('action'),
											type: (form.attr('method') || 'post'),
											data: data,
											async: false,
											success: function (data) {
												if (data.length) {
													dialog.setContent(data);
												}
											},
											error: function () {
												dialog.setContent($(options.errorMessage));
											}
										});
									});
								}
							}

							// Let the same event bubble away
							// to the connected element.
							element.trigger(e, dialog);
						}
					});
				}

				if (!dialog.contentElement.children().length || !options.persistent) {
					if (!!element.attr('href').match(/^#/)) {
						// Get element from current page
						dialog.setContent($(element.attr('href')).clone());
					} else {
						// Get element by ajax
						$.getFragment({
							url: element.attr('href'),
							async: false,
							success: function (data) {
								if (data.length) {
									dialog.setContent(data);
								}
							},
							error: function () {
								dialog.setContent($(options.errorMessage));
							}
						});
					}
				}

				// Just a tiiiny delay to be sure content has loaded
				setTimeout(function () {
					dialog.open();
				}, 100);
			});
		}

		// Open on init?
		if (options.open) {
			this.click();
		}

		return this;
	};

}(jQuery));