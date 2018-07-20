import { resolve } from 'path';
import decamelize from 'decamelize';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import babelrc from './babelrc';

function getCSSLoaders ({
  mode,
  extract,
  compress,
  autoprefixer,
  CSSSourceMap,
  postcssPlugins
}, modules) {
  let hasMap = mode === 'development';
  if (typeof CSSSourceMap === 'boolean') {
    hasMap = CSSSourceMap;
  }
  const cssExtraOptions = modules ? {
    modules: true,
    localIdentName: '[local]_[hash:base64:5]'
  } : {};
  const css = {
    loader: 'css-loader',
    options: {
      sourceMap: hasMap,
      minimize: compress,
      ...cssExtraOptions
    }
  };
  const plugins = [];
  if (autoprefixer !== false) {
    const defaultOpt = {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
    };
    plugins.push(require('autoprefixer')({
      ...defaultOpt,
      ...autoprefixer
    }));
  }
  if (compress) {
    plugins.push(require('cssnano')());
  }
  if (postcssPlugins) {
    if (Array.isArray(postcssPlugins)) {
      postcssPlugins.forEach(plugin => {
        plugins.push(plugin);
      });
    } else {
      Object.keys(postcssPlugins).forEach(k => {
        const fn = require(decamelize(k, '-'));
        plugins.push(fn(postcssPlugins[k]));
      });
    }
  }
  const postcss = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: hasMap,
      plugins
    }
  };
  const less = {
    loader: 'less-loader',
    options: {
      sourceMap: hasMap
    }
  };
  const fallback = extract ? MiniCssExtractPlugin.loader : 'style-loader';
  return {
    css: [fallback, css, postcss],
    less: [fallback, css, postcss, less]
  };
}

function getModulesPaths ({ cwd, CSSModules }) {
  let paths = CSSModules === true ? ['./src'] : CSSModules;
  if (paths && Array.isArray(paths) && paths.length > 0) {
    return paths.map(p => resolve(cwd, p));
  }
  return undefined;
}

function getCSSRules (options) {
  const base = getCSSLoaders(options);
  const paths = getModulesPaths(options);
  let rules = [{
    test: /\.css$/,
    exclude: paths,
    use: base.css
  }, {
    test: /\.less$/,
    exclude: paths,
    use: base.less
  }];
  if (paths) {
    const modules = getCSSLoaders(options, true);
    const moduleRules = [{
      test: /\.css$/,
      include: paths,
      use: modules.css
    }, {
      test: /\.less$/,
      include: paths,
      use: modules.less
    }];
    rules = [...rules, ...moduleRules];
  }
  return rules;
}

export default (options) => {
  const babel = {
    loader: 'babel-loader',
    options: babelrc(options)
  };
  return [{
    test: /\.js$/,
    exclude: /node_modules/,
    ...babel
  }, {
    test: /\.jsx$/,
    ...babel
  }, {
    test: /\.(otf|ttf|woff2?|eot)(\?\S*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  }, {
    test: /\.svg(\?\S*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  }, {
    test: /\.(gif|png|jpe?g)(\?\S*)?$/i,
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  }, {
    test: /\.atpl$/,
    loader: 'atpl-loader'
  }, ...getCSSRules(options)];
};
