/** 
@namespace Utility methods for arrays
*/
netr.array = {

	/**
	Finds and returns first value index that matches function
	@param {Array} arr Array to look in
	@param {Function} fun Callback for matching. Will get three parameters: current value, current index and array reference
	@returns The value of the first item in the array for which the callback function returns true
	*/
	first: function (arr, fun) {
		var i = 0;
		var len = arr.length;
		var ret;

		if (len) {
			do {
				var val = arr[i];

				if (fun(val, i, arr)) {
					ret = val;
				}

				i++;
			} while (typeof ret === 'undefined' && i < len)
		}

		return ret || null;
	}

};