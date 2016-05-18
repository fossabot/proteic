class SvgLinechartStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);
    //Create range function
    this.xAxisName = 'x';
    this.yAxisName = 'y';

    //Create scales
    switch(this.xDataType) {
      case 'Numeric':
        this.x = d3.scale.linear().range([0, this.width]);
        this.xAxis = d3.svg.axis()
          .scale(this.x)
          .orient('bottom')
          .ticks(5);
        break;
      case 'Date':
        this.x = d3.time.scale().range([0, this.width]);
        this.format = d3.time.format(this.xDateformat);
        this.xAxis = d3.svg.axis()
          .scale(this.x)
          .orient('bottom')
          .ticks(15);
        break;
      default:
        this.x = d3.scale.linear().range([0, this.width]);
        this.xAxis = d3.svg.axis()
          .scale(this.x)
          .orient('bottom')
          .ticks(10);
    }

    this.y = d3.scale.linear().range([this.height, 0]);
    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient('left')
      .innerTickSize(-this.width)
      .outerTickSize(0)
      .tickPadding(20)
      .ticks(this.ticks, this.tickLabel);

    this.keyFunction = ((d) => d.x);
  }

	/**
	 * Renders a linechart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    var line = null;
    var path = null;
    var markers = null;
    super.draw(data);

    if (this.xDataType === 'Date') {
      //Force x axis to be a date and y-axis to be a number
      var format = this.format;
      for (var series in data) {
        data[series].values.forEach((d) => {
          d.x = format.parse(d.x);
          d.y = +d.y;
        });
      }
    }

    //Re-scale axis
    this.x.domain([d3.min(data, (series) => {
      return d3.min(series.values, (d) => d.x);
    }), d3.max(data, (series) => {
      return d3.max(series.values, (d) => d.x);
    })]);
    this.y.domain([0, d3.max(data, (series) => {
      return d3.max(series.values, (d) => d.y);
    })]);

    //Create a transition effect for axis rescaling
    this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
    this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);

    // Bind data
    line = d3.svg.line()
      .x((d) => this.x(d.x))
      .y((d) => this.y(d.y));

    for (var series in data) {
      if (!this.paths) {
        this.svg.append('path')
        // .datum(data[series].values, this.keyFunction)
          .data(data[series].values)
          .style('stroke', this.colorScale(series))
          .attr('class', "line " + data[series].key)
          .attr('d', line(data[series].values));
      }
    }
    this.paths = true;

    for (var series in data) {
      // Create path and bind data to it
      this.svg.select('.' + data[series].key)
        // .datum(data[series].values, this.keyFunction)
        .data(data[series].values)
        .style('stroke', this.colorScale(series))
        .attr('d', line(data[series].values));

      // Append markers to line
      if (this.markers) {
        switch (this.markers.shape) {
          case 'circle':
            markers = this.svg.selectAll('circle').data(data[series].values, this.keyFunction);
            markers
              .enter()
              .append('circle')
              .attr('cx', (d) => this.x(d.x))
              .attr('cy', (d) => this.y(d.y))
              .attr('r', this.markers.size)
              .style({
                'fill': this.markers.color,
                'stroke': this.markers.outlineColor,
                'stroke-width': this.markers.outlineWidth
              });
            markers.exit().remove();
            markers
              .transition()
              .attr('cx', (d) => this.x(d.x))
              .attr('cy', (d) => this.y(d.y))
              .duration(0);
            break;
          default:
            throw Error('Not a valid marker shape: ' + this.markers.shape);
        }
      }

      // Add tooltips to the markers
      if (this.tooltip) {
        markers.on('mouseover.tip', this.tooltip.show)
          .on('mouseout.tip', this.tooltip.hide);
      }

      // Add events to the markers
      markers
        .on('mousedown.user', this.events.down)
        .on('mouseup.user', this.events.up)
        .on('mouseleave.user', this.events.leave)
        .on('mouseover.user', this.events.over)
        .on('click.user', this.events.click);

      this.interactiveElements = markers;
    }

    this._applyCSS();
  }


  _initialize() {

    super._initialize();
    this._initialized = true;
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {
    super._loadConfigOnContext(config);
    this.markers = {};
    this.markers.color = config.markers.color || _default.Linechart.markers.color;
    this.markers.outlineColor = config.markers.outlineColor || _default.Linechart.markers.outlineColor;
    this.markers.outlineWidth = config.markers.outlineWidth || _default.Linechart.markers.outlineWidth;
    this.markers.shape = config.markers.shape || _default.Linechart.markers.shape;
    this.markers.size = config.markers.size || _default.Linechart.markers.size;

    this.xDataType = config.xDataType || _default.Linechart.xDataType;
    this.xDateformat = config.xDateFormat || _default.Linechart.xDateFormat;

    //Just for testing purposes
    return this;
  }

}