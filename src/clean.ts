import { resolve } from 'path';
import fs from 'fs-extra';
import { getOptions } from './utils';
import { DoolConfig } from './config/types';

export default (args: DoolConfig): void => {
  args.mode = args.mode ?? 'production';
  const env = process.env.NODE_ENV ?? 'production';
  process.env.NODE_ENV = env;
  const options = getOptions(args, env);
  const distPath = resolve(
    options.cwd ?? process.cwd(),
    options.outputPath ?? './dist'
  );
  fs.removeSync(distPath);
};
