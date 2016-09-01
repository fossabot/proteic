class SvgStreamgraphStrategy extends SvgChart {

    constructor(chartContext) {
        super(chartContext);
        this.x = d3.scaleTime().range([0, this.width]);

        this.y = d3.scaleLinear().range([this.height - 10, 0]);
        this.z = this.colorScale;

        this.xAxis = d3.axisBottom(this.x)
            .ticks(d3.timeDay, 1)
            .tickFormat(d3.timeFormat("%m/%d/%y"));

        this.yAxis = d3.axisLeft(this.y)
            .tickSizeInner(-this.width)
            .tickSizeOuter(0)
            .tickPadding(20)
            .ticks(this.ticks, this.tickLabel)
            .tickFormat((d) => d);

        this.keys = null;
    }

	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
    draw(data) {
        var stack = null;

        //Initialize data
        if (!this._initialized) {
            this._initialize();
        }

        stack = d3.stack()
            .keys(data.keys)
            .order(d3.stackOrderAscending)
            .offset(d3.stackOffsetNone);

        data.values.forEach((d) => {
            d.date = d3.timeParse(this.xDateformat)(d.date);
        });

        var dataSeries = stack(data.values);

        this.x.domain(d3.extent(data.values, (d) => d.date));
        this.y.domain([0, d3.max(data.values, (d) => (d.total))]);


        var area = d3.area()
            .curve(d3.curveCardinal)
            .x((d) => this.x(d.data.date))
            .y0((d) => this.y(d[0]))
            .y1((d) => this.y(d[1]))

        var series = this.svg.selectAll('.series')
            .data(dataSeries)
            .enter()
            .append('g')
            .attr('class', 'series')
            .style('stroke', (d, i) => this.colorScale(i));

        series
            .append('path')
            .attr('class', 'layer')
            .attr('d', area)
            .style('fill', (d,i) => this.z(i));

        series
            .attr('opacity', 1)
            .on('mousedown.user', this.events.down)
            .on('mouseup.user', this.events.up)
            .on('mouseleave.user', this.events.leave)
            .on('mouseover.user', this.events.over)
            .on('click.user', this.events.click);


        this._updateAxis();
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