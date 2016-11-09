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

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function isEven(n) {
    return n % 2 === 0;
}
function isPercentage(n) {
    var split = null;
    var number = null;
    if (!n || typeof n !== 'string') {
        return false;
    }
    split = n.split('%');
    number = (+split[0]);
    return split.length === 2 &&
        (number >= 0) &&
        (number <= 100);
}



function copy(object) {
    return object != null ? JSON.parse(JSON.stringify(object)) : null;
}
function deg2rad(deg) {
    return deg * Math.PI / 180;
}

var Chart = (function () {
    function Chart(strategy, data, userConfig) {
        this.ds = null;
        this.dispatcher = d3.dispatch('onmessage', 'onopen', 'onerror');
        this.config = this.loadConfigFromUser(userConfig);
        this.context = new SvgContext(strategy, this.config);
        this.data = data;
    }
    Chart.prototype.draw = function (data) {
        if (data === void 0) { data = this.data; }
        this.context.draw(copy(data));
        this.data = data;
    };
    Chart.prototype.datasource = function (ds) {
        var _this = this;
        this.ds = ds;
        this.ds.configure(this.dispatcher);
        this.dispatcher.on('onmessage', function (data) { return _this.keepDrawing(data); });
        this.dispatcher.on('onopen', function (event) {
            console.log('onopen', event);
        });
        this.dispatcher.on('onerror', function (error) {
            console.log('onerror', error);
        });
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
    Component.prototype.clean = function () {
        this.svg.selectAll('.serie').remove();
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
            var min$$1 = d3.min(data, function (d) { return d.x; }), max$$1 = d3.max(data, function (d) { return d.x; });
            this.updateDomainByMinMax(min$$1, max$$1);
        }
        else if (xAxisType === 'time') {
            var min$$1 = d3.min(data, function (d) { return (d.x || d.start); }), max$$1 = d3.max(data, function (d) { return (d.x || d.end); });
            this.updateDomainByMinMax(min$$1, max$$1);
        }
        else {
            var keys$$1 = d3.map(data, function (d) { return d.x; }).keys();
            this.updateDomainByKeys(keys$$1);
        }
        this.transition();
    };
    XAxis.prototype.updateDomainByKeys = function (keys$$1) {
        this._xAxis.scale().domain(keys$$1);
    };
    XAxis.prototype.updateDomainByMinMax = function (min$$1, max$$1) {
        this._xAxis.scale().domain([min$$1, max$$1]);
    };
    XAxis.prototype.transition = function (time) {
        if (time === void 0) { time = 200; }
        this.svg.selectAll('.x.axis').transition().duration(time).call(this._xAxis).on('end', this.applyStyle);
    };
    XAxis.prototype.applyStyle = function () {
        d3.select(this).selectAll('g.tick text')
            .style('font', '1.4em Montserrat, sans-serif')
            .style('fill', function (d, i) { return !isEven(i) || i === 0 ? '#5e6b70' : '#1a2127'; })
            .style('fill', function (d) { return '#1a2127'; });
        d3.select(this).selectAll(['path', 'line'])
            .attr('stroke', 'gray')
            .attr('stroke-width', .3);
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

function simple2stacked(data) {
    return d3.nest().key(function (d) { return d.x; }).rollup(function (array) {
        var r = {};
        for (var i = 0; i < array.length; i++) {
            var object = array[i];
            if (object) {
                r[object.key] = object.y;
            }
        }
        return r;
    }).entries(data);
}
function simple2nested(data, key) {
    if (key === void 0) { key = 'key'; }
    return d3.nest().key(function (d) { return d[key]; }).entries(data);
}


function convertPropretiesToTimeFormat(data, properties, format$$1) {
    data.forEach(function (d) {
        properties.map(function (p) {
            d[p] = d3.timeParse(format$$1)(d[p]);
        });
    });
}
function convertByXYFormat(data, xAxisFormat, xAxisType, yAxisFormat, yAxisType) {
    data.forEach(function (d) {
        switch (xAxisType) {
            case 'time':
                d.x = d3.timeParse(xAxisFormat)(d.x);
                break;
            case 'linear':
                d.x = +d.x;
                break;
        }
        switch (yAxisType) {
            case 'time':
                d.y = d3.timeParse(yAxisFormat)(d.y);
                break;
            case 'linear':
                d.y = +d.y;
                break;
        }
    });
    return data;
}

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
        var yAxisType = this.config.get('yAxisType'), yAxisShow = this.config.get('yAxisShow'), layoutStacked = this.config.get('stacked');
        this.svg.select('g.y.axis').attr('opacity', yAxisShow ? 1 : 0);
        if (yAxisType === 'linear') {
            if (layoutStacked) {
                var keys$$1 = d3.map(data, function (d) { return d.key; }).keys();
                var stack_1 = this.config.get('stack');
                var stackedData = stack_1.keys(keys$$1)(simple2stacked(data));
                var min$$1 = d3.min(stackedData, function (serie) { return d3.min(serie, function (d) { return d[0]; }); });
                var max$$1 = d3.max(stackedData, function (serie) { return d3.max(serie, function (d) { return d[1]; }); });
                this.updateDomainByMinMax(min$$1, max$$1);
            }
            else {
                var min$$1 = d3.min(data, function (d) { return d.y; }), max$$1 = d3.max(data, function (d) { return d.y; });
                this.updateDomainByMinMax(min$$1, max$$1);
            }
        }
        else if (yAxisType === 'categorical') {
            var keys$$1 = d3.map(data, function (d) { return d.key; }).keys().sort();
            this._yAxis.scale().domain(keys$$1);
        }
        else {
            console.warn('could not recognize y axis type', yAxisType);
        }
        this.transition();
    };
    YAxis.prototype.updateDomainByMinMax = function (min$$1, max$$1) {
        this._yAxis.scale().domain([min$$1, max$$1]);
    };
    YAxis.prototype.transition = function (time) {
        if (time === void 0) { time = 200; }
        this.svg.selectAll('.y.axis').transition().duration(200).call(this._yAxis).on('end', this.applyStyle);
    };
    YAxis.prototype.applyStyle = function () {
        d3.select(this).selectAll('g.tick text')
            .style('font', '1.4em Montserrat, sans-serif')
            .style('fill', function (d, i) { return !isEven(i) || i === 0 ? '#5e6b70' : '#1a2127'; });
        d3.select(this).selectAll('g.tick line')
            .style('stroke', function (d, i) { return isEven(i) && i !== 0 ? '#5e6b70' : '#dbdad8'; });
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
        this._yAxis
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

var Pointset = (function (_super) {
    __extends(Pointset, _super);
    function Pointset(x, y) {
        _super.call(this);
        this.x = x;
        this.y = y;
    }
    Pointset.prototype.render = function () {
    };
    Pointset.prototype.update = function (data) {
        var _this = this;
        var dataSeries = d3.nest()
            .key(function (d) { return d.key; })
            .entries(data), markers = null, markerShape = this.config.get('markerShape'), markerSize = this.config.get('markerSize'), markerOutlineWidth = this.config.get('markerOutlineWidth'), colorScale = this.config.get('colorScale'), points = null, series = null;
        this.svg.selectAll('g.points').remove();
        series = this.svg.selectAll('g.points');
        switch (markerShape) {
            case 'dot':
                points = series
                    .data(dataSeries, function (d) { return d.key; })
                    .enter()
                    .append('g')
                    .attr('class', 'points')
                    .style('fill', function (d, i) { return colorScale(i); })
                    .selectAll('circle')
                    .data(function (d) { return d.values; })
                    .enter()
                    .append('circle')
                    .attr('cx', function (d) { return _this.x.xAxis.scale()(d.x); })
                    .attr('cy', function (d) { return _this.y.yAxis.scale()(d.y); })
                    .attr('r', markerSize)
                    .attr('class', 'marker');
                break;
            case 'ring':
                window.console.warn('Deprecated "circle" marker shape: use "dot" or "ring" instead');
                points = series
                    .data(dataSeries, function (d) { return d.key; })
                    .enter()
                    .append('g')
                    .attr('class', 'points')
                    .style('stroke', function (d, i) { return colorScale(i); })
                    .selectAll('circle')
                    .data(function (d, i) { return d.values; })
                    .enter()
                    .append('circle')
                    .attr('cx', function (d) { return _this.x.xAxis.scale()(d.x); })
                    .attr('cy', function (d) { return _this.y.yAxis.scale()(d.y); })
                    .attr('r', markerSize)
                    .attr('class', 'marker')
                    .style('fill', 'white')
                    .style('stroke-width', markerOutlineWidth);
                break;
            case 'circle':
                window.console.warn('Deprecated "circle" marker shape: use "dot" or "ring" instead');
                points = series
                    .data(dataSeries, function (d) { return d.key; })
                    .enter()
                    .append('g')
                    .attr('class', 'points')
                    .style('stroke', function (d, i) { return colorScale(i); })
                    .selectAll('circle')
                    .data(function (d, i) { return d.values; })
                    .enter()
                    .append('circle')
                    .attr('cx', function (d) { return _this.x.xAxis.scale()(d.x); })
                    .attr('cy', function (d) { return _this.y.yAxis.scale()(d.y); })
                    .attr('r', markerSize)
                    .attr('class', 'lineMarker')
                    .style('fill', 'white')
                    .style('stroke-width', markerOutlineWidth);
                break;
            default:
                points = series
                    .data(dataSeries, function (d) { return d.key; })
                    .enter()
                    .append('g')
                    .attr('class', 'points')
                    .style('stroke', function (d, i) { return colorScale(i); })
                    .selectAll('circle')
                    .data(function (d, i) { return d.values; })
                    .enter()
                    .append('circle')
                    .attr('cx', function (d) { return _this.x.xAxis.scale()(d.x); })
                    .attr('cy', function (d) { return _this.y.yAxis.scale()(d.y); })
                    .attr('r', markerSize)
                    .attr('class', 'lineMarker')
                    .style('fill', 'white')
                    .style('stroke-width', markerOutlineWidth);
        }
        markers = this.svg.selectAll('g.points circle');
        markers
            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));
    };
    return Pointset;
}(Component));

var Areaset = (function (_super) {
    __extends(Areaset, _super);
    function Areaset(x, y) {
        _super.call(this);
        this.x = x;
        this.y = y;
    }
    Areaset.prototype.render = function () {
    };
    Areaset.prototype.update = function (data) {
        var _this = this;
        var dataSeries = d3.nest()
            .key(function (d) { return d.key; })
            .entries(data), series = null, areas = null, colorScale = this.config.get('colorScale'), height = this.config.get('height'), areaOpacity = this.config.get('areaOpacity');
        var areaGenerator = d3.area()
            .x(function (d) { return _this.x.xAxis.scale()(d.x); })
            .y0(height)
            .y1(function (d) { return _this.y.yAxis.scale()(d.y); });
        this.svg.selectAll('g.area').remove();
        series = this.svg.selectAll('g.area');
        areas = series
            .data(dataSeries, function (d) { return d.key; })
            .enter()
            .append('g')
            .attr('class', 'area')
            .append('svg:path')
            .style('fill', function (d, i) { return colorScale(i); })
            .style('fill-opacity', areaOpacity)
            .attr('d', function (d) { return areaGenerator(d.values); });
    };
    return Areaset;
}(Component));

var Legend = (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        _super.call(this);
    }
    Legend.prototype.render = function () {
    };
    Legend.prototype.update = function (data) {
        var dataSeries = d3.nest()
            .key(function (d) { return d.key; })
            .entries(data), legend = null, entries = null, colorScale = this.config.get('colorScale'), height = this.config.get('height'), width = this.config.get('width');
        if (dataSeries.length === 1 && dataSeries[0].key === 'undefined') {
            console.warn('Not showing legend, since there is a valid key');
            return;
        }
        this.svg.selectAll('g.legend').remove();
        legend = this.svg.append('g').attr('class', 'legend');
        entries = legend.selectAll('.legend-entry')
            .data(dataSeries, function (d) { return d.key; })
            .enter()
            .append('g')
            .attr('class', 'legend-entry');
        entries.append('rect')
            .attr('x', width + 10)
            .attr('y', function (d, i) { return i * 25; })
            .attr('height', 20)
            .attr('width', 20)
            .attr('fill', function (d, i) { return colorScale(i); })
            .style('opacity', 0.8);
        entries.append('text')
            .attr("x", width + 25 + 10)
            .attr("y", function (d, i) { return i * 25 + 7; })
            .attr("dy", "0.55em")
            .text(function (d) { return d.key; })
            .style('font', '14px Montserrat, sans-serif');
    };
    return Legend;
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
            .style('position', 'relative')
            .style('width', width + "px")
            .style('height', height + "px")
            .append('svg:svg')
            .style('position', 'absolute')
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
    Container.prototype.translate = function (x, y) {
        this.svg.attr('transform', "translate(" + x + ", " + y + ")");
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

function sortByField(array, field) {
    array.sort(function (e1, e2) {
        var a = e1[field];
        var b = e2[field];
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    });
}

var SvgStrategyLinechart = (function (_super) {
    __extends(SvgStrategyLinechart, _super);
    function SvgStrategyLinechart() {
        _super.call(this);
        this.axes = new XYAxis();
        this.lines = new Lineset(this.axes);
    }
    SvgStrategyLinechart.prototype.draw = function (data) {
        var xAxisFormat = this.config.get('xAxisFormat'), xAxisType = this.config.get('xAxisType'), yAxisFormat = this.config.get('yAxisFormat'), yAxisType = this.config.get('yAxisType');
        convertByXYFormat(data, xAxisFormat, xAxisType, yAxisFormat, yAxisType);
        sortByField(data, 'x');
        this.container.updateComponents(data);
    };
    SvgStrategyLinechart.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        var markerSize = this.config.get('markerSize'), areaOpacity = this.config.get('areaOpacity'), legend = this.config.get('legend');
        this.container.add(this.axes).add(this.lines);
        if (areaOpacity > 0) {
            this.area = new Areaset(this.axes.x, this.axes.y);
            this.container.add(this.area);
        }
        if (markerSize > 0) {
            this.markers = new Pointset(this.axes.x, this.axes.y);
            this.container.add(this.markers);
        }
        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
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

function category2() {
    return d3.scaleOrdinal().range(paletteCategory2);
}
function category3() {
    return d3.scaleOrdinal().range(paletteCategory3);
}
function category4() {
    return d3.scaleOrdinal().range(paletteCategory4);
}
function category5() {
    return d3.scaleOrdinal().range(paletteCategory5);
}

function category7() {
    return d3.scaleOrdinal().range(paletteCategory7);
}
function category8() {
    return d3.scaleOrdinal().range(paletteCategory8);
}





















function diverging_spectral2() {
    return d3.scaleQuantile().range(paletteDivergingSpectral2);
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
    yAxisShow: true,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    markerShape: 'ring',
    markerSize: 5,
    markerOutlineWidth: 2,
    width: '100%',
    height: 250,
    legend: true,
    onDown: function (d) {
    },
    onHover: function (d) {
    },
    onLeave: function (d) {
    },
    onClick: function (d) {
    },
    onUp: function (d) {
    },
    maxNumberOfElements: 100,
};

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
        var containerWidth = void 0, percentage = void 0;
        containerWidth = d3.select(selector)
            .node()
            .getBoundingClientRect()
            .width;
        percentage = widthConfig.split('%')[0];
        return Math.round(percentage * containerWidth / 100);
    }
    else {
        throw Error('Unknow config width value: ' + widthConfig);
    }
}

var Linechart = (function (_super) {
    __extends(Linechart, _super);
    function Linechart(data, userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        _super.call(this, new SvgStrategyLinechart(), data, userConfig);
    }
    Linechart.prototype.keepDrawing = function (datum) {
        var datumType = datum.constructor;
        if (datumType === Array) {
            this.data = this.data.concat(datum);
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    };
    Linechart.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults.selector, marginTop = userData['marginTop'] || defaults.marginTop, marginLeft = userData['marginLeft'] || defaults.marginLeft, marginRight = userData['marginRight'] || defaults.marginRight, marginBottom = userData['marginBottom'] || defaults.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults.height, xAxisType = userData['xAxisType'] || defaults.xAxisType, xAxisFormat = userData['xAxisFormat'] || defaults.xAxisFormat, xAxisLabel = userData['xAxisLabel'] || defaults.xAxisLabel, yAxisType = userData['yAxisType'] || defaults.yAxisType, yAxisFormat = userData['yAxisFormat'] || defaults.yAxisFormat, yAxisLabel = userData['yAxisLabel'] || defaults.yAxisLabel, yAxisShow = userData['yAxisShow'] || defaults.yAxisShow, colorScale = userData['colorScale'] || defaults.colorScale, onDown = userData['onDown'] || defaults.onDown, onUp = userData['onUp'] || defaults.onUp, onHover = userData['onHover'] || defaults.onHover, onClick = userData['onClick'] || defaults.onClick, onLeave = userData['onLeave'] || defaults.onLeave, markerOutlineWidth = userData['markerOutlineWidth'] || defaults.markerOutlineWidth, markerShape = userData['markerShape'] || defaults.markerShape, markerSize = (typeof userData['markerSize'] === 'undefined' || userData['markerSize'] < 0) ? defaults.markerSize : userData['markerSize'], areaOpacity = (typeof userData['areaOpacity'] === 'undefined' || userData['markerSize'] < 0) ? defaults.areaOpacity : userData['areaOpacity'], legend = (typeof userData['legend'] === 'undefined') ? defaults.legend : userData['legend'];
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
        config.put('yAxisShow', yAxisShow);
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
        config.put('legend', legend);
        return config;
    };
    return Linechart;
}(Chart));

var Barset = (function (_super) {
    __extends(Barset, _super);
    function Barset(x, y) {
        _super.call(this);
        this.x = x;
        this.y = y;
    }
    Barset.prototype.render = function () {
    };
    Barset.prototype.update = function (data) {
        var bars = null, stacked = this.config.get('stacked');
        this.clean();
        if (stacked) {
            this.updateStacked(data);
        }
        else {
            this.updateGrouped(data);
        }
        bars = this.svg.selectAll('g.serie rect');
        bars
            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));
    };
    Barset.prototype.updateStacked = function (data) {
        var keys = d3.map(data, function (d) { return d.key; }).keys();
        var stack$$1 = this.config.get('stack');
        data = stack$$1.keys(keys)(simple2stacked(data));
        var colorScale = this.config.get('colorScale'), layer = this.svg.selectAll('.serie').data(data), layerEnter = layer.enter().append('g'), layerMerge = null, bar = null, barEnter = null, barMerge = null, x = this.x.xAxis.scale(), y = this.y.yAxis.scale();
        layerMerge = layer.merge(layerEnter)
            .attr('class', 'serie')
            .attr('fill', function (d, i) { return colorScale(i); });
        bar = layerMerge.selectAll('rect')
            .data(function (d) { return d; });
        barEnter = bar.enter().append('rect');
        barMerge = bar.merge(barEnter)
            .attr("x", function (d) { return x(d.data.key); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth());
    };
    Barset.prototype.updateGrouped = function (data) {
        var keys = d3.map(data, function (d) { return d.key; }).keys(), colorScale = this.config.get('colorScale'), layer = this.svg.selectAll('.serie').data(data), layerEnter = null, layerMerge = null, bar = null, barEnter = null, barMerge = null, x = this.x.xAxis.scale(), y = this.y.yAxis.scale(), xGroup = d3.scaleBand().domain(keys).range([0, x.bandwidth()]), height = this.config.get('height');
        data = simple2nested(data, 'x');
        layer = this.svg.selectAll('.serie').data(data);
        layerEnter = layer.enter().append('g')
            .attr('transform', function (d) { return 'translate(' + x(d.key) + ')'; });
        layerMerge = layer.merge(layerEnter)
            .attr('class', 'serie')
            .attr('transform', function (d) { return 'translate(' + x(d.key) + ')'; });
        bar = layerMerge.selectAll('rect')
            .data(function (d) { return d.values; });
        barEnter = bar.enter().append('rect');
        barMerge = bar.merge(barEnter)
            .attr('width', xGroup.bandwidth())
            .attr("x", function (d) { return xGroup(d.key); })
            .attr('fill', function (d, i) { return colorScale(i); })
            .attr("y", function (d) { return y(d.y); })
            .attr("height", function (d) { return height - y(d.y); });
    };
    return Barset;
}(Component));

var SvgStrategyBarchart = (function (_super) {
    __extends(SvgStrategyBarchart, _super);
    function SvgStrategyBarchart() {
        _super.call(this);
        this.axes = new XYAxis();
        this.bars = new Barset(this.axes.x, this.axes.y);
    }
    SvgStrategyBarchart.prototype.draw = function (data) {
        var xAxisFormat = this.config.get('xAxisFormat'), xAxisType = this.config.get('xAxisType'), yAxisFormat = this.config.get('yAxisFormat'), yAxisType = this.config.get('yAxisType');
        convertByXYFormat(data, xAxisFormat, xAxisType, yAxisFormat, yAxisType);
        sortByField(data, 'x');
        this.container.updateComponents(data);
    };
    SvgStrategyBarchart.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        var legend = this.config.get('legend');
        this.container.add(this.axes).add(this.bars);
        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
    };
    return SvgStrategyBarchart;
}(SvgChart));

var defaults$1 = {
    selector: '#chart',
    colorScale: category5(),
    stacked: true,
    xAxisType: 'categorical',
    xAxisFormat: '',
    xAxisLabel: null,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: null,
    yAxisShow: true,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    width: '100%',
    height: 350,
    legend: true,
    onDown: function (d) {
    },
    onHover: function (d) {
    },
    onLeave: function (d) {
    },
    onClick: function (d) {
    },
    onUp: function (d) {
    }
};

var Barchart = (function (_super) {
    __extends(Barchart, _super);
    function Barchart(data, userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        _super.call(this, new SvgStrategyBarchart(), data, userConfig);
    }
    Barchart.prototype.fire = function (event, data) {
        if (event === 'transition') {
            if (data === 'grouped') {
                this.config.put('stacked', false);
            }
            else if (data === 'stacked') {
                this.config.put('stacked', true);
            }
            this.draw();
        }
    };
    Barchart.prototype.keepDrawing = function (datum) {
        var datumType = datum.constructor;
        if (datumType === Array) {
            this.data = datum;
        }
        else {
            for (var i = 0; i < this.data.length; i++) {
                var d = this.data[i];
                if (d['x'] === datum['x']) {
                    this.data[i] = datum;
                    break;
                }
            }
        }
        this.draw(copy(this.data));
    };
    Barchart.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults$1.selector, marginTop = userData['marginTop'] || defaults$1.marginTop, marginLeft = userData['marginLeft'] || defaults$1.marginLeft, marginRight = userData['marginRight'] || defaults$1.marginRight, marginBottom = userData['marginBottom'] || defaults$1.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults$1.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults$1.height, xAxisType = userData['xAxisType'] || defaults$1.xAxisType, xAxisFormat = userData['xAxisFormat'] || defaults$1.xAxisFormat, xAxisLabel = userData['xAxisLabel'] || defaults$1.xAxisLabel, yAxisType = userData['yAxisType'] || defaults$1.yAxisType, yAxisFormat = userData['yAxisFormat'] || defaults$1.yAxisFormat, yAxisLabel = userData['yAxisLabel'] || defaults$1.yAxisLabel, yAxisShow = userData['yAxisShow'] || defaults$1.yAxisShow, colorScale = userData['colorScale'] || defaults$1.colorScale, onDown = userData['onDown'] || defaults$1.onDown, onUp = userData['onUp'] || defaults$1.onUp, onHover = userData['onHover'] || defaults$1.onHover, onClick = userData['onClick'] || defaults$1.onClick, onLeave = userData['onLeave'] || defaults$1.onLeave, stacked = (typeof userData['stacked'] === 'undefined') ? defaults$1.stacked : userData['stacked'], stack$$1 = d3.stack().value(function (d, k) { return d.value[k]; }), legend = (typeof userData['legend'] === 'undefined') ? defaults$1.legend : userData['legend'];
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
        config.put('yAxisShow', yAxisShow);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('legend', legend);
        config.put('stacked', stacked);
        config.put('stack', stack$$1);
        return config;
    };
    return Barchart;
}(Chart));

var Dial = (function (_super) {
    __extends(Dial, _super);
    function Dial() {
        _super.call(this);
    }
    Dial.prototype.render = function () {
        var labels = null, invertColorScale = this.config.get('invertColorScale'), colorScale = this.config.get('colorScale'), width = this.config.get('width'), height = this.config.get('height'), ringWidth = this.config.get('ringWidth'), ringMargin = this.config.get('ringMargin'), ticks = this.config.get('ticks'), minAngle = this.config.get('minAngle'), maxAngle = this.config.get('maxAngle'), minLevel = this.config.get('minLevel'), maxLevel = this.config.get('maxLevel'), labelInset = this.config.get('labelInset'), scale = d3.scaleLinear()
            .domain([minLevel, maxLevel])
            .range([0, 1]), scaleMarkers = scale.ticks(ticks), range$$1 = maxAngle - minAngle, r = ((width > height) ?
            height : width) / 2, translation = (function () { return 'translate(' + r + ',' + r + ')'; }), tickData = d3.range(ticks).map(function () { return 1 / ticks; }), arc$$1 = d3.arc()
            .innerRadius(r - ringWidth - ringMargin)
            .outerRadius(r - ringMargin)
            .startAngle(function (d, i) { return deg2rad(minAngle + ((d * i) * range$$1)); })
            .endAngle(function (d, i) { return deg2rad(minAngle + ((d * (i + 1)) * range$$1)); });
        colorScale.domain([0, 1]);
        var arcs = this.svg.append('g')
            .attr('class', 'arc')
            .attr('transform', translation);
        var arcPaths = arcs.selectAll('path')
            .data(tickData)
            .enter().append('path')
            .attr('id', function (d, i) { return 'sector-' + i; })
            .attr('d', arc$$1);
        arcPaths.attr('fill', function (d, i) { return colorScale(invertColorScale
            ? (1 - d * i)
            : (d * i)); });
        labels = this.svg.append('g')
            .attr('class', 'labels')
            .attr('transform', translation);
        labels.selectAll('text')
            .data(scaleMarkers)
            .enter().append('text')
            .attr('transform', function (d) {
            var ratio = scale(d);
            var newAngle = minAngle + (ratio * range$$1);
            return 'rotate(' + newAngle + ') translate(0,' + (labelInset - r) + ')';
        })
            .text(function (d) { return d; })
            .style('text-anchor', 'middle')
            .style('font', '18px Montserrat, sans-serif');
    };
    Dial.prototype.update = function () {
    };
    return Dial;
}(Component));

var DialNeedle = (function (_super) {
    __extends(DialNeedle, _super);
    function DialNeedle() {
        _super.call(this);
    }
    DialNeedle.prototype.render = function () {
        var labels = null, invertColorScale = this.config.get('invertColorScale'), colorScale = this.config.get('colorScale'), width = this.config.get('width'), height = this.config.get('height'), ringWidth = this.config.get('ringWidth'), ringMargin = this.config.get('ringMargin'), ticks = this.config.get('ticks'), minAngle = this.config.get('minAngle'), maxAngle = this.config.get('maxAngle'), minLevel = this.config.get('minLevel'), maxLevel = this.config.get('maxLevel'), labelInset = this.config.get('labelInset'), needleNutRadius = this.config.get('needleNutRadius'), needleLenghtRatio = this.config.get('needleLenghtRatio'), scale = d3.scaleLinear()
            .domain([minLevel, maxLevel])
            .range([0, 1]), scaleMarkers = scale.ticks(ticks), range$$1 = maxAngle - minAngle, r = ((width > height) ?
            height : width) / 2, needleLen = needleLenghtRatio * (r), translation = (function () { return 'translate(' + r + ',' + r + ')'; }), tickData = d3.range(ticks).map(function () { return 1 / ticks; }), arc$$1 = d3.arc()
            .innerRadius(r - ringWidth - ringMargin)
            .outerRadius(r - ringMargin)
            .startAngle(function (d, i) { return deg2rad(minAngle + ((d * i) * range$$1)); })
            .endAngle(function (d, i) { return deg2rad(minAngle + ((d * (i + 1)) * range$$1)); }), angleScale = d3.scaleLinear()
            .domain([minLevel, maxLevel])
            .range([90 + minAngle, 90 + maxAngle]);
        this.svg.append('path')
            .attr('class', 'needle')
            .datum(0)
            .attr('transform', function (d) { return ("translate(" + r + ", " + r + ") rotate(" + (angleScale(d) - 90) + ")"); })
            .attr('d', "M " + (0 - needleNutRadius) + " " + 0 + " L " + 0 + " " + (0 - needleLen) + " L " + needleNutRadius + " " + 0)
            .style('fill', '#666666');
        this.svg.append('circle')
            .attr('class', 'needle')
            .attr('transform', translation)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', needleNutRadius)
            .style('fill', '#666666');
    };
    DialNeedle.prototype.update = function (data) {
        var datum = data[data.length - 1], width = this.config.get('width'), height = this.config.get('height'), needleNutRadius = this.config.get('needleNutRadius'), needleLenghtRatio = this.config.get('needleLenghtRatio'), minAngle = this.config.get('minAngle'), maxAngle = this.config.get('maxAngle'), minLevel = this.config.get('minLevel'), maxLevel = this.config.get('maxLevel'), r = ((width > height) ?
            height : width) / 2, needleLen = needleLenghtRatio * (r), angleScale = d3.scaleLinear()
            .domain([minLevel, maxLevel])
            .range([90 + minAngle, 90 + maxAngle]);
        this.svg.select('.needle')
            .transition()
            .attr('transform', function (d) { return ("translate(" + r + ", " + r + ") rotate(" + (angleScale(datum.value) - 90) + ")"); })
            .attr('d', "M " + (0 - needleNutRadius) + " " + 0 + " L " + 0 + " " + (0 - needleLen) + " L " + needleNutRadius + " " + 0);
    };
    return DialNeedle;
}(Component));

var TextIndicator = (function (_super) {
    __extends(TextIndicator, _super);
    function TextIndicator() {
    }
    TextIndicator.prototype.update = function (data) {
        var datum = data[data.length - 1];
        this.svg.select('.value')
            .text(datum.value);
        this.svg.select('.label')
            .text(datum.label);
    };
    TextIndicator.prototype.render = function () {
        var translation = this.config.get('textIndicatorTranslation');
        var indicator = this.svg.append('g')
            .attr('class', 'text-indicator')
            .attr('pointer-events', 'none')
            .style('text-anchor', 'middle')
            .style('alignment-baseline', 'central');
        if (translation) {
            indicator.attr('transform', translation);
        }
        indicator.append('text')
            .attr('class', 'value')
            .attr('x', 0)
            .attr('y', 0)
            .attr('pointer-events', 'none')
            .text('0')
            .style('font', '48px Montserrat, sans-serif')
            .style('text-anchor', 'middle');
        indicator.append('text')
            .attr('class', 'label')
            .attr('x', 0)
            .attr('y', 0)
            .attr('pointer-events', 'none')
            .text('')
            .style('font', '24px Montserrat, sans-serif')
            .style('transform', 'translate(0, 1.5em')
            .style('text-anchor', 'middle');
    };
    return TextIndicator;
}(Component));

var SvgStrategyGauge = (function (_super) {
    __extends(SvgStrategyGauge, _super);
    function SvgStrategyGauge() {
        _super.call(this);
        this.dial = new Dial();
        this.dialNeedle = new DialNeedle();
        this.textIndicator = new TextIndicator();
    }
    SvgStrategyGauge.prototype.draw = function (data) {
        this.container.updateComponents(data);
    };
    SvgStrategyGauge.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.container.add(this.dial).add(this.dialNeedle);
        if (this.config.get('numericIndicator')) {
            var width = this.config.get('width'), height = this.config.get('height');
            var r = ((width > height) ? height : width) / 2;
            var indicatorOffset = r + 75;
            this.config.put('textIndicatorTranslation', 'translate(' + r + ',' + indicatorOffset + ')');
            this.container.add(this.textIndicator);
        }
    };
    return SvgStrategyGauge;
}(SvgChart));

var defaults$2 = {
    selector: '#chart',
    colorScale: diverging_spectral2(),
    invertColorScale: true,
    minLevel: 0,
    maxLevel: 100,
    minAngle: -90,
    maxAngle: 90,
    ringWidth: 50,
    ringMargin: 20,
    labelInset: 10,
    needleNutRadius: 25,
    needleLenghtRatio: 0.8,
    numericIndicator: true,
    label: 'km/h',
    marginTop: 20,
    marginRight: 250,
    marginBottom: 30,
    marginLeft: 50,
    width: '50%',
    height: 250,
    ticks: 10,
};

var Gauge = (function (_super) {
    __extends(Gauge, _super);
    function Gauge(data, userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        _super.call(this, new SvgStrategyGauge(), data, userConfig);
    }
    Gauge.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults$2.selector, marginTop = userData['marginTop'] || defaults$2.marginTop, marginLeft = userData['marginLeft'] || defaults$2.marginLeft, marginRight = userData['marginRight'] || defaults$2.marginRight, marginBottom = userData['marginBottom'] || defaults$2.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults$2.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults$2.height, colorScale = userData['colorScale'] || defaults$2.colorScale, invertColorScale = (typeof userData['invertColorScale'] === 'undefined') ? defaults$2.invertColorScale : userData['invertColorScale'], minLevel = userData['minLevel'] || defaults$2.minLevel, maxLevel = userData['maxLevel'] || defaults$2.maxLevel, minAngle = userData['minAngle'] || defaults$2.minAngle, maxAngle = userData['maxAngle'] || defaults$2.maxAngle, ringWidth = userData['ringWidth'] || defaults$2.ringWidth, ringMargin = userData['ringMargin'] || defaults$2.ringMargin, labelInset = userData['labelInset'] || defaults$2.labelInset, needleNutRadius = userData['needleNutRadius'] || defaults$2.needleNutRadius, needleLenghtRatio = userData['needleLenghtRatio'] || defaults$2.needleLenghtRatio, numericIndicator = (typeof userData['numericIndicator'] === 'undefined') ? defaults$2.numericIndicator : userData['numericIndicator'], label = userData['label'] || defaults$2.label, ticks = userData['ticks'] || defaults$2.ticks;
        config.put('selector', selector);
        config.put('marginTop', marginTop);
        config.put('marginLeft', marginLeft);
        config.put('marginRight', marginRight);
        config.put('marginBottom', marginBottom);
        config.put('width', width);
        config.put('height', height);
        config.put('colorScale', colorScale);
        config.put('invertColorScale', invertColorScale);
        config.put('minLevel', minLevel);
        config.put('maxLevel', maxLevel);
        config.put('minAngle', minAngle);
        config.put('maxAngle', maxAngle);
        config.put('ringWidth', ringWidth);
        config.put('ringMargin', ringMargin);
        config.put('labelInset', labelInset);
        config.put('needleNutRadius', needleNutRadius);
        config.put('needleLenghtRatio', needleLenghtRatio);
        config.put('numericIndicator', numericIndicator);
        config.put('label', label);
        config.put('ticks', ticks);
        return config;
    };
    Gauge.prototype.keepDrawing = function (datum) {
        this.data = [datum[0]];
        _super.prototype.draw.call(this);
    };
    return Gauge;
}(Chart));

var CanvasPointset = (function (_super) {
    __extends(CanvasPointset, _super);
    function CanvasPointset(x, y) {
        _super.call(this);
        this.x = x;
        this.y = y;
    }
    CanvasPointset.prototype.update = function (data) {
        var _this = this;
        var canvas = d3.select(this.config.get('selector')).append('canvas')
            .attr('id', 'point-set-canvas')
            .attr('width', this.config.get('width'))
            .attr('height', this.config.get('height'))
            .style('position', 'absolute')
            .style('z-index', 2)
            .style('transform', "translate(" + this.config.get('marginLeft') + "px, " + this.config.get('marginTop') + "px)");
        var markerShape = this.config.get('markerShape'), markerSize = this.config.get('markerSize'), colorScale = this.config.get('colorScale'), points = null, series = null, dataContainer = null;
        var canvasCtx = canvas.node().getContext('2d');
        var shape = d3.symbol()
            .size(markerSize)
            .context(canvasCtx);
        switch (markerShape) {
            case 'dot':
                shape.type(d3.symbolCircle);
                break;
            case 'ring':
                shape.type(d3.symbolCircle);
                break;
            case 'cross':
                shape.type(d3.symbolCross);
                break;
            case 'diamond':
                shape.type(d3.symbolDiamond);
                break;
            case 'square':
                shape.type(d3.symbolSquare);
                break;
            case 'star':
                shape.type(d3.symbolStar);
                break;
            case 'triangle':
                shape.type(d3.symbolTriangle);
                break;
            case 'wye':
                shape.type(d3.symbolWye);
                break;
            case 'circle':
                shape.type(d3.symbolCircle);
                break;
            default:
                shape.type(d3.symbolCircle);
        }
        dataContainer = this.svg.append('proteic');
        series = dataContainer.selectAll('proteic.g.points');
        series
            .data(data, function (d) { return d.key; })
            .enter()
            .call(function (s) {
            var self = _this;
            console.log(s);
            s.each(function (d) {
                canvasCtx.save();
                canvasCtx.translate(self.x.xAxis.scale()(d.x), self.y.yAxis.scale()(d.y));
                canvasCtx.beginPath();
                canvasCtx.strokeStyle = colorScale(d.key);
                canvasCtx.fillStyle = colorScale(d.key);
                shape();
                canvasCtx.closePath();
                canvasCtx.stroke();
                if (markerShape !== 'ring') {
                    canvasCtx.fill();
                }
                canvasCtx.restore();
            });
        });
    };
    CanvasPointset.prototype.render = function () {
    };
    return CanvasPointset;
}(Component));

var SvgStrategyScatterplot = (function (_super) {
    __extends(SvgStrategyScatterplot, _super);
    function SvgStrategyScatterplot() {
        _super.call(this);
        this.axes = new XYAxis();
        this.markers = new Pointset(this.axes.x, this.axes.y);
        this.canvasMarkers = new CanvasPointset(this.axes.x, this.axes.y);
    }
    SvgStrategyScatterplot.prototype.draw = function (data) {
        var xAxisFormat = this.config.get('xAxisFormat'), xAxisType = this.config.get('xAxisType'), yAxisFormat = this.config.get('yAxisFormat'), yAxisType = this.config.get('yAxisType');
        convertByXYFormat(data, xAxisFormat, xAxisType, yAxisFormat, yAxisType);
        sortByField(data, 'x');
        this.container.updateComponents(data);
    };
    SvgStrategyScatterplot.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        var legend = this.config.get('legend');
        this.container.add(this.axes);
        if (this.config.get('canvas')) {
            this.container.add(this.canvasMarkers);
        }
        else {
            this.container.add(this.markers);
        }
        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
    };
    return SvgStrategyScatterplot;
}(SvgChart));

var defaults$3 = {
    selector: '#chart',
    colorScale: category7(),
    xAxisType: 'linear',
    xAxisFormat: '.1f',
    xAxisLabel: '',
    yAxisType: 'linear',
    yAxisFormat: '.1f',
    yAxisLabel: '',
    yAxisShow: true,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    markerShape: 'dot',
    markerSize: 3,
    width: '100%',
    height: 250,
    legend: true,
    onDown: function (d) {
    },
    onHover: function (d) {
    },
    onLeave: function (d) {
    },
    onClick: function (d) {
    },
    onUp: function (d) {
    },
    maxNumberOfElements: 100,
    canvas: false
};

var Scatterplot = (function (_super) {
    __extends(Scatterplot, _super);
    function Scatterplot(data, userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        _super.call(this, new SvgStrategyScatterplot(), data, userConfig);
    }
    Scatterplot.prototype.keepDrawing = function (datum) {
        var datumType = datum.constructor;
        if (datumType === Array) {
            if (this.data) {
                this.data = this.data.concat(datum);
            }
            else {
                this.data = datum;
            }
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    };
    Scatterplot.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults$3.selector, marginTop = userData['marginTop'] || defaults$3.marginTop, marginLeft = userData['marginLeft'] || defaults$3.marginLeft, marginRight = userData['marginRight'] || defaults$3.marginRight, marginBottom = userData['marginBottom'] || defaults$3.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults$3.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults$3.height, xAxisType = userData['xAxisType'] || defaults$3.xAxisType, xAxisFormat = userData['xAxisFormat'] || defaults$3.xAxisFormat, xAxisLabel = userData['xAxisLabel'] || defaults$3.xAxisLabel, yAxisType = userData['yAxisType'] || defaults$3.yAxisType, yAxisFormat = userData['yAxisFormat'] || defaults$3.yAxisFormat, yAxisLabel = userData['yAxisLabel'] || defaults$3.yAxisLabel, yAxisShow = userData['yAxisShow'] || defaults$3.yAxisShow, colorScale = userData['colorScale'] || defaults$3.colorScale, onDown = userData['onDown'] || defaults$3.onDown, onUp = userData['onUp'] || defaults$3.onUp, onHover = userData['onHover'] || defaults$3.onHover, onClick = userData['onClick'] || defaults$3.onClick, onLeave = userData['onLeave'] || defaults$3.onLeave, markerShape = userData['markerShape'] || defaults$3.markerShape, markerSize = (typeof userData['markerSize'] === 'undefined' || userData['markerSize'] < 0) ? defaults$3.markerSize : userData['markerSize'], legend = (typeof userData['legend'] === 'undefined') ? defaults$3.legend : userData['legend'], canvas = userData['canvas'] || defaults$3.canvas;
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
        config.put('yAxisShow', yAxisShow);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('markerShape', markerShape);
        config.put('markerSize', markerSize);
        config.put('legend', legend);
        config.put('canvas', canvas);
        return config;
    };
    return Scatterplot;
}(Chart));

var Streamset = (function (_super) {
    __extends(Streamset, _super);
    function Streamset(xyAxes) {
        var _this = this;
        _super.call(this);
        this.xyAxes = xyAxes;
        this.areaGenerator = d3.area()
            .curve(d3.curveCardinal)
            .y0(function (d) { return _this.xyAxes.y.yAxis.scale()(d[0]); })
            .y1(function (d) { return _this.xyAxes.y.yAxis.scale()(d[1]); });
    }
    Streamset.prototype.render = function () {
    };
    Streamset.prototype.update = function (data) {
        var _this = this;
        this.clean();
        var colorScale = this.config.get('colorScale'), onDown = this.config.get('onDown'), onUp = this.config.get('onUp'), onLeave = this.config.get('onLeave'), onHover = this.config.get('onHover'), onClick = this.config.get('onClick'), keys = d3.map(data, function (d) { return d.key; }).keys(), data4stack = simple2stacked(data), stack$$1 = this.config.get('stack'), dataSeries = stack$$1(data4stack), series = null;
        this.areaGenerator.x(function (d) { return _this.xyAxes.x.xAxis.scale()((new Date(d.data.key))); });
        series = this.svg.selectAll('.serie')
            .data(dataSeries)
            .enter()
            .append('g')
            .attr('class', 'serie')
            .style('stroke', function (d, i) { return colorScale(i); });
        series
            .append('path')
            .attr('class', 'layer')
            .attr('d', this.areaGenerator)
            .style('fill', function (d, i) { return colorScale(i); });
        series.exit().remove();
        series
            .attr('opacity', 1)
            .on('mousedown.user', onDown)
            .on('mouseup.user', onUp)
            .on('mouseleave.user', onLeave)
            .on('mouseover.user', onHover)
            .on('click.user', onClick);
    };
    return Streamset;
}(Component));

var SvgStrategyStreamgraph = (function (_super) {
    __extends(SvgStrategyStreamgraph, _super);
    function SvgStrategyStreamgraph() {
        _super.call(this);
        this.axes = new XYAxis();
        this.streams = new Streamset(this.axes);
    }
    SvgStrategyStreamgraph.prototype.draw = function (data) {
        var xAxisFormat = this.config.get('xAxisFormat'), xAxisType = this.config.get('xAxisType'), yAxisFormat = this.config.get('yAxisFormat'), yAxisType = this.config.get('yAxisType');
        convertPropretiesToTimeFormat(data, ['x'], xAxisFormat);
        sortByField(data, 'x');
        this.container.updateComponents(data);
    };
    SvgStrategyStreamgraph.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        var markerSize = this.config.get('markerSize'), areaOpacity = this.config.get('areaOpacity'), legend = this.config.get('legend');
        this.container.add(this.axes).add(this.streams);
        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
    };
    return SvgStrategyStreamgraph;
}(SvgChart));

var defaults$4 = {
    selector: '#chart',
    colorScale: category4(),
    xAxisType: 'time',
    xAxisFormat: '%y/%m/%d',
    xAxisLabel: null,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: null,
    yAxisShow: false,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    width: '100%',
    height: 250,
    legend: true,
    onDown: function (d) {
    },
    onHover: function (d) {
    },
    onLeave: function (d) {
    },
    onClick: function (d) {
    },
    onUp: function (d) {
    },
    maxNumberOfElements: 100,
};

var Streamgraph = (function (_super) {
    __extends(Streamgraph, _super);
    function Streamgraph(data, userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        _super.call(this, new SvgStrategyStreamgraph(), data, userConfig);
    }
    Streamgraph.prototype.keepDrawing = function (datum) {
        var datumType = datum.constructor;
        if (datumType === Array) {
            this.data = this.data.concat(datum);
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    };
    Streamgraph.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults$4.selector, marginTop = userData['marginTop'] || defaults$4.marginTop, marginLeft = userData['marginLeft'] || defaults$4.marginLeft, marginRight = userData['marginRight'] || defaults$4.marginRight, marginBottom = userData['marginBottom'] || defaults$4.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults$4.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults$4.height, xAxisType = userData['xAxisType'] || defaults$4.xAxisType, xAxisFormat = userData['xAxisFormat'] || defaults$4.xAxisFormat, xAxisLabel = userData['xAxisLabel'] || defaults$4.xAxisLabel, yAxisType = userData['yAxisType'] || defaults$4.yAxisType, yAxisFormat = userData['yAxisFormat'] || defaults$4.yAxisFormat, yAxisLabel = userData['yAxisLabel'] || defaults$4.yAxisLabel, yAxisShow = userData['yAxisShow'] || defaults$4.yAxisShow, colorScale = userData['colorScale'] || defaults$4.colorScale, onDown = userData['onDown'] || defaults$4.onDown, onUp = userData['onUp'] || defaults$4.onUp, onHover = userData['onHover'] || defaults$4.onHover, onClick = userData['onClick'] || defaults$4.onClick, onLeave = userData['onLeave'] || defaults$4.onLeave, legend = (typeof userData['legend'] === 'undefined') ? defaults$4.legend : userData['legend'], stacked = true, stack$$1 = d3.stack().value(function (d, k) { return d.value[k]; }).order(d3.stackOrderInsideOut).offset(d3.stackOffsetWiggle);
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
        config.put('yAxisShow', yAxisShow);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('legend', legend);
        config.put('stacked', stacked);
        config.put('stack', stack$$1);
        return config;
    };
    return Streamgraph;
}(Chart));

var defaults$5 = {
    selector: '#chart',
    colorScale: category2(),
    xAxisType: 'time',
    xAxisFormat: '%y/%m/%d',
    xAxisLabel: null,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: null,
    yAxisShow: true,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    width: '100%',
    height: 250,
    legend: true,
    onDown: function (d) {
    },
    onHover: function (d) {
    },
    onLeave: function (d) {
    },
    onClick: function (d) {
    },
    onUp: function (d) {
    },
    maxNumberOfElements: 100,
};

var StackedArea = (function (_super) {
    __extends(StackedArea, _super);
    function StackedArea(data, userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        _super.call(this, new SvgStrategyStreamgraph(), data, userConfig);
    }
    StackedArea.prototype.keepDrawing = function (datum) {
        var datumType = datum.constructor;
        if (datumType === Array) {
            this.data = this.data.concat(datum);
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    };
    StackedArea.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults$5.selector, marginTop = userData['marginTop'] || defaults$5.marginTop, marginLeft = userData['marginLeft'] || defaults$5.marginLeft, marginRight = userData['marginRight'] || defaults$5.marginRight, marginBottom = userData['marginBottom'] || defaults$5.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults$5.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults$5.height, xAxisType = userData['xAxisType'] || defaults$5.xAxisType, xAxisFormat = userData['xAxisFormat'] || defaults$5.xAxisFormat, xAxisLabel = userData['xAxisLabel'] || defaults$5.xAxisLabel, yAxisType = userData['yAxisType'] || defaults$5.yAxisType, yAxisFormat = userData['yAxisFormat'] || defaults$5.yAxisFormat, yAxisLabel = userData['yAxisLabel'] || defaults$5.yAxisLabel, yAxisShow = userData['yAxisShow'] || defaults$5.yAxisShow, colorScale = userData['colorScale'] || defaults$5.colorScale, onDown = userData['onDown'] || defaults$5.onDown, onUp = userData['onUp'] || defaults$5.onUp, onHover = userData['onHover'] || defaults$5.onHover, onClick = userData['onClick'] || defaults$5.onClick, onLeave = userData['onLeave'] || defaults$5.onLeave, legend = (typeof userData['legend'] === 'undefined') ? defaults$5.legend : userData['legend'], stacked = true, stack$$1 = d3.stack().value(function (d, k) { return d.value[k]; }).order(d3.stackOrderInsideOut).offset(d3.stackOffsetNone);
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
        config.put('yAxisShow', yAxisShow);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('legend', legend);
        config.put('stacked', stacked);
        config.put('stack', stack$$1);
        return config;
    };
    return StackedArea;
}(Chart));

var Timeboxset = (function (_super) {
    __extends(Timeboxset, _super);
    function Timeboxset(xyAxes) {
        _super.call(this);
        this.xyAxes = xyAxes;
    }
    Timeboxset.prototype.render = function () {
    };
    Timeboxset.prototype.update = function (data) {
        var colorScale = this.config.get('colorScale'), height = this.config.get('height'), onDown = this.config.get('onDown'), onUp = this.config.get('onUp'), onLeave = this.config.get('onLeave'), onHover = this.config.get('onHover'), onClick = this.config.get('onClick'), keys = d3.map(data, function (d) { return d.key; }).keys(), layer = this.svg.selectAll('.serie').data(data), layerEnter = null, layerMerge = null, box = null, boxEnter = null, boxMerge = null, extLanes = null, yLanes = null, yLanesBand = d3.scaleBand().range([0, keys.length + 1]).domain(keys), x = this.xyAxes.x.xAxis.scale(), y = this.xyAxes.y.yAxis.scale();
        data = simple2nested(data);
        extLanes = d3.extent(data, function (d, i) { return i; });
        yLanes = d3.scaleLinear().domain([extLanes[0], extLanes[1] + 1]).range([0, height]);
        layer = this.svg.selectAll('.serie').data(data);
        layerEnter = layer.enter().append('g');
        layerMerge = layer.merge(layerEnter)
            .attr('class', 'serie');
        box = layerMerge.selectAll('rect')
            .data(function (d) { return d.values; });
        boxEnter = box.enter().append('rect');
        boxMerge = box.merge(boxEnter)
            .attr('width', function (d) { return x(d.end) - x(d.start); })
            .attr('x', function (d) { return x(d.start); })
            .attr('y', function (d) { return y(d.key); })
            .attr('fill', function (d) { return colorScale(parseInt(yLanesBand(d.key))); })
            .attr('height', function () { return 0.8 * yLanes(1); });
        box = this.svg.selectAll('g.serie rect');
        box
            .on('mousedown.user', onDown)
            .on('mouseup.user', onUp)
            .on('mouseleave.user', onLeave)
            .on('mouseover.user', onHover)
            .on('click.user', onClick);
    };
    return Timeboxset;
}(Component));

var SvgStrategySwimlane = (function (_super) {
    __extends(SvgStrategySwimlane, _super);
    function SvgStrategySwimlane() {
        _super.call(this);
        this.axes = new XYAxis();
        this.boxes = new Timeboxset(this.axes);
    }
    SvgStrategySwimlane.prototype.draw = function (data) {
        var xAxisFormat = this.config.get('xAxisFormat');
        convertPropretiesToTimeFormat(data, ['start', 'end'], xAxisFormat);
        sortByField(data, 'start');
        this.container.updateComponents(data);
    };
    SvgStrategySwimlane.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        var markerSize = this.config.get('markerSize'), areaOpacity = this.config.get('areaOpacity'), legend = this.config.get('legend');
        this.container.add(this.axes);
        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend).add(this.boxes);
        }
    };
    return SvgStrategySwimlane;
}(SvgChart));

var defaults$6 = {
    selector: '#chart',
    colorScale: category3(),
    xAxisType: 'time',
    xAxisFormat: '%y/%m/%d',
    xAxisLabel: null,
    yAxisType: 'categorical',
    yAxisFormat: 's',
    yAxisLabel: null,
    yAxisShow: true,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 30,
    marginLeft: 50,
    width: '100%',
    height: 250,
    legend: true,
    onDown: function (d) {
    },
    onHover: function (d) {
    },
    onLeave: function (d) {
    },
    onClick: function (d) {
    },
    onUp: function (d) {
    }
};

var Swimlane = (function (_super) {
    __extends(Swimlane, _super);
    function Swimlane(data, userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        _super.call(this, new SvgStrategySwimlane(), data, userConfig);
    }
    Swimlane.prototype.keepDrawing = function (datum) {
        var datumType = datum.constructor;
        if (datumType === Array) {
            this.data = this.data.concat(datum);
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    };
    Swimlane.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults$6.selector, marginTop = userData['marginTop'] || defaults$6.marginTop, marginLeft = userData['marginLeft'] || defaults$6.marginLeft, marginRight = userData['marginRight'] || defaults$6.marginRight, marginBottom = userData['marginBottom'] || defaults$6.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults$6.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults$6.height, xAxisType = userData['xAxisType'] || defaults$6.xAxisType, xAxisFormat = userData['xAxisFormat'] || defaults$6.xAxisFormat, xAxisLabel = userData['xAxisLabel'] || defaults$6.xAxisLabel, yAxisType = userData['yAxisType'] || defaults$6.yAxisType, yAxisFormat = userData['yAxisFormat'] || defaults$6.yAxisFormat, yAxisLabel = userData['yAxisLabel'] || defaults$6.yAxisLabel, yAxisShow = userData['yAxisShow'] || defaults$6.yAxisShow, colorScale = userData['colorScale'] || defaults$6.colorScale, onDown = userData['onDown'] || defaults$6.onDown, onUp = userData['onUp'] || defaults$6.onUp, onHover = userData['onHover'] || defaults$6.onHover, onClick = userData['onClick'] || defaults$6.onClick, onLeave = userData['onLeave'] || defaults$6.onLeave, legend = (typeof userData['legend'] === 'undefined') ? defaults$6.legend : userData['legend'];
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
        config.put('yAxisShow', yAxisShow);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('onUp', onUp);
        config.put('legend', legend);
        return config;
    };
    return Swimlane;
}(Chart));

var XRadialAxis = (function (_super) {
    __extends(XRadialAxis, _super);
    function XRadialAxis() {
        _super.call(this);
    }
    XRadialAxis.prototype.update = function (data) { };
    XRadialAxis.prototype.render = function () {
        this._xRadialAxis = d3.scaleLinear().range([0, 2 * Math.PI]);
    };
    Object.defineProperty(XRadialAxis.prototype, "xRadialAxis", {
        get: function () {
            return this._xRadialAxis;
        },
        enumerable: true,
        configurable: true
    });
    return XRadialAxis;
}(Component));

var YRadialAxis = (function (_super) {
    __extends(YRadialAxis, _super);
    function YRadialAxis() {
        _super.call(this);
    }
    YRadialAxis.prototype.render = function () {
        var width = this.config.get('width'), height = this.config.get('height'), radius = null;
        radius = (Math.min(width, height) / 2) - 10;
        this._yRadialAxis = d3.scaleSqrt().range([0, radius]);
    };
    
    YRadialAxis.prototype.update = function (data) { };
    
    Object.defineProperty(YRadialAxis.prototype, "yRadialAxis", {
        get: function () {
            return this._yRadialAxis;
        },
        enumerable: true,
        configurable: true
    });
    return YRadialAxis;
}(Component));

var RadialAxes = (function (_super) {
    __extends(RadialAxes, _super);
    function RadialAxes() {
        _super.call(this);
        this._x = new XRadialAxis();
        this._y = new YRadialAxis();
    }
    RadialAxes.prototype.configure = function (config, svg) {
        _super.prototype.configure.call(this, config, svg);
        this._x.configure(config, svg);
        this._y.configure(config, svg);
    };
    RadialAxes.prototype.render = function () {
        this._x.render();
        this._y.render();
    };
    RadialAxes.prototype.update = function (data) {
        this._x.update(data);
        this._y.update(data);
    };
    Object.defineProperty(RadialAxes.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadialAxes.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    return RadialAxes;
}(Component));

var SunburstDisk = (function (_super) {
    __extends(SunburstDisk, _super);
    function SunburstDisk(x, y) {
        _super.call(this);
        this.x = x;
        this.y = y;
    }
    SunburstDisk.prototype.removePaths = function () {
        this.svg.selectAll('path').remove();
    };
    SunburstDisk.prototype.getAncestors = function (node) {
        var path = [];
        var current = node;
        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    };
    SunburstDisk.prototype.update = function (data) {
        var _this = this;
        var arcGen = d3.arc()
            .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, _this.x.xRadialAxis(d.x0))); })
            .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, _this.x.xRadialAxis(d.x1))); })
            .innerRadius(function (d) { return Math.max(0, _this.y.yRadialAxis(d.y0)); })
            .outerRadius(function (d) { return Math.max(0, _this.y.yRadialAxis(d.y1)); });
        var colorScale = this.config.get('colorScale');
        this.removePaths();
        var root = d3.stratify()
            .id(function (d) { return d.id; })
            .parentId(function (d) { return d.parent; })(data);
        root.sum(function (d) { return d.value; });
        d3.partition()(root);
        var paths = this.svg.selectAll('path')
            .data(root.descendants())
            .enter().append('path')
            .attr('d', arcGen)
            .style('fill', function (d) {
            if (!d.parent) {
                return 'white';
            }
            else {
                return colorScale(d.data.label);
            }
        })
            .style('stroke', '#fff')
            .style('stroke-width', '2')
            .style('shape-rendering', 'crispEdge');
        paths
            .on('mouseover.default', function (d) {
            var ancestors = _this.getAncestors(d);
            if (ancestors.length > 0) {
                _this.svg.selectAll('path')
                    .style('opacity', 0.3);
            }
            _this.svg.selectAll('path')
                .filter(function (node) { return ancestors.indexOf(node) >= 0; })
                .style('opacity', 1);
            _this.svg.select('.text-indicator .label').text(d.data.label);
            _this.svg.select('.text-indicator .value').text(d.value);
        })
            .on('mouseout.default', function (d) {
            _this.svg.selectAll('path').style('opacity', 1);
            _this.svg.select('.text-indicator .label').style('font-weight', 'normal');
            _this.svg.select('.text-indicator .label').text('');
            _this.svg.select('.text-indicator .value').text('');
        });
        paths
            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));
    };
    SunburstDisk.prototype.render = function () {
    };
    return SunburstDisk;
}(Component));

var SvgStrategySunburst = (function (_super) {
    __extends(SvgStrategySunburst, _super);
    function SvgStrategySunburst() {
        _super.call(this);
        this.axes = new RadialAxes();
        this.disk = new SunburstDisk(this.axes.x, this.axes.y);
        this.textIndicator = new TextIndicator();
    }
    SvgStrategySunburst.prototype.draw = function (data) {
        this.container.translate(this.config.get('width') / 2, this.config.get('height') / 2);
        this.container.updateComponents(data);
    };
    SvgStrategySunburst.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.container
            .add(this.axes)
            .add(this.disk)
            .add(this.textIndicator);
    };
    return SvgStrategySunburst;
}(SvgChart));

var defaults$7 = {
    selector: '#chart',
    colorScale: category8(),
    marginTop: 20,
    marginRight: 20,
    marginBottom: 30,
    marginLeft: 50,
    width: '50%',
    height: 450,
    tickLabel: '',
    transitionDuration: 300,
    maxNumberOfElements: 5,
    sortData: {
        descending: false,
        prop: 'x'
    },
    onDown: function (d) {
    },
    onHover: function (d) {
    },
    onLeave: function (d) {
    },
    onClick: function (d) {
    },
    onUp: function (d) {
    }
};

var Sunburst = (function (_super) {
    __extends(Sunburst, _super);
    function Sunburst(data, userConfig) {
        if (userConfig === void 0) { userConfig = {}; }
        _super.call(this, new SvgStrategySunburst(), data, userConfig);
    }
    Sunburst.prototype.loadConfigFromUser = function (userData) {
        var config = new Config(), selector = userData['selector'] || defaults$7.selector, marginTop = userData['marginTop'] || defaults$7.marginTop, marginLeft = userData['marginLeft'] || defaults$7.marginLeft, marginRight = userData['marginRight'] || defaults$7.marginRight, marginBottom = userData['marginBottom'] || defaults$7.marginBottom, width = userData['width']
            ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
            : calculateWidth(defaults$7.width, selector) - marginLeft - marginRight, height = userData['height'] || defaults$7.height, colorScale = userData['colorScale'] || defaults$7.colorScale, onDown = userData['onDown'] || defaults$7.onDown, onUp = userData['onUp'] || defaults$7.onUp, onHover = userData['onHover'] || defaults$7.onHover, onClick = userData['onClick'] || defaults$7.onClick, onLeave = userData['onLeave'] || defaults$7.onLeave;
        config.put('selector', selector);
        config.put('marginTop', marginTop);
        config.put('marginLeft', marginLeft);
        config.put('marginRight', marginRight);
        config.put('marginBottom', marginBottom);
        config.put('width', width);
        config.put('height', height);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        return config;
    };
    Sunburst.prototype.keepDrawing = function (datum) {
        var datumType = datum.constructor;
        if (datumType === Array) {
            if (this.data) {
                this.data = this.data.concat(datum);
            }
            else {
                this.data = datum;
            }
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    };
    return Sunburst;
}(Chart));

var Datasource = (function () {
    function Datasource() {
        this.dispatcher = null;
        this.source = null;
    }
    Datasource.prototype.start = function () {
        window.console.log('Starting datasource');
    };
    Datasource.prototype.stop = function () {
        window.console.log('Stopping datasource');
    };
    Datasource.prototype.configure = function (dispatcher) {
        this.dispatcher = dispatcher;
    };
    Datasource.prototype.filter = function (filter) {
        return this;
    };
    return Datasource;
}());

var WebsocketDatasource = (function (_super) {
    __extends(WebsocketDatasource, _super);
    function WebsocketDatasource(source) {
        _super.call(this);
        this.source = source;
    }
    WebsocketDatasource.prototype.configure = function (dispatcher) {
        this.dispatcher = dispatcher;
    };
    WebsocketDatasource.prototype.start = function () {
        var _this = this;
        _super.prototype.start.call(this);
        this.ws = new WebSocket(this.source['endpoint']);
        this.ws.onopen = function (e) {
            _this.dispatcher.call('onopen', _this, e);
        };
        this.ws.onerror = function (e) {
            throw new Error('An error occurred trying to reach the websocket server' + e);
        };
        this.ws.onmessage = function (e) {
            var data = JSON.parse(e.data);
            _this.dispatcher.call('onmessage', _this, data);
        };
    };
    WebsocketDatasource.prototype.stop = function () {
        _super.prototype.stop.call(this);
        if (this.ws) {
            this.ws.close();
        }
    };
    return WebsocketDatasource;
}(Datasource));

var HTTPDatasource = (function (_super) {
    __extends(HTTPDatasource, _super);
    function HTTPDatasource(source) {
        _super.call(this);
        this.source = source;
        this.intervalId = -1;
        this.started = false;
    }
    HTTPDatasource.prototype.start = function () {
        if (!this.started) {
            _super.prototype.start.call(this);
            var pollingTime = this.source.pollingTime;
            var url = this.source.url;
            this._startPolling(url, pollingTime);
            this.started = true;
        }
    };
    HTTPDatasource.prototype._startPolling = function (url, time) {
        var _this = this;
        if (time === void 0) { time = 1000; }
        var interval = window.setInterval;
        this.intervalId = interval(function () { return _this._startRequest(url); }, time);
    };
    HTTPDatasource.prototype._startRequest = function (url) {
        var _this = this;
        window.console.log('url', url);
        d3.request(url).get(function (e, response) { return _this._handleResponse(response); });
    };
    HTTPDatasource.prototype._stopPolling = function () {
        var clearInterval = window.clearInterval;
        clearInterval(this.intervalId);
    };
    HTTPDatasource.prototype._handleResponse = function (xmlHttpRequest) {
        var parseJson = window.JSON.parse;
        if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
            var response = parseJson(xmlHttpRequest.response);
            this._handleOK(response);
        }
        else {
            this._handleError(xmlHttpRequest);
        }
    };
    HTTPDatasource.prototype._handleOK = function (data) {
        if (this.properties.length > 0) {
            data = this.convert(data);
        }
        this.dispatcher.call('onmessage', this, data);
    };
    HTTPDatasource.prototype._handleError = function (data) {
        this.dispatcher.call('onerror', this, data);
    };
    HTTPDatasource.prototype.stop = function () {
        if (this.started) {
            this._stopPolling();
            this.started = false;
        }
    };
    return HTTPDatasource;
}(Datasource));

exports.Linechart = Linechart;
exports.Barchart = Barchart;
exports.Gauge = Gauge;
exports.Scatterplot = Scatterplot;
exports.Streamgraph = Streamgraph;
exports.StackedArea = StackedArea;
exports.Swimlane = Swimlane;
exports.Sunburst = Sunburst;
exports.WebsocketDatasource = WebsocketDatasource;
exports.HTTPDatasource = HTTPDatasource;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=proteic.js.map
