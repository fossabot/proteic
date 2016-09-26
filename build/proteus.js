(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.proteus = global.proteus || {})));
}(this, (function (exports) { 'use strict';

/**
 * Base class. This class is inherited in all charts implementations.
 * This is a non-instanciable chart.
 */
class Chart$1 {

    constructor(d, config) {
        var clazz = this.constructor.name;
        if (clazz === 'Chart' || clazz === 'Basic' || clazz === 'Flow' || clazz === 'Temporal' || clazz === 'Hierarchical') {
            throw new Error(clazz + ' is non-instanciable');
        }

        this.events = {};
        this.reactor = new Reactor();

        if (!d && !config) {
            throw new Error('Missing constructor parameters');
        }

        let dataFormat = d.constructor.name;
        let nArguments = (d && config) ? 2 : 1;

        switch (dataFormat) {
            case 'WebsocketDatasource':
                this.datasource = d;
                this.data = [];
                this._configureDatasource();
                break;
            case 'Array':
                this.data = d;
                break;
            case 'Object':
                this.data = d;
                break;
            default:
                throw TypeError('Wrong data format');
        }
        //if only 1 parameter is specified, take default config. Else, take the second argument as config.
        this.config = (nArguments === 1) ? _default[this.constructor.name]
            : config;

        this._initializeSVGContext();
    }

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
        return data;
    }

    /**
     * Returns the chart context: data, configuration and chart type.
     */
    _getChartContext() {
        return {
            data: this.data,
            config: this.config,
            cType: this.constructor.name
        };
    }

    /**
     * Initialize the SVG context
     */
    _initializeSVGContext() {
        this._svg = new SvgStrategy(strategies[this.constructor.name](this._getChartContext()));
    }

    /**
     * Renders data on barchart. Only allowed when data is an array of static data.
     * @param  {Array} data Array of data
     */
    draw(data = this.data) {
        var config = this.config
            , sort = config.sort
            , xDataFormat = config.x.type
            , yDataFormat = 'linear'
            , p = null
            , desc = null
            , parsedData = null;

        parsedData = this._parseData(JSON.parse(JSON.stringify(data)), xDataFormat, yDataFormat, config); // We make a copy of data. We don't want to modify the original object.

        if (sort) {
            p = config.sort.field;
            desc = config.sort.desc;
            parsedData.sort((e1, e2) => {
                var a = e1[p];
                var b = e2[p];
                return (a < b) ? -1 : (a > b) ? 1 : 0;
            })
        }

        this._svg.draw(parsedData);
    }

    /**
     * Returns a PNG image of the current graph
     * @return {String} Image - in data-url format
     */
    toPNG(cb) {
        utils.svgAsDataUri(d3.select(this.config.selector + ' svg')._groups[0][0], {}, (uri, err) => {
            if (err) {
                throw Error('Error converting to image ' + err);
            }
            else {
                cb(uri);
            }
        });
    }

    /**
     * On method. Define custom events (click, over, down and up).
     */
    on(eventName, action) {
        if (!eventName || typeof eventName !== 'string') {
            throw Error('eventName should be a string. Instead: ' + eventName);
        }
        if (!action || !utils.isFunction(action)) {
            throw Error('action should be a function. Instead: ' + eventName);
        }

        this.events[eventName] = action;
        this._svg.on(this.events);
        return this;
    }

    _configureDatasource() {
        this.datasource.configure(this.reactor);
        this.reactor.registerEvent('onmessage');
        this.reactor.registerEvent('onerror');
        this.reactor.registerEvent('onopen');

        this.reactor.addEventListener('onmessage', (data) => {
            this.keepDrawing(data);
        });

        this.reactor.addEventListener('onopen', (e) => {
            console.debug('Connected to websocket endpoint.', e);
        });

        this.reactor.addEventListener('onerror', (error) => {
            console.error('An error has occured: ', error);
        });
    }

    pause() {
        if (!this.datasource) {
            throw ('You need a datasource to pause a streaming');
        }
        this.reactor.removeEventListener('onmessage');
    }

    resume() {
        if (!this.datasource) {
            throw ('You need a datasource to resume a streaming');
        }

        this.reactor.addEventListener('onmessage', (data) => {
            this.keepDrawing(data);
        });
    }

}

/**
 * Linechart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */
class Linechart extends Chart {

  /**
   * Linechart constructor. It needs (at least) one argument to start: data.
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

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum data to be rendered
   */
  keepDrawing(datum) {
    super.keepDrawing(datum, 'add');
  }
}

exports.Chart = Chart$1;
exports.Linechart = Linechart;

Object.defineProperty(exports, '__esModule', { value: true });

})));