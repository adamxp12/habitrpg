module.exports = function(grunt) {

  grunt.initConfig({

    /**
     * Converts our individual image files in img/spritesmith into a unified spritesheet.
     * Note - we do two passes. One for `.customize-options.WHATEVER` for /#/options/profile/avatar, which converts
     * skins, hair, beards, etc. into 60x60 re-positioned buttons. Then we do another pass for everything (which
     * is 90x90 in the case of avatar sprites). This seems wrong to me, but it seems to works. FIXME
     */
    sprite:{
      customizer: {
        src: 'img/sprites/spritesmith/**/*.png',
        destImg: 'dist/spritesmith.png',
        destCSS: 'dist/customizer.css',
        algorithm: 'binary-tree',
        cssVarMap: function (sprite) {
          // `sprite` has `name`, `image` (full path), `x`, `y`
          //   `width`, `height`, `total_width`, `total_height`
          // EXAMPLE: Prefix all sprite names with 'sprite-'
          if (sprite.name.match(/hair|skin|beard|mustache/) || sprite.name=='head_base_0') {
            sprite.name = 'customize-option.' + sprite.name;
            sprite.x = sprite.x + 25;
            sprite.y = sprite.y + 15;
            sprite.width = 60;
            sprite.height = 60;
          }
        },
        cssOpts: {
          'cssClass': function (item) {
            return '.' + item.name;
          }
        }
      },
      main: {
        src: 'img/sprites/spritesmith/**/*.png',
        destImg: 'dist/spritesmith.png',
        destCSS: 'dist/spritesmith.css',
        algorithm: 'binary-tree',
        cssOpts: {
          'cssClass': function (item) {
            //return '.sprite-' + item.name;
            return '.' + item.name;
          }
        }
      }
    },

    cssmin: {
      dist: {
        options: {
          report: 'gzip'
        },
        files:{
          "dist/habitrpg-shared.css": [
            "dist/customizer.css",
            "dist/spritesmith.css",
            "css/backer.css",
            "css/Mounts.css",
            "css/index.css"
          ]
        }
      }
    },

    browserify: {
      dist: {
        src: ["index.js"],
        dest: "dist/habitrpg-shared.js"
      },
      options: {
        transform: ['coffeeify']
        //debug: true Huge data uri source map (400kb!)
      }
    }

  });

  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-cssmin'); // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['sprite', 'cssmin', 'browserify']);

};