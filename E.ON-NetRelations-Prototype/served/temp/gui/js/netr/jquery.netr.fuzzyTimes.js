/*
 * Based on:
 * Timeago jQuery plugin by Ryan McGeary
 * http://timeago.yarp.com/
 *
 * Requires: jquery.timer.js by Jason Chavannes <jason.chavannes@gmail.com>
 * http://jchavannes.com/jquery-timer
 *
 * Written by NetRelations
 */
(function ($) {
	"use strict";
	$.extend({
		fuzzyTimes: function (o) {
			var defaults = {
				refreshInterval: 5000,
				dataField: "timestamp",
				className: "fuzzytime"
			};
			var options = $.extend(defaults, o);

			if (options.className.indexOf(".") === 0) {
				options.className = options.className.substring(1);
			}

			// Do a pre init so the user won't see any old values
			methods.Init(options);

			// Only activate timer if the js-file is included
			if (jQuery.isFunction(jQuery.timer)) {
				$.timer(function () {
					methods.Init(options);
				}).set({
					time: options.refreshInterval,
					autostart: true
				});
			} else {
				// TODO: Add error handling?
			}
		}
	});

	var methods = {
		Init: function (options) {
			$("." + options.className).each(function () {
				$(this).html(methods.Format($(this).data(options.dataField)));
			});
		},
		Format: function (input) {

			// Get current time in milliseconds
			var now = new Date().getTime();

			// Calculate the elapsed amount of milliseconds
			var ms = parseInt(now, 10) - parseInt(input, 10);

			// Labels
			var suffixText = "sedan";
			var secondText = "Någon sekund";
			var secondsText = "Mindre än 1 minut";
			var minuteText = "Omkring 1 minut";
			var minutesText = "%d minuter";
			var hourText = "Omkring 1 timme";
			var hoursText = "Omkring %d timmar";
			var dayText = "1 dag";
			var daysText = "%d dagar";
			var monthText = "Omkring 1 månad";
			var monthsText = "%d månader";
			var yearText = "Omkring 1 år";
			var yearsText = "%d år";
			var separator = " ";

			var numbers = [];
			var seconds = Math.abs(ms) / 1000;
			var minutes = seconds / 60;
			var hours = minutes / 60;
			var days = hours / 24;
			var years = days / 365;

			// Format the predefined labels
			function formatText(stringOrFunction, number) {
				var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, ms) : stringOrFunction;
				var value = (numbers && numbers[number]) || number;
				return string.replace(/%d/i, value);
			}

			// Determin what text should show
			var words = seconds < 15 && formatText(secondText, Math.round(seconds)) ||
						seconds < 45 && formatText(secondsText, Math.round(seconds)) ||
						seconds < 90 && formatText(minuteText, 1) ||
						minutes < 45 && formatText(minutesText, Math.round(minutes)) ||
						minutes < 90 && formatText(hourText, 1) ||
						hours < 24 && formatText(hoursText, Math.round(hours)) ||
						hours < 42 && formatText(dayText, 1) ||
						days < 30 && formatText(daysText, Math.round(days)) ||
						days < 45 && formatText(monthText, 1) ||
						days < 365 && formatText(monthsText, Math.round(days / 30)) ||
						years < 1.5 && formatText(yearText, 1) ||
						formatText(yearsText, Math.round(years));

			// Return the correct format
			return $.trim([words, suffixText].join(separator));
		}
	};
})(jQuery);