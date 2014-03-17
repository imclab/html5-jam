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
        jam: {
            app: 'app',
            dist: 'dist',
            build: 'build'
        },
        watch: {
            compass: {
                files: ['<%= jam.app %>/styles/{,*/}*css'],
                tasks: ['clean:css', 'compass:server', 'autoprefixer:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= jam.app %>/*.html',
                    '<%= jam.app %>/templates/**/*.html',
                    '.tmp/styles/*.css',
                    '{.tmp,<%= jam.app %>}/scripts/**/*.js',
                    '<%= jam.app %>/images/{,*/,*/*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            jst: {
                files: [
                    '<%= jam.app %>/templates/*.html'
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
                    port: 3000,
                    https: false,
                    changeOrigin: true,
                    rewrite: {
                        '^/api': ''
                    }
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
                        '<%= jam.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= jam.dist %>',
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
                        '<%= jam.dist %>/*',
                        '!<%= jam.dist %>/.git*'
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
                '<%= jam.app %>/scripts/{,*/}*.js',
                '!<%= jam.app %>/scripts/vendor/*',
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
                    cwd: '<%= jam.dist %>/styles',
                    src: '{,*/}*.css',
                    dest: '<%= jam.dist %>/styles/'
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
                    out: '<%= jam.dist %>/scripts/main.js',
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
                html: '<%= jam.app %>/index.html',
                ignorePath: '<%= jam.app %>/'
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= jam.dist %>/scripts/{,*/}*.js',
                        '<%= jam.dist %>/styles/{,*/}*.css',
                        '<%= jam.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    ]
                }
            },
        },
        useminPrepare: {
            options: {
                dest: '<%= jam.dist %>'
            },
            html: '<%= jam.app %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= jam.dist %>']
            },
            html: ['<%= jam.dist %>/{,*/}*.html', '.tmp/scripts/templates.js'],
            //css: ['<%= jam.dist %>/styles/{,*/}*.css']
            css: ['.tmp/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= jam.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= jam.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= jam.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= jam.dist %>/images'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= jam.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= jam.app %>/images',
                javascriptsDir: '<%= jam.app %>/scripts',
                fontsDir: '<%= jam.app %>/styles/fonts',
                importPath: 'bower_components',
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
                        '<%= jam.app %>/styles/{,*/}*.css',
                        '.tmp/styles/*.css'
                    ]
                }
            },
            dist: {
                files: {
                    '<%= jam.dist %>/styles/main.css': [
                        '<%= jam.app %>/styles/**/*.css',
                        '.tmp/styles/**/*.css'
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
                    cwd: '<%= jam.app %>',
                    src: '*.html',
                    dest: '<%= jam.dist %>'
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
                    '<%= jam.dist %>/index.html': ['<%= jam.dist %>/index.html']
                }
            },
            appcache: {
                options: {
                    variables: {
                        '<html lang="en">': '<html lang="en" manifest="' + date + '.jam.appcache">'
                    },
                    prefix: '<!--@@Add appcache-->'
                },
                files: {
                    '<%= jam.dist %>/index.html': ['<%= jam.dist %>/index.html']
                }
            }
        },
        // Put files not handled in other tasks here
        copy: {
            tmp: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= jam.app %>',
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
                    cwd: '<%= jam.app %>',
                    dest: '<%= jam.dist %>',
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
                cwd: '<%= jam.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= jam.app %>/scripts/main.js'
            }
        },
        jst: {
            options: {
                amdWrapper: true
            },
            compile: {
                files: {
                    '.tmp/scripts/templates.js': ['<%= jam.app %>/templates/*.html']
                }
            }
        },
        modernizr: {
            devFile: 'bower_components/modernizr/modernizr.js',
            outputFile: '<%= jam.dist %>/scripts/vendor/modernizr.js',
            files: [
                '<%= jam.dist %>/scripts/{,*/}*.js',
                '<%= jam.dist %>/styles/{,*/}*.css',
                '!<%= jam.dist %>/scripts/vendor/*'
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
                    '<%= jam.dist %>/scripts/main.js': ['<%= jam.dist %>/scripts/main.js']
                }
            }
        },
        appcache: {
            options: {
                basePath: 'dist'
            },
            dist: {
                dest: '<%= jam.dist%>/' + date + '.jam.appcache',
                cache: '<%= jam.dist %>/{*.html,images/**/*,scripts/**/*,styles/**/*}',
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
