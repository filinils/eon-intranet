$(function() {
	// Minimize list of tags that exceeds 7
	var items = $('.news-criterias ul').children('li');
		textShow = $('.news-criterias').attr('data-text-show'),
		textHide = $('.news-criterias').attr('data-text-hide');
	if (items.length > 7) {
		items.slice(7).hide();
		items.closest('ul').append('<li><a href="#" class="show-all">' + textShow + '</a></li>').on('click', '.show-all', function(e) {
			var button = $(this);
			items.slice(7).toggle();
			if (button.hasClass('expanded')) {
				button.html(textShow).toggleClass('expanded');
			} else {
				button.html(textHide).toggleClass('expanded');
			}
			e.preventDefault();
		});
	}
});