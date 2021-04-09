import { DoolConfig } from './types';

export default ({
  babelPlugins,
  babelProposals,
  babelEnvOptions
}: DoolConfig): any => {
  const plugins = babelPlugins ?? [];
  return {
    babelrc: false,
    cacheDirectory: true,
    presets: [
      [require.resolve('@babel/preset-env'), {
        modules: false,
        ...babelEnvOptions
      }],
      require.resolve('@babel/preset-react'),
      [require.resolve('babel-preset-proposal'), {
        ...babelProposals
      }]
    ],
    plugins
  };
};
