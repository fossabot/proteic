```html
<script type="text/javascript" src="proteic.min.js"></script>
<script type="text/javascript" src="https://d3js.org/d3.v4.min.js"></script>

<!-- By default, Proteic.js places the chart into div#chart -->
<div style id='chart'></div>

<script type="text/javascript">
var data = [
  {x: 'SP', key: '- 18', y: 30},
  {x: 'SP', key: '+ 18 - 35', y: 25},
  {x: 'SP', key: '+ 35', y: 45},
  {x: 'FR', key: '- 18', y: 10},
  {x: 'FR', key: '+ 18 - 35', y: 50},
  {x: 'FR', key: '+ 35', y: 40}
];

var barchart = new proteic.Barchart(data);
barchart.draw();
</script>
```

## Dependencies
Proteic.js has a unique but important dependency: <a href="https://d3js.org/">D3.js</a>. We are using the recently released version 4, which has not compatibility with previous versions. Yo can have a look into the changes <a href="https://github.com/d3/d3/blob/master/CHANGES.md">here</a>.

## Examples

You can visit <a href="https://proteus-h2020.github.io/proteic">this site</a> which is a build of the current project. We are still developing and constantly adding new  features but you can already use our <a href="https://github.com/proteus-h2020/proteic/releases">stable releases</a>.


## Contributing
If you are interested in the project and you want to collaborate in your spare time, you can have a look into the <a href="https://github.com/proteus-h2020/proteic/blob/development/CONTRIBUTING.md">contributing guide</a>.


## Developers

We provide the following NPM Scripts to ease the development process. You can run each script like the following `npm run-script serve:watch`

- `lint`: runs the JSHint linter to detect errors and problems in the code
- `pretest`: builds the source code before testing
- `test`: runs the tests using Karma
- `prebuild`: removes the build directory before building to prevent errors
- `build`: builds the source code with Rollup.js
- `serve`: launches an http debug server on (http://localhost:8080/)[http://localhost:8080/] 
- `serve:watch`: launches an http debug server and automatically refreshes the browser after every change

### JSDocs

If you need more information about the ProteicJS API, you can visit our JSDocs <a href="http://proteus-h2020.github.io/proteic/docs/gen/">site</a>