import { resolve } from 'path';
import fs from 'fs-extra';
import { getOptions } from './utils';

export default (args) => {
  args.mode = args.mode || 'production';
  const env = process.env.NODE_ENV || 'production';
  const options = getOptions(args, env);
  const distPath = resolve(options.cwd, options.outputPath || './dist');
  fs.removeSync(distPath);
};
