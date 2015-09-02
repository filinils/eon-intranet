$(function () {
	$("#grid").gridCreator({onUpdate: function(row, col){$('#tableValue').val(row + '|' + col);PreviewTable();}});
	$('#hideheader').bind('click', function(){
		PreviewTable();
	});
});

function BuildTable(preview){
	var rowCount = $('#tableValue').val().split("|")[0];
	var colCount = $('#tableValue').val().split("|")[1];

	var htmlHeader = '<thead><tr>{0}</tr></thead>';
	var htmlHeaderCell = '<th scope="col">{0}</th>';
	var htmlBodyRow = '<tr>{0}</tr>';
	var htmlBodyCell = '<td>{0}</td>';
	var htmlTable = "<table>{0}<tbody>{1}</tbody></table>";

	var cols = [];
	var rows = [];

	if(preview){
		htmlHeaderCell = htmlHeaderCell.replace('{0}','TH');
		htmlBodyCell = htmlBodyCell.replace('{0}','TD');
	}else{
		htmlHeaderCell = htmlHeaderCell.replace('{0}','');
		htmlBodyCell = htmlBodyCell.replace('{0}','');
	}

	if(!$('#hideheader').is(':checked')){
		for (col = 0; col <= colCount; col++) {
			cols.push(htmlHeaderCell);
		}
		htmlHeader = htmlHeader.replace('{0}', cols.join(''));
		cols = [];
	}else{
		htmlHeader = '';
	}

	for (col = 0; col <= colCount; col++) {
		cols.push(htmlBodyCell);
	}
	htmlBodyRow = htmlBodyRow.replace('{0}', cols.join(''));

	for (row = 0; row <= rowCount; row++) {
		rows.push(htmlBodyRow);
	}
	htmlTable = htmlTable.replace('{0}',htmlHeader);
	htmlTable = htmlTable.replace('{1}',rows.join(''));

	$('#preview').html(htmlTable);

	return htmlTable;
}

function PreviewTable(){
	$('#preview').html(BuildTable(true));
}

function InsertTable(){
	var activeEditor = tinyMCEPopup.editor;
	var htmlTable = BuildTable(false).replace(/^(&nbsp;|<br>)+/, '');
	
	if (tinymce.isGecko) {
		tinyMCEPopup.execCommand("insertHTML", false, htmlTable);
	} else {
		if (tinymce.isIE && ed.selection.getSel().type === "Control") {
			tinyMCEPopup.dom.setOuterHTML(tinyMCEPopup.selection.getSel().createRange().item(0), htmlTable);
		} else {
			tinyMCEPopup.execCommand("mceInsertContent", false, htmlTable);
		}
	}
	
	tinyMCEPopup.editor.setContent(tinyMCEPopup.editor.getContent({source_view : true}), {source_view : true});
	tinyMCEPopup.close();
}