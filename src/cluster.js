import farm from 'worker-farm';
import { splitBy, log } from './utils';
import { getEntry } from './config';

const maxWorkers = require('os').cpus().length;
const maxCalls = Math.ceil(8 / maxWorkers);

export default function run (options, callback) {
  const entry = getEntry(options);
  const max = maxWorkers * maxCalls;
  const entries = splitBy(entry, max);
  const workers = farm({
    maxConcurrentWorkers: maxWorkers,
    maxConcurrentCallsPerWorker: maxCalls
  }, require.resolve('./runner'));

  const outs = [];
  for (let i = 0; i < entries.length; i++) {
    const opt = { options, entry: entries[i] };
    workers(opt, (err, output) => {
      if (err) {
        log.error(err.stack);
        farm.end(workers);
        callback && callback(err);
        return;
      }
      outs.push(output);
      if (outs.length === entries.length) {
        log.info(outs.join('\n'));
        callback && callback();
        farm.end(workers);
      }
    });
  }
}
