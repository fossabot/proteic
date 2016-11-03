import {simple2nested} from '../../utils/dataTransformation';
import {map, scaleBand, extent, scaleLinear} from 'd3';

export class TimeBoxset {

  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;

  }
  update(svg, config, data) {
    let colorScale = config.colorScale,
      keys = map(data, (d) => d.key).keys(),
      layer = svg.selectAll('.serie').data(data),
      layerEnter = null,
      layerMerge = null,
      box = null,
      boxEnter = null,
      boxMerge = null,
      extLanes = null,
      yLanes = null,
      yLanesBand = scaleBand().range([0, keys.length + 1]).domain(keys),
      x = this.xAxis.scale(),
      y = this.yAxis.scale();

    data = simple2nested(data);
    extLanes = extent(data, (d, i) => i);
    yLanes = scaleLinear().domain([extLanes[0], extLanes[1] + 1]).range([0, config.height]);

    layer = svg.selectAll('.serie').data(data);
    layerEnter = layer.enter().append('g');

    layerMerge = layer.merge(layerEnter)
      .attr('class', 'serie');


    box = layerMerge.selectAll('rect')
      .data((d) => d.values);

    boxEnter = box.enter().append('rect');

    boxMerge = box.merge(boxEnter)
      .attr('width', (d) => x(d.end) - x(d.start))
      .attr('x', (d) => x(d.start))
      .attr('y', (d) => y(d.key))
      .attr('fill', (d) => colorScale(parseInt(yLanesBand(d.key))))
      .attr('height', () => 0.8 * yLanes(1));

    box = svg.selectAll('g.serie rect');
    
    box
      .on('mousedown.user', config.onDown)
      .on('mouseup.user', config.onUp)
      .on('mouseleave.user', config.onLeave)
      .on('mouseover.user', config.onHover)
      .on('click.user', config.onClick);

  }

  render(svg, config) {
    //Do nothing, since lines render only when new data is received.
  }
}