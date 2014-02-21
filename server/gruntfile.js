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
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint']);

};
