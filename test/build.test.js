import { join, dirname } from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import rimraf from 'rimraf';
import assign from 'object-assign';
import { expect } from 'chai';
import build from '../src/build';

function assert (actualDir, _expect) {
  const expectDir = join(__dirname, 'expect', _expect);
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
    expect(actualData).to.equal(expectData);
  });
}

function testBuild (args, fixture, done) {
  const cwd = join(__dirname, 'fixtures', fixture);
  const outputPath = join(cwd, 'dist');
  const defaultConfig = {
    mode: 'development',
    cwd: cwd,
    verbose: false,
    extract: true,
    compress: false,
    outputPath: outputPath
  };
  rimraf.sync(outputPath);
  build(assign({}, defaultConfig, args), err => {
    assert(outputPath, fixture);
    done(err);
  });
}

describe('src/build', function () {
  this.timeout(0);

  it('should support base64', done => {
    testBuild({ publicPath: '/foo/' }, 'base64', done);
  });
  it('should support babel plugins', done => {
    testBuild({}, 'babel-plugins', done);
  });
  it('should support postcss plugins', done => {
    testBuild({}, 'postcss-plugins', done);
  });
  it('should support css modules', done => {
    testBuild({}, 'css-modules', done);
  });
  it('should support css modules in js', done => {
    testBuild({}, 'css-modules-injs', done);
  });
  it('should support cluster', done => {
    testBuild({}, 'cluster', done);
  });

  const commonsObj = {
    name: 'common',
    chunks: 'initial',
    minChunks: 2,
    enforce: true
  };
  it('should support common file [boolean]', done => {
    testBuild({
      commons: true
    }, 'common-file', done);
  });
  it('should support common file [array]', done => {
    testBuild({
      commons: [commonsObj]
    }, 'common-file', done);
  });
  it('should support common file [object]', done => {
    testBuild({
      commons: commonsObj
    }, 'common-file', done);
  });

  it('should support custom loader', done => {
    testBuild({}, 'custom-loader', done);
  });
  it('should support custom path', done => {
    testBuild({
      hash: true,
      mode: 'production'
    }, 'custom-path', done);
  });
  it('should support define', done => {
    process.env.NODE_ENV = 'debug';
    testBuild({}, 'define', done);
  });
  it('should support es6', done => {
    testBuild({}, 'es6', done);
  });
  it('should support global', done => {
    testBuild({}, 'global', done);
  });
  it('should support less', done => {
    testBuild({}, 'less', done);
  });
  it('should support load on demand', done => {
    testBuild({}, 'load-on-demand', done);
  });
  it('should support map hash', done => {
    testBuild({
      hash: true
    }, 'map-hash', done);
  });
  it('should support compress default', done => {
    testBuild({}, 'compress', done);
  });
  it('should support sourcemap', done => {
    testBuild({
      compress: true,
      CSSSourceMap: false,
      devtool: 'source-map'
    }, 'sourcemap', done);
  });
  it('should support mix entry and files', done => {
    testBuild({}, 'mix-entry', done);
  });
  it('should support react', done => {
    testBuild({}, 'react', done);
  });
  it('should throw webpack missing error', done => {
    testBuild({}, 'missing', errors => {
      done();
    });
  });
  it('should throw error', done => {
    console.error = process.exit = () => {};
    testBuild({}, 'error', function (err) {
      expect(err).to.be.an('error');
      done();
    });
  });
  it('should throw merge error', done => {
    try {
      console.error = process.exit = () => {};
      testBuild({}, 'merge-error');
    } catch (e) {
      expect(e).to.be.an('error');
      done();
    }
  });
});
