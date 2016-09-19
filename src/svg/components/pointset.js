
class Pointset {
  constructor(xAxis, yAxis) {
      this.xAxis = xAxis;
      this.yAxis = yAxis;
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
      , markers = null;

    switch (markerShape) {
      case 'circle':
      default:
        svg.selectAll('g.serie')
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

    markers = svg.selectAll('g.serie circle');
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