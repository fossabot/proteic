class XYAxes {
  constructor(xAxisType, yAxisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for XAxis');
    }

    this.x = new XAxis(xAxisType, config);
    this.y = new YAxis(yAxisType, config);
  }

  transition(svg, time = 200) {
    this.x.transition(svg, time);
    this.y.transition(svg, time);
  }

  /**
   * This function is used when both x and y axis update their domains by x and y max/min values, respectively. 
   */
  updateDomainByBBox(b) {
    this.x.updateDomainByBBox([b[0], b[1]]);
    this.y.updateDomainByBBox([b[2], b[3]]);
  }

  /**
   * Used when x domain is caterogial (a set of keys) and y domain is linear.
   */
  updateDomainByKeysAndBBox(keys, bbox) {
    this.x.updateDomainByKeys(keys);
    this.y.updateDomainByBBox(bbox);
  }

  updateDomainByBBoxAndKeys(bbox, keys){
    this.x.updateDomainByBBox(bbox);
    this.y.updateDomainByKeys(keys);
  }
  
  render(svg, config) {
    this.x.render(svg, config);
    this.y.render(svg, config);
  }
}