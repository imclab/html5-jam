'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

var date = Date.now();

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // configurable paths
        wiki: {
            app: 'app',
            dist: 'dist',
            build: 'build'
        },
        watch: {
            compass: {
                files: ['<%= wiki.app %>/styles/{,*/}*css'],
                tasks: ['clean:css', 'compass:server', 'cssmin:server', 'autoprefixer:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= wiki.app %>/*.html',
                    '<%= wiki.app %>/templates/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= wiki.app %>}/scripts/**/*.js',
                    '<%= wiki.app %>/images/{,*/,*/*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            jst: {
                files: [
                    '<%= wiki.app %>/templates/*.html'
                ],
                tasks: ['jst']
            }
        },
        connect: {
            options: {
                port: 8888,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            proxies : [
                {
                    context: '/api',
                    host: '0.0.0.0',
                    port: 1337,
                    https: false,
                    changeOrigin: true
                },
                {
                    context: '/w',
                    host: 'fr.wikipedia.org',
                    port: 80,
                    https: false,
                    changeOrigin: true
                }
            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            proxySnippet,
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%= wiki.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= wiki.dist %>',
                    livereload: false
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= wiki.dist %>/*',
                        '!<%= wiki.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp',
            css: '.tmp/styles/*'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= wiki.app %>/scripts/{,*/}*.js',
                '!<%= wiki.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 0.5%', 'chrome 25', 'ie 8', 'ios 5', 'safari 5', 'ff 17', 'opera 12.1', 'bb 10', 'android 2.3']
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    // cwd: '.tmp/styles/',
                    cwd: '<%= wiki.dist %>/styles',
                    src: '{,*/}*.css',
                    dest: '<%= wiki.dist %>/styles/'
                    // dest: '.tmp/styles/'
                }]
            }
        },
        removelogging: {
            dist : {
                expand: true,     // Enable dynamic expansion.
                cwd: '.tmp',      // Src matches are relative to this path.
                src: [
                    'scripts/**/*.js',
                    'bower_components/requirejs-google-analytics/dist/GoogleAnalytics.js'
                ], // Actual pattern(s) to match.
                dest: '.tmp'  // Same dest
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    name: '../bower_components/almond/almond',
                    almond: true,
                    baseUrl: '.tmp/scripts',
                    out: '<%= wiki.dist %>/scripts/main.js',
                    //include: ['main0'],
                    //insertRequire: ['main0'],
                    optimize: 'none',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    mainConfigFile: '.tmp/scripts/config.js',
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        'bower-install': {
            app: {
                html: '<%= wiki.app %>/index.html',
                ignorePath: '<%= wiki.app %>/'
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= wiki.dist %>/scripts/{,*/}*.js',
                        '<%= wiki.dist %>/styles/{,*/}*.css',
                        '<%= wiki.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    ]
                }
            },
        },
        useminPrepare: {
            options: {
                dest: '<%= wiki.dist %>'
            },
            html: '<%= wiki.app %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= wiki.dist %>']
            },
            html: ['<%= wiki.dist %>/{,*/}*.html', '.tmp/scripts/templates.js'],
            //css: ['<%= wiki.dist %>/styles/{,*/}*.css']
            css: ['.tmp/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= wiki.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= wiki.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= wiki.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= wiki.dist %>/images'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= wiki.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= wiki.app %>/images',
                javascriptsDir: '<%= wiki.app %>/scripts',
                fontsDir: '<%= wiki.app %>/styles/fonts',
                importPath: 'app/bower_components',
                relativeAssets: true,
                debugInfo: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            server: {
                files: {
                    '.tmp/styles/main.css': [
                        '<%= wiki.app %>/styles/*.css',
                        '.tmp/styles/*.css'
                    ]
                }
            },
            dist: {
                files: {
                    '<%= wiki.dist %>/styles/main.css': [
                        '<%= wiki.app %>/styles/{,*/}*.css',
                        '.tmp/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                     /*
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                    */
                },
                files: [{
                    expand: true,
                    cwd: '<%= wiki.app %>',
                    src: '*.html',
                    dest: '<%= wiki.dist %>'
                }]
            }
        },
        // Replace 
        replace: {
            dist: {
                options: {
                    variables: {
                        '<script data-main="scripts/config" src="bower_components/requirejs/require.js">':
                            '<script src="scripts/main.js">'
                    },
                    prefix: '<!--@@Replace in build-->'
                },
                files: {
                    '<%= wiki.dist %>/index.html': ['<%= wiki.dist %>/index.html']
                }
            },
            appcache: {
                options: {
                    variables: {
                        '<html lang="en">': '<html lang="en" manifest="' + date + '.wiki.appcache">'
                    },
                    prefix: '<!--@@Add appcache-->'
                },
                files: {
                    '<%= wiki.dist %>/index.html': ['<%= wiki.dist %>/index.html']
                }
            }
        },
        // Put files not handled in other tasks here
        copy: {
            tmp: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= wiki.app %>',
                    dest: '.tmp/',
                    src: [
                        'scripts/**/*.js',
                        'bower_components/**/*.js'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= wiki.app %>',
                    dest: '<%= wiki.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'fonts/{,*/}*',
                        'styles/fonts/{,*/}*.*',
                        'scripts/json/{,*/}*.json',
                        'scripts/locales/{,*/}*.json'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= wiki.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= wiki.app %>/scripts/main.js'
            }
        },
        jst: {
            options: {
                amdWrapper: true
            },
            compile: {
                files: {
                    '.tmp/scripts/templates.js': ['<%= wiki.app %>/templates/*.html']
                }
            }
        },
        modernizr: {
            devFile: '<%= wiki.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= wiki.dist %>/scripts/vendor/modernizr.js',
            files: [
                '<%= wiki.dist %>/scripts/{,*/}*.js',
                '<%= wiki.dist %>/styles/{,*/}*.css',
                '!<%= wiki.dist %>/scripts/vendor/*'
            ],
            extensibility: {
                'prefixed': true
            }
        },
        concurrent: {
            server: [
                'cssmin:server'
            ],
            test: [
                'cssmin:server'
            ],
            dist: [
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        uglify: {
            dist: {
                files: {
                    '<%= wiki.dist %>/scripts/main.js': ['<%= wiki.dist %>/scripts/main.js']
                }
            }
        },
        appcache: {
            options: {
                basePath: 'dist'
            },
            dist: {
                dest: '<%= wiki.dist%>/' + date + '.wiki.appcache',
                cache: '<%= wiki.dist %>/{*.html,images/**/*,scripts/**/*,styles/**/*}',
                network: ['rre/rest', 'http://www.google-analytics.com/']
            }
        },
        minjson: {
            dist: {
                files: {
                    // Minify json files, cant use wildcards
                }
            }
        }
    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('createTemplateJs', [
        'createDefaultTemplate',
        'jst'
    ]);

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'configureProxies',
            'compass:server',
            'createTemplateJs',
            'concurrent:server',
            'autoprefixer:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'createTemplateJs',
        'concurrent:test',
        'autoprefixer:server',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', function (target) {
        var result = grunt.task.run([
            'clean:dist',
            'createTemplateJs',
            'compass:dist',
            'useminPrepare',
            'concurrent:dist',
            'copy:tmp',
            'removelogging:dist',
            //'rev',
            'usemin:html',
            'requirejs',
            //'concat',
            'uglify',
            'copy:dist',
            'minjson',
            'replace:dist',
            //'replace:appcache',
            'usemin:css',
            'cssmin:dist',
            'autoprefixer:dist',
            //'appcache:dist',
        ]);

        /*
         *return result && grunt.task.run([
         *    'modernizr'
         *]);
         */
    });

    grunt.registerTask('build-beta', function (target) {
        var result = grunt.task.run([
            'build'
        ]);

        return result && grunt.task.run([
            'replace:appcache',
            'appcache:dist'
        ]);
    });

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
