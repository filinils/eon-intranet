(function (tinymce) {
    tinymce.create('tinymce.plugins.EONTable', {
        init: function (ed, url) {
            // Register commands
            ed.addCommand('mceCustomTable', function () {
                ed.windowManager.open({
                    file: url + '/dialog.html',
                    width: 640,
                    height: 460,
                    inline: 0,
                    scrollbars: false,
                    resizable: false,
                    maximizable: false,
                    title: 'E.ON tabellgenerator'
                }, {
                    plugin_url: url
                });
            });
console.log(url + '/img/Table-Icon2.png');
            // Register buttons
            ed.addButton('btnEONTable',
                {
                    title: 'Skapa en E.ON tabell', 
                    cmd: 'mceCustomTable',
                    image: url + '/img/Table-Icon2.png'
                });
        },

        getInfo: function () {
            return {
                longname: 'E.ON specif tabell',
                author: 'NetRelations',
                authorurl: 'http://www.netrelations.se',
                infourl: 'http://www.netrelations.se',
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('EONTable', tinymce.plugins.EONTable);
            
})(tinymce);