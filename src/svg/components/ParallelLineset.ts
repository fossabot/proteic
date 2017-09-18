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
    }

    public render() {
        this.svg.append('g').attr('class', 'parallelLine');

        this.lineGenerator = line();

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
                            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d[propertyKey])
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
                            .attr('class', 'line');

        this.elementExit = lines.exit().remove();

        this.elementUpdate = this.svg.selectAll('.line')
                                    .data(data)
                                    .attr('d', (d: any) => this.path(d));

    }

    private path(d: any) {
        let dimensions = this.parallelCoordinates.dimensions,
            dimensionScale = this.parallelCoordinates.dimensionScale,
            yScale = this.parallelCoordinates.yScale;

        return this.lineGenerator(dimensions.map((dimension) =>
                        [dimensionScale(dimension), yScale[dimension](d[dimension])]
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
