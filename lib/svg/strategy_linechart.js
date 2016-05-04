'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgLinechartStrategy = function (_SvgChart) {
  _inherits(SvgLinechartStrategy, _SvgChart);

  function SvgLinechartStrategy(chartContext) {
    _classCallCheck(this, SvgLinechartStrategy);

    //Create range function

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SvgLinechartStrategy).call(this, chartContext));

    _this.xAxisName = 'x';
    _this.yAxisName = 'y';

    _this.x = d3.scale.linear().range([0, _this.width]);
    _this.y = d3.scale.linear().range([_this.height, 0]);

    //Create scale
    _this.xAxis = d3.svg.axis().scale(_this.x).orient('bottom').ticks(10);

    _this.yAxis = d3.svg.axis().scale(_this.y).orient('left').innerTickSize(-_this.width).outerTickSize(0).tickPadding(20).ticks(_this.ticks, _this.tickLabel);

    _this.keyFunction = function (d) {
      return d.x;
    };
    return _this;
  }

  /**
   * Renders a linechart based on data object
   * @param  {Object} data Data Object. Contains an array with x and y properties.
   * 
   */


  _createClass(SvgLinechartStrategy, [{
    key: 'draw',
    value: function draw(data) {
      var _this2 = this;

      var line = null;
      var path = null;
      var markers = null;
      _get(Object.getPrototypeOf(SvgLinechartStrategy.prototype), 'draw', this).call(this, data);
      //Re-scale axis
      // this.x.domain([0, d3.max(data, function (d) { return d.x; })]);
      this.x.domain([d3.min(data, function (d) {
        return d.x;
      }), d3.max(data, function (d) {
        return d.x;
      })]);
      this.y.domain([0, d3.max(data, function (d) {
        return d.y;
      })]);

      //Create a transition effect for axis rescaling
      this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
      this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);

      // Bind data
      line = d3.svg.line().x(function (d) {
        return _this2.x(d.x);
      }).y(function (d) {
        return _this2.y(d.y);
      });

      // Create path and bind data to it
      path = this.svg.select('path').datum(data, this.keyFunction).attr('d', line);

      // Append markers to line
      if (this.markers) {
        switch (this.markers.shape) {
          case 'circle':
            markers = this.svg.selectAll('circle').data(data, this.keyFunction);

            markers.enter().append('circle').attr('cx', function (d) {
              return _this2.x(d.x);
            }).attr('cy', function (d) {
              return _this2.y(d.y);
            }).attr('r', this.markers.size).style({
              'fill': this.markers.color,
              'stroke': this.markers.outlineColor,
              'stroke-width': this.markers.outlineWidth
            });

            markers.transition().attr('cx', function (d) {
              return _this2.x(d.x);
            }).attr('cy', function (d) {
              return _this2.y(d.y);
            }).duration(0);
            break;
          default:
            throw Error('Not a valid marker shape: ' + this.markers.shape);
        }
      }

      // Add tooltips to the markers
      if (this.tooltip) {
        markers.append('title').text(this.tooltip(function (d) {
          return _this2.x(d.x);
        }));
      }

      // Add events to the markers
      markers.on('mousedown.user', this.events.down).on('mouseup.user', this.events.up).on('mouseleave.user', this.events.leave).on('mouseover.user', this.events.over).on('click.user', this.events.click);

      this.interactiveElements = markers;

      this._applyCSS();
    }
  }, {
    key: '_initialize',
    value: function _initialize() {
      var width = this.width + this.margin.left + this.margin.right;
      var height = this.height + this.margin.left + this.margin.right;

      //Create a global 'g' (group) element
      this.svg = d3.select(this.selector).append('svg').attr({ width: width, height: height }).append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

      // Append the line path
      this.svg.append('path');

      //Append a new group with 'x' aXis
      this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + this.height + ')').call(this.xAxis);

      //Append a new group with 'y' aXis
      this.svg.append('g').attr('class', 'y axis').attr('stroke-dasharray', '5, 5').call(this.yAxis).append('text');

      //Initialize SVG
      this._initialized = true;
    }

    /**
     * This method adds config options to the chart context.
     * @param  {Object} config Config object
     */

  }, {
    key: '_loadConfigOnContext',
    value: function _loadConfigOnContext(config) {
      config = config || { events: {}, markers: {} };
      if (!config.events) {
        config.events = {};
      }
      if (!config.markers) {
        config.markers = {};
      }
      _get(Object.getPrototypeOf(SvgLinechartStrategy.prototype), '_loadConfigOnContext', this).call(this, config);
      this.markers = {};
      this.markers.color = config.markers.color || _default.Linechart.markers.color;
      this.markers.outlineColor = config.markers.outlineColor || _default.Linechart.markers.outlineColor;
      this.markers.outlineWidth = config.markers.outlineWidth || _default.Linechart.markers.outlineWidth;
      this.markers.shape = config.markers.shape || _default.Linechart.markers.shape;
      this.markers.size = config.markers.size || _default.Linechart.markers.size;

      //Just for testing purposes
      return this;
    }
  }]);

  return SvgLinechartStrategy;
}(SvgChart);