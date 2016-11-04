import Config from '../../Config';
import Component from './Component';
import {
    scaleLinear,
    scaleBand,
    format,
    axisLeft
} from 'd3';

class YAxis extends Component {

    private _yAxis: any;

    constructor() {
        super();
    }

    public render(): void {
        let width = this.config.get('width'),
            height = this.config.get('height'),
            yAxisFormat = this.config.get('yAxisFormat'),
            yAxisType = this.config.get('yAxisType'),
            yAxisLabel = this.config.get('yAxisLabel');

        this.initializeYAxis(width, height, yAxisFormat, yAxisType);

        this.svg
            .append('g')
            .attr('class', 'y axis')
            .attr('stroke-dasharray', '1, 5')
            .call(this._yAxis);

        this.svg
            .append('text')
            .attr('class', 'yaxis-title')
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr('x', 0 - height / 2)
            .attr('y', 0 - 55)
            .text(yAxisLabel)
            .style('font', '0.8em Montserrat, sans-serif');
    }

    public update(data): void {

    }

    /**
     *
     * Initializes a new vertical axis
     *
     * @private
     * @param {(string | number)} Width Width of the axis
     * @param {string} yAxisFormat Format of the axis. This parameter is only valid when using a time axis.
     * @param {string} yAxisType Type of the axis. It can be: linear or categorical.
     *
     * @memberOf XAxis
     */

    private initializeYAxis(width: string | number, height: string | number, yAxisFormat: string, yAxisType: string): void {
        switch (yAxisType) {
            case 'linear':
                this._yAxis = axisLeft(scaleLinear().range([height, 0])).tickFormat(format(yAxisFormat)).tickSizeInner(-width).tickSizeOuter(0).tickPadding(20);
                break;
            case 'categorical':
                this._yAxis = axisLeft(scaleBand().rangeRound([height, 0]).padding(0.1).align(0.5));
                break;
            default:
                throw new Error('Not allowed type for YAxis. Only allowed "time",  "linear" or "categorical". Got: ' + yAxisType);
        }

        this._yAxis.tickFormat(format(yAxisFormat))
            .tickSizeInner(-width)
            .tickSizeOuter(0)
            .tickPadding(20);
    }

    get yAxis() {
        return this._yAxis;
    }
}

export default YAxis;