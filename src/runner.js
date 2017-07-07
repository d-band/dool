import webpack from 'webpack';
import getConfig from './config';
import { progress } from './plugins';

export default function run ({ options, entry }, callback) {
  const config = getConfig(options, entry);
  config.plugins = [...config.plugins, progress()];

  function doneHandler (err, stats) {
    if (err) {
      process.on('exit', () => process.exit(2));
      return callback && callback(err);
    }

    if (stats.hasErrors()) {
      process.on('exit', () => process.exit(1));
    }
    const verb = Boolean(options.verbose);
    const info = stats.toString({
      colors: true,
      children: verb,
      chunks: verb,
      modules: verb,
      chunkModules: verb,
      hash: verb,
      version: verb
    });
    if (options.watch) {
      console.log(info);
    } else {
      callback && callback(null, info);
    }
  }

  const compiler = webpack(config);
  // Run compiler.
  if (options.watch) {
    compiler.watch(200, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}
