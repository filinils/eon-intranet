// -------------------------------------------------------------------------
// Requirements
//
// -------------------------------------------------------------------------

var gulp           = require('gulp'),
    $              = require('gulp-load-plugins')(),
    glob           = require('glob'),
    del            = require('del'),
    stylish        = require('jshint-stylish'),
    sequence       = require('run-sequence'),
    browserSync    = require('browser-sync'),
    pkg            = require('./package.json'),
    mainBowerFiles = require('main-bower-files'),
    wiredep        = require('wiredep').stream,
    path           = require('path'),
    chalk          = require('chalk'),
    reload         = browserSync.reload,
    separator      = chalk.black.bold('‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧');


// -------------------------------------------------------------------------
// Paths
//
// -------------------------------------------------------------------------

// Paths to all source files
var baseSrc = 'eon-intranet/';
var srcFiles = {
    all:          [baseSrc + '**/*'],
    scripts:      [baseSrc + 'gui/js/**/*.js'],
    styles:       [baseSrc + 'gui/css/**/*.scss', 
                   baseSrc + 'gui/css/**/*.css', 
                   '!' + baseSrc + 'gui/css/**/*_scsslint_tmp*.scss', 
                   '!' + baseSrc + 'gui/css/**/*.scss___jb_bak___'],
    mainSass:     [baseSrc + 'gui/css/styles.scss'],
    bowerStyles:  [baseSrc + 'gui/css/_bower.scss'],
    images:       [baseSrc + 'gui/i/**/*.{jpg,png,gif,svg,webp}'],
    vendor:       ['vendor/**/*'],
    svg:          [baseSrc + 'gui/i/svg/**/*.svg'],
    fonts:        [baseSrc + 'gui/fonts/*.{eot,woff,ttf,otf,svg}'],
    html:         [baseSrc + '**/*.{html,php}'],
    temp:         [baseSrc + 'temp/**/*'],
    components:   [baseSrc + '**/*'],    
    bowerScripts: [baseSrc + 'html_partials/bower-scripts.html']
};

// Paths to where dev files should be placed
var basePath = 'served/';
var destPaths = {
    base:          basePath,
    scripts:       basePath + 'gui/js/',
    styles:        basePath + 'gui/css/',
    images:        basePath + 'gui/i/',
    components:    basePath + 'gui/components/',
    fonts:         basePath + 'gui/fonts/',
    includes:      basePath + 'includes/', 
    temp:          basePath + 'temp/', 
    html:          basePath
};

/*==========================================================================
 ===========================================================================
 Single tasks
 ===========================================================================
 ===========================================================================*/


// -------------------------------------------------------------------------
// Clean
// - Removes files in specified folder
// -------------------------------------------------------------------------

gulp.task('clean', del.bind(null, [destPaths.base]));


// -------------------------------------------------------------------------
// Scripts
//
// -------------------------------------------------------------------------

gulp.task('scripts', function() {
    return gulp.src(srcFiles.scripts)
//        .pipe($.jshint())
//        .pipe($.jshint.reporter('jshint-stylish'))
//        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
        .pipe(gulp.dest(destPaths.scripts))
        .pipe(reload({stream: true}))
        //.pipe(gulp.dest(epiPaths.scripts));
});


// -------------------------------------------------------------------------
// Move Bower files
// - Move bower files from bower_components to dev/scripts/vendor
// - see https://www.npmjs.org/package/main-bower-files
// -------------------------------------------------------------------------

gulp.task('move:BowerFiles', function() {
    return gulp.src(mainBowerFiles({filter: '**/*.js'}))
        //.pipe($.concat('vendor.js'))
        .pipe(gulp.dest(destPaths.scripts + 'vendor/'))
        //.pipe(gulp.dest(epiPaths.scripts + 'vendor/'))
});


// -------------------------------------------------------------------------
// Styles
//
// -------------------------------------------------------------------------

gulp.task('styles', /*['scss-lint'],*/ function() {
    
    return gulp.src(srcFiles.styles)        
        .pipe(gulp.dest(destPaths.styles))
        .pipe(reload({stream: true}));
/*    
    return gulp.src(srcFiles.mainSass)
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .on('error', function(error) {
            var fileName = error.fileName.split('/');
            fileName = fileName[fileName.length - 1];

            $.util.beep();
            console.error(error.toString());
            $.notify().write({message: 'Error in ' + fileName + ':' + error.lineNumber + '\n' + error.message});
            this.emit('end');
        })
        .pipe($.autoprefixer('last 2 version', '> 1%', 'ie 8'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(destPaths.styles))
        .pipe(reload({stream: true}))
        //.pipe(gulp.dest(epiPaths.styles))
        .pipe($.size({
            title: 'styles'
        }));
*/        
});


// -------------------------------------------------------------------------
// SCSS linting
//
// -------------------------------------------------------------------------

var scssLintReporter = function(file) {
    if (file.scsslint.success) {
        return false;
    }

    var issueCount = file.scsslint.issues.length,
        relativePath = file.path.replace(file.cwd, '');

    $.util.beep();
    $.notify().write({message: issueCount + ' issue(s) in SCSS'});
    $.util.log(issueCount + ' issues found in ' + relativePath);

    // Loop through the warnings/errors and spit them out
    file.scsslint.issues.forEach(function(result) {
        var msg =
                chalk.cyan('\n' + relativePath) + ':' +
                chalk.red(result.line) + '\n' +
                (result.severity === 'error' ? chalk.red('❌ [Error]') : chalk.yellow('⚠️ [Warning]')) + ' ' +
                result.reason;
        $.util.log(msg);
    });
};

// Exclude Normalize and temp files from linting
var lintExclusions = ['**/*normalize.scss', '**/*.scss___jb_bak___', '**/*_scsslint_tmp*.scss'];

gulp.task('scss-lint', function() {

    // log a separator to more easily distinguish old warnings/errors from new ones in console output
    console.log(separator);

    return gulp.src(baseSrc + 'styles/**/*.scss')
        .pipe($.ignore.exclude(lintExclusions))
        //.pipe($.debug())
        .pipe($.cached('scsslint'))
        .pipe($.scssLint({
            config:       '../.scss-lint.yml',
            customReport: scssLintReporter
        }))
});


// -------------------------------------------------------------------------
// Extract styles to separate CSS files
// – for previews in EPi edit mode
// -------------------------------------------------------------------------

// RegEx which only keeps content between « /* @extract:<type>start */ » and « /* @extract:<type>end */ » comments
var extractButtonsRe = /(.|\n|\r)*?(?:\/\* @extract:buttons:start \*\/)|((?=\/\* @extract:buttons:end \*\/)(.|\n|\r)*)/g,
    extractTablesRe  = /(.|\n|\r)*?(?:\/\* @extract:tables:start \*\/)|((?=\/\* @extract:tables:end \*\/)(.|\n|\r)*)/g;

// ----------------------------------
// Button styles
// ----------------------------------

gulp.task('button-css', function() {
    return gulp.src(destPaths.styles + '/styles.css')
        .pipe($.replace(extractButtonsRe, ''))
        .pipe($.rename(function(path) {
            path.basename = 'ButtonSettings';
        }))
        //.pipe(gulp.dest(epiPaths.editorScripts))
});


// ----------------------------------
// Table styles
// ----------------------------------

gulp.task('table-css', function() {
    return gulp.src(destPaths.styles + '/styles.css')
        .pipe($.replace(extractTablesRe, ''))
        .pipe($.replace('table', '.bambora-table-editor table')) // set a namespace for EPi edit mode
        .pipe($.replace('rem;', 'em;')) // adjust to epi edit mode 
        .pipe($.rename(function(path) {
            path.basename = 'TableEditor';
        }))
        //.pipe(gulp.dest(epiPaths.editorScripts))
});


// -------------------------------------------------------------------------
// SVG sprite
// - Generate svg spritemap and accompanying .scss-file
// -------------------------------------------------------------------------

svgSpriteConfig = {
    transform: [
        {
            svgo: { // settings passed to SVGO
                multipass: true,
                plugins:   [
                    {removeTitle: true},
                    {removeDesc: true}
                ]
            }
        }
    ],
    shape:     {
        id: {
            generator: 'symbol-%s' // set the symbol id (%s == filename without extension)
        }
    },
    mode:      {
        symbol: { // use the «symbol» mode: https://github.com/jkphl/svg-sprite/blob/master/docs/configuration.md#defs--symbol-mode
            dest:       '.', // make output destination relative to «gulp.dest()»
            dimensions: '%s', // don't add the default "-dims" string, just use the value from «prefix»
            prefix:     '.svg-symbol.%s', // selectors used in SCSS output
            sprite:     'sprite/svg-symbols.svg', // .svg sprite output path
            render:     {
                scss: {
                    dest:     'styles/components/_svg-symbols.scss', // .scss output path
                    template: baseSrc + 'templates/svg-symbols-template.scss' // path to custom SCSS output template file
                }
            }
        }
    }
};

gulp.task('svg-sprite', function() {
    gulp.src(srcFiles.svg)
        .pipe($.svgSprite(svgSpriteConfig))
        .pipe($.imagemin({ // pipe to imagemin so SVGO runs again, reducing the size of the sprite even more
            multipass:   true,
            svgoPlugins: [{cleanupIDs: false}]
        }))
        .pipe(gulp.dest('src'))
        .pipe($.filter('**/*.svg')) // output only the .svg file to the dev/EPi paths
        .pipe($.size({
            title: 'SVG sprite'
        }))
        .pipe($.rename(function(file) {
            file.dirname = '';
        }))
        .pipe(gulp.dest(destPaths.sprites))
        //.pipe(gulp.dest(epiPaths.sprites));
});

// this task can be run when all you want to do is add a new svg-file to the sprite
gulp.task('new-symbol', function(cb) {
    sequence('svg-sprite', 'wiredep-styles', 'styles', cb);
});


// -------------------------------------------------------------------------
// Images
// - Move images
// -------------------------------------------------------------------------

gulp.task('images', function() {
    return gulp.src(srcFiles.images)
        .pipe($.ignore.exclude('**/svg/*')) // skip moving individual SVG files since they're only used via the sprite
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced:  true
        })))
        .pipe(gulp.dest(destPaths.images))
        .pipe($.ignore.exclude('**/dummy/*')) // skip moving dummy images to the EPi content folder
        //.pipe(gulp.dest(epiPaths.images))
        .pipe($.size({
            title: 'images'
        }));
});

// Clears the Gulp cache
gulp.task('clear-cache', function(done) {
    return $.cache.clearAll(done);
});


// -------------------------------------------------------------------------
// HTML
// - include files into HTML pages
// -------------------------------------------------------------------------

gulp.task('html', function() {
    return gulp.src(srcFiles.html)
        .pipe($.fileInclude())
        .on('error', function(err) {
            $.util.beep();
            console.log(err.toString());
            this.emit('end');
        })
        .pipe($.ignore.exclude('**/html_partials/**/*'))
        .pipe(gulp.dest(destPaths.html))
        .pipe(reload({stream: true}))
});


// -------------------------------------------------------------------------
// wiredep scripts
// - include script tags from Bower dependencies
// - more info: https://github.com/taptapship/wiredep
// -------------------------------------------------------------------------

gulp.task('wiredep-scripts', function() {
    return gulp.src(srcFiles.bowerScripts)
        .pipe(wiredep({
            exclude:    pkg.bowerExclude, // excludes defined in package.json
            ignorePath: /^(.*[\\\/])/, // remove everything in the path until the last "/" character
            fileTypes:  {
                html: {
                    replace: {
                        js: '<script src="' + destPaths.vendorScripts.split(destPaths.base)[1] + '{{filePath}}"></script>' // modify the path for the temp folder which files are served from
                    }
                }
            }
        }))
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));
});


// -------------------------------------------------------------------------
// wiredep styles
// - @import SCSS and CSS files from Bower dependencies
// - more info: https://github.com/taptapship/wiredep
// -------------------------------------------------------------------------

gulp.task('wiredep-styles', function() {

    // if there are Bower packages which have .css-files as their «main» files,
    // make a copy with an ".scss" extension so they can be @imported via Sass
    var cssFiles = require('wiredep')().css;

    gulp.src(cssFiles)
        .pipe($.rename(function(file) {
            if (file.extname === '.css') {
                file.extname = '.scss';
            }
        }))
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));

    return gulp.src(srcFiles.bowerStyles)
        .pipe(wiredep({
            fileTypes: {
                scss: {
                    replace: {
                        scss: function(filePath) {
                            // modify path for proper SCSS partial @import syntax...
                            var lastUnderScoreRe = /_(?=[^_]*$)/,// ...remove last occurrence of underscore, i.e. in the filename
                                fileExtensionRe = /\.scss$/; // ...remove file extension

                            filePath = filePath.replace(lastUnderScoreRe, '');
                            filePath = filePath.replace(fileExtensionRe, '');

                            return '@import \'' + filePath + '\';';
                        },
                        css:  function(filePath) {
                            var fileExtensionRe = /\.css$/; // ...remove file extension
                            filePath = filePath.replace(fileExtensionRe, '');

                            return '@import \'' + filePath + '\';';
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));
});


// -------------------------------------------------------------------------
// Watch task
// - Watches files being changed and compiles/moves them accordingly
// -------------------------------------------------------------------------

gulp.task('watch', function() {

    var openBrowser = process.env.NODE_ENV !== 'noopen';

    browserSync({
        open:   openBrowser,
        notify: false,
        //proxy: 'my-custom-host.local'
        server: {
            baseDir: [destPaths.base]
        }
    });
    gulp.watch(srcFiles.scripts, ['scripts']);
    gulp.watch(srcFiles.styles, ['styles']);
    gulp.watch(srcFiles.images, ['images']);
    gulp.watch(srcFiles.html, ['html']);
});


/*==========================================================================
 ===========================================================================
 Sequenced tasks
 ===========================================================================
 ===========================================================================*/


gulp.task('fonts', function() {
    return gulp.src(srcFiles.fonts)        
        .pipe(gulp.dest(destPaths.fonts))
        .pipe(reload({stream: true}));      
});

gulp.task('components', function() {
    return gulp.src(srcFiles.components)        
        .pipe(gulp.dest(destPaths.components))
        .pipe(reload({stream: true}));      
});

gulp.task('temp', function() {
    return gulp.src(srcFiles.temp)        
        .pipe(gulp.dest(destPaths.temp))
        .pipe(reload({stream: true}));      
});

gulp.task('intranet', function(cb) {
    sequence(['html', 'images', 'styles', 'scripts', 'fonts', 'temp', 'components'], 'watch', cb);
});

gulp.task('innovation', function(cb) {
    baseSrc = 'eon-intranet-innovationsprototyp/';
    sequence('intranet', cb);
});

gulp.task('production', function(cb) {
    baseSrc = 'eon-intranet-produktionsprototyp/';    
    sequence('intranet', cb);
});

gulp.task('default', ['intranet']);
