import cluster from './cluster';
import runner from './runner';
import { getOptions, log } from './utils';

export default (args, callback) => {
  const env = 'production';
  process.env.NODE_ENV = process.env.NODE_ENV || env;
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
