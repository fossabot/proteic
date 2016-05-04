'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SvgChart = function () {
    function SvgChart(chartContext) {
        _classCallCheck(this, SvgChart);

        var clazz = this.constructor.name;
        if (clazz === 'SvgChart') {
            throw new Error(clazz + ' is non-instanciable');
        }
        this._initialized = false;
        this.cType = chartContext.cType;
        this._loadConfigOnContext(chartContext.config);

        this.interactiveElements = null;
    }

    _createClass(SvgChart, [{
        key: 'draw',
        value: function draw(data) {
            if (this._sortData) {
                utils.sortBy(data, {
                    prop: this._sortData.prop,
                    desc: this._sortData.descending
                });
            }

            if (!this._initialized) {
                this._initialize();
            }
        }
    }, {
        key: '_applyCSS',
        value: function _applyCSS() {
            var style = this.style;
            var styleValue = null;

            for (var key in style) {
                styleValue = style[key];
                d3.selectAll(key).style(styleValue);
            }
        }
    }, {
        key: 'on',
        value: function on() {
            var events = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            for (var key in events) {
                var action = events[key];
                this.interactiveElements.on(key + '.user', action);
            }
        }
    }, {
        key: '_loadConfigOnContext',
        value: function _loadConfigOnContext(config) {
            this.margin = config.margin || _default[this.cType].margin;
            this.width = config.width || _default[this.cType].width;
            this.height = config.height || _default[this.cType].height;
            this.ticks = config.ticks || _default[this.cType].ticks;
            this.tickLabel = config.tickLabel || _default[this.cType].tickLabel;
            this.selector = config.selector || _default[this.cType].selector;
            this.transitionDuration = config.transitionDuration || _default[this.cType].transitionDuration;
            this.tooltip = config.tooltip || _default[this.cType].tooltip;
            this.events = {};
            this.events.down = config.events.down || _default[this.cType].events.down;
            this.events.up = config.events.up || _default[this.cType].events.up;
            this.events.over = config.events.over || _default[this.cType].events.over;
            this.events.click = config.events.click || _default[this.cType].events.click;
            this.events.leave = config.events.leave || _default[this.cType].events.leave;
            this._sortData = config.sortData || _default[this.cType].sortData;
            this.style = config.style || _default[this.cType].style;
            this.colorScale = config.colorScale || _default[this.cType].colorScale;
        }
    }]);

    return SvgChart;
}();