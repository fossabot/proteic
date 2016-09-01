class SvgBarchartStrategy extends SvgChart {

  constructor(chartContext) {
    super(chartContext);
    //Create range function
    this.xAxisName = 'x';
    this.yAxisName = 'y';
    this.x = d3.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1)
      .align(0.5);

    this.y = d3.scaleLinear().rangeRound([this.height, 0]);

    this.isStacked = false;

    this.xAxis = d3.axisBottom(this.x)
      .ticks(10);

    this.yAxis = d3.axisLeft(this.y)
      .tickFormat(d3.format(','))
      .tickSizeInner(-this.width)
      .tickSizeOuter(0)
      .tickPadding(20)
      .ticks(this.ticks, this.tickLabel);

    this.keyFunction = ((d) => d.x);
  }

	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    super.draw(data);

    var c = [];
    for (var d of data) {
      c = c.concat(d3.keys(d).filter((k) => k !== 'key' && k !== 'total'));
    }
    var categories = Array.from(new Set(c));

    var stack = d3.stack();
    var series = stack.keys(categories)(data);

    if (this.stacked) {
      this.x.domain(data.map((d) => d.key));
      this.y.domain([0, d3.max(data, (d) => d.total)]).nice();

      var layer = this.svg.selectAll('.layer')
        .data(series);
      // .attr('class', 'layer')
      // .attr('fill', (d, i) => this.colorScale(i));

      var layerEnter = layer.enter().append('g');
      // .attr('class', 'layer')
      // .attr('fill', (d, i) => this.colorScale(i));

      var layerMerge = layer.merge(layerEnter)
        .attr('class', 'layer')
        .attr('fill', (d, i) => this.colorScale(i));

      this._bar = layerMerge.selectAll('rect')
        .data((d) => d);

      var barEnter = this._bar.enter().append('rect');

      var barMerge = this._bar.merge(barEnter)
        .attr("x", (d) => this.x(d.data.key))
        .attr("y", (d) => this.y(d[1]))
        .attr("height", (d) => this.y(d[0]) - this.y(d[1]))
        .attr("width", this.x.bandwidth());
    }
    else {
      this.x.domain(data.map((d) => d.key));
      
      //Calculate max value
      this.y.domain([0, d3.max(data, function(o){
        var numbers = [];
        for (let k in o) {
          if (o.hasOwnProperty(k) && k !== 'total' && k !== 'key') {
            numbers.push(o[k]);
          }
        }
        return d3.max(numbers);
      })]).nice();

      var layer = this.svg.selectAll('.layer')
        .data(series);
      // .attr('class', 'layer')
      // .attr('fill', (d, i) => this.colorScale(i));

      var layerEnter = layer.enter().append('g');
      // .attr('class', 'layer')
      // .attr('fill', (d, i) => this.colorScale(i));

      var layerMerge = layer.merge(layerEnter)
        .attr('class', 'layer')
        .attr('fill', (d, i) => this.colorScale(i));

      this._bar = layerMerge.selectAll('rect')
        .data((d) => d);

      var barEnter = this._bar.enter().append('rect');
      
      var context = this;

      var n  = series.length;
      var context = this;
      var barMerge = this._bar.merge(barEnter)
       // .attr("x", (d, i, j) => this.x(d.data.key) + this.x.bandwidth() / n * j)
        .attr("x", function(d, i, j){
         console.log(d);
          return ( context.x(d.data.key) + context.x.bandwidth() / (n*j.length) );     
          //return context.x(d.data.key) + context.x.bandwidth() / n * index;
        })

        .attr("y", (d) => this.y(d[1]))
        .attr("height", (d) => this.y(d[0]) - this.y(d[1]))
        .attr("width", this.x.bandwidth() / n);

        //.attr("width", this.x.bandwidth() / n);
                
        /**
         * 
         * svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.salesperson); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.sales); })
      .attr("height", function(d) { return height - y(d.sales); });
         * 
         * 
         * 
         */
    }

    this._updateAxis();
    this._applyCSS();
  }

  _transition2Stacked() {
    var yStackMax = d3.max(this.layers, (layer) => d3.max(layer, (d) => d.y0 + d.y));

    console.log('yStackMax', yStackMax);
    var n = this.layers.length;

    this.y.domain([0, yStackMax]);

    this._bars.transition()
      .duration(200)
      .attr('y', (d) => this.y(d.y0 + d.y))
      .attr('height', (d) => this.y(d.y0) - this.y(d.y0 + d.y))
      .transition()
      .attr('x', (d) => this.x(d.x))
      .attr('width', this.x.rangeBand())
      .call(this._endAllTransitions, () => this._barTransitionEnd(this._bars));

    this._updateYaxis();
    this._applyCSS();
  }

  _transition2Grouped() {
    var yGroupMax = d3.max(this.layers, (layer) => d3.max(layer, (d) => d.y));
    var n = this.layers.length;

    this.y.domain([0, yGroupMax]);

    this._bars.transition()
      .duration(200)
      .attr('x', (d, i, j) => this.x(d.x) + this.x.rangeBand() / n * j)
      .attr('width', this.x.rangeBand() / n)
      .transition()
      .attr('y', (d) => this.y(d.y))
      .attr('height', (d) => this.height - this.y(d.y))
      .call(this._endAllTransitions, () => this._barTransitionEnd(this._bars));

    this._updateYaxis();
    this._applyCSS();
  }

  /**
   * This function is fired when all transitions ends.
   * To avoid errors, this function add d3 listener (instead of adding before transitions ends).
   */
  _barTransitionEnd(bars) {
    bars.on('mousedown.user', this.events.down)
      .on('mouseup.user', this.events.up)
      .on('mouseleave.user', this.events.leave)
      .on('mouseover.user', this.events.over)
      .on('click.user', this.events.click);

    // Add tooltips to the bars
    if (this.tooltip) {
      bars.on('mouseover.tip', this.tooltip.show)
        .on('mouseout.tip', this.tooltip.hide);
    }
  }


  _initialize() {
    var transition = null;
    super._initialize();
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
    this.stacked = typeof (config.stacked) === 'undefined' ? _default[this.constructor.name].stacked : config.stacked;

    //Just for testing purposes
    return this;
  }
}