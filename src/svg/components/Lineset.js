"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Component_1 = require('./Component');
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
}(Component_1["default"]));
exports.__esModule = true;
exports["default"] = Lineset;
