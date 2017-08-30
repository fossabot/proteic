import Component from './Component';
import {
    map,
    scaleLinear,
    scalePoint,
    axisLeft,
    Axis,
    extent,
    select
} from 'd3';

class ParallelCoordinates extends Component {

    private _parallelDimensions: any;
    private _parallelAxes: any;
    private _yAxes: any;

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

        let dimensions: string[] = Object.keys(data[0]).filter((dimension) => dimension != propertyKey);

        this.updateDomainOfDimensions(dimensions);
        this.updateYaxesByDimensions(dimensions, data, height);

        let dimensionEntries = this.svg.selectAll('.dimension')
                                    .data(dimensions)
                                    .enter()
                                    .append('g')
                                    .attr('class', 'dimension')
                                    .attr('transform', (d) => 'translate(' + this._parallelDimensions(d) + ')');
        let thisInstance = this;
        dimensionEntries.append('g')
                    .attr('class', 'axis')
                    .each(function(d) {
                        select(this)
                            .call(thisInstance._parallelAxes.scale(thisInstance._yAxes[d]));
                    });

                dimensionEntries.append('text')
                        .style('text-anchor', 'middle')
                        .style('font-size', '10px')
                        .attr('y', -9)
                        .text((d) => d);
    }

    private initializeParallelCoordinates(width: number, height: number) {
        this._parallelDimensions = scalePoint().range([0, width]);
        this._parallelAxes = axisLeft(scaleLinear().range([height, 0]));
        this._yAxes = {};
    }

    private updateYaxesByDimensions(dimensions: string[], data: [any], height: number) {
        dimensions.map((dimension) => {
            this._yAxes[dimension] = scaleLinear()
                                        .domain(extent(data, (d) => +d[dimension]))
                                        .range([height, 0])
        });
    }

    private updateDomainOfDimensions(dimensions: string[]) {
        this._parallelDimensions.domain(dimensions);
    }

    public transition() {}

    public clear() {}
}

export default ParallelCoordinates;
