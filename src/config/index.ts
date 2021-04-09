import { resolve } from 'path';
import { Configuration } from 'webpack';
import { DoolConfig } from './types';
import getEntry from './getEntry';
import getRules from './getRules';
import getPlugins from './getPlugins';
import setOptimize from './setOptimize';
import mergeConfig from './mergeConfig';

export { DoolConfig };

function getOutput ({ cwd, hash, outputPath, publicPath }: DoolConfig): Configuration['output'] {
  cwd = cwd ?? process.cwd();
  const name = hash ? '[name]-[chunkhash].js' : '[name].js';
  const output: Configuration['output'] = {
    path: resolve(cwd, outputPath ?? './dist'),
    filename: name,
    chunkFilename: name
  };
  if (publicPath) {
    output.publicPath = publicPath;
  }
  return output;
}

export default function getConfig (options: DoolConfig): Configuration {
  options.cwd = options.cwd ?? process.cwd();
  options.config = options.config ?? 'webpack.config.js';
  const base: Configuration = {
    mode: options.mode,
    context: options.cwd,
    output: getOutput(options),
    devtool: options.devtool,
    target: options.target ?? ['web', 'es5'],
    resolve: {
      modules: ['node_modules', resolve(__dirname, '../../node_modules')],
      extensions: ['*', '.js', '.jsx']
    },
    resolveLoader: {
      modules: ['node_modules', resolve(__dirname, '../../node_modules')]
    },
    entry: getEntry(options),
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

  const cfgFile = resolve(options.cwd, options.config);
  return mergeConfig(base, cfgFile, options);
}

export { getEntry };
