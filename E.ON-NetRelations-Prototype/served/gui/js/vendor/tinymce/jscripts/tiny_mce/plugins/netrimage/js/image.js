var ImageDialog = {
	preInit: function () {
		var url;
		tinyMCEPopup.requireLangPack();
		if (url = tinyMCEPopup.getParam("external_image_list_url"))
			document.write('<script language="javascript" type="text/javascript" src="' + tinyMCEPopup.editor.documentBaseURI.toAbsolute(url) + '"></script>');
	},

	init: function (ed) {
		var f = document.forms[0], nl = f.elements, ed = tinyMCEPopup.editor, dom = ed.dom, n = ed.selection.getNode();

		tinyMCEPopup.resizeToInnerSize();
		this.fillClassList('class_list');
		TinyMCE_EditableSelects.init();

		if (n.nodeName == 'IMG') {
			nl.src.value = dom.getAttrib(n, 'src');
			nl.alt.value = dom.getAttrib(n, 'alt');
			nl.title.value = dom.getAttrib(n, 'title');
			selectByValue(f, 'class_list', dom.getAttrib(n, 'class'), true, true);
			nl.longdesc.value = dom.getAttrib(n, 'longdesc');
			nl.insert.value = ed.getLang('update');
		}

		// Setup browse button
		document.getElementById('srcbrowsercontainer').innerHTML = getBrowserHTML('srcbrowser', 'src', 'image', 'theme_advanced_image');
		if (isVisible('srcbrowser'))
			document.getElementById('src').style.width = '260px';
		this.showPreviewImage(nl.src.value, 1);
	},

	insert: function (file, title) {
		var ed = tinyMCEPopup.editor, t = this, f = document.forms[0];
		if (f.src.value === '') {
			if (ed.selection.getNode().nodeName == 'IMG') {
				ed.dom.remove(ed.selection.getNode());
				ed.execCommand('mceRepaint');
			}
			tinyMCEPopup.close();
			return;
		}

		if (tinyMCEPopup.getParam("accessibility_warnings", 1)) {
			if (!f.alt.value) {
				tinyMCEPopup.confirm(tinyMCEPopup.getLang('netrimage_dlg.missing_alt'), function (s) {
					if (s)
						t.insertAndClose();
				});
				return;
			}
		}
		t.insertAndClose();
	},

	insertAndClose: function () {
		var ed = tinyMCEPopup.editor, f = document.forms[0], nl = f.elements, v, args = {}, el;
		tinyMCEPopup.restoreSelection();
		// Fixes crash in Safari
		if (tinymce.isWebKit)
			ed.getWin().focus();
		tinymce.extend(args, {
			src: nl.src.value,
			alt: nl.alt.value,
			title: nl.title.value,
			'class': getSelectValue(f, 'class_list'),
			longdesc: nl.longdesc.value
		});

		el = ed.selection.getNode();
		if (el && el.nodeName == 'IMG') {
			ed.dom.setAttribs(el, args);
		} else {
			ed.execCommand('mceInsertContent', false, '<img id="__mce_tmp" />', { skip_undo: 1 });
			ed.dom.setAttribs('__mce_tmp', args);
			ed.dom.setAttrib('__mce_tmp', 'id', '');
			ed.undoManager.add();
		}

		//here, no dots have been appended to the src string
		tinyMCEPopup.close();
	},

	getAttrib: function (e, at) {
		var ed = tinyMCEPopup.editor, dom = ed.dom, v, v2;
		if (v = dom.getAttrib(e, at))
			return v;
		return '';
	},

	fillClassList: function (id) {
		var dom = tinyMCEPopup.dom, lst = dom.get(id), v, cl;
		if (v = tinyMCEPopup.getParam('netrimage_classes')) {
			cl = [];
			tinymce.each(v.split(';'), function (v) {
				var p = v.split('=');
				cl.push({ 'title': p[0], 'class': p[1] });
			});
		} else
			cl = tinyMCEPopup.editor.dom.getClasses();
		if (cl.length > 0) {
			lst.options.length = 0;
			lst.options[lst.options.length] = new Option(tinyMCEPopup.getLang('not_set'), '');
			tinymce.each(cl, function (o) {
				lst.options[lst.options.length] = new Option(o.title || o['class'], o['class']);
			});
		} else
			dom.remove(dom.getParent(id, 'tr'));
	},

	updateImageData: function (img, st) {
		var f = document.forms[0];
		this.preloadImg = img;
	},

	showPreviewImage: function (u, st) {
		if (!u) {
			tinyMCEPopup.dom.setHTML('prev', '');
			return;
		}
		u = tinyMCEPopup.editor.documentBaseURI.toAbsolute(u);
		if (!st)
			tinyMCEPopup.dom.setHTML('prev', '<img id="previewImg" src="' + u + '" border="0" onload="ImageDialog.updateImageData(this);" />');
		else
			tinyMCEPopup.dom.setHTML('prev', '<img id="previewImg" src="' + u + '" border="0" onload="ImageDialog.updateImageData(this, 1);" />');
	}
};
ImageDialog.preInit();
tinyMCEPopup.onInit.add(ImageDialog.init, ImageDialog);