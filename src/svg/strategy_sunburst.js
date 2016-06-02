class SvgSunburstStrategy extends SvgChart {

  constructor(chartContext) {
    super(chartContext);
  }

	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    if (!this._initialized) {
      this._initialize();
    }
    // Remove all the paths before redrawing
    this._removePaths();

    // Create layout partition
    var partition = d3.layout.partition()
      .value((d) =>  d.value);

    // Create arc generators
    this.arcGen = d3.svg.arc()
      .startAngle((d) =>  Math.max(0, Math.min(2 * Math.PI, this.x(d.x))))
      .endAngle((d) =>  Math.max(0, Math.min(2 * Math.PI, this.x(d.x + d.dx))))
      .innerRadius((d) =>  Math.max(0, this.y(d.y)))
      .outerRadius((d) =>  Math.max(0, this.y(d.y + d.dy)));

    // Draw the paths (arcs)
    var paths = this.svg.selectAll('path')
      .data(partition.nodes(data))
      .enter().append('path')
      .attr('d', this.arcGen)
      .style('fill', (d) => this.colorScale((d.children ? d : d.parent).name))
      .on('click', (d) => this._zoom(d))
      .append('title')
      .text((d) => d.name + '\n' + d.value);

    d3.select(self.frameElement).style('height', this.height + 'px');

    this._applyCSS();
  }

  /**
   * Zooms into the clicked arc.
   * From: https://bl.ocks.org/mbostock/4348373
   * @param d Current arc data
   * @private
   */
  _zoom(d) {
    this.svg
      .transition()
      .duration(750)
      .tween('scale', () => {
        var xd = d3.interpolate(this.x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(this.y.domain(), [d.y, 1]),
          yr = d3.interpolate(this.y.range(), [d.y ? 20 : 0, this.radius]);
        return (t) => {
          this.x.domain(xd(t));
          this.y.domain(yd(t)).range(yr(t));
        };
      })
      .selectAll('path')
      .attrTween('d', (d) => () => this.arcGen(d) );
  }

  /**
   * Removes all the paths (arcs). Doing this before each redraw prevents the
   * transition to mess up the arcs.
   * @private
   */
  _removePaths() {
    this.svg.selectAll('path').remove();
  }

  _initialize() {
    // super._initialize();

    var width = this.width + this.margin.left + this.margin.right;
    var height = this.height + this.margin.left + this.margin.right;
    this.radius = (Math.min(width, height) / 2) - 10; // TODO 10 = margin

    // Create scales
    this.x = d3.scale.linear()
      .range([0, 2 * Math.PI]);
    this.y = d3.scale.sqrt()
      .range([0, this.radius]);

    //Create a global 'g' (group) element
    this.svg = d3
      .select(this.selector).append('svg')
      .attr({ width, height })
      .append('g')
      .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");


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