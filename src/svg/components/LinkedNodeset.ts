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
            nodeScaleRadius = scaleLinear().domain([minNodeWeight, maxNodeWeight]).range([0, 15]);

        //Transform data
        data = simple2Linked(data);
        this.linkedByIndex = {};

        for (let i = 0; i < data.nodes.length; i++) {
            this.linkedByIndex[i + "," + i] = 1;
        };


        console.log(data.links);
        for (let i = 0; i < data.links.length; i++) {
            let d = data.links[i];
            console.log(d.source, d.target);

            this.linkedByIndex[d.source.index + "," + d.target.index] = 1
        }


        console.log(this.linkedByIndex);

        let link = this.svg.append('g')
            .attr('class', 'serie')
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width", (d: any) => (weighted && d.weight) ? linkScaleRadius(d.weight) : linkWeight)
            .attr("stroke", "#999")
            .attr("stroke-opacity", 1);

        var node = this.svg.select('g.serie').append("g")
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
            .on('dblclick.default', function () {
                chart.connectedNodes(this, node, link);
            })
            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));


        this.simulation.nodes(data.nodes).on("tick", () => this.ticked(link, node));
        this.simulation.force("link").links(data.links);
    }


    private neighboring(a: any, b: any) {
        return this.linkedByIndex[a.index + "," + b.index];
    }


    private connectedNodes(ctx: any, nodes: any, links: any) {
        if (this.toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes
            let d = select(ctx).node().__data__;
            nodes.style("opacity", (o: any) => {
                console.log(d.index, o.index, this.neighboring(d, o), this.neighboring(o, d));
                return this.neighboring(d, o) || this.neighboring(o, d) ? 1 : 0.1;
            });

            links.style("opacity", (o: any) => {
                return d.index == o.source.index || d.index == o.target.index ? 1 : 0.1;
            });
            //Reduce the op
            this.toggle = 1;
        } else {
            //Put them back to opacity=1
            nodes.style("opacity", 1);
            links.style("opacity", 1);
            this.toggle = 0;
        }

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