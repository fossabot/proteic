import {dispatch} from 'd3';
import {SvgStrategy, strategies} from '../../svg/SvgStrategy';
import {svgAsDataUri} from '../../utils/image';
import {parseDataXY} from '../../utils/dataTransformation'
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
        //this.dispatcher = dispatch(); TODO: Re-implement reactor with d3-dispatcher

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
            , xDataFormat = config.x ? config.x.type : null
            , yDataFormat = 'linear'
            , p = null
            , desc = null
            , parsedData = null;
        if (xDataFormat)
            parsedData = parseDataXY(JSON.parse(JSON.stringify(data)), xDataFormat, yDataFormat, config); // We make a copy of data. We don't want to modify the original object.
        else
            parsedData = JSON.parse(JSON.stringify(data));

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
        svgAsDataUri(d3.select('#chart' + ' svg')._groups[0][0], {}, (uri, err) => {
            if (err) {
                throw Error('Error converting to image ' + err);
            }
            else {
                cb(uri);
            }
        });
    }


    keepDrawing(datum) {
        var data = this.data,
            datumType = datum.constructor;

        if (datumType === Array) {
            data = this.data.concat(datum);
        }
        else {
            data.push(datum);
        }

        this.draw(data);
    }

    _configureDatasource() {
        this.dispatcher = dispatch('onmessage', 'onopen', 'onerror');

        this.datasource.configure(this.dispatcher);

        this.dispatcher.on('onmessage', (datum) => this.keepDrawing(datum));


        this.dispatcher.on('onopen', (event) => {
            console.log('onopen', event);
        });

        this.dispatcher.on('onerror', (error) => {
            console.log('onerror', error);
        });

    }
}