export class TextIndicator { // TODO tidy
  constructor(config) {
    if (config === null) {
      throw new Error('No chart context specified for polarAxis');
    }

    this.translation = config.textIndicatorTranslation;
  }

  update(svg, value, label) {
    svg.select('.value')
      .text(value);
    svg.select('.label')
      .text(label);
  }

  render(svg, config) {
    let indicator = svg.append('g')
      .attr('class', 'text-indicator')
      .attr('pointer-events', 'none')
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'central');

    if (this.translation) {
      indicator.attr('transform', this.translation);
    }

    indicator.append('text')
      .attr('class', 'value')
      .attr('x', 0)
      .attr('y', 0)
      .attr('pointer-events', 'none')
      .text('0')
      .style('font', '48px Montserrat, sans-serif')
      .style('text-anchor', 'middle');

    indicator.append('text')
      .attr('class', 'label')
      .attr('x', 0)
      .attr('y', 0)
      .attr('pointer-events', 'none')
      .text('')
      .style('font', '24px Montserrat, sans-serif')
      .style('transform', 'translate(0, 1.5em')
      .style('text-anchor', 'middle');
  }
}