import { Configuration } from 'webpack';
import { Options } from 'webpack-manifest-plugin';

export interface DoolConfig {
  mode?: Configuration['mode'];
  cwd?: string;
  target?: Configuration['target'];
  entry?: { [key: string]: string };
  files?: string | string[];
  filesBase?: string;
  publicPath?: string;
  outputPath?: string;
  babelPlugins?: string[];
  babelProposals?: object;
  babelEnvOptions?: object;
  postcssPlugins?: { [key: string]: any } | Array<{ [key: string]: any }>;
  autoprefixer?: false | object;
  define?: object;
  externals?: { [key: string]: string | string[] | any };
  extract?: boolean;
  cssModules?: true | string[];
  cssSourceMap?: boolean;
  commons?: true | { name: string } | Array<{ name: string }>;
  compress?: boolean;
  manifest?: boolean | Options;
  hash?: boolean;
  devtool?: string;
  devServer?: object;
  config?: string;
  env?: { [key: string]: DoolConfig };
  cluster?: boolean;
  verbose?: boolean;
  watch?: boolean;
  https?: boolean;
  port?: number;
  comments?: 'some' | 'all' | boolean;
}
