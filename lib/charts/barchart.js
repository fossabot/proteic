'use strict';

/**
 * Barchart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Barchart = function (_Basic) {
  _inherits(Barchart, _Basic);

  /**
   * Barchart constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you 
   * do not specify this, '_default' object is used by default.
   */

  function Barchart(data, config) {
    _classCallCheck(this, Barchart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Barchart).call(this));

    if (!arguments.length) {
      throw new Error('Missing constructor parameters');
    }

    _this._inferDataSource(arguments[0]);

    switch (arguments.length) {
      case 1:
        _this.data = arguments[0];
        _this.config = _default[_this.constructor.name];
        break;
      case 2:
        _this.data = arguments[0];
        _this.config = arguments[1];
        break;
      default:
        throw Error('Unrecognized number of paremeters: ' + arguments);
    }
    _this._initializeSVGContext();
    return _this;
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */


  _createClass(Barchart, [{
    key: 'draw',
    value: function draw() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

      _get(Object.getPrototypeOf(Barchart.prototype), 'draw', this).call(this, data);
    }

    /**
     * Add new data to the current graph. If it is empty, this creates a new one.
     * @param  {[Object]} datum data to be rendered
     */

  }, {
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      var config = this.config;
      var maxNumberOfElements = config.maxNumberOfElements;
      if (!this.datum) {
        this.datum = [];
      }
      this.datum = this.datum.concat(datum);
      if (maxNumberOfElements && maxNumberOfElements > 0) {
        if (this.datum.length > maxNumberOfElements) {
          for (var i = 0; i < datum.length; i++) {
            this.datum.shift();
          }
        }
      }
      _get(Object.getPrototypeOf(Barchart.prototype), 'draw', this).call(this, this.datum);
    }
  }]);

  return Barchart;
}(Basic);