import webpack, { Stats } from 'webpack';
import getConfig from './config';
import { DoolConfig } from './config/types';
import { getStatsOptions } from './utils';

export default function run (
  options: DoolConfig,
  callback: (err?: Error, info?: string) => void
): void {
  const config = getConfig(options);
  config.plugins?.push(new webpack.ProgressPlugin());

  function doneHandler (err?: Error, stats?: Stats): void {
    if (err != null) {
      process.on('exit', () => process.exit(2));
      return callback?.(err);
    }

    if (stats?.hasErrors()) {
      process.on('exit', () => process.exit(1));
    }
    const statsOpts = getStatsOptions(options.verbose);
    const info = stats?.toString(statsOpts);
    if (options.watch) {
      console.log(info);
    } else {
      callback?.(undefined, info);
    }
  }

  const compiler = webpack(config);
  // Run compiler.
  if (options.watch) {
    compiler.watch({
      aggregateTimeout: 200
    }, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}
