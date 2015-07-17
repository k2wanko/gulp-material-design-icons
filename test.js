var assert = require('assert');
var gulpMaterialDesignIcons    = require('./');
var path = require('path');

describe('gulp-material-design-icons', function() {
  describe('android', function() {

    it('should write icons', function(done) {

      var mdi =  gulpMaterialDesignIcons({
        'type': 'android',
        'icons': [
          'image/ic_camera_alt_white_24dp.png',
          'navigation/ic_more_vert_white_24dp.png',
        ]
      });
      var dirs = gulpMaterialDesignIcons.androidDirs;
      mdi.on('data', function(file) {
        assert(file.isStream());

        var targets = file.base.split(path.sep);
        for (i in dirs) {
          assert.equal(targets.indexOf(dirs[i]), -1);
        }
      });
      
      done();
    });
    
  });
});
