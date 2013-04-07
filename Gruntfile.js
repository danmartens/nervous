module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: ['src/nervous.js', 'src/nervous.object.js'],
        dest: 'dist/nervous.js'
      }
    },

    shell: {
      mochaPhantom: {
        command: 'clear && mocha-phantomjs -R dot test/runner.html',
        options: {
          stdout: true
        }
      }
    },

    watch: {
      scripts: {
        files: 'test/*.js',
        tasks: ['test']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('test', ['shell:mochaPhantom']);
};