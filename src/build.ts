import { DoolConfig } from './config/types';
import cluster from './cluster';
import runner from './runner';
import { getOptions, log } from './utils';

export default (args: DoolConfig, callback?: (err?: Error) => void): void => {
  args.mode = args.mode ?? 'production';
  const env = process.env.NODE_ENV ?? 'production';
  process.env.NODE_ENV = env;
  const options = getOptions(args, env);

  if (options.cluster) {
    cluster(options, callback);
  } else {
    runner(options, (err?: Error, stats?: string) => {
      err ? log.error(err.stack) : log.info(stats);
      callback?.(err);
    });
  }
};
