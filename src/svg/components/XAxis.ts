import {
    map,
    select,
    scaleTime,
    scaleLinear,
    scaleBand,
    format,
    axisBottom,
    timeParse,
    min as d3Min,
    max as d3Max
} from 'd3';

import Component from './Component';
import Config from '../../Config';

import { isEven } from '../../utils/functions';

class XAxis extends Component {

    private _xAxis: any;

    constructor() {
        super();
    }


    public render(): void {
        let width = this.config.get('width'),
            height = this.config.get('height'),
            xAxisFormat = this.config.get('xAxisFormat'),
            xAxisType = this.config.get('xAxisType'),
            xAxisLabel = this.config.get('xAxisLabel');

        this.initializeXAxis(width, xAxisFormat, xAxisType);

        this.svg
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(this._xAxis);

        this.svg
            .append('text')
            .attr('class', 'xaxis-title')
            .attr("text-anchor", "middle")
            .attr('x', width / 2)
            .attr('y', height + 40)
            .text(xAxisLabel)
            .style('font', '0.8em Montserrat, sans-serif');
    }

    public update(data: [any]): void {
        let xAxisType = this.config.get('xAxisType');

        if (xAxisType === 'linear') {
            //TODO: Optimize it. Currently we are looping data twice.
            let min = d3Min(data, (d) => d.x),
                max = d3Max(data, (d) => d.x);
            this.updateDomainByMinMax(min, max);

        } else if (xAxisType === 'time') {
            let min = d3Min(data, (d) => (d.x || d.start)),
                max = d3Max(data, (d) => (d.x || d.end));
            this.updateDomainByMinMax(min, max);
            
        }
        else {
            let keys: [string] = map(data, (d) => d.x).keys();
            this.updateDomainByKeys(keys);
        }

        this.transition();
    }
    /**
     * 
     * Update x domain by keys
     * @private
     * @param {*} data
     * 
     * @memberOf XAxis
    
     */
    private updateDomainByKeys(keys: [string]) {
        this._xAxis.scale().domain(keys);

    }

    private updateDomainByMinMax(min, max) {
        this._xAxis.scale().domain([min, max]);
    }

    private transition(time: number = 200) {
        this.svg.selectAll('.x.axis').transition().duration(time).call(this._xAxis).on('end', this.applyStyle);
    }

    private applyStyle() {
        select(this).selectAll('g.tick text')
            .style('font', '1.4em Montserrat, sans-serif')
            .style('fill', (d, i) => !isEven(i) || i === 0 ? '#5e6b70' : '#1a2127')
            .style('fill', (d) => '#1a2127')

        select(this).selectAll(['path', 'line'])
            .attr('stroke', 'gray')
            .attr('stroke-width', .3);
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
                this._xAxis = axisBottom(scaleTime().range([0, width]));
                break;
            case 'linear':
                this._xAxis = axisBottom(scaleLinear().range([0, width])).tickFormat(format(xAxisFormat));
                break;
            case 'categorical':
                this._xAxis = axisBottom(scaleBand().rangeRound([0, width]).padding(0.1).align(0.5));
                break;
            default:
                throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
        }
    }

    get xAxis() {
        return this._xAxis;
    }
}

export default XAxis;