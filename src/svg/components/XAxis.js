"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var d3_scale_1 = require('d3/d3-scale');
var d3_format_1 = require('d3-format');
var d3_axis_1 = require('d3-axis');
var Component_1 = require('./Component');
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
                this.xAxis = d3_axis_1.axisBottom(d3_scale_1.scaleTime().range([0, width]));
                break;
            case 'linear':
                this.xAxis = d3_axis_1.axisBottom(d3_scale_1.scaleLinear().range([0, width])).tickFormat(d3_format_1.format(xAxisFormat));
                break;
            case 'categorical':
                this.xAxis = d3_axis_1.axisBottom(d3_scale_1.scaleBand().rangeRound([0, width]).padding(0.1).align(0.5));
                break;
            default:
                throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
        }
    };
    return XAxis;
}(Component_1["default"]));
exports.__esModule = true;
exports["default"] = XAxis;
