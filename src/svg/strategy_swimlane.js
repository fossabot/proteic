import {defaults} from '../utils/defaults/swimlane';
import {SvgContainer} from './components/svgContainer';
import {SvgAxis} from './base/svgAxis';
import {XYAxes} from './components/xyAxes';
import {TimeBoxset} from './components/timeBoxset';
import {Legend} from './components/legend';
import {calculateWidth} from '../utils/screen';
import {convertPropretiesToTimeFormat} from '../utils/dataTransformation';

export class SvgSwimlaneStrategy extends SvgAxis {

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
      dataFormat = this.config.xAxisFormat,
      keys = d3.map(data, (d) => d.key).keys(),
      bbox = null,
      needRescaling = this.config.needRescaling;

    convertPropretiesToTimeFormat(data, ['x', 'y'], dataFormat);
    
    //rescale, if needed.
    if (needRescaling) {
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


  _loadConfig(config) {
    super._loadConfig(config, defaults);  
    return this;
  }
}