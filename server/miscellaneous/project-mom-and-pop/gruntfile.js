/**
 * Gruntfile
 */
'use strict';

/**
 * Start Gruntfile
 */
module.exports = function(grunt) {
  /**
   * Grunt Configuration
   */
  grunt.initConfig({
    jshint: {
      all: {
        src: ['./*.js', './controllers/**/*.js', './helpers/**/*.js', './services/**/*.js', './models/**/*.js'],
        options: {
          jshintrc: true
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['tests/*.js']
      }
    },
    nodemon: {
      dev: {
        script: 'server.js'
      }
    }
  });

  /**
   * Load Grunt Plugins
   */
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');

  /**
   * Register Grunt Tasks
   */
  grunt.registerTask('default', ['jshint', 'nodemon']);
  grunt.registerTask('test', 'mochaTest');
};
