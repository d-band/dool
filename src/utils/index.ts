import path from 'path';
import { existsSync, readFileSync } from 'fs';
import JSON5 from 'json5';
import { EntryObject } from 'webpack';
import { isPlainObject } from 'is-plain-object';
import * as colors from './colors';
import { DoolConfig } from '../config/types';

export { colors };

export function splitBy (obj: EntryObject, max: number): EntryObject[] {
  const arr = [];
  const keys = Object.keys(obj);
  const len = keys.length;
  const size = Math.ceil(len / max);
  for (let i = 0; i < len; i += size) {
    const subObj = keys.slice(i, i + size)
      .reduce((prev, cur) => ({ ...prev, [cur]: obj[cur] }), {});
    arr.push(subObj);
  }
  return arr;
}

export function merge (
  oldObj: { [key: string]: any },
  newObj: { [key: string]: any }
): void {
  for (const key in newObj) {
    if (Array.isArray(newObj[key]) && Array.isArray(oldObj[key])) {
      oldObj[key] = oldObj[key].concat(newObj[key]);
    } else if (isPlainObject(newObj[key]) && isPlainObject(oldObj[key])) {
      oldObj[key] = Object.assign(oldObj[key], newObj[key]);
    } else {
      oldObj[key] = newObj[key];
    }
  }
}
function loadOptions (args: DoolConfig, env: string): DoolConfig {
  args.cwd = args.cwd ?? process.cwd();
  const jsonFile = path.join(args.cwd, '.doolrc');
  const jsFile = path.join(args.cwd, '.doolrc.js');
  if (existsSync(jsonFile)) {
    const jsonCfg = JSON5.parse(readFileSync(jsonFile, 'utf-8'));
    return { ...args, ...jsonCfg };
  } else if (existsSync(jsFile)) {
    const jsCfg = require(jsFile);
    if (typeof jsCfg === 'function') {
      return jsCfg(args, env);
    } else {
      return { ...args, ...jsCfg };
    }
  } else {
    return { ...args };
  }
}
export function getOptions (args: DoolConfig, env: string): DoolConfig {
  args.cwd = args.cwd ?? process.cwd();
  const options = loadOptions(args, env);
  if (options.env != null) {
    if (options.env[env]) {
      merge(options, options.env[env]);
    }
    delete options.env;
  }
  const pkgFile = path.join(args.cwd, 'package.json');
  if (existsSync(pkgFile)) {
    const pkg = require(pkgFile);
    if (!options.entry && !options.files) {
      options.entry = pkg.entry;
      options.files = pkg.files;
    }
    options.externals = {
      ...pkg.externals,
      ...options.externals
    };
  }
  return options;
}

export const log = {
  info (str = ''): void {
    console.log(colors.green('\nBuild completed  🎉\n'));
    console.log(str);
  },
  error (str = ''): void {
    console.error(colors.red('\nBuild failed  💥\n'));
    console.error(colors.red(str));
  }
};

export function resolveDefine (obj: { [key: string]: any }): { [key: string]: string } {
  return Object.keys(obj).reduce((o, k) => ({
    ...o,
    [k]: JSON.stringify(obj[k])
  }), {});
}

export function getStatsOptions (verbose?: boolean): any {
  return {
    preset: verbose ? 'verbose' : 'minimal',
    version: Boolean(verbose),
    modules: Boolean(verbose),
    colors: true,
    builtAt: true,
    groupAssetsByEmitStatus: false,
    groupAssetsByInfo: false,
    groupAssetsByPath: false,
    groupAssetsByExtension: true,
    groupAssetsByChunk: false,
    assetsSpace: Infinity
  };
}
