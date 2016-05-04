'use strict';

/**
 * SvgStrategy wrapper class
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SvgStrategy = function () {
    function SvgStrategy(strategy) {
        _classCallCheck(this, SvgStrategy);

        this.strategy = strategy;
    }

    _createClass(SvgStrategy, [{
        key: 'draw',
        value: function draw(data) {
            this.strategy.draw(data);
        }
    }, {
        key: 'on',
        value: function on(events) {
            this.strategy.on(events);
        }
    }]);

    return SvgStrategy;
}();