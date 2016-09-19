
class Areaset {
  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }

  update(svg, config, data) {
    var dataSeries = d3.nest()
        .key((d) => d.key)
        .entries(data);

    var colorScale = config.colorScale
        , height = config.height
        , areaOpacity = config.areaOpacity
        , series = null;

    var areaGenerator = d3.area()
        .x((d) => this.xAxis.scale()(d.x))
        .y0(height)
        .y1((d) => this.yAxis.scale()(d.y));

    series = svg.selectAll('g.serie');

    series
        .insert('path', ':first-child') //if not :first-child, area overlaps markers.
        .attr('class', 'area')
        .data(dataSeries)
        .style('stroke', (d, i) => colorScale(i))
        .style('fill', (d, i) => colorScale(i))
        .style('fill-opacity', areaOpacity)
        .attr('d', (d) => areaGenerator(d.values));
  }

  render(svg, config) {
    //Do nothing, since areas render only when new data is received.
  }
}