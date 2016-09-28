import {defaults} from '../utils/defaults/swimlane';
import {SvgContainer} from './components/svgContainer';
import {XYAxes} from './components/xyAxes';
import {TimeBoxset} from './components/timeBoxset';
import {Legend} from './components/legend';
import {calculateWidth} from '../utils/screen';

export class SvgSwimlaneStrategy {
  
  constructor(chartContext) {
    this._loadConfigOnContext(chartContext.config);
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
    var svg = this.svgContainer.svg,
      config = this.config,
      keys = d3.map(data, (d) => d.key).keys(),
      bbox = this._getBBox(data);

    this.axes.updateDomainByBBoxAndKeys(bbox, keys);
    this.axes.transition(svg, 200);

    this.boxs.update(svg, config, data);
    this.legend.update(svg, config, data);

  }
  _getBBox(data) {
    return [
      d3.min(data, (d) => new Date(d.x)),
      d3.max(data, (d) => new Date(d.y))
    ];
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

    this.config = {};
    this.config.cType = this.constructor.name;
    this.config.selector = config.selector || defaults.selector;
    this.config.margin = config.margin || defaults.margin;
    this.config.width = config.width ? calculateWidth(config.width, this.config.selector) - this.config.margin.left - this.config.margin.right
      : calculateWidth(defaults.width, this.config.selector) - this.config.margin.left - this.config.margin.right;
    this.config.height = config.height || defaults.height;
    this.config.ticks = config.ticks || defaults.ticks;
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
    return this;
  }
}