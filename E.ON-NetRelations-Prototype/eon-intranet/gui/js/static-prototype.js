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

	//Show more news
	var ajaxcontent = '<li class="cf"><span class="time"><time datetime="2013-03-29">17 januari 2013</time></span><a href="sub-page.html">Lorem ipsum dolor sit</a></li><li class="cf"><span class="time"><time datetime="2013-03-29">17 januari 2013</time></span><a href="sub-page.html">Lorem ipsum dolor sit</a></li><li class="cf"><span class="time"><time datetime="2013-03-29">17 januari 2013</time></span><a href="sub-page.html">Lorem ipsum dolor sit</a></li>';
	$('.m-eon-news .load-more, .m-calendar .load-more').on('click', function () {
		var list = $(this).parent().siblings(".m-c").find("ul");
		$(ajaxcontent).appendTo(list).hide().each(function (i) {
			$(this).delay(50 * i).animate({
				"height": "show",
				"padding": "show"
			}, 50);
		});
		//$(this).hide();
		//$(this).parent().find('.see-all').show();
	});

	//Show more status feed items
	var ajaxcontent2 = '<li class="cf"><img src="temp/notification-user-4.jpg" width="30" height="30" alt="Profilbild på Namn Namnsson" class="left" /><div><a href="profile-page-coworker.html" class="user">Namn Namnsson</a><span class="time"><time class="fuzzytime" datetime="2013-03-29T15:00-08:00" data-timestamp="<?php $milliseconds = round(microtime(true) * 1000); echo $milliseconds; ?>">10 minuter sedan</time></span></div><p>Early warning är avblåst av både Energinet i Danmark och Svenska Kraftnät i Sverige!</p><div class="meta"><ul><li class="likes info-box" data-content-url="temp/likes.html" role="button"><span>2</span> <span class="structural">gillar</span></li><li class="comments"><a href="status-feed.html"><span>5</span> <span class="structural">kommentarer</span></a></li></ul></div></li><li class="cf"><img src="temp/notification-user-4.jpg" width="30" height="30" alt="Profilbild på Namn Namnsson" class="left" /><div><a href="profile-page-coworker.html" class="user">Namn Namnsson</a><span class="time"><time class="fuzzytime" datetime="2013-03-29T15:00-08:00" data-timestamp="<?php $milliseconds = round(microtime(true) * 1000); echo $milliseconds; ?>">10 minuter sedan</time></span></div><p>Early warning är avblåst av både Energinet i Danmark och Svenska Kraftnät i Sverige!</p><div class="meta"><ul><li class="likes info-box" data-content-url="temp/likes.html" role="button"><span>2</span> <span class="structural">gillar</span></li><li class="comments"><a href="status-feed.html"><span>5</span> <span class="structural">kommentarer</span></a></li></ul></div></li><li class="cf"><img src="temp/notification-user-4.jpg" width="30" height="30" alt="Profilbild på Namn Namnsson" class="left" /><div><a href="profile-page-coworker.html" class="user">Namn Namnsson</a><span class="time"><time class="fuzzytime" datetime="2013-03-29T15:00-08:00" data-timestamp="<?php $milliseconds = round(microtime(true) * 1000); echo $milliseconds; ?>">10 minuter sedan</time></span></div><p>Early warning är avblåst av både Energinet i Danmark och Svenska Kraftnät i Sverige!</p><div class="meta"><ul><li class="likes info-box" data-content-url="temp/likes.html" role="button"><span>2</span> <span class="structural">gillar</span></li><li class="comments"><a href="status-feed.html"><span>5</span> <span class="structural">kommentarer</span></a></li></ul></div></li>';
	$('.m-status-feed .load-more').on('click', function () {
		var list = $(this).parent().siblings(".m-c").find(".status-feed-list");
		$(ajaxcontent2).appendTo(list).hide().each(function (i) {
			$(this).delay(50 * i).animate({
				"height": "show",
				"padding": "show"
			}, 50);
		});
		//$(this).hide();
		//$(this).parent().find('.see-all').show();
	});

});