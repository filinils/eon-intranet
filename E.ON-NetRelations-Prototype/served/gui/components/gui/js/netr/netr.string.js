/** 
@namespace Utility methods for strings
*/
netr.string = {

	/**
	 * Formats a string.
	 * Unlimited number of parameters, replaces {0} with first argument after string, {1} with second argument, and so forth
	 * @example netr.string.format("Hello {0}, this is {1}", "world", "nice"); // => "Hello world, this is nice"
	 *
	 * @param {String} string String to perform formatting on
	 * @returns {String} A new string with formatting done
	 */
	format: function(string) {
		var args = arguments;
		return string.replace(/{(\d+)}/g, function(o, m) {
			return args[parseInt(m, 10) + 1];
		});
	},

	/**
	 * Returns new string with first letter in uppercase and all the rest in lowercase
	 *
	 * @param {String} string String to capitalize
	 * @returns {String} A new string with capitalizing done
	 */
	capitalize: function(string) {
		return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
	},

	/**
	 * Test if a string is one of a bunch of strings.
	 * Unlimited number of parameters
	 * @example netr.string.isOneOf(el.tagName, 'A', 'SPAN', 'IMG');
	 *
	 * @param {String} string String to check
	 * @returns {Boolean} True if one of the arguments is the same as string
	 */
	isOneOf: function (string) {
		var args = $.makeArray(arguments);
		// Remove first argument
		args.shift();
		return $.inArray(string.toString(), args) > -1;
	},

	/**
	 * Removes hash part of url
	 *
	 * @param {String} string String to strip hash from
	 * @returns {String} A new string without the hash part
	 */
	stripHash: function (string) {
		return string.replace(/#.+$/, '');
	},

	/**
	 * Replace placehoders in string with corresponding keys from Object o
	 * @example netr.string.supplant('Hello {place}! I\'m {name}', {place: 'World', name: 'Pete'}) // => 'Hello World! I'm Pete'
	 *
	 * @param {String} string String to format
	 * @param {Object} o Object with keys corresponding to placeholders in string
	 */
	supplant: function (string, o) {
		return string.replace(/{([^{}]*)}/g,
			function (a, b) {
				var r = o[b];
				return typeof r === 'string' || typeof r === 'number' ? r : a;
			}
		);
	},

	/**
	 * Trim leading and trailing whitespace
	 *
	 * @param {String} string String to trim
	 * @returns {String} Trimmed string
	 */
	trim: function (string) {
		return string.replace(/^\s+(.*)\s+/, '$1');
	},

	/* Object containing string translations */ 
	translations: {},

	/**
	 * Add translated strings
	 * @param {Object} obj An object where keys are placeholder strings and values are translated strings
	 */
	addTranslations: function (obj) {
		$.each(obj, function (key, val) {
			netr.string.translations[key] = val;
		});
	},

	/**
	 * Get the translation for a string
	 *
	 * @param {String} string String to translate
	 * @returns {String} The translated string if found, or else the supplied string as a fallback
	 */
	translate: function (string) {
		var ret = netr.string.translations;
		var steps = string.split('.');
		var i = 0;

		function lostInTranslation () {
			ret = '[' + string + ']';
			if (typeof console != 'undefined' && console.warn) {
				console.warn('Missing translation for: [' + string + ']');
			}
		}

		try {
			while (steps[i]) {
				ret = ret[steps[i]];
				i++;
			}
		} catch (e) {
			lostInTranslation();
		}

		if (!ret) {
			lostInTranslation();
		}

		return ret;
	}

};