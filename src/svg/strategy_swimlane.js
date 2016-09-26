class SvgSwimlaneStrategy extends SvgChart {
  constructor(chartContext) {
    super(chartContext);
    var config = this.config;
    this.svgContainer = new SvgContainer(config);

    this.axes = new XYAxes('time', 'categorical', config);
    this.boxs = new TimeBoxset(this.axes.x.xAxis, this.axes.y.yAxis);
    this.legend = new Legend();

    this.svgContainer
      .add(this.axes)
      .add(this.boxs)
      .add(this.legend);
  }

  draw(data) {
    var svg = this.svgContainer.svg
      , config = this.config
      , keys = d3.map(data, (d) => d.key).keys()
      , bbox = this._getBBox(data);

    this.axes.updateDomainByBBoxAndKeys(bbox, keys);
    this.axes.transition(svg, 200);

    this.boxs.update(svg, config, data);
    this.legend.update(svg, config, data);

  }
  _getBBox(data) {
    return [
      d3.min(data, (d) => new Date(d.x)),
      d3.max(data, (d) => new Date(d.y))
    ]
  }


  _loadConfigOnContext(config) {
    super._loadConfigOnContext(config);
    console.log(this.config);
    return this;
  }
}