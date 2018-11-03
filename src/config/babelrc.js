export default ({
  babelPlugins,
  babelEnvOptions
}) => {
  const plugins = babelPlugins || [];
  return {
    babelrc: false,
    cacheDirectory: true,
    presets: [
      [require.resolve('@babel/preset-env'), {
        modules: false,
        ...babelEnvOptions
      }],
      require.resolve('@babel/preset-react')
    ],
    plugins: [
      // stage-3
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-syntax-import-meta'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-proposal-json-strings'),
      // stage-2
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      require.resolve('@babel/plugin-proposal-function-sent'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      require.resolve('@babel/plugin-proposal-numeric-separator'),
      require.resolve('@babel/plugin-proposal-throw-expressions'),
      // stage-1
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-logical-assignment-operators'),
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      [require.resolve('@babel/plugin-proposal-pipeline-operator'), { proposal: 'minimal' }],
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      require.resolve('@babel/plugin-proposal-do-expressions'),
      // stage-0
      require.resolve('@babel/plugin-proposal-function-bind'),
      ...plugins
    ]
  };
};
