(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
  (factory((global.proteic = global.proteic || {}),global.d3));
}(this, (function (exports,d3) { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var SvgContext = (function () {
    function SvgContext(strategy, config) {
        this.strategy = strategy;
        this.strategy.setConfig(config);
        this.strategy.initialize();
    }
    SvgContext.prototype.draw = function (data) {
        this.strategy.draw(data);
    };
    return SvgContext;
}());

var Chart = (function () {
    function Chart(strategy) {
        this.config = this.loadConfigFromUser({});
        this.context = new SvgContext(strategy, this.config);
    }
    Chart.prototype.draw = function (data) {
        this.context.draw(data);
    };
    return Chart;
}());

var Component = (function () {
    function Component() {
    }
    Component.prototype.configure = function (config, svg) {
        this.config = config;
        this.svg = svg;
    };
    return Component;
}());

var XAxis = (function (_super) {
    __extends(XAxis, _super);
    function XAxis() {
        _super.call(this);
    }
    XAxis.prototype.render = function () {
        var width = this.config.get('width'), height = this.config.get('height'), xAxisFormat = this.config.get('xAxisFormat'), xAxisType = this.config.get('xAxisType'), xAxisLabel = this.config.get('xAxisLabel');
        this.initializeXAxis(width, xAxisFormat, xAxisType);
        this.svg
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(this._xAxis);
        this.svg
            .append('text')
            .attr('class', 'xaxis-title')
            .attr("text-anchor", "middle")
            .attr('x', width / 2)
            .attr('y', height + 40)
            .text(xAxisLabel)
            .style('font', '0.8em Montserrat, sans-serif');
    };
    XAxis.prototype.update = function (data) {
        var xAxisType = this.config.get('xAxisType');
        if (xAxisType === 'linear') {
            var minX = d3.min(data, function (d) { return d.x; }), maxX = d3.max(data, function (d) { return d.x; });
        }
        else {
            console.error('not implemented');
        }
    };
    XAxis.prototype.updateDomainByMinMax = function (min$$1, max$$1) {
        this._xAxis.scale().domain([min$$1, max$$1]);
    };
    XAxis.prototype.initializeXAxis = function (width, xAxisFormat, xAxisType) {
        switch (xAxisType) {
            case 'time':
                this._xAxis = d3.axisBottom(d3.scaleTime().range([0, width]));
                break;
            case 'linear':
                this._xAxis = d3.axisBottom(d3.scaleLinear().range([0, width])).tickFormat(d3.format(xAxisFormat));
                break;
            case 'categorical':
                this._xAxis = d3.axisBottom(d3.scaleBand().rangeRound([0, width]).padding(0.1).align(0.5));
                break;
            default:
                throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
        }
    };
    Object.defineProperty(XAxis.prototype, "xAxis", {
        get: function () {
            return this._xAxis;
        },
        enumerable: true,
        configurable: true
    });
    return XAxis;
}(Component));

var YAxis = (function (_super) {
    __extends(YAxis, _super);
    function YAxis() {
        _super.call(this);
    }
    YAxis.prototype.render = function () {
        var width = this.config.get('width'), height = this.config.get('height'), yAxisFormat = this.config.get('yAxisFormat'), yAxisType = this.config.get('yAxisType'), yAxisLabel = this.config.get('yAxisLabel');
        this.initializeYAxis(width, height, yAxisFormat, yAxisType);
        this.svg
            .append('g')
            .attr('class', 'y axis')
            .attr('stroke-dasharray', '1, 5')
            .call(this._yAxis);
        this.svg
            .append('text')
            .attr('class', 'yaxis-title')
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr('x', 0 - height / 2)
            .attr('y', 0 - 55)
            .text(yAxisLabel)
            .style('font', '0.8em Montserrat, sans-serif');
    };
    YAxis.prototype.update = function (data) {
    };
    YAxis.prototype.initializeYAxis = function (width, height, yAxisFormat, yAxisType) {
        switch (yAxisType) {
            case 'linear':
                this._yAxis = d3.axisLeft(d3.scaleLinear().range([height, 0])).tickFormat(d3.format(yAxisFormat)).tickSizeInner(-width).tickSizeOuter(0).tickPadding(20);
                break;
            case 'categorical':
                this._yAxis = d3.axisLeft(d3.scaleBand().rangeRound([height, 0]).padding(0.1).align(0.5));
                break;
            default:
                throw new Error('Not allowed type for YAxis. Only allowed "time",  "linear" or "categorical". Got: ' + yAxisType);
        }
        this._yAxis.tickFormat(d3.format(yAxisFormat))
            .tickSizeInner(-width)
            .tickSizeOuter(0)
            .tickPadding(20);
    };
    Object.defineProperty(YAxis.prototype, "yAxis", {
        get: function () {
            return this._yAxis;
        },
        enumerable: true,
        configurable: true
    });
    return YAxis;
}(Component));

var XYAxis = (function (_super) {
    __extends(XYAxis, _super);
    function XYAxis() {
        _super.call(this);
        this._x = new XAxis();
        this._y = new YAxis();
    }
    XYAxis.prototype.render = function () {
        this._x.render();
        this._y.render();
    };
    XYAxis.prototype.update = function (data) {
        this._x.update(data);
        this._y.update(data);
    };
    XYAxis.prototype.configure = function (config, svg) {
        _super.prototype.configure.call(this, config, svg);
        this._x.configure(config, svg);
        this._y.configure(config, svg);
    };
    Object.defineProperty(XYAxis.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYAxis.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    return XYAxis;
}(Component));

var Lineset = (function (_super) {
    __extends(Lineset, _super);
    function Lineset(xyAxes) {
        var _this = this;
        _super.call(this);
        this.xyAxes = xyAxes;
        this.lineGenerator = d3.line()
            .x(function (d) { return _this.xyAxes.x.xAxis.scale()(d.x); })
            .y(function (d) { return _this.xyAxes.y.yAxis.scale()(d.y); });
    }
    Lineset.prototype.render = function () {
    };
    Lineset.prototype.update = function (data) {
        var _this = this;
        var dataSeries = d3.nest().key(function (d) { return d.key; }).entries(data), series = null, lines = null, colorScale = this.config.get('colorScale');
        this.svg.selectAll('g.serie').remove();
        console.log('dataseries', dataSeries);
        series = this.svg.selectAll('g.serie');
        lines = series
            .data(dataSeries, function (d) { return d.key; })
            .enter()
            .append('g')
            .attr('class', 'serie')
            .attr('stroke', function (d, i) { return colorScale(i); })
            .append('svg:path')
            .style('stroke', function (d, i) { return colorScale(i); })
            .style('stroke-width', 1.3)
            .style('fill', 'none')
            .attr('d', function (d) { return _this.lineGenerator(d.values); })
            .attr('class', 'line');
    };
    return Lineset;
}(Component));

var Container = (function () {
    function Container(config) {
        this.components = [];
        this.config = config;
        var selector = this.config.get('selector'), width = this.config.get('width'), height = this.config.get('height'), marginLeft = this.config.get('marginLeft'), marginRight = this.config.get('marginRight'), marginTop = this.config.get('marginTop'), marginBottom = this.config.get('marginBottom');
        width += marginLeft + marginRight;
        height += marginTop + marginBottom;
        this.initializeContainer(selector, width, height, marginLeft, marginTop);
    }
    Container.prototype.add = function (component) {
        this.components.push(component);
        component.configure(this.config, this.svg);
        component.render();
        return this;
    };
    Container.prototype.initializeContainer = function (selector, width, height, marginLeft, marginTop) {
        this.svg = d3.select(selector)
            .append('svg:svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('class', 'chartContainer')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
    };
    Container.prototype.updateComponents = function (data) {
        for (var i = 0; i < this.components.length; i++) {
            var component = this.components[i];
            component.update(data);
        }
    };
    return Container;
}());

var SvgChart = (function () {
    function SvgChart() {
    }
    SvgChart.prototype.initialize = function () {
        this.container = new Container(this.config);
    };
    SvgChart.prototype.setConfig = function (config) {
        this.config = config;
    };
    return SvgChart;
}());

var SvgStrategyLinechart = (function (_super) {
    __extends(SvgStrategyLinechart, _super);
    function SvgStrategyLinechart() {
        _super.call(this);
        this.axes = new XYAxis();
        this.lines = new Lineset(this.axes);
    }
    SvgStrategyLinechart.prototype.draw = function (data) {
        this.container.updateComponents(data);
    };
    SvgStrategyLinechart.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.container.add(this.axes).add(this.lines);
    };
    return SvgStrategyLinechart;
}(SvgChart));

var Config = (function () {
    function Config() {
        this.properties = {};
    }
    Config.prototype.put = function (key, value) {
        this.properties[key] = value;
        return this;
    };
    Config.prototype.get = function (key) {
        return this.properties[key];
    };
    return Config;
}());

var paletteCategory1 = [
    '#e1c8df',
    '#9ecd9d',
    '#acd9d6',
    '#e4e36b',
    '#bfa1c5',
    '#e4d3b8',
    '#facba8',
    '#ced4ea',
    '#acd9d6'
];
var paletteCategory2 = [
    '#b6dde2',
    '#6394af',
    '#e4e9ab',
    '#8ea876',
    '#f7dce1',
    '#cc878f',
    '#fadaac',
    '#f29a83',
    '#8d7e9e'
];
var paletteCategory3 = [
    '#6b68a9',
    '#8cc590',
    '#b9487d',
    '#bfa1c5',
    '#4e6936',
    '#71bbc3',
    '#484156',
    '#ccaf44',
    '#d0553c'
];
var paletteCategory4 = [
    '#f1a30d',
    '#1d4763',
    '#84c7bc',
    '#c1212d',
    '#8fbe46',
    '#076837',
    '#563a2d',
    '#563a2d',
    '#87325d'
];
var paletteCategory5 = [
    '#f1a30d',
    '#0c3183',
    '#acd9d6',
    '#c1212d',
    '#8fbe46',
    '#076837',
    '#8a6338',
    '#8d2d84',
    '#f09bbc'
];
var paletteCategory6 = [
    '#71bbc3',
    '#1d4763',
    '#8fbe46',
    '#4e6936',
    '#ee8998',
    '#c1212d',
    '#f5af3c',
    '#e95e2e',
    '#634484'
];
var paletteCategory7 = [
    '#ea671e',
    '#684592',
    '#84b92a',
    '#cd131c',
    '#3c5ba2',
    '#5baddc',
    '#ffde06',
    '#5db68b',
    '#775e47'
];
var paletteCategory8 = [
    '#ebd646',
    '#a50f38',
    '#00a096',
    '#f09bbc',
    '#065b78',
    '#72722a',
    '#005231',
    '#4d4e98',
    '#7c4d25'
];
var paletteSequentialYellow = [
    '#fff1c6',
    '#fee5a7',
    '#fcda87',
    '#face64',
    '#f8bf4b',
    '#f6b030',
    '#f4a009',
    '#d28514',
    '#b36c17',
    '#955618',
    '#7a4317',
    '#613214',
    '#49230f'
];
var paletteSequentialRedOrange = [
    '#ffecb8',
    '#fbd68b',
    '#f7bf5e',
    '#f3a82f',
    '#df7520',
    '#cd4925',
    '#be0a26',
    '#a81023',
    '#941320',
    '#80141d',
    '#6d1419',
    '#5a1215',
    '#470f0f'
];
var paletteSequentialRed = [
    '#fde4d4',
    '#f1c4af',
    '#f7bf5e',
    '#db826a',
    '#d0614d',
    '#c73e36',
    '#be0a26',
    '#a81023',
    '#941320',
    '#80141d',
    '#6d1419',
    '#5a1215',
    '#470f0f'
];
var paletteSequentialPink = [
    '#fbe3e3',
    '#f9cfcc',
    '#f0aaa9',
    '#ed7e7e',
    '#ea647b',
    '#e74576',
    '#e41270',
    '#c70f65',
    '#aa105c',
    '#8d1253',
    '#731448',
    '#5a123c',
    '#420e30'
];
var paletteSequentialPurplePink = [
    '#f9d8e6',
    '#ebbed7',
    '#dda4c7',
    '#c890bb',
    '#b27daf',
    '#8a4c94',
    '#622181',
    '#622181',
    '#50216b',
    '#472060',
    '#3e1f55',
    '#361e4b',
    '#2d1c41'
];
var paletteSequentialPurple = [
    '#f6e8f1',
    '#dcc5de',
    '#c2a3c9',
    '#a980b3',
    '#905e9f',
    '#793f8e',
    '#622181',
    '#592175',
    '#4f216b',
    '#462060',
    '#3d1f55',
    '#351e4b',
    '#2c1c41'
];
var paletteSequentialBlue = [
    '#e5f2f9',
    '#d1e5f5',
    '#afd3ed',
    '#91afd7',
    '#738bbf',
    '#3c5a9e',
    '#0c3183',
    '#132a68',
    '#10204c',
    '#0b193b',
    '#06142f',
    '#051228',
    '#061020'
];
var paletteSequentialLightBlue = [
    '#eff8fd',
    '#d9eff6',
    '#c2e5ef',
    '#a8dae8',
    '#90cbe4',
    '#76b8e1',
    '#5baddc',
    '#4d96cc',
    '#427ebc',
    '#3a67ab',
    '#324c88',
    '#29366b',
    '#1e2354'
];
var paletteSequentialBlueViolet = [
    '#edf7e7',
    '#c8e3d2',
    '#91cdbf',
    '#41b5ab',
    '#218ba4',
    '#145d94',
    '#0c3183',
    '#0d2d76',
    '#0d2a6a',
    '#0e265e',
    '#0d2253',
    '#0c1e47',
    '#0b1a3c'
];
var paletteSequentialTurquoise = [
    '#e2ecf6',
    '#cadfe6',
    '#b1d3d6',
    '#94c6c6',
    '#74b9b6',
    '#4caca6',
    '#00a096',
    '#008d89',
    '#007b7c',
    '#006a6f',
    '#005963',
    '#004a57',
    '#063b4c'
];
var paletteSequentialLightGreen = [
    '#faf9de',
    '#e9efc3',
    '#d7e4a7',
    '#c5d989',
    '#b1ce6a',
    '#9cc34c',
    '#84b92a',
    '#6fa32b',
    '#5a8f2a',
    '#477c29',
    '#346b27',
    '#205b24',
    '#074d21'
];
var paletteSequentialDarkGreen = [
    '#eaf3e5',
    '#c7d5be',
    '#a3ba9a',
    '#80a078',
    '#5c885a',
    '#357442',
    '#00632e',
    '#00592b',
    '#004e27',
    '#004423',
    '#033a1e',
    '#053019',
    '#052613'
];
var paletteSequentialGreenBrown = [
    '#f7eccd',
    '#d9cba6',
    '#bcad82',
    '#a29162',
    '#887946',
    '#716330',
    '#5b501f',
    '#51461d',
    '#483d1b',
    '#3f3418',
    '#362b15',
    '#2d2311',
    '#231a0d'
];
var paletteSequentialBrown = [
    '#f7eccd',
    '#eed3ab',
    '#e4bb89',
    '#dba269',
    '#ad7446',
    '#834d2c',
    '#5e2f19',
    '#552a18',
    '#4c2516',
    '#432113',
    '#3a1c11',
    '#32180f',
    '#29130b'
];
var paletteSequentialGrey = [
    '#e5e8ea',
    '#bdbfc3',
    '#999a9f',
    '#77797f',
    '#595c64',
    '#3e444c',
    '#253038',
    '#20282e',
    '#1a2024',
    '#15181b',
    '#0e1112',
    '#070808',
    '#000000'
];
var paletteSequentialVioletCb = [
    '#f4f3f9',
    '#e0dced',
    '#cbc6e0',
    '#b7b0d4',
    '#948cbf',
    '#706baa',
    '#4d4e98',
    '#484889',
    '#42427a',
    '#3d3c6c',
    '#37365e',
    '#313050',
    '#2c2a44'
];
var paletteSequentialPinkCb = [
    '#fbe5ee',
    '#f8ccd5',
    '#f4b2bc',
    '#f096a3',
    '#d56976',
    '#bc3f52',
    '#a50f38',
    '#951735',
    '#851b31',
    '#761d2e',
    '#671e2a',
    '#581d26',
    '#4a1c22'
];
var paletteSequentialBlueCb = [
    '#eaf6fc',
    '#cfe4f4',
    '#cfe4f4',
    '#91bfe3',
    '#6999bb',
    '#417797',
    '#065b78',
    '#11536b',
    '#174b5f',
    '#194354',
    '#1a3b49',
    '#1a343f',
    '#192d35'
];
var paletteSequentialGreenCb = [
    '#fff7d0',
    '#e9e09b',
    '#d1ca62',
    '#b7b623',
    '#9e9e28',
    '#88872a',
    '#72722a',
    '#676726',
    '#5c5c23',
    '#51511f',
    '#47471b',
    '#3d3d17',
    '#333413'
];
var paletteSequentialGreenBrownCb = [
    '#f2edde',
    '#d8d1c0',
    '#bfb699',
    '#a09778',
    '#837b5a',
    '#686141',
    '#4f4b2c',
    '#3e3e1f',
    '#2e3313',
    '#292d14',
    '#232613',
    '#1e2012',
    '#191a10'
];
var paletteDivergingSpectral1 = [
    '#98141f',
    '#ab332c',
    '#bf5040',
    '#d5705b',
    '#e4a57f',
    '#f3d6a6',
    '#f5f2b8',
    '#cfdbb1',
    '#a4c4a9',
    '#71ada1',
    '#4e868f',
    '#2e637d',
    '#06456c'
];
var paletteDivergingSpectral2 = [
    '#d43d4f',
    '#df564b',
    '#eb6d45',
    '#f08e53',
    '#f8b96f',
    '#fee08b',
    '#f5f2b8',
    '#d7e5b1',
    '#b5d7aa',
    '#8ec8a3',
    '#6abda3',
    '#4fa4b5',
    '#3489be'
];
var paletteDivergingSpectral3 = [
    '#651035',
    '#ae1143',
    '#c9314b',
    '#dd7257',
    '#eeb27a',
    '#feeb9e',
    '#f5f2b8',
    '#cadfba',
    '#96cabb',
    '#50b4bb',
    '#3eaecc',
    '#206791',
    '#0c2c63'
];
var paletteDivergingBrownTurquoise = [
    '#3f3128',
    '#683828',
    '#933624',
    '#d5705b',
    '#db9c5e',
    '#feeb9e',
    '#f5f2b8',
    '#cfdbb1',
    '#a4c4a9',
    '#71ada1',
    '#628f85',
    '#53746d',
    '#475b57'
];
var paletteDivergingOrangePink = [
    '#e7511e',
    '#eb6929',
    '#ee7f37',
    '#f29446',
    '#f9c083',
    '#ffe9c3',
    '#ffeee3',
    '#f9cfc1',
    '#f3a9ab',
    '#db6882',
    '#c71360',
    '#891953',
    '#4b1c47'
];
var paletteDivergingRedBlue = [
    '#b2172b',
    '#c4443e',
    '#d76a5a',
    '#ed937e',
    '#f4b8a2',
    '#fcdbc7',
    '#efefef',
    '#bfcad5',
    '#8ba7bc',
    '#4d87a5',
    '#3c7ca0',
    '#28729b',
    '#036896'
];
var paletteDivergingRedGrey = [
    '#b2172b',
    '#c54532',
    '#da6c3b',
    '#f29446',
    '#f8bc67',
    '#fee08b',
    '#efece5',
    '#c9c5c1',
    '#a5a19f',
    '#808080',
    '#666666',
    '#333333',
    '#000000'
];
var paletteDivergingOrangeViolet = [
    '#98141f',
    '#ab332c',
    '#f9bc47',
    '#fdcf66',
    '#fede8d',
    '#ffecb3',
    '#f9eff6',
    '#e8d0e3',
    '#a4c4a9',
    '#a973aa',
    '#834f96',
    '#622181',
    '#402357'
];
var paletteDivergingPurpleGreen = [
    '#59194b',
    '#85134b',
    '#c71360',
    '#db6882',
    '#eba7a8',
    '#fce0ca',
    '#faefe1',
    '#dbd9aa',
    '#b9c26e',
    '#94ad31',
    '#728b2b',
    '#546c25',
    '#39521f'
];
var paletteDivergingVioletGreen = [
    '#55296e',
    '#75408e',
    '#8a5fa0',
    '#a081b5',
    '#beadcf',
    '#ddd7e7',
    '#eae8ed',
    '#c1d4bc',
    '#93be86',
    '#58a951',
    '#3c853e',
    '#23662f',
    '#084a22'
];
var paletteDivergingRedGreen = [
    '#b2172b',
    '#c5403c',
    '#d96453',
    '#ef8972',
    '#f6b49c',
    '#fcdbc7',
    '#f9ebde',
    '#dad6a8',
    '#b9c16d',
    '#94ad31',
    '#728b2b',
    '#546c25',
    '#39521f'
];
var paletteDivergingBrownGreen = [
    '#735146',
    '#846454',
    '#977a65',
    '#aa9177',
    '#c2ad91',
    '#dbcaad',
    '#edebd6',
    '#c4d6aa',
    '#94bf7c',
    '#58a951',
    '#3c853e',
    '#23662f',
    '#084a22'
];
var paletteDivergingLightBrownTurquoise = [
    '#8b5219',
    '#a46821',
    '#bf812c',
    '#cfa151',
    '#e2c489',
    '#f6e8c3',
    '#f5f1df',
    '#cbdccc',
    '#9cc6b9',
    '#60afa6',
    '#359790',
    '#1d7d75',
    '#00665e'
];






function category7() {
    return d3.scaleOrdinal().range(paletteCategory7);
}

var defaults = {
    selector: '#chart',
    colorScale: category7(),
    areaOpacity: 0.4,
    xAxisType: 'linear',
    xAxisFormat: '',
    xAxisLabel: null,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: null,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    markerShape: 'circle',
    markerSize: 5,
    markerOutlineWidth: 2,
    width: '100%',
    height: 250,
    onDown: function (d) {
    },
    onHover: function (d) {
    },
    onLeave: function (d) {
    },
    onClick: function (d) {
    },
    maxNumberOfElements: 100,
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



function isPercentage(n) {
  let split = null;
  let number = null;
  if (!n || typeof n !== 'string') {
    return false;
  }
  split = n.split('%');
  number = (+split[0]);
  return split.length === 2 &&
    (number >= 0) &&
    (number <= 100);
}

function calculateWidth(widthConfig, selector) {
  if (widthConfig === 'auto') {
    return d3.select(selector)
      .node()
      .getBoundingClientRect()
      .width;
  }
  else if (isNumeric(widthConfig)) {
    return widthConfig;
  }
  else if (isPercentage(widthConfig)) {
    let containerWidth, percentage;
    containerWidth = d3.select(selector)
      .node()
      .getBoundingClientRect()
      .width;
    percentage = widthConfig.split('%')[0];
    return Math.round(percentage * containerWidth / 100);
  } else {
    throw Error('Unknow config width value: ' + widthConfig);
  }
}

var Linechart = (function (_super) {
    __extends(Linechart, _super);
    function Linechart(data) {
        _super.call(this, new SvgStrategyLinechart());
    }
    Linechart.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults.selector, marginTop = userData['marginTop'] || defaults.marginTop, marginLeft = userData['marginLeft'] || defaults.marginLeft, marginRight = userData['marginRight'] || defaults.marginRight, marginBottom = userData['marginBottom'] || defaults.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults.height, xAxisType = userData['xAxisType'] || defaults.xAxisType, xAxisFormat = userData['xAxisFormat'] || defaults.xAxisFormat, xAxisLabel = userData['xAxisLabel'] || defaults.xAxisLabel, yAxisType = userData['yAxisType'] || defaults.yAxisType, yAxisFormat = userData['yAxisFormat'] || defaults.yAxisFormat, yAxisLabel = userData['yAxisLabel'] || defaults.yAxisLabel, colorScale = userData['colorScale'] || defaults.colorScale, onDown = userData['onDown'] || defaults.onDown, onUp = userData['onUp'] || defaults.onUp, onHover = userData['onHover'] || defaults.onHover, onClick = userData['onClick'] || defaults.onClick, onLeave = userData['onLeave'] || defaults.onLeave, markerOutlineWidth = userData['markerOutlineWidth'] || defaults.markerOutlineWidth, markerShape = userData['markerShape'] || defaults.markerShape, markerSize = (typeof userData['markerSize'] === 'undefined' || userData['markerSize'] < 0) ? defaults.markerSize : userData['markerSize'], areaOpacity = (typeof userData['areaOpacity'] === 'undefined' || userData['markerSize'] < 0) ? defaults.areaOpacity : userData['areaOpacity'];
        config.put('selector', selector);
        config.put('marginTop', marginTop);
        config.put('marginLeft', marginLeft);
        config.put('marginRight', marginRight);
        config.put('marginBottom', marginBottom);
        config.put('width', width);
        config.put('height', height);
        config.put('xAxisType', xAxisType);
        config.put('xAxisFormat', xAxisFormat);
        config.put('xAxisLabel', xAxisLabel);
        config.put('yAxisType', yAxisType);
        config.put('yAxisFormat', yAxisFormat);
        config.put('yAxisLabel', yAxisLabel);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('markerOutlineWidth', markerOutlineWidth);
        config.put('markerShape', markerShape);
        config.put('markerSize', markerSize);
        config.put('areaOpacity', areaOpacity);
        return config;
    };
    return Linechart;
}(Chart));

exports.Linechart = Linechart;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=proteic.js.map
