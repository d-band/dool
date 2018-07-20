module.exports = (args, env) => {
  args.compress = true;
  args.mode = 'production';
  return args;
};