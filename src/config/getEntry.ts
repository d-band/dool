import glob from 'glob';
import path from 'path';
import { EntryObject } from 'webpack';
import { DoolConfig } from './types';

function formatName (name: string): string {
  return name.charAt(0) === '.' ? name : `./${name}`;
}

export default ({
  cwd,
  entry,
  files,
  filesBase
}: DoolConfig): EntryObject => {
  let newEntry: EntryObject;
  if (typeof entry === 'string' || Array.isArray(entry)) {
    newEntry = { main: entry };
  } else {
    newEntry = entry ?? {};
  }
  let globFiles = files ?? [];
  if (typeof globFiles === 'string') {
    globFiles = [globFiles];
  }
  globFiles.forEach(item => {
    [...glob.sync(item, {
      cwd,
      nodir: true
    })].forEach(file => {
      const RE = /\.(css|less|sass|scss)$/i;
      const base = filesBase ?? '.';
      const ext = path.extname(file);
      let key = path.relative(base, file);
      if (RE.test(ext)) {
        key = key.replace(RE, '.css');
      } else {
        key = key.replace(new RegExp(ext + '$'), '');
      }
      newEntry[key] = formatName(file);
    });
  });
  return newEntry;
};
