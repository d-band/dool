import glob from 'glob';
import path from 'path';

function formatName (name) {
  return name.charAt(0) === '.' ? name : `./${name}`;
}

export default ({
  cwd,
  entry,
  files,
  filesBase
}) => {
  let newEntry = entry || {};

  if (typeof newEntry === 'string' || Array.isArray(newEntry)) {
    newEntry = { main: newEntry };
  }
  let globFiles = files || [];
  if (typeof globFiles === 'string') {
    globFiles = [globFiles];
  }
  globFiles.forEach(item => {
    [...glob.sync(item, {
      cwd,
      nodir: true
    })].forEach(file => {
      const RE = /\.(css|less|sass|scss)$/i;
      const base = filesBase || '.';
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
