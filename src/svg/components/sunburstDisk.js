import {partition, stratify, arc} from 'd3';


export class SunburstDisk {
  constructor(xRadialAxis, yRadialAxis) {
    this.x = xRadialAxis;
    this.y = yRadialAxis;
    this.arcGen = arc()
      .startAngle((d) => Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))))
      .endAngle((d) => Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))))
      .innerRadius((d) => Math.max(0, this.y(d.y0)))
      .outerRadius((d) => Math.max(0, this.y(d.y1)));
  }

  update(svg, config, data) {

    // Remove all the paths before redrawing
    this._removePaths(svg);

    // Create layout partition
    let root = stratify()
      .id(function(d) { return d.id; })
      .parentId(function(d) { return d.parent; })
      (data);

    root.sum((d) =>  d.value);
    partition()(root);

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

      paths // TODO extract events to config?
        .on('mouseover', (d) => {
          let ancestors = this._getAncestors(d);
          // Fade all the arcs
          if (ancestors.length > 0) {
            svg.selectAll('path')
                .style('opacity', 0.3);
          }
          svg.selectAll('path')
            .filter((node) => ancestors.indexOf(node) >= 0)
            .style('opacity', 1);
          // Hightlight the hovered arc
            svg.select('.text-indicator .label').text(d.data.label);
            svg.select('.text-indicator .value').text(d.value);
        })
        .on('mouseout', (d) => {
          svg.selectAll('path').style('opacity', 1);
          svg.select('.text-indicator .label').style('font-weight', 'normal');
          svg.select('.text-indicator .label').text('');
          svg.select('.text-indicator .value').text('');
        })
      ;

    // ???
    svg.select(self.frameElement).style('height', this.height + 'px');
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
