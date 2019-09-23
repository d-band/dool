import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import { CssEntryPlugin } from '../plugins';
import { resolveDefine } from '../utils';

export default ({
  hash,
  define,
  extract,
  manifest
}) => {
  const plugins = [
    new webpack.DefinePlugin(resolveDefine({
      'process.env.NODE_ENV': process.env.NODE_ENV,
      ...define
    }))
  ];
  if (extract) {
    plugins.push(new CssEntryPlugin());
    const filename = hash ? '[name]-[contenthash].css' : '[name].css';
    const chunkFilename = hash ? '[id]-[contenthash].css' : '[id].css';
    const moduleFilename = ({ name }) => {
      const RE_CSS = /\.css$/i;
      const RE_NAME = /\[name\]/gi;
      if (name && RE_CSS.test(name)) {
        const rename = name.replace(RE_CSS, '');
        return filename.replace(RE_NAME, rename);
      }
      return filename;
    };
    plugins.push(new MiniCssExtractPlugin({
      filename,
      chunkFilename,
      moduleFilename
    }));
  }
  const manifestOpts = manifest === true ? {} : manifest;
  if (manifestOpts) {
    const { map } = manifestOpts;
    manifestOpts.map = (file) => {
      file.name = file.name
        .replace(/\.css\.css(|\.map)$/i, '.css$1');
      return map ? map(file) : file;
    };
    plugins.push(new ManifestPlugin(manifestOpts));
  }
  return plugins;
};
