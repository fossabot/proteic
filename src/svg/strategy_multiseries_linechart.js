class SvgMultiSeriesLinechartStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);
    //Create range function
    this.xAxisName = 'x';
    this.yAxisName = 'y';

    this.x = d3.scale.linear().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);

    //Create scale
    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .ticks(10);

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
          .attr('class', data[series].key)
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

            markers
              .transition()
              .attr('cx', (d) => this.x(d.x))
              .attr('cy', (d) => this.y(d.y))
              .duration(0);

            break;
          default:
            throw Error('Not a valid marker shape: ' + this.markers.shape);
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
      }

      this.interactiveElements = markers;
    }
    
    this._applyCSS();
  }


  _initialize() {
    var width = this.width + this.margin.left + this.margin.right;
    var height = this.height + this.margin.left + this.margin.right;

    //Create a global 'g' (group) element
    this.svg = d3
      .select(this.selector).append('svg')
      .attr({ width, height })
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    //Create tooltip (d3-tip)
    if (this.tip) {
      this.tooltip = d3.tip()
        .attr('class', 'd3-tip')
        .style({
          'line-height': 1,
          'padding': '12px',
          'background': 'rgba(0, 0, 0, 0.8)',
          'color': '#fff',
          'border-radius': '2px',
          'pointer-events': 'none'
        })
        .html(this.tip);
      this.svg.call(this.tooltip);
    }

    //Append a new group with 'x' aXis
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    //Append a new group with 'y' aXis
    this.svg.append('g')
      .attr('class', 'y axis')
      .attr('stroke-dasharray', '5, 5')
      .call(this.yAxis)
      .append('text');

    // Append axes labels
    this.svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'xaxis-label')
      .attr('x', this.width / 2)
      .attr('y', this.height + this.margin.bottom)
      .text(this.xAxisLabel);
    this.svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'yaxis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', - this.height / 2)
      .attr('y', - this.margin.left / 1.3)
      .text(this.yAxisLabel);

    //Initialize SVG
    this._initialized = true;
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {
    super._loadConfigOnContext(config);

    if (_default.MultiSeriesLinechart.markers) {
      config.markers = {};
      this.markers = {};
      this.markers.color = config.markers.color || _default.MultiSeriesLinechart.markers.color;
      this.markers.outlineColor = config.markers.outlineColor || _default.MultiSeriesLinechart.markers.outlineColor;
      this.markers.outlineWidth = config.markers.outlineWidth || _default.MultiSeriesLinechart.markers.outlineWidth;
      this.markers.shape = config.markers.shape || _default.MultiSeriesLinechart.markers.shape;
      this.markers.size = config.markers.size || _default.MultiSeriesLinechart.markers.size;
    }

    //Just for testing purposes
    return this;
  }

}