import { join, dirname } from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import assign from 'object-assign';
import { merge } from '../src/utils';
import { build, clean, DoolConfig } from '../src';

function assert (actualDir: string, expectPath: string): void {
  const expectDir = join(__dirname, 'expect', expectPath);
  const actualFiles = glob.sync('**/*', {
    cwd: actualDir,
    nodir: true
  });

  actualFiles.forEach(file => {
    const actualFile = join(actualDir, file);
    const expectFile = join(expectDir, file);

    if (process.env.GEN_EXPECT) {
      fs.mkdirsSync(dirname(expectFile));
      fs.writeFileSync(expectFile, fs.readFileSync(actualFile));
    }

    const actualData = fs.readFileSync(actualFile, 'utf-8');
    const expectData = fs.readFileSync(expectFile, 'utf-8');
    expect(actualData).toBe(expectData);
  });
}

function testBuild (args: DoolConfig, fixture: string, done?: (err?: Error) => any): void {
  const cwd = join(__dirname, 'fixtures', fixture);
  const outputPath = join(cwd, 'dist');
  const defaultConfig = {
    mode: 'development',
    cwd: cwd,
    verbose: false,
    extract: true,
    compress: false,
    devtool: false,
    outputPath: outputPath
  };
  const params = assign({}, defaultConfig, args);
  clean(params);
  build(params, err => {
    assert(outputPath, fixture);
    done?.(err);
  });
}

test('test merge function', () => {
  const obj1 = { a: 'a' };
  const obj2 = { a: ['a'] };
  const obj3 = { a: { b: 'b' } };

  merge(obj1, { b: 'b' });
  merge(obj2, { a: ['b'] });
  merge(obj3, { a: { c: 'c' } });

  expect(obj1).toStrictEqual({ a: 'a', b: 'b' });
  expect(obj2).toStrictEqual({ a: ['a', 'b'] });
  expect(obj3).toStrictEqual({ a: { b: 'b', c: 'c' } });
});

test('should support base64', done => {
  testBuild({ publicPath: '/foo/', manifest: true }, 'base64', done);
});
test('should support babel plugins', done => {
  testBuild({}, 'babel-plugins', done);
});

test('should support postcss plugins [object]', done => {
  testBuild({
    postcssPlugins: { 'postcss-preset-env': { stage: 0 } }
  }, 'postcss-plugins', done);
});
test('should support postcss plugins [array]', done => {
  testBuild({
    postcssPlugins: [require('postcss-preset-env')({ stage: 0 })]
  }, 'postcss-plugins', done);
});

test('should support css modules', done => {
  testBuild({}, 'css-modules', done);
});
test('should support css modules in js', done => {
  testBuild({}, 'css-modules-injs', done);
});
test('should support css modules query', done => {
  testBuild({}, 'css-modules-query', done);
});
test('should support cluster', done => {
  testBuild({}, 'cluster', done);
});

const commonsObj = {
  name: 'common',
  chunks: 'initial',
  minChunks: 2,
  enforce: true
};
test('should support common file [boolean]', done => {
  testBuild({
    commons: true
  }, 'common-file', done);
});
test('should support common file [array]', done => {
  testBuild({
    commons: [commonsObj]
  }, 'common-file', done);
});
test('should support common file [object]', done => {
  testBuild({
    commons: commonsObj
  }, 'common-file', done);
});

test('should support custom loader', done => {
  testBuild({}, 'custom-loader', done);
});
test('should support custom path', done => {
  testBuild({
    hash: true,
    manifest: true,
    mode: 'production'
  }, 'custom-path', done);
});
test('should support define', done => {
  process.env.NODE_ENV = 'debug';
  testBuild({}, 'define', done);
});
test('should support es6', done => {
  testBuild({}, 'es6', done);
});
test('should support es6 decorators', done => {
  testBuild({}, 'es6-decorators', done);
});
test('should support global', done => {
  testBuild({}, 'global', done);
});
test('should support less', done => {
  testBuild({}, 'less', done);
});
test('should support scss', done => {
  testBuild({}, 'scss', done);
});
test('should support load on demand', done => {
  testBuild({}, 'load-on-demand', done);
});
test('should support map hash', done => {
  testBuild({
    hash: true,
    manifest: true
  }, 'map-hash', done);
});
test('should support compress default', done => {
  testBuild({}, 'compress', done);
});
test('should support no comments', done => {
  testBuild({
    compress: true,
    mode: 'production',
    comments: false
  }, 'no-comments', done);
});
test('should support sourcemap', done => {
  testBuild({
    manifest: {
      publicPath: '/app/',
      map: file => file
    },
    compress: true,
    cssSourceMap: true,
    devtool: 'source-map'
  }, 'sourcemap', done);
});
test('should support mix entry and files', done => {
  testBuild({}, 'mix-entry', done);
});
test('should support react', done => {
  testBuild({}, 'react', done);
});
test('should throw webpack missing error', done => {
  testBuild({}, 'missing', () => {
    done();
  });
});
test('should throw error', async () => {
  console.error = () => {};
  const p = new Promise((resolve, reject) => {
    testBuild({}, 'error', function (err) {
      process.removeAllListeners('exit');
      err ? reject(err) : resolve(0);
    });
  });
  return expect(p).rejects.toThrow();
});
test('should throw merge error', () => {
  expect(() => {
    testBuild({}, 'merge-error');
  }).toThrow();
});
