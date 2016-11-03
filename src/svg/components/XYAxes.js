"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XAxis_1 = require('./XAxis');
var YAxis_1 = require('./YAxis');
var Component_1 = require('./Component');
var XYAxis = (function (_super) {
    __extends(XYAxis, _super);
    function XYAxis(config) {
        _super.call(this, config);
        this.x = new XAxis_1["default"](config);
        this.y = new YAxis_1["default"](config);
    }
    XYAxis.prototype.render = function () {
    };
    XYAxis.prototype.update = function () {
    };
    return XYAxis;
}(Component_1["default"]));
exports.__esModule = true;
exports["default"] = XYAxis;
