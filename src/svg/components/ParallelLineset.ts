import Component from './Component';
import ParallelCoordinates from './ParallelCoordinates';
import Globals from '../../Globals';
import {
    map,
    Line,
    line,
    easeLinear
} from 'd3';

class ParallelLineset extends Component {

    private lineGenerator: Line<any>;
    private parallelCoordinates: ParallelCoordinates;

    constructor(parallelCoordinates: ParallelCoordinates) {
        super();
        this.parallelCoordinates = parallelCoordinates;

        this.lineGenerator = line();
    }

    public render() {
        this.svg.append('g').attr('class', 'parallelLine');
    }

    public update(data: [any]) {
        let legend = this.config.get('legend'),
            propertyKey = this.config.get('propertyKey'),
            colorScale = this.config.get('colorScale');

        let serie = this.svg.select('g.parallelLine').selectAll('g.lineSeries');
        let lines = serie.data(data);

        this.elementEnter = lines.enter()
                            .append('g')
                            .attr('class', 'lineSeries')
                            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d[propertyKey]);

        this.elementEnter
            .append('g')
            .attr('class', 'background')
            .append('svg:path')
            .attr('fill', 'none')
            .style('stroke-width', 1.5)
            .attr('stroke', '#ddd')
            .attr('d', (d: any) => this.path(d))
            .attr('class', 'back-line');

        this.elementEnter
            .append('g')
            .attr('class', 'foreground')
            .append('svg:path')
            .attr('fill', 'none')
            .attr('stroke', (d: any, i: number) => legend == true
                ? colorScale(d[propertyKey])
                : 'steelblue'
            )
            .style('stroke-width', 1.5)
            .attr('d', (d: any) => this.path(d))
            .attr('class', 'front-line');

        this.elementExit = lines.exit().remove();

        this.elementUpdate = this.svg.selectAll('.front-line')
                                    .data(data)
                                    .attr('d', (d: any) => this.path(d));

        this.elementUpdate = this.svg.selectAll('.back-line')
                                    .data(data)
                                    .attr('d', (d: any) => this.path(d));

    }

    public path(d: any) {
        let dimensions = this.parallelCoordinates.dimensions;

        return this.lineGenerator(dimensions.map((dimension) =>
                        [this.parallelCoordinates.dimensionPosition(dimension),
                        this.parallelCoordinates.yPosition(dimension, d)]
                    ));
    }

    public transition() {
        this.elementUpdate
            .transition()
            .duration(Globals.COMPONENT_ANIMATION_TIME)
            .ease(easeLinear);

        this.elementEnter
            .transition()
            .duration(Globals.COMPONENT_ANIMATION_TIME)
            .ease(easeLinear);

        this.elementExit
            .transition()
            .duration(Globals.COMPONENT_ANIMATION_TIME);
    }

    public clear() {}
}

export default ParallelLineset;
