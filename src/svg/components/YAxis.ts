import Annotation from 'd3-svg-annotation';
import { Data } from './../../data/Data';
import {
    axisLeft,
    axisRight,
    format,
    map,
    max as d3Max,
    min as d3Min,
    scaleBand,
    scaleLinear,
    stack
} from 'd3';
import Globals from '../../Globals';
import { simple2stacked } from '../../utils/data/transforming';
import Component from './Component';

class YAxis extends Component {

    private _yAxis: any;
    private _orient: string = 'left';
    private selection: any = null;

    constructor(orient?: string) {
        super();
        if (typeof orient !== 'undefined') {
            this._orient = orient;
        }
    }

    get orient(): string {
        return this._orient;
    }

    public render(): void {
        let width = this.config.get('width');
        let height = this.config.get('height');
        let yAxisFormat = this.config.get('yAxisFormat');
        let yAxisType = this.config.get('yAxisType');
        let yAxisLabel = this.config.get('yAxisLabel');
        let yAxisGrid = this.config.get('yAxisGrid');

        this.initializeYAxis(width, height, yAxisFormat, yAxisType, yAxisGrid);

        let yAxisG = this.svg
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', this.orient === 'left'
                ? 'translate( 0, 0 )'
                : 'translate( ' + width + ', 0 )'
            )
            .call(this._yAxis);

        this.svg
            .append('text')
            .attr('class', 'yaxis-title')
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr('x', 0 - height / 2)
            .attr('y', 0 - 55)
            .text(yAxisLabel)
            .style('font', '0.8em Montserrat, sans-serif');

        this.selection = yAxisG;
    }

    public update(data: Data): void {
        let propertyKey = this.config.get('propertyKey');
        let propertyY = this.config.get('propertyY');
        let propertyX = this.config.get('propertyX');

        let yAxisType = this.config.get('yAxisType');
        let yAxisShow = this.config.get('yAxisShow');
        let layoutStacked = this.config.get('stacked');
        let annotations = this.config.get('annotations');

        this.selection.attr('opacity', yAxisShow ? 1 : 0);

        let min: number = Number.MAX_SAFE_INTEGER;
        let max: number = Number.MIN_SAFE_INTEGER;

        if (yAxisType === 'linear') {
            if (layoutStacked) {
                let keys: Array<string> = map(data.originalDatum, (d: any) => d[propertyKey]).keys();
                let stack = this.config.get('stack');
                let stackedData = stack
                    .keys(keys)(simple2stacked(data.originalDatum, propertyX, propertyY, propertyKey));
                min = +(d3Min(stackedData, (serie: any) => d3Min(serie, (d: any) => d[0])));
                max = +(d3Max(stackedData, (serie: any) => d3Max(serie, (d: any) => d[1])));
            } else {
                min = data.getCalculationOnProperty('min', propertyY);
                max = data.getCalculationOnProperty('max', propertyY);
            }

            let minNumber = min;
            let maxNumber = max;
            if (annotations && annotations.length) {
                let bandAnnotations = annotations.filter((a: Annotation) => new String(a.type) === 'band');

                for (let annotation of bandAnnotations) {
                    let variable: string = annotation.variable;
                    let width: any = annotation.width;
                    let annotationArray = data.originalDatum.filter((d: any) => d[propertyKey] === variable);

                    if (annotationArray && annotationArray.length) {
                        for (let a of annotationArray) {
                            let widthValue = typeof width === 'string' ? a[width] : width;

                            if (a[propertyY] - widthValue < minNumber) {
                                minNumber = a[propertyY] - widthValue;
                            }
                            if (a[propertyY] + widthValue > maxNumber) {
                                maxNumber = a[propertyY] + widthValue;
                            }
                        }
                    }
                }
            }

            this.updateDomainByMinMax(minNumber, maxNumber);

        } else if (yAxisType === 'categorical') {
            let keys: Array<string> = map(data.originalDatum, (d: any) => d[propertyY]).keys().sort();
            this._yAxis.scale().domain(keys);
        } else {
            console.warn('could not recognize y axis type', yAxisType);
        }

        if (data !== null && data.originalDatum.length) {
            this.transition();
        }

    }

    public updateDomainByMinMax(min: number, max: number) {
        let margin = (+max - min) * 0.1 || 1;
        this._yAxis.scale().domain([min, max + margin]);
    }

    public transition() {
        this.selection
            .transition()
            .duration(Globals.COMPONENT_TRANSITION_TIME)
            .call(this._yAxis);
        // Reorder the axis path to appear over the ticks
        this.svg.selectAll('.y.axis path').raise();
    }

    /**
     *
     * Initializes a new vertical axis.
     *
     * @private
     * @param {(string | number)} width - Width of the chart.
     * @param {(number)} height - Height of the chart.
     * @param {string} yAxisFormat - Format of the axis. This parameter is only valid when using a time axis.
     * @param {string} yAxisType - Type of the axis. It can be: linear or categorical.
     * @param {boolean} yAxisGrid -  Wether the gridlines are drawn or not.
     * @returns {void}
     *
     * @memberOf XAxis
     */
    private initializeYAxis(
        width: string | number,
        height: number,
        yAxisFormat: string,
        yAxisType: string,
        yAxisGrid: boolean
    ): void {
        switch (yAxisType) {
            case 'linear':
                this._yAxis = (this.orient === 'left')
                    ? axisLeft(scaleLinear().range([height, 0])).tickFormat(format(yAxisFormat))
                    : axisRight(scaleLinear().range([height, 0])).tickFormat(format(yAxisFormat));
                break;
            case 'categorical':
                this._yAxis = (this.orient === 'left')
                    ? axisLeft(scaleBand().rangeRound([height, 0]).padding(0.1).align(0.5))
                    : axisRight(scaleBand().rangeRound([height, 0]).padding(0.1).align(0.5));
                break;
            default:
                throw new Error(`Not allowed type for YAxis. Only allowed 'time', 
                 'linear' or 'categorical'. Got: ` + yAxisType);
        }

        if (yAxisGrid && this.orient === 'left') {
            this._yAxis
                .tickSizeInner(-width)
                .tickSizeOuter(0)
                .tickPadding(20);
        }
    }

    get yAxis() {
        return this._yAxis;
    }

    public clear() {
        this.updateDomainByMinMax(0, 1);
        this.transition();
    }
}

export default YAxis;
