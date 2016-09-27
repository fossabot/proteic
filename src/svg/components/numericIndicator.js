export class NumericIndicator { // TODO tidy
  constructor(config) {
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
  }

  update(svg, config, data, method) {
    let datum = data[data.length - 1];

    svg.select('.text-indicator')
      .text(datum.x);
  }

  render(svg, config) {
    svg.append('text')
      .attr('class', 'text-indicator')
      .attr('transform', this.translation)
      .attr('x', 0)
      .attr('y', 100)
      .text('0')
      .style('font-family', 'sans-serif')
      .style('font-size', '48px')
      .style('text-anchor', 'middle');
  }
}