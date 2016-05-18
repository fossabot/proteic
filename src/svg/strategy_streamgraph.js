class SvgStreamgraphStrategy extends SvgChart {

    constructor(chartContext) {
        super(chartContext);
        this.x = d3.time.scale().range([0, this.width]);
        this.y = d3.scale.linear().range([this.height - 10, 0]);

        this.format = d3.time.format(this.xDateformat);
        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient('bottom')
            .ticks(d3.time.weeks);

        this.yAxis = d3.svg.axis().scale(this.y).orient('left')
      .innerTickSize(-this.width)
      .outerTickSize(0)
      .tickPadding(20)
      .ticks(this.ticks, this.tickLabel);
    }

	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
    draw(data) {
        var dataLayered = null; //streamgraph layers
        var nColors = null; //number of colors = different keys

        //Initialize data
        if (!this._initialized) {
            this._initialize();
        }
        //Force x axis to be a date and y-axis to be a number
        data.forEach((d) => {
            d.date = this.format.parse(d.date);
            d.value = +d.value;
        });
        this.stack = d3.layout.stack()
            .offset('silhouette')
            .values((d) => d.values)
            .x((d) => d.date)
            .y((d) => d.value);

        this.nest = d3.nest()
            .key((d) => d.key);

        this.area = d3.svg.area()
            .interpolate('cardinal')
            .x((d) => this.x(d.date))
            .y0((d) => this.y(d.y0))
            .y1((d) => this.y(d.y0 + d.y));

        dataLayered = this.stack(this.nest.entries(data));
        

        this.x.domain(d3.extent(data, (d) => d.date));
        this.y.domain([0, d3.max(data, (d) => (d.y0 + d.y))]);

        nColors = utils.getNumberOfDifferentArrayKeys(data, 'key');


        this.z = this.colorScale;
        
        this._layers = this.svg
            .selectAll('.layer')
            .data(dataLayered);

        this._layers
            .enter()
            .append('path')
            .attr('class', 'layer')
            .attr('d', (d) => this.area(d.values))
            .style('fill', (d, i) => this.z(i));
            
        this._layers
            .exit()
            .remove();

        this.svg.selectAll('.layer')
            .attr('opacity', 1)
            .on('mousedown.user', this.events.down)
            .on('mouseup.user', this.events.up)
            .on('mouseleave.user', this.events.leave)
            .on('mouseover.user', this.events.over)
            .on('click.user', this.events.click);
        
        this._updateAxis();

        this.interactiveElements = this._layers;
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
        config = config || { events: {} };
        if (!config.events) {
            config.events = {};
        }
        super._loadConfigOnContext(config);
        this.colorScale = config.colorScale || _default.Streamgraph.colorScale;
        this.xDateformat = config.xDateFormat || _default.Streamgraph.xDateFormat;
    }
}