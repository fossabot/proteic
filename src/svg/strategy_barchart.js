import {SvgChart} from './svg'
import {defaults} from '../utils/defaults/barchart'
import {SvgContainer} from './components/SvgContainer'
import {XYAxes} from './components/xyAxes'
import {Barset} from './components/barset'
import {Legend} from './components/legend'
import {simple2stacked} from '../utils/dataTransformation'

export class SvgBarchartStrategy extends SvgChart {

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


    this.config.stacked = typeof (config.stacked) === 'undefined' ? defaults.stacked : config.stacked;
    //Just for testing purposes
    return this;
  }
}