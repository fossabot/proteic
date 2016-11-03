"use strict";
var SvgContext = (function () {
    function SvgContext(strategy) {
        this.strategy = strategy;
    }
    SvgContext.prototype.draw = function () {
        this.strategy.draw();
    };
    return SvgContext;
}());
exports.SvgContext = SvgContext;
