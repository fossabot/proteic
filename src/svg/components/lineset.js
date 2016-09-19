
class Lineset {
  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.lineGenerator = d3.line()
      .x((d) => xAxis.scale()(d.x))
      .y((d) => yAxis.scale()(d.y));
  }


  update(svg, config, data) {
    var dataSeries = d3.nest().key((d) => d.key).entries(data);
    var series = null
      , lines = null
      , markers = config.markers
      , area = config.area
      , colorScale = config.colorScale;

    svg.selectAll('g.serie').remove();

    series = svg.selectAll('g.serie');
    lines = series
      .data(dataSeries, (d) => d.key)
      .enter()
      .append('g')
      .attr('class', 'serie')
      .attr('stroke', (d, i) => colorScale(i))
      .append('svg:path')
      .style('stroke', (d, i) => colorScale(i))
      .style('stroke-width', 1.3)
      .style('fill', 'none')
      .attr('d', (d) => this.lineGenerator(d.values))
      .attr('class', 'line');

    if (area) {
      this._includeArea(svg, config, dataSeries);
    }

    this.svg = svg;
  }
  _includeArea(svg, config, dataSeries) {
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
    //Do nothing, since lines render only when new data is received.
  }
}