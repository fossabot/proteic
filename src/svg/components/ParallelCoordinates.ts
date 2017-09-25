import Component from './Component';
import Globals from '../../Globals';
import ParallelLineset from '../components/ParallelLineset';
import {
    map,
    scaleLinear,
    scalePoint,
    axisLeft,
    Axis,
    extent,
    select,
    Line,
    line,
    drag,
    event,
    min,
    max
} from 'd3';

class ParallelCoordinates extends Component {

    private _dimensionScale: any;
    private _yScale: any;
    private _dimensions: string[];
    private parallelAxes: any;
    private lineGenerator: Line<any>;
    private dragEventPositions: any;

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
        this.dragEventPositions = {};

        let thisInstance = this;    // To use instance method in selection event

        let dimensionEntries = this.svg.selectAll('.dimension')
                                    .data(this._dimensions)
                                    .enter()
                                    .append('g')
                                    .attr('class', 'dimension')
                                    .attr('transform', (d) => 'translate(' + this._dimensionScale(d) + ')')
                                    .each(function(d) {
                                        select(this)
                                            .call(drag()
                                                .on('start', (dimension) => thisInstance.startDrag(d))
                                                .on('drag', (dimension) => thisInstance.dragging(d))
                                                .on('end', (dimension) => thisInstance.endDrag(d, this))
                                            );
                                    });

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
                .style('cursor', 'move')
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

    get draggedPosition() {
        return this.dragEventPositions;
    }

    public transition() {}

    public clear() {}

    public dimensionPosition(dimension: any) {
        let position = (this.dragEventPositions[dimension] == null)
                        ? this._dimensionScale(dimension)
                        : this.dragEventPositions[dimension];

        return position;
    }

    private updateParallelLine() {
        let parallelLineInstance = new ParallelLineset(this);

        this.svg.selectAll('.foreground path')
                .attr('d', (d: any) => parallelLineInstance.path(d));

        this.svg.selectAll('.background path')
                .attr('d', (d: any) => parallelLineInstance.path(d));
    }

    // TODO we will separate drag component later

    private startDrag(dimension: any) {
        this.svg.selectAll('.background')
                .attr('visibility', 'hidden');
    }

    private dragging(dimension: any) {
        let width = this.config.get('width');

        this.dragEventPositions[dimension] = Math.min(width, Math.max(0, event.x));

        this.updateParallelLine();

        this._dimensions.sort((a, b) => this.dimensionPosition(a) - this.dimensionPosition(b));
        this.updateDomainOfDimensions();
        this.svg.selectAll('.dimension')
                .attr('transform', (d) => 'translate(' + this.dimensionPosition(d) + ')');
    }

    private endDrag(dimension: any, element: any) {
        delete this.dragEventPositions[dimension];

        element.setAttribute('transform', 'translate(' + this._dimensionScale(dimension) + ')');

        this.updateParallelLine();

        this.svg.selectAll('.background')
                .attr('visibility', null);
    }

}

export default ParallelCoordinates;
