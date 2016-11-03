import {deg2rad} from '../../utils/functions';
import {scaleLinear, arc, range} from 'd3';

export class DialNeedle { // TODO tidy
  constructor(axisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for polarAxis');
    }

    this.r = (
      (config.width > config.height) ?
        config.height : config.width
      ) / 2;

    this.needleLen = config.needleLenghtRatio * (this.r);

    this.translation = (() =>
    'translate(' + this.r + ',' + this.r + ')'
    );
    config.colorScale.domain([0, 1]);

    this.scale = scaleLinear()
        .domain([config.minLevel, config.maxLevel])
        .range([0, 1]);

    this.angleScale = scaleLinear()
      .domain([config.minLevel, config.maxLevel])
      .range([90 + config.minAngle, 90 + config.maxAngle]);

    this.scaleMarks = this.scale.ticks(config.ticks);

    this.range = config.maxAngle - config.minAngle;

    this.arc = arc()
      .innerRadius(this.r - config.ringWidth - config.ringMargin)
      .outerRadius(this.r - config.ringMargin)
      .startAngle((d, i) => {
        let ratio = d * i;
        return deg2rad(config.minAngle + (ratio * this.range));
      })
      .endAngle((d, i) => {
        let ratio = d * (i + 1);
        return deg2rad(config.minAngle + (ratio * this.range));
      });

    this.tickData = range(config.ticks)
      .map(() => 1 / config.ticks);
  }

  update(svg, config, data, method) {
    let datum = data[data.length - 1];

    this.needle
      .transition()
      .attr('transform', (d) => `translate(${this.r}, ${this.r}) rotate(${this.angleScale(datum.value) - 90})`)
      .attr('d', `M ${0 - config.needleNutRadius} ${0} L ${0} ${0 - this.needleLen} L ${config.needleNutRadius} ${0}`);
  }

  render(svg, config) {
    // Update the needle
    this.needle = svg.append('path')
      .attr('class', 'needle')
      .datum(0)
      .attr('transform', (d) => `translate(${this.r}, ${this.r}) rotate(${this.angleScale(d) - 90})`)
      .attr('d', `M ${0 - config.needleNutRadius} ${0} L ${0} ${0 - this.needleLen} L ${config.needleNutRadius} ${0}`)
      .style('fill', '#666666');

    // Append needle nut
    svg.append('circle')
      .attr('class', 'needle')
      .attr('transform', this.translation)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', config.needleNutRadius)
      .style('fill', '#666666');
  }

}