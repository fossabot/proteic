import Component from './Component';
import ParallelCoordinates from './ParallelCoordinates';
import {
    map,
    Line,
    line
} from 'd3';

class ParallelLineset extends Component {

    private lineGenerator: Line<any>;
    private parallelCoordinates: ParallelCoordinates;

    constructor(parallelCoordinates: ParallelCoordinates) {
        super();
        this.parallelCoordinates = parallelCoordinates;
    }

    public render() {
        this.svg.append('g').attr('class', 'parallelLine');
        
        this.lineGenerator = line();
    }

    public update(data: [any]) {
        this.svg.select('.parallelLine')
                    .append('g')
                    .attr('class', 'foreground')
                    .selectAll('.foreground')
                    .data(data)
                    .enter().append('svg:path')
                    .attr('fill', 'none')
                    .attr('stroke', 'steelblue')
                    .attr('d', (d: any) => this.path(d))
                    .attr('class', 'line');
    }

    private path(d: any) {
        let dimensions = this.parallelCoordinates.dimensions,
            dimensionScale = this.parallelCoordinates.dimensionScale,
            yScale = this.parallelCoordinates.yScale;

        return this.lineGenerator(dimensions.map((dimension) =>
                        [dimensionScale(dimension), yScale[dimension](d[dimension])]
                    ));
    }

    public transition() {}

    public clear() {}
}

export default ParallelLineset;
