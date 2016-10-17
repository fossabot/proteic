import {simple2nested} from '../../utils/dataTransformation'

export class TimeBoxset {

  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;

  }
  update(svg, config, data) {
    let colorScale = config.colorScale,
      keys = d3.map(data, (d) => d.key).keys(),
      layer = svg.selectAll('.serie').data(data),
      layerEnter = null,
      layerMerge = null,
      box = null,
      boxEnter = null,
      boxMerge = null,
      extLanes = null,
      yLanes = null,
      yLanesBand = d3.scaleBand().range([0, keys.length + 1]).domain(keys),
      x = this.xAxis.scale(),
      y = this.yAxis.scale();

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
      .attr('width', (d) => x(d.y) - x(d.x))
      .attr('x', (d) => x(d.x))
      .attr('y', (d) => y(d.key))
      .attr('fill', (d, i, j) => colorScale(parseInt(yLanesBand(d.key))))
      .attr("height", (d) => .8 * yLanes(1));


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