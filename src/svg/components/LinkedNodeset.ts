import Component from './Component';
import Config from '../../Config';
import { simple2Linked } from '../../utils/dataTransformation';

import {
    drag,
    event,
    selection,
    select,
    nest,
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    Simulation,
    SimulationNodeDatum,
    SimulationLinkDatum,
    Force,
    scaleLinear
} from 'd3';

class LinkedNodeset extends Component {

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
        let width: number = this.config.get('width'),
            height: number = this.config.get('height');

        this.simulation = forceSimulation()
            .force("link", forceLink().id((d: any) => d.id).distance(50))
            .force("charge", forceManyBody())
            .force("center", forceCenter(width / 2, height / 2));

        this.dragstarted = (d: SimulationNodeDatum) => {
            if (!event.active) this.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        this.dragged = (d: SimulationNodeDatum) => {
            d.fx = event['x'];
            d.fy = event['y'];
        };

        this.dragended = (d: SimulationNodeDatum) => {
            if (!event.active) this.simulation.alphaTarget(1);
            d.fx = null;
            d.fy = null;
        };

    }

    public update(data: any) {
        let nodeRadius = this.config.get('nodeRadius'),
            colorScale = this.config.get('colorScale'),
            linkWeight = this.config.get('linkWeight'),
            nodeWeight = this.config.get('nodeWeight'),
            minLinkWeight = this.config.get('minLinkWeight'),
            maxLinkWeight = this.config.get('maxLinkWeight'),
            minNodeWeight = this.config.get('minNodeWeight'),
            maxNodeWeight = this.config.get('maxNodeWeight'),
            weighted = this.config.get('weighted'),
            linkScaleRadius = scaleLinear().domain([minLinkWeight, maxLinkWeight]).range([0, 3]),
            nodeScaleRadius = scaleLinear().domain([minNodeWeight, maxNodeWeight]).range([0, 15]),
            labelShow = this.config.get('labelShow'),
            labelField = this.config.get('labelField'),
            node: any = null,
            link: any = null,
            text: any = null;
        //Transform data
        data = simple2Linked(data);

        console.log('labelshow', labelShow, 'labelField', labelField, typeof labelField);

        link = this.svg.append('g')
            .attr('class', 'serie')
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width", (d: any) => (weighted && d.weight) ? linkScaleRadius(d.weight) : linkWeight)
            .attr("stroke", "#999")
            .attr("stroke-opacity", 1);

        node = this.svg.select('g.serie').append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("data-key", (d: any) => d.key)
            .attr("r", (d: any) => (weighted && d.weight) ? nodeScaleRadius(d.weight) : nodeWeight)
            .attr("fill", (d: any) => colorScale(d.key))
            .attr("stroke", "white")
            .call(drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

        let chart = this;
        node
            //   .on('dblclick.default', function() {
            //      chart.connectedNodes(this, node, link);
            // })
            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));

        //Append node labels
        text = this.svg.select('g.serie').append("g")
            .attr("class", "labels")
            .selectAll('text')
            .data(data.nodes)
            .enter()
            .append('text')
            .attr('dx', 10)
            .attr('dy', '.35em')
            .attr('font-size', '.85em')
            .text(typeof labelField === 'string' ? (d: any) => d[labelField] : labelField);

        this.simulation.nodes(data.nodes).on("tick", () => this.ticked(link, node, text));
        this.simulation.force("link").links(data.links);

    }

    private ticked(link: any, node: any, text: any) {
        link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

        node
            .attr("cx", (d: any) => d.x)
            .attr("cy", (d: any) => d.y);

        text
            .attr('x', (d: any) => d.x)
            .attr('y', (d: any) => d.y);
    }

}

export default LinkedNodeset;