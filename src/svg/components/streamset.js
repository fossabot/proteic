export class Streamset {
  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;

    this.areaGenerator = d3.area()
      .curve(d3.curveCardinal)
      .x((d) => this.xAxis.scale()(new Date(d.data.key))) // TODO: It seems d3.nest() transform Date object into String objects (because keys are always treated as string).
      .y0((d) => this.yAxis.scale()(d[0]))
      .y1((d) => this.yAxis.scale()(d[1]))
  }


  update(svg, config, data) {
    var colorScale = config.colorScale
      , events = config.events
      , series = null;

    svg.selectAll('.serie').remove();
    
    series = svg.selectAll('.serie')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'serie')
      .style('stroke', (d, i) => colorScale(i));

    series
      .append('path')
      .attr('class', 'layer')
      .attr('d', this.areaGenerator)
      .style('fill', (d, i) => colorScale(i));

    series
      .attr('opacity', 1)
      .on('mousedown.user', events.down)
      .on('mouseup.user', events.up)
      .on('mouseleave.user', events.leave)
      .on('mouseover.user', events.over)
      .on('click.user', events.click);

  }


  render(svg, config) {
    //Do nothing, since lines render only when new data is received.
  }
}