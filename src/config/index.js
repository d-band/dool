import { resolve } from 'path';
import webpack from 'webpack';
import getEntry from './getEntry';
import getRules from './getRules';
import getPlugins from './getPlugins';
import setOptimize from './setOptimize';
import mergeConfig from './mergeConfig';
import { MapJsonPlugin } from '../plugins';

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
    mode: options.mode,
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
  // common split
  setOptimize(options, base);
  // map hash
  if (options.hash) {
    base.plugins = [
      ...base.plugins,
      new MapJsonPlugin()
    ];
  }
  const cfgFile = resolve(options.cwd, options.config || 'webpack.config.js');
  return mergeConfig(base, cfgFile, webpack, options);
}

export { getEntry };
