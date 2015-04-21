$(function() {
	// Fancybox
	$(".fancy").attr('rel', 'gallery').fancybox({
		helpers: {
			title : {
				type : 'float'
			}
		}
	});
});