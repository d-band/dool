export default ({ commons, compress }, config) => {
  config.optimization = {};
  if (commons) {
    const cacheGroups = {};
    if (commons === true) {
      cacheGroups.commons = {
        name: 'common',
        chunks: 'initial',
        minChunks: 2,
        enforce: true
      };
    } else if (Array.isArray(commons)) {
      commons.forEach(opt => {
        cacheGroups[opt.name] = opt;
      });
    } else {
      cacheGroups[commons.name] = commons;
    }
    config.optimization.splitChunks = { cacheGroups };
  }
  if (compress) {
    config.optimization.minimize = true;
  }
};
