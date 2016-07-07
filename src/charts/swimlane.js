'use strict';

/**
 * Linechart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */
class Swimlane extends Chart {

  /**
   * Linechart constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super();

    if (!arguments.length) {
      throw new Error('Missing constructor parameters');
    }

    let dataFormat = arguments[0].constructor.name;
    let nArguments = arguments.length;

    switch (dataFormat) {
      case 'WebsocketDatasource':
        this.datasource = arguments[0];
        this.data = {lanes: [], items: []};
        this._configureDatasource();
        break;
      case 'Object':
        this.data = arguments[0];
        break;
      default:
        throw TypeError('Wrong data format');
    }
    //if only 1 parameter is specified, take default config. Else, take the second argument as config.
    this.config = (nArguments == 1) ?
      _default[this.constructor.name]
      : arguments[1];

    this._initializeSVGContext();
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data) {
    this._svg.draw(data);
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum data to be rendered
   */
  keepDrawing(datum) {
    let config = this.config;
    if (!datum) {
      console.warn('attemp to draw null datum');
      return;
    }
    var lanes = datum.lanes;
    var items = datum.items;
    //Loop lanes
    for(let i in lanes){
      let lane = lanes[i];
      if(utils.findElement(this.data.lanes, 'id', lane.id) === null){
        this.data.lanes.push(lane);
      }  
    }
    //Loop items
    for(let i in items){
      let item = items[i];
      this.data.items.push(item);
    }
    
    this.draw();
    return this.data;
  }
}