'use strict';

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { CssEntryPlugin } from '../plugins';

const { CommonsChunkPlugin, UglifyJsPlugin } = webpack.optimize;

export default ({
  hash,
  extract,
  compress,
  devtool,
  commons
}) => {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ];
  if (extract) {
    plugins.push(new CssEntryPlugin());
    const cssFile = (getPath) => {
      const name = getPath('[name]').replace(/\.css$/, '');
      if (hash) {
        return `${name}-${getPath('[chunkhash]')}.css`;
      } else {
        return `${name}.css`;
      }
    };
    plugins.push(new ExtractTextPlugin({
      filename: cssFile,
      disable: false,
      allChunks: true
    }));
  }
  if (compress) {
    plugins.push(new UglifyJsPlugin({
      comments: false,
      sourceMap: devtool && /source(map|-map)/.test(devtool)
    }));
  }
  if (commons) {
    if (commons === true) {
      plugins.push(new CommonsChunkPlugin({
        name: 'common',
        filename: 'common.js'
      }));
    } else if (Array.isArray(commons)) {
      commons.forEach(opt => {
        plugins.push(new CommonsChunkPlugin(opt));
      });
    } else {
      plugins.push(new CommonsChunkPlugin(commons));
    }
  }
  return plugins;
};
