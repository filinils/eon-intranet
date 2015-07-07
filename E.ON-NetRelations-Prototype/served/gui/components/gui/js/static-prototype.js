// Prototype specific startup scripts

// Prototype specific startup scripts
$(function () {
	// Event delegation for links
	$('body').click(function (e) {
		try {
			// Display an alert dialog when inactive links are clicked.
			if ($(e.target).closest('a').attr('href').match(/(^\/$|\/?netrp-)/)) {
				e.preventDefault();
				alert('Denna länk är inte aktiv i prototypen.');
			}
		} catch (e) {}
	});
});