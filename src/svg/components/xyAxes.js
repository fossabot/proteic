class XYAxes {
  constructor(xAxisType, yAxisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for XAxis');
    }

    this.xAxis = this._initializeXAxis(xAxisType, config);
    this.yAxis = this._initializeYAxis(yAxisType, config);
  }


  _initializeXAxis(xAxisType = 'linear', config) {
    var x = null
      , xAxis = null;

    switch (xAxisType) {
      case 'time':
        x = d3.scaleTime().range([0, config.width]);
        xAxis = d3.axisBottom(x).ticks(config.xticks);
        break;
      case 'linear':
        x = d3.scaleLinear().range([0, config.width]);
        xAxis = d3.axisBottom(x).ticks(config.xticks);
        break;
      default:
        throw new Error('Not allowed type for XAxis. Only allowed "time" or "linear". Got: ' + type);
    }
    return xAxis;
  }

  _initializeYAxis(yAxisType, config) {
    var y = null
      , yAxis = null;

    y = d3.scaleLinear().range([config.height, 0]);

    yAxis = d3.axisLeft(y)
      .tickSizeInner(-config.width)
      .tickSizeOuter(0)
      .tickPadding(20)
      .tickFormat((d) => d)
      .ticks(config.yticks, config.tickLabel);

    return yAxis;
  }

  transition(svg, time = 200) {
    svg.select('.x.axis').transition().duration(time).call(this.xAxis).on('end', this.xStyle);
    svg.select('.y.axis').transition().duration(time).call(this.yAxis).on('end', this.yStyle);
  }

  xStyle() {
    d3.select(this).selectAll('g.tick text')
      //.style('font-weight', 'bold')
      .style('font-size', '1.4em')
      .style('fill', (d, i) => '#1a2127');

    d3.select(this).selectAll(['path', 'line'])
      .attr('stroke', 'gray')
      .attr('stroke-width', .3);
  }

  yStyle() {
    d3.select(this).selectAll('g.tick text')
      .style('font-weight', (d, i) => utils.isEven(i) && i !== 0 ? 'bold' : 'normal')
      .style('fill', (d, i) => !utils.isEven(i) || i === 0 ? '#5e6b70' : '#1a2127')
      .style('font-size', '1.4em');

    d3.select(this).selectAll('g.tick line')
      .style('stroke', (d, i) => utils.isEven(i) && i !== 0 ? '#5e6b70' : '#dbdad8');
  }

  updateDomain(data) {
    var x = this.xAxis.scale()
      , y = this.yAxis.scale();

    var minX = d3.min(data, (d) => d.x);
    var maxX = d3.max(data, (d) => d.x);
    var minY = d3.min(data, (d) => d.y);
    var maxY = d3.max(data, (d) => d.y);

    x.domain([minX, maxX]);
    y.domain([minY, maxY]);
  }


  render(svg, config) {
    var yAxis = this.yAxis
      , xAxis = this.xAxis;
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + config.height + ')')
      .call(xAxis);
    svg
      .append('g')
      .attr('class', 'y axis')
      .attr('stroke-dasharray', '1, 5')
      .call(yAxis)
      .append('text');
  }
}