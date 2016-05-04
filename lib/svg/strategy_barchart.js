'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgBarchartStrategy = function (_SvgChart) {
  _inherits(SvgBarchartStrategy, _SvgChart);

  function SvgBarchartStrategy(chartContext) {
    _classCallCheck(this, SvgBarchartStrategy);

    //Create range function

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SvgBarchartStrategy).call(this, chartContext));

    _this.xAxisName = 'x';
    _this.yAxisName = 'y';
    _this.x = d3.scale.ordinal().rangeRoundBands([0, _this.width], .1);
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
   * Renders a barchart based on data object
   * @param  {Object} data Data Object. Contains an array with x and y properties.
   * 
   */


  _createClass(SvgBarchartStrategy, [{
    key: 'draw',
    value: function draw(data) {
      var _this2 = this;

      var bars = null;
      var max = Number.MIN_VALUE;

      _get(Object.getPrototypeOf(SvgBarchartStrategy.prototype), 'draw', this).call(this, data);

      //Re-scale axis
      this.x.domain(data.map(this.keyFunction));
      max = d3.max(data, function (d) {
        return d[_this2.yAxisName];
      });
      this.y.domain([0, max]);

      //Create a transition effect for axis rescaling
      this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
      this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);

      //Bind data
      bars = this.svg.selectAll('.bar').data(data, this.keyFunction);
      //For new data, add bars and events  
      bars.enter().append('rect').attr('class', 'bar').attr('height', function (d) {
        return _this2.height - _this2.y(d[_this2.yAxisName]);
      }).attr('fill', function (d, i) {
        return _this2.colorScale(i);
      })
      //namespaces let us to provide more than one functon for the same event
      .on('mousedown.user', this.events.down).on('mouseup.user', this.events.up).on('mouseleave.user', this.events.leave).on('mouseover.user', this.events.over).on('click.user', this.events.click);

      this.interactiveElements = bars;

      bars.exit().transition().duration(300).attr('y', this.y(0)).attr('height', this.height - this.y(0)).style('fill-opacity', 1e-6).style().remove();

      bars.transition().duration(300).attr('x', function (d) {
        return _this2.x(d[_this2.xAxisName]);
      }).attr('width', this.x.rangeBand()).attr('y', function (d) {
        return _this2.y(d[_this2.yAxisName]);
      }).attr('height', function (d) {
        return _this2.height - _this2.y(d[_this2.yAxisName]);
      });

      this._applyCSS();
    }
  }, {
    key: '_initialize',
    value: function _initialize() {
      var width = this.width + this.margin.left + this.margin.right;
      var height = this.height + this.margin.left + this.margin.right;
      //Create a global 'g' (group) element
      this.svg = d3.select(this.selector).append('svg').attr({ width: width, height: height }).append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

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
      config = config || { events: {} };
      if (!config.events) {
        config.events = {};
      }
      _get(Object.getPrototypeOf(SvgBarchartStrategy.prototype), '_loadConfigOnContext', this).call(this, config);

      //Just for testing purposes
      return this;
    }
  }]);

  return SvgBarchartStrategy;
}(SvgChart);