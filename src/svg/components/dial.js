import {deg2rad} from '../../utils/functions'

export class Dial { // TODO tidy
  constructor(axisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for polarAxis');
    }

    this.r = (
      (config.width > config.height)
        ? config.height
        : config.width
      ) / 2;
    this.translation = (() =>
    'translate(' + this.r + ',' + this.r + ')'
    );
    config.colorScale.domain([0, 1]);

    this.scale = d3.scaleLinear()
        .domain([config.minLevel, config.maxLevel])
        .range([0, 1]);

    this.scaleMarks = this.scale.ticks(config.ticks);

    this.range = config.maxAngle - config.minAngle;

    this.arc = d3.arc()
      .innerRadius(this.r - config.ringWidth - config.ringMargin)
      .outerRadius(this.r - config.ringMargin)
      .startAngle((d, i) => {
        var ratio = d * i;
        return deg2rad(config.minAngle + (ratio * this.range));
      })
      .endAngle((d, i) => {
        var ratio = d * (i + 1);
        return deg2rad(config.minAngle + (ratio * this.range));
      });

    this.tickData = d3.range(config.ticks)
      .map(() => 1 / config.ticks);
  }

  render(svg, config) {
    let labels = null;

    // Append the ring
    let arcs = svg.append('g')
      .attr('class', 'arc')
      .attr('transform', this.translation);

    // Append the ring sectors
    let arcPaths = arcs.selectAll('path')
      .data(this.tickData)
      .enter().append('path')
      // ID for textPath linking
      .attr('id', (d, i) => 'sector-' + i)
      .attr('d', this.arc);

    // Fill colors
    if (config.invertColorScale) {
      arcPaths.attr('fill', (d, i) => config.colorScale(1 - d * i));
    } else {
      arcPaths.attr('fill', (d, i) => config.colorScale(d * i));
    }

    // Apend the scale labels
    labels = svg.append('g')
      .attr('class', 'labels')
      .attr('transform', this.translation);

    // // Append scale marker labels
    labels.selectAll('text')
      .data(this.scaleMarks)
      .enter().append('text')
      .attr('transform', (d) => {
        let ratio = this.scale(d);
        let newAngle = config.minAngle + (ratio * this.range);
        return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - this.r) + ')';
      })
      .text((d) => d)
      .style('text-anchor', 'middle')
      .style('font', '18px Montserrat, sans-serif');
  }
}