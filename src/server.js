import { address } from 'ip';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { getOptions } from './utils';
import getConfig from './config';

export default (args) => {
  const env = 'development';
  process.env.NODE_ENV = process.env.NODE_ENV || env;
  const options = getOptions(args, env);
  const { verbose, https, port } = options;
  const devServer = {
    disableHostCheck: true,
    https: https,
    stats: {
      colors: true,
      children: verbose,
      chunks: verbose,
      modules: verbose,
      chunkModules: verbose,
      hash: verbose,
      version: verbose
    }
  };
  const config = getConfig(options);
  const extraConfig = (v) => {
    v.output.pathinfo = true;
    v.devtool = 'cheap-module-source-map';
    v.plugins.push(new webpack.HotModuleReplacementPlugin());
    Object.assign(devServer, v.devServer);
  };
  if (Array.isArray(config)) {
    config.forEach(extraConfig);
  } else {
    extraConfig(config);
  }
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, devServer);
  server.listen(port, '0.0.0.0', function () {});

  const url = (https ? 'https://' : 'http://') + address() + ':' + port;
  console.log('Starting up dool server.');
  console.log('Server url: ' + '\x1B[36m ' + url + ' \x1B[39m');
  console.log('Hit CTRL-C to stop the server');
  console.log(['\u001b[31m',
    '  ________               ______  ',
    '  ___  __ \\______ ______ ___  / ',
    '  __  / / /_  __ \\_  __ \\__  / ',
    '  _  /_/ / / /_/ // /_/ /_  /    ',
    '  /_____/  \\____/ \\____/ /_/   ',
    '                                 ',
    '\u001b[39m'
  ].join('\n'));

  return server;
};
