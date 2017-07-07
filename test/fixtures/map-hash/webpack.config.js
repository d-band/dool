var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = function(cfg) {
  cfg.plugins.push(new WebpackMd5Hash());
  return cfg;
}