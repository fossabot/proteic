import { Data } from './../../data/Data';
import Config from '../../Config';
import Globals from '../../Globals';
import { simple2Linked } from '../../utils/data/transforming';
import Component from './Component';
import Zoomable from './Zoomable';

import {
    D3ZoomEvent,
    drag,
    event,
    Force,
    forceCenter,
    forceLink,
    forceManyBody,
    forceSimulation,
    nest,
    scaleLinear,
    select,
    selection,
    Simulation,
    SimulationLinkDatum,
    SimulationNodeDatum
} from 'd3';

class LinkedNodeset extends Component implements Zoomable {

    private simulation: any;
    private dragstarted: any;
    private dragged: any;
    private dragended: any;
    private linkedByIndex: any;
    private toggle: number = 0;

    constructor() {
        super();
    }

    public render() {
        let width: number = this.config.get('width');
        let height: number = this.config.get('height');

        this.simulation = forceSimulation()
            .force('link', forceLink().id((d: any) => d.id).distance(50))
            .force('charge', forceManyBody())
            .force('center', forceCenter(width / 2, height / 2));

        this.dragstarted = (d: SimulationNodeDatum) => {
            if (!event.active) { this.simulation.alphaTarget(0.3).restart(); }
            d.fx = d.x;
            d.fy = d.y;
        };

        this.dragged = (d: SimulationNodeDatum) => {
            d.fx = event['x'];
            d.fy = event['y'];
        };

        this.dragended = (d: SimulationNodeDatum) => {
            if (!event.active) { this.simulation.alphaTarget(1); }
            d.fx = null;
            d.fy = null;
        };

    }

    public update(data: Data) {
        let nodeRadius = this.config.get('nodeRadius');
        let colorScale = this.config.get('colorScale');
        let linkWeight = this.config.get('linkWeight');
        let nodeWeight = this.config.get('nodeWeight');
        let minLinkWeight = this.config.get('minLinkWeight');
        let maxLinkWeight = this.config.get('maxLinkWeight');
        let minNodeWeight = this.config.get('minNodeWeight');
        let maxNodeWeight = this.config.get('maxNodeWeight');
        let weighted = this.config.get('weighted');
        let linkScaleRadius = scaleLinear().domain([minLinkWeight, maxLinkWeight]).range([0, 3]);
        let nodeScaleRadius = scaleLinear().domain([minNodeWeight, maxNodeWeight]).range([0, 15]);
        let labelShow = this.config.get('labelShow');
        let labelField = this.config.get('labelField');
        let node: any = null;
        let link: any = null;
        let text: any = null;

        let linkedData = simple2Linked(data.originalDatum);

        this.svg.selectAll('g.links').remove();
        this.svg.selectAll('g.nodes').remove();
        this.svg.selectAll('g.labels').remove();

        link = this.svg.append('g')
            .attr('class', 'serie')
            .append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(linkedData.links)
            .enter()
            .append('line')
            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d.key)
            .attr('stroke-width', (d: any) => (weighted && d.weight) ? linkScaleRadius(d.weight) : linkWeight)
            .attr('stroke', '#999')
            .attr('stroke-opacity', 1);

        node = this.svg.select('g.serie').append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(linkedData.nodes)
            .enter()
            .append('circle')
            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d.key)
            .attr('r', (d: any) => (weighted && d.weight) ? nodeScaleRadius(d.weight) : nodeWeight)
            .attr('fill', (d: any) => colorScale(d.key))
            .attr('stroke', 'white')
            .call(drag()
                .on('start', this.dragstarted)
                .on('drag', this.dragged)
                .on('end', this.dragended));

        let chart = this;
        node

            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));

        if (labelShow) {
            text = this.svg.select('g.serie').append('g')
                .attr('class', 'labels')
                .selectAll('text')
                .data(linkedData.nodes)
                .enter()
                .append('text')
                .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d.key)
                .attr('dx', 10)
                .attr('dy', '.35em')
                .attr('font-size', '.85em')
                .text(typeof labelField === 'string' ? (d: any) => d[labelField] : labelField)
                .on('mousedown.user', this.config.get('onDown'))
                .on('mouseup.user', this.config.get('onUp'))
                .on('mouseleave.user', this.config.get('onLeave'))
                .on('mouseover.user', this.config.get('onHover'))
                .on('click.user', this.config.get('onClick'));
        }
        this.simulation.nodes(linkedData.nodes).on('tick', () => labelShow
            ? this.tickedWithText(link, node, text)
            : this.ticked(link, node));

        this.simulation.force('link').links(linkedData.links);

    }
    private tickedWithText(link: any, node: any, text: any) {
        this.ticked(link, node);
        text
            .attr('x', (d: any) => d.x)
            .attr('y', (d: any) => d.y);
    }

    private ticked(link: any, node: any) {
        link
            .attr('x1', (d: any) => d.source.x)
            .attr('y1', (d: any) => d.source.y)
            .attr('x2', (d: any) => d.target.x)
            .attr('y2', (d: any) => d.target.y);

        node
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y);
    }

    public zoom(event: D3ZoomEvent<any, any>) {
        let transform: any = event.transform;

        this.svg.selectAll('.nodes circle').attr('transform', transform);
        this.svg.selectAll('.links line').attr('transform', transform);
        this.svg.selectAll('.labels text').attr('transform', transform);
    }

    public clear() {
        this.svg.selectAll('.nodes').remove();
        this.svg.selectAll('.links').remove();
        this.svg.selectAll('.labels').remove();
    }

    public transition() {
        // console.warn('No transition effects for ', this.constructor.name);
    }

}

export default LinkedNodeset;
