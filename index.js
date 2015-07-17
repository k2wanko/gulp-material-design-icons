
var through = require('through2');
var _        = require('underscore');
var fs       = require('fs');
var path     = require('path');
var gs       = require('glob-stream');
var File = require('vinyl');

var androidDirs = [
  'drawable-mdpi',
  'drawable-hdpi',
  'drawable-xhdpi',
  'drawable-xxhdpi',
  'drawable-xxxhdpi',
];

function findIconDir() {
  var dirName = 'material-design-icons';
  for (i in module.paths) {
    var dir = path.join(module.paths[i], dirName)
    try {
      if (fs.statSync(dir).isDirectory()) {
        return dir
      }
    } catch (e) {
      // skip error
    }
  }
}

module.exports = function(options) {

  options = options || {};
  options.ignore = options.ignore || [];

  if (!_.isString(options.type)) {
    throw new Error('require string : type');
  }

  if (!_.isArray(options.icons)) {
    throw new Error('require array : icons');
  }

  var paths;
  switch(options.type) {
  case 'android':
    paths = androidDirs
    break;
  default:
    throw new Error('Not Support type');
  }

  paths = _.filter(paths, function(path) {
    return options.ignore.indexOf(path)
  });

  var root = findIconDir();

  var icons = options.icons;
  var globs = [];
  for (i in icons) {
    var iconPath = icons[i].split('/');
    for (j in paths) {
      var glob = path.join(root, iconPath[0], paths[j], iconPath[1]);
      globs.push(glob);
    }
  }

  var globStream = gs.create(globs);

  return globStream
    .pipe(through.obj(function(globFile, enc, cb) {
      var file = new File(globFile);
      file.contents = fs.createReadStream(file.path)
      file.base = path.dirname(file.base);
      cb(null, file);
    }));
};

module.exports.androidDirs = androidDirs;
