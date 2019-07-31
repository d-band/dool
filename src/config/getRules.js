import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import babelrc from './babelrc';

function getStyleRule ({
  mode,
  extract,
  compress,
  autoprefixer,
  cssSourceMap,
  postcssPlugins
}, modules, type) {
  let sourceMap = mode === 'development';
  if (typeof cssSourceMap === 'boolean') {
    sourceMap = cssSourceMap;
  }

  // config style-loader
  const fallback = extract ? MiniCssExtractPlugin.loader : 'style-loader';

  // config css-loader
  const cssExtraOptions = modules ? {
    modules: {
      localIdentName: '[local]_[hash:base64:5]'
    }
  } : {};
  const css = {
    loader: 'css-loader',
    options: {
      sourceMap,
      ...cssExtraOptions
    }
  };

  // config postcss-loader
  const plugins = [];
  if (autoprefixer !== false) {
    const defaultOpt = {
      overrideBrowserslist: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
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
        const plugin = require(k);
        plugins.push(plugin(postcssPlugins[k]));
      });
    }
  }
  const postcss = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap,
      plugins
    }
  };

  const loaders = [fallback, css, postcss];

  // config less-loader
  if (type === 'less') {
    loaders.push({
      loader: 'less-loader',
      options: { sourceMap }
    });
  }
  if (type === 'sass') {
    loaders.push({
      loader: 'sass-loader',
      options: { sourceMap }
    });
  }
  return loaders;
}

function getModulesPaths ({ cwd, cssModules }) {
  const paths = cssModules === true ? ['./src'] : cssModules;
  if (paths && Array.isArray(paths) && paths.length > 0) {
    return paths.map(p => resolve(cwd, p));
  }
  return undefined;
}

function getCSSRules (options) {
  const rules = [];
  const modulesPaths = getModulesPaths(options);

  [{
    type: 'css',
    test: /\.css$/
  }, {
    type: 'less',
    test: /\.less$/
  }, {
    type: 'sass',
    test: /\.(sass|scss)$/
  }].forEach(v => {
    rules.push({
      test: v.test,
      exclude: modulesPaths,
      oneOf: [{
        resourceQuery: /module/,
        use: getStyleRule(options, true, v.type)
      }, {
        use: getStyleRule(options, false, v.type)
      }]
    });
    if (modulesPaths) {
      rules.push({
        test: v.test,
        include: modulesPaths,
        use: getStyleRule(options, true, v.type)
      });
    }
  });

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
    test: /\.(a?tpl)$/,
    loader: 'etpl-loader'
  }, ...getCSSRules(options)];
};
