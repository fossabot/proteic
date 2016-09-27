(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-dispatch'), require('proteus-colors')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-dispatch', 'proteus-colors'], factory) :
    (factory((global.Proteus = global.Proteus || {}),global.d3,global.proteus));
}(this, (function (exports,d3Dispatch,Colors) { 'use strict';

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isEven(n) {
  return n % 2 == 0;
}

function isPercentage(n) {
  let split = null;
  let number = null;
  if (!n || typeof n !== 'string') {
    return false;
  }
  split = n.split('%');
  number = (+split[0]);
  return split.length === 2 &&
    (number >= 0) &&
    (number <= 100);
}

function sortBy(array, o) {
  var _toString = Object.prototype.toString;
  var _parser = (x) => { return x; };
  var _getItem = (x) => {
    return _parser((x !== null && typeof x === 'object' && x[o.prop]) || x);
  };

  if (!(array instanceof Array) || !array.length) {
    return [];
  }
  if (_toString.call(o) !== '[object Object]') {
    o = {};
  }
  if (typeof o.parser !== 'function') {
    o.parser = _parser;
  }
  o.desc = o.desc ? -1 : 1;
  return array.sort((a, b) => {
    a = _getItem.call(o, a);
    b = _getItem.call(o, b);
    return o.desc * (a < b ? -1 : +(a > b));
  });
}

function deg2rad(deg) {
  return deg * Math.PI / 180;
}

class SvgChart {

    constructor(chartContext) {
        var clazz = this.constructor.name;
        if (clazz === 'SvgChart') {
            throw new Error(clazz + ' is non-instanciable');
        }
        this._initialized = false;
        this.cType = chartContext.cType;
        this._loadConfigOnContext(chartContext.config);

        this.interactiveElements = null;
    }

    draw(data) {
        if (this._sortData) {
            sortBy(data, {
                prop: this._sortData.prop,
                desc: this._sortData.descending
            });
        }

        if (!this._initialized) {
            this._initialize();
        }

    }

    _initialize() {
        var width = this.config.width + this.config.margin.left + this.config.margin.right;
        var height = this.config.height + this.config.margin.top + this.config.margin.bottom;

        //Create a global 'g' (group) element
        this.svg = d3
            .select(this.config.selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.margin.top + ')');

        //Append a new group with 'x' aXis
        this.svg
            .append('g')
            .attr('class', 'x dial')
            .attr('transform', 'translate(0,' + this.config.height + ')')
            .call(this.xAxis);


        this.svg
            .append('g')
            .attr('class', 'y dial')
            .attr('stroke-dasharray', '1, 2')
            .call(this.yAxis)
            .append('text');

        // Append axes labels
        this.svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'x dial label')
            .attr('x', this.config.width / 2)
            .attr('y', this.config.height + this.config.margin.bottom)
            .text(this.xAxisLabel);

        this.svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'y dial label')
            .attr('transform', 'rotate(-90)')
            .attr('x', - this.config.height / 2)
            .attr('y', - this.config.margin.left / 1.3)
            .text(this.yAxisLabel);
    }

    _applyCSS() {
        var style = this.style;
        var styleValue = null;

        for (let key in style) {
            styleValue = style[key];
            for (let v in styleValue) {
                d3.selectAll(key).style(v, styleValue[v]);
            }
        }
    }

    on(events = {}) {
        for (let key in events) {
            let action = events[key];
            this.interactiveElements.on(key + '.user', action);
        }

    }
    _calculateWidth(width) {
        if (width === 'auto') {
            return d3.select(this.config.selector)
                .node()
                .getBoundingClientRect()
                .width;
        }
        else if (isNumeric(width)) {
            //check container width TODO
            return width;
        }
        else if (isPercentage(width)) {
            let containerWidth, percentage;
            containerWidth = d3.select(this.config.selector)
                .node()
                .getBoundingClientRect()
                .width;
            percentage = width.split('%')[0];
            return Math.round(percentage * containerWidth / 100);
        } else {
            throw Error('Unknow chart width: ' + width);
        }

    }

    _loadConfigOnContext(config) {
        /**
        config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
        if (!config.events) {
            config.events = {};
        }
        if (!config.markers) {
            config.markers = {};
        }
        if (!config.xaxis) {
            config.xaxis = {};
        }
        if (!config.yaxis) {
            config.yaxis = {};
        }
        if(!config.x){
            config.x = {};
        }
        this.config = {};
        this.config.cType = this.constructor.name;
        this.config.selector = config.selector || _default[this.cType].selector;
        this.config.margin = config.margin || _default[this.cType].margin;
        this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
            : this._calculateWidth(_default[this.cType].width) - this.config.margin.left - this.config.margin.right;
        this.config.height = config.height || _default[this.cType].height;
        this.config.ticks = config.ticks || _default[this.cType].ticks;
        this.config.xticks = config.xaxis.ticks || _default[this.cType].xaxis.ticks;
        this.config.yticks = config.yaxis.ticks || _default[this.cType].yaxis.ticks;
        this.config.tickLabel = config.tickLabel || _default[this.cType].tickLabel;
        this.config.transitionDuration = config.transitionDuration || _default[this.cType].transitionDuration;
        this.config.tip = config.tooltip || _default[this.cType].tooltip;
        this.config.events = {};
        this.config.events.down = config.events.down || _default[this.cType].events.down;
        this.config.events.up = config.events.up || _default[this.cType].events.up;
        this.config.events.over = config.events.over || _default[this.cType].events.over;
        this.config.events.click = config.events.click || _default[this.cType].events.click;
        this.config.events.leave = config.events.leave || _default[this.cType].events.leave;
        this.config._sortData = config.sortData || _default[this.cType].sortData;
        this.config.style = config.style || _default[this.cType].style;
        this.config.colorScale = config.colorScale || _default[this.cType].colorScale;
        this.config.xAxisLabel = config.xaxis.label || _default[this.cType].xaxis.label;
        this.config.yAxisLabel = config.yaxis.label || _default[this.cType].yaxis.label;
        **/
    }

    _endAllTransitions(transition, callback) {
        var n;
        if (transition.empty()) {
            callback();
        }
        else {
            n = transition.size();
            transition.each('end', () => {
                n--;
                if (n === 0) {
                    callback();
                }
            });
        }
    }

    _removeUserEvents() {
        var userEvents = [
            'mousedown.user',
            'mouseup.user',
            'mouseleave.user',
            'mouseover.user',
            'click.user',
            'mouseover.tip',
            'mouseout.tip'
        ];
        for (let key in userEvents) {
            this.interactiveElements.on(userEvents[key], null);
        }
    }
    _updateXaxis() {
        this.svg.select('.x.dial').transition().duration(this.transitionDuration).call(this.xAxis);
    }
    _updateYaxis() {
        this.svg.select('.y.dial').transition().duration(this.transitionDuration).call(this.yAxis);
    }
    _updateAxis() {
        this._updateXaxis();
        this._updateYaxis();
    }
}

const defaults = {
    selector: '#chart',
    xaxis: {
        label: 'X',
        ticks: 5
    },
    yaxis: {
        label: 'Y',
        ticks: 5
    },
    colorScale: Colors.category7(),
    area: false,
    areaOpacity: 0.4,
    margin: {
        top: 20,
        right: 250,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
    height: 250,
    style: {
        '.line': {
            'stroke-width': 2,
            'fill': 'none'
        },
        '.area': {
            'stroke-width': 0
        },
        '.axis': {
            'font': '10px sans-serif'
        },
        '.axis path,.axis line': {
            'fill': 'none',
            'stroke': '#000',
            'shape-rendering': 'crispEdge'
        },
        '.x.axis path': {
            'display': 'none'
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    markers: {
        shape: 'circle',
        size: 5,
        color: '#FFFCCA',
        outlineColor: '#537780',
        outlineWidth: 2
    },
    tooltip(data) {
        return JSON.stringify(data);
    },
    events: {
        down() {
            d3.select(this).classed('hover', false);
        },
        over() {
            d3.select(this)
                .transition()
                .duration(50)
                .attr('r', 7)
                ;
        },
        leave() {
            d3.select(this)
                .transition()
                .duration(50)
                .attr('r', 5)
                .style('stroke-width', 2);
        },
        click(d, i) {
            console.log(d, i);
        }
    },
    tickLabel: '',
    transitionDuration: 300,
    maxNumberOfElements: 100, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: true,
        prop: 'x'
    }
};

class SvgContainer {

  constructor(config) {
    this._config = config;
    this.svg = this._initializeSvgContainer(config);
    this.components = Array();
  }

  _initializeSvgContainer(config) {
    var translation = 'translate(' + config.margin.left + ',' + config.margin.top + ')';
    var margin = config.margin
      , selector = config.selector
      , width = config.width + margin.left + margin.right
      , height = config.height + margin.top + margin.bottom;

    var svg = d3
      .select(selector)
      .append('svg:svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('class', 'chartContainer')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    return svg;
  }


  add(component, render = true) {
    this.components.push(component);
    
    if (render) {
      component.render(this.svg, this._config);
    }
    return this;
  }
}

class XAxis {
  constructor(xAxisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for XAxis');
    }

    this.xAxis = this._initializeXAxis(xAxisType, config);
  }


  _initializeXAxis(xAxisType = 'linear', config) {
    var x = null
      , xAxis = null;

    switch (xAxisType) {
      case 'time':
        x = d3.scaleTime().range([0, config.width]);
        break;
      case 'linear':
        x = d3.scaleLinear().range([0, config.width]);
        break;
      case 'categorical':
        x = d3.scaleBand().rangeRound([0, config.width])
          .padding(0.1)
          .align(0.5);
        break;
      default:
        throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
    }
  
    return d3.axisBottom(x).ticks(null);
  }

  transition(svg, time = 200) {
    svg.selectAll('.x.axis').transition().duration(time).call(this.xAxis).on('end', this.xStyle);
  }

  xStyle() {
    d3.select(this).selectAll('g.tick text')
      .style('font-size', '1.4em')
      .style('fill', (d, i) => !isEven(i) || i === 0 ? '#5e6b70' : '#1a2127')
      .style('fill', (d, i) => '#1a2127')


    d3.select(this).selectAll(['path', 'line'])
      .attr('stroke', 'gray')
      .attr('stroke-width', .3)

  }

  /**
   * This function is used when both x and y dial update their domains by x and y max/min values, respectively.
   */
  updateDomainByBBox(b) {
    var x = this.xAxis.scale();
    x.domain([b[0], b[1]]);
  }

  /**
   * Used when x domain is caterogial (a set of keys) and y domain is linear.
   */
  updateDomainByKeys(keys, yBbox) {
    var x = this.xAxis.scale();
    x.domain(keys);
  }

  render(svg, config) {
    var xAxis = this.xAxis
      , xAxisLabel = config.xAxisLabel
      , width = config.width
      , height = config.height
      , margin = config.margin;

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + config.height + ')')
      .call(xAxis)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'tickLabel')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom).text(xAxisLabel);
  }
}

class YAxis {
  constructor(yAxisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for XAxis');
    }

    this.yAxis = this._initializeYAxis(yAxisType, config);
  }


  _initializeYAxis(yAxisType = 'linear', config) {
    var y = null
      , yAxis = null;

    switch (yAxisType) {
      case 'linear':
        y = d3.scaleLinear().range([config.height, 0]);
        break;
      case 'categorical':
        y = d3.scaleBand().rangeRound([config.height, 0])
          .padding(0.1)
          .align(0.5);
        break;
      default:
        throw new Error('Not allowed type for YAxis. Only allowed "time",  "linear" or "categorical". Got: ' + yAxisType);
    }
    return d3.axisLeft(y)
      .tickSizeInner(-config.width)
      .tickSizeOuter(0)
      .tickPadding(20)
      .tickFormat((d) => d)
      .ticks(config.yticks, config.tickLabel);
  }

  transition(svg, time = 200) {
    svg.selectAll('.y.axis').transition().duration(time).call(this.yAxis).on('end', this.yStyle);
  }

  yStyle() {
    d3.select(this).selectAll('g.tick text')
      .style('font-size', '1.4em')
      .style('fill', (d, i) => !isEven(i) || i === 0 ? '#5e6b70' : '#1a2127')
      .style('font-weight', (d, i) => isEven(i) && i !== 0 ? 'bold' : 'normal')
      .style('font-size', '1.4em');

    d3.select(this).selectAll('g.tick line')
      .style('stroke', (d, i) => isEven(i) && i !== 0 ? '#5e6b70' : '#dbdad8');
  }

  /**
   * This function is used when both x and y axis update their domains by x and y max/min values, respectively. 
   */
  updateDomainByBBox(b) {
    var y = this.yAxis.scale();
    y.domain([b[0], b[1]]);
  }

  updateDomainByKeys(keys) {
    var y = this.yAxis.scale();
    y.domain(keys);
  }

  render(svg, config) {
    var yAxis = this.yAxis
      , yAxisLabel = config.yAxisLabel
      , width = config.width
      , height = config.height
      , margin = config.margin;

    svg
      .append('g')
      .attr('class', 'y axis')
      .attr('stroke-dasharray', '1, 5')
      .call(yAxis)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'tickLabel')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left / 1.3)
      .text(yAxisLabel);
  }
}

class XYAxes {
  constructor(xAxisType, yAxisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for XAxis');
    }

    this.x = new XAxis(xAxisType, config);
    this.y = new YAxis(yAxisType, config);
  }

  transition(svg, time = 200) {
    this.x.transition(svg, time);
    this.y.transition(svg, time);
  }

  /**
   * This function is used when both x and y dial update their domains by x and y max/min values, respectively.
   */
  updateDomainByBBox(b) {
    this.x.updateDomainByBBox([b[0], b[1]]);
    this.y.updateDomainByBBox([b[2], b[3]]);
  }

  /**
   * Used when x domain is caterogial (a set of keys) and y domain is linear.
   */
  updateDomainByKeysAndBBox(keys, bbox) {
    this.x.updateDomainByKeys(keys);
    this.y.updateDomainByBBox(bbox);
  }

  updateDomainByBBoxAndKeys(bbox, keys){
    this.x.updateDomainByBBox(bbox);
    this.y.updateDomainByKeys(keys);
  }
  
  render(svg, config) {
    this.x.render(svg, config);
    this.y.render(svg, config);
  }
}

class Lineset {
  constructor(x, y) {
    this.xAxis = x.xAxis;
    this.yAxis = y.yAxis;
    this.lineGenerator = d3.line()
      .x((d) => this.xAxis.scale()(d.x))
      .y((d) => this.yAxis.scale()(d.y));
  }

  update(svg, config, data) {
    var dataSeries = d3.nest().key((d) => d.key).entries(data);
    var series = null
      , lines = null
      , colorScale = config.colorScale;

    svg.selectAll('g.serie').remove();

    series = svg.selectAll('g.serie');
    lines = series
      .data(dataSeries, (d) => d.key)
      .enter()
      .append('g')
      .attr('class', 'serie')
      .attr('stroke', (d, i) => colorScale(i))
      .append('svg:path')
      .style('stroke', (d, i) => colorScale(i))
      .style('stroke-width', 1.3)
      .style('fill', 'none')
      .attr('d', (d) => this.lineGenerator(d.values))
      .attr('class', 'line');

    this.svg = svg;
  }

  render(svg, config) {
    //Do nothing, since lines render only when new data is received.
  }
}

class Legend {
  constructor() {}

  update(svg, config, data) {
    var dataSeries = d3.nest()
        .key((d) => d.key)
        .entries(data)
      , legend = null
      , entries = null
      , entries = null
      , colorScale = config.colorScale
      , height = config.height
      , width = config.width;

      
    svg.selectAll('g.legend').remove();
    
    legend = svg.append('g').attr('class', 'legend');
    entries = legend.selectAll('.legend-entry')
      .data(dataSeries, (d) => d.key)
      .enter()
      .append('g')
      .attr('class', 'legend-entry');


    entries.append('rect')
      .attr('x', width + 10)
      .attr('y', (d, i) => i * 25)
      .attr('height', 20)
      .attr('width', 20)
      .attr('fill', (d, i) => colorScale(i))
      .style('opacity', 0.8);

    entries.append('text')
      .attr("x", width + 25 + 10)
      .attr("y", (d, i) => i * 25 + 7)
      .attr("dy", "0.55em")
      .text((d) => d.key)
      .style('font', '14px sans-serif');

  }

  render(svg, config) {
    //Do nothing, since legend render only when new data is received.
  }
}

class Areaset {
  constructor(x, y) {
    this.xAxis = x.xAxis;
    this.yAxis = y.yAxis;
  }

  update(svg, config, data) {
    var dataSeries = d3.nest()
        .key((d) => d.key)
        .entries(data);

    var series = null
        , areas = null
        , area = config.area
        , colorScale = config.colorScale
        , height = config.height
        , areaOpacity = config.areaOpacity;

    var areaGenerator = d3.area()
        .x((d) => this.xAxis.scale()(d.x))
        .y0(height)
        .y1((d) => this.yAxis.scale()(d.y));

    svg.selectAll('g.area').remove();

    series = svg.selectAll('g.area');
    areas = series
        .data(dataSeries, (d) => d.key)
        .enter()
        .append('g')
        .attr('class', 'area')
        .append('svg:path')
        .style('fill', (d, i) => colorScale(i))
        .style('fill-opacity', areaOpacity)
        .attr('d', (d) => areaGenerator(d.values));

    // series
    //     .insert('path', ':first-child') //if not :first-child, area overlaps markers.
    //     .attr('class', 'area')
    //     .data(dataSeries)
    //     .style('stroke', (d, i) => colorScale(i))
    //     .style('fill', (d, i) => colorScale(i))
    //     .style('fill-opacity', areaOpacity)
    //     .attr('d', (d) => areaGenerator(d.values));

    this.svg = svg;
  }

  render(svg, config) {
    //Do nothing, since areas render only when new data is received.
  }
}

class Pointset {
  constructor(x, y) {
      this.xAxis = x.xAxis;
      this.yAxis = y.yAxis;
  }
  update(svg, config, data) {
      var dataSeries = d3.nest()
          .key((d) => d.key)
          .entries(data);

    var markers = null
      , markerShape = config.markers.shape
      , markerSize = config.markers.size
      , markerOutlineWidth = config.markers.outlineWidth
      , colorScale = config.colorScale
      , events = config.events
      , markers = null
      , points = null
      , series = null;

    svg.selectAll('g.points').remove();

    series = svg.selectAll('g.points');
    switch (markerShape) {
      case 'circle':
      default:
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('stroke', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d, i) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.xAxis.scale()(d.x))
          .attr('cy', (d) => this.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'lineMarker')
          .style('fill', 'white')
          .style('stroke-width', markerOutlineWidth);
    }

    markers = svg.selectAll('g.points circle');
    markers
      .on('mousedown.user', events.down)
      .on('mouseup.user', events.up)
      .on('mouseleave.user', events.leave)
      .on('mouseover.user', events.over)
      .on('click.user', events.click);

    //this.interactiveElements = markers;
  }

  render(svg, config) {
    //Do nothing, since points render only when new data is received.
  }
}

class SvgLinechartStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);
    var config = this.config
      , xDataType = config.x.type;

    this.svgContainer = new SvgContainer(config);
    this.axes = new XYAxes(xDataType, 'linear', config);

    this.lines = new Lineset(this.axes.x, this.axes.y);
    this.legend = new Legend();

    //Include components in the chart container
    this.svgContainer
      .add(this.axes)
      .add(this.legend)
      .add(this.lines);

    if (config.area) {
      this.areas = new Areaset(this.axes.x, this.axes.y);
      this.svgContainer.add(this.areas);
    }

    if (config.markers) {
      this.points = new Pointset(this.axes.x, this.axes.y);
      this.svgContainer.add(this.points);
    }
  }

	/**
	 * Renders a linechart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    var svg = this.svgContainer.svg
      , config = this.config
      , bbox = null;

    //    this._parseData(data, xDataFormat, yDataFormat, config);

    bbox = this._getDomainBBox(data);

    this.axes.updateDomainByBBox(bbox);

    //Create a transition effect for dial rescaling
    this.axes.transition(svg, 200);

    // Update legend
    this.legend.update(svg, config, data);

    //Now update lines
    this.lines.update(svg, config, data);

    if (config.area) {
      // Update areas
      this.areas.update(svg, config, data);
    }

    if (config.markers) {
      // Update points
      this.points.update(svg, config, data);
    }

  }

  _getDomainBBox(data) {
    var minX = d3.min(data, (d) => d.x)
      , maxX = d3.max(data, (d) => d.x)
      , minY = d3.min(data, (d) => d.y)
      , maxY = d3.max(data, (d) => d.y);
    return [minX, maxX, minY, maxY];
  }

  /**
   * This method adds config options to the chart context.
   * @param  {Object} config Config object
   */
  _loadConfigOnContext(config) {
    //super._loadConfigOnContext(config);
    config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
    if (!config.events) {
      config.events = {};
    }
    if (!config.markers) {
      config.markers = {};
    }
    if (!config.xaxis) {
      config.xaxis = {};
    }
    if (!config.yaxis) {
      config.yaxis = {};
    }
    if (!config.x) {
      config.x = {};
    }
    this.config = {};
    this.config.cType = this.constructor.name;
    this.config.selector = config.selector || defaults.selector;
    this.config.margin = config.margin || defaults.margin;
    this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
      : this._calculateWidth(defaults.width) - this.config.margin.left - this.config.margin.right;
    this.config.height = config.height || defaults.height;
    this.config.ticks = config.ticks || defaults.ticks;
    this.config.xticks = config.xaxis.ticks || defaults.xaxis.ticks;
    this.config.yticks = config.yaxis.ticks || defaults.yaxis.ticks;
    this.config.tickLabel = config.tickLabel || defaults.tickLabel;
    this.config.transitionDuration = config.transitionDuration || defaults.transitionDuration;
    this.config.tip = config.tooltip || defaults.tooltip;
    this.config.events = {};
    this.config.events.down = config.events.down || defaults.events.down;
    this.config.events.up = config.events.up || defaults.events.up;
    this.config.events.over = config.events.over || defaults.events.over;
    this.config.events.click = config.events.click || defaults.events.click;
    this.config.events.leave = config.events.leave || defaults.events.leave;
    this.config._sortData = config.sortData || defaults.sortData;
    this.config.style = config.style || defaults.style;
    this.config.colorScale = config.colorScale || defaults.colorScale;
    this.config.xAxisLabel = config.xaxis.label || defaults.xaxis.label;
    this.config.yAxisLabel = config.yaxis.label || defaults.yaxis.label;




    this.config.markers = {};
    this.config.markers.color = config.markers.color || defaults.markers.color;
    this.config.markers.outlineColor = config.markers.outlineColor || defaults.markers.outlineColor;
    this.config.markers.outlineWidth = config.markers.outlineWidth || defaults.markers.outlineWidth;
    this.config.markers.shape = config.markers.shape || defaults.markers.shape;
    this.config.markers.size = config.markers.size || defaults.markers.size;
    this.config.area = typeof (config.area) === 'undefined' ? defaults.area : config.area;
    this.config.areaOpacity = config.areaOpacity || defaults.areaOpacity;
    this.config.x = {};
    this.config.x.type = config.x.type || defaults.xDataType;
    this.config.x.format = config.x.format || defaults.xDateFormat;
    this.config.x.ticks = config.x.ticks;

    return this;
  }
}

const defaults$1 = {
    stacked: true,
    style: {
        '.axis': {
            'font': '10px sans-serif'
        },
        '.axis path,.axis line': {
            'fill': 'none',
            'stroke': '#000',
            'shape-rendering': 'crispEdges'
        },
        '.x.axis path': {
            'display': 'none'
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    xaxis: {
        label: ''
    },
    yaxis: {
        label: 'Y'
    },
    // Set the color scale for the chart. You can use Proteus scales or any D3 scale
    colorScale: Colors.category7(),
    margin: {
        top: 20,
        right: 250,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
    height: 350,
    ticks: 5, // ticks for y dial.
    tooltip(data) { // Allows HTML
        return '<b>Eje x</b>: ' + data.x + '<br/>' +
            '<b>Eje y</b>: ' + data.y;
    },
    tickLabel: '',
    selector: '#chart',
    events: {
        down() {
            d3.select(this).classed('hover', false);
        },
        over() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('fill-opacity', 0.4);
        },
        leave() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('fill-opacity', 1);
        },
        click(d, i) {
            console.log(d, i);
        }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: false,
        prop: 'x'
    }
};

function simple2stacked(data) {
  return d3.nest().key((d) => d.x).rollup((array) => {
    let r = {};
    for (let i in array) {
      let object = array[i];
      r[array[i].key] = array[i].y;
    }
    return r;
  }).entries(data);
};

function simple2nested(data, key = 'key') {
  return d3.nest().key((d) => d[key]).entries(data);
};

class Barset {
  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.lineGenerator = d3.line()
      .x((d) => xAxis.scale()(d.x))
      .y((d) => yAxis.scale()(d.y));
  }


  update(svg, config, data, method) {
    var bars = null
      , events = config.events;

    if (method === 'stacked') {
      this._updateStacked(svg, config, data);
    } else {
      this._updateGrouped(svg, config, data);
    }
    bars = svg.selectAll('g.serie rect');
    bars
      .on('mousedown.user', events.down)
      .on('mouseup.user', events.up)
      .on('mouseleave.user', events.leave)
      .on('mouseover.user', events.over)
      .on('click.user', events.click);

    this.interactiveElements = bars;
  }

  _updateStacked(svg, config, dataSeries) {
    this._cleanCurrentSeries(svg);

    var colorScale = config.colorScale
      , layer = svg.selectAll('.serie').data(dataSeries)
      , layerEnter = layer.enter().append('g')
      , layerMerge = null
      , bar = null
      , barEnter = null
      , barMerge = null
      , x = this.xAxis.scale()
      , y = this.yAxis.scale();

    layerMerge = layer.merge(layerEnter)
      .attr('class', 'serie')
      .attr('fill', (d, i) => colorScale(i));

    bar = layerMerge.selectAll('rect')
      .data((d) => d);

    barEnter = bar.enter().append('rect');

    barMerge = bar.merge(barEnter)
      .attr("x", (d) => x(d.data.key))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());
  }


  _updateGrouped(svg, config, data) {
    this._cleanCurrentSeries(svg);

    var keys = d3.map(data, (d) => d.key).keys()
      , colorScale = config.colorScale
      , layer = svg.selectAll('.serie').data(data)
      , layerEnter = null
      , layerMerge = null
      , bar = null
      , barEnter = null
      , barMerge = null
      , x = this.xAxis.scale()
      , y = this.yAxis.scale()
      , xGroup = d3.scaleBand().domain(keys).range([0, x.bandwidth()])
      , height = config.height;

    data = simple2nested(data, 'x');

    layer = svg.selectAll('.serie').data(data);

    layerEnter = layer.enter().append('g')
      .attr('transform', (d) => 'translate(' + x(d.key) + ')');

    layerMerge = layer.merge(layerEnter)
      .attr('class', 'serie')
      .attr('transform', (d) => 'translate(' + x(d.key) + ')');

    bar = layerMerge.selectAll('rect')
      .data((d) => d.values);

    barEnter = bar.enter().append('rect');

    barMerge = bar.merge(barEnter)
      .attr('width', xGroup.bandwidth())
      .attr("x", (d) => xGroup(d.key))
      .attr('fill', (d, i) => colorScale(i))
      .attr("y", (d) => y(d.y))
      .attr("height", (d) => height - y(d.y));

  }

  _getKeysFromData(data) {
    var keys = [];
    for (let p in data[0]) {
      if (p !== 'total' && p !== 'key') {
        keys.push(p);
      }
    }
    return keys;

  }

  _cleanCurrentSeries(svg) {
    svg.selectAll('.serie').remove();
  }

  render(svg, config) {
    //Do nothing, since bars render only when new data is received.
  }
}

class SvgBarchartStrategy extends SvgChart {

  constructor(chartContext) {
    super(chartContext);
    var config = this.config;

    this.svgContainer = new SvgContainer(config);
    this.axes = new XYAxes('categorical', 'linear', config);
    this.bars = new Barset(this.axes.x.xAxis, this.axes.y.yAxis);

    this.legend = new Legend();

    this.svgContainer
      .add(this.axes)
      .add(this.bars)
      .add(this.legend);

  }

	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    var svg = this.svgContainer.svg
      , config = this.config
      , keys = d3.map(data, (d) => d.key).keys()
      , data4stack = simple2stacked(data)
      , data4render = null
      , isStacked = this.config.stacked
      , stack = d3.stack().keys(keys)
        .value((d, k) => d.value[k])
        .order(d3.stackOrderNone)
      , yMin = 0
      , yMax = 0
      , method = isStacked ? 'stacked' : 'grouped'
      , dataSeries = stack(data4stack);

    yMax = isStacked
      ? d3.max(dataSeries, (serie) => d3.max(serie, (d) => d[1]))
      : d3.max(data, (d) => d.y)

    this.axes.updateDomainByKeysAndBBox(d3.map(data, (d) => d.x).keys(), [yMin, yMax]);
    this.axes.transition(svg, 200);

    data4render = isStacked ? dataSeries : data;

    this.bars.update(svg, config, data4render, method);

    this.legend.update(svg, config, data);

    this.data = data; // TODO: ? 

  }

  transition2Stacked() {
    this.config.stacked = true;
  }

  transition2Grouped() {
    this.config.stacked = false;
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {

    config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
    if (!config.events) {
      config.events = {};
    }
    if (!config.markers) {
      config.markers = {};
    }
    if (!config.xaxis) {
      config.xaxis = {};
    }
    if (!config.yaxis) {
      config.yaxis = {};
    }
    if (!config.x) {
      config.x = {};
    }
    this.config = {};
    this.config.cType = this.constructor.name;
    this.config.selector = config.selector || defaults$1.selector;
    this.config.margin = config.margin || defaults$1.margin;
    this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
      : this._calculateWidth(defaults$1.width) - this.config.margin.left - this.config.margin.right;
    this.config.height = config.height || defaults$1.height;
    this.config.ticks = config.ticks || defaults$1.ticks;
    this.config.xticks = config.xaxis.ticks || defaults$1.xaxis.ticks;
    this.config.yticks = config.yaxis.ticks || defaults$1.yaxis.ticks;
    this.config.tickLabel = config.tickLabel || defaults$1.tickLabel;
    this.config.transitionDuration = config.transitionDuration || defaults$1.transitionDuration;
    this.config.tip = config.tooltip || defaults$1.tooltip;
    this.config.events = {};
    this.config.events.down = config.events.down || defaults$1.events.down;
    this.config.events.up = config.events.up || defaults$1.events.up;
    this.config.events.over = config.events.over || defaults$1.events.over;
    this.config.events.click = config.events.click || defaults$1.events.click;
    this.config.events.leave = config.events.leave || defaults$1.events.leave;
    this.config._sortData = config.sortData || defaults$1.sortData;
    this.config.style = config.style || defaults$1.style;
    this.config.colorScale = config.colorScale || defaults$1.colorScale;
    this.config.xAxisLabel = config.xaxis.label || defaults$1.xaxis.label;
    this.config.yAxisLabel = config.yaxis.label || defaults$1.yaxis.label;


    this.config.stacked = typeof (config.stacked) === 'undefined' ? defaults$1.stacked : config.stacked;
    //Just for testing purposes
    return this;
  }
}

const defaults$2 =  {
    selector: '#chart',
    xDateFormat: '%m/%d/%y',
    colorScale: Colors.category5(),
    xaxis: {
        label: ''
    },
    yaxis: {
        label: ''
    },
    style: {
        '.axis': {
            'font': '10px sans-serif'
        },
        '.axis path,.axis line': {
            'fill': 'none',
            'stroke': '#000',
            'shape-rendering': 'crispEdges'
        },
        '.x.axis path': {
            'display': 'none'
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    margin: {
        top: 20,
        right: 250,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
    height: 300,
    ticks: 5, // ticks for y dial.
    tooltip(object) {
        return 'Info: ' + JSON.stringify(object);
    },
    tickLabel: '',
    events: {
        down() {
            d3.select(this).classed('hover', false);
        },
        over() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('fill-opacity', 0.4);
        },
        leave() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('fill-opacity', 1);
        },
        click(d, i) {
            console.log(d, i);
        }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: false,
        prop: 'x'
    }
};

class Streamset {
  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;

    this.areaGenerator = d3.area()
      .curve(d3.curveCardinal)
      .x((d) => this.xAxis.scale()(new Date(d.data.key))) // TODO: It seems d3.nest() transform Date object into String objects (because keys are always treated as string).
      .y0((d) => this.yAxis.scale()(d[0]))
      .y1((d) => this.yAxis.scale()(d[1]))
  }


  update(svg, config, data) {
    var colorScale = config.colorScale
      , events = config.events
      , series = null;

    series = svg.selectAll('.series')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'series')
      .style('stroke', (d, i) => colorScale(i));

    series
      .append('path')
      .attr('class', 'layer')
      .attr('d',this.areaGenerator)
      .style('fill', (d, i) => colorScale(i));

    series
      .attr('opacity', 1)
      .on('mousedown.user', events.down)
      .on('mouseup.user', events.up)
      .on('mouseleave.user', events.leave)
      .on('mouseover.user', events.over)
      .on('click.user', events.click);

  }


  render(svg, config) {
    //Do nothing, since lines render only when new data is received.
  }
}

class SvgStreamgraphStrategy extends SvgChart {

    constructor(chartContext) {
        super(chartContext);
        var config = this.config;

        this.svgContainer = new SvgContainer(config);
        this.x = new XAxis('time', config);
        this.y = new YAxis('linear', config);

        this.streams = new Streamset(this.x.xAxis, this.y.yAxis);

        this.legend = new Legend();

        //Include components in the chart container
        this.svgContainer
            .add(this.x)
            .add(this.y, false) //No render y Axis
            .add(this.legend)
            .add(this.streams);
    }

    draw(data) {
        var svg = this.svgContainer.svg
            , config = this.config
            , bbox = null
            , keys = d3.map(data, (d) => d.key).keys()
            , data4stack = simple2stacked(data)
            , stack = d3.stack()
                .keys(keys)
                .value((d, k) => d.value[k])
                .order(d3.stackOrderInsideOut)
                .offset(d3.stackOffsetWiggle)
            , dataSeries = stack(data4stack);

        bbox = this._getDomainBBox(data, dataSeries);

        this.x.updateDomainByBBox([bbox[0], bbox[1]]);
        this.y.updateDomainByBBox([bbox[2], bbox[3]]);
        this.x.transition(svg, 200);
        this.y.transition(svg, 200);

        // Update legend
        this.legend.update(svg, config, data);

        // Update streams
        this.streams.update(svg, config, dataSeries);
    }

    _getDomainBBox(data, dataSeries) {
        var minX = d3.min(data, (d) => d.x)
            , maxX = d3.max(data, (d) => d.x)
            , minY = d3.min(dataSeries, (serie) => d3.min(serie, (d) => d[0]))
            , maxY = d3.max(dataSeries, (serie) => d3.max(serie, (d) => d[1]));

        return [minX, maxX, minY, maxY];
    }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
    _loadConfigOnContext(config) {
        config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
        if (!config.events) {
            config.events = {};
        }
        if (!config.markers) {
            config.markers = {};
        }
        if (!config.xaxis) {
            config.xaxis = {};
        }
        if (!config.yaxis) {
            config.yaxis = {};
        }
        if (!config.x) {
            config.x = {};
        }
        this.config = {};
        this.config.cType = this.constructor.name;
        this.config.selector = config.selector || defaults$2.selector;
        this.config.margin = config.margin || defaults$2.margin;
        this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
            : this._calculateWidth(defaults$2.width) - this.config.margin.left - this.config.margin.right;
        this.config.height = config.height || defaults$2.height;
        this.config.ticks = config.ticks || defaults$2.ticks;
        this.config.xticks = config.xaxis.ticks || defaults$2.xaxis.ticks;
        this.config.yticks = config.yaxis.ticks || defaults$2.yaxis.ticks;
        this.config.tickLabel = config.tickLabel || defaults$2.tickLabel;
        this.config.transitionDuration = config.transitionDuration || defaults$2.transitionDuration;
        this.config.tip = config.tooltip || defaults$2.tooltip;
        this.config.events = {};
        this.config.events.down = config.events.down || defaults$2.events.down;
        this.config.events.up = config.events.up || defaults$2.events.up;
        this.config.events.over = config.events.over || defaults$2.events.over;
        this.config.events.click = config.events.click || defaults$2.events.click;
        this.config.events.leave = config.events.leave || defaults$2.events.leave;
        this.config._sortData = config.sortData || defaults$2.sortData;
        this.config.style = config.style || defaults$2.style;
        this.config.colorScale = config.colorScale || defaults$2.colorScale;
        this.config.xAxisLabel = config.xaxis.label || defaults$2.xaxis.label;
        this.config.yAxisLabel = config.yaxis.label || defaults$2.yaxis.label;
        this.config.colorScale = config.colorScale || defaults$2.colorScale;
        this.config.xDateformat = config.xDateFormat || defaults$2.xDateFormat;
    }
}

class SvgStackedAreaStrategy extends SvgChart {

    constructor(chartContext) {
        super(chartContext);
        var config = this.config;

        this.svgContainer = new SvgContainer(config);
        this.axes = new XYAxes('time', 'linear', config);

        this.streams = new Streamset(this.axes.x.xAxis, this.axes.y.yAxis);

        this.legend = new Legend();

        //Include components in the chart container
        this.svgContainer
            .add(this.axes)
            .add(this.legend)
            .add(this.streams);
    }

    draw(data) {
        var svg = this.svgContainer.svg
            , config = this.config
            , bbox = null
            , keys = d3.map(data, (d) => d.key).keys()
            , data4stack = simple2stacked(data)
            , stack = d3.stack()
                .keys(keys)
                .value((d, k) => d.value[k])
                .order(d3.stackOrderInsideOut)
                .offset(d3.stackOffNone)
            , dataSeries = stack(data4stack);

        bbox = this._getDomainBBox(data, dataSeries);

        this.axes.updateDomainByBBox(bbox);
        this.axes.transition(svg, 200);

        // Update legend
        this.legend.update(svg, config, data);

        // Update streams
        this.streams.update(svg, config, dataSeries);
    }


    _getDomainBBox(data, dataSeries) {
        var minX = d3.min(data, (d) => new Date(d.x))
            , maxX = d3.max(data, (d) => new Date(d.x))
            , minY = d3.min(dataSeries, (serie) => d3.min(serie, (d) => d[0]))
            , maxY = d3.max(dataSeries, (serie) => d3.max(serie, (d) => d[1]));

        return [minX, maxX, minY, maxY];
    }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
    _loadConfigOnContext(config) {
        config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
        if (!config.events) {
            config.events = {};
        }
        if (!config.markers) {
            config.markers = {};
        }
        if (!config.xaxis) {
            config.xaxis = {};
        }
        if (!config.yaxis) {
            config.yaxis = {};
        }
        if (!config.x) {
            config.x = {};
        }
        this.config = {};
        this.config.cType = this.constructor.name;
        this.config.selector = config.selector || defaults$2.selector;
        this.config.margin = config.margin || defaults$2.margin;
        this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
            : this._calculateWidth(defaults$2.width) - this.config.margin.left - this.config.margin.right;
        this.config.height = config.height || defaults$2.height;
        this.config.ticks = config.ticks || defaults$2.ticks;
        this.config.xticks = config.xaxis.ticks || defaults$2.xaxis.ticks;
        this.config.yticks = config.yaxis.ticks || defaults$2.yaxis.ticks;
        this.config.tickLabel = config.tickLabel || defaults$2.tickLabel;
        this.config.transitionDuration = config.transitionDuration || defaults$2.transitionDuration;
        this.config.tip = config.tooltip || defaults$2.tooltip;
        this.config.events = {};
        this.config.events.down = config.events.down || defaults$2.events.down;
        this.config.events.up = config.events.up || defaults$2.events.up;
        this.config.events.over = config.events.over || defaults$2.events.over;
        this.config.events.click = config.events.click || defaults$2.events.click;
        this.config.events.leave = config.events.leave || defaults$2.events.leave;
        this.config._sortData = config.sortData || defaults$2.sortData;
        this.config.style = config.style || defaults$2.style;
        this.config.colorScale = config.colorScale || defaults$2.colorScale;
        this.config.xAxisLabel = config.xaxis.label || defaults$2.xaxis.label;
        this.config.yAxisLabel = config.yaxis.label || defaults$2.yaxis.label;
        this.config.colorScale = config.colorScale || defaults$2.colorScale;
        this.config.xDateformat = config.xDateFormat || defaults$2.xDateFormat;
    }
}

const defaults$3 = {
    selector: '#chart',
    colorScale: Colors.category3(),

    margin: {
        top: 20,
        right: 100,
        bottom: 30,
        left: 100
    },
    width: '99%', // %, auto, or numeric
    height: 550,
    events: {
        down() {
            d3.select(this).classed('hover', false);
        },
        over() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('fill-opacity', 0.4);
        },
        leave() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('fill-opacity', 1);
        },
        click(d, i) {
            console.log(d, i);
        },
        up () {
            
        }
    },
};

class TimeBoxset {

  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;

  }
  update(svg, config, data) {
    var colorScale = config.colorScale
      , events = config.events
      , keys = d3.map(data, (d) => d.key).keys()
      , layer = svg.selectAll('.serie').data(data)
      , layerEnter = null
      , layerMerge = null
      , box = null
      , boxEnter = null
      , boxMerge = null
      , x = this.xAxis.scale()
      , y = this.yAxis.scale()
      , height = config.height
      , extLanes = null
      , yLanes = null
      , yLanesBand = d3.scaleBand().range([0, keys.length + 1]).domain(keys);

    data = simple2nested(data);
    extLanes = d3.extent(data, (d, i) => i)
    yLanes = d3.scaleLinear().domain([extLanes[0], extLanes[1] + 1]).range([0, config.height]);

    layer = svg.selectAll('.serie').data(data);
    layerEnter = layer.enter().append('g');

    layerMerge = layer.merge(layerEnter)
      .attr('class', 'serie');


    box = layerMerge.selectAll('rect')
      .data((d) => d.values);

    boxEnter = box.enter().append('rect');

    boxMerge = box.merge(boxEnter)
      .attr('width', (d) => x(new Date(d.y)) - x(new Date(d.x)))
      .attr('x', (d) => x(new Date(d.x)))
      .attr('y', (d) => y(d.key))
      .attr('fill', (d, i, j) => colorScale(parseInt(yLanesBand(d.key))))
      .attr("height", (d) => .8 * yLanes(1));


    box = svg.selectAll('g.serie rect');
    box
      .on('mousedown.user', events.down)
      .on('mouseup.user', events.up)
      .on('mouseleave.user', events.leave)
      .on('mouseover.user', events.over)
      .on('click.user', events.click);

  }

  render(svg, config) {
    //Do nothing, since lines render only when new data is received.
  }
}

class SvgSwimlaneStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);
    var config = this.config;
    this.svgContainer = new SvgContainer(config);

    this.axes = new XYAxes('time', 'categorical', config);
    this.boxs = new TimeBoxset(this.axes.x.xAxis, this.axes.y.yAxis);
    this.legend = new Legend();

    this.svgContainer
      .add(this.axes)
      .add(this.boxs)
      .add(this.legend);
  }

  draw(data) {
    var svg = this.svgContainer.svg
      , config = this.config
      , keys = d3.map(data, (d) => d.key).keys()
      , bbox = this._getBBox(data);

    this.axes.updateDomainByBBoxAndKeys(bbox, keys);
    this.axes.transition(svg, 200);

    this.boxs.update(svg, config, data);
    this.legend.update(svg, config, data);

  }
  _getBBox(data) {
    return [
      d3.min(data, (d) => new Date(d.x)),
      d3.max(data, (d) => new Date(d.y))
    ]
  }


  _loadConfigOnContext(config) {
    config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
    if (!config.events) {
      config.events = {};
    }
    if (!config.markers) {
      config.markers = {};
    }
    if (!config.xaxis) {
      config.xaxis = {};
    }
    if (!config.yaxis) {
      config.yaxis = {};
    }
    if (!config.x) {
      config.x = {};
    }

console.log(defaults$3);

    this.config = {};
    this.config.cType = this.constructor.name;
    this.config.selector = config.selector || defaults$3.selector;
    this.config.margin = config.margin || defaults$3.margin;
    this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
      : this._calculateWidth(defaults$3.width) - this.config.margin.left - this.config.margin.right;
    this.config.height = config.height || defaults$3.height;
    this.config.ticks = config.ticks || defaults$3.ticks;
    this.config.tickLabel = config.tickLabel || defaults$3.tickLabel;
    this.config.transitionDuration = config.transitionDuration || defaults$3.transitionDuration;
    this.config.tip = config.tooltip || defaults$3.tooltip;
    this.config.events = {};
    this.config.events.down = config.events.down || defaults$3.events.down;
    this.config.events.up = config.events.up || defaults$3.events.up;
    this.config.events.over = config.events.over || defaults$3.events.over;
    this.config.events.click = config.events.click || defaults$3.events.click;
    this.config.events.leave = config.events.leave || defaults$3.events.leave;
    this.config._sortData = config.sortData || defaults$3.sortData;
    this.config.style = config.style || defaults$3.style;
    this.config.colorScale = config.colorScale || defaults$3.colorScale;
    return this;
  }
}

const defaults$4 =  {
    selector: '#chart',
    colorScale: Colors.diverging_red_blue(),
    invertColorScale: true,
    minLevel: 0,
    maxLevel: 100,
    minAngle: -90,
    maxAngle: 90,
    ringWidth: 50,
    ringMargin: 20,
    labelInset: 10,
    needleNutRadius: 25,
    needleLenghtRatio: 0.8,
    numericIndicator: true,
    xaxis: {
        label: 'X'
    },
    yaxis: {
        label: 'Y'
    },
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '50%', // %, auto, or numeric
    height: 250,
    style: {
        '.labels': {
            'font': '18px sans-serif',
            'text-anchor': 'middle'
        },
        '.text-indicator': {
            'font': '48px sans-serif',
            'text-anchor': 'middle'
        },
        '.needle': {
            'fill': '#666666'
        }
    },
    ticks: 10, // ticks for y dial.
    markers: {
        shape: 'circle',
        size: 5,
        color: '#FFFCCA',
        outlineColor: '#537780',
        outlineWidth: 2
    },
    tooltip(data) {
        return JSON.stringify(data);
    },
    events: {
        down() {
            d3.select(this).classed('hover', false);
        },
        over() {
            d3.select(this)
                .transition()
                .duration(50)
                .attr('r', 7)
                ;
        },
        leave() {
            d3.select(this)
                .transition()
                .duration(50)
                .attr('r', 5)
                .style('stroke-width', 2);
        },
        click(d, i) {
            console.log(d, i);
        }
    },
    tickLabel: '',
    transitionDuration: 300,
    maxNumberOfElements: 5, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: false,
        prop: 'x'
    }
};

class Dial { // TODO tidy
  constructor(axisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for polarAxis');
    }

    this.r = (
      (config.width > config.height)
        ? config.height
        : config.width
      ) / 2;
    this.translation = (() =>
    'translate(' + this.r + ',' + this.r + ')'
    );
    config.colorScale.domain([0, 1]);

    this.scale = d3.scaleLinear()
        .domain([config.minLevel, config.maxLevel])
        .range([0, 1]);

    this.scaleMarks = this.scale.ticks(config.ticks);

    this.range = config.maxAngle - config.minAngle;

    this.arc = d3.arc()
      .innerRadius(this.r - config.ringWidth - config.ringMargin)
      .outerRadius(this.r - config.ringMargin)
      .startAngle((d, i) => {
        var ratio = d * i;
        return deg2rad(config.minAngle + (ratio * this.range));
      })
      .endAngle((d, i) => {
        var ratio = d * (i + 1);
        return deg2rad(config.minAngle + (ratio * this.range));
      });

    this.tickData = d3.range(config.ticks)
      .map(() => 1 / config.ticks);
  }

  render(svg, config) {
    let labels = null;

    // Append the ring
    let arcs = svg.append('g')
      .attr('class', 'arc')
      .attr('transform', this.translation);

    // Append the ring sectors
    let arcPaths = arcs.selectAll('path')
      .data(this.tickData)
      .enter().append('path')
      // ID for textPath linking
      .attr('id', (d, i) => 'sector-' + i)
      .attr('d', this.arc);

    // Fill colors
    if (config.invertColorScale) {
      arcPaths.attr('fill', (d, i) => config.colorScale(1 - d * i));
    } else {
      arcPaths.attr('fill', (d, i) => config.colorScale(d * i));
    }

    // Apend the scale labels
    labels = svg.append('g')
      .attr('class', 'labels')
      .attr('transform', this.translation);

    // // Append scale marker labels
    labels.selectAll('text')
      .data(this.scaleMarks)
      .enter().append('text')
      .attr('transform', (d) => {
        var ratio = this.scale(d);
        var newAngle = config.minAngle + (ratio * this.range);
        return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - this.r) + ')';
      })
      .text((d) => d)
      .style('text-anchor', 'middle')
      .style('font-family', 'sans-serif')
      .style('font-size', '18px');
  }
}

class DialNeedle { // TODO tidy
  constructor(axisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for polarAxis');
    }

    this.r = (
      (config.width > config.height)
        ? config.height
        : config.width
      ) / 2;

    this.needleLen = config.needleLenghtRatio * (this.r);

    this.translation = (() =>
    'translate(' + this.r + ',' + this.r + ')'
    );
    config.colorScale.domain([0, 1]);

    this.scale = d3.scaleLinear()
        .domain([config.minLevel, config.maxLevel])
        .range([0, 1]);

    this.angleScale = d3.scaleLinear()
      .domain([config.minLevel, config.maxLevel])
      .range([90 + config.minAngle, 90 + config.maxAngle]);

    this.scaleMarks = this.scale.ticks(config.ticks);

    this.range = config.maxAngle - config.minAngle;

    this.arc = d3.arc()
      .innerRadius(this.r - config.ringWidth - config.ringMargin)
      .outerRadius(this.r - config.ringMargin)
      .startAngle((d, i) => {
        var ratio = d * i;
        return deg2rad(config.minAngle + (ratio * this.range));
      })
      .endAngle((d, i) => {
        var ratio = d * (i + 1);
        return deg2rad(config.minAngle + (ratio * this.range));
      });

    this.tickData = d3.range(config.ticks)
      .map(() => 1 / config.ticks);
  }

  update(svg, config, data, method) {
    let datum = data[data.length - 1];

    this.needle
      .transition()
      .attr('transform', (d) => `translate(${this.r}, ${this.r}) rotate(${this.angleScale(datum.x) - 90})`)
      .attr('d', `M ${0 - config.needleNutRadius} ${0} L ${0} ${0 - this.needleLen} L ${config.needleNutRadius} ${0}`);
  }

  render(svg, config) {
    // Update the needle
    this.needle = svg.append('path')
      .attr('class', 'needle')
      .datum(0)
      .attr('transform', (d) => `translate(${this.r}, ${this.r}) rotate(${this.angleScale(d) - 90})`)
      .attr('d', `M ${0 - config.needleNutRadius} ${0} L ${0} ${0 - this.needleLen} L ${config.needleNutRadius} ${0}`)
      .style('fill', '#666666');

    // Append needle nut
    svg.append('circle')
      .attr('class', 'needle')
      .attr('transform', this.translation)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', config.needleNutRadius)
      .style('fill', '#666666');
  }

}

class NumericIndicator { // TODO tidy
  constructor(config) {
    if (config === null) {
      throw new Error('No chart context specified for polarAxis');
    }

    this.r = (
        (config.width > config.height)
          ? config.height
          : config.width
      ) / 2;

    this.translation = (() =>
    'translate(' + this.r + ',' + this.r + ')'
    );
  }

  update(svg, config, data, method) {
    let datum = data[data.length - 1];

    svg.select('.text-indicator')
      .text(datum.x);
  }

  render(svg, config) {
    svg.append('text')
      .attr('class', 'text-indicator')
      .attr('transform', this.translation)
      .attr('x', 0)
      .attr('y', 100)
      .text('0')
      .style('font-family', 'sans-serif')
      .style('font-size', '48px')
      .style('text-anchor', 'middle');
  }
}

class SvgGaugeStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);

    var config = this.config;

    this.svgContainer = new SvgContainer(config);
    this.dial = new Dial('linear', config);
    this.needle = new DialNeedle('linear', config);

    this.svgContainer
      .add(this.dial)
      .add(this.needle);

    if (config.numericIndicator) {
      this.numericIndicator = new NumericIndicator(config);
      this.svgContainer.add(this.numericIndicator)
    }
  }

	/**
	 * Renders a gauge chart based on data object
	 * @param  {Object} data Data Object. Contains a numeric value.
	 *
	 */
  draw(data) {
    var svg = this.svgContainer.svg
      , config = this.config;

    this.needle.update(svg, config, data);
    if (config.numericIndicator) {
      this.numericIndicator.update(svg, config, data);
    }
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {
    this.config = {};
    this.config.cType = this.constructor.name;
    this.config.selector = config.selector || defaults$4.selector;
    this.config.margin = config.margin || defaults$4.margin;
    this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
      : this._calculateWidth(defaults$4.width) - this.config.margin.left - this.config.margin.right;
    this.config.height = config.height || defaults$4.height;
    this.config.ticks = config.ticks || defaults$4.ticks;
    this.config.tickLabel = config.tickLabel || defaults$4.tickLabel;
    this.config.transitionDuration = config.transitionDuration || defaults$4.transitionDuration;
    this.config.tip = config.tooltip || defaults$4.tooltip;
    this.config._sortData = config.sortData || defaults$4.sortData;
    this.config.style = config.style || defaults$4.style;
    this.config.colorScale = config.colorScale || defaults$4.colorScale;  
    this.config.x = {};

    this.config.minLevel = config.minLevel || defaults$4.minLevel;
    this.config.maxLevel = config.maxLevel || defaults$4.maxLevel;
    this.config.minAngle = config.minAngle || defaults$4.minAngle;
    this.config.maxAngle = config.maxAngle || defaults$4.maxAngle;
    this.config.ticks = config.ticks || defaults$4.ticks;
    this.config.ringWidth = config.ringWidth || defaults$4.ringWidth;
    this.config.ringMargin = config.ringMargin || defaults$4.ringMargin;
    this.config.labelInset = config.labelInset || defaults$4.labelInset;
    this.config.needleNutRadius = config.needleNutRadius || defaults$4.needleNutRadius;
    this.config.needleLenghtRatio = config.needleLenghtRatio || defaults$4.needleLenghtRatio;
    this.config.invertColorScale = typeof (config.invertColorScale) === 'undefined' ? defaults$4.invertColorScale : config.invertColorScale;
    this.config.numericIndicator = typeof (config.numericIndicator) === 'undefined' ? defaults$4.numericIndicator : config.numericIndicator;
    //Just for testing purposes
    return this;
  }

}

/**
 * SvgStrategy wrapper class
 */
class SvgStrategy {
    constructor(strategy) {
        this.strategy = strategy;
    }
    draw(data) {
        this.strategy.draw(data);
    }
    on(events){
        this.strategy.on(events);
    }
};

const strategies = {
  Barchart(chartContext) {
    return new SvgBarchartStrategy(chartContext);
  },
  Linechart(chartContext) {
    return new SvgLinechartStrategy(chartContext);
  },
  Streamgraph(chartContext) {
    return new SvgStreamgraphStrategy(chartContext);
  },
  Gauge(chartContext) {
    return new SvgGaugeStrategy(chartContext);
  },
  Sunburst(chartContext) {
    return new SvgSunburstStrategy(chartContext);
  },
  Swimlane(chartContext) {
    return new SvgSwimlaneStrategy(chartContext);
  },
  StackedArea(chartContext) {
    return new SvgStackedAreaStrategy(chartContext);
  }
};

/**
 * Base class. This class is inherited in all charts implementations.
 * This is a non-instanciable chart.
 */
class Chart {

    constructor(d, config) {
        var clazz = this.constructor.name;
        if (clazz === 'Graph') {
            throw new Error(clazz + ' is non-instanciable');
        }
        //this.dispatcher = dispatch(); TODO: Re-implement reactor with d3-dispatcher

        this.events = {};

        if (!d && !config) {
            throw new Error('Missing constructor parameters');
        }

        let dataFormat = d.constructor.name;
        let nArguments = (d && config) ? 2 : 1;

        switch (dataFormat) {
            case 'WebsocketDatasource':
                this.datasource = d;
                this.data = [];
                this._configureDatasource();
                break;
            case 'Array':
                this.data = d;
                break;
            default:
                throw TypeError('Wrong data format');
        }
        //if only 1 parameter is specified, take default config. Else, take the second argument as config.
        this.config = (nArguments === 1) ? _default[this.constructor.name] : config;

        this._initializeSVGContext();
    }

    _parseData(data, xDataFormat, yDataFormat, config) {
        data.forEach((d) => {
            //parse x coordinate
            switch (xDataFormat) {
                case 'time':
                    d.x = d3.timeParse(config.x.format)(d.x);
                    break;
                case 'linear':
                    d.x = +d.x;
                    break;
            }
            //parse x coordinate
            switch (yDataFormat) {
                case 'time':
                    d.y = d3.timeFormat
                    break;
                case 'linear':
                    d.y = +d.y;
                    break;
            }
        });
        return data;
    }

    /**
     * Returns the chart context: data, configuration and chart type.
     */
    _getChartContext() {
        return {
            data: this.data,
            config: this.config,
            cType: this.constructor.name
        };
    }

    /**
     * Initialize the SVG context
     */
    _initializeSVGContext() {
        this._svg = new SvgStrategy(strategies[this.constructor.name](this._getChartContext()));
    }

    /**
     * Renders data on barchart. Only allowed when data is an array of static data.
     * @param  {Array} data Array of data
     */
    draw(data = this.data) {
        var config = this.config
            , sort = config.sort
            , xDataFormat = config.x ? config.x.type : null
            , yDataFormat = 'linear'
            , p = null
            , desc = null
            , parsedData = null;
        if(xDataFormat)
            parsedData = this._parseData(JSON.parse(JSON.stringify(data)), xDataFormat, yDataFormat, config); // We make a copy of data. We don't want to modify the original object.
        else
            parsedData = JSON.parse(JSON.stringify(data));
            
        if (sort) {
            p = config.sort.field;
            desc = config.sort.desc;
            parsedData.sort((e1, e2) => {
                var a = e1[p];
                var b = e2[p];
                return (a < b) ? -1 : (a > b) ? 1 : 0;
            })
        }

        this._svg.draw(parsedData);
    }

    /**
     * Returns a PNG image of the current graph
     * @return {String} Image - in data-url format
     */
    toPNG(cb) {
        utils.svgAsDataUri(d3.select(this.config.selector + ' svg')._groups[0][0], {}, (uri, err) => {
            if (err) {
                throw Error('Error converting to image ' + err);
            }
            else {
                cb(uri);
            }
        });
    }

    /**
     * On method. Define custom events (click, over, down and up).
     */
    on(eventName, action) {
        throw Error('Not implemented');
        /**
        if (!eventName || typeof eventName !== 'string') {
            throw Error('eventName should be a string. Instead: ' + eventName);
        }
        if (!action || !utils.isFunction(action)) {
            throw Error('action should be a function. Instead: ' + eventName);
        }

        this.events[eventName] = action;
        this._svg.on(this.events);
        return this;
        **/
    }

    _configureDatasource() {
        throw Error('Not implemented');
        // this.datasource.configure(this.reactor);
        /*/
        this.reactor.registerEvent('onmessage');
        this.reactor.registerEvent('onerror');
        this.reactor.registerEvent('onopen');

        this.reactor.addEventListener('onmessage', (data) => {
            this.keepDrawing(data);
        });

        this.reactor.addEventListener('onopen', (e) => {
            console.debug('Connected to websocket endpoint.', e);
        });

        this.reactor.addEventListener('onerror', (error) => {
            console.error('An error has occured: ', error);
        });
        */
    }

    pause() {
        // if (!this.datasource) {
        //    throw ('You need a datasource to pause a streaming');
        // }
        //this.reactor.removeEventListener('onmessage');
    }

    resume() {
        //if (!this.datasource) {
        //   throw ('You need a datasource to resume a streaming');
        // }

        // this.reactor.addEventListener('onmessage', (data) => {
        //     this.keepDrawing(data);
        // });
    }

}

/**
 * Linechart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */
class Linechart extends Chart {

  /**
   * Linechart constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super(data, config);
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data) {
    super.draw(data);
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum data to be rendered
   */
  keepDrawing(datum) {
    super.keepDrawing(datum, 'add');
  }
}

/**
 * Barchart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */
class Barchart extends Chart {

  /**
   * Barchart constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you 
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super(data, config);
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data - This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data) {
    super.draw(data);
  }

  fire(event, data) {//TODO: improve this section
    if(event === 'transition'){
      if(data==='grouped'){
        this._svg.strategy.transition2Grouped();
      }
      else if(data === 'stacked'){
        this._svg.strategy.transition2Stacked();
      }

      this._svg.strategy.draw();
    }
   // var element = this._svg.strategy.svg;
   // if (!element || !element[0][0]) {
   //   throw Error('Cannot fire events because SVG dom element is not yet initialized');
   // }
   // element[0][0].dispatchEvent(new CustomEvent(event, { detail: { type: data } }));
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum - data to be rendered
   */
  keepDrawing(datum) {
    super.keepDrawing(datum, 'replace');
  }


}

/**
 * Streamgraph implementation. This charts belongs to 'Flow' family.
 * It is inherited on 'Flow'.
 */
class Streamgraph extends Chart {

  /**
   * Streamgraph constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super(data, config);
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data) {
    super.draw(data);
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum data to be rendered
   */
  keepDrawing(datum) {
    if (!this.datum) {
      this.datum = [];
    }
    this.datum = this.datum.concat(datum);
    super.draw(this.datum);
  }
}

/**
 * StackedArea implementation. This charts belongs to 'Flow' family.
 * It is inherited on 'Flow'.
 */
class StackedArea extends Chart {

  /**
   * StackedArea constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super(data, config);
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data) {
    super.draw(data);
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum data to be rendered
   */
  keepDrawing(datum) {
    if (!this.datum) {
      this.datum = [];
    }
    this.datum = this.datum.concat(datum);
    super.draw(this.datum);
  }
}

/**
 * Linechart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */
class Swimlane extends Chart {

  /**
   * Linechart constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super(data, config);
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data) {
    this._svg.draw(data);
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum data to be rendered
   */
  keepDrawing(datum) {
  }
}

/**
 * Gauge implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */
class Gauge extends Chart {

  /**
   * Gauge constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super(data, config);
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data) {
    super.draw(data);
  }


  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum data to be rendered
   */
  keepDrawing(datum) {
    this.data = [datum[0]];
    super.draw();
  }

}

exports.Linechart = Linechart;
exports.Barchart = Barchart;
exports.Streamgraph = Streamgraph;
exports.StackedArea = StackedArea;
exports.Swimlane = Swimlane;
exports.Gauge = Gauge;

Object.defineProperty(exports, '__esModule', { value: true });

})));