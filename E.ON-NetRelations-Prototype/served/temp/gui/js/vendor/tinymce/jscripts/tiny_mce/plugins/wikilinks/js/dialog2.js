tinyMCEPopup.requireLangPack();

var WikilinksDialog = {
	init: function() {

		// Declare elements.
		var form = document.forms[0];
		var wikilinksPageLookup = $('#wikilinksPageLookup');
		var wikilinksResponse = $('#wikilinksResponse');

		// Create the autocomplete bubble.
		var bubble = $('<div id="bubble"></div>');
		var bubbleHeader = $('<h2>Välj befintlig sida:</h2>');
		var bubbleList = $('<ul></ul>');
		bubble.hide();
		wikilinksPageLookup.after(bubble);

		// Hide the bubble.
		function hideBubble() {

			// Empty and hide the bubble.
			bubble.add(bubbleList).html('').hide();
			// Unbind the event that triggers this function.
			$(window).unbind('click');

		}

		// Show the bubble.
		function showBubble() {

			// Show the bubble.
			bubble.show();

			// Bind an event that hides the bubble when the user clicks outside of it.
			$(window).bind('click', function (e) {
				if (!$(e.target).closest('#bubble').length) {
					hideBubble();
				}
			});

		}

		// Search for pages matching the text in the search field.
		wikilinksPageLookup.keyup(function() {

			if (wikilinksPageLookup.val() == '') {

				hideBubble();

			} else {

				// Request the matching pages from the server.
				$.ajax({
					url: '/t/Wiki/LiveSearch.aspx',
					data: 'q=' + wikilinksPageLookup.val(),
					success: function(data) {

						// Remove the previous results.
						bubble.add(bubbleList).html('');

						if (data) {

							// Loop through the results and output them in the list.
							$.each(data, function(index, value) {

								if (index == 'new_page') {
									// Add a link to a new page after the list.
									bubble.append('<span>eller <a href="'+ value.url +'">välj en oskapad sida med titeln '+ value.name +'</a></span>');
								} else {
									// Add existing pages to the list.
									bubbleList.append('<li><a href="'+ value.url +'">'+ value.name +'</a></li>');
								}
							});

							// Show the results.
							bubble.prepend(bubbleHeader, bubbleList);
							showBubble();

						}

					}
				});

			}

		});

	},

	insert: function() {
		// Insert the contents from the input into the document
		tinyMCEPopup.editor.execCommand('mceInsertContent', false, document.forms[0].wikilinksResponse.value);
		tinyMCEPopup.close();
	}

};

tinyMCEPopup.onInit.add(WikilinksDialog.init, WikilinksDialog);