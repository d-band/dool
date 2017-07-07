export default ({
  babelPlugins,
  babelEnvOptions
}) => {
  return {
    babelrc: false,
    cacheDirectory: true,
    presets: [
      [require.resolve('babel-preset-env'), {
        modules: false,
        ...babelEnvOptions
      }],
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0')
    ],
    plugins: babelPlugins || []
  };
};
