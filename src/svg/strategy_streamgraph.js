class SvgStreamgraphStrategy extends SvgChart {

    constructor(data, config, cType) {
        super(data, config, cType);
        this.x = d3.time.scale().range([0, this.width]);
        this.y = d3.scale.linear().range([this.height - 10, 0]);

        this.format = d3.time.format(this.xDateformat);
        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient('bottom')
            .ticks(d3.time.days);

        this.yAxis = d3.svg.axis().scale(this.y);
    }

	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
    draw(data) {
        var layers = null; //streamgraph layers
        var nColors = null; //number of colors = different keys
        var fromColor = this.colorScale.from;
        var toColor = this.colorScale.to;
        var colorrange = null; //color range based on user preferences

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

        layers = this.stack(this.nest.entries(data));

        this.x.domain(d3.extent(data, (d) => d.date));
        this.y.domain([0, d3.max(data, (d) => (d.y0 + d.y))]);

        nColors = utils.getNumberOfDifferentArrayKeys(data, 'key');
        colorrange = chroma.scale([fromColor, toColor]).colors(nColors);

        this.z = d3.scale.ordinal().range(colorrange);

        this.svg.selectAll('.layer')
            .data(layers)
            .enter()
            .append('path')
            .attr('class', 'layer')
            .attr('d', (d) => this.area(d.values))


            .style('fill', (d, i) => this.z(i));

        this.svg.selectAll('.layer')
            .attr('opacity', 1)
            .on('mousedown.user', this.events.down)
            .on('mouseup.user', this.events.up)
            .on('mouseleave.user', this.events.leave)
            .on('mouseover.user', this.events.over)
            .on('click.user', this.events.click);

        var vertical = d3.select(this.selector)
            .append('div')
            .attr('class', 'remove')
            .style('position', 'absolute')
            .style('z-index', '19')
            .style('width', '1px')
            .style('height', '380px')
            .style('top', '10px')
            .style('bottom', '30px')
            .style('left', '0px')
            .style('background', '#000000');

        console.log('drawing');
        this._applyCSS();
    }

    _initialize() {
        var width = this.width + this.margin.left + this.margin.right;
        var height = this.height + this.margin.left + this.margin.right;

        this.svg = d3.select(this.selector).append('svg')
            .attr({ width, height })
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis);

        this.svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + this.width + ', 0)')
            .call(this.yAxis.orient('right'));

        this.svg.append('g')
            .attr('class', 'y axis')
            .call(this.yAxis.orient('left'));

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