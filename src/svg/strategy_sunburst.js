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
    var partition = d3.partition();
    var root = d3.hierarchy(data).sum((d) =>  d.value);
    partition(root);

    // Create arc generator
    this.arcGen = d3.arc()
      .startAngle((d) => Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))))
      .endAngle((d) => Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))))
      .innerRadius((d) => Math.max(0, this.y(d.y0)))
      .outerRadius((d) => Math.max(0, this.y(d.y1)));

    // Draw the paths (arcs)
    let paths = this.svg.selectAll('path')
      .data(root.descendants())
      .enter().append('path')
      .attr('d', this.arcGen)
      .style('fill', (d) => {
        if (!d.parent) {
          return 'white';
        } else {
          return this.colorScale(d.data.name);
        }
      });

    // Create infobox
    let infobox = this.svg
      .append('g')
      .attr('class', 'infobox')
      .attr('pointer-events', 'none');
    // Append central circle
    infobox.append('text')
      .attr('class', 'name')
      .attr('x', 0)
      .attr('y', 0)
      .attr('pointer-events', 'none');
    infobox.append('text')
      .attr('class', 'value')
      .attr('x', 0)
      .attr('y', 0)
      .attr('pointer-events', 'none');

    paths
      .on('mouseover', (d) => {
        let ancestors = this._getAncestors(d);
        // Fade all the arcs
        if (ancestors.length > 0) {
          d3.selectAll('path')
              .style('opacity', 0.3);
        }
        d3.selectAll('path')
          .filter((node) => ancestors.indexOf(node) >= 0)
          .style('opacity', 1);
        // Hightlight the hovered arc
          this.svg.select('.infobox .name').text(d.data.name);
          this.svg.select('.infobox .value').text(d.value);
      })
      .on('mouseout', (d) => {
        d3.selectAll('path').style('opacity', 1);
        d3.select('.infobox .name').style('font-weight', 'normal');
        d3.select('.infobox .name').text('');
        d3.select('.infobox .value').text('');
      });

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
      .duration(450)
      .tween('scale', () => {
        let xd = d3.interpolate(this.x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(this.y.domain(), [d.y, 1]),
          yr = d3.interpolate(this.y.range(), [d.y ? 30 : 0, this.radius]);
        return (t) => {
          this.x.domain(xd(t));
          this.y.domain(yd(t)).range(yr(t));
        };
      })
      .selectAll('path')
      .attrTween('d', (d) => () => this.arcGen(d) );
  }

  /**
   * From: http://bl.ocks.org/kerryrodden/7090426
   * @param node
   * @returns {Array}
   * @private
   */
  _getAncestors(node) {
    let path = [];
    let current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
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

    let width = this.width + this.margin.left + this.margin.right;
    let height = this.height + this.margin.left + this.margin.right;
    this.radius = (Math.min(width, height) / 2) - 10; // TODO 10 = margin

    // Create scales
    this.x = d3.scaleLinear()
      .range([0, 2 * Math.PI]);
    this.y = d3.scaleSqrt()
      .range([0, this.radius]);

    // Create a global 'g' (group) element
    this.svg = d3
      .select(this.selector)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + (height / 2) + ')');

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