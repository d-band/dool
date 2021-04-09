import { address } from 'ip';
import webpack from 'webpack';
import WebpackDevServer, { Configuration } from 'webpack-dev-server';
import { getOptions, getStatsOptions, colors } from './utils';
import getConfig from './config';
import { DoolConfig } from './config/types';

export default (
  args: DoolConfig,
  callback?: (err?: Error) => void
): WebpackDevServer => {
  args.mode = args.mode ?? 'development';
  const env = process.env.NODE_ENV ?? 'development';
  process.env.NODE_ENV = env;
  const options = getOptions(args, env);
  const { verbose, https, port = 8000 } = options;
  const devServer: Configuration = {
    contentBase: args.cwd,
    sockPort: port,
    disableHostCheck: true,
    https: https,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    stats: getStatsOptions(verbose)
  };
  const config = getConfig(options);
  const extraConfig = (v: webpack.Configuration): void => {
    v.output = { ...v.output, pathinfo: true };
    v.devtool = 'cheap-module-source-map';
    v.plugins?.push(new webpack.HotModuleReplacementPlugin());
    Object.assign(devServer, v.devServer);
  };
  if (Array.isArray(config)) {
    config.forEach(extraConfig);
  } else {
    extraConfig(config);
  }
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, {
    ...devServer,
    ...options.devServer
  });
  server.listen(port, '0.0.0.0', callback);

  const url = `${https ? 'https://' : 'http://'}${address()}:${port}`;
  console.log('Starting up dool server.');
  console.log(`Server url: ${colors.cyan(url)}`);
  console.log('Hit CTRL-C to stop the server');
  console.log([
    '  ________               ______  ',
    '  ___  __ \\______ ______ ___  / ',
    '  __  / / /_  __ \\_  __ \\__  / ',
    '  _  /_/ / / /_/ // /_/ /_  /    ',
    '  /_____/  \\____/ \\____/ /_/   ',
    '                                 '
  ].map(colors.cyan).join('\n'));

  return server;
};
