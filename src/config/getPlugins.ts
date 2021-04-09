import webpack, { Configuration, WebpackPluginInstance } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { FileDescriptor, Options, WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { CssEntryPlugin } from '../plugins';
import { resolveDefine } from '../utils';
import { DoolConfig } from './types';

export default ({
  hash,
  define,
  extract,
  manifest,
  publicPath
}: DoolConfig): WebpackPluginInstance[] => {
  const plugins: WebpackPluginInstance[] = [
    new webpack.DefinePlugin(resolveDefine({ ...define }))
  ];
  if (extract) {
    plugins.push(new CssEntryPlugin());
    const filename: Required<Configuration>['output']['filename'] = ({ chunk }) => {
      const RE_CSS = /\.css$/i;
      const RE_NAME = /\[name\]/gi;
      const template = hash ? '[name]-[contenthash].css' : '[name].css';

      const name = chunk?.name;
      if (name && RE_CSS.test(name)) {
        const rename = name.replace(RE_CSS, '');
        return template.replace(RE_NAME, rename);
      }
      return template;
    };
    const chunkFilename = hash ? '[id]-[contenthash].css' : '[id].css';
    plugins.push(new MiniCssExtractPlugin({
      filename,
      chunkFilename
    }));
  }
  if (manifest) {
    const manifestOpts: Options = manifest === true ? {} : manifest;
    const { map } = manifestOpts;
    manifestOpts.map = (file: FileDescriptor) => {
      if (file.name) {
        file.name = file.name.replace(/\.css\.css(|\.map)$/i, '.css$1');
      }
      return (map != null) ? map(file) : file;
    };
    if (!manifestOpts.publicPath) {
      manifestOpts.publicPath = publicPath ?? '';
    }
    plugins.push(new WebpackManifestPlugin(manifestOpts));
  }
  return plugins;
};
