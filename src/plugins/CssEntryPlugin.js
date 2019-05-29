const RE_CSS = /\.css$/i;
const RE_JS_MAP = /\.js(|\.map)$/i;

export default class CssEntryPlugin {
  apply (compiler) {
    compiler.hooks.emit.tapAsync('CssEntryPlugin', (compilation, callback) => {
      compilation.chunks.filter(chunk => {
        return RE_CSS.test(chunk.name);
      }).forEach(chunk => {
        // remove unused js files
        chunk.files = chunk.files.filter((file) => {
          if (RE_JS_MAP.test(file)) {
            delete compilation.assets[file];
            return false;
          }
          return true;
        });
      });
      callback();
    });
  }
}
