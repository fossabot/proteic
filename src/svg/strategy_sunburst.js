import {defaults} from '../utils/defaults/barchart';
import {SvgContainer} from './components/svgContainer';
import {RadialAxes} from './components/radialAxes';
import {SunburstDisk} from './components/sunburstDisk';
import {NumericIndicator} from './components/numericIndicator';
import {calculateWidth} from '../utils/screen';

export class SvgSunburstStrategy {

  constructor(chartContext) {
    this._loadConfigOnContext(chartContext.config);
    var config = this.config;
    let radius = (Math.min(config.width, config.height) / 2) - 10;

    this.svgContainer = new SvgContainer(config);
    this.svgContainer.svg.attr('transform', 'translate(' + config.width / 2 + ',' + (config.height / 2) + ')');
    this.axes = new RadialAxes(config);
    this.disk = new SunburstDisk(
      this.axes.x.xRadialAxis,
      this.axes.y.yRadialAxis,
      config);
    // this.numericIndicator = new NumericIndicator(config);

    this.svgContainer
      .add(this.disk);
      // .add(this.numericIndicator);
  }

  draw(data) {
    var svg = this.svgContainer.svg,
      config = this.config,
      colorScale = this.config.colorScale;

    this.disk.update(svg, config, data);
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
    this.config.width = config.width ? calculateWidth(config.width, this.config.selector) - this.config.margin.left - this.config.margin.right
      : calculateWidth(defaults.width, this.config.selector) - this.config.margin.left - this.config.margin.right;
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

    //Just for testing purposes
    return this;
  }
}
