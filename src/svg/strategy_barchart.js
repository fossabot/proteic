class SvgBarchartStrategy extends SvgChart {

  constructor(chartContext) {
    super(chartContext);
    //Create range function
    this.xAxisName = 'x';
    this.yAxisName = 'y';
    this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], .1);
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

    this.colors = Colors.scaleCategory1();
    this.keyFunction = ((d) => d.x);
  }

	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    var bars = null;
    var max = Number.MIN_VALUE;

    super.draw(data);

    //Re-scale axis
    this.x.domain(data.map(this.keyFunction));
    max = d3.max(data, (d) => d[this.yAxisName]);
    this.y.domain([0, max]);

    //Create a transition effect for axis rescaling
    this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
    this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);

    //Bind data
    bars = this.svg.selectAll('.bar').data(data, this.keyFunction);
    //For new data, add bars and events   
    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('height', (d) => this.height - this.y(d[this.yAxisName]))
      .attr('fill', (d, i) => this.colors(i))
      //namespaces let us to provide more than one functon for the same event
      .on('mousedown.user', this.events.down)
      .on('mouseup.user', this.events.up)
      .on('mouseleave.user', this.events.leave)
      .on('mouseover.user', this.events.over)
      .on('click.user', this.events.click);

    this.interactiveElements = bars;
    
    bars.exit()
      .transition()
      .duration(300)
      .attr('y', this.y(0))
      .attr('height', this.height - this.y(0))
      .style('fill-opacity', 1e-6)
      .style()
      .remove();

    bars
      .transition()
      .duration(300)
      .attr('x', (d) => this.x(d[this.xAxisName]))
      .attr('width', this.x.rangeBand())
      .attr('y', (d) => this.y(d[this.yAxisName]))
      .attr('height', (d) => (this.height - this.y(d[this.yAxisName])));

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

    //Initialize SVG
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

    //Just for testing purposes
    return this;
  }
}
