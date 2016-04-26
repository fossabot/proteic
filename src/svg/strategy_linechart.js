class SvgLinechartStrategy extends SvgChart {
  constructor(data, config, cType) {
    super(data, config, cType);
    //Create range function
    this.xAxisName = 'x';
    this.yAxisName = 'y';

    this.x = d3.scale.linear().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);

    var width = this.width - this.margin.left - this.margin.right;
    var height = this.height - this.margin.top - this.margin.bottom;

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

    this.colors = d3.scale.category20();

    this.keyFunction = ((d) => d.x);
  }

	/**
	 * Renders a linechart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    super.draw(data);
    //Re-scale axis
    // this.x.domain([0, d3.max(data, function (d) { return d.x; })]);
    this.x.domain([d3.min(data, (d) => d.x), d3.max(data, (d) => d.x)]);
    this.y.domain([0, d3.max(data, (d) => d.y)]);

    //Create a transition effect for axis rescaling
    this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
    this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);

    // Bind data
    var x = this.x
    var y = this.y
    var line = d3.svg.line()
      .x(function (d) { return x(d.x); })
      .y(function (d) { return y(d.y) });

    // Create path and bind data to it
    var path = this.svg.select('path')
      .datum(data, this.keyFunction)
      .attr('d', line);

    // Append markers to line
    if (this.markers) {
      switch (this.markers.shape) {
        case 'circle':
          var markers = this.svg.selectAll('circle').data(data, this.keyFunction);
          // markers.remove();
          markers.enter().append('circle')
            .attr('cx', function (d) { return x(d.x); })
            .attr('cy', function (d) { return y(d.y); })
            .attr('r', this.markers.size)
            .style({
              'fill': this.markers.color,
              'stroke': this.markers.outlineColor,
              'stroke-width': this.markers.outlineWidth
            });

          markers
            .transition()
            .attr('cx', function (d) { return x(d.x); })
            .attr('cy', function (d) { return y(d.y); })
            .duration(0);
          break;
      }
    }

    // Add events to the line
    path
      .on('mousedown.user', this.events.down)
      .on('mouseup.user', this.events.up)
      .on('mouseleave.user', this.events.leave)
      .on('mouseover.user', this.events.over)
      .on('click.user', this.events.click);

    this._applyCSS();
  }


  _initialize() {
    var width = this.width + this.margin.left + this.margin.right;
    var height = this.height + this.margin.left + this.margin.right;

    //Create a global 'g' (group) element
    this.svg = d3
      .select(this.selector).append('svg')
      .attr({ 'width': width, 'height': height })
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // Append the line path
    this.svg.append('path');

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
    this._initialized = true;
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {
    config = config || { events: {} };
    if (!config.events) {
      config.events = {};
    }
    super._loadConfigOnContext(config);
    this.markers = config.markers || _default.Linechart.markers;
    return this;
  }
  
}