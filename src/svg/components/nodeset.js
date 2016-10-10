import {forceSimulation, forceLink, forceManyBody, forceCenter, drag} from 'd3';
import {simple2Linked} from '../../utils/dataTransformation';
import {event} from 'd3';
export class Nodeset {
  constructor(config) {
    this.config = config;
    var width = config.width,
      height = config.height;

    this.simulation = forceSimulation()
      .force("link", forceLink().id((d) => d.id))
      .force("charge", forceManyBody())
      .force("center", forceCenter(width / 2, height / 2));


    this.dragstarted = (d) => {
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    this.dragged = (d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    this.dragended = (d) => {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

  }

  update(svg, config, data) {
    data = simple2Linked(data);

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke-width", 2)
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6);

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => "#23436f")
      .call(drag()
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended));

    node.append("title")
      .text((d) => d.id);

    this.simulation.nodes(data.nodes).on("tick", (e) => this.ticked(link, node));

    this.simulation.force("link").links(data.links);
  }

  ticked(link, node) {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  }

  render(svg, config) {
    //Do nothing, since lines render only when new data is received.
  }
}