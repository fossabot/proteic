class SvgGaugeStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);

    var config = this.config;

    this.svgContainer = new SvgContainer(config);
    this.dial = new Dial('linear', config);
    this.needle = new DialNeedle('linear', config);

    this.svgContainer
      .add(this.dial)
      .add(this.needle);

    if (config.numericIndicator) {
      this.numericIndicator  = new NumericIndicator(config);
      this.svgContainer.add(this.numericIndicator)
    }
  }

	/**
	 * Renders a gauge chart based on data object
	 * @param  {Object} data Data Object. Contains a numeric value.
	 *
	 */
  draw(data) {
    var svg = this.svgContainer.svg
      , config = this.config;

    this.needle.update(svg, config, data);
    if (config.numericIndicator) {
      this.numericIndicator.update(svg, config, data);
    }
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {
    super._loadConfigOnContext(config);
    this.config = this.config || {};
    this.config.minLevel = config.minLevel || _default.Gauge.minLevel;
    this.config.maxLevel = config.maxLevel || _default.Gauge.maxLevel;
    this.config.minAngle = config.minAngle || _default.Gauge.minAngle;
    this.config.maxAngle = config.maxAngle || _default.Gauge.maxAngle;
    this.config.ticks = config.ticks || _default.Gauge.ticks;
    this.config.ringWidth = config.ringWidth || _default.Gauge.ringWidth;
    this.config.ringMargin = config.ringMargin || _default.Gauge.ringMargin;
    this.config.labelInset = config.labelInset || _default.Gauge.labelInset;
    this.config.needleNutRadius = config.needleNutRadius || _default.Gauge.needleNutRadius;
    this.config.needleLenghtRatio = config.needleLenghtRatio || _default.Gauge.needleLenghtRatio;
    this.config.invertColorScale = typeof (config.invertColorScale) === 'undefined' ? _default.Gauge.invertColorScale : config.invertColorScale;
    this.config.numericIndicator = typeof (config.numericIndicator) === 'undefined' ? _default.Gauge.numericIndicator : config.numericIndicator;
    //Just for testing purposes
    return this;
  }

}