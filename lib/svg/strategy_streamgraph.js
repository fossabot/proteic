'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgStreamgraphStrategy = function (_SvgChart) {
    _inherits(SvgStreamgraphStrategy, _SvgChart);

    function SvgStreamgraphStrategy(chartContext) {
        _classCallCheck(this, SvgStreamgraphStrategy);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SvgStreamgraphStrategy).call(this, chartContext));

        _this.x = d3.time.scale().range([0, _this.width]);
        _this.y = d3.scale.linear().range([_this.height - 10, 0]);

        _this.format = d3.time.format(_this.xDateformat);
        _this.xAxis = d3.svg.axis().scale(_this.x).orient('bottom').ticks(d3.time.days);

        _this.yAxis = d3.svg.axis().scale(_this.y);
        return _this;
    }

    /**
     * Renders a barchart based on data object
     * @param  {Object} data Data Object. Contains an array with x and y properties.
     * 
     */


    _createClass(SvgStreamgraphStrategy, [{
        key: 'draw',
        value: function draw(data) {
            var _this2 = this;

            var layers = null; //streamgraph layers
            var nColors = null; //number of colors = different keys
            var fromColor = this.colorScale.from;
            var toColor = this.colorScale.to;
            var colorrange = null; //color range based on user preferences

            //Initialize data
            if (!this._initialized) {
                this._initialize();
            }
            //Force x axis to be a date and y-axis to be a number
            data.forEach(function (d) {
                d.date = _this2.format.parse(d.date);
                d.value = +d.value;
            });
            this.stack = d3.layout.stack().offset('silhouette').values(function (d) {
                return d.values;
            }).x(function (d) {
                return d.date;
            }).y(function (d) {
                return d.value;
            });

            this.nest = d3.nest().key(function (d) {
                return d.key;
            });

            this.area = d3.svg.area().interpolate('cardinal').x(function (d) {
                return _this2.x(d.date);
            }).y0(function (d) {
                return _this2.y(d.y0);
            }).y1(function (d) {
                return _this2.y(d.y0 + d.y);
            });

            layers = this.stack(this.nest.entries(data));

            this.x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            this.y.domain([0, d3.max(data, function (d) {
                return d.y0 + d.y;
            })]);

            nColors = utils.getNumberOfDifferentArrayKeys(data, 'key');
            colorrange = chroma.scale([fromColor, toColor]).colors(nColors);

            this.z = d3.scale.ordinal().range(colorrange);

            this.svg.selectAll('.layer').data(layers).enter().append('path').attr('class', 'layer').attr('d', function (d) {
                return _this2.area(d.values);
            }).style('fill', function (d, i) {
                return _this2.z(i);
            });

            this.svg.selectAll('.layer').attr('opacity', 1).on('mousedown.user', this.events.down).on('mouseup.user', this.events.up).on('mouseleave.user', this.events.leave).on('mouseover.user', this.events.over).on('click.user', this.events.click);

            var vertical = d3.select(this.selector).append('div').attr('class', 'remove').style('position', 'absolute').style('z-index', '19').style('width', '1px').style('height', '380px').style('top', '10px').style('bottom', '30px').style('left', '0px').style('background', '#000000');

            this._applyCSS();
        }
    }, {
        key: '_initialize',
        value: function _initialize() {
            var width = this.width + this.margin.left + this.margin.right;
            var height = this.height + this.margin.left + this.margin.right;

            this.svg = d3.select(this.selector).append('svg').attr({ width: width, height: height }).append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

            this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + this.height + ')').call(this.xAxis);

            this.svg.append('g').attr('class', 'y axis').attr('transform', 'translate(' + this.width + ', 0)').call(this.yAxis.orient('right'));

            this.svg.append('g').attr('class', 'y axis').call(this.yAxis.orient('left'));

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
            _get(Object.getPrototypeOf(SvgStreamgraphStrategy.prototype), '_loadConfigOnContext', this).call(this, config);
            this.colorScale = config.colorScale || _default.Streamgraph.colorScale;
            this.xDateformat = config.xDateFormat || _default.Streamgraph.xDateFormat;
        }
    }]);

    return SvgStreamgraphStrategy;
}(SvgChart);