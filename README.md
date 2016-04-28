# proteus-charts 
[![Build Status](https://travis-ci.org/proteus-h2020/proteus-charts.svg?branch=development)](https://travis-ci.org/proteus-h2020/proteus-charts)
[![devDependency Status](https://david-dm.org/proteus-h2020/proteus-charts/dev-status.svg)](https://david-dm.org/0xNacho/proteus-charts#info=devDependencies)
[![Dependency Status](https://david-dm.org/proteus-h2020/proteus-charts.svg)](https://david-dm.org/0xNacho/proteus-charts)
[![codecov](https://codecov.io/gh/proteus-h2020/proteus-charts/branch/development/graph/badge.svg)](https://codecov.io/gh/proteus-h2020/proteus-charts/branch/development)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/828f75b1887540969e7e79937715198b)](https://www.codacy.com/app/nachogarcia91/proteus-charts)

HTML5 and CSS3 charts.


## How to run
`cd proteus-charts`

`npm install`

`npm serve`

Open your browser on http://localhost:8888 and visit the examples folder.

**Note**: If you wan to run the websocket_* examples, you need to start a websocket server in the background. This project provides a very basic implementation of this (it sends random data every half second):

`node websocket-server.js`

## Testing on a local environment
If you are running tests on your local machine, yo need to do the following:

`export CHROME_BIN=/usr/bin/google-chrome # or choose your custom google-chrome location`

Why? By default, karma runner uses Chromium v37.0, which currently does not support ES6 features.

## Project structure / code convention
Folder/file descriptions and code convention: [directory-structure.md](https://github.com/PROTEUS-H2020/proteus-graphs/blob/master/directory-structure.md) 
