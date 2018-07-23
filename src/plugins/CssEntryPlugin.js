const RE_CSS = /\.css$/i;
const RE_NAME = /\[name\]/gi;
const RE_JS_MAP = /\.js(|\.map)$/i;

export default class CssEntryPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('CssEntryPlugin', (compilation) => {
      compilation.mainTemplate.hooks.renderManifest.tap('CssEntryPlugin', (result) => {
        for (const file of result) {
          const { filenameTemplate, pathOptions } = file;
          const { chunk } = pathOptions || {};
          const name = chunk && (chunk.name || chunk.id);
          if (RE_CSS.test(name) && typeof filenameTemplate === 'string') {
            const rename = name.replace(RE_CSS, '');
            file.filenameTemplate = filenameTemplate.replace(RE_NAME, rename);
          }
        }
        return result;
      });
    });
    compiler.hooks.emit.tapAsync('CssEntryPlugin', (compilation, callback) => {
      compilation.chunks.filter(chunk => {
        return RE_CSS.test(chunk.name);
      }).forEach(chunk => {
        // remove unused js files
        chunk.files = chunk.files.filter(file => {
          const isJS = RE_JS_MAP.test(file);
          if (isJS) {
            delete compilation.assets[file];
          }
          return isJS;
        });
      });
      callback();
    });
  }
}
