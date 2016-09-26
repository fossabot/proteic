class SvgStackedAreaStrategy extends SvgChart {

    constructor(chartContext) {
        super(chartContext);
        var config = this.config;

        this.svgContainer = new SvgContainer(config);
        this.axes = new XYAxes('time', 'linear', config);

        this.streams = new Streamset(this.axes.x.xAxis, this.axes.y.yAxis);

        this.legend = new Legend();

        //Include components in the chart container
        this.svgContainer
            .add(this.axes)
            .add(this.legend)
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
                .offset(d3.stackOffNone)
            , dataSeries = stack(data4stack);

        bbox = this._getDomainBBox(data, dataSeries);

        this.axes.updateDomainByBBox(bbox);
        this.axes.transition(svg, 200);

        // Update legend
        this.legend.update(svg, config, data);

        // Update streams
        this.streams.update(svg, config, dataSeries);
    }


    _getDomainBBox(data, dataSeries) {
        var minX = d3.min(data, (d) => new Date(d.x))
            , maxX = d3.max(data, (d) => new Date(d.x))
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