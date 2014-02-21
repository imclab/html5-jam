module.exports = function(grunt) {

    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);


    // Project Configuration
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['gruntfile.js', '*.js', 'lib/*.js', 'lib/**/*.js']
        },
        jsduck: {
            main: {
                // source paths with your code
                src: [
                    'lib/routes/*.js',
                    'lib/models/*.js'
                ],

                // docs output dir
                dest: 'docs',

                // extra options
                options: {
                    'builtin-classes': true,
                    'warnings': ['-no_doc', '-dup_member', '-link_ambiguous'],
                    'external': ['XMLHttpRequest']
                }
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsduck');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint']);

};
