function ErrorPlugin(options) {}

ErrorPlugin.prototype.apply = function(compiler) {
  compiler.hooks.emit.tapAsync('ErrorPlugin', (compilation, callback) => {
    callback(new Error('error plugin'));
  });
};

module.exports = function(cfg) {
  cfg.plugins.push(new ErrorPlugin());
  return cfg;
};