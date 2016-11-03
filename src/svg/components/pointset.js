import {nest} from 'd3';

export class Pointset {
  constructor(x, y) {
    this.xAxis = x.xAxis;
    this.yAxis = y.yAxis;
  }
  update(svg, config, data) {
    let dataSeries = nest()
      .key((d) => d.key)
      .entries(data),
      markers = null,
      markerShape = config.markerShape,
      markerSize = config.markerSize,
      markerOutlineWidth = config.markerOutlineWidth,
      colorScale = config.colorScale,
      points = null,
      series = null;

    svg.selectAll('g.points').remove();

    series = svg.selectAll('g.points');

    switch (markerShape) {
      case 'dot':
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('fill', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.xAxis.scale()(d.x))
          .attr('cy', (d) => this.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'marker');
        break;
      case 'ring':
        window.console.warn('Deprecated "circle" marker shape: use "dot" or "ring" instead');
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('stroke', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d, i) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.xAxis.scale()(d.x))
          .attr('cy', (d) => this.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'marker')
          .style('fill', 'white')
          .style('stroke-width', markerOutlineWidth);
        break;
      // Deprecated circle option
      case 'circle':
        window.console.warn('Deprecated "circle" marker shape: use "dot" or "ring" instead');
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('stroke', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d, i) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.xAxis.scale()(d.x))
          .attr('cy', (d) => this.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'lineMarker')
          .style('fill', 'white')
          .style('stroke-width', markerOutlineWidth);
        break;
      default:
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('stroke', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d, i) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.xAxis.scale()(d.x))
          .attr('cy', (d) => this.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'lineMarker')
          .style('fill', 'white')
          .style('stroke-width', markerOutlineWidth);
    }

    markers = svg.selectAll('g.points circle');
    markers
      .on('mousedown.user', config.onDown)
      .on('mouseup.user', config.onUp)
      .on('mouseleave.user', config.onLeave)
      .on('mouseover.user', config.onHover)
      .on('click.user', config.onClick);

    //this.interactiveElements = markers;
  }

  render(svg, config) {
    //Do nothing, since points render only when new data is received.
  }
}