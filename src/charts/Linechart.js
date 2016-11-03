"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Chart_1 = require('./Chart');
var SvgStrategyLinechart_1 = require('../svg/strategies/SvgStrategyLinechart');
var Linechart = (function (_super) {
    __extends(Linechart, _super);
    function Linechart() {
        _super.call(this, new SvgStrategyLinechart_1["default"]());
    }
    return Linechart;
}(Chart_1["default"]));
exports.__esModule = true;
exports["default"] = Linechart;
