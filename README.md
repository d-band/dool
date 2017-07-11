dool
===

> d-band tool & dev tool based on webpack, changed from [atool](https://github.com/ant-tool)

```
________               ______
___  __ \______ ______ ___  /
__  / / /_  __ \_  __ \__  / 
_  /_/ / / /_/ // /_/ /_  /  
/_____/  \____/ \____/ /_/ 

```


[![NPM version](https://img.shields.io/npm/v/dool.svg)](https://www.npmjs.com/package/dool)
[![NPM downloads](https://img.shields.io/npm/dm/dool.svg)](https://www.npmjs.com/package/dool)
[![Build Status](https://travis-ci.org/d-band/dool.svg?branch=master)](https://travis-ci.org/d-band/dool)
[![Coverage Status](https://coveralls.io/repos/github/d-band/dool/badge.svg?branch=master)](https://coveralls.io/github/d-band/dool?branch=master)
[![Dependency Status](https://david-dm.org/d-band/dool.svg)](https://david-dm.org/d-band/dool)
[![Greenkeeper badge](https://badges.greenkeeper.io/d-band/dool.svg)](https://greenkeeper.io/)

---

## Install

```bash
$ npm install dool -g
```

## Usage

- Examples: https://github.com/d-band/dool-examples


```
$ dool -h

  Usage: dool <command> [options]

  Commands:
    init    Initialize project
    build   Build project
    server  Serve project

  Options:
    --version, -v  Show version number
    --help, -h     Show help

    
$ dool build -h

  Usage: dool build [options]

  Options:
    --version, -v      Show version number                               [boolean]
    --help, -h         Show help                                         [boolean]
    --compress         Build with compress                         [default: true]
    --extract          Build with extract CSS                      [default: true]
    --config           Custom config path           [default: "webpack.config.js"]
    --hash             Build with hash and output map.json        [default: false]
    --watch, -w        Watch and rebuild                          [default: false]
    --cluster          Run build with cluster                     [default: false]
    --output-path, -o  Output path                             [default: "./dist"]
    --public-path, -P  Public path                                        [string]
    --devtool          SourceMap generate method                          [string]
    --verbose          Show more details                          [default: false]
```

[![asciicast](https://asciinema.org/a/34125.png)](https://asciinema.org/a/34125)

## Configuration

- configuration file: `.doolrc` or `.doolrc.js`
- `.doolrc` is JSON file
- `.doolrc.js` support export Object or Function

```javascript
// .doolrc
{
  entry: Object,
  files: String | Array,
  filesBase: String,
  publicPath: String,
  outputPath: String,
  babelPlugins: Array,
  postcssPlugins: Object,
  autoprefixer: false | Object,
  externals: Object,
  extract: Boolean,
  CSSModules: true | Array,
  CSSSourceMap: Boolean,
  commons: true | Object | Array,
  compress: Boolean,
  hash: Boolean,
  devtool: String,
  devServer: Object
}
```

## Report a issue

* [All issues](https://github.com/d-band/dool/issues)
* [New issue](https://github.com/d-band/dool/issues/new)

## License

dool is available under the terms of the MIT License.
