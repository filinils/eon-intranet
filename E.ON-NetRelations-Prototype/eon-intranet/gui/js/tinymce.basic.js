// TinyMCE for User News
// Initialize TinyMCE
var basic = {
	// General options
	mode : "specific_textareas",
	language : $('html').attr('lang'),
	editor_selector: "wysiwyg",
	theme : "advanced",
	plugins : "autoresize,advlink,paste",
	paste_auto_cleanup_on_paste : true,
	valid_elements : "a[href|target],strong/b,em/i,br,ul,ol,li,-p",
	width : "100%",

	// Theme options
	theme_advanced_buttons1 : "bold,|,bullist,numlist,|,link,unlink|",
	theme_advanced_buttons2 : "",
	theme_advanced_buttons3 : "",
	theme_advanced_buttons4 : "",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_path : false,
	theme_advanced_resizing : false,
	body_class : "module-text",
	content_css : "/gui/css/mail-editor.css",
};

var userArticle = tinymce.extend({}, basic, {
	plugins : "table,autoresize,advlink,paste",
	valid_elements : "h2,h3,h4,img[*],table,thead,tbody,tr,th,td,a[href|target],strong/b,em/i,br,ul,ol,li,-p",
	theme_advanced_buttons1: "formatselect,h1,h2,h3,h4,|,bold,italic,removeformat,|,bullist,numlist",
	theme_advanced_buttons2 : "cut,copy,|,undo,redo",
	theme_advanced_blockformats : "p,h1,h2,h3,h4",
});

$(function(){
	if($('#user-article').size()) {
		tinyMCE.init(userArticle);
	} else {
		tinyMCE.init(basic);
	}
});