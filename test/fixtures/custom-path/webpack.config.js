var join = require('path').join;
var pkg = require('./package.json');

module.exports = function(cfg) {
  cfg.output.path = join(__dirname, 'dist', pkg.name, pkg.version);
  return cfg;
};