import cluster from './cluster';
import runner from './runner';
import { getOptions, log } from './utils';

export default (args, callback) => {
  args.mode = args.mode || 'production';
  const env = process.env.NODE_ENV || 'production';
  const options = getOptions(args, env);

  if (options.cluster) {
    cluster(options, callback);
  } else {
    runner({ options }, (err, stats) => {
      err ? log.error(err.stack) : log.info(stats);
      callback && callback(err);
    });
  }
};
