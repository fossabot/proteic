import Component from './Component';
import Config from '../../Config';
import { simple2Linked } from '../../utils/dataTransformation';

import {
    drag,
    event,
    selection,
    nest,
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    Simulation,
    SimulationNodeDatum,
    SimulationLinkDatum,
    Force
} from 'd3';

class LinkedNodeset extends Component {

    //private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;
    private simulation: any;

    private dragstarted: any;
    private dragged: any;
    private dragended: any;


    constructor() {
        super();
    }

    public render() {
        let width: number = this.config.get('width'),
            height: number = this.config.get('height');

        this.simulation = forceSimulation()
            .force("link", forceLink().id((d: any) => d.id))
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
            colorScale = this.config.get('colorScale');

        data = simple2Linked(data);


        var link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width",  nodeRadius / 10)
            .attr("stroke", "#999")
            .attr("stroke-opacity", 1);

        var node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("r", nodeRadius)
            .attr("fill", (d: any) => colorScale(d.key))
            .call(drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

        node
            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));


        this.simulation.nodes(data.nodes).on("tick", () => this.ticked(link, node));

        this.simulation.force("link").links(data.links);
    }

    private ticked(link: any, node: any) {
        link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

        node
            .attr("cx", (d: any) => d.x)
            .attr("cy", (d: any) => d.y);
    }

}

export default LinkedNodeset;