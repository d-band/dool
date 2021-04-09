import { Compiler } from 'webpack';

const RE_CSS = /\.css$/i;
const RE_JS_MAP = /\.js(|\.map)$/i;

export default class CssEntryPlugin {
  apply (compiler: Compiler): void {
    const pluginName = 'CssEntryPlugin';
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(pluginName, () => {
        compilation.chunks.forEach(chunk => {
          if (!RE_CSS.test(chunk.name)) return;
          // remove unused js files
          for (const file of chunk.files) {
            if (RE_JS_MAP.test(file)) {
              compilation.deleteAsset(file);
            }
          }
        });
      });
    });
  }
}
