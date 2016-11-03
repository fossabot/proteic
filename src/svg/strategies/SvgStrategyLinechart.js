"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XYAxes_1 = require('../components/XYAxes');
var Lineset_1 = require('../components/Lineset');
var SvgChart_1 = require('../base/SvgChart');
var SvgStrategyLinechart = (function (_super) {
    __extends(SvgStrategyLinechart, _super);
    function SvgStrategyLinechart(config) {
        _super.call(this, config);
        this.axes = new XYAxes_1["default"](this.config);
        this.lines = new Lineset_1["default"](this.config, this.axes);
        this.container
            .add(this.axes)
            .add(this.lines);
    }
    SvgStrategyLinechart.prototype.draw = function () {
        window.console.log('drawing linechart');
    };
    return SvgStrategyLinechart;
}(SvgChart_1["default"]));
exports.__esModule = true;
exports["default"] = SvgStrategyLinechart;
