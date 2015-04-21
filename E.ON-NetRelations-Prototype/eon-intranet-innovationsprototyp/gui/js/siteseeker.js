NetR = typeof NetR === 'undefined' ? {} : NetR;

/**
 * SiteSeeker statistics functions
 * @requires jquery
 * @requires jquery.eventdelegation
 */
NetR.siteseeker = function () {
	function init() {
		$('#search-result').delegate('a.log-stats', 'click', function () {
			var link = $(this);
			
			$.ajax({
				type: "GET",
				url: clickTrackActivationUrl(link),
				dataType: "text",
				complete: function () { window.location = link.attr('href'); },
				timeout: 2000
			});

			return false;
		});
	}

	function clickTrackActivationUrl(link) {
		try {
			var hitCounter = '/SiteSeeker/HitCounter.aspx';
			var q = encodeURIComponent($('#searchtext2').val());
			var resid = encodeURIComponent($('#resid').val());
			var uaid = encodeURIComponent($('#uaid').val());
			var url = encodeURIComponent(link.attr('href'));

			var hitId = link.attr('id');
			var hitParameter = hitId.split('-')[0]
			var hitNumber = hitId.split('-')[1]

			return hitCounter
					+ '?'
					+ 'q=' + q
					+ '&resid=' + resid
					+ '&uaid=' + uaid
					+ '&url=' + url
					+ '&' + hitParameter + '=' + hitNumber;
		} catch (e) {
			return;
		}
	}

	return {
		init: init
	};
} ();