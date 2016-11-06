import Component from './Component';
import Config from '../../Config';
import XAxis from './XAxis';
import YAxis from './YAxis';
import { simple2nested, simple2stacked } from '../../utils/dataTransformation';

import {
  stack,
  scaleBand,
  map,
  area,
  selection,
  nest
} from 'd3';


class Barset extends Component {

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
    let bars = null,
      stacked = this.config.get('stacked');

    this.clean();

    if (stacked) {
      this.updateStacked(data);
    } else {
      this.updateGrouped(data);
    }
    bars = this.svg.selectAll('g.serie rect');
    bars
      .on('mousedown.user', this.config.get('onDown'))
      .on('mouseup.user', this.config.get('onUp'))
      .on('mouseleave.user', this.config.get('onLeave'))
      .on('mouseover.user', this.config.get('onHover'))
      .on('click.user', this.config.get('onClick'));
  }

  private updateStacked(data: [any]) {
    let keys : [string] = map(data, (d) => d.key).keys();

    data = stack().keys(keys).value((d, k) => d.value[k])(simple2stacked(data));

    let colorScale = this.config.get('colorScale'),
      layer = this.svg.selectAll('.serie').data(data),
      layerEnter = layer.enter().append('g'),
      layerMerge = null,
      bar = null,
      barEnter = null,
      barMerge = null,
      x = this.x.xAxis.scale(),
      y = this.y.yAxis.scale();

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

  private updateGrouped(data: [any]) {
    let keys = map(data, (d) => d.key).keys(),
      colorScale = this.config.get('colorScale'),
      layer = this.svg.selectAll('.serie').data(data),
      layerEnter = null,
      layerMerge = null,
      bar = null,
      barEnter = null,
      barMerge = null,
      x = this.x.xAxis.scale(),
      y = this.y.yAxis.scale(),
      xGroup = scaleBand().domain(keys).range([0, x.bandwidth()]),
      height = this.config.get('height');


    data = simple2nested(data, 'x');

    layer = this.svg.selectAll('.serie').data(data);

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

}

export default Barset;