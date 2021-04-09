import { cpus } from 'os';
import farm from 'worker-farm';
import { splitBy, log } from './utils';
import { getEntry } from './config';
import { DoolConfig } from './config/types';

const maxWorkers = cpus().length;
const maxCalls = Math.ceil(8 / maxWorkers);

export default function run (options: DoolConfig, callback?: (err?: Error) => void): void {
  const entry = getEntry(options);
  const max = maxWorkers * maxCalls;
  const entries = splitBy(entry, max);
  const workers = farm({
    maxConcurrentWorkers: maxWorkers,
    maxConcurrentCallsPerWorker: maxCalls
  }, require.resolve('./runner'), ['default']);

  const outs: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const opt = { ...options, entry: entries[i] };
    workers.default(opt, (err: Error, output: string) => {
      if (err) {
        log.error(err.stack);
        farm.end(workers);
        callback?.(err);
        return;
      }
      outs.push(output);
      if (outs.length === entries.length) {
        log.info(outs.join('\n'));
        callback?.();
        farm.end(workers);
      }
    });
  }
}
