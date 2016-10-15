import {defaults} from '../utils/defaults/swimlane';
import {SvgContainer} from './components/svgContainer';
import {SvgStrategy} from './strategy';
import {XYAxes} from './components/xyAxes';
import {TimeBoxset} from './components/timeBoxset';
import {Legend} from './components/legend';
import {calculateWidth} from '../utils/screen';
import {convertPropretiesToTimeFormat} from '../utils/dataTransformation';

export class SvgSwimlaneStrategy extends SvgStrategy {

  constructor(context) {
    super(context);
    this.axes = new XYAxes('time', 'categorical', this.config);
    this.boxs = new TimeBoxset(this.axes.x.xAxis, this.axes.y.yAxis);
    this.legend = new Legend();

    this.svgContainer
      .add(this.axes)
      .add(this.boxs)
      .add(this.legend);
  }

  draw(data) {
    let svg = this.svgContainer.svg,
      config = this.config,
      dataFormat = this.config.x.format,
      keys = d3.map(data, (d) => d.key).keys(),
      bbox = null,
      needAxisRescaling = this.config.needAxisRescaling;

    convertPropretiesToTimeFormat(data, ['x', 'y'], dataFormat);
    
    //rescale, if needed.
    if (needAxisRescaling) {
      this.rescale();
    }
    
    bbox = this._getBBox(data);
    this.axes.updateDomainByBBoxAndKeys(bbox, keys);
    this.axes.transition(svg, 200);

    this.boxs.update(svg, config, data);
    this.legend.update(svg, config, data);

  }
  
  _getBBox(data) {
    return [
      d3.min(data, (d) => (d.x)),
      d3.max(data, (d) => (d.y))
    ];
  }


  _loadConfigOnContext(config) {
    config = config || { events: {}, x: {}, y: {} };
    if (!config.events) {
      config.events = {};
    }
 
    if (!config.x) {
      config.x = {};
    }
        if (!config.y) {
      config.y = {};
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
    
    this.config.x = {};
    this.config.x.type = config.x.type || defaults.axis.x.type;
    this.config.x.format = config.x.format || defaults.axis.x.format;
    this.config.y = {};
    this.config.y.type = config.y.type || defaults.axis.y.type;
    this.config.y.format = config.y.format || defaults.axis.x.format;
  
    return this;
  }
}