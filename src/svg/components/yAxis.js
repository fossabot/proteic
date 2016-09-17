
class YAxis {
  constructor(yAxisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for XAxis');
    }

    this.yAxis = this._initializeYAxis(yAxisType, config);
  }


  _initializeYAxis(yAxisType, config) {
    var y = null
      , yAxis = null;

    y = d3.scaleLinear().range([config.height, 0]);

    return d3.axisLeft(y)
      .tickSizeInner(-config.width)
      .tickSizeOuter(0)
      .tickPadding(20)
      .tickFormat((d) => d)
      .ticks(config.yticks, config.tickLabel);
  }

  transition(svg, time = 200) {
    svg.selectAll('.y.axis').transition().duration(time).call(this.yAxis).on('end', this.yStyle);

  }

  yStyle() {
    d3.select(this).selectAll('g.tick text')
      .style('font-size', '1.4em')
      .style('fill', (d, i) => !utils.isEven(i) || i === 0 ? '#5e6b70' : '#1a2127')
      .style('font-weight', (d, i) => utils.isEven(i) && i !== 0 ? 'bold' : 'normal')
      .style('font-size', '1.4em');

    d3.select(this).selectAll('g.tick line')
      .style('stroke', (d, i) => utils.isEven(i) && i !== 0 ? '#5e6b70' : '#dbdad8');
  }

  /**
   * This function is used when both x and y axis update their domains by x and y max/min values, respectively. 
   */
  updateDomainByBBox(b) {
    var y = this.yAxis.scale();
    y.domain([b[0], b[1]]);
  }

  render(svg, config) {
    var yAxis = this.yAxis
      , yAxisLabel = config.yAxisLabel
      , width = config.width
      , height = config.height
      , margin = config.margin;

    svg
      .append('g')
      .attr('class', 'y axis')
      .attr('stroke-dasharray', '1, 5')
      .call(yAxis)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'tickLabel')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left / 1.3)
      .text(yAxisLabel);
  }
}