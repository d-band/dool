module.exports = function(cfg) {
  cfg.module.rules.push({
    test: /\.(js|css)$/,
    loader: './loader'
  });
  return cfg;
}