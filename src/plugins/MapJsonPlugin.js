import path from 'path';
import fs from 'fs-extra';

export default class MapJsonPlugin {
  apply (compiler) {
    compiler.hooks.done.tap('MapJsonPlugin', stats => {
      const json = stats.toJson();
      const assets = json.assets;
      const map = {};

      function processFile (a) {
        const name = a.name;
        const finalHashName = name;
        const extname = path.extname(name);
        if (extname !== '.js' && extname !== '.css') {
          return;
        }
        const dirname = path.dirname(name);
        const basename = path.basename(name, extname);
        const basenames = basename.split(/-/);
        if (basenames.length > 1) {
          basenames.pop();
        }
        const nameWithoutHash = basenames.join('-') + extname;
        map[path.join(dirname, nameWithoutHash)] = finalHashName;
      }

      assets.forEach(processFile);

      const outputFile = path.join(compiler.outputPath, 'map.json');
      const outputDir = path.dirname(outputFile);
      fs.mkdirsSync(outputDir);
      fs.writeFileSync(outputFile, JSON.stringify(map, null, 2));
    });
  }
}
