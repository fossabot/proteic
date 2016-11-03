(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3/d3-scale'), require('d3-format'), require('d3-axis'), require('d3-select')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3/d3-scale', 'd3-format', 'd3-axis', 'd3-select'], factory) :
    (factory((global.proteic = global.proteic || {}),global.d3_d3Scale,global.d3-format,global.d3-axis,global.d3-select));
}(this, (function (exports,d3_d3Scale,d3Format,d3Axis,d3Select) { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var SvgContext = (function () {
    function SvgContext(strategy) {
        this.strategy = strategy;
    }
    SvgContext.prototype.draw = function () {
        this.strategy.draw();
    };
    return SvgContext;
}());

var Chart = (function () {
    function Chart(strategy) {
        this.svg = new SvgContext(strategy);
    }
    Chart.prototype.draw = function () {
        this.svg.draw();
    };
    return Chart;
}());

var Component = (function () {
    function Component(config) {
        this.config = config;
    }
    return Component;
}());

var XAxis = (function (_super) {
    __extends(XAxis, _super);
    function XAxis(config) {
        _super.call(this, config);
        var width = this.config.get('width'), xAxisFormat = this.config.get('xAxisFormat'), xAxisType = this.config.get('xAxisType');
        this.initializeXAxis(width, xAxisFormat, xAxisType);
    }
    XAxis.prototype.render = function () {
    };
    XAxis.prototype.update = function () {
    };
    /**
     *
     * Initializes a new horizontal axis
     *
     * @private
     * @param {(string | number)} Width Width of the axis
     * @param {string} xAxisFormat Format of the axis. This parameter is only valid when using a time axis.
     * @param {string} xAxisType Type of the axis. It can be: time, linear or categorical.
     *
     * @memberOf XAxis
     */
    XAxis.prototype.initializeXAxis = function (width, xAxisFormat, xAxisType) {
        switch (xAxisType) {
            case 'time':
                this.xAxis = d3Axis.axisBottom(d3_d3Scale.scaleTime().range([0, width]));
                break;
            case 'linear':
                this.xAxis = d3Axis.axisBottom(d3_d3Scale.scaleLinear().range([0, width])).tickFormat(d3Format.format(xAxisFormat));
                break;
            case 'categorical':
                this.xAxis = d3Axis.axisBottom(d3_d3Scale.scaleBand().rangeRound([0, width]).padding(0.1).align(0.5));
                break;
            default:
                throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
        }
    };
    return XAxis;
}(Component));

var YAxis = (function (_super) {
    __extends(YAxis, _super);
    function YAxis(config) {
        _super.call(this, config);
    }
    YAxis.prototype.render = function () {
    };
    YAxis.prototype.update = function () {
    };
    return YAxis;
}(Component));

var XYAxis = (function (_super) {
    __extends(XYAxis, _super);
    function XYAxis(config) {
        _super.call(this, config);
        this.x = new XAxis(config);
        this.y = new YAxis(config);
    }
    XYAxis.prototype.render = function () {
    };
    XYAxis.prototype.update = function () {
    };
    return XYAxis;
}(Component));

var Lineset = (function (_super) {
    __extends(Lineset, _super);
    function Lineset(config, xyAxes) {
        _super.call(this, config);
        this.xyAxes = xyAxes;
    }
    Lineset.prototype.render = function () {
    };
    Lineset.prototype.update = function () {
    };
    return Lineset;
}(Component));

var Container = (function (_super) {
    __extends(Container, _super);
    function Container(config) {
        _super.call(this, config);
        this.components = [];
        var selector = this.config.get('selector'), width = this.config.get('width'), height = this.config.get('height'), marginLeft = this.config.get('marginLeft'), marginTop = this.config.get('marginTop');
        this.initializeContainer(selector, width, height, marginLeft, marginTop);
    }
    /**
     * Add a new component to the current SVG container.
     *
     * @param {Component} component A component to be added
     * @param {boolean} render If true, the component will be automatically rendered after adding it to the container
     * @returns {Container}
     *
     * @memberOf Container
    
     */
    Container.prototype.add = function (component, render) {
        if (render === void 0) { render = true; }
        this.components.push(component);
        if (render) {
            this.render();
        }
        return this;
    };
    /**
     *
     * Initialize the svg container.
     * @private
     * @param {string} selector Selector where this graph will be included in
     * @param {((number | string))} width Total width of the graph
     * @param {((number | string))} height Total height of the graph
     * @param {number} marginLeft Left margin
     * @param {number} marginTop Top margin
     *
     * @memberOf Container
    
     */
    Container.prototype.initializeContainer = function (selector, width, height, marginLeft, marginTop) {
        this.svg = d3Select.select(selector)
            .append('svg:svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('class', 'chartContainer')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
    };
    Container.prototype.update = function () {
    };
    Container.prototype.render = function () {
    };
    return Container;
}(Component));

var SvgChart = (function () {
    function SvgChart(config) {
        this.container = new Container(config);
    }
    return SvgChart;
}());

var SvgStrategyLinechart = (function (_super) {
    __extends(SvgStrategyLinechart, _super);
    function SvgStrategyLinechart(config) {
        _super.call(this, config);
        this.axes = new XYAxis(this.config);
        this.lines = new Lineset(this.config, this.axes);
        this.container
            .add(this.axes)
            .add(this.lines);
    }
    SvgStrategyLinechart.prototype.draw = function () {
        window.console.log('drawing linechart');
    };
    return SvgStrategyLinechart;
}(SvgChart));

var Linechart = (function (_super) {
    __extends(Linechart, _super);
    function Linechart() {
        _super.call(this, new SvgStrategyLinechart());
    }
    return Linechart;
}(Chart));

exports.Chart = Chart;
exports.Linechart = Linechart;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=proteic.js.map
