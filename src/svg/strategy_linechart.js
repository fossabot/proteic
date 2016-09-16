class SvgLinechartStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);
    var config = this.config
      , xDataType = config.x.type;

    this.svgContainer = new SvgContainer(config);
    this.axes = new XYAxes(xDataType, 'linear', config);
    this.lines = new Lineset(this.axes.xAxis, this.axes.yAxis);

    //Include components in the chart container
    this.svgContainer
      .add(this.axes)
      .add(this.lines);
  }

	/**
	 * Renders a linechart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    var svg = this.svgContainer.svg
      , config = this.config
      , xDataFormat = config.x.type
      , yDataFormat = 'linear'
      , bbox = null;

    this._parseData(data, xDataFormat, yDataFormat, config);

    bbox = this._getDomainBBox(data);

    this.axes.updateDomainByBBox(bbox);

    //Create a transition effect for axis rescaling
    this.axes.transition(svg, 200);

    //Now update lines
    this.lines.update(svg, config, data);

  }
  //TODO: move this function to a utility class? It is used in many charts
  _parseData(data, xDataFormat, yDataFormat, config) {
    data.forEach((d) => {
      //parse x coordinate
      switch (xDataFormat) {
        case 'time':
          d.x = d3.timeParse(config.x.format)(d.x);
          break;
        case 'linear':
          d.x = +d.x;
          break;
      }
      //parse x coordinate
      switch (yDataFormat) {
        case 'time':
          d.y = d3.timeFormat
          break;
        case 'linear':
          d.y = +d.y;
          break;
      }
    });
  }

  _getDomainBBox(data) {
    var minX = d3.min(data, (d) => d.x)
      , maxX = d3.max(data, (d) => d.x)
      , minY = d3.min(data, (d) => d.y)
      , maxY = d3.max(data, (d) => d.y);
    return [minX, maxX, minY, maxY];
  }

  /**
   * This method adds config options to the chart context.
   * @param  {Object} config Config object
   */
  _loadConfigOnContext(config) {
    super._loadConfigOnContext(config);
    this.config = this.config || {};
    this.config.markers = {};
    this.config.markers.color = config.markers.color || _default.Linechart.markers.color;
    this.config.markers.outlineColor = config.markers.outlineColor || _default.Linechart.markers.outlineColor;
    this.config.markers.outlineWidth = config.markers.outlineWidth || _default.Linechart.markers.outlineWidth;
    this.config.markers.shape = config.markers.shape || _default.Linechart.markers.shape;
    this.config.markers.size = config.markers.size || _default.Linechart.markers.size;
    this.config.area = typeof (config.area) === 'undefined' ? _default.Linechart.area : config.area;
    this.config.areaOpacity = config.areaOpacity || _default.Linechart.areaOpacity;
    this.config.x = {};
    this.config.x.type = config.x.type || _default.Linechart.xDataType;
    this.config.x.format = config.x.format || _default.Linechart.xDateFormat;
    this.config.x.ticks = config.x.ticks;

    return this;
  }
}