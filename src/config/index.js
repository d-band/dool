import { resolve } from 'path';
import webpack from 'webpack';
import getEntry from './getEntry';
import getRules from './getRules';
import getPlugins from './getPlugins';
import mergeConfig from './mergeConfig';

function getOutput ({ cwd, hash, outputPath, publicPath }) {
  const name = hash ? '[name]-[chunkhash].js' : '[name].js';
  const output = {
    path: resolve(cwd, outputPath || './dist'),
    filename: name,
    chunkFilename: name
  };
  if (publicPath) {
    output.publicPath = publicPath;
  }
  return output;
}

export default function getConfig (options, entry) {
  const base = {
    context: options.cwd,
    output: getOutput(options),
    devtool: options.devtool,
    resolve: {
      modules: ['node_modules', resolve(__dirname, '../../node_modules')],
      extensions: ['*', '.js', '.jsx']
    },
    resolveLoader: {
      modules: ['node_modules', resolve(__dirname, '../../node_modules')]
    },
    entry: entry || getEntry(options),
    externals: options.externals,
    module: {
      rules: getRules(options)
    },
    plugins: getPlugins(options),
    performance: {
      hints: options.compress ? 'warning' : false,
      maxAssetSize: 400000,
      maxEntrypointSize: 400000
    }
  };
  if (options.hash) {
    base.plugins = [
      ...base.plugins,
      require('map-json-webpack-plugin')()
    ];
  }
  const cfgFile = resolve(options.cwd, options.config || 'webpack.config.js');
  return mergeConfig(base, cfgFile, webpack, options);
}

export { getEntry };
