module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                files: {
                    'public/js/create.min.js': 'public/js/create.js',
                    'public/js/host.min.js': 'public/js/host.js',
                    'public/js/hostGame.min.js': 'public/js/hostGame.js',
                    'public/js/index.min.js': 'public/js/index.js',
                    'public/js/lobby.min.js': 'public/js/lobby.js',
                    'public/js/playerGame.min.js': 'public/js/playerGame.js',
                    'public/js/quizCreator.min.js': 'public/js/quizCreator.js',
                    'public/js/libs/deparam.min.js': 'public/js/libs/deparam.js',
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    'public/css/create.min.css': 'public/css/create.css',
                    'public/css/host.min.css': 'public/css/host.css',
                    'public/css/hostGameView.min.css': 'public/css/hostGameView.css',
                    'public/css/index.min.css': 'public/css/index.css',
                    'public/css/lobby.min.css': 'public/css/lobby.css',
                    'public/css/playerGameView.min.css': 'public/css/playerGameView.css',
                    'public/css/quizCreator.min.css': 'public/css/quizCreator.css',
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['uglify', 'cssmin']);
}