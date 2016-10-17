export class Areaset {
  constructor(x, y) {
    this.xAxis = x.xAxis;
    this.yAxis = y.yAxis;
  }

  update(svg, config, data) {
    let dataSeries = d3.nest()
        .key((d) => d.key)
        .entries(data);

    let series = null
        , areas = null
        , area = config.area
        , colorScale = config.colorScale
        , height = config.height
        , areaOpacity = config.areaOpacity;

    let areaGenerator = d3.area()
        .x((d) => this.xAxis.scale()(d.x))
        .y0(height)
        .y1((d) => this.yAxis.scale()(d.y));

    svg.selectAll('g.area').remove();

    series = svg.selectAll('g.area');
    areas = series
        .data(dataSeries, (d) => d.key)
        .enter()
        .append('g')
        .attr('class', 'area')
        .append('svg:path')
        .style('fill', (d, i) => colorScale(i))
        .style('fill-opacity', areaOpacity)
        .attr('d', (d) => areaGenerator(d.values));

    // series
    //     .insert('path', ':first-child') //if not :first-child, area overlaps markers.
    //     .attr('class', 'area')
    //     .data(dataSeries)
    //     .style('stroke', (d, i) => colorScale(i))
    //     .style('fill', (d, i) => colorScale(i))
    //     .style('fill-opacity', areaOpacity)
    //     .attr('d', (d) => areaGenerator(d.values));

    this.svg = svg;
  }

  render(svg, config) {
    //Do nothing, since areas render only when new data is received.
  }
}