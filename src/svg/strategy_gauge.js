class SvgGaugeStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);


    // TODO extract to config
    this.minLevel = 0;
    this.maxLevel = 100;
    this.minAngle = -90;
    this.maxAngle = 90;
    this.needleLenghtRatio = 0.8;
    this.majorTicks = 5; // TODO this.ticks
    this.ringWidth = 50;
    this.ringMargin = 20;
    this.labelInset = 10;
    this.needleNutRadius = 25;

    //Create scale
    this.scale = d3.scale
      .linear()
      .range([0, 1])
      .domain([this.minLevel, this.maxLevel]);

    this.angleScale = d3.scale
      .linear()
      .range([0, 180])
      .domain([this.minLevel, this.maxLevel]);

    this.scaleMarks = this.scale.ticks(this.majorTicks);
    this.tickData = d3.range(this.majorTicks)
      .map(() => 1 / this.majorTicks);

    this.keyFunction = ((d) => d.x);
    this.translation = (() => 'translate(' + this.r + ',' + this.r + ')');

  }

	/**
	 * Renders a linechart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    super.draw(data);

    this.datum = data[data.length - 1];

    // console.log(data[data.length - 1].x);

    var needleLen = this.needleLenghtRatio * (this.r);

    // this.needle.remove();

    // Append needle
    if (!this.needle) {
      this.needle = this.svg.append('path')
        .attr('class', 'needle')
        .datum(this.datum.x)
        .attr('transform', (d) => `translate(${this.r}, ${this.r}) rotate(${this.angleScale(d) - 90})`)
        .attr('d', `M ${0 - this.needleNutRadius} ${0} L ${0} ${0 - needleLen} L ${this.needleNutRadius} ${0}`)
        .attr('fill', 'indigo');
    }

    this.needle
      .transition()
      .attr('transform', (d) => `translate(${this.r}, ${this.r}) rotate(${this.angleScale(this.datum.x) - 90})`)
      .attr('d', `M ${0 - this.needleNutRadius} ${0} L ${0} ${0 - needleLen} L ${this.needleNutRadius} ${0}`)
      .attr('fill', 'indigo');

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

    this.range = this.maxAngle - this.minAngle;
    this.r = this.width / 2;
    this.needleLength = Math.round(this.r * this.needleLenghtRatio);

    this.arc = d3.svg.arc()
      .innerRadius(this.r - this.ringWidth - this.ringMargin)
      .outerRadius(this.r - this.ringMargin)
      .startAngle((d, i) => {
        var ratio = d * i;
        return utils.deg2rad(this.minAngle + (ratio * this.range));
      })
      .endAngle((d, i) => {
        var ratio = d * (i+1);
        return utils.deg2rad(this.minAngle + (ratio * this.range));
      });

    // Append the ring
    var arcs = this.svg.append('g')
      .attr('class', 'arc')
      .attr('transform', this.translation);

    // Append the ring sectors
    arcs.selectAll('path')
      .data(this.tickData)
      .enter().append('path')
    // ID for textPath linking
      .attr('id', (d, i) => 'sector-' + i)
      .attr('fill', (d, i) => this.colorScale(d * i * 5))
      .attr('d', this.arc);

    // Apend the scale labels
    var labels = this.svg.append('g')
      .attr('class', 'labels')
      .attr('transform', this.translation);

    // Append scale marker labels
    labels.selectAll('text')
      .data(this.scaleMarks)
      .enter().append('text')
      .attr('transform', (d) => {
        var ratio = this.scale(d);
        var newAngle = this.minAngle + (ratio * this.range);
        return 'rotate(' + newAngle +') translate(0,' +(this.labelInset - this.r) +')';
      })
      .text((d) => d);

    // Append needle nut
    this.svg.append('circle')
      .attr('class', 'needle-nut')
      .attr('transform', this.translation)
      .attr('fill', 'indigo')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.needleNutRadius);

    this.svg.append('g')
      .attr('class', 'needle');

    //Initialize SVG
    this._initialized = true;
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {
    super._loadConfigOnContext(config);


    //Just for testing purposes
    return this;
  }

}