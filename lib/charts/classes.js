'use strict';
/**
 * globals Svg, _default
 */

/**
 * Base class. This class is inherited in all charts implementations.
 * This is a non-instanciable chart.
 */

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chart = function () {
  function Chart() {
    _classCallCheck(this, Chart);

    var clazz = this.constructor.name;
    if (clazz === 'Chart' || clazz === 'Basic' || clazz === 'Flow') {
      throw new Error(clazz + ' is non-instanciable');
    }
    this.events = {};
  }

  /**
   * Returns the chart context: data, configuration and chart type.
   */


  _createClass(Chart, [{
    key: '_getChartContext',
    value: function _getChartContext() {
      return {
        data: this.data,
        config: this.config,
        cType: this.constructor.name
      };
    }

    /**
     * Initialize the SVG context
     */

  }, {
    key: '_initializeSVGContext',
    value: function _initializeSVGContext() {
      this._svg = new SvgStrategy(strategies[this.constructor.name](this._getChartContext()));
    }

    /**
     * @param  {Object} data Data object. This method infer the type of data, which could be:
     * Array: Data is an static object.
     * Object: Data is a data source we need to connect to, in order to receive a stream of data.
     */

  }, {
    key: '_inferDataSource',
    value: function _inferDataSource(data) {
      if (utils.isObject(data)) {
        this._initializeWebsocketDataSource(data);
      } else if (!utils.isArray(data)) {
        throw new TypeError('Wrong data format');
      }
    }

    /**
     * Initialize a connecton between browser and server through a Websocket connections
     * @param  {Object} source Connection details.
     */

  }, {
    key: '_initializeWebsocketDataSource',
    value: function _initializeWebsocketDataSource(source) {
      var _this = this;

      var _initialize = function _initialize() {
        _this.ws = new WebSocket(source.endpoint);

        _this.ws.onopen = function () {};

        _this.ws.onerror = function (e) {
          throw new Error('Error with websocket connection', e);
        };

        _this.ws.onmessage = function (event) {
          //var data = JSON.parse(event.data).points;
          var data = JSON.parse(event.data.substr(2))[1];
          setTimeout(function () {
            _this.keepDrawing(data);
          }, 50);
        };
      };

      //private streaming functions, only available when using websockets
      this.start = function () {
        _initialize();
      };
      this.stop = function () {
        if (_this.ws) {
          _this.ws.close();
        }
      };
    }

    /**
    * Add a new serie to the current data.
    * @param  {object} new serie
    * @autodraw {Boolean} Auto re-draw the current chart after adding the new serie
    */

  }, {
    key: 'addSerie',
    value: function addSerie(serie) {
      var autodraw = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!serie || !utils.isObject(serie)) {
        throw Error('\'serie\' should be an object. Instead: ' + series);
      }

      this.data.push(serie);

      if (autodraw) {
        this.draw();
      }
    }

    /**
     * Add new series (array) to the current data.
     * @param  {Array} series Array of data
     * @autodraw {Boolean} Auto re-draw the current chart after adding new series
     */

  }, {
    key: 'addSeries',
    value: function addSeries(series) {
      var autodraw = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!series || series.constructor !== Array) {
        throw Error('\'series\' should be an array. Instead: ' + series);
      }

      this.data = this.data.concat(series);

      if (autodraw) {
        this.draw();
      }
    }

    /**
     * Renders data on barchart. Only allowed when data is an array of static data.
     * @param  {Array} data Array of data
     */

  }, {
    key: 'draw',
    value: function draw() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

      if (!utils.isArray(data)) {
        throw new TypeError('draw method is only allowed with static data.');
      }
      this._svg.draw(data);
    }

    /**
     * Returns a PNG image of the current graph
     * @return {[String]} Image in data-url format
     */

  }, {
    key: 'toPNG',
    value: function toPNG(cb) {
      utils.svgAsDataUri(d3.select(this.config.selector + ' svg')[0][0], {}, function (uri, err) {
        if (err) {
          throw Error('Error converting to image ' + err);
        } else {
          cb(uri);
        }
      });
    }

    /**
     * On method. Define custom events (click, over, down and up).
     */

  }, {
    key: 'on',
    value: function on(eventName, action) {
      if (!eventName || typeof eventName !== "string") {
        throw Error('eventName should be a string. Instead: ' + eventName);
      }
      if (!action || !utils.isFunction(action)) {
        throw Error('action should be a function. Instead: ' + eventName);
      }

      this.events[eventName] = action;
      this._svg.on(this.events);
      return this;
    }
  }]);

  return Chart;
}();

/**
 * Basic chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: bar, line, point.
 */

var Basic = function (_Chart) {
  _inherits(Basic, _Chart);

  function Basic() {
    _classCallCheck(this, Basic);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Basic).call(this));
  }

  return Basic;
}(Chart);

/**
 * Flow chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: stremgraph and so on.
 */

var Flow = function (_Chart2) {
  _inherits(Flow, _Chart2);

  function Flow() {
    _classCallCheck(this, Flow);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Flow).call(this));
  }

  _createClass(Flow, [{
    key: 'draw',
    value: function draw(data) {
      //hack to clone object. It is because flow chart (like streamgraph) modify the original dataset to create itself.
      //It could be a problem in streaming scenario, where data is concatenated with new data. We need to keep the original dataset.
      data = JSON.parse(JSON.stringify(data));
      _get(Object.getPrototypeOf(Flow.prototype), 'draw', this).call(this, data);
    }
  }]);

  return Flow;
}(Chart);