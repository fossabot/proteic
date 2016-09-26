export class Pointset {
  constructor(x, y) {
      this.xAxis = x.xAxis;
      this.yAxis = y.yAxis;
  }
  update(svg, config, data) {
      var dataSeries = d3.nest()
          .key((d) => d.key)
          .entries(data);

    var markers = null
      , markerShape = config.markers.shape
      , markerSize = config.markers.size
      , markerOutlineWidth = config.markers.outlineWidth
      , colorScale = config.colorScale
      , events = config.events
      , markers = null
      , points = null
      , series = null;

    svg.selectAll('g.points').remove();

    series = svg.selectAll('g.points');
    switch (markerShape) {
      case 'circle':
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
      .on('mousedown.user', events.down)
      .on('mouseup.user', events.up)
      .on('mouseleave.user', events.leave)
      .on('mouseover.user', events.over)
      .on('click.user', events.click);

    //this.interactiveElements = markers;
  }

  render(svg, config) {
    //Do nothing, since points render only when new data is received.
  }
}