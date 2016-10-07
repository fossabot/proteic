import {dispatch} from 'd3';
import {SvgStrategy, strategies} from '../../svg/SvgStrategy';
import {svgAsDataUri} from '../../utils/image';

/**
 * Base class. This class is inherited in all charts implementations.
 * This is a non-instanciable chart.
 */
export default class Chart {

    constructor(d, config) {
        var clazz = this.constructor.name;
        if (clazz === 'Graph') {
            throw new Error(clazz + ' is non-instanciable');
        }

        this.events = {};

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
            default:
                throw TypeError('Wrong data format');
        }
        //if only 1 parameter is specified, take default config. Else, take the second argument as config.
        this.config = (nArguments === 1) ? {} : config;

        this._initializeSVGContext();
    }

    _initializeAPI(properties) {
        let clazz = this.constructor;
        properties.forEach((method) => {
            clazz.prototype[method] = function (value) {
                return this.change(method, value);
            }
        });
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
        this._svg.draw(data);
    }

    /**
     * Returns a PNG image of the current graph
     * @return {String} Image - in data-url format
     */
    toPNG(cb) {
        var selector = this.config.selector + ' ' + 'svg';
        svgAsDataUri(d3.select(selector)._groups[0][0], {}, (uri, err) => {
            if (err) {
                throw Error('Error converting to image ' + err);
            }
            else {
                cb(uri);
            }
        });
    }

    _keepDrawingByAdding(datum) {
        var datumType = datum.constructor;

        console.log(datumType, this.data, datum);
        if (datumType === Array) {
            this.data = this.data.concat(datum);
        }
        else {
            data.push(datum);
        }

        this.draw(this.data);
    }

    _keepDrawingByReplacing(datum) {
        var datumType = datum.constructor;
        if (datumType === Array) {
            this.data = datum;
        }
        else {
            //TODO: find key by datum.x and replace it with new value
        }

        this.draw(this.data);
    }

    keepDrawing(datum, method) {
        console.log('config', this.config);
        if (method === 'add') {
            this._keepDrawingByAdding(datum);
        }
        else {
            this._keepDrawingByReplacing(datum);
        }

    }

    _configureDatasource() {
        this.dispatcher = dispatch('onmessage', 'onopen', 'onerror');

        this.datasource.configure(this.dispatcher);

        this.dispatcher.on('onmessage', (data) => this.keepDrawing(data));


        this.dispatcher.on('onopen', (event) => {
            console.log('onopen', event);
        });

        this.dispatcher.on('onerror', (error) => {
            console.log('onerror', error);
        });
    }

    change(property, value) {
        this._svg.strategy.changeConfigProperty(property, value);
        return this;
    }
}