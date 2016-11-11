import Component from './Component';
import Config from '../../Config';
import XAxis from './XAxis';
import YAxis from './YAxis';

import {
  area,
  selection,
  nest
} from 'd3';


class Areaset extends Component {

  private x: XAxis;
  private y: YAxis;

  constructor(x: XAxis, y: YAxis) {
    super();
    this.x = x;
    this.y = y;
  }

  public render() {
    //Do nothing, since points render only when new data is received.

  }

  public update(data: [any]) {
    let dataSeries = nest()
      .key((d) => d.key)
      .entries(data),
      series = null,
      areas = null,
      colorScale = this.config.get('colorScale'),
      height = this.config.get('height'),
      areaOpacity = this.config.get('areaOpacity');

    let areaGenerator = area()
      .x((d) => this.x.xAxis.scale()(d.x))
      .y0(height)
      .y1((d) => this.y.yAxis.scale()(d.y));

    this.svg.selectAll('g.area').remove();

    series = this.svg.selectAll('g.area');
    areas = series
      .data(dataSeries, (d) => d.key)
      .enter()
      .append('g')
      .attr('class', 'area')
      .append('svg:path')
      .style('fill', (d, i) => colorScale(d.key))
      .style('fill-opacity', areaOpacity)
      .attr('d', (d) => areaGenerator(d.values));
  }

}

export default Areaset;