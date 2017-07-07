'use strict';

import { green, cyan } from '../utils/color';
import { ProgressPlugin } from 'webpack';

export default () => {
  const total = 20;
  const stream = process.stderr;
  const fmt = `${green('[:bar]')} :percent ${cyan(':msg')}`;

  return new ProgressPlugin((percent, msg) => {
    if (!stream.isTTY) return;

    const beforeLen = Math.floor(percent * total);
    const afterLen = total - beforeLen;
    const before = Array(beforeLen).join('=');
    const after = Array(afterLen).join(' ');

    const str = fmt
      .replace(':bar', before + after)
      .replace(':percent', (percent * 99).toFixed(0) + '%')
      .replace(':msg', msg.substring(0, stream.columns - 27));

    stream.write('\x1b[1G' + str);
    stream.clearLine(1);

    if (percent === 1) {
      stream.clearLine();
      stream.cursorTo(0);
    }
  });
};
