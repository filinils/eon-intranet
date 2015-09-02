tinyMCEPopup.requireLangPack();

var ContentPickerDialog = {
	init: function () {
		var f = document.forms[0];

		// Get the selected contents as text and place it in the input
		f.pagename.value = tinyMCEPopup.editor.selection.getContent({ format: 'text' });
		//f.somearg.value = tinyMCEPopup.getWindowArg('some_custom_arg');
	},

	insert: function () {
		// Insert the contents from the input into the document
		var f = document.forms[0];
		var str = "";
		jQuery("#selectedpage option:selected").each(function () {
			str += $(this).text() + " ";
		});
		var page = "<a href='" + f.selectedpage.value + "'>" + str + "</a>";
		tinyMCEPopup.editor.execCommand('mceInsertContent', false, page);
		tinyMCEPopup.close();
	},

	search: function () {
		// Check if jQuery is loaded
		if (jQuery) {
			// Search for content and display result
			var f = document.forms[0];
			var searchword = f.pagename.value;
			jQuery.post("GetPages.aspx", { searchword: searchword }, function (data) { jQuery("#searchresult").html("<select id='selectedpage' name='selectedpage'>" + data + "</select>"); });
		}
	}
};

tinyMCEPopup.onInit.add(ContentPickerDialog.init, ContentPickerDialog);
