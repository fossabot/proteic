import Component from './Component';
import {
    map,
    scaleLinear,
    scalePoint,
    axisLeft,
    Axis,
    extent,
    select,
    Line,
    line
} from 'd3';

class ParallelCoordinates extends Component {

    private _dimensionScale: any;
    private _yScale: any;
    private _dimensions: string[];
    private parallelAxes: any;
    private lineGenerator: Line<any>;

    constructor() {
        super();
    }

    public render() {
        let width = this.config.get('width'),
            height = this.config.get('height');

        this.initializeParallelCoordinates(width, height);
    }

    public update(data: [any]) {
        let propertyKey = this.config.get('propertyKey'),
            height = this.config.get('height');

        this._dimensions = Object.keys(data[0]).filter((dimension) => dimension != propertyKey);

        this.updateDomainOfDimensions();
        this.updateYaxesByDimensions(data, height);

        let dimensionEntries = this.svg.selectAll('.dimension')
                                    .data(this._dimensions)
                                    .enter()
                                    .append('g')
                                    .attr('class', 'dimension')
                                    .attr('transform', (d) => 'translate(' + this._dimensionScale(d) + ')');

        let thisInstance = this;
        dimensionEntries.append('g')
                    .attr('class', 'axis')
                    .attr('transform', 'translate( 0, 0 )')
                    .each(function(d) {
                        select(this)
                            .call(thisInstance.parallelAxes.scale(thisInstance._yScale[d]));
                    });

        dimensionEntries.append('text')
                .attr('class', 'yaxis-title')
                .style('text-anchor', 'middle')
                .attr('y', -9)
                .text((d) => d);
    }

    private initializeParallelCoordinates(width: number, height: number) {
        this._dimensionScale = scalePoint().range([0, width]);
        this.parallelAxes = axisLeft(scaleLinear().range([height, 0]));
        this._yScale = {};
    }

    private updateYaxesByDimensions(data: [any], height: number) {
        this._dimensions.map((dimension) => {
            this._yScale[dimension] = scaleLinear()
                                        .domain(extent(data, (d) => +d[dimension]))
                                        .range([height, 0]);
        });
    }

    private updateDomainOfDimensions() {
        this._dimensionScale.domain(this._dimensions);
    }

    get dimensionScale() {
        return this._dimensionScale;
    }

    get yScale() {
        return this._yScale;
    }

    get dimensions() {
        return this._dimensions;
    }

    public transition() {}

    public clear() {}
}

export default ParallelCoordinates;
