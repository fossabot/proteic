'use strict';

/**
 * Barchart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */
class Barchart extends Basic {

  /**
   * Barchart constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you 
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super(data, config);
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data) {
    super.draw(data);
  }

  fire(event, data) {
    var element = this._svg.strategy.svg;
    if (!element || !element[0][0]) {
      throw Error('Cannot fire events because SVG dom element is not yet initialized');
    }
    element[0][0].dispatchEvent(new CustomEvent(event, { detail: { type: data } }));
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {[Object]} datum data to be rendered
   */
  keepDrawing(datum) {
    super.keepDrawing(datum, 'replace');
  }


}