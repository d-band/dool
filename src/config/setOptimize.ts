import { Configuration } from 'webpack';
import { DoolConfig } from './types';

export default ({ commons, compress, comments }: DoolConfig, config: Configuration): void => {
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
  config.optimization.minimizer = [(compiler) => {
    const TerserPlugin = require('terser-webpack-plugin');
    const terser = new TerserPlugin({
      extractComments: false,
      terserOptions: {
        format: { comments: comments ?? 'some' },
        compress: { passes: 2 }
      }
    });
    terser.apply(compiler);
  }];
};
