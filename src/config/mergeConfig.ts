import { existsSync } from 'fs';
import webpack, { Configuration } from 'webpack';
import { DoolConfig } from './types';
/**
 * Merge custom config from `webpack.config.js`.
 * @param base {Object}
 * @param configFile {String}
 */
export default function merge (
  base: Configuration,
  configFile: string,
  options: DoolConfig
): Configuration {
  if (!existsSync(configFile)) {
    return base;
  }

  const customConfig = require(configFile);

  if (typeof customConfig === 'function') {
    return customConfig(base, webpack, options);
  }

  throw new Error(`Return of ${configFile} must be a function.`);
}
