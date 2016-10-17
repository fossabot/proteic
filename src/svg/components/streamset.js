import {
  timeParse,
  curveCardinal,
  area
} from 'd3';

export class Streamset {
  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;

    this.areaGenerator = area()
      .curve(curveCardinal)
      .x((d) => this.xAxis.scale()((timeParse(this.xDataFormat)(d.data.key)))) // TODO: It seems d3.nest() transform Date object in
      .y0((d) => this.yAxis.scale()(d[0]))
      .y1((d) => this.yAxis.scale()(d[1]))
  }


  update(svg, config, data) {
    let series = null;
    
    //Update date format, used by areaGenerator function due to a problem when nesting with d3.
    this.xDataFormat = config.xAxisFormat;
    
    svg.selectAll('.serie').remove();

    series = svg.selectAll('.serie')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'serie')
      .style('stroke', (d, i) => config.colorScale(i));

    series
      .append('path')
      .attr('class', 'layer')
      .attr('d', this.areaGenerator)
      .style('fill', (d, i) => config.colorScale(i));


    series.exit().remove();
    
    series
      .attr('opacity', 1)
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