class SvgBarchartStrategy extends SvgChart {

  constructor(chartContext) {
    super(chartContext);
    var config = this.config;

    this.svgContainer = new SvgContainer(config);
    this.axes = new XYAxes('categorical', 'linear', config);
    this.bars = new Barset(this.axes.x.xAxis, this.axes.y.yAxis);

    this.svgContainer
      .add(this.axes)
      .add(this.bars);

  }

	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    var svg = this.svgContainer.svg
      , config = this.config
      , isStacked = this.config.stacked
      , keys = d3.map(data, (d) => d.key).keys()
      , stack = d3.stack().keys(["Male", "Female"])
        .value((d, i) => d.y)
        .order(d3.stackOrderNone)
      , yMin = 0
      , yMax = 0
      , method = isStacked ? 'stacked' : 'grouped'
      , dataSeries = stack(data);

    yMax = isStacked
      ? d3.max(dataSeries, (serie) => d3.max(serie, (d) => d[1]))
      : d3.max(data, (serie) => d3.max(serie, (d) => d.y))

    this.axes.updateDomainByKeysAndBBox(keys, [yMin, yMax]);

    this.axes.transition(svg, 200);

    this.bars.update(svg, config, dataSeries, method);

    this.data = data; // TODO: ? 
  }

  transition2Stacked() {
    this.config.stacked = true;
  }

  transition2Grouped() {
    this.config.stacked = false;
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
    this.config.stacked = typeof (config.stacked) === 'undefined' ? _default[this.constructor.name].stacked : config.stacked;
    //Just for testing purposes
    return this;
  }
}