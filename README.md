ProteicJS 
==============
[![Build Status](https://travis-ci.org/proteus-h2020/proteic.svg?branch=master)](https://travis-ci.org/proteus-h2020/proteic)
[![Dependency Status](https://www.versioneye.com/user/projects/57ee106f16c630002a9a2022/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/57ee106f16c630002a9a2022)
[![codecov](https://codecov.io/gh/proteus-h2020/proteus-charts/branch/development/graph/badge.svg)](https://codecov.io/gh/proteus-h2020/proteus-charts/branch/development)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4e39876ac5324eba8035c6f5ec95b52b)](https://www.codacy.com/app/0xnacho/proteic?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=proteus-h2020/proteic&amp;utm_campaign=Badge_Grade)
[![Gitter](https://img.shields.io/gitter/room/proteus-h2020/proteic.svg?maxAge=2592000)](https://gitter.im/proteus-h2020/proteic)

![alt text](https://github.com/proteus-h2020/proteic/blob/es6-modules/images/proteo.jpg "Proteic.js")


An awesome web visualization library for both streaming and batch data. It is part of the broader [PROTEUS project](http://www.proteus-bigdata.com/). 

Creating a chart with Proteus Charts is as easy as:

- Including the dependencies: 
```html
<script src='https://rawgit.com/proteus-h2020/proteic/development/build/bundle.min.js'></script>
```
- Creating some charts:
```js
var data = [
  {
    'key': 'serie1',
    values: [{x:0, y:1}, {x:1, y:4}]
  }
];
var linechart = new Linechart(data);
linechart.draw();
```
You can see a full list of examples on: [http://proteus-h2020.github.io/proteic/](http://proteus-h2020.github.io/proteic)

Features
--------
- Ready for batch and streaming data
- Streaming support via WebSockets
- Configurable charts via JSON
- Available charts:
  - Bar chart
  - Line chart
  - Stream graph
  - Gauge chart
  - Sunburst diagram
  - Swimlane diagram
  - More comming Soon™

Running the examples
--------------------
```bash
git clone https://github.com/proteus-h2020/proteic && cd proteic
npm install
npm run serve
```
Now you can browse on http://localhost:8888 and see the full list of working examples

Debug
----------
Every time you make a change in your code:
```bash
rollup  -g d3-dispatch:d3,proteus-colors:proteus -f umd -n Proteus -o build/bundle.js -- index.js
```

We're currently working to provide an http debug server that automatically refresh the website after every change.

Contribute
----------
Proteus Charts its an Open Source project. We encourage you to read our [contribution guidelines](https://github.com/proteus-h2020/proteic/blob/master/CONTRIBUTING.md) and help us with the development process.

## Examples

See a full list of examples on: [http://proteus-h2020.github.io/proteic/](http://proteus-h2020.github.io/proteic/)
## Testing on a local environment
If you are running tests on your local machine, yo need to do the following:

`export CHROME_BIN=/usr/bin/google-chrome # or choose your custom google-chrome location`

Why? By default, karma runner uses Chromium v37.0, which currently does not support ES6 features.

## Project structure / code convention
Folder/file descriptions and code convention: [directory-structure.md](https://github.com/PROTEUS-H2020/proteus-graphs/blob/master/directory-structure.md) 
