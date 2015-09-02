(function () {
    tinymce.create('tinymce.plugins.EONTable', {
        init: function (ed, url) {
            // Register commands
            ed.addCommand('mceEONTable', function () {
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
            // Register buttons
            ed.addButton('etable',
                {
                    title: 'Skapa en E.ON tabell', 
                    cmd: 'mceEONTable'
                });

        },

        getInfo: function () {
            return {
                longname: 'E.ON specific tabell',
                author: 'NetRelations',
                authorurl: 'http://www.netrelations.se',
                infourl: 'http://www.netrelations.se',
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('etable', tinymce.plugins.EONTable);
            
})();