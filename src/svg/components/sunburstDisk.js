
export class SunburstDisk {
  constructor(xRadialAxis, yRadialAxis) {
    this.x = xRadialAxis;
    this.y = yRadialAxis;
    this.arcGen = d3.arc()
      .startAngle((d) => Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))))
      .endAngle((d) => Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))))
      .innerRadius((d) => Math.max(0, this.y(d.y0)))
      .outerRadius((d) => Math.max(0, this.y(d.y1)));
  }

  update(svg, config, data) {

    // Remove all the paths before redrawing
    this._removePaths(svg);

    // Create layout partition
    let partition = d3.partition();
    let root = d3.stratify()
      .id(function(d) { return d.id; })
      .parentId(function(d) { return d.parent; })
      (data);

    root.sum((d) =>  d.value);
    partition(root);

    // Draw the paths (arcs)
    let paths = svg.selectAll('path')
      .data(root.descendants())
      .enter().append('path')
      .attr('d', this.arcGen)
      .style('fill', (d) => {
        if (!d.parent) {
          return 'white';
        } else {
          return config.colorScale(d.data.label);
        }
      })
      .style('stroke', '#fff')
      .style('stroke-width', '2')
      .style('shape-rendering', 'crispEdge');

      // Create infobox
      let infobox = svg
        .append('g')
        .attr('class', 'infobox')
        .attr('pointer-events', 'none')
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'central')
        .style('fill', 'black');
      // Append central circle
      infobox.append('text')
        .attr('class', 'name')
        .attr('x', 0)
        .attr('y', 0)
        .attr('pointer-events', 'none')
        .style('font', '28px sans-serif');
      infobox.append('text')
        .attr('class', 'value')
        .attr('x', 0)
        .attr('y', 0)
        .attr('pointer-events', 'none')
        .style('font', '24px sans-serif')
        .style('transform', 'translate(0, 1.5em');


      paths // TODO extract events to config?
        .on('mouseover', (d) => {
          let ancestors = this._getAncestors(d);
          // Fade all the arcs
          if (ancestors.length > 0) {
            d3.selectAll('path')
                .style('opacity', 0.3);
          }
          d3.selectAll('path')
            .filter((node) => ancestors.indexOf(node) >= 0)
            .style('opacity', 1);
          // Hightlight the hovered arc
            svg.select('.infobox .name').text(d.data.label);
            svg.select('.infobox .value').text(d.value);
        })
        .on('mouseout', (d) => {
          d3.selectAll('path').style('opacity', 1);
          d3.select('.infobox .name').style('font-weight', 'normal');
          d3.select('.infobox .name').text('');
          d3.select('.infobox .value').text('');
        });

    // ???
    d3.select(self.frameElement).style('height', this.height + 'px');
  }

  /**
   * Removes all the paths (arcs). Doing this before each redraw prevents the
   * transition to mess up the arcs.
   * @private
   */
  _removePaths(svg) {
    svg.selectAll('path').remove();
  }

  /**
   * From: http://bl.ocks.org/kerryrodden/7090426
   * @param node
   * @returns {Array}
   * @private
   */
  _getAncestors(node) {
    let path = [];
    let current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  render(svg, config) {
    //Do nothing, since disk render only when new data is received.
  }
}
