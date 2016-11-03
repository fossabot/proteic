"use strict";
var SvgStrategy_1 = require('../svg/strategies/SvgStrategy');
var Chart = (function () {
    function Chart(strategy) {
        this.svg = new SvgStrategy_1.SvgContext(strategy);
    }
    Chart.prototype.draw = function () {
        this.svg.draw();
    };
    return Chart;
}());
exports.__esModule = true;
exports["default"] = Chart;
