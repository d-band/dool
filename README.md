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

  Options:

    -h, --help     output usage information
    -v, --version  output the version number

  Commands:

    init           initialize
    build          build entry files specified in package.json
    server         debug with server
    test           unit test

    
$ dool build -h

  Usage: dool-build [options]

  Options:

    -h, --help                output usage information
    -v, --version             output the version number
    -o, --output-path <path>  output path
    -w, --watch [delay]       watch file changes and rebuild
    --hash                    build with hash and output map.json
    --devtool <devtool>       sourcemap generate method, default is null
    --config <path>           custom config path, default is webpack.config.js
    --no-compress             build without compress
```

[![asciicast](https://asciinema.org/a/34125.png)](https://asciinema.org/a/34125)

## Report a issue

* [All issues](https://github.com/d-band/dool/issues)
* [New issue](https://github.com/d-band/dool/issues/new)

## License

dool is available under the terms of the MIT License.
