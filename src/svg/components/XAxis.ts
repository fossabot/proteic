import {scaleTime, scaleLinear, scaleBand} from 'd3/d3-scale';
import {format} from 'd3-format';
import {axisBottom} from 'd3-axis';
import * as d3 from 'd3';

import Component from './Component';
import Config from '../../Config';

class XAxis extends Component {

    private xAxis: any;

    constructor(config: Config) {
        super(config);

        let width = this.config.get('width'),
            xAxisFormat = this.config.get('xAxisFormat'),
            xAxisType = this.config.get('xAxisType');

        this.initializeXAxis(width, xAxisFormat, xAxisType);
    }


    public render(): void {

    }

    public update(): void {

    }

    /**
     *
     * Initializes a new horizontal axis
     *
     * @private
     * @param {(string | number)} Width Width of the axis
     * @param {string} xAxisFormat Format of the axis. This parameter is only valid when using a time axis.
     * @param {string} xAxisType Type of the axis. It can be: time, linear or categorical.
     *
     * @memberOf XAxis
     */
    private initializeXAxis(width: string | number, xAxisFormat: string, xAxisType: string): void {
        switch (xAxisType) {
            case 'time':
                this.xAxis = axisBottom(scaleTime().range([0, width]));
                break;
            case 'linear':
                this.xAxis = axisBottom(scaleLinear().range([0, width])).tickFormat(format(xAxisFormat));
                break;
            case 'categorical':
                this.xAxis = axisBottom(scaleBand().rangeRound([0, width]).padding(0.1).align(0.5));
                break;
            default:
                throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
        }
    }
}

export default XAxis;