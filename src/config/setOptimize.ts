import { Configuration } from 'webpack';
import { DoolConfig } from './types';

export default ({ commons, compress }: DoolConfig, config: Configuration): void => {
  config.optimization = {};
  if (commons) {
    if (commons === true) {
      config.optimization.splitChunks = {
        cacheGroups: {
          commons: {
            name: 'common',
            chunks: 'initial',
            minChunks: 2,
            enforce: true
          }
        }
      };
    } else if (Array.isArray(commons)) {
      config.optimization.splitChunks = {
        cacheGroups: commons.reduce((obj, opt) => ({
          ...obj,
          [opt.name]: opt
        }), {})
      };
    } else {
      config.optimization.splitChunks = {
        cacheGroups: {
          [commons.name]: commons
        }
      };
    }
  }
  if (typeof compress === 'boolean') {
    config.optimization.minimize = compress;
  }
};
