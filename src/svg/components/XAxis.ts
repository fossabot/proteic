import {
    Axis,
    axisBottom,
    format,
    map,
    max as d3Max,
    min as d3Min,
    scaleBand,
    scaleLinear,
    scaleTime
} from 'd3';
import { Globals } from '../../../index';
import Component from './Component';

class XAxis extends Component {

    private _xAxis: any;

    constructor() {
        super();
    }

    public render(): void {
        let width = this.config.get('width');
        let height = this.config.get('height');
        let xAxisFormat = this.config.get('xAxisFormat');
        let xAxisType = this.config.get('xAxisType');
        let xAxisLabel = this.config.get('xAxisLabel');
        let xAxisGrid = this.config.get('xAxisGrid');
        let xTicksTextRotation = this.config.get('xTicksTextRotation');

        this.initializeXAxis(width, height, xAxisFormat, xAxisType, xAxisGrid);

        let axis = this.svg
            .append('g')
            .attr('class', `x axis ${xAxisType}`)
            .attr('transform', 'translate(0,' + height + ')')
            .call(this._xAxis);

        this.rotateTicksText(axis.selectAll('text'));

        this.svg
            .append('text')
            .attr('class', 'xaxis-title')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2)
            .attr('y', height + 40)
            .text(xAxisLabel)
            .style('font', '0.8em Montserrat, sans-serif');
    }

    public update(data: [any]): void {
        let propertyX = this.config.get('propertyX');
        let xAxisType = this.config.get('xAxisType');

        // TODO: Optimize it. Currently we are looping data twice.
        if (xAxisType === 'linear') {
            let min = d3Min(data, (d) => d[propertyX] || d[this.config.get('propertyStart')]);
            let max = d3Max(data, (d) => d[propertyX] || d[this.config.get('propertyEnd')]);
            this.updateDomainByMinMax(min, Math.ceil(max));

        } else if (xAxisType === 'time') {
            let min = d3Min(data, (d) => (d[propertyX] || d[this.config.get('propertyStart')]));
            let max = d3Max(data, (d) => (d[propertyX] || d[this.config.get('propertyEnd')]));
            this.updateDomainByMinMax(min, max);

        } else {
            let keys: Array<string> = map(data, (d) => d[propertyX]).keys();
            this.updateDomainByKeys(keys);
        }

        this.transition();
    }

    private rotateTicksText(ticksText: any) {
        let rotation = this.config.get('xTicksTextRotation') || 0;

        switch (rotation) {
            case 65:
                ticksText
                    .attr('transform', `rotate(${rotation})`)
                    .attr('dx', '0.5em')
                    .attr('dy', '0.1em')
                    .style('text-anchor', 'start');
                break;
            case -65:
                ticksText
                    .attr('transform', `rotate(${rotation})`)
                    .attr('dx', '-0.5em')
                    .attr('dy', '0.5em')
                    .style('text-anchor', 'end');
                break;
            case -90:
                ticksText
                    .attr('transform', `rotate(${rotation})`)
                    .attr('dx', '-0.5em')
                    .attr('dy', '-0.25em')
                    .style('text-anchor', 'end');
                break;
            default:
                throw new Error(`Invalid rotation value (${rotation}). Just allowed: 65,-65,-90`);
        }
    }

    /**
     * Update x domain by keys
     *
     * @private
     * @memberOf XAxis
     * @param keys
     */
    private updateDomainByKeys(keys: Array<string>) {
        this._xAxis.scale().domain(keys);
    }

    public updateDomainByMinMax(min: number, max: number) {
        this._xAxis.scale().domain([min, max]);
    }

    public transition() {
        let axis = this.svg.selectAll('.x.axis')
            .transition()
            .duration(Globals.COMPONENT_TRANSITION_TIME)
            .call(this._xAxis);
        this.rotateTicksText(axis.selectAll('text'));
        // Reorder the axis path to appear over the ticks
        this.svg.select('.x.axis path').raise();
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
    private initializeXAxis(
        width: number,
        height: string | number,
        xAxisFormat: string,
        xAxisType: string,
        xAxisGrid: boolean
    ): void {
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
                throw new Error(`Not allowed type for XAxis. Only allowed time,
                linear or categorical. Got:${xAxisType}`);
        }

        if (xAxisGrid) {
            this._xAxis
                .tickSizeInner(-height)
                .tickPadding(9);
        }
    }

    get xAxis() {
        return this._xAxis;
    }

    public clear() {
        this.updateDomainByMinMax(0, 1);
        this.transition();
    }
}

export default XAxis;
