import {SvgChart} from './svg'
import {defaults} from '../utils/defaults/linechart'
import {SvgContainer} from './components/svgContainer'
import {XYAxes} from './components/xyAxes'
import {Lineset} from './components/lineset'
import {Legend} from './components/legend'
import {Areaset} from './components/areaset'
import {Pointset} from './components/pointset'

export class SvgLinechartStrategy extends SvgChart {
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