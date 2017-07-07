var join = require('path').join;
var pkg = require('./package.json');
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = function(cfg) {
  cfg.output.path = join(__dirname, 'dist', pkg.name, pkg.version);
  cfg.plugins.push(new WebpackMd5Hash());
  return cfg;
};