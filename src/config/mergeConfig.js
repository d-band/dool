import { existsSync } from 'fs';

/**
 * Merge custom config from `webpack.config.js`.
 * @param base {Object}
 * @param configFile {String}
 */
export default function merge (base, configFile) {
  if (!existsSync(configFile)) {
    return base;
  }

  const customConfig = require(configFile);

  if (typeof customConfig === 'function') {
    return customConfig(base, ...[...arguments].slice(2));
  }

  throw new Error(`Return of ${configFile} must be a function.`);
}
