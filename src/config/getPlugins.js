'use strict';

import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CssEntryPlugin } from '../plugins';

export default ({
  hash,
  extract
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
    plugins.push(new MiniCssExtractPlugin({
      filename: hash ? '[name]-[hash].css' : '[name].css',
      chunkFilename: hash ? '[id]-[hash].css' : '[id].css'
    }));
  }
  return plugins;
};
