"use strict";
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
;
exports.__esModule = true;
exports["default"] = Config;
