class CssEntryPlugin {
  apply (compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      compilation.chunks.filter(chunk => {
        return /\.css$/i.test(chunk.name);
      }).forEach(chunk => {
        // remove unused js files
        chunk.files = chunk.files.filter(file => {
          const isJS = /\.js(|\.map)$/i.test(file);
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

export default CssEntryPlugin;
