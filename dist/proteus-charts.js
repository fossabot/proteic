/**
 * This object is used as a default one for those charts that do not have any user configuration.
 * @type {Object}
 */
const _default = {
  barchart: {
    style:{
      '.axis':{
        'font': '10px sans-serif'
      },
      '.axis path,.axis line':{
        'fill': 'none',
        'stroke': '#000',
        'shape-rendering': 'crispEdges'
      },
      '.x.axis path': {
        'display': 'none'
      }
    },
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: 600,
    height: 250,
    ticks: 5, // ticks for y axis.
    tooltip(object) {
      return 'Info: ' + JSON.stringify(object);
    },
    tickLabel: '',
    selector: '#chart',
    events: {
      down() {
        d3.select(this).classed('hover', false);
      },
      over() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill-opacity', 0.4);
      },
      leave() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill-opacity', 1);
      },
      click(d, i) {
        console.log(d, i);
      }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  },
  linechart: {
    style:{
      'path': {
        'stroke': 'steelblue',
        'stroke-width': 2,
        'fill':  'none'
      },
      '.axis': {
         'font': '10px sans-serif'
      },
      '.axis path,.axis line': {
        'fill': 'none',
        'stroke': '#000',
        'shape-rendering': 'crispEdge'
      },
      '.x.axis path': {
        'display': 'none'
      }
    },
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: 600,
    height: 250,
    ticks: 5, // ticks for y axis.
    tooltip(object) {
      return 'Info: ' + JSON.stringify(object);
    },
    tickLabel: '',
    selector: '#chart',
    events: {
      down() {
        d3.select(this).classed('hover', false);
      },
      over() {
        d3.select(this)
          .transition()
          .duration(50)
          .style('stroke-width', 2);
      },
      leave() {
        d3.select(this)
          .transition()
          .duration(50)
          .style('stroke-width', 1);
      },
      click(d, i) {
        console.log(d, i);
      }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  },
  streamgraph: {
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: 600,
    height: 250,
    ticks: 5, // ticks for y axis.
    tooltip(object) {
      return 'Info: ' + JSON.stringify(object);
    },
    tickLabel: '',
    selector: '#chart',
    events: {
      down() {
        d3.select(this).classed('hover', false);
      },
      over() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill-opacity', 0.4);
      },
      leave() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill-opacity', 1);
      },
      click(d, i) {
        console.log(d, i);
      }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  }
};
'use strict';
/* globals Svg, _default */

/**
 * Base class. This class is inherited in all charts implementations.
 * This is a non-instanciable chart.
 */
class Chart {

  constructor() {
    if(new.target === Chart || new.target === Basic || new.target === Flow){
      throw new Error(new.target + ' is non-instanciable');
    }
  }

  /**
   * Initialize the SVG context
   */
  _initializeSVGContext(){
    this._svg = new SvgStrategy(strategies[this.constructor.name](this.data,this.config));
  }
  /**
   * @param  {Object} data Data object. This method infer the type of data, which could be:
   * Array: Data is an static object.
   * Object: Data is a data source we need to connect to, in order to receive a stream of data.
   */
  _inferDataSource(data) {
    if (utils.isObject(data)) {
      this._initializeWebsocketDataSource(data);
    }else if(!utils.isArray(data)) {
      throw new TypeError('Wrong data format');
    }
  }
  
  /**
   * Initialize a connecton between browser and server through a Websocket connections
   * @param  {Object} source Connection details.
   */
  _initializeWebsocketDataSource(source) {

      this.ws = new WebSocket(source.endpoint);

      this.ws.onopen = () => {
      };

      this.ws.onerror = (e) => {
        throw new Error('Error with websocket connection', e);
      };
      
      this.ws.onmessage = (event) => {
        var data = JSON.parse(event.data).points;
        setTimeout(() => {
          this.keepDrawing(data);
          }, 50);
      };
  }
  
  /**
   * Renders data on barchart. Only allowed when data is an array of static data.
   * @param  {Array} data Array of data
   */
  draw(data = this.data){
    if(!utils.isArray(data)){
      throw new TypeError('draw method is only allowed with static data.');
    }
    this._svg.draw(data);
  }
  
  /**
   * Returns a PNG image of the current graph
   * @return {[String]} Image in data-url format
   */
  toPNG(cb){
    utils.svgAsDataUri(d3.select(this.config.selector + ' svg')[0][0], {}, (uri,err) => {
      if(err){
        throw Error('Error converting to image ' + err);
      }
      else{
        cb(uri);
      }
    });
  }

  /**
   * on event
   */
  on(eventName, action) {
    console.log(eventName, action);
  }

}

/**
 * Basic chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: bar, line, point.
 */
class Basic extends Chart {
  constructor(){
    super();
  }
}

/**
 * Flow chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: stremgraph and so on.
 */
class Flow extends Chart {
  constructor(){
    super();
  }
}
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
  constructor(){
    super();
    
    if(!arguments.length){
      throw new Error('Missing constructor parameters');
    }
    
    this._inferDataSource(arguments[0]);

    switch(arguments.length){
      case 1:
        this.data = arguments[0];
        this.config = _default.barchart;
        break;
      case 2:
        this.data = arguments[0];
        this.config = arguments[1];
        break;
      default:
        throw Error('Unrecognized number of paremeters: ' + arguments);
    }
    this._initializeSVGContext();
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data){
    super.draw(data);
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {[Object]} datum data to be rendered
   */
  keepDrawing(datum){
    var config = this.config;
    var maxNumberOfElements = config.maxNumberOfElements;
    if(!this.datum){
      this.datum = [];
    }
    this.datum = this.datum.concat(datum);
    if(maxNumberOfElements && maxNumberOfElements > 0){
      if(this.datum.length > maxNumberOfElements){
        for(let i = 0; i < datum.length; i++){
          this.datum.shift();
        }
      }
    }
    super.draw(this.datum);
  }
}
'use strict';

/**
 * Streamgraph implementation. This charts belongs to 'Flow' family.
 * It is inherited on 'Flow'.
 */
class Streamgraph extends Flow {
  
  /**
   * Streamgraph constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you 
   * do not specify this, '_default' object is used by default.
   */
  constructor(){
    super();
    
    if(!arguments.length){
      throw new Error('Missing constructor parameters');
    }
    
    this._inferDataSource(arguments[0]);

    switch(arguments.length){
      case 1:
        this.data = arguments[0];
        this.config = _default;
        break;
      case 2:
        this.data = arguments[0];
        this.config = arguments[1];
        break;
      default:
        throw Error('Unrecognized number of paremeters: ' + arguments);
    }
    this._initializeSVGContext();
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */
  draw(data = this.data){
    super.draw(data);
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {[Object]} datum data to be rendered
   */
  keepDrawing(datum){
    var config = this.config;
    var maxNumberOfElements = config.maxNumberOfElements;
    if(!this.datum){
      this.datum = [];
    }
    this.datum = this.datum.concat(datum);
    if(maxNumberOfElements && maxNumberOfElements > 0){
      if(this.datum.length > maxNumberOfElements){
        for(let i = 0; i < datum.length; i++){
          this.datum.shift();
        }
      }
    }
    super.draw(this.datum);
  }
}