tinyMCEPopup.requireLangPack();

var WikilinksDialog = {
	init: function () {
		var f = document.forms[0];

		// Find form fields.
		var wl_name = $('#wikilinksName');
		var wl_pageLookup = $('#wikilinksPageLookup');
		var wl_pageUrl = $('#wikilinksPageUrl');
		var wl_pageName = $('#wikilinksPageName');
		var wl_response = $('#wikilinksResponse');

		// Get node surrounding the selector in the editor.
		var selectedText = tinyMCEPopup.editor.selection.getNode();
		var rootId = tinyMCEPopup.editor.dom.win.wiki.epi_page_context.rootId || '';

		// Get search URL from meta tag
		if(tinyMCEPopup.editor.dom.win.wiki.epi_page_context.searchURL) {
			var wikiSearchURL = tinyMCEPopup.editor.dom.win.wiki.epi_page_context.searchURL;
		} else {
			var wikiSearchURL = 'templates/Wiki/LiveSearch.aspx';
		}

		if (selectedText) {

			// If the surrounding node is a link.
			if ($(selectedText).is('a')) {
				
				// Fill form with text from selection.
				wl_name.val($(selectedText).text());
				wl_response.val(selectedText);

				// Try to find a wiki page matching the selection.
				$.ajax({
					dataType: 'json',
					url: wikiSearchURL,
					data: 'q=' + $(selectedText).attr('href') + '&wikiroot=' + rootId,
					success: function (data) {
						if (data) {
							$.each(data, function (index, value) {
								if (this.url == $(selectedText).attr('href')) {
									wl_pageLookup.val(this.name);
									wl_pageName.val(this.name);
									wl_pageUrl.val(this.url);
								}
							});
						}
					}
				});

				// If the surrounding node isn't a link.
			} else {

				// If the surrounding node isn't a link, we'll get the selected text instead.
				selectedText = tinyMCEPopup.editor.selection.getContent({ format: 'raw' });

				// If there was selected text.
				if (selectedText) {
					
					function htmlDecode(value){
					  return $('<div/>').html(value).text();
					}
					
					// Use the selected text as the page name.
					wl_name.val(htmlDecode(selectedText));
					createResponse();

				}

			}

		}

		// Take the string in the text field and search for pages with the same name.
		// Present them in a drop down type div where the user can choose one of their liking.

		// Hides the results wrapper.
		function hideResults() {

			// Hide the wrapper.
			resultsWrapper.hide();

			// Unbind the event that triggers this function.
			$(window).unbind('click');

		}

		// Shows the results wrapper.
		function showResults() {

			// Show the wrapper.
			resultsWrapper.show();

			// Bind an event that closes the results wrapper 
			// when the user clicks outside of it.
			$(window).bind('click', function (e) {
				if (!$(e.target).closest('#pagefinder-results').length) {
					hideResults();
				}
			});

		}

		// Fill in the response text field.
		function createResponse(newPage) {
			var name = wl_name.val() ? wl_name.val() : wl_pageName.val();
			var url = wl_pageUrl.val() ? wl_pageUrl.val() : '#';
			var className = wl_pageUrl.val() && (!newPage) ? 'wikilink-existing' : 'wikilink-future';

			if (name) {
				wl_response.val('<a class="wikilink ' + className + '" href="' + url + '">' + name + '</a>');
			} else {
				wl_response.val('');
			}

		}

		// Create the results wrapper where we'll show wiki pages.
		var resultsWrapper = $('<div id="pagefinder-results"></div>');
		var resultsInner = $('<div id="results"></div>');
		resultsWrapper.append('<h2>Sidförslag</h2>');
		resultsWrapper.append(resultsInner);
		wl_pageLookup.after(resultsWrapper);

		// Initially hide the results wrapper.
		hideResults();

		// Check for text field edits.
		wl_pageLookup.keyup(function () {

			// Save text field for easier access.
			var $t = $(this);

			// Make sure that it isn't empty.
			if ($t.val()) {

				// Find wiki pages matching the text in the text field.
				$.ajax({
					url: wikiSearchURL,
					data: 'q=' + $t.val() + '&wikiroot=' + rootId,
					success: function (data) {

						// Empty the results list.
						resultsInner.html('');

						// Create a list for the results.
						resultsInner.append('<ul></ul>');

						// Prepare for zebra stripes.
						var alt = false;

						if (data) {

							data = NetR.String.supplant(data, {
								pagename: encodeURIComponent(wl_name.val())
							});
							data = $.parseJSON(data);

							// Loop through the examples and add them to the wrapper.
							$.each(data, function (index, value) {
								var thisAlt = alt ? 'even' : 'odd';
								if (index == 'new_page') {
									var newPage = ' new-page-link';
								} else {
									var newPage = '';
								}
								resultsInner.find('ul').append('<li><a class="' + thisAlt + newPage + '" href="' + value.url + '">' + value.name + '</a></li>');
								alt = alt ? false : true;
							});

						}

						var thisAlt = alt ? 'even' : 'odd';

						// Show the results list.
						showResults();

					}
				});

			} else {

				wl_pageUrl.val('');
				wl_pageName.val('');
				createResponse();

				// Empty the results list.
				resultsInner.html('');

				// Hide results wrapper.
				hideResults();

			}

			// Click delegation for the result links.
			resultsInner.delegate('a', 'click', function (e) {

				// Stop click event from redirecting, etc.
				e.preventDefault();

				// Fill the textField with the clicked link's text.
				wl_pageLookup.val($(this).text());
				wl_pageUrl.val($(this).attr('href'));
				wl_pageName.val($(this).text());

				if ($(this).hasClass('new-page-link')) {
					var newPage = true;
				} else {
					var newPage = false;
				}

				// Update the response code.
				createResponse(newPage);

				// Hide the results.
				hideResults();

			});

		});

		wl_name.keyup(function () {

			// Update the response code.
			createResponse();

		});

	},

	insert: function () {
		// Insert the contents from the input into the document
		tinyMCEPopup.editor.execCommand('mceInsertContent', false, document.forms[0].wikilinksResponse.value);
		tinyMCEPopup.close();
	}

};

tinyMCEPopup.onInit.add(WikilinksDialog.init, WikilinksDialog);