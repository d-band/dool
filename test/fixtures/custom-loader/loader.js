'use strict';

module.exports = function(source) {
  return source
    .replace('bar', 'boo')
    .replace('foooooo', 'foooooo, modified by ./loader');
};
