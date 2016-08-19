class SvgBarchartStrategy extends SvgChart {

  constructor(chartContext) {
    super(chartContext);
    //Create range function
    this.xAxisName = 'x';
    this.yAxisName = 'y';
    // this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], 0.1);
    this.x = d3.scaleBand()
        .rangeRound([0, this.width])
        .padding(0.1)
        .align(0.5);
    // this.y = d3.scale.linear().range([this.height, 0]);
    this.y = d3.scaleLinear().rangeRound([this.height, 0]);

    this.isStacked = false;

    //Create axes
    // this.xAxis = d3.svg.axis()
    //   .scale(this.x)
    //   .orient('bottom')
    //   .ticks(10);
    this.xAxis = d3.axisBottom(this.x)
        .ticks(10);

    // this.yAxis = d3.svg.axis()
    //   .scale(this.y)
    //   .orient('left')
    //   .innerTickSize(-this.width)
    //   .outerTickSize(0)
    //   .tickPadding(20)
    //   .ticks(this.ticks, this.tickLabel);
    this.yAxis = d3.axisLeft(this.y)
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

      // data.sort((a, b) => b.total - a.total);
      // d3.keys(data[0]).filter(function(key) { return key !== "State"; });
    // this.values = data.map((d) => d.values);
    // this.layers = this.stack(this.values);
    //   var categories = data.map((d) => d.key);

      // TODO IM
      // var categories = d3.keys(data[0]).filter((k) => k !== 'key' && k !== 'total');
      var c = [];
      for(var d of data) {
        c = c.concat(d3.keys(d).filter((k) => k !== 'key' && k !== 'total'));
      }
      var categories = Array.from(new Set(c));

      console.log(categories);

      var stack = d3.stack();
      var series = stack.keys(categories)(data);
    //
    // this.x.domain(this.layers[0].map((d) => d[this.xAxisName]));
    //
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

      console.log(barMerge);

    // var layer = this.svg
    //   .selectAll('.layer')
    //   .data(this.layers);
    //
    // layer.enter()
    //   .append('g')
    //   .attr('class', 'layer')
    //   .style('fill', (d, i) => this.colorScale(i));
    //
    // layer.exit().remove();
    //
    //

    // this._bars = layer
    //   .selectAll('rect')
    //   .data((d) => d);
    //
    // this._bars
    //   .enter()
    //   .append('rect')
    //   .attr('x', (d) => this.x(d.x))
    //   .attr('y', (d) => this.y(d.y + d.y0))
    //   .attr('height', (d) => this.y(d.y0) - this.y(d.y + d.y0))
    //   .attr('width', this.x.rangeBand() - 1);
    //
    // this._bars
    //   .exit()
    //   .transition()
    //   .duration(300)
    //   .attr('y', this.y(0))
    //   .attr('height', this.height - this.y(0))
    //   .style('fill-opacity', 1e-6)
    //   .style()
    //   .remove();
    //
    //
    // if (this.isStacked) {
    //   this._transition2Stacked();
    // } else {
    //   this._transition2Grouped();
    // }
    //
    this._updateAxis();
    //
    // this.interactiveElements = this._bars;
    this._applyCSS();
    //
    // // Check overlapping axis labels
    // var labelsWidth = 0;
    // this.svg.selectAll('.x.axis g.tick text')
    //   .each(function () {
    //     labelsWidth += this.getBBox().width;
    //   });
    // if (labelsWidth > this.width) {
    //   this.xticks = null;
    //   this.xAxis.ticks(this.xticks);
    //   this.svg.selectAll("g.x.axis")
    //     .call(this.xAxis);
    // }
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
    // this.svg[0][0].addEventListener('transition', (e) => {
    //   //remove current user events
    //   this._removeUserEvents();
    //
    //   transition = e.detail.type;
    //   if (transition === 'grouped') {
    //     this._transition2Grouped();
    //     this.isStacked = false;
    //
    //   }
    //   else if (transition === 'stacked') {
    //     this._transition2Stacked();
    //     this.isStacked = true;
    //   }
    //   else {
    //     throw Error('Not recognized transition: ' + transition);
    //   }
    // }, false);

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