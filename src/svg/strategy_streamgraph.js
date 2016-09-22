class SvgStreamgraphStrategy extends SvgChart {

    constructor(chartContext) {
        super(chartContext);
        var config = this.config;

        this.svgContainer = new SvgContainer(config);
        this.x = new XAxis('time', config);
        this.y = new YAxis('linear', config);

        this.streams = new Streamset(this.x.xAxis, this.y.yAxis);

        //Include components in the chart container
        this.svgContainer
            .add(this.x)
            .add(this.y, false) //No render y Axis
            .add(this.streams);
    }

    draw(data) {
        var svg = this.svgContainer.svg
            , config = this.config
            , bbox = null
            , keys = d3.map(data, (d) => d.key).keys()
            , data4stack = utils.dataTransformation.simple2stacked(data)
            , stack = d3.stack()
                .keys(keys)
                .value((d, k) => d.value[k])
                .order(d3.stackOrderInsideOut)
                .offset(d3.stackOffsetWiggle)
            , dataSeries = stack(data4stack);

        bbox = this._getDomainBBox(data, dataSeries);

        this.x.updateDomainByBBox([bbox[0], bbox[1]]);
        this.y.updateDomainByBBox([bbox[2], bbox[3]]);
        this.x.transition(svg, 200);
        this.y.transition(svg, 200);
       
       this.streams.update(svg, config, dataSeries);
    }

    _getDomainBBox(data, dataSeries) {
        var minX = d3.min(data, (d) => d.x)
            , maxX = d3.max(data, (d) => d.x)
            , minY = d3.min(dataSeries, (serie) => d3.min(serie, (d) => d[0]))
            , maxY = d3.max(dataSeries, (serie) => d3.max(serie, (d) => d[1]));

        return [minX, maxX, minY, maxY];
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
        this.config.colorScale = config.colorScale || _default.Streamgraph.colorScale;
        this.config.xDateformat = config.xDateFormat || _default.Streamgraph.xDateFormat;
    }
}